"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  AudioLines,
  Bot,
  Briefcase,
  ChevronDown,
  Gem,
  Grid2X2,
  Home,
  LayoutGrid,
  LogIn,
  Loader2,
  Mic,
  Moon,
  Plug,
  Rocket,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Upload,
  Users,
} from "lucide-react";
import { startTransition, useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";

import AuthModal from "@/components/AuthModal";
import UserMenu from "@/components/UserMenu";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { writePendingBuilderPrompt } from "@/lib/builder-session";
import { cn } from "@/lib/utils";

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

const quickActionPrompts = [
  {
    label: "Tasks & Workflows",
    prompt:
      "Create a polished tasks and workflows web app with a dashboard, task board, priority filters, automation status, team assignments, due dates, and a clean productivity-focused interface.",
  },
  {
    label: "CRM & Sales",
    prompt:
      "Create a modern CRM and sales web app with leads, deal pipeline, customer profiles, revenue metrics, follow-up tasks, and a professional sales dashboard.",
  },
  {
    label: "Content & Sites",
    prompt:
      "Create a content and websites management web app with site pages, content calendar, SEO checklist, publishing workflow, analytics cards, and an elegant editorial interface.",
  },
  {
    label: "Finance",
    prompt:
      "Create a finance web app with expense tracking, income overview, budget categories, cash-flow charts, recent transactions, and a secure financial dashboard style.",
  },
  {
    label: "Booking",
    prompt:
      "Create a booking web app with service listings, availability calendar, appointment scheduling, customer details, booking status, and a smooth reservation flow.",
  },
  {
    label: "Ecommerce",
    prompt:
      "Create an ecommerce storefront with product discovery, product pages, cart, checkout CTA, editorial merchandising, and a premium retail interface.",
  },
  {
    label: "AI Chatbots",
    prompt:
      "Create an AI chatbot product workspace with chat history, agent settings, analytics, deployment controls, and a professional assistant builder UI.",
  },
  {
    label: "Analytics",
    prompt:
      "Create an analytics platform with KPI cards, funnel charts, cohort tables, alerts, reporting filters, and a clean executive-ready dashboard.",
  },
];

const sidebarItems = [
  { label: "My Dashboard", icon: Home, href: "/dashboard" },
  { label: "Connections", icon: Plug, href: "/integrations" },
  { label: "Upgrade", icon: Sparkles, href: "/pricing" },
];

const communityItems = [
  { label: "Explore", icon: Rocket, href: "/launchpad" },
  { label: "Hire Experts", icon: Users, href: "/partners" },
  { label: "Partnership", icon: Briefcase, href: "/affiliate" },
  { label: "Blueprints", icon: LayoutGrid, href: "/generate" },
];

export default function DashboardWorkspace() {
  const pathname = usePathname();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showModelSelect, setShowModelSelect] = useState(false);
  const [showMorePrompts, setShowMorePrompts] = useState(false);
  const [isAgentMode, setIsAgentMode] = useState(true);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLaunchingBuilder, setIsLaunchingBuilder] = useState(false);

  const { theme, setTheme } = useTheme();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    router.prefetch("/create");
  }, [router]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 280)}px`;
  }, [prompt]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-900 dark:bg-[#050505] dark:text-white">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500 dark:border-white/10 dark:border-t-sky-400" />
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-sky-500">Workspace</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Loading your dashboard...</h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Syncing your account and preparing the builder.
          </p>
        </div>
      </div>
    );
  }

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
      setPrompt((prev) => prev + (prev ? " " : "") + transcript);
    };

    recognition.start();
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    alert(`Selected file: ${event.target.files[0].name}. File attachment logic will be implemented with the backend.`);
  };

  const launchBuilder = async (nextPrompt = prompt) => {
    const trimmedPrompt = nextPrompt.trim();
    if (!trimmedPrompt || isLaunchingBuilder) {
      return;
    }

    setPrompt(trimmedPrompt);
    setShowModelSelect(false);
    setIsLaunchingBuilder(true);

    const promptWithMode = isAgentMode
      ? `${trimmedPrompt}\n\nBuilder mode: autonomous AI builder.`
      : trimmedPrompt;

    writePendingBuilderPrompt(promptWithMode);

    await new Promise((resolve) => window.setTimeout(resolve, 220));
    startTransition(() => router.push("/create"));
  };

  const handleTextareaKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void launchBuilder();
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-[#050505] dark:text-white">
      <div className="grid min-h-[calc(100vh-5rem)] grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r border-slate-100 bg-white p-4 transition-colors duration-300 dark:border-white/10 dark:bg-[#080808] md:block">
          <div className="flex flex-col gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors dark:bg-white/10 dark:text-white"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-100 bg-white shadow-sm dark:border-white/10 dark:bg-white/10">
                <Grid2X2 className="h-4 w-4" />
              </div>
              Applications
            </Link>
            <Link
              href="/generate"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg">
                <Bot className="h-4 w-4" />
              </div>
              AI Assistants
            </Link>
          </div>

          <div className="mt-8 space-y-1">
            <h3 className="mb-4 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Navigation</h3>
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200",
                  pathname === item.href
                    ? "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    pathname === item.href ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 space-y-1">
            <button
              type="button"
              aria-expanded={isCommunityOpen}
              onClick={() => setIsCommunityOpen((open) => !open)}
              className="mb-4 flex w-full items-center justify-between rounded-lg px-4 py-1.5 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/30 dark:hover:bg-white/10"
            >
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Community</h3>
              <ChevronDown
                className={cn(
                  "h-3 w-3 text-slate-400 transition-transform duration-300",
                  isCommunityOpen ? "rotate-180" : ""
                )}
              />
            </button>

            <AnimatePresence>
              {isCommunityOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-1 overflow-hidden"
                >
                  {communityItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200",
                        pathname === item.href
                          ? "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4",
                          pathname === item.href ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600"
                        )}
                      />
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="mt-8 space-y-1">
            <h3 className="mb-4 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Project</h3>
            <Link
              href="/projects"
              className="group flex w-full items-center justify-between px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Pinned <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
            </Link>
            <Link
              href="/projects"
              className="group flex w-full items-center justify-between px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Recents <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
            </Link>
          </div>
        </aside>

        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.42),_transparent_34%),radial-gradient(circle_at_right,_rgba(221,214,254,0.34),_transparent_28%),linear-gradient(180deg,_#fbfcff_0%,_#f4f7ff_52%,_#ffffff_100%)] transition-colors duration-300 dark:bg-[#050505]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="absolute bottom-0 right-16 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
          </div>

          <div className="relative z-10 flex items-center justify-end gap-2 px-4 pt-4 sm:px-6 lg:px-8">
            <Link
              href="/pricing"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-xs font-bold text-white shadow-lg shadow-slate-200/70 transition hover:-translate-y-0.5 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 dark:bg-white dark:text-slate-950 dark:shadow-none"
            >
              <Sparkles className="h-4 w-4 text-sky-400" />
              <span className="hidden sm:inline">Upgrade</span>
            </Link>

            <button
              type="button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
            >
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {user ? (
              <UserMenu />
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>

          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-[820px] flex-col items-center justify-center px-4 pb-20 pt-10 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: isLaunchingBuilder ? 0.72 : 1, y: 0, scale: isLaunchingBuilder ? 0.985 : 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="w-full"
            >
              <div className="mx-auto max-w-4xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/75 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-sky-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-sky-200">
                  <AudioLines className="h-3.5 w-3.5" />
                  AI Builder Workspace
                </div>
                <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
                  Build apps from prompts in a 
                  <span className="bg-gradient-to-r from-slate-950 via-slate-700 to-sky-700 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-cyan-200">
                    single operating surface
                  </span>
                  .
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
                  Start with a prompt, then move straight into a full AI builder with chat, live preview, code inspection, and responsive app generation.
                </p>
              </div>

              <div className="mx-auto mt-10 max-w-[820px]">
                <div className="relative">
                  <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-r from-sky-300 via-blue-300 to-violet-300 opacity-75 blur-sm" />
                  <motion.div
                    animate={{ y: isFocused ? -2 : 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={cn(
                      "relative min-h-[300px] rounded-[28px] border border-white/70 bg-white/66 p-3 shadow-[0_28px_70px_-36px_rgba(15,23,42,0.42)] ring-1 ring-white/70 backdrop-blur-3xl transition-all duration-300 ease-out dark:border-white/10 dark:bg-[#0b0f16]/72 dark:ring-white/5",
                      isFocused ? "ring-2 ring-sky-400/30" : ""
                    )}
                  >
                    <div className="flex items-center justify-between gap-3 px-2 pb-3">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Prompt Studio</p>
                      </div>
                      <div className="hidden rounded-full border border-white/75 bg-white/80 px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm shadow-slate-200/50 sm:block dark:border-slate-700/60 dark:bg-white/5 dark:text-slate-200">
                        Live preview + code
                      </div>
                    </div>

                    <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={(event) => setPrompt(event.target.value)}
                      onKeyDown={handleTextareaKeyDown}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Describe the app you want to create..."
                      className="min-h-[140px] w-full resize-none border-0 bg-transparent px-3.5 py-2 text-[15px] leading-7 text-slate-950 outline-none placeholder:text-slate-400 sm:min-h-[144px] dark:text-white dark:placeholder:text-slate-500"
                    />

                    <div className="mt-3 flex flex-col gap-3.5 rounded-[24px] border border-slate-200/70 bg-white/72 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_12px_30px_-22px_rgba(15,23,42,0.34)] transition-colors duration-300 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex h-[42px] items-center gap-2 rounded-[14px] border border-white/70 bg-white/80 px-4 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/60 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                        >
                          <Upload className="h-4 w-4" />
                          Upload
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            aria-expanded={showModelSelect}
                            onClick={() => setShowModelSelect((open) => !open)}
                            className={cn(
                              "inline-flex h-[42px] items-center gap-2 rounded-[14px] border px-4 text-sm font-semibold shadow-sm transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/20",
                              showModelSelect
                                ? "border-slate-200 bg-white/85 text-slate-900 dark:border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-100"
                                : "border-white/70 bg-white/80 text-slate-700 hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                            )}
                          >
                            <SlidersHorizontal className="h-4 w-4" />
                            Settings
                          </button>

                          <AnimatePresence>
                            {showModelSelect ? (
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                className="absolute left-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#10151f]/95"
                              >
                                <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                                  AI Routing
                                </div>
                                <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-3 dark:border-sky-400/20 dark:bg-sky-500/10">
                                  <div className="flex items-start gap-3">
                                    <div className="rounded-2xl bg-white p-2 text-slate-900 shadow-sm dark:bg-white/10 dark:text-white">
                                      <Sparkles className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-slate-900 dark:text-white">Automatic</p>
                                      <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                                        Picks the best model and launches the full builder with live preview and code mode.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <Link
                                  href="/pricing"
                                  className="mt-2 flex items-center gap-2 rounded-2xl px-3 py-3 text-xs font-bold text-orange-600 transition hover:bg-orange-50 dark:hover:bg-orange-500/10"
                                >
                                  <Gem className="h-4 w-4" />
                                  Upgrade for manual model selection
                                </Link>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </div>

                        <button
                          type="button"
                          aria-pressed={isAgentMode}
                          onClick={() => setIsAgentMode((value) => !value)}
                          className={cn(
                            "inline-flex h-[42px] items-center gap-2 rounded-[14px] border px-4 text-sm font-semibold shadow-sm transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/20",
                            isAgentMode
                              ? "border-slate-200 bg-white/85 text-slate-900 dark:border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-100"
                              : "border-white/70 bg-white/80 text-slate-700 hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                          )}
                        >
                          <Bot className="h-4 w-4" />
                          AI Mode
                        </button>

                        <button
                        type="button"
                        onClick={() => void launchBuilder()}
                        disabled={!prompt.trim() || isLaunchingBuilder}
                        className="inline-flex h-[52px] w-[220px] items-center justify-center gap-3 rounded-[18px] bg-gradient-to-r from-slate-950 via-slate-800 to-sky-700 px-6 text-sm font-black text-white shadow-[0_18px_40px_-18px_rgba(15,23,42,0.6)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-18px_rgba(15,23,42,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isLaunchingBuilder ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                        <span>{isLaunchingBuilder ? "Opening builder" : "Send to Builder"}</span>
                      </button>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                  {primaryPromptPrompts.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => void launchBuilder(item.prompt)}
                      disabled={isLaunchingBuilder}
                      className="rounded-2xl border border-sky-100 bg-white/82 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/30 disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15 dark:hover:text-white"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {[
                    {
                      title: "Chat-first creation",
                      copy: "Start in a large prompt composer, then move into a conversation-driven builder with persistent history.",
                    },
                    {
                      title: "Live preview workspace",
                      copy: "Generate sites and apps into a split-screen environment with instant preview and code inspection.",
                    },
                    {
                      title: "Responsive builder modes",
                      copy: "Switch between preview, code, desktop, tablet, and mobile views without leaving the workspace.",
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className="rounded-[24px] border border-white/80 bg-white/65 p-5 shadow-[0_20px_45px_-30px_rgba(148,163,184,0.9)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
                    >
                      <p className="text-sm font-black text-slate-900 dark:text-white">{card.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{card.copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {isLaunchingBuilder ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.55),_rgba(255,255,255,0.92))] backdrop-blur-md"
              >
                <div className="flex h-full items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.94, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-[28px] border border-white/80 bg-white/80 px-8 py-6 text-center shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#0b0f16]/80"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                    <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-sky-700 dark:text-sky-200">
                      Launching Builder
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      Opening chat, live preview, and realtime generation workspace.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}




