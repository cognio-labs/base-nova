"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeHelp,
  Check,
  ChevronDown,
  Headphones,
  Rocket,
  ShieldCheck,
  Star,
  UserRound,
  Wrench,
  Zap,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "19",
    credits: "120",
    integCredits: "3k",
    cta: "Get Starter",
    highlight: "Best for trying LokoAI",
    features: [
      "Unlimited apps and superagents",
      "Built-in integrations",
      "2-way GitHub sync",
      "Email support",
    ],
    icon: Star,
    popular: false,
  },
  {
    name: "Builder",
    price: "39",
    credits: "300",
    integCredits: "12k",
    cta: "Get Builder",
    highlight: "Best for solo founders",
    features: [
      "Unlimited apps and superagents",
      "Unlimited collaborators with shared credits",
      "Custom domain",
      "Remove LokoAI branding",
      "Built-in integrations",
      "Automations",
      "Choose your AI model",
      "In-app code editing",
    ],
    icon: Rocket,
    popular: true,
  },
  {
    name: "Pro",
    price: "79",
    credits: "650",
    integCredits: "25k",
    cta: "Get Pro",
    highlight: "Best for growing product teams",
    features: [
      "Everything in Builder",
      "Private templates",
      "Priority generations",
      "Advanced workflow automations",
      "Team sharing controls",
      "Faster support turnaround",
    ],
    icon: Zap,
    popular: false,
  },
  {
    name: "Elite",
    price: "149",
    credits: "1.5k",
    integCredits: "60k",
    cta: "Get Elite",
    highlight: "Best for agencies and scale-ups",
    features: [
      "Everything in Pro",
      "Dedicated onboarding",
      "Early feature access",
      "Premium support",
      "High-volume generation capacity",
      "Custom workspace guidance",
    ],
    icon: ShieldCheck,
    popular: false,
  },
];

const enterpriseFeatures = [
  {
    title: "Onboarding & Training",
    description:
      "Tailored onboarding plans combined with live training resources, designed to help admins and end users adopt quickly.",
    icon: Wrench,
  },
  {
    title: "Dedicated Account Team",
    description:
      "Work with a named account manager and solution engineer, providing direct guidance, escalations, and roadmap alignment.",
    icon: UserRound,
  },
  {
    title: "Priority Support, Guaranteed",
    description:
      "Get guaranteed priority assistance and defined response times from a dedicated support channel.",
    icon: Headphones,
  },
  {
    title: "Enterprise-Grade Capabilities",
    description:
      "Security, compliance, management, and monitoring features that give larger teams the control they need at scale.",
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    question: "What is LokoAI?",
    answer: [
      "LokoAI is an AI-powered platform that helps you build custom software applications without traditional coding.",
      "It turns natural language prompts into functional product experiences so founders, operators, and teams can move from idea to launch much faster.",
    ],
  },
  {
    question: "What is included in the free experience?",
    answer: [
      "You can explore the platform, test generation flows, and understand how LokoAI structures apps before committing to a paid plan.",
      "Paid plans unlock higher monthly credits, deeper integrations, and stronger collaboration and deployment capabilities.",
    ],
  },
  {
    question: "What are integration credits?",
    answer: [
      "Integration credits are used when your app connects to external tools and services such as email, analytics, storage, CRM, and automation providers.",
      "The number of integration credits in your plan helps determine how much connected workflow volume you can run each month.",
    ],
  },
  {
    question: "What types of applications can I build with LokoAI?",
    answer: [
      "You can build SaaS products, internal tools, dashboards, booking flows, portals, team workspaces, automations, and MVPs.",
      "LokoAI works especially well for founders and teams that want to validate ideas quickly and ship usable software with less engineering overhead.",
    ],
  },
  {
    question: "Who owns the applications created with LokoAI?",
    answer: [
      "Your project structure, brand direction, and business workflows remain yours.",
      "LokoAI is the creation platform, while the output is designed to support your ownership and real business use.",
    ],
  },
  {
    question: "What happens if I reach my plan limits?",
    answer: [
      "If you reach your monthly usage limits, you can upgrade to a higher plan for more credits and capacity.",
      "This keeps your app-building workflow smooth without blocking growth as your product usage increases.",
    ],
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-[#fcfcfd] px-4 py-16 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="pointer-events-none absolute left-1/2 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-[22rem] h-64 w-64 rounded-full bg-cyan-100/60 blur-3xl" />
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-sky-500">
            Flexible Pricing
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Plans that feel easy to start and strong enough to scale
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Clear monthly pricing for creators, builders, and teams who want to launch faster with LokoAI.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border bg-white/95 shadow-[0_18px_50px_rgba(148,163,184,0.16)] transition-all duration-300 ${
                plan.popular
                  ? "border-sky-300 shadow-[0_24px_60px_rgba(14,165,233,0.18)]"
                  : "border-slate-200/80 hover:border-sky-200 hover:shadow-[0_24px_60px_rgba(56,189,248,0.12)]"
              }`}
            >
              <div className="pointer-events-none absolute inset-x-6 top-0 h-24 rounded-b-[2rem] bg-gradient-to-b from-sky-100/70 to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
              {plan.popular && (
                <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-sky-400 to-cyan-300 py-2 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-slate-950">
                  Most Popular
                </div>
              )}

              <div className={`flex h-full flex-col p-7 ${plan.popular ? "pt-14" : ""}`}>
                <div className="mb-6">
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border ${
                      plan.popular
                        ? "border-sky-200 bg-sky-50 text-sky-500 shadow-[0_12px_30px_rgba(56,189,248,0.18)]"
                        : "border-slate-200 bg-slate-50 text-slate-500 group-hover:border-sky-200 group-hover:bg-sky-50 group-hover:text-sky-500"
                    }`}
                  >
                    <plan.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{plan.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{plan.highlight}</p>
                </div>

                <div className="border-y border-slate-200/80 py-6">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-semibold tracking-tight text-slate-950">${plan.price}</span>
                    <span className="pb-1 text-base text-slate-400">/mo</span>
                  </div>
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-sky-50/80 p-4 shadow-inner shadow-white">
                    <p className="text-sm font-medium text-slate-900">
                      {plan.credits} Monthly credits <span className="text-slate-400">/mo</span>
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {plan.integCredits} Integration credits <span className="text-slate-400">/mo</span>
                    </p>
                  </div>
                </div>

                <button
                  className={`mt-6 rounded-xl py-3 text-sm font-semibold transition ${
                    plan.popular
                      ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-200 hover:from-sky-600 hover:to-cyan-500"
                      : "border border-slate-300 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
                  }`}
                >
                  {plan.cta}
                </button>

                <div className="mt-6 border-t border-slate-200/80 pt-5">
                  <p className="mb-4 text-sm font-semibold text-slate-900">Plan highlights:</p>
                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50">
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        <span className="text-sm leading-6 text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="mt-18 space-y-6">
          <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-sky-100 bg-white p-8 shadow-[0_24px_60px_rgba(56,189,248,0.12)] lg:grid-cols-[1.05fr_1.45fr] lg:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-sky-100/70 to-transparent" />
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-500">Enterprise</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">LokoAI for Enterprise</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
                  Empower larger organizations to build solutions that fit their teams perfectly, safely, and at scale.
                </p>
              </div>
              <button className="mt-8 w-fit rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-600 hover:to-cyan-500">
                Contact Us
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {enterpriseFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="rounded-2xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/80 p-5 shadow-[0_12px_30px_rgba(148,163,184,0.08)]"
                >
                  <feature.icon className="h-5 w-5 text-sky-500" />
                  <h3 className="mt-4 text-base font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-[1.75rem] border border-sky-100 bg-gradient-to-r from-white via-sky-50 to-cyan-100 px-6 py-5 shadow-[0_18px_45px_rgba(56,189,248,0.12)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-500 shadow-[0_12px_30px_rgba(56,189,248,0.14)]">
                <BadgeHelp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
                  Student or teacher? Get up to 50% off Starter or Builder plan
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Verify your academic email to unlock discounted pricing.
                </p>
              </div>
            </div>
            <button className="flex h-12 w-12 items-center justify-center self-end rounded-full bg-sky-500 text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600 sm:self-auto">
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </section>

        <section className="mx-auto mt-18 max-w-6xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-500">Support</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-slate-200 rounded-[2rem] border border-sky-100 bg-white px-6 shadow-[0_18px_50px_rgba(56,189,248,0.08)]">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div key={faq.question} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="text-lg font-medium text-slate-950 sm:text-xl">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 text-sky-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-4 max-w-5xl space-y-3 pr-2 text-sm leading-7 text-slate-600">
                      {faq.answer.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
