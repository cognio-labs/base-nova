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
  ArrowLeft,
  Check,
  ChevronDown,
  Circle,
  Code2,
  Grid2X2,
  Expand,
  ExternalLink,
  Eye,
  Globe,
  HelpCircle,
  FileText,
  Link2,
  Loader2,
  Mic,
  Monitor,
  Palette,
  Plus,
  RefreshCcw,
  Share2,
  Smartphone,
  Upload,
  UserPlus,
} from "lucide-react";

import { usePathname } from "next/navigation";
import PreviewFrame from "@/components/PreviewFrame";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

type TaskStatus = "completed" | "active" | "pending";
type TaskKind = "plan" | "code" | "file" | "design" | "debug" | "deploy";

type GenerationTask = {
  id: string;
  label: string;
  status: TaskStatus;
  kind: TaskKind;
  agent: string;
  filePath?: string;
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
const TYPEWRITER_PROMPTS = [
  "Let’s build an AI startup MVP…",
  "Create a modern SaaS landing page…",
  "Build a multi-agent AI system…",
  "Design a crypto trading dashboard…",
  "Generate a beautiful portfolio website…",
  "Create a Telegram AI automation bot…",
  "Build a full-stack Next.js application…",
  "Make a stunning eCommerce website…",
  "Create a futuristic admin dashboard…",
  "Generate a premium UI/UX design…",
  "Build an AI chatbot for my business…",
  "Create a viral social media web app…",
  "Design a mobile app landing page…",
  "Build a no-code AI website builder…",
  "Create a modern fintech platform…",
];

const GENERATION_TASK_BLUEPRINT: Array<Omit<GenerationTask, "status">> = [
  { id: "architecture", label: "Setup project architecture", kind: "plan", agent: "Planner" },
  { id: "schema", label: "Create database schema", kind: "code", agent: "Data Agent" },
  { id: "api", label: "Initialize API routes", kind: "code", agent: "Backend Agent" },
  { id: "auth", label: "Build authentication system", kind: "code", agent: "Security Agent" },
  { id: "hero", label: "Building Hero section...", kind: "design", agent: "UI Agent" },
  { id: "navbar", label: "Writing components/Navbar.tsx", kind: "file", agent: "Component Agent", filePath: "components/Navbar.tsx" },
  { id: "dashboard", label: "Creating dashboard layout", kind: "file", agent: "Layout Agent", filePath: "app/dashboard/page.tsx" },
  { id: "styles", label: "Generating responsive styles", kind: "design", agent: "Design Agent", filePath: "app/globals.css" },
  { id: "backend", label: "Connecting backend APIs", kind: "code", agent: "Integration Agent" },
  { id: "animations", label: "Optimizing animations", kind: "debug", agent: "Motion Agent" },
  { id: "final-ui", label: "Finalizing UI design", kind: "deploy", agent: "QA Agent" },
];

let cachedChatStorageValue: string | null | undefined;
let cachedChatMessages: ChatMessage[] = EMPTY_CHAT_MESSAGES;

type DeviceMode = "desktop" | "mobile";
type BuildMode = "App" | "Landing" | "Dashboard";
type MemberRole = "Can edit" | "Can comment" | "Can view";

type Collaborator = {
  id: string;
  name: string;
  email: string;
  role: MemberRole | "Owner";
  avatar?: string;
  initials: string;
};

const COLLABORATORS: Collaborator[] = [
  {
    id: "owner",
    name: "Aryan Khan (you)",
    email: "aryanthealgohype@gmail.com",
    role: "Owner",
    initials: "AK",
  },
  {
    id: "designer",
    name: "Ayan's Lovable",
    email: "team@aryandigitalcanvas.com",
    role: "Can edit",
    initials: "AL",
  },
  {
    id: "dev",
    name: "People you invited",
    email: "invites@workspace.local",
    role: "Can comment",
    initials: "PI",
  },
];

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

function TaskStatusIcon({ status }: { status: TaskStatus }) {
  if (status === "completed") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/25">
        <Check className="h-3.5 w-3.5" />
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      </span>
    );
  }

  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-500 ring-1 ring-zinc-700/80">
      <Circle className="h-2.5 w-2.5 fill-current" />
    </span>
  );
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
  const [previewStyle, setPreviewStyle] = useState<"default" | "soft" | "contrast">("default");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [buildMode, setBuildMode] = useState<BuildMode>("App");
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("Can edit");
  const [isInvitePublic, setIsInvitePublic] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isCreatingInviteLink, setIsCreatingInviteLink] = useState(false);
  const promptHints = ["App", "Website", "Dashboard", "Landing page", "Mobile app"];
  const [hintIndex, setHintIndex] = useState(0);
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");
  const [isTypewriterDeleting, setIsTypewriterDeleting] = useState(false);
  const [generationTasks, setGenerationTasks] = useState<GenerationTask[]>([]);
  const [isTaskPanelLive, setIsTaskPanelLive] = useState(false);
  const pathname = usePathname();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const taskPanelRef = useRef<HTMLDivElement | null>(null);
  const taskTimersRef = useRef<number[]>([]);
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
    if (deviceMode === "mobile") return "w-[390px] max-w-[92vw]";
    return "w-full max-w-[1040px]";
  }, [deviceMode]);

  const projectLabel = projectTitle || "Untitled Website";

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
    const currentPrompt = TYPEWRITER_PROMPTS[typewriterIndex];
    const isComplete = typewriterText === currentPrompt;
    const isEmpty = typewriterText.length === 0;

    const delay = isComplete && !isTypewriterDeleting
      ? 1500
      : isTypewriterDeleting
        ? 28
        : 54 + (typewriterText.length % 4) * 12;

    const timer = window.setTimeout(() => {
      if (!isTypewriterDeleting && isComplete) {
        setIsTypewriterDeleting(true);
        return;
      }

      if (isTypewriterDeleting && isEmpty) {
        setIsTypewriterDeleting(false);
        setTypewriterIndex((current) => (current + 1) % TYPEWRITER_PROMPTS.length);
        return;
      }

      setTypewriterText((current) =>
        isTypewriterDeleting
          ? current.slice(0, -1)
          : currentPrompt.slice(0, current.length + 1)
      );
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isTypewriterDeleting, typewriterIndex, typewriterText]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        if (isSidebarOpen) setIsSidebarOpen(false);
        if (isShareModalOpen) setIsShareModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen, isSidebarOpen, isShareModalOpen]);

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) {
        window.clearInterval(streamTimerRef.current);
      }
      taskTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      taskTimersRef.current = [];
      if (shareTimerRef.current) {
        window.clearTimeout(shareTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const panel = taskPanelRef.current;
    if (!panel) return;

    panel.scrollTo({
      top: panel.scrollHeight,
      behavior: "smooth",
    });
  }, [generationTasks]);

  const startGenerationTimeline = () => {
    taskTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    taskTimersRef.current = [];
    setIsTaskPanelLive(true);
    setGenerationTasks([]);

    GENERATION_TASK_BLUEPRINT.forEach((task, index) => {
      const timerId = window.setTimeout(() => {
        setGenerationTasks(
          GENERATION_TASK_BLUEPRINT.slice(0, Math.min(GENERATION_TASK_BLUEPRINT.length, index + 3)).map(
            (item, itemIndex) => ({
              ...item,
              status:
                itemIndex < index
                  ? "completed"
                  : itemIndex === index
                    ? "active"
                    : "pending",
            })
          )
        );
      }, 420 + index * 720);

      taskTimersRef.current.push(timerId);
    });

    const finishTimerId = window.setTimeout(() => {
      setGenerationTasks((current) => current.map((item) => ({ ...item, status: "completed" })));
      setIsTaskPanelLive(false);
    }, 420 + GENERATION_TASK_BLUEPRINT.length * 720 + 900);

    taskTimersRef.current.push(finishTimerId);
  };

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

  const handleFileAttach = (files: FileList | null) => {
    if (!files?.length) return;

    const fileNames = Array.from(files)
      .map((file) => file.name)
      .slice(0, 4);

    pushMessage({
      role: "assistant",
      content: `Attached ${fileNames.length} file${fileNames.length === 1 ? "" : "s"}: ${fileNames.join(", ")}`,
    });
  };

  const handleSelectDraft = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();

    if (draft.trim()) {
      textarea.select();
      return;
    }

    setDraft("Create a premium AI product landing page with pricing, testimonials, and dashboard preview.");
  };

  const handlePlanDraft = () => {
    const planPrompt =
      draft.trim() || "Create a premium AI builder website with a modern SaaS layout and dashboard.";

    pushMessage({ role: "user", content: planPrompt });
    startGenerationTimeline();
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
    startGenerationTimeline();

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

  const handleOpenExternalPreview = () => {
    if (previewHtml) {
      const blob = new Blob([previewHtml], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
      return;
    }

    window.open(window.location.href, "_blank", "noopener,noreferrer");
  };

  const handleAiAction = () => {
    const nextPrompt = `Create a premium ${promptHints[hintIndex].toLowerCase()} with modern SaaS layout and animations.`;
    setDraft(nextPrompt);
    textareaRef.current?.focus();
  };

  const handleGithubOpen = () => {
    window.open("https://github.com", "_blank", "noopener,noreferrer");
  };

  const cyclePreviewStyle = () => {
    setPreviewStyle((current) =>
      current === "default" ? "soft" : current === "soft" ? "contrast" : "default"
    );
  };

  const handleCreateInviteLink = async () => {
    if (isCreatingInviteLink) return;

    setIsCreatingInviteLink(true);
    await new Promise((resolve) => window.setTimeout(resolve, 450));

    const slug = projectLabel
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const nextLink = `${window.location.origin}/share/${slug || "workspace"}`;

    setInviteLink(nextLink);
    setIsCreatingInviteLink(false);
    setShareFeedback("Invite link created");

    if (shareTimerRef.current) {
      window.clearTimeout(shareTimerRef.current);
    }

    shareTimerRef.current = window.setTimeout(() => setShareFeedback(null), 2200);
  };

  const handleCopyInviteLink = async () => {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setShareFeedback("Invite link copied");
    } catch {
      window.prompt("Copy invite link", inviteLink);
      setShareFeedback("Invite link ready to copy");
    }

    if (shareTimerRef.current) {
      window.clearTimeout(shareTimerRef.current);
    }

    shareTimerRef.current = window.setTimeout(() => setShareFeedback(null), 2200);
  };

  const handleInviteByEmail = () => {
    if (!inviteEmail.trim()) return;

    const inviteMessage = `Invite sent to ${inviteEmail.trim()} with ${inviteRole.toLowerCase()} access.`;
    pushMessage({ role: "assistant", content: inviteMessage });
    setInviteEmail("");
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
      className="relative h-[100dvh] w-screen overflow-hidden bg-[#1f1f22] text-zinc-100"
      style={shellStyle}
    >
      <div className="absolute inset-0 bg-[#11151c]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(56,189,248,0.20),transparent_30%),radial-gradient(circle_at_28%_18%,rgba(88,28,135,0.24),transparent_34%),radial-gradient(circle_at_86%_8%,rgba(14,165,233,0.13),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.11),transparent_42%),linear-gradient(135deg,#10131a_0%,#171b22_42%,#10141b_100%)]" />
      <div className="absolute inset-0 opacity-[0.045] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.9)_1px,transparent_0)] [background-size:20px_20px]" />
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-sky-300/[0.08] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/40 to-transparent" />

      {isSidebarOpen && <button className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar overlay" />}

      <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden">
        <header className="relative z-30 flex h-10 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-white/[0.045] px-2 text-zinc-200 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
  <div className="flex min-w-0 items-center">
    <button
      onClick={() => setIsSidebarOpen((value) => !value)}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:bg-white/10 hover:text-white"
      aria-label="Toggle chat panel"
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
    <div className="ml-2 hidden items-center gap-2 rounded-lg border border-sky-300/15 bg-[#162836]/80 p-1 shadow-inner shadow-sky-900/20 backdrop-blur-xl sm:flex">
      <div className="ml-1 flex h-6 items-center gap-1.5 rounded-md border border-sky-300/15 bg-sky-400/10 px-2">
        <span className="flex h-4 w-4 items-center justify-center rounded bg-sky-400/15 text-[10px] font-black text-sky-300 ring-1 ring-sky-300/20">
          L
        </span>
        <span className="text-xs font-black tracking-tight text-zinc-100">
          Loko<span className="text-sky-300">AI</span>
        </span>
      </div>
      <button
        onClick={() => setView("preview")}
        className={cn(
          "min-w-[78px] rounded-md px-4 py-1.5 text-sm font-semibold transition",
          view === "preview"
            ? "bg-white text-zinc-950 shadow-sm shadow-black/20"
            : "text-slate-300 hover:bg-white/5 hover:text-white"
        )}
      >
        Preview
      </button>
      <button
        onClick={() => setView("code")}
        className={cn(
          "min-w-[68px] rounded-md px-4 py-1.5 text-sm font-semibold transition",
          view === "code"
            ? "bg-white text-zinc-950 shadow-sm shadow-black/20"
            : "text-slate-300 hover:bg-white/5 hover:text-white"
        )}
      >
        Code
      </button>
    </div>
  </div>

  <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 lg:flex">
    <div className="inline-flex h-7 w-full max-w-[280px] items-center justify-between rounded-full border border-white/10 bg-white/[0.07] px-3 text-xs font-semibold text-zinc-300 shadow-inner shadow-black/20">
      <RefreshCcw className="h-3.5 w-3.5 text-zinc-400" />
      <span className="truncate">{pathname || "/workspace"}</span>
      <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
    </div>

    <div className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 p-1 shadow-sm dark:border-white/10 dark:bg-white/5">
      <button
        onClick={() => setView("preview")}
        className={cn(
          "flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
          view === "preview"
            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        )}
      >
        <Eye className="h-3.5 w-3.5" />
        Preview
      </button>
      <button
        onClick={() => setView("code")}
        className={cn(
          "flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
          view === "code"
            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        )}
      >
        <Code2 className="h-3.5 w-3.5" />
        Code
      </button>
    </div>

    <div className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.055] p-0.5 shadow-sm">
      <button
        onClick={() => setDeviceMode("desktop")}
        className={cn(
          "rounded p-1.5 transition-all",
          deviceMode === "desktop"
            ? "bg-white text-zinc-950"
            : "text-zinc-400 hover:bg-white/10 hover:text-white"
        )}
        aria-label="Desktop preview"
      >
        <Monitor className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setDeviceMode("mobile")}
        className={cn(
          "rounded p-1.5 transition-all",
          deviceMode === "mobile"
            ? "bg-white text-zinc-950"
            : "text-zinc-400 hover:bg-white/10 hover:text-white"
        )}
        aria-label="Mobile preview"
      >
        <Smartphone className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setRefreshKey((key) => key + 1)}
        className="rounded p-1.5 text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
        aria-label="Refresh preview"
      >
        <RefreshCcw className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={handleOpenExternalPreview}
        className="rounded p-1.5 text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
        aria-label="Open preview in new tab"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </button>
    </div>
  </div>

  <div className="flex shrink-0 items-center gap-1.5">
    <button
      onClick={() => setIsShareModalOpen(true)}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-zinc-300 shadow-sm transition-all hover:bg-white/10 hover:text-white"
      aria-label="Share project"
    >
      <Plus className="h-4 w-4" />
    </button>

    <button
      onClick={handleGithubOpen}
      className="inline-flex h-7 items-center gap-1 rounded-md border border-white/10 bg-white/[0.06] px-2 text-[11px] font-semibold text-zinc-300 shadow-sm transition-all hover:bg-white/10 hover:text-white"
      aria-label="Open GitHub"
    >
      <Code2 className="h-3.5 w-3.5" />
      <span className="hidden md:inline">GitHub</span>
    </button>

    <button
      onClick={handleShare}
      className="inline-flex h-7 items-center gap-1 rounded-md bg-white px-3 text-[11px] font-bold text-zinc-950 shadow-lg shadow-black/20 transition-all hover:bg-zinc-200"
      aria-label="Upload and share"
    >
      <Upload className="h-3.5 w-3.5" />
      <span className="hidden md:inline">Publish</span>
    </button>

    {shareFeedback ? (
      <div className="hidden rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-200 xl:block">
        {shareFeedback}
      </div>
    ) : null}
  </div>
</header>

        <main className="relative flex min-h-0 flex-1 overflow-hidden bg-transparent p-3 lg:flex-row">
          <aside className={cn(
            "fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-screen flex-col overflow-hidden bg-[#1b1b20]/72 pt-0 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-transform duration-300 md:w-[360px] lg:static lg:z-auto lg:h-full lg:w-[420px] lg:shrink-0 lg:basis-[420px] lg:translate-x-0 lg:shadow-none xl:w-[432px] xl:basis-[432px]",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="hidden shrink-0 items-center justify-between border-b border-zinc-800 px-4 py-4">
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

            <div
              ref={taskPanelRef}
              className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="space-y-4">
                {messages
                  .filter((message) => message.role === "user")
                  .map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[82%] rounded-lg bg-[#303033]/95 px-4 py-3 text-sm font-semibold leading-relaxed text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] whitespace-pre-wrap ring-1 ring-white/5">
                        {message.content}
                      </div>
                    </motion.div>
                  ))}

                <AnimatePresence>
                  {(generationTasks.length > 0 || isTaskPanelLive || isGenerating) && (
                    <motion.div
                      key="task-panel"
                      initial={{ opacity: 0, y: 18, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.98 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] shadow-[0_20px_55px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
                    >
                      <div className="border-b border-white/10 bg-white/[0.035] px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-black tracking-tight text-zinc-100">Plan</p>
                            <p className="mt-0.5 text-[11px] font-medium text-zinc-500">
                              Multi-agent generation timeline
                            </p>
                          </div>
                          <span
                            className={cn(
                              "rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",
                              isTaskPanelLive || isGenerating
                                ? "border-sky-400/25 bg-sky-500/10 text-sky-300"
                                : "border-emerald-400/25 bg-emerald-500/10 text-emerald-300"
                            )}
                          >
                            {isTaskPanelLive || isGenerating ? "Live" : "Done"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 px-3 py-3">
                        <AnimatePresence initial={false}>
                          {generationTasks.map((task, index) => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, x: -10, height: 0 }}
                              animate={{ opacity: 1, x: 0, height: "auto" }}
                              exit={{ opacity: 0, x: -8, height: 0 }}
                              transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.12) }}
                              className={cn(
                                "group relative flex gap-3 rounded-xl px-2.5 py-2.5 transition-colors",
                                task.status === "active" ? "bg-sky-500/[0.075]" : "hover:bg-white/[0.035]"
                              )}
                            >
                              <div className="relative mt-0.5 shrink-0">
                                <TaskStatusIcon status={task.status} />
                                {index < generationTasks.length - 1 ? (
                                  <span className="absolute left-1/2 top-6 h-6 w-px -translate-x-1/2 bg-white/10" />
                                ) : null}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                  <p
                                    className={cn(
                                      "min-w-0 flex-1 truncate text-sm font-semibold",
                                      task.status === "completed"
                                        ? "text-zinc-300"
                                        : task.status === "active"
                                          ? "text-sky-100"
                                          : "text-zinc-500"
                                    )}
                                  >
                                    {task.label}
                                  </p>
                                  {task.filePath ? (
                                    <span className="inline-flex max-w-full items-center gap-1 rounded-md border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
                                      <FileText className="h-3 w-3" />
                                      <span className="max-w-[140px] truncate">{task.filePath}</span>
                                    </span>
                                  ) : null}
                                </div>
                                <p className="mt-1 text-[11px] font-medium text-zinc-500">{task.agent}</p>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {generationTasks.length === 0 ? (
                          <div className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-zinc-400">
                            <TaskStatusIcon status="active" />
                            Preparing AI agents...
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!messages.length && !generationTasks.length && !isGenerating ? (
                  <div className="h-[260px]" />
                ) : null}
              </div>
            </div>

            <div className="sticky bottom-0 z-10 shrink-0 bg-transparent p-4">
              <div className="rounded-lg border border-white/12 bg-white/[0.075] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.34)] backdrop-blur-2xl focus-within:border-sky-500/70">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event) => handleFileAttach(event.target.files)}
                />
                <div className="relative overflow-hidden rounded-md bg-transparent">
                  {!draft ? (
                    <div className="pointer-events-none absolute left-0 right-0 top-1 z-0">
                      <div className="flex min-w-0 items-center text-sm font-semibold leading-6 tracking-normal text-zinc-400">
                        <span className="truncate text-zinc-400">
                          {typewriterText}
                        </span>
                        <span className="typewriter-cursor ml-1 h-4 w-[2px] shrink-0 rounded-full bg-zinc-400/80" />
                      </div>
                    </div>
                  ) : null}
                  <textarea
                    ref={textareaRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder=""
                    className="relative z-10 w-full resize-none border-none bg-transparent px-0 py-1 text-sm font-semibold leading-6 text-zinc-100 outline-none placeholder:text-transparent"
                    style={{ minHeight: 70 }}
                    aria-label="Describe what you want to build"
                  />
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3b3b40] text-zinc-300 transition-all hover:bg-[#46464c] hover:text-white"
                      aria-label="Attach files"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-zinc-100 sm:inline-flex">
                          {buildMode === "App" ? "Standard" : buildMode}
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-40">
                        {(["App", "Landing", "Dashboard"] as BuildMode[]).map((mode) => (
                          <DropdownMenuItem key={mode} onSelect={() => setBuildMode(mode)}>
                            {mode === "App" ? "Standard" : mode}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <button
                      onClick={startVoiceInput}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                        isListening
                          ? "animate-pulse bg-red-500 text-white"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      )}
                      aria-label="Voice input"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="hidden items-center gap-5 text-xs font-semibold text-zinc-400 sm:flex">
                    <button
                      onClick={handleSelectDraft}
                      className="inline-flex items-center gap-1.5 transition hover:text-zinc-100"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Select
                    </button>
                    <button
                      onClick={handlePlanDraft}
                      className="inline-flex items-center gap-1.5 transition hover:text-zinc-100"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      Plan
                    </button>
                  </div>

                  <button
                    onClick={() => void handleSend()}
                    disabled={isGenerating || !draft.trim()}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-950/30 transition-all hover:bg-sky-500 active:scale-95 disabled:opacity-50"
                    aria-label="Send prompt"
                  >
                    {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <section className="ml-0 flex min-w-0 flex-1 min-h-0 flex-col overflow-hidden rounded-lg border border-white/12 bg-white/[0.045] shadow-[0_26px_80px_rgba(0,0,0,0.30)] backdrop-blur-2xl lg:ml-1">
            <div className="hidden shrink-0 items-center justify-between gap-2 border-b border-zinc-800 bg-[#1f1f22] px-3 py-2 sm:px-4">
              <div className="flex min-w-0 items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <Globe className="h-3.5 w-3.5" />
                <span className="truncate">Live route: {pathname || "/workspace"}</span>
              </div>

              <div className="flex items-center gap-1">
                <div className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 p-1 shadow-sm dark:border-white/10 dark:bg-white/5 lg:hidden">
                  <button
                    onClick={() => setView("preview")}
                    className={cn(
                      "rounded-full px-2 py-1 text-[11px] font-semibold transition-all",
                      view === "preview"
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "text-slate-500 dark:text-slate-300"
                    )}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setView("code")}
                    className={cn(
                      "rounded-full px-2 py-1 text-[11px] font-semibold transition-all",
                      view === "code"
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "text-slate-500 dark:text-slate-300"
                    )}
                  >
                    Code
                  </button>
                </div>

                <button
                  onClick={() => setIsFullscreen(true)}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                >
                  <Expand className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden p-0"> 
              <AnimatePresence mode="wait">
                {view === "preview" ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    className="flex h-full w-full justify-center"
                  >
                    <div
                      className={cn(
                        "relative h-full w-full overflow-hidden rounded-lg transition-all duration-300",
                        previewStyle === "soft" && "ring-1 ring-sky-300/20 shadow-[inset_0_0_90px_rgba(14,165,233,0.08)]",
                        previewStyle === "contrast" && "ring-1 ring-white/20 shadow-[inset_0_0_100px_rgba(255,255,255,0.05)]",
                        previewStyle === "default" && "bg-transparent"
                      )}
                    >
                      <div className="absolute left-3 top-3 z-20 flex items-center overflow-hidden rounded-md border border-white/10 bg-black/20 p-0.5 text-xs font-semibold text-zinc-300 shadow-lg shadow-black/20 backdrop-blur-xl">
                        <button
                          onClick={() => setView("code")}
                          className="inline-flex h-7 items-center gap-1.5 rounded px-2.5 transition hover:bg-white/10 hover:text-white"
                          aria-label="Edit generated code"
                        >
                          <Code2 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <span className="h-5 w-px bg-white/10" />
                        <button
                          onClick={cyclePreviewStyle}
                          className="inline-flex h-7 items-center justify-center rounded px-2 transition hover:bg-white/10 hover:text-white"
                          aria-label="Change preview style"
                          title={`Style: ${previewStyle}`}
                        >
                          <Palette className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeviceMode((mode) => (mode === "desktop" ? "mobile" : "desktop"))}
                          className="inline-flex h-7 items-center justify-center rounded px-2 transition hover:bg-white/10 hover:text-white"
                          aria-label="Toggle preview size"
                        >
                          <Grid2X2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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
                      <div className={cn("mx-auto h-full transition-all duration-300 ease-out", previewWidthClass)}>
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
                    <div className="flex shrink-0 items-center justify-between rounded-[26px] border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-950">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{projectLabel}</p>
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
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="max-w-3xl p-0 sm:max-h-[88dvh]" showCloseButton={false}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden rounded-3xl"
          >
            <div className="border-b border-slate-200/70 bg-gradient-to-r from-white via-slate-50 to-sky-50 px-5 py-4 dark:border-white/10 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 sm:px-6">
              <DialogHeader>
                <DialogTitle>Share Project</DialogTitle>
                <DialogDescription>
                  Invite teammates, configure access, and share your live preview.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Add People
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Invite by email"
                    className="h-10 rounded-full"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex h-10 items-center justify-center gap-1 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                        {inviteRole}
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      {(["Can edit", "Can comment", "Can view"] as MemberRole[]).map((role) => (
                        <DropdownMenuItem key={role} onSelect={() => setInviteRole(role)}>
                          {role}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button
                    onClick={handleInviteByEmail}
                    disabled={!inviteEmail.trim()}
                    className="inline-flex h-10 items-center justify-center gap-1 rounded-full bg-slate-900 px-4 text-xs font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Invite
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Project Access</h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{COLLABORATORS.length} members</span>
                </div>
                <div className="space-y-3">
                  {COLLABORATORS.map((member) => (
                    <div key={member.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/70 bg-white/85 px-3 py-2 dark:border-white/10 dark:bg-slate-950/50">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="size-8">
                          {member.avatar ? <AvatarImage src={member.avatar} alt={member.name} /> : null}
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{member.name}</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{member.email}</p>
                        </div>
                      </div>

                      {member.role === "Owner" ? (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200">
                          Owner
                        </span>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                              {member.role}
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            {(["Can edit", "Can comment", "Can view"] as MemberRole[]).map((role) => (
                              <DropdownMenuItem key={`${member.id}-${role}`}>
                                {role}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Invite Link</h4>
                  <button
                    onClick={() => setIsInvitePublic((value) => !value)}
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all",
                      isInvitePublic
                        ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-200"
                        : "border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                    )}
                  >
                    {isInvitePublic ? "Public" : "Private"}
                  </button>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => void handleCreateInviteLink()}
                    disabled={isCreatingInviteLink}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-xs font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900"
                  >
                    {isCreatingInviteLink ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5" />}
                    {inviteLink ? "Regenerate link" : "Create invite link"}
                  </button>
                  <button
                    onClick={() => void handleCopyInviteLink()}
                    disabled={!inviteLink}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Copy invite link
                  </button>
                </div>

                <p className="mt-2 truncate text-xs text-slate-500 dark:text-slate-400">{inviteLink || "No link created yet."}</p>
              </div>
            </div>

            <DialogFooter className="border-t border-slate-200/70 bg-white/70 px-5 py-4 dark:border-white/10 dark:bg-slate-950/70 sm:px-6">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                Close
              </button>
              <button
                onClick={handleAiAction}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                <Code2 className="h-3.5 w-3.5" />
                Publish project
              </button>
              <button
                onClick={handleShare}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-sky-500 px-4 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-600"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share preview
              </button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>

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


























