
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
