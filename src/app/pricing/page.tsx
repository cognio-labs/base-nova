"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

type PricingPlan = {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  highlight: string;
  credits: string;
  integCredits: string;
  features: string[];
  popular?: boolean;
  cta: string;
};

const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    monthlyPrice: 15,
    yearlyPrice: 12,
    highlight: "Best for trying LokoAI",
    credits: "120 Monthly credits",
    integCredits: "3k Integration credits",
    features: [
      "Unlimited apps and superagents",
      "Built-in integrations",
      "2-way GitHub sync",
      "Email support",
    ],
    popular: false,
    cta: "Get Starter",
  },
  {
    name: "Builder",
    monthlyPrice: 31,
    yearlyPrice: 25,
    highlight: "Best for solo founders",
    credits: "300 Monthly credits",
    integCredits: "12k Integration credits",
    features: [
      "Unlimited apps and superagents",
      "Unlimited collaborators with shared credits",
      "Custom domain & Remove branding",
      "Automations & In-app code editing",
      "Choose your favorite AI model",
    ],
    popular: true,
    cta: "Get Builder",
  },
  {
    name: "Pro",
    monthlyPrice: 63,
    yearlyPrice: 50,
    highlight: "Best for growing product teams",
    credits: "650 Monthly credits",
    integCredits: "25k Integration credits",
    features: [
      "Everything in Builder",
      "Private templates",
      "Priority generations",
      "Advanced workflow automations",
      "Team sharing controls",
      "Faster support turnaround",
    ],
    popular: false,
    cta: "Get Pro",
  },
  {
    name: "Elite",
    monthlyPrice: 119,
    yearlyPrice: 95,
    highlight: "Best for agencies and scale-ups",
    credits: "1.5k Monthly credits",
    integCredits: "60k Integration credits",
    features: [
      "Everything in Pro",
      "Dedicated onboarding",
      "Early feature access",
      "Premium support",
      "High-volume generation capacity",
      "Custom workspace guidance",
    ],
    popular: false,
    cta: "Get Elite",
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const savePercent = useMemo(() => {
    const monthlyTotal = pricingPlans.reduce((sum, p) => sum + p.monthlyPrice, 0);
    const yearlyTotal = pricingPlans.reduce((sum, p) => sum + p.yearlyPrice, 0);
    if (monthlyTotal <= 0) return null;
    const computed = Math.round((1 - yearlyTotal / monthlyTotal) * 100);
    if (!Number.isFinite(computed) || computed <= 0) return null;
    return computed;
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-80 pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-sky-400/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-cyan-400/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-sky-300/5 rounded-full blur-[160px] pointer-events-none" />

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Simple and Feasible Pricing
          </h1>
          <p className="mx-auto max-w-2xl text-slate-500 text-base sm:text-lg mb-8">
            Choose a plan that scales with your AI ambitions. No hidden fees, cancel anytime.
          </p>

          <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                !isYearly ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
              }`}
              type="button"
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isYearly ? "bg-sky-500 text-white shadow-sm" : "text-slate-500"
              }`}
              type="button"
            >
              Yearly
              {savePercent ? (
                <span className="bg-white/20 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full">
                  Save {savePercent}%
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {pricingPlans.map((plan, idx) => {
            const finalPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className={`flex flex-col overflow-hidden rounded-3xl border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 relative ${
                  plan.popular
                    ? "border-[#0ea5ff] shadow-[0_20px_50px_rgba(14,165,255,0.08)] ring-1 ring-[#0ea5ff]/10"
                    : "border-slate-200/80"
                }`}
              >
                {plan.popular && (
                  <div className="absolute inset-x-0 top-0 bg-[#0ea5ff] py-2 text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-white">
                    MOST POPULAR
                  </div>
                )}

                <div className={`p-6 flex flex-col justify-between h-full ${plan.popular ? "pt-12" : "pt-8"}`}>
                  <div>
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold tracking-tight text-slate-950">{plan.name}</h2>
                      <p className="mt-1 text-xs text-slate-500 font-semibold">{plan.highlight}</p>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-4xl font-extrabold text-slate-950">${finalPrice}</span>
                        <span className="text-xs text-slate-400">/mo</span>
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 py-3.5 px-4 text-left shadow-sm">
                        <p className="text-xs font-bold text-slate-800">{plan.credits}</p>
                        <p className="text-xs font-bold text-slate-800 mt-1">{plan.integCredits}</p>
                      </div>
                    </div>

                    <div className="space-y-3.5 mb-8">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        PLAN BENEFITS
                      </p>
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <div className="h-4.5 w-4.5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/20">
                            <Check className="h-2.5 w-2.5 text-emerald-500" />
                          </div>
                          <span className="text-xs text-slate-600 leading-relaxed font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className={`w-full rounded-2xl py-3.5 text-xs font-extrabold transition-all cursor-pointer ${
                      plan.popular
                        ? "bg-[#0ea5ff] text-white shadow-md shadow-[#0ea5ff]/20 hover:opacity-90 active:scale-95"
                        : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 active:scale-95"
                    }`}
                    type="button"
                  >
                    {plan.cta}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}