"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  DollarSign, 
  Zap, 
  Headphones, 
  ArrowRight,
  Sparkles
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
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900">
      {/* Background Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-sky-100/50 blur-[100px] opacity-70" />
        <div className="absolute -right-20 top-1/4 h-[500px] w-[500px] rounded-full bg-indigo-100/30 blur-[100px] opacity-50" />
        <div className="absolute left-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan-100/40 blur-[100px] opacity-40" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-1.5 text-xs font-bold text-sky-600 border border-sky-100"
          >
            <Sparkles className="h-4 w-4" />
            Empower Builders, Earn Rewards
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-6xl font-bold tracking-tight text-slate-950 md:text-8xl"
          >
            Join our affiliate program
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-600"
          >
            Become a LokoAI affiliate leader! Share your unique referral link, empower creators to join our community, and earn a highly competitive commission for each new subscriber you recruit.
          </motion.p>
          <motion.button 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3 }}
            className="rounded-full bg-[#d9ff66] px-14 py-5 text-xl font-black text-slate-950 shadow-[0_20px_50px_rgba(217,255,102,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            Join now
          </motion.button>
        </div>
      </section>

      {/* Reasons Section */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6 text-5xl font-bold tracking-tight text-slate-950">Reasons to join our program</h2>
          <p className="mb-20 text-lg text-slate-500">Earn while empowering more creators to turn their ideas into reality.</p>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Get a $100 commission",
                desc: "High-performing affiliates have the opportunity to earn even more.",
                icon: DollarSign,
                color: "from-orange-50 to-orange-100/40"
              },
              {
                title: "Unlimited referrals with fast payouts",
                desc: "Get a personal dashboard to track how you've helped us grow over time.",
                icon: Zap,
                color: "from-sky-50 to-sky-100/40"
              },
              {
                title: "Unlock expert support",
                desc: "Have questions or need help? Our dedicated affiliate team is always here to back you up.",
                icon: Headphones,
                color: "from-indigo-50 to-indigo-100/40"
              }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex flex-col items-start rounded-[3rem] bg-gradient-to-br ${item.color} p-12 text-left border border-white/60 backdrop-blur-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/5 duration-300`}
              >
                <div className="mb-10 rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <item.icon className="h-6 w-6 text-slate-950" />
                </div>
                <h3 className="mb-4 text-2xl font-bold leading-tight text-slate-950">{item.title}</h3>
                <p className="text-base text-slate-500 leading-relaxed mt-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="bg-[#0a0f1c] py-32 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-sky-500/5 blur-[120px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6 text-5xl font-bold tracking-tight">How it works</h2>
          <p className="mb-12 text-lg text-slate-400">Here&apos;s what you can expect when you become a LokoAI affiliate.</p>
          <button className="mb-32 rounded-full bg-[#d9ff66] px-10 py-4 text-sm font-black text-slate-950 transition hover:bg-[#c9ee55] shadow-lg shadow-sky-500/10">
            Join now
          </button>
          
          <div className="grid gap-16 md:grid-cols-4 text-left">
            {[
              { step: "1", title: "Sign up", desc: "Join the program, get a unique referral link, and start as soon as you're approved." },
              { step: "2", title: "Share", desc: "Promote your LokoAI projects to your network and include your personal link." },
              { step: "3", title: "Track", desc: "Monitor your referrals and conversions in real-time to see who you&apos;ve inspired." },
              { step: "4", title: "Earn", desc: "Earn a $100 commission on referrals that convert to paid users within a month from the lock in day." }
            ].map((item) => (
              <div key={item.step} className="group">
                <div className="mb-8 flex items-center gap-4">
                   <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff7b47] text-sm font-black text-white shadow-[0_0_20px_rgba(255,123,71,0.3)]">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                </div>
                <p className="text-base leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-[#fcfcfd]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-20 text-center text-5xl font-bold tracking-tight text-slate-950">FAQs</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FaqItem key={index} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative h-[650px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#ffb47a] via-[#ff9e57] to-[#ff7b47] px-4">
        {/* Background shapes */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-white blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-white blur-[100px] animate-pulse delay-700" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 w-full max-w-2xl rounded-[4rem] bg-white p-12 md:p-24 text-center shadow-[0_40px_100px_rgba(150,60,0,0.15)]"
        >
          <h2 className="mb-12 text-5xl font-bold tracking-tight text-slate-950 leading-tight">So, what are we building?</h2>
          <button className="group flex mx-auto items-center gap-3 rounded-full bg-slate-950 px-10 py-5 text-lg font-black text-white transition hover:bg-black hover:scale-105 active:scale-95 shadow-xl shadow-black/10">
            Start Building
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </section>
    </div>
  );
}

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`overflow-hidden rounded-[1.5rem] border transition-all duration-300 ${isOpen ? "border-sky-200 bg-white shadow-xl shadow-sky-500/5" : "border-slate-200 bg-white hover:border-sky-200"}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-8 text-left"
      >
        <span className="text-lg font-bold text-slate-900 pr-8">{faq.q}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all ${isOpen ? "rotate-180 bg-sky-50 text-sky-500" : ""}`}>
          <ChevronDown className="h-5 w-5" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="border-t border-slate-100 p-8 text-base leading-relaxed text-slate-500 bg-slate-50/30">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
