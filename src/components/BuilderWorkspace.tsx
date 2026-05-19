"use client";

import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type Dispatch,
  type KeyboardEvent as ReactKeyboardEvent,
  type SetStateAction,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import {
  ArrowUp,
  ChevronDown,
  Code2,
  Expand,
  Eye,
  Loader2,
  Menu,
  Mic,
  Monitor,
  Plus,
  RefreshCcw,
  Share2,
  Smartphone,
  Sparkles,
  X,
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

type DeviceMode = "desktop" | "mobile";
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

export default function BuilderWorkspace() {
  const {
    generateProject,
    isGenerating,
    error,
    view,
    setView,
    generatedFiles,
    activeFilePath,
    openFile,
    previewHtml,
    updateFileContent,
    getFileContent,
    projectTitle,
  } = useGeneratorStore();

  const [messages, setMessages] = useLocalStorageChat();
  const [draft, setDraft] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [buildMode, setBuildMode] = useState<BuildMode>("App");
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const promptHints = ["App", "Website", "Dashboard", "Landing page", "Mobile app"];
  const [hintIndex, setHintIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const streamTimerRef = useRef<number | null>(null);
  const pendingPromptRef = useRef(false);
  const shareTimerRef = useRef<number | null>(null);

  const filesForEditor = useMemo(() => {
    if (!generatedFiles?.length) return [] as { path: string; title: string }[];
    return generatedFiles.map((file) => ({
      path: file.path,
      title: file.path.split("/").pop() || file.path,
    }));
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
    return "w-full";
  }, [deviceMode]);

  const projectLabel = projectTitle || "Aryan's Digital Canvas";
  const statusLabel = error
    ? "Generation failed"
    : isGenerating
      ? "Generating your website"
      : "Chat-first builder";

  const syncComposerHeight = useEffectEvent(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, 80), 180);
    textarea.style.height = `${nextHeight}px`;
  });

  useEffect(() => {
    syncComposerHeight();
  }, [draft, syncComposerHeight]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHintIndex((current) => (current + 1) % promptHints.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, [promptHints.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        if (isSidebarOpen) setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen, isSidebarOpen]);

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) {
        window.clearInterval(streamTimerRef.current);
      }
      if (shareTimerRef.current) {
        window.clearTimeout(shareTimerRef.current);
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
      setDraft((prev) => `${prev}${prev ? " " : ""}${transcript}`);
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

    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      setIsSidebarOpen(false);
    }

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
      `The live preview is updated on the right. Switch Preview/Code, edit files, or refresh the iframe if needed.`;

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
  }, [buildMode, isGenerating, sendPendingPrompt]);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: projectLabel,
          url,
        });
        setShareFeedback("Share sheet opened");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareFeedback("Link copied");
      } else {
        window.prompt("Copy this link", url);
        setShareFeedback("Link ready to copy");
      }
    } catch {
      window.prompt("Copy this link", url);
      setShareFeedback("Link ready to copy");
    }

    if (shareTimerRef.current) {
      window.clearTimeout(shareTimerRef.current);
    }

    shareTimerRef.current = window.setTimeout(() => setShareFeedback(null), 2200);
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const activeEditorValue = activePath ? getFileContent(activePath) : "";
  const showPreviewSkeleton = isGenerating && !previewHtml;

  const shellStyle = {
    fontFamily: '"Inter", "Geist", ui-sans-serif, system-ui, sans-serif',
  };

  return (
    <div
      className="relative h-[100dvh] w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white"
      style={shellStyle}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.12),_transparent_30%)]" />
      <div className="absolute -left-24 top-12 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/10" />
      <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-500/10" />

      {isSidebarOpen && <button className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar overlay" />}

      <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl dark:border-white/5 dark:bg-slate-950/70 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-base">
                  {projectLabel}
                </h2>
              </div>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {statusLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 lg:hidden"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span>Chat</span>
            </button>

            {shareFeedback ? (
              <div className="hidden rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200 md:block">
                {shareFeedback}
              </div>
            ) : null}

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-600 active:scale-95"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </header>

        <main className="relative flex min-h-0 flex-1 overflow-hidden lg:flex-row">
          <aside className={cn(
            "fixed inset-y-16 left-0 z-50 flex h-[calc(100dvh-4rem)] w-screen flex-col border-r border-slate-200/70 bg-white/88 shadow-[0_30px_90px_rgba(15,23,42,0.22)] backdrop-blur-xl transition-transform duration-300 dark:border-white/5 dark:bg-slate-950/78 sm:w-[320px] lg:static lg:z-auto lg:h-full lg:translate-x-0 lg:w-[320px] lg:shadow-none xl:w-[360px] 2xl:w-[400px]",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200/70 px-4 py-4 dark:border-white/5">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Chat panel</p>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Prompt, debug, and track generation</p>
              </div>
              <button
                onClick={() => setMessages([])}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
              >
                Clear
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-3">
                {messages.length ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap",
                          message.role === "user"
                            ? "bg-sky-500 text-white"
                            : "bg-slate-100 text-slate-900 dark:bg-white/5 dark:text-white"
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex min-h-[240px] items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center dark:border-white/10 dark:bg-white/5">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">No chat yet</p>
                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Describe the site you want and press Enter.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200/70 p-4 dark:border-white/5">
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-950">
                <div className="mb-3 space-y-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-between gap-3">
                    <span>
                      {error
                        ? error
                        : isGenerating
                          ? "Generating files and preview..."
                          : `Build a ${promptHints[hintIndex].toLowerCase()}.`}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                          {buildMode}
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        {(["App", "Landing", "Dashboard"] as BuildMode[]).map((mode) => (
                          <DropdownMenuItem key={mode} onSelect={() => setBuildMode(mode)}>
                            {mode}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {promptHints.map((hint) => (
                      <button
                        key={hint}
                        onClick={() => setDraft(hint)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all",
                          draft === hint
                            ? "border-sky-500 bg-sky-500 text-white"
                            : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white"
                        )}
                      >
                        {hint}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Describe the ${promptHints[hintIndex].toLowerCase()} you want to build...`}
                  className="w-full resize-none rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  style={{ minHeight: 140 }}
                />

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-white">
                      <Plus className="h-5 w-5" />
                    </button>

                    <button
                      onClick={startVoiceInput}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-2xl transition-all",
                        isListening
                          ? "animate-pulse bg-red-500 text-white"
                          : "text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                      )}
                      aria-label="Voice input"
                    >
                      <Mic className="h-5 w-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => void handleSend()}
                    disabled={isGenerating || !draft.trim()}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-slate-900"
                    aria-label="Send prompt"
                  >
                    {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex min-w-0 flex-1 min-h-0 flex-col overflow-hidden lg:border-l lg:border-slate-200/70">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200/70 bg-white/65 px-3 py-3 backdrop-blur-md dark:border-white/5 dark:bg-slate-950/40 sm:px-4">
              <div className="flex items-center gap-1 rounded-2xl bg-slate-100/80 p-1 dark:bg-white/5">
                <button
                  onClick={() => setView("preview")}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all",
                    view === "preview"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-white dark:text-slate-900"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
                <button
                  onClick={() => setView("code")}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all",
                    view === "code"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-white dark:text-slate-900"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  <Code2 className="h-4 w-4" />
                  Code
                </button>
              </div>

              <div className="flex items-center gap-1 rounded-2xl bg-slate-100/80 p-1 dark:bg-white/5">
                <button
                  onClick={() => setDeviceMode("desktop")}
                  className={cn(
                    "rounded-xl p-2 transition-all",
                    deviceMode === "desktop"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  )}
                  aria-label="Desktop preview"
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeviceMode("mobile")}
                  className={cn(
                    "rounded-xl p-2 transition-all",
                    deviceMode === "mobile"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  )}
                  aria-label="Mobile preview"
                >
                  <Smartphone className="h-4 w-4" />
                </button>
                <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-white/10" />
                <button
                  onClick={() => setRefreshKey((key) => key + 1)}
                  className="rounded-xl p-2 text-slate-500 transition-all hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label="Refresh preview"
                >
                  <RefreshCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="rounded-xl p-2 text-slate-500 transition-all hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label="Fullscreen preview"
                >
                  <Expand className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4">
              <AnimatePresence mode="wait">
                {view === "preview" ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    className="h-full w-full"
                  >
                    <div className="relative mx-auto h-full w-full overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-slate-950">
                      {showPreviewSkeleton ? (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
                          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                            <div className="h-3 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
                            <div className="mt-4 space-y-3">
                              <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
                              <div className="h-5 w-5/6 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
                              <div className="h-24 rounded-[22px] border border-dashed border-slate-200 bg-slate-50/80 dark:border-white/10 dark:bg-white/5" />
                            </div>
                          </div>
                        </div>
                      ) : null}
                      <div className={cn("h-full transition-all duration-300 ease-out", previewWidthClass)}>
                        <PreviewFrame iframeKey={refreshKey} className="h-full" />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className="flex h-full flex-col gap-4"
                  >
                    <div className="flex shrink-0 items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-950">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                          <Code2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Generated code</p>
                          <p className="text-[10px] font-medium text-slate-400">Editing updates the preview instantly</p>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                            <span className="max-w-[140px] truncate">{activePath || "No files selected"}</span>
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                          {filesForEditor.map((file) => (
                            <DropdownMenuItem key={file.path} onSelect={() => openFile(file.path)}>
                              {file.path}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="min-h-0 flex-1 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)] dark:border-white/10 dark:bg-[#0d1117]">
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
                          fontFamily: '"Geist Mono", "Fira Code", monospace',
                          wordWrap: "on",
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          padding: { top: 20, bottom: 20 },
                          smoothScrolling: true,
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </main>
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/35 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="flex h-full w-full flex-col p-4 md:p-8"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white">
                    <Expand className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-white">Fullscreen Preview</h3>
                </div>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-900 shadow-xl transition-all active:scale-95"
                >
                  Close Preview
                </button>
              </div>
              <div className="flex-1 overflow-hidden rounded-[30px] bg-white shadow-2xl dark:bg-slate-950">
                <PreviewFrame iframeKey={`${refreshKey}-fs`} className="h-full" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}









