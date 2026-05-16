"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Check,
  ChevronDown,
  Gem,
  Grid2X2,
  Home,
  LayoutGrid,
  Loader2,
  Mic,
  Plug,
  Plus,
  Rocket,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import { useState, useRef } from "react";
import { useGeneratorStore } from "@/lib/store";

const creationPrompts = {
  primary: [
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
  ],
  more: [
    {
      label: "E-Commerce",
      prompt:
        "Create an e-commerce website with product grid, featured product section, cart summary, category filters, checkout call to action, and a premium shopping experience.",
    },
    {
      label: "Projects",
      prompt:
        "Create a project management web app with project overview, milestones, task progress, team members, timeline, status reporting, and a focused operations dashboard.",
    },
    {
      label: "Events & Community",
      prompt:
        "Create an events and community website with upcoming events, member highlights, RSVP flow, discussion sections, event categories, and a friendly community design.",
    },
    {
      label: "Wellness",
      prompt:
        "Create a wellness website with habit tracking, daily plans, meditation sessions, progress cards, coach recommendations, and a calm health-focused interface.",
    },
    {
      label: "Operations",
      prompt:
        "Create an operations dashboard web app with process tracking, inventory or resource status, alerts, team workload, performance metrics, and a clear command-center layout.",
    },
  ],
};

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
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showModelSelect, setShowModelSelect] = useState(false);
  const [isPlanActive, setIsPlanActive] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { generateProject, isGenerating, error } = useGeneratorStore();

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(prev => prev + (prev ? " " : "") + transcript);
    };

    recognition.start();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      alert(`Selected file: ${e.target.files[0].name}. File attachment logic will be implemented with the backend.`);
    }
  };

  const handleGenerate = async (nextPrompt = prompt) => {
    if (!nextPrompt.trim() || isGenerating) return;
    setPrompt(nextPrompt);
    setIsMoreOpen(false);
    await generateProject(nextPrompt);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="grid min-h-[calc(100vh-5rem)] grid-cols-1 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden border-r border-slate-100 bg-white p-4 md:block">
          <div className="flex flex-col gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-100">
                <Grid2X2 className="h-4 w-4" />
              </div>
              Applications
            </Link>
            <Link
              href="/generate"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg">
                <Bot className="h-4 w-4" />
              </div>
              AI Assistants
            </Link>
          </div>

          <div className="mt-8 space-y-1">
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Navigation</h3>
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                  pathname === item.href
                  ? "bg-sky-50 text-sky-600" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className={`h-4 w-4 ${pathname === item.href ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 space-y-1">
            <button
              onClick={() => setIsCommunityOpen(!isCommunityOpen)}
              className="flex w-full items-center justify-between px-4 mb-4"
            >
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Community</h3>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-300 ${isCommunityOpen ? "rotate-180" : ""}`} />
            </button>
            
            <AnimatePresence>
              {isCommunityOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1 overflow-hidden"
                >
                  {communityItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                        pathname === item.href
                          ? "bg-sky-50 text-sky-600"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 ${
                          pathname === item.href ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 space-y-1">
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Project</h3>
            <Link
              href="/projects"
              className="group flex w-full items-center justify-between px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
            >
              Pinned <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
            </Link>
            <Link
              href="/projects"
              className="group flex w-full items-center justify-between px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
            >
              Recents <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
            </Link>
          </div>
        </aside>

        {/* Main Section */}
        <section className="relative bg-[#fcfcfd]">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 pb-24 pt-16">
            {/* Toggle Header */}
            <div className="mb-12 inline-flex items-center gap-1 rounded-2xl bg-slate-100 p-1.5 shadow-inner">
              <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-bold shadow-sm border border-slate-200/50">
                <Grid2X2 className="h-4 w-4" />
                Apps
              </button>
              <button className="flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                <Bot className="h-4 w-4" />
                Superagents
                <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[9px] font-black text-sky-600 uppercase">New</span>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl"
            >
              <h1 className="mb-8 text-center text-4xl font-bold tracking-tight text-slate-900">
                The Platform for Modern Builders
              </h1>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50">
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="Describe the app you want to create..."
                    className="h-32 w-full resize-none border-0 bg-transparent px-4 py-2 text-base text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2 relative">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowModelSelect(!showModelSelect)}
                        className={`rounded-xl border border-slate-200 p-2 transition ${showModelSelect ? 'bg-sky-50 text-sky-600 border-sky-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <SlidersHorizontal className="h-5 w-5" />
                      </button>

                      {/* AI Model Dropdown */}
                      <AnimatePresence>
                        {showModelSelect && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute top-full mt-2 left-0 w-64 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl z-50 overflow-hidden"
                          >
                            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              Select AI Model
                            </div>
                            <div className="group relative flex items-start gap-2.5 rounded-lg bg-slate-50 p-3 border border-slate-100">
                              <div className="mt-0.5 rounded-md bg-white p-1 shadow-sm">
                                <Sparkles className="h-3.5 w-3.5 text-slate-900" />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-bold text-slate-900">Automatic</div>
                                <div className="text-[10px] leading-tight text-slate-500 mt-0.5">
                                  Matched with the best model for your request
                                </div>
                              </div>
                              <Check className="mt-1 h-3 w-3 text-slate-900" />
                            </div>
                            
                            <div className="my-1.5 border-t border-slate-100" />
                            
                            <Link 
                              href="/pricing"
                              className="flex items-center gap-2.5 rounded-lg p-3 transition-colors hover:bg-orange-50"
                            >
                              <div className="rounded-md bg-orange-100 p-1">
                                <Gem className="h-3.5 w-3.5 text-orange-600" />
                              </div>
                              <span className="text-xs font-bold text-orange-600">
                                Upgrade to select an AI model
                              </span>
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Plan Toggle */}
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-2">
                        <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${isPlanActive ? 'text-sky-600' : 'text-slate-400'}`}>
                          Plan
                        </span>
                        <button 
                          onClick={() => setIsPlanActive(!isPlanActive)}
                          className={`relative h-5 w-10 rounded-full transition-colors duration-300 ${isPlanActive ? 'bg-sky-500' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute left-1 top-1 h-3 w-3 rounded-full bg-white transition-transform duration-300 ${isPlanActive ? 'translate-x-5' : 'translate-x-0 shadow-sm'}`} />
                        </button>
                      </div>

                      <button 
                        onClick={startVoiceInput}
                        className={`transition-all duration-300 ${isListening ? 'text-sky-500 scale-125 animate-pulse' : 'text-slate-400 hover:text-slate-900'}`}
                      >
                        <Mic className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGenerate()}
                        disabled={isGenerating || !prompt.trim()}
                        className="flex items-center justify-center rounded-xl bg-slate-900 p-3 text-white shadow-lg transition hover:bg-black disabled:opacity-50"
                      >
                        {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {creationPrompts.primary.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleGenerate(item.prompt)}
                      disabled={isGenerating}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 disabled:opacity-50"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsMoreOpen((open) => !open)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
                    >
                      ... More
                    </button>
                    <AnimatePresence>
                      {isMoreOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full left-0 z-50 mb-4 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
                        >
                          {creationPrompts.more.map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => handleGenerate(item.prompt)}
                              className="block w-full rounded-lg px-4 py-2.5 text-left text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            >
                              {item.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100 text-center">
                  {error}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
