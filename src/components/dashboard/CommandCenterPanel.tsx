"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Bell,
  Bot,
  ChartSpline,
  CheckCircle2,
  Command,
  Gauge,
  MessageSquare,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserCircle2,
  Zap,
} from "lucide-react";

const metrics = [
  { label: "Active agents", value: "18", icon: Bot, tone: "text-cyan-200" },
  { label: "Launch velocity", value: "4.8x", icon: Zap, tone: "text-fuchsia-200" },
  { label: "Success rate", value: "99%", icon: ShieldCheck, tone: "text-emerald-200" },
  { label: "Credits used", value: "42k", icon: Gauge, tone: "text-orange-200" },
];

const activity = [
  "Fintech landing page moved to preview",
  "AI assistant generated conversion copy",
  "Security checklist completed",
  "Team template synced to workspace",
];

export default function CommandCenterPanel() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="grid gap-4 lg:grid-cols-[260px_1fr_320px]">
        <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
              <Command className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-black text-white">Command Center</p>
              <p className="text-[11px] text-slate-500">AI workspace</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              ["Dashboard", Activity],
              ["Search", Search],
              ["Notifications", Bell],
              ["Profile", UserCircle2],
              ["Settings", Settings2],
            ].map(([label, Icon]) => (
              <button
                key={label as string}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                {label as string}
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl"
              >
                <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ${metric.tone}`}>
                  <metric.icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-black text-white">{metric.value}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{metric.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_35%),rgba(255,255,255,0.035)] p-6 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Analytics pulse</h2>
                <p className="text-sm text-slate-500">Generated launches, agent actions, and conversion lift.</p>
              </div>
              <ChartSpline className="h-5 w-5 text-cyan-200" />
            </div>
            <div className="flex h-52 items-end gap-2">
              {[38, 52, 44, 78, 62, 92, 74, 108, 86, 118, 96, 132].map((height, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  whileInView={{ height }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.035, duration: 0.5 }}
                  className="flex-1 rounded-t-xl bg-gradient-to-t from-cyan-500/30 via-fuchsia-400/40 to-white/80 shadow-[0_0_20px_rgba(34,211,238,0.16)]"
                />
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-300/10 text-fuchsia-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white">AI assistant</h2>
                <p className="text-xs text-slate-500">Ready for commands</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-7 text-slate-300">
              I can review layouts, create variations, write launch copy, or turn a rough prompt into a production flow.
            </div>
            <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.02]">
              <MessageSquare className="h-4 w-4" />
              Ask assistant
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
            <h2 className="mb-4 text-sm font-black text-white">Activity feed</h2>
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item} className="flex gap-3 text-sm text-slate-400">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
