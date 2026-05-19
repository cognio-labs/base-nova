"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState, useSyncExternalStore, type Dispatch, type KeyboardEvent as ReactKeyboardEvent, type SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import {
  ArrowUp,
  Braces,
  Check,
  ChevronDown,
  Code2,
  Expand,
  Eye,
  FileUp,
  Loader2,
  Mic,
  RefreshCcw,
  Share2,
  Sparkles,
  Upload,
} from "lucide-react";

import PreviewFrame from "@/components/PreviewFrame";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGeneratorStore } from "@/lib/store";
import { clearPendingBuilderPrompt, readPendingBuilderPrompt } from "@/lib/builder-session";
import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

type SpeechRecognitionResultEvent = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
};

type SpeechRecognitionInstance = {
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  start: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type SpeechRecognitionWindow = Window &
  typeof globalThis & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

const CHAT_STORAGE_KEY = "lokoai.builder.chat.v1";
const CHAT_STORAGE_EVENT = "lokoai.builder.chat.sync";
const EMPTY_CHAT_MESSAGES: ChatMessage[] = [];

let cachedChatStorageValue: string | null | undefined;
let cachedChatMessages: ChatMessage[] = EMPTY_CHAT_MESSAGES;

type DeviceMode = "desktop" | "tablet" | "mobile";

type BuildMode = "App" | "Landing" | "Dashboard";

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function readStoredChatMessages(): ChatMessage[] {
  if (typeof window === "undefined") {
    return EMPTY_CHAT_MESSAGES;
  }

  const storedValue = window.localStorage.getItem(CHAT_STORAGE_KEY);
  if (storedValue === cachedChatStorageValue) {
    return cachedChatMessages;
  }

  cachedChatStorageValue = storedValue;
  const parsed = safeJsonParse<ChatMessage[]>(storedValue);
  cachedChatMessages = Array.isArray(parsed) ? parsed : EMPTY_CHAT_MESSAGES;
  return cachedChatMessages;
}

function getServerStoredChatMessages(): ChatMessage[] {
  return EMPTY_CHAT_MESSAGES;
}

function writeStoredChatMessages(messages: ChatMessage[]) {
  cachedChatMessages = messages;
  cachedChatStorageValue = JSON.stringify(messages);

  try {
    window.localStorage.setItem(CHAT_STORAGE_KEY, cachedChatStorageValue);
  } catch {
    // ignore quota errors
  }

  window.dispatchEvent(new Event(CHAT_STORAGE_EVENT));
}

function subscribeToStoredChatMessages(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === CHAT_STORAGE_KEY) {
      cachedChatStorageValue = undefined;
      onStoreChange();
    }
  };

  const handleCustomEvent = () => {
    cachedChatStorageValue = undefined;
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHAT_STORAGE_EVENT, handleCustomEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHAT_STORAGE_EVENT, handleCustomEvent);
  };
}

function useLocalStorageChat(): [ChatMessage[], Dispatch<SetStateAction<ChatMessage[]>>] {
  const messages = useSyncExternalStore(
    subscribeToStoredChatMessages,
    readStoredChatMessages,
    getServerStoredChatMessages
  );

  const setMessages: Dispatch<SetStateAction<ChatMessage[]>> = (value) => {
    const currentMessages = readStoredChatMessages();
    const nextMessages =
      typeof value === "function"
        ? (value as (current: ChatMessage[]) => ChatMessage[])(currentMessages)
        : value;

    writeStoredChatMessages(nextMessages);
  };

  return [messages, setMessages];
}

function formatShortcut(shortcut: string) {
  return shortcut;
}

export default function BuilderWorkspace() {
  const {
    generateProject,
    isGenerating,
    error,
    workflowLogs,
    activeAgentIndex,
    view,
    setView,
    generatedFiles,
    activeFilePath,
    openFile,
    updateFileContent,
    getFileContent,
  } = useGeneratorStore();

  const [messages, setMessages] = useLocalStorageChat();
  const [draft, setDraft] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [buildMode, setBuildMode] = useState<BuildMode>("App");
  const [isVisualMode, setIsVisualMode] = useState(false);
  const [isDropActive, setIsDropActive] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const streamTimerRef = useRef<number | null>(null);
  const pendingPromptRef = useRef(false);

  const suggestions = useMemo(
    () => [
      {
        label: "Landing page",
        text: "Build a premium landing page with hero, features, testimonials, pricing, FAQ, and a conversion-focused CTA. Use a clean white and soft-blue product aesthetic.",
        shortcut: "Ctrl+1",
      },
      {
        label: "Dashboard app",
        text: "Create a modern SaaS dashboard with sidebar navigation, analytics cards, charts, table views, filters, and settings. Use shadcn/ui + Tailwind + Framer Motion.",
        shortcut: "Ctrl+2",
      },
      {
        label: "E-commerce",
        text: "Design an e-commerce storefront with product grid, filters, product page, cart drawer, and checkout CTA. Keep it responsive and fast.",
        shortcut: "Ctrl+3",
      },
    ],
    []
  );

  const filesForEditor = useMemo(() => {
    if (!generatedFiles?.length) return [] as { path: string; title: string }[];
    return generatedFiles.map((f) => ({ path: f.path, title: f.path.split("/").pop() || f.path }));
  }, [generatedFiles]);

  const activePath = activeFilePath ?? filesForEditor[0]?.path ?? null;
  const activeLanguage = useMemo(() => {
    if (!activePath) return "plaintext";
    if (activePath.endsWith(".tsx") || activePath.endsWith(".ts")) return "typescript";
    if (activePath.endsWith(".js")) return "javascript";
    if (activePath.endsWith(".css")) return "css";
    if (activePath.endsWith(".json")) return "json";
    if (activePath.endsWith(".html")) return "html";
    if (activePath.endsWith(".md")) return "markdown";
    return "plaintext";
  }, [activePath]);

  const previewWidthClass = useMemo(() => {
    if (deviceMode === "mobile") return "w-[420px] max-w-[90vw]";
    if (deviceMode === "tablet") return "w-[820px] max-w-[92vw]";
    return "w-full";
  }, [deviceMode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isGenerating]);

  const syncComposerHeight = useEffectEvent(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, 112), 188);
    textarea.style.height = `${nextHeight}px`;
  });

  useEffect(() => {
    syncComposerHeight();
  }, [draft]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "1") {
        e.preventDefault();
        setDraft(suggestions[0]?.text ?? "");
      }
      if (e.ctrlKey && e.key === "2") {
        e.preventDefault();
        setDraft(suggestions[1]?.text ?? "");
      }
      if (e.ctrlKey && e.key === "3") {
        e.preventDefault();
        setDraft(suggestions[2]?.text ?? "");
      }
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen, suggestions]);

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) {
        window.clearInterval(streamTimerRef.current);
      }
    };
  }, []);

  const startVoiceInput = () => {
    const speechWindow = window as SpeechRecognitionWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new Recognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDraft((prev) => prev + (prev ? " " : "") + transcript);
    };

    recognition.start();
  };

  const pushMessage = (msg: Omit<ChatMessage, "id" | "createdAt"> & { id?: string; createdAt?: number }) => {
    const id = msg.id ?? `${msg.role}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const createdAt = msg.createdAt ?? Date.now();
    setMessages((current) => [...current, { id, role: msg.role, content: msg.content, createdAt }]);
    return id;
  };

  const updateMessage = (id: string, content: string) => {
    setMessages((current) => current.map((message) => (message.id === id ? { ...message, content } : message)));
  };

  const streamMessage = (id: string, fullText: string) => {
    if (streamTimerRef.current) {
      window.clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }

    let i = 0;
    streamTimerRef.current = window.setInterval(() => {
      i += Math.max(1, Math.floor(fullText.length / 120));
      updateMessage(id, fullText.slice(0, i));
      if (i >= fullText.length) {
        if (streamTimerRef.current) window.clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }
    }, 18);
  };

  const sendPrompt = async (promptText: string, nextBuildMode: BuildMode = buildMode) => {
    const trimmedPrompt = promptText.trim();
    if (!trimmedPrompt || isGenerating) {
      return;
    }

    setDraft("");
    setView("preview");

    pushMessage({ role: "user", content: trimmedPrompt });

    const assistantId = pushMessage({
      role: "assistant",
      content: "Thinking...",
    });

    await generateProject(`${trimmedPrompt}\n\nBuild mode: ${nextBuildMode}.`);

    const nextError = useGeneratorStore.getState().error;
    if (nextError) {
      updateMessage(assistantId, `I hit an error while generating:\n\n${nextError}`);
      return;
    }

    const title = useGeneratorStore.getState().projectTitle || "your project";
    const fileCount = useGeneratorStore.getState().generatedFiles?.length ?? 0;

    const responseText =
      `Done. I generated ${fileCount} file${fileCount === 1 ? "" : "s"} for ${title}.\n` +
      `The live preview is updated on the right. Use Preview/Code to inspect or edit, and hit Refresh if the iframe needs a hard reload.`;

    streamMessage(assistantId, responseText);
  };

  const handleSend = async (nextPrompt = draft) => {
    await sendPrompt(nextPrompt, buildMode);
  };

  const sendPendingPrompt = useEffectEvent((pendingPrompt: string, nextBuildMode: BuildMode) => {
    void sendPrompt(pendingPrompt, nextBuildMode);
  });

  useEffect(() => {
    if (pendingPromptRef.current || isGenerating) {
      return;
    }

    const pendingPrompt = readPendingBuilderPrompt();
    if (!pendingPrompt) {
      return;
    }

    pendingPromptRef.current = true;
    clearPendingBuilderPrompt();

    const timeoutId = window.setTimeout(() => {
      sendPendingPrompt(pendingPrompt, buildMode);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [buildMode, isGenerating]);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUpload = (file: File | null) => {
    if (!file) return;
    pushMessage({ role: "assistant", content: `Attached: ${file.name} (upload pipeline not wired yet).` });
  };

  const clearChat = () => {
    setMessages([]);
  };

  const activeEditorValue = activePath ? getFileContent(activePath) : "";

  const shellStyle = {
    fontFamily: '"Inter", "Geist", ui-sans-serif, system-ui, sans-serif',
  };

  const glassPanel =
    "border border-white/55 bg-white/72 backdrop-blur-2xl shadow-[0_28px_90px_-46px_rgba(37,99,235,0.26)]";
  const softPill =
    "inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/72 px-3.5 py-2 text-[11px] font-semibold text-slate-600 transition duration-200 hover:border-sky-200/80 hover:bg-white/90 hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:bg-white/[0.08]";
  const toolbarPill =
    "inline-flex items-center gap-2 rounded-full border border-white/65 bg-white/82 px-4 py-2 text-[11px] font-semibold text-slate-600 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.4)] transition duration-200 hover:-translate-y-0.5 hover:border-sky-200/80 hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:bg-white/[0.08]";

  return (
    <div
      className="h-[calc(100dvh-5rem)] w-full overflow-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_100%)] text-slate-950 dark:bg-[radial-gradient(circle_at_top,#0d1b33_0%,#08111f_58%,#050914_100%)] dark:text-white"
      style={shellStyle}
    >
      <div className="mx-auto flex h-full w-full max-w-[1700px] flex-col px-3 py-3 md:px-5 md:py-5">
        <div className="relative flex h-full min-h-0 overflow-hidden rounded-[28px] border border-white/60 bg-white/52 shadow-[0_36px_120px_-52px_rgba(37,99,235,0.26)] backdrop-blur-3xl dark:border-white/10 dark:bg-white/[0.04]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.35),transparent_72%)]" />
            <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-sky-200/35 blur-3xl dark:bg-sky-500/10" />
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-indigo-100/55 blur-3xl dark:bg-blue-500/10" />
          </div>

          <div className="relative z-10 flex h-full min-h-0 w-full flex-col gap-4 p-4 xl:flex-row xl:gap-5 xl:p-5">
            <section
              className={cn(
                "flex w-full min-h-[360px] shrink-0 flex-col overflow-hidden rounded-[24px] xl:min-h-0 xl:w-[360px] xl:min-w-[360px]",
                glassPanel
              )}
            >
              <div className="flex items-start justify-between gap-3 px-4 pb-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(232,244,255,0.92))] text-slate-900 shadow-[0_18px_40px_-24px_rgba(56,189,248,0.55)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(12,18,32,0.88))] dark:text-white">
                    <Sparkles className="h-[18px] w-[18px]" />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-100/80 bg-white/72 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-700 shadow-[0_10px_24px_-20px_rgba(14,165,233,0.65)] dark:border-white/10 dark:bg-white/[0.06] dark:text-sky-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      AI Builder
                    </div>
                    <div>
                      <h1 className="text-[20px] font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">Workspace</h1>
                      <p className="text-[12px] leading-5 text-slate-500 dark:text-slate-300">
                        Prompt, iterate, and push live changes into the builder.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={softPill}
                      >
                        <Braces className="h-3.5 w-3.5" />
                        {buildMode}
                        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      {(["App", "Landing", "Dashboard"] as BuildMode[]).map((mode) => (
                        <DropdownMenuItem
                          key={mode}
                          onSelect={() => setBuildMode(mode)}
                          className="flex items-center justify-between"
                        >
                          <span>{mode}</span>
                          {buildMode === mode ? <Check className="h-4 w-4" /> : null}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <button
                    type="button"
                    onClick={clearChat}
                    className={softPill}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {suggestions.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      disabled={isGenerating}
                      onClick={() => setDraft(s.text)}
                      className="group rounded-[20px] border border-white/65 bg-white/78 p-3 text-left shadow-[0_18px_40px_-32px_rgba(15,23,42,0.28)] transition duration-200 hover:-translate-y-0.5 hover:border-sky-200/80 hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] disabled:opacity-60"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[13px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">{s.label}</span>
                        <span className="rounded-full border border-slate-200/80 bg-white/80 px-2 py-1 text-[10px] font-semibold text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
                          {formatShortcut(s.shortcut)}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-300">
                        {s.label === "Landing page"
                          ? "Hero, sections, pricing, and conversion flow."
                          : s.label === "Dashboard app"
                            ? "Analytics, navigation, settings, and tables."
                            : "Catalog, product flow, and checkout experience."}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div
                ref={listRef}
                className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 [scrollbar-width:thin]"
              >
                <div className="space-y-3 pr-1">
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-[22px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(243,248,255,0.84))] p-4 shadow-[0_24px_56px_-38px_rgba(37,99,235,0.24)] dark:border-white/10 dark:bg-white/[0.04]"
                    >
                      <p className="text-[14px] font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
                        Describe what you want to build...
                      </p>
                      <p className="mt-2 text-[12px] leading-6 text-slate-500 dark:text-slate-300">
                        Start with structure, design direction, and the screens you need. Preview and code update on the right.
                      </p>
                    </motion.div>
                  ) : null}

                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "max-w-[86%] rounded-[22px] px-4 py-3 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.22)]",
                        m.role === "user"
                          ? "ml-auto border border-sky-200/80 bg-[linear-gradient(135deg,rgba(223,242,255,0.95),rgba(234,244,255,0.95))] text-slate-900"
                          : "mr-auto border border-white/70 bg-white/84 text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="whitespace-pre-wrap text-[13px] leading-6">{m.content}</div>
                        {m.role === "user" ? (
                          <button
                            type="button"
                            onClick={() => setDraft(m.content)}
                            className="rounded-full border border-sky-200/80 bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-sky-700 transition hover:bg-sky-50"
                          >
                            Edit
                          </button>
                        ) : null}
                      </div>
                    </motion.div>
                  ))}

                  {isGenerating ? (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-[22px] border border-sky-100/80 bg-[linear-gradient(180deg,rgba(240,248,255,0.92),rgba(232,244,255,0.86))] p-4 shadow-[0_24px_56px_-38px_rgba(56,189,248,0.28)] dark:border-white/10 dark:bg-white/[0.05]"
                    >
                      <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700 dark:text-slate-100">
                        <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                        Builder is generating
                      </div>
                      <div className="mt-3 space-y-2">
                        {workflowLogs.map((log, idx) => {
                          const active = idx === activeAgentIndex;
                          const done = activeAgentIndex > idx;
                          return (
                            <div
                              key={log.agent + "-" + idx}
                              className={cn(
                                "flex items-center justify-between rounded-full px-3 py-2 text-[11px] font-medium",
                                done
                                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                  : active
                                    ? "bg-sky-500/12 text-sky-700 dark:text-sky-200"
                                    : "bg-white/74 text-slate-500 dark:bg-white/[0.06] dark:text-slate-300"
                              )}
                            >
                              <span className="truncate">{log.agent}</span>
                              <span className="truncate text-right opacity-80">{log.action}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : null}

                  {error ? (
                    <div className="rounded-[20px] border border-red-200/80 bg-red-50/90 px-4 py-3 text-[12px] font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                      {error}
                    </div>
                  ) : null}

                  <div ref={bottomRef} />
                </div>
              </div>

              <div className="border-t border-white/55 px-4 pb-4 pt-3 dark:border-white/10">
                <div className="flex items-center gap-2 pb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsVisualMode((v) => !v);
                      setView("code");
                    }}
                    className={cn(toolbarPill, isVisualMode ? "border-sky-200/90 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200" : "")}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Visual
                  </button>

                  <label className={cn(toolbarPill, "cursor-pointer")}>
                    <FileUp className="h-3.5 w-3.5" />
                    Upload
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
                    />
                  </label>

                  <button
                    type="button"
                    aria-label={isListening ? "Listening" : "Voice input"}
                    onClick={startVoiceInput}
                    className={cn(toolbarPill, isListening ? "border-sky-200/90 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200" : "")}
                  >
                    <Mic className={cn("h-3.5 w-3.5", isListening ? "animate-pulse" : "")}/>
                    Voice
                  </button>
                </div>

                <div
                  className="relative overflow-hidden rounded-[22px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,249,255,0.9))] p-3 shadow-[0_24px_56px_-36px_rgba(37,99,235,0.22)] dark:border-white/10 dark:bg-white/[0.05]"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDropActive(true);
                  }}
                  onDragLeave={() => setIsDropActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDropActive(false);
                    handleUpload(e.dataTransfer.files?.[0] ?? null);
                  }}
                >
                  {isDropActive ? (
                    <div className="pointer-events-none absolute inset-0 rounded-[22px] border-2 border-dashed border-sky-300/80 bg-sky-50/70" />
                  ) : null}

                  <textarea
                    ref={textareaRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe what you want to build..."
                    className="min-h-[112px] w-full resize-none bg-transparent pr-14 text-[14px] leading-7 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-400"
                  />

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-medium text-slate-400 dark:text-slate-400">Enter to send / Shift+Enter newline</p>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-300">Mode: {buildMode}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleSend()}
                      disabled={isGenerating || !draft.trim()}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#0f172a_0%,#2563eb_100%)] text-white shadow-[0_20px_40px_-20px_rgba(37,99,235,0.7)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
                      aria-label="Send"
                    >
                      {isGenerating ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <ArrowUp className="h-[18px] w-[18px]" />}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden">
              <div className={cn("rounded-[24px] p-3", glassPanel)}>
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <div className="inline-flex items-center rounded-full border border-white/65 bg-white/78 p-1 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-white/[0.05]">
                      <button
                        type="button"
                        onClick={() => setView("preview")}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition",
                          view === "preview"
                            ? "bg-slate-950 text-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.7)] dark:bg-white dark:text-slate-950"
                            : "text-slate-500 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                        )}
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => setView("code")}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition",
                          view === "code"
                            ? "bg-slate-950 text-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.7)] dark:bg-white dark:text-slate-950"
                            : "text-slate-500 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                        )}
                      >
                        <Code2 className="h-4 w-4" />
                        Code
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setRefreshKey((k) => k + 1)}
                      className={softPill}
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                      Refresh
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Publish is not wired yet. Hook this up to your hosting workflow.")}
                      className={cn(softPill, "hidden md:inline-flex")}
                    >
                      Publish
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Share is not wired yet. Hook this up to your project links.")}
                      className={cn(softPill, "hidden md:inline-flex")}
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Share
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center rounded-full border border-white/65 bg-white/78 p-1 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-white/[0.05]">
                      {(
                        [
                          { id: "desktop" as const, label: "Desktop" },
                          { id: "tablet" as const, label: "Tablet" },
                          { id: "mobile" as const, label: "Mobile" },
                        ]
                      ).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setDeviceMode(m.id)}
                          className={cn(
                            "rounded-full px-4 py-2 text-[12px] font-semibold transition",
                            deviceMode === m.id
                              ? "bg-slate-950 text-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.7)] dark:bg-white dark:text-slate-950"
                              : "text-slate-500 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                          )}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsFullscreen(true)}
                      className={softPill}
                    >
                      <Expand className="h-3.5 w-3.5" />
                      Fullscreen
                    </button>
                  </div>
                </div>
              </div>

              <div className={cn("flex-1 min-h-0 rounded-[24px] p-3", glassPanel)}>
                <AnimatePresence mode="wait">
                  {view === "preview" ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="flex h-full min-h-0 flex-col gap-3"
                    >
                      <div className="flex items-center justify-between px-1">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-400">Live canvas</p>
                          <p className="mt-1 text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Preview workspace</p>
                        </div>
                        <div className="rounded-full border border-white/60 bg-white/72 px-3 py-1.5 text-[11px] font-medium text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
                          Responsive preview
                        </div>
                      </div>

                      <div className="flex-1 min-h-0 rounded-[24px] border border-white/65 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(240,246,255,0.9))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
                        <div className="mx-auto flex h-full w-full justify-center">
                          <div className={cn("h-full min-h-0 overflow-hidden rounded-[20px] border border-sky-100/80 bg-white shadow-[0_24px_60px_-40px_rgba(37,99,235,0.22)] dark:border-white/10 dark:bg-[#08101d]", previewWidthClass)}>
                            <PreviewFrame iframeKey={refreshKey} className="h-full" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="code"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="flex h-full min-h-0 flex-col gap-3"
                    >
                      <div className="flex flex-col gap-3 rounded-[22px] border border-white/65 bg-white/76 px-4 py-3 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.2)] dark:border-white/10 dark:bg-white/[0.04] md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-400">Code editor</p>
                          <p className="mt-1 text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Generated code</p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              disabled={!filesForEditor.length}
                              className={cn(softPill, "min-w-0 justify-between")}
                            >
                              <span className="truncate max-w-[220px] sm:max-w-[320px]">{activePath ?? "No files"}</span>
                              <ChevronDown className="h-4 w-4 opacity-70" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[520px] max-w-[92vw]">
                            {filesForEditor.map((f) => (
                              <DropdownMenuItem
                                key={f.path}
                                onSelect={() => openFile(f.path)}
                                className="flex items-center justify-between"
                              >
                                <span className="truncate max-w-[420px]">{f.path}</span>
                                {activePath === f.path ? <Check className="h-4 w-4" /> : null}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex-1 min-h-0 overflow-hidden rounded-[24px] border border-white/65 bg-white/88 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[#08101d]">
                        <Editor
                          theme="vs-light"
                          language={activeLanguage}
                          value={activeEditorValue}
                          onChange={(value) => {
                            if (!activePath) return;
                            updateFileContent(activePath, value ?? "");
                          }}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            fontFamily: '"Inter", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                            fontLigatures: true,
                            wordWrap: "on",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            lineNumbersMinChars: 3,
                            smoothScrolling: true,
                            padding: { top: 18, bottom: 18 },
                          }}
                        />
                      </div>

                      <div className="rounded-[20px] border border-white/60 bg-white/72 px-4 py-3 text-[12px] text-slate-500 shadow-[0_14px_30px_-28px_rgba(15,23,42,0.2)] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                        Tip: editing <span className="font-semibold text-slate-700 dark:text-white">preview.html</span> updates the live preview instantly.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>

          <AnimatePresence>
            {isFullscreen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-2xl"
                onClick={() => setIsFullscreen(false)}
              >
                <motion.div
                  initial={{ y: 14, opacity: 0, scale: 0.99 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 14, opacity: 0, scale: 0.99 }}
                  className="flex h-[92dvh] w-[96vw] max-w-[1480px] flex-col overflow-hidden rounded-[28px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08))] shadow-[0_40px_120px_-48px_rgba(15,23,42,0.7)] backdrop-blur-3xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-white/15 px-5 py-4 text-white">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Fullscreen</p>
                      <p className="mt-1 text-sm font-semibold">Preview workspace</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFullscreen(false)}
                      className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-white/15"
                    >
                      Close (Esc)
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 p-5">
                    <div className="h-full overflow-hidden rounded-[22px] border border-white/10 bg-white/95 shadow-[0_28px_70px_-44px_rgba(15,23,42,0.45)]">
                      <PreviewFrame iframeKey={refreshKey + "-fs"} className="h-full" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}