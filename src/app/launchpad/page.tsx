"use client";

import { motion } from "framer-motion";
import { ArrowRight, Rocket, Sparkles, Trophy, Vote } from "lucide-react";

const prizeTiers = [
  { label: "200 credits", accent: "from-sky-500 to-cyan-400" },
  { label: "100 credits", accent: "from-sky-400 to-blue-300" },
  { label: "50 credits", accent: "from-cyan-300 to-sky-200" },
];

const steps = [
  {
    step: "1",
    title: "Submit your app",
    description:
      "Pick a public, published app, then add the details that help people discover and try it.",
  },
  {
    step: "2",
    title: "Collect votes",
    description:
      "Voting opens every Monday. Share your launch with your community to climb the leaderboard.",
  },
  {
    step: "3",
    title: "Win credits & spotlight",
    description:
      "Top 3 builders earn free credits and a featured spot on the LokoAI Launchpad.",
  },
];

export default function LaunchpadPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] px-4 py-16 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="pointer-events-none absolute left-16 top-28 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-44 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl" />

        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">Launchpad</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Showcase your app to makers and users. The most upvoted launches win credits every week.
          </p>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-[0_24px_60px_rgba(56,189,248,0.12)]">
          <div className="grid lg:grid-cols-[1fr_1fr]">
            <div className="relative p-7 sm:p-10">
              <div className="pointer-events-none absolute left-8 top-6 h-32 w-32 rounded-full bg-sky-100/70 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-sky-600">
                  Voting starts soon
                </div>
                <h2 className="mt-8 text-3xl font-semibold tracking-tight text-slate-950">
                  Give your app its launch moment
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
                  Submit your published app to LokoAI&apos;s weekly showcase, where the community can discover it,
                  vote for it, and help it reach new users.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:bg-slate-900">
                    <Rocket className="h-4 w-4" />
                    Submit your app
                  </button>
                  <button className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600">
                    Learn more
                  </button>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden border-t border-sky-100 bg-gradient-to-br from-white via-sky-50 to-sky-200/80 p-7 sm:p-10 lg:border-l lg:border-t-0">
              <div className="pointer-events-none absolute inset-x-10 top-12 h-36 rounded-full bg-sky-300/30 blur-3xl" />
              <div className="relative mx-auto flex h-full max-w-sm flex-col items-center justify-center">
                <div className="mb-6 text-center">
                  <p className="text-4xl font-semibold tracking-tight text-slate-950">Win prizes</p>
                </div>
                <div className="space-y-4">
                  {prizeTiers.map((tier, index) => (
                    <motion.div
                      key={tier.label}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.08 }}
                      className={`rounded-full border border-slate-400/70 bg-gradient-to-r px-6 py-2 text-center text-2xl font-medium text-slate-800 shadow-[0_14px_30px_rgba(148,163,184,0.12)] ${tier.accent}`}
                    >
                      <span className="rounded-full bg-white/65 px-3 py-1">{tier.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-semibold tracking-tight text-slate-950">How it works</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + index * 0.06 }}
                className="rounded-[1.5rem] border border-sky-100 bg-white p-6 shadow-[0_18px_45px_rgba(56,189,248,0.08)]"
              >
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.75rem] border border-sky-100 bg-white p-6 shadow-[0_18px_45px_rgba(56,189,248,0.08)]">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 shadow-[0_12px_30px_rgba(56,189,248,0.14)]">
                <Vote className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-slate-950">Weekly spotlight voting</p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                  Every launch gets a fair shot. Share your app, collect votes, and build momentum with the LokoAI
                  community.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-sky-100 bg-gradient-to-r from-white via-sky-50 to-cyan-100 p-6 shadow-[0_18px_45px_rgba(56,189,248,0.1)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold tracking-tight text-slate-950">More than credits</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Winners also get visibility, credibility, and a stronger first impression with future users.
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-200">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3 text-sm font-medium text-slate-700">
              <Sparkles className="h-4 w-4 text-sky-500" />
              Featured placement on LokoAI Launchpad
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm font-medium text-slate-700">
              <Trophy className="h-4 w-4 text-sky-500" />
              Extra momentum for your next product update
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
