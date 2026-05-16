"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Clock,
  Grid2X2,
  Home,
  LayoutGrid,
  Loader2,
  Mic,
  Plug,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
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
  { label: "Home", icon: Home, active: true },
  { label: "All apps", icon: LayoutGrid },
  { label: "Community", icon: Users },
  { label: "Templates", icon: Briefcase },
];

export default function DashboardWorkspace() {
  const [prompt, setPrompt] = useState("");
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { generateProject, isGenerating, error } = useGeneratorStore();

  const handleGenerate = async (nextPrompt = prompt) => {
    if (!nextPrompt.trim() || isGenerating) return;
    setPrompt(nextPrompt);
    setIsMoreOpen(false);
    await generateProject(nextPrompt);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f6f5f3] text-slate-950">
      <div className="grid min-h-[calc(100vh-5rem)] grid-cols-1 md:grid-cols-[168px_1fr]">
        <aside className="hidden border-r border-black/5 bg-white/70 p-2 md:block">
          <div className="space-y-1 rounded-lg bg-[#f2f0ed] p-1">
            <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-bold shadow-sm">
              <Grid2X2 className="h-4 w-4" />
              Apps
            </div>
            <div className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold">
              <Bot className="h-4 w-4" />
              Superagents
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex items-center gap-2 px-3 py-3 text-xs font-semibold">
              <Search className="h-4 w-4" />
              Search
            </div>
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-semibold transition ${
                  item.active ? "bg-[#ebe8e4]" : "hover:bg-[#ebe8e4]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-1 px-3 text-xs text-slate-500">
            <div className="flex items-center justify-between py-2">
              Favorites <span>›</span>
            </div>
            <div className="flex items-center justify-between py-2">
              Recents <span>›</span>
            </div>
          </div>
        </aside>

        <section className="relative overflow-hidden bg-gradient-to-b from-[#f4f3f1] via-[#ffe1c7] to-[#ff8a55]">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-24 pt-10 md:pt-12">
            <div className="mb-16 inline-flex items-center gap-2 rounded-xl bg-white/80 p-1 text-xs font-bold shadow-lg shadow-black/5">
              <button type="button" className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm">
                <Grid2X2 className="h-4 w-4" />
                Apps
              </button>
              <button type="button" className="flex items-center gap-2 rounded-lg px-3 py-2">
                <Bot className="h-4 w-4" />
                Superagents
              </button>
              <span className="rounded-md bg-indigo-100 px-2 py-1 text-[10px] text-indigo-600">New</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-[548px]"
            >
              <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight md:text-3xl">
                What will you build next?
              </h1>

              <div className="rounded-xl border border-white/80 bg-white/25 p-3 shadow-[0_20px_70px_rgba(145,80,30,0.16)] backdrop-blur">
                <div className="rounded-xl bg-white shadow-sm">
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="Describe the app you want to create..."
                    className="h-24 w-full resize-none rounded-t-xl border-0 bg-transparent px-4 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <div className="flex items-center justify-between px-3 pb-3">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-slate-200 p-2 transition hover:bg-slate-50">
                        <Plus className="h-4 w-4" />
                      </button>
                      <button type="button" className="rounded-md border border-slate-200 p-2 transition hover:bg-slate-50">
                        <Settings2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold">Plan</span>
                      <span className="h-4 w-8 rounded-full bg-slate-200">
                        <span className="block h-4 w-4 rounded-full bg-white shadow" />
                      </span>
                      <Mic className="h-4 w-4 text-slate-700" />
                      <button
                        type="button"
                        onClick={() => handleGenerate()}
                        disabled={isGenerating || !prompt.trim()}
                        className="rounded-lg bg-black p-2.5 text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-left">
                  <p className="mb-2 text-[10px] font-medium text-slate-600">
                    What would you like to create?
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {creationPrompts.primary.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleGenerate(item.prompt)}
                        disabled={isGenerating}
                        className="rounded-md bg-white px-3 py-2 text-[11px] font-bold shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        {item.label}
                      </button>
                    ))}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsMoreOpen((open) => !open)}
                        className="rounded-md bg-white px-3 py-2 text-[11px] font-bold shadow-sm transition hover:bg-slate-50"
                        aria-expanded={isMoreOpen}
                        aria-haspopup="menu"
                      >
                        ... More
                      </button>
                      <AnimatePresence>
                        {isMoreOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="absolute left-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-xl"
                          >
                            {creationPrompts.more.map((item) => (
                              <button
                                key={item.label}
                                type="button"
                                onClick={() => handleGenerate(item.prompt)}
                                className="block w-full px-3 py-2 text-left text-xs font-medium hover:bg-slate-50"
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
              </div>

              {error && (
                <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                  {error}
                </div>
              )}
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-1/2 w-[min(78rem,calc(100%-2rem))] -translate-x-1/2 rounded-t-2xl bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button type="button" className="rounded-md border border-slate-200 px-3 py-2 text-xs font-bold">
                  Recent apps
                </button>
                <button type="button" className="rounded-md px-3 py-2 text-xs font-bold hover:bg-slate-50">
                  Templates
                </button>
              </div>
              <button type="button" className="flex items-center gap-2 text-xs font-semibold">
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {["CryptoPulse", "CRM Pipeline", "Booking Hub"].map((app) => (
                <div key={app} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Sparkles className="h-4 w-4 text-orange-500" />
                  </div>
                  <h3 className="text-sm font-bold">{app}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    Recently generated
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
