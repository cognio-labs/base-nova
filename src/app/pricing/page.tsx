"use client";

import { motion } from "framer-motion";
import { Check, Zap, Rocket, Star, ShieldCheck } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "16",
    credits: "100",
    integCredits: "2k",
    features: ["Unlimited apps", "Built-in integrations", "2-way GitHub sync"],
    icon: Star,
    popular: false
  },
  {
    name: "Builder",
    price: "40",
    credits: "250",
    integCredits: "10k",
    features: ["Unlimited apps", "Custom domain", "Remove LokoAI branding", "2-way GitHub sync"],
    icon: Rocket,
    popular: true
  },
  {
    name: "Pro",
    price: "80",
    credits: "500",
    integCredits: "20k",
    features: ["Everything in Builder", "In-app code editing", "Private templates", "Priority support"],
    icon: Zap,
    popular: false
  },
  {
    name: "Elite",
    price: "160",
    credits: "1.2k",
    integCredits: "60k",
    features: ["Everything in Pro", "Choose your AI model", "Early access to features", "Dedicated support"],
    icon: ShieldCheck,
    popular: false
  }
];

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Choose the plan that&apos;s <span className="brand-text-gradient">right for you</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Simple, transparent pricing for teams of all sizes. Built on trust and scaled for performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative glass p-8 rounded-[2rem] flex flex-col border-white/5 hover:border-white/10 transition-all ${
              plan.popular ? "border-orange-500/30 scale-105 shadow-2xl shadow-orange-500/10 z-10" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full brand-btn text-[10px] font-bold uppercase tracking-widest">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <plan.icon className={`w-6 h-6 ${plan.popular ? "text-orange-500" : "text-gray-400"}`} />
              </div>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Monthly Credits</span>
                <span className="text-lg font-bold text-white">{plan.credits}</span>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Integration Credits</span>
                <span className="text-lg font-bold text-white">{plan.integCredits}</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 mb-8">
              {plan.features.map(feat => (
                <div key={feat} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-green-500" />
                  </div>
                  <span className="text-sm text-gray-400 leading-tight">{feat}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-4 rounded-2xl font-bold transition-all ${
              plan.popular ? "brand-btn shadow-lg shadow-orange-500/20" : "glass hover:bg-white/5"
            }`}>
              Get {plan.name}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
