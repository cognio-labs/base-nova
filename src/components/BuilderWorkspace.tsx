"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState, type Dispatch, type KeyboardEvent as ReactKeyboardEvent, type SetStateAction } from "react";
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
import { Group, Panel, Separator } from "react-resizable-panels";

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

function useLocalStorageChat(): [ChatMessage[], Dispatch<SetStateAction<ChatMessage[]>>] {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    const parsed = safeJsonParse<ChatMessage[]>(window.localStorage.getItem(CHAT_STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore quota errors
    }
  }, [messages]);

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

  const panelBg =
    "bg-white/60 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 shadow-[0_20px_60px_-30px_rgba(2,6,23,0.35)]";

  return (
    <div className="h-[calc(100dvh-5rem)] w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(186,230,253,0.35),_transparent_36%),linear-gradient(180deg,_#f8fbff_0%,_#f4f8fc_48%,_#ffffff_100%)] dark:bg-[#09111f]">
      <div className="mx-auto flex h-full w-full max-w-[1700px] flex-col px-3 py-3 md:px-5 md:py-4">
        <div className="relative flex h-full min-h-0 overflow-hidden rounded-[30px] border border-sky-100/80 bg-white/78 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#070c14]/70">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -top-48 left-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-sky-300/45 to-blue-300/25 blur-3xl" />
            <div className="absolute -bottom-56 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-blue-200/25 to-cyan-200/20 blur-3xl" />
          </div>

          <Group orientation="horizontal" className="relative z-10 flex h-full min-h-0 overflow-hidden">
            {/* Left: Chat */}
            <Panel defaultSize={31} minSize={24} className="min-h-0 min-w-0 overflow-hidden bg-white/82 dark:bg-[#09111a]/72">
              <div className="mx-auto flex h-full w-full max-w-[460px] min-h-0 flex-col">
                <header className="shrink-0 border-b border-slate-200/70 px-4 py-3 dark:border-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[18px] bg-gradient-to-br from-sky-200/80 to-blue-100/80 text-slate-900 dark:text-white">
                        <Sparkles className="h-[18px] w-[18px]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">AI Builder</p>
                        <p className="text-[13px] font-extrabold leading-5 text-slate-950 dark:text-white">Workspace</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className={cn(
                              "flex h-9 items-center gap-2 rounded-2xl px-3 text-[11px] font-extrabold",
                              panelBg,
                              "hover:bg-white/80 dark:hover:bg-white/10"
                            )}
                          >
                            <Braces className="h-3.5 w-3.5 text-slate-500 dark:text-slate-300" />
                            <span>{buildMode}</span>
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
                        className={cn(
                          "h-9 rounded-2xl px-3 text-[11px] font-extrabold text-slate-600 dark:text-slate-200",
                          panelBg,
                          "hover:bg-white/80 dark:hover:bg-white/10"
                        )}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </header>

                <div className="shrink-0 border-b border-slate-200/70 px-4 py-3 dark:border-white/10">
                  <div className={cn("rounded-[20px] p-3", panelBg, "shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]")}>
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                      Suggestions
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {suggestions.map((s) => (
                        <button
                          key={s.label}
                          type="button"
                          disabled={isGenerating}
                          onClick={() => setDraft(s.text)}
                          className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white/86 px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 disabled:opacity-60"
                        >
                          <span className="truncate max-w-[128px]">{s.label}</span>
                          <span className="rounded-lg bg-slate-900/5 px-1.5 py-0.5 text-[10px] font-black text-slate-500 dark:bg-white/10 dark:text-slate-300">
                            {formatShortcut(s.shortcut)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  ref={listRef}
                  className="min-h-0 flex-1 overflow-y-auto px-4 py-3 [scrollbar-width:thin]"
                >
                  <div className="space-y-2.5 pr-1">
                    {messages.length === 0 ? (
                      <div className={cn("rounded-[20px] p-4", panelBg)}>
                        <p className="text-[13px] font-bold text-slate-900 dark:text-white">Describe what you want to build.</p>
                        <p className="mt-1.5 text-[12px] leading-5 text-slate-600 dark:text-slate-300">
                          I&apos;ll generate the preview and code on the right. Press <span className="font-semibold">Enter</span> to send and
                          <span className="font-semibold"> Shift+Enter</span> for a new line.
                        </p>
                      </div>
                    ) : null}

                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "max-w-[92%] rounded-[20px] border px-3.5 py-3 text-[12.5px] leading-5 shadow-sm",
                          m.role === "user"
                            ? "ml-auto border-slate-200/70 bg-white/90 text-slate-900 dark:border-white/10 dark:bg-white/6 dark:text-white"
                            : "mr-auto border-slate-200/70 bg-gradient-to-br from-sky-100/85 to-blue-50/90 text-slate-900 dark:border-white/10 dark:from-sky-500/10 dark:to-blue-500/10 dark:text-white"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="whitespace-pre-wrap">{m.content}</div>
                          {m.role === "user" ? (
                            <button
                              type="button"
                              onClick={() => setDraft(m.content)}
                              className="shrink-0 rounded-full border border-sky-200/80 bg-white/90 px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-sky-700 transition hover:bg-sky-50 dark:border-white/10 dark:bg-white/10 dark:text-sky-200"
                            >
                              Edit
                            </button>
                          ) : null}
                        </div>
                      </motion.div>
                    ))}

                    {isGenerating ? (
                      <div className={cn("rounded-[20px] p-4", panelBg)}>
                        <div className="flex items-center gap-2 text-[11px] font-extrabold text-slate-700 dark:text-slate-200">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </div>
                        <div className="mt-3 space-y-2">
                          {workflowLogs.map((log, idx) => {
                            const active = idx === activeAgentIndex;
                            const done = activeAgentIndex > idx;
                            return (
                              <div
                                key={`${log.agent}-${idx}`}
                                className={cn(
                                  "flex items-center justify-between rounded-2xl border px-3 py-2 text-[11px]",
                                  done
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                    : active
                                      ? "border-sky-500/30 bg-sky-500/10 text-slate-900 dark:text-white"
                                      : "border-slate-200/70 bg-white/60 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                                )}
                              >
                                <span className="max-w-[52%] truncate font-bold">{log.agent}</span>
                                <span className="max-w-[42%] truncate opacity-90">{log.action}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    {error ? (
                      <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                        {error}
                      </div>
                    ) : null}

                    <div ref={bottomRef} />
                  </div>
                </div>

                <div className="shrink-0 border-t border-slate-200/70 bg-white/72 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#09111a]/85">
                  <div
                    className={cn(
                      "rounded-[22px] border border-white/70 bg-white/92 p-2.5 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur-xl transition dark:border-white/10 dark:bg-[#0d1522]/92",
                      isDropActive ? "ring-2 ring-sky-500/30" : ""
                    )}
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
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsVisualMode((v) => !v);
                          setView("code");
                        }}
                        className={cn(
                          "inline-flex h-8 items-center gap-2 rounded-[12px] px-2.5 text-[11px] font-bold",
                          isVisualMode
                            ? "bg-sky-500/10 text-sky-700 dark:text-sky-200"
                            : "bg-transparent text-slate-700 dark:text-slate-200",
                          "hover:bg-slate-900/5 dark:hover:bg-white/10"
                        )}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Visual Edits
                      </button>

                      <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-[12px] px-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10">
                        <FileUp className="h-3.5 w-3.5" />
                        Upload Files
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
                        className={cn(
                          "inline-flex h-8 items-center gap-2 rounded-[12px] px-2.5 text-[11px] font-bold",
                          isListening
                            ? "bg-sky-500/10 text-sky-700 dark:text-sky-200"
                            : "text-slate-700 dark:text-slate-200",
                          "hover:bg-slate-900/5 dark:hover:bg-white/10"
                        )}
                      >
                        <Mic className={cn("h-3.5 w-3.5", isListening ? "animate-pulse" : "")} />
                        Voice
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-end gap-2">
                      <div className="flex-1 rounded-[18px] border border-slate-200/70 bg-slate-50/90 dark:border-white/10 dark:bg-white/5">
                        <textarea
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Describe the app you want to build..."
                          className="h-[72px] w-full resize-none bg-transparent px-3.5 py-3 text-[13px] font-medium leading-5 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-400"
                        />
                        <div className="flex items-center justify-end px-3 pb-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                          Enter to send • Shift+Enter newline
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleSend()}
                        disabled={isGenerating || !draft.trim()}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-slate-900 to-sky-600 text-white shadow-[0_16px_32px_-18px_rgba(14,116,144,0.7)] transition hover:brightness-110 disabled:opacity-60"
                        aria-label="Send"
                      >
                        {isGenerating ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <ArrowUp className="h-[18px] w-[18px]" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <Separator className="relative w-2 bg-transparent before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-slate-200/80 dark:before:bg-white/10" />

            {/* Right: Preview/Code */}
            <Panel defaultSize={69} minSize={38} className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-white/72 dark:bg-[#0b111c]/68">
              <header className="shrink-0 border-b border-slate-200/70 px-4 py-3 dark:border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
                    <button
                      type="button"
                      onClick={() => setView("preview")}
                      className={cn(
                        "inline-flex h-9 items-center gap-2 rounded-2xl px-3 text-[11px] font-extrabold whitespace-nowrap",
                        view === "preview"
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                          : "text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
                      )}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("code")}
                      className={cn(
                        "inline-flex h-9 items-center gap-2 rounded-2xl px-3 text-[11px] font-extrabold whitespace-nowrap",
                        view === "code"
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                          : "text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
                      )}
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      Code
                    </button>

                    <div className="mx-1 h-5 w-px bg-slate-200/70 dark:bg-white/10" />

                    <button
                      type="button"
                      onClick={() => setRefreshKey((k) => k + 1)}
                      className="inline-flex h-9 items-center gap-2 rounded-2xl px-3 text-[11px] font-extrabold whitespace-nowrap text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                      Refresh
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Publish is not wired yet. Hook this up to your hosting workflow.")}
                      className="hidden md:inline-flex h-9 items-center gap-2 rounded-2xl px-3 text-[11px] font-extrabold whitespace-nowrap text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
                    >
                      Publish
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Share is not wired yet. Hook this up to your project links.")}
                      className="hidden md:inline-flex h-9 items-center gap-2 rounded-2xl px-3 text-[11px] font-extrabold whitespace-nowrap text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Share
                    </button>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <div className={cn("hidden sm:flex items-center gap-1 rounded-2xl p-1", panelBg)}>
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
                            "rounded-2xl px-3 py-2 text-[11px] font-extrabold",
                            deviceMode === m.id
                              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                              : "text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
                          )}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsFullscreen(true)}
                      className={cn(
                        "inline-flex h-9 items-center gap-2 rounded-2xl px-3 text-[11px] font-extrabold text-slate-700",
                        panelBg,
                        "hover:bg-white/80 dark:hover:bg-white/10"
                      )}
                    >
                      <Expand className="h-3.5 w-3.5" />
                      Fullscreen
                    </button>
                  </div>
                </div>
              </header>

              <div className="flex-1 min-h-0 overflow-hidden">
                <AnimatePresence mode="wait">
                  {view === "preview" ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="h-full w-full min-h-0 p-4"
                    >
                      <div className="mx-auto flex h-full w-full justify-center rounded-[24px] border border-slate-200/70 bg-white/55 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:border-white/10 dark:bg-white/[0.03]">
                        <div className={cn("h-full min-h-0", previewWidthClass)}>
                          <PreviewFrame iframeKey={refreshKey} className="h-full" />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="code"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex h-full min-h-0 flex-col overflow-hidden"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 dark:border-white/10">
                        <div className="flex min-w-0 items-center gap-2">
                          <Code2 className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                          <p className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200">Generated Code</p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              disabled={!filesForEditor.length}
                              className={cn(
                                "flex h-9 min-w-0 items-center gap-2 rounded-2xl px-3 text-[11px] font-extrabold",
                                panelBg,
                                "text-slate-700 dark:text-slate-200 disabled:opacity-60"
                              )}
                            >
                              <span className="truncate max-w-[220px] sm:max-w-[300px]">{activePath ?? "No files"}</span>
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

                      <div className="flex-1 min-h-0">
                        <Editor
                          theme="vs-dark"
                          language={activeLanguage}
                          value={activeEditorValue}
                          onChange={(value) => {
                            if (!activePath) return;
                            updateFileContent(activePath, value ?? "");
                          }}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            wordWrap: "on",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                          }}
                        />
                      </div>

                      <div className="border-t border-slate-200/70 px-4 py-3 text-[11px] text-slate-500 dark:border-white/10 dark:text-slate-300">
                        Tip: editing <span className="font-bold">preview.html</span> updates the live preview instantly.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Panel>
          </Group>

          {/* Fullscreen preview */}
          <AnimatePresence>
            {isFullscreen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xl"
                onClick={() => setIsFullscreen(false)}
              >
                <motion.div
                  initial={{ y: 10, opacity: 0, scale: 0.99 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 10, opacity: 0, scale: 0.99 }}
                  className="h-[92dvh] w-[96vw] max-w-[1400px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0f]/60 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <p className="text-xs font-extrabold text-white">Fullscreen Preview</p>
                    <button
                      type="button"
                      onClick={() => setIsFullscreen(false)}
                      className="rounded-2xl bg-white/10 px-3 py-2 text-xs font-extrabold text-white hover:bg-white/15"
                    >
                      Close (Esc)
                    </button>
                  </div>
                  <div className="h-[calc(92dvh-64px)] p-5">
                    <PreviewFrame iframeKey={`${refreshKey}-fs`} className="h-full" />
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


