
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import PreviewFrame from "@/components/PreviewFrame";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGeneratorStore } from "@/lib/store";
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

function useLocalStorageChat(): [ChatMessage[], (next: ChatMessage[]) => void] {
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
  return shortcut.replace("Cmd", "Cmd").replace("Ctrl", "Ctrl");
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
    projectTitle,
  } = useGeneratorStore();

  const [messages, setMessages] = useLocalStorageChat();
  const [draft, setDraft] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [buildMode, setBuildMode] = useState<BuildMode>("App");
  const [isVisualMode, setIsVisualMode] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const streamTimerRef = useRef<number | null>(null);

  const suggestions = useMemo(
    () => [
      {
        label: "Landing page",
        text: "Build a premium landing page with hero, features, testimonials, pricing, FAQ, and a conversion-focused CTA. Use glassmorphism with purple/blue accents.",
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
    setMessages([...messages, { id, role: msg.role, content: msg.content, createdAt }]);
    return id;
  };

  const updateMessage = (id: string, content: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, content } : m)));
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

  const handleSend = async () => {
    const prompt = draft.trim();
    if (!prompt || isGenerating) return;

    setDraft("");
    setView("preview");

    pushMessage({ role: "user", content: prompt });

    const assistantId = pushMessage({
      role: "assistant",
      content: "Thinking…",
    });

    await generateProject(`${prompt}\n\nBuild mode: ${buildMode}.`);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
    <div className="min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#05050a] dark:via-[#05050a] dark:to-[#090218]">
      <div className="mx-auto w-full max-w-[1700px] px-4 py-4 md:px-6 md:py-6">
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/70 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#07070c]/60">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -top-48 left-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-purple-500/30 to-sky-500/20 blur-3xl" />
            <div className="absolute -bottom-56 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-sky-500/20 to-purple-500/25 blur-3xl" />
          </div>

          <PanelGroup direction="horizontal" className="relative z-10 h-[calc(100vh-8rem)] min-h-[720px]">
            {/* Left: Chat */}
            <Panel defaultSize={38} minSize={28} className="flex flex-col">
              <header className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/25 to-sky-500/20 text-slate-900 dark:text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400 dark:text-slate-400">AI Builder</p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">Workspace</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-extrabold",
                          panelBg,
                          "hover:bg-white/80 dark:hover:bg-white/10"
                        )}
                      >
                        <Braces className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                        <span>{buildMode}</span>
                        <ChevronDown className="h-4 w-4 opacity-70" />
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
                      "rounded-2xl px-3 py-2 text-xs font-extrabold text-slate-600 dark:text-slate-200",
                      panelBg,
                      "hover:bg-white/80 dark:hover:bg-white/10"
                    )}
                  >
                    Clear
                  </button>
                </div>
              </header>

              <div className="px-5 pb-3">
                <div className={cn("rounded-3xl p-4", panelBg)}>
                  <p className="text-[11px] font-black uppercase tracking-[0.26em] text-slate-400 dark:text-slate-400">
                    Suggestions
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        disabled={isGenerating}
                        onClick={() => setDraft(s.text)}
                        className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 disabled:opacity-60"
                      >
                        <span className="truncate max-w-[180px]">{s.label}</span>
                        <span className="rounded-xl bg-slate-900/5 px-2 py-0.5 text-[10px] font-black text-slate-500 dark:bg-white/10 dark:text-slate-300">
                          {formatShortcut(s.shortcut)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div
                ref={listRef}
                className="flex-1 overflow-auto px-5 pb-5 [scrollbar-width:thin]"
              >
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <div className={cn("rounded-3xl p-6", panelBg)}>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">Describe what you want to build.</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        I’ll generate a live preview and editable code in realtime. Tip: press <span className="font-semibold">Enter</span> to send,
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
                        "max-w-[92%] rounded-3xl border px-4 py-3 text-sm leading-relaxed shadow-sm",
                        m.role === "user"
                          ? "ml-auto border-slate-200/70 bg-white/80 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                          : "mr-auto border-slate-200/70 bg-gradient-to-br from-purple-500/10 to-sky-500/10 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      )}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </motion.div>
                  ))}

                  {isGenerating ? (
                    <div className={cn("rounded-3xl p-4", panelBg)}>
                      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-200">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating…
                      </div>
                      <div className="mt-3 space-y-2">
                        {workflowLogs.map((log, idx) => {
                          const active = idx === activeAgentIndex;
                          const done = activeAgentIndex > idx;
                          return (
                            <div
                              key={`${log.agent}-${idx}`}
                              className={cn(
                                "flex items-center justify-between rounded-2xl border px-3 py-2 text-xs",
                                done
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                  : active
                                    ? "border-sky-500/30 bg-sky-500/10 text-slate-900 dark:text-white"
                                    : "border-slate-200/70 bg-white/60 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                              )}
                            >
                              <span className="font-bold truncate max-w-[55%]">{log.agent}</span>
                              <span className="truncate max-w-[40%] opacity-90">{log.action}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {error ? (
                    <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                      {error}
                    </div>
                  ) : null}

                  <div ref={bottomRef} />
                </div>
              </div>

              {/* Composer */}
              <div className="border-t border-slate-200/70 bg-white/60 px-5 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                <div className={cn("rounded-3xl p-3", panelBg)}>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsVisualMode((v) => !v);
                        setView("code");
                      }}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-extrabold",
                        isVisualMode
                          ? "bg-sky-500/10 text-sky-700 dark:text-sky-200"
                          : "bg-transparent text-slate-700 dark:text-slate-200",
                        "hover:bg-slate-900/5 dark:hover:bg-white/10"
                      )}
                    >
                      <Upload className="h-4 w-4" />
                      Visual Edits
                    </button>

                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10">
                      <FileUp className="h-4 w-4" />
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
                        "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-extrabold",
                        isListening
                          ? "bg-sky-500/10 text-sky-700 dark:text-sky-200"
                          : "text-slate-700 dark:text-slate-200",
                        "hover:bg-slate-900/5 dark:hover:bg-white/10"
                      )}
                    >
                      <Mic className={cn("h-4 w-4", isListening ? "animate-pulse" : "")} />
                      Voice
                    </button>

                    <div className="ml-auto flex items-center gap-2">
                      <span className="hidden sm:inline text-[11px] font-bold text-slate-400 dark:text-slate-400">
                        Enter to send • Shift+Enter newline
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-end gap-3">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Describe the app you want to build…"
                      className="min-h-[54px] max-h-40 w-full resize-none rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={isGenerating || !draft.trim()}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-sky-500 text-white shadow-lg shadow-sky-500/10 transition hover:brightness-110 disabled:opacity-60"
                      aria-label="Send"
                    >
                      {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="w-2 bg-transparent">
              <div className="mx-auto h-full w-[2px] rounded-full bg-slate-200/70 dark:bg-white/10" />
            </PanelResizeHandle>

            {/* Right: Preview/Code */}
            <Panel defaultSize={62} minSize={38} className="flex flex-col">
              <header className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setView("preview")}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-extrabold",
                      view === "preview"
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                        : "text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
                    )}
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("code")}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-extrabold",
                      view === "code"
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                        : "text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
                    )}
                  >
                    <Code2 className="h-4 w-4" />
                    Code
                  </button>

                  <div className="mx-2 h-6 w-px bg-slate-200/70 dark:bg-white/10" />

                  <button
                    type="button"
                    onClick={() => setRefreshKey((k) => k + 1)}
                    className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Refresh
                  </button>

                  <button
                    type="button"
                    onClick={() => alert("Publish is not wired yet. Hook this up to your hosting workflow.")}
                    className="hidden md:inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    Publish
                  </button>

                  <button
                    type="button"
                    onClick={() => alert("Share is not wired yet. Hook this up to your project links.")}
                    className="hidden md:inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>

                <div className="flex items-center gap-2">
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
                          "rounded-2xl px-3 py-2 text-xs font-extrabold",
                          deviceMode === m.id
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                            : "text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
                        )}
                      >
                        {m.label}</n                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFullscreen(true)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-extrabold text-slate-700",
                      panelBg,
                      "hover:bg-white/80 dark:hover:bg-white/10"
                    )}
                  >
                    <Expand className="h-4 w-4" />
                    Fullscreen
                  </button>
                </div>
              </header>
