"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Check,
  ChevronRight,
  Command,
  Cpu,
  DatabaseZap,
  Globe2,
  Layers3,
  LockKeyhole,
  Network,
  Orbit,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Workflow,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const features = [
  { icon: Bot, title: "Agentic builder", text: "Describe a product, workflow, or page and let LokoAI assemble the first production-ready version." },
  { icon: Workflow, title: "Multi-step automation", text: "Chain research, generation, data actions, and approvals into reusable AI workflows." },
  { icon: DatabaseZap, title: "Connected memory", text: "Bring project context, integrations, and customer data into one governed AI workspace." },
  { icon: ShieldCheck, title: "Enterprise controls", text: "Role-aware access, secure project boundaries, and audit-friendly activity trails." },
  { icon: Network, title: "Model routing", text: "Route tasks across premium models with fallbacks, speed tiers, and cost-aware execution." },
  { icon: Layers3, title: "Reusable systems", text: "Save templates, components, prompts, and launch patterns that compound across teams." },
];

const stats = [
  ["2.4M", "agent actions"],
  ["38s", "avg. first draft"],
  ["99.9%", "workflow uptime"],
  ["14k+", "launches shipped"],
];

const bento = [
  { title: "Realtime canvas", text: "Preview, chat, edit, and ship from the same command surface.", className: "lg:col-span-2" },
  { title: "Smart integrations", text: "Supabase, GitHub, Slack, email, docs, CRMs, and custom APIs.", className: "" },
  { title: "Autonomous QA", text: "Ask the assistant to inspect layouts, fix copy, and validate flows.", className: "" },
  { title: "Launch analytics", text: "Track generation quality, spend, conversion, and team velocity.", className: "lg:col-span-2" },
];

const testimonials = [
  ["Ava Mitchell", "Founder, Northstar AI", "LokoAI feels like an elite product squad compressed into one beautiful interface."],
  ["Rohan Mehta", "Growth Lead, OrbitStack", "We moved from rough ideas to client-ready demos in the same afternoon."],
  ["Maya Chen", "Design Systems, Flux Labs", "The interface is fast, cinematic, and still practical enough for daily work."],
];

const pricing = [
  ["Starter", "$9", "For solo builders", ["120 monthly credits", "Unlimited projects", "Core integrations"]],
  ["Builder", "$29", "For founders", ["300 monthly credits", "Custom domains", "Advanced automations"]],
  ["Scale", "$79", "For product teams", ["1,000 monthly credits", "Team workspaces", "Priority generations"]],
];

const faqs = [
  ["Can LokoAI build real apps?", "Yes. It creates project workspaces, saves generated output, and gives you editable code-oriented flows."],
  ["Is this only for landing pages?", "No. Landing pages are one workflow. The platform also supports dashboards, agents, integrations, and automation ideas."],
  ["Can my team use reusable templates?", "Yes. The UI is designed around reusable prompts, template categories, shared projects, and launch systems."],
  ["Does it work on mobile?", "Yes. The layout is responsive with mobile-first spacing, tap targets, and simplified grids."],
];

function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -left-40 top-40 h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="absolute -right-44 top-72 h-[32rem] w-[32rem] rounded-full bg-violet-500/12 blur-3xl" />
      <div className="ai-noise absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black_35%,transparent_75%)]" />
    </div>
  );
}

function FuturisticOrb() {
  return (
    <motion.div
      animate={{ y: [0, -14, 0], rotate: [0, 3, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-auto aspect-square w-full max-w-[420px]"
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.28),rgba(34,211,238,0.18)_28%,rgba(168,85,247,0.08)_54%,transparent_72%)] shadow-[0_0_120px_rgba(34,211,238,0.22)]" />
      <div className="absolute inset-10 rounded-full border border-cyan-300/25 bg-slate-950/50 backdrop-blur-xl" />
      <div className="absolute inset-20 rounded-full border border-fuchsia-300/20" />
      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl">
        <BrainCircuit className="h-12 w-12 text-cyan-200" />
      </div>
      {[0, 1, 2].map((item) => (
        <motion.div
          key={item}
          animate={{ rotate: 360 }}
          transition={{ duration: 18 + item * 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <span
            className={cn(
              "absolute left-1/2 top-3 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-cyan-200 shadow-xl backdrop-blur-xl",
              item === 1 && "top-16 text-fuchsia-200",
              item === 2 && "top-28 text-emerald-200"
            )}
          >
            {item === 0 ? <Cpu className="h-5 w-5" /> : item === 1 ? <Command className="h-5 w-5" /> : <Orbit className="h-5 w-5" />}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function PremiumLandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#02040b] text-white">
      <Aurora />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#02040b]/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-[0_0_34px_rgba(255,255,255,0.24)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-black tracking-tight sm:text-base">LokoAI</span>
          </div>
          <div className="hidden items-center gap-6 text-sm font-semibold text-slate-400 md:flex">
            {["Features", "Pricing", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-white">{item}</a>
            ))}
          </div>
          <a href="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-xl transition hover:bg-white/15">
            Launch app <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-[1.08fr_0.92fr]">
        <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.65 }} className="text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-200">
            <Zap className="h-3.5 w-3.5" /> AI product operating system
          </div>
          <h1 className="text-5xl font-black leading-[0.94] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Build apps at the speed of thought.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg lg:mx-0">
            A cinematic AI SaaS workspace for generating products, dashboards, agents, workflows, and launch-ready pages from natural language.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <a href="/dashboard" className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-slate-950 shadow-[0_0_40px_rgba(255,255,255,0.16)] transition hover:scale-[1.02]">
              Start building <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a href="#features" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-black text-white backdrop-blur-xl transition hover:bg-white/10">
              <Play className="h-4 w-4" /> Watch demo
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
                <div className="text-2xl font-black">{value}</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="relative">
          <FuturisticOrb />
        </div>
      </section>

      <section className="relative z-10 border-y border-white/10 bg-white/[0.025] py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-4 text-sm font-black text-slate-400 sm:px-6">
          {["OpenAI", "Vercel", "Linear", "Stripe", "Framer", "Supabase", "Raycast"].map((brand) => (
            <span key={brand} className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2">{brand}</span>
          ))}
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Platform</p>
          <h2 className="text-4xl font-black tracking-tight sm:text-6xl">Everything your AI team needs.</h2>
          <p className="mt-5 text-slate-400">Reusable systems, polished interactions, and high-performance layouts designed for serious builders.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.055]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200 ring-1 ring-cyan-300/20">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {bento.map((item) => (
            <div key={item.title} className={cn("min-h-64 rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_36%),rgba(255,255,255,0.035)] p-7 backdrop-blur-xl", item.className)}>
              <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                <Globe2 className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-black">{item.title}</h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map(([name, role, quote]) => (
            <div key={name} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
              <div className="mb-4 flex gap-1 text-amber-300">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="text-sm leading-7 text-slate-300">&ldquo;{quote}&rdquo;</p>
              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="font-black">{name}</div>
                <div className="text-xs font-semibold text-slate-500">{role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black tracking-tight sm:text-6xl">Plans that scale with ambition.</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {pricing.map(([name, price, desc, items], index) => (
            <div key={name as string} className={cn("rounded-3xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur-xl", index === 1 && "border-cyan-300/40 shadow-[0_0_60px_rgba(34,211,238,0.12)]")}>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black">{name as string}</h3>
                {index === 1 && <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">Popular</span>}
              </div>
              <div className="mt-6 flex items-end gap-1"><span className="text-5xl font-black">{price as string}</span><span className="pb-2 text-slate-500">/mo</span></div>
              <p className="mt-3 text-sm text-slate-400">{desc as string}</p>
              <div className="mt-7 space-y-3">
                {(items as string[]).map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-300"><Check className="h-4 w-4 text-emerald-300" />{item}</div>
                ))}
              </div>
              <a href="/dashboard" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.02]">Choose plan</a>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="relative z-10 mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <h2 className="mb-8 text-center text-4xl font-black tracking-tight sm:text-5xl">FAQ</h2>
        <div className="space-y-3">
          {faqs.map(([question, answer]) => (
            <details key={question} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
              <summary className="cursor-pointer text-sm font-black">{question}</summary>
              <p className="mt-3 text-sm leading-7 text-slate-400">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <span className="font-black text-white">LokoAI</span>
          <span>Build apps, agents, and launch systems with AI.</span>
          <span>Security <LockKeyhole className="ml-1 inline h-3.5 w-3.5" /></span>
        </div>
      </footer>
    </div>
  );
}
