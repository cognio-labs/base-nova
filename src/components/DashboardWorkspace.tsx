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
  Rocket,
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
  { label: "Integrations", icon: Plug },
  { label: "Partners", icon: Users },
  { label: "Launchpad", icon: Rocket },
  { label: "Affiliate", icon: Briefcase },
  { label: "Pricing", icon: Sparkles },
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
    <div className="min-h-screen bg-white text-slate-900">
      <div className="grid min-h-[calc(100vh-5rem)] grid-cols-1 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden border-r border-slate-100 bg-white p-4 md:block">
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-100">
                <Grid2X2 className="h-4 w-4" />
              </div>
              Apps
            </button>
            <button className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg">
                <Bot className="h-4 w-4" />
              </div>
              Superagents
            </button>
          </div>

          <div className="mt-8 space-y-1">
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Navigation</h3>
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                  item.active 
                  ? "bg-sky-50 text-sky-600" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className={`h-4 w-4 ${item.active ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-1">
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Project</h3>
            <button className="flex w-full items-center justify-between px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              Favorites <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
            </button>
            <button className="flex w-full items-center justify-between px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              Recents <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
            </button>
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
                What will you build next?
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
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                        <Plus className="h-5 w-5" />
                      </button>
                      <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                        <Settings2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plan</span>
                        <div className="h-4 w-8 rounded-full bg-slate-100 p-0.5">
                          <div className="h-3 w-3 rounded-full bg-slate-400" />
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-900 transition-colors">
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

          {/* Bottom Card */}
          <div className="absolute bottom-0 left-1/2 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 rounded-t-[2.5rem] border-x border-t border-slate-100 bg-white p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <button type="button" className="text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-1">
                  Recent apps
                </button>
                <button type="button" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  Templates
                </button>
              </div>
              <button type="button" className="flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors">
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {["CryptoPulse", "CRM Pipeline", "Booking Hub"].map((app) => (
                <div key={app} className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 transition-all hover:border-sky-100 hover:shadow-xl hover:shadow-sky-500/5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-sky-50 transition-colors">
                    <Sparkles className="h-5 w-5 text-sky-500" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{app}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
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
