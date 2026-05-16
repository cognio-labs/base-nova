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
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden relative">
      {/* Premium Dashboard-style Background: White with Asmani (Sky Blue) Blurs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#00BFFF]/15 blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#00BFFF]/10 blur-[120px] opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Clean Back Link - Logo is hidden as requested */}
        <div className="mb-20">
          <button 
            onClick={() => window.history.back()} 
            className="group flex items-center gap-2 text-sm font-black text-slate-400 hover:text-sky-500 transition-colors uppercase tracking-widest"
          >
             <ArrowRight className="h-4 w-4 rotate-180" />
             Back to Dashboard
          </button>
        </div>

        {/* Hero Section Boxed with Glassmorphism */}
        <section className="mb-32">
          <div className="rounded-[4rem] border border-sky-100 bg-white/40 p-12 text-center shadow-[0_32px_80px_rgba(0,191,255,0.12)] backdrop-blur-2xl md:p-24 transition-all hover:shadow-[0_40px_100px_rgba(0,191,255,0.15)]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full bg-sky-50 px-5 py-2 text-xs font-black uppercase tracking-wider text-sky-600 border border-sky-100 shadow-sm"
            >
              <Trophy className="h-4 w-4" />
              Official Affiliate Program
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 text-6xl font-black tracking-tight text-slate-950 md:text-9xl"
            >
              Earn with <span className="text-sky-500">LokoAI</span>
            </motion.h1>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
              className="mx-auto mb-16 max-w-2xl text-xl font-medium leading-relaxed text-slate-500"
            >
              Partner with the industry's most powerful AI platform. Share your link, help others build, and get paid for every single referral.
            </motion.p>
            
            {/* Water Drop Style Button */}
            <motion.button 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-400 to-sky-600 px-16 py-6 text-2xl font-black text-white shadow-[0_25px_50px_rgba(0,191,255,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent)] opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              Join now
              <ArrowRight className="ml-3 h-7 w-7 transition-transform group-hover:translate-x-2" />
            </motion.button>
          </div>
        </section>

        {/* Reasons Section Boxed */}
        <section className="mb-32">
          <div className="rounded-[4rem] border border-sky-100 bg-white/40 p-12 backdrop-blur-2xl md:p-20 shadow-[0_20px_60px_rgba(0,191,255,0.03)]">
            <h2 className="mb-20 text-center text-4xl font-black tracking-tight text-slate-950 md:text-6xl">Why Join Us?</h2>
            <div className="grid gap-12 md:grid-cols-3">
              {[
                {
                  title: "$100 Commission",
                  desc: "Earn a high fixed commission for every referral that subscribes to a paid plan.",
                  icon: DollarSign,
                },
                {
                  title: "Fast Payouts",
                  desc: "Get your hard-earned commissions monthly with total transparency and no hidden rules.",
                  icon: Zap,
                },
                {
                  title: "Expert Support",
                  desc: "Direct access to our dedicated affiliate team for all the marketing assets you need.",
                  icon: Headphones,
                }
              ].map((item, i) => (
                <div key={item.title} className="flex flex-col items-center text-center group">
                  <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-sky-50 text-sky-500 shadow-inner transition-transform group-hover:scale-110 duration-500">
                    <item.icon className="h-10 w-10" />
                  </div>
                  <h3 className="mb-4 text-3xl font-black text-slate-950">{item.title}</h3>
                  <p className="text-lg font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section Boxed */}
        <section className="mb-32">
          <div className="rounded-[4rem] border border-slate-900 bg-[#0a0f1c] p-12 text-white shadow-3xl md:p-24 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/20 blur-[120px] transition-opacity opacity-50 group-hover:opacity-100" />
            <h2 className="mb-20 text-center text-5xl font-black md:text-7xl">The Process</h2>
            <div className="grid gap-12 md:grid-cols-4">
              {[
                { step: "01", title: "Apply", desc: "Sign up in just 2 minutes and get your link." },
                { step: "02", title: "Share", desc: "Use your unique link on social or your site." },
                { step: "03", title: "Track", desc: "Real-time dashboard for all your stats." },
                { step: "04", title: "Earn", desc: "Automated monthly payouts to your account." }
              ].map((item) => (
                <div key={item.step} className="relative p-6 rounded-3xl hover:bg-white/5 transition-colors">
                  <span className="mb-6 block text-5xl font-black text-sky-500/20">{item.step}</span>
                  <h3 className="mb-4 text-2xl font-bold">{item.title}</h3>
                  <p className="text-base leading-relaxed text-slate-400 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section Boxed */}
        <section className="mb-32">
          <div className="mx-auto max-w-4xl rounded-[4rem] border border-sky-100 bg-white/60 p-10 md:p-20 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,191,255,0.06)]">
            <h2 className="mb-16 text-center text-5xl font-black text-slate-950">Common Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <FaqItem key={index} faq={faq} />
              ))}
            </div>
          </div>
        </section>

        {/* Final Watery Call to Action */}
        <section className="text-center pb-20">
           <div className="inline-block rounded-[4rem] border border-sky-100 bg-white/50 p-16 md:p-28 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,191,255,0.08)] relative overflow-hidden">
             <div className="absolute -top-24 -left-24 w-64 h-64 bg-sky-200/30 blur-[80px]" />
             <h2 className="mb-12 text-5xl font-black text-slate-950 md:text-7xl tracking-tight">Ready to dive in?</h2>
             <button className="group relative h-24 w-72 overflow-hidden rounded-full bg-gradient-to-br from-sky-400 to-sky-600 font-black text-white shadow-[0_25px_50px_rgba(0,191,255,0.4)] transition-all hover:scale-110 active:scale-95">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent)] opacity-90" />
               <span className="relative z-10 flex items-center justify-center gap-3 text-2xl">
                 Let's go <ArrowRight className="h-8 w-8 transition-transform group-hover:translate-x-2" />
               </span>
             </button>
           </div>
        </section>
      </div>
    </div>
  );
}

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`overflow-hidden rounded-[2rem] border transition-all duration-500 ${isOpen ? "border-sky-300 bg-white shadow-2xl shadow-sky-500/10 scale-[1.02]" : "border-slate-100 bg-white/50 hover:border-sky-200"}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-8 text-left"
      >
        <span className="text-lg font-black text-slate-900 pr-10">{faq.q}</span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-500 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown className="h-6 w-6" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="border-t border-sky-50 p-8 text-lg font-medium leading-relaxed text-slate-500 bg-sky-50/10">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
