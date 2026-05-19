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
  Plus,
  Github,
  Zap,
  HelpCircle,
  Monitor,
  Smartphone,
  Tablet,
  PenSquare,
  History,
  Info,
  ExternalLink,
  Menu,
} from "lucide-react";

import PreviewFrame from "@/components/PreviewFrame";
import UserMenu from "@/components/UserMenu";
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
        label: "Apps",
        text: "Browse app ideas and starter concepts for the AI builder.",
        shortcut: "Ctrl+1",
      },
      {
        label: "Start blank",
        text: "Start a blank workspace with a clean app shell and no preset content.",
        shortcut: "Ctrl+2",
      },
      {
        label: "Templates",
        text: "Show template starter ideas for common app layouts and flows.",
        shortcut: "Ctrl+3",
      },
      {
        label: "Recent",
        text: "Continue from the most recent builder idea and refine the workspace.",
        shortcut: "Ctrl+4",
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
      if (e.ctrlKey && e.key === "4") {
        e.preventDefault();
        setDraft(suggestions[3]?.text ?? "");
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
      className="h-screen w-full overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-white"
      style={shellStyle}
    >
      {/* Background Mesh/Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      
      <div className="relative z-10 flex h-full w-full flex-col">
        {/* ========================================================================= */}
        {/* TOP HEADER */}
        {/* ========================================================================= */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/70 px-4 backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  {useGeneratorStore.getState().projectTitle || "Aryan's Digital Canvas"}
                </h2>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                Previewing last saved version
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/5 md:flex">
               <button className="rounded-full p-1.5 text-slate-500 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-colors">
                 <History className="h-4 w-4" />
               </button>
               <button className="rounded-full p-1.5 text-slate-500 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-colors">
                 <Menu className="h-4 w-4" />
               </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="hidden h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 md:flex">
                <HelpCircle className="h-5 w-5" />
              </button>
              <button className="hidden h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 md:flex">
                <Github className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <Zap className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-[12px] font-bold">120</span>
                <Plus className="h-3.5 w-3.5 text-slate-400" />
              </div>

              <UserMenu />

              <button className="rounded-full bg-sky-500 px-4 py-2 text-[12px] font-bold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all active:scale-95">
                Share
              </button>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* MAIN CONTENT AREA */}
        {/* ========================================================================= */}
        <main className="flex min-h-0 flex-1 overflow-hidden">
          
          {/* LEFT SIDEBAR (CHATS) */}
          <aside className="hidden w-[400px] flex-shrink-0 flex-col border-r border-slate-200/60 bg-slate-50/30 backdrop-blur-sm dark:border-white/5 dark:bg-slate-900/20 lg:flex">
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center opacity-40">
               <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
               <p className="text-sm font-medium text-slate-400 dark:text-slate-600 text-center">
                 Your AI assistant is ready.<br/>Start by describing your vision.
               </p>
            </div>

            {/* Input Panel */}
            <div className="p-4">
              <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-slate-900">
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Lovable..."
                  className="w-full resize-none bg-transparent text-sm leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  style={{ minHeight: '80px' }}
                />

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5">
                      <Plus className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => setIsVisualMode(v => !v)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold transition-all",
                        isVisualMode ? "bg-sky-500 text-white border-sky-500" : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-400"
                      )}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Visual edits
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
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

                    <button 
                      onClick={startVoiceInput}
                      className={cn(
                        "h-9 w-9 flex items-center justify-center rounded-xl transition-all",
                        isListening ? "bg-red-500 text-white animate-pulse" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                      )}
                    >
                      <Mic className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => handleSend()}
                      disabled={isGenerating || !draft.trim()}
                      className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 transition-all active:scale-95 disabled:opacity-50 dark:bg-white dark:text-slate-900"
                    >
                      {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                 {["Enable backend features", "Add AI Chat Assistant", "Create Python skills page"].map(tag => (
                   <button 
                     key={tag}
                     onClick={() => setDraft(tag)}
                     className="rounded-full border border-slate-200 bg-white/50 px-3 py-1 text-[11px] font-semibold text-slate-500 hover:bg-white hover:text-slate-900 dark:border-white/5 dark:bg-white/5 dark:text-slate-400 transition-all"
                   >
                     {tag}
                   </button>
                 ))}
              </div>
            </div>
          </aside>

          {/* RIGHT PREVIEW/CODE AREA */}
          <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-950/20">
            {/* Toolbar */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/40 px-4 backdrop-blur-md dark:border-white/5 dark:bg-slate-900/20">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100/50 dark:bg-white/5">
                <button
                  onClick={() => setView("preview")}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold transition-all",
                    view === "preview" ? "bg-white text-slate-900 shadow-sm dark:bg-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
                <button
                  onClick={() => setView("code")}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold transition-all",
                    view === "code" ? "bg-white text-slate-900 shadow-sm dark:bg-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  <Code2 className="h-4 w-4" />
                  Code
                </button>
              </div>

              {/* URL bar style */}
              <div className="hidden max-w-md flex-1 px-8 md:block">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-1.5 dark:border-white/10 dark:bg-slate-900/50">
                   <div className="flex gap-1.5">
                     <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                     <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                   </div>
                   <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
                   <p className="text-[11px] font-medium text-slate-400 truncate tracking-wide">
                     {activePath || "https:// AryanDigitalCanvas.lovable.app /"}
                   </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-xl bg-slate-100/50 p-1 dark:bg-white/5">
                  <button 
                    onClick={() => setDeviceMode("desktop")}
                    className={cn("p-1.5 rounded-lg transition-all", deviceMode === "desktop" ? "bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white" : "text-slate-400 hover:text-slate-600")}
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setDeviceMode("mobile")}
                    className={cn("p-1.5 rounded-lg transition-all", deviceMode === "mobile" ? "bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white" : "text-slate-400 hover:text-slate-600")}
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setRefreshKey(k => k + 1)}
                    className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    <RefreshCcw className="h-4.5 w-4.5" />
                  </button>
                  <button 
                    onClick={() => setIsFullscreen(true)}
                    className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    <Expand className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden p-4">
              <AnimatePresence mode="wait">
                {view === "preview" ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.995 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.995 }}
                    className="h-full w-full"
                  >
                    <div className="mx-auto h-full w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950">
                       <div className={cn("mx-auto h-full transition-all duration-300 ease-in-out", previewWidthClass)}>
                         <PreviewFrame iframeKey={refreshKey} className="h-full" />
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex h-full flex-col gap-4"
                  >
                    <div className="flex shrink-0 items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400">
                           <Code2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Generated code</p>
                          <p className="text-[10px] font-medium text-slate-400">Editing updates preview instantly</p>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                            <span className="max-w-[120px] truncate">{activePath || "No files selected"}</span>
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                          {filesForEditor.map((f) => (
                            <DropdownMenuItem key={f.path} onSelect={() => openFile(f.path)}>
                              {f.path}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-inner dark:border-white/10 dark:bg-[#0d1117]">
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

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/20 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex h-full w-full flex-col p-4 md:p-8"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white/10 text-white border border-white/10">
                     <Expand className="h-5 w-5" />
                   </div>
                   <h3 className="text-lg font-bold text-white tracking-tight">Fullscreen Preview</h3>
                </div>
                <button 
                  onClick={() => setIsFullscreen(false)}
                  className="rounded-full bg-white px-6 py-2 text-sm font-bold text-slate-900 shadow-xl transition-all active:scale-95"
                >
                  Close Preview
                </button>
              </div>
              <div className="flex-1 overflow-hidden rounded-3xl bg-white shadow-2xl">
                <PreviewFrame iframeKey={refreshKey + "-fs"} className="h-full" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generating Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 right-8 z-50 flex flex-col gap-3"
          >
             <div className="flex items-center gap-4 rounded-3xl border border-sky-500/30 bg-white p-4 shadow-2xl dark:bg-slate-900">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-900 dark:text-white">Builder is working...</p>
                   <p className="text-xs font-medium text-slate-400">Generating your project files</p>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}