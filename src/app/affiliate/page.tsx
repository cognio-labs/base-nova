"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  DollarSign, 
  Zap, 
  Headphones, 
  ArrowRight,
  Sparkles,
  Trophy
} from "lucide-react";
import Footer from "@/components/Footer";

export default function AffiliatePage() {
  const faqs = [
    {
      q: "How do I join the affiliate program?",
      a: "To join our affiliate program, simply click the 'Join now' button above and complete the sign-up process on our affiliate platform. Your account will be reviewed and you'll receive further instructions."
    },
    {
      q: "How and when do I get paid?",
      a: "We process payments monthly for all commissions earned in the previous month through a third party payment solution, you can withdraw the funds directly to your bank account. The minimum payout threshold is $300."
    },
    {
      q: "What is the commission rate?",
      a: "We offer a fixed $100 commission for each successful referral. High-performing affiliates have the opportunity to earn even more."
    },
    {
      q: "What is the cookie window?",
      a: "We offer a 30 day cookie window."
    },
    {
      q: "Do you provide marketing materials?",
      a: "Yes! After your signup is approved, you'll receive access to our marketing materials including banners, email templates, product images, and detailed product information to help you promote effectively."
    },
    {
      q: "How can I contact the affiliate team?",
      a: "You can reach out to the affiliate team at this email address: affiliates@lokoai.com"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden relative selection:bg-sky-100 selection:text-sky-900">
      {/* Refined Premium Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00BFFF]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#00BFFF]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12 lg:px-8">
        {/* Elegant Back Link */}
        <div className="mb-16">
          <button 
            onClick={() => window.history.back()} 
            className="group flex items-center gap-2.5 text-[11px] font-bold text-slate-400 hover:text-sky-600 transition-all uppercase tracking-[0.2em]"
          >
             <ArrowRight className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
             Dashboard
          </button>
        </div>

        {/* Hero Section - Sleek & Balanced */}
        <section className="mb-24">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white/50 p-10 md:p-20 text-center shadow-[0_40px_100px_-20px_rgba(0,191,255,0.06)] backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full bg-sky-50/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-sky-600 border border-sky-100/50"
            >
              <Trophy className="h-3.5 w-3.5" />
              Affiliate Program
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl lg:text-7xl"
            >
              Partner with <span className="text-sky-500">LokoAI</span>
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
              className="mx-auto mb-10 max-w-xl text-base md:text-lg leading-relaxed text-slate-500"
            >
              Empower builders with the world's most advanced AI platform. Share LokoAI and earn $100 for every successful referral.
            </motion.p>
            
            {/* Sleek Watery Button */}
            <motion.button 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950 px-8 py-4 text-sm font-bold text-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              Join the program
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </section>

        {/* Reasons Section - Refined Cards */}
        <section className="mb-24">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "$100 Commission",
                desc: "Earn a high fixed commission for every new paid subscriber.",
                icon: DollarSign,
              },
              {
                title: "Reliable Payouts",
                desc: "Get your earnings monthly with total transparency and no delays.",
                icon: Zap,
              },
              {
                title: "Priority Support",
                desc: "Direct access to our team for all the marketing assets you need.",
                icon: Headphones,
              }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col items-start rounded-3xl border border-slate-100 bg-white/50 p-8 text-left backdrop-blur-lg transition-all hover:border-sky-200 hover:shadow-xl hover:shadow-sky-500/5"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-500 transition-transform group-hover:scale-110">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-950">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Process Section - Sophisticated Dark Box */}
        <section className="mb-24">
          <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/20 blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 blur-[120px] pointer-events-none" />
            <div className="relative z-10 grid gap-10 md:grid-cols-4">
              {[
                { step: "01", title: "Apply", desc: "Quick sign up." },
                { step: "02", title: "Share", desc: "Use your link." },
                { step: "03", title: "Track", desc: "Real-time stats." },
                { step: "04", title: "Earn", desc: "Monthly payouts." }
              ].map((item) => (
                <div key={item.step} className="group">
                  <span className="mb-4 block text-4xl font-black bg-gradient-to-br from-sky-400 to-cyan-300 bg-clip-text text-transparent tabular-nums drop-shadow-sm">{item.step}</span>
                  <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section - Clean & Minimal */}
        <section className="mb-24 max-w-3xl mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-slate-950">Common Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FaqItem key={index} faq={faq} />
            ))}
          </div>
        </section>

        {/* Final CTA - Elegant & Light */}
        <section className="text-center pb-12">
          <div className="inline-block rounded-[2.5rem] border border-sky-100 bg-sky-50/30 p-10 md:p-16 backdrop-blur-xl">
             <h2 className="mb-8 text-3xl font-bold text-slate-950">Ready to start earning?</h2>
             <button className="group relative overflow-hidden rounded-xl bg-sky-500 px-10 py-3.5 text-sm font-bold text-white shadow-[0_15px_30px_rgba(0,191,255,0.25)] transition-all hover:scale-105 active:scale-95">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent)]" />
               Join Now <ArrowRight className="ml-2 inline h-4 w-4 transition-transform group-hover:translate-x-1" />
             </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? "border-sky-200 bg-white shadow-lg shadow-sky-500/5" : "border-slate-100 bg-white/50 hover:border-sky-100"}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <span className="text-sm font-bold text-slate-900 pr-8">{faq.q}</span>
        <ChevronDown className={`h-4 w-4 text-sky-500 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-t border-slate-50 p-5 text-xs leading-relaxed text-slate-500 bg-slate-50/20">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
