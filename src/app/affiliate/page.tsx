"use client";

import { Trophy, DollarSign, Zap, BarChart3, HelpCircle } from "lucide-react";

export default function AffiliatePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="relative glass p-12 md:p-20 rounded-[3rem] overflow-hidden mb-24 border-white/10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Become a LokoAI <br />
            <span className="brand-text-gradient">Affiliate Leader</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Share your unique referral link, empower creators to join our community, and earn a highly competitive commission for each new subscriber you recruit.
          </p>
          <button className="px-10 py-5 brand-btn rounded-2xl font-bold text-lg shadow-2xl shadow-orange-500/30">
            Join Now
          </button>
        </div>
      </div>

      <div className="mb-32">
        <h2 className="text-3xl font-bold text-center mb-16">Reasons to join our program</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: DollarSign, title: "Earn while empowering", desc: "Help creators turn ideas into reality while you earn." },
            { icon: Trophy, title: "$100 Commission", desc: "Get a fixed high commission for every paid user." },
            { icon: Zap, title: "Fast Payouts", desc: "Unlimited referrals with reliable monthly payouts." },
            { icon: BarChart3, title: "Track Growth", desc: "Personal dashboard to monitor your impact." }
          ].map((item, index) => (
            <div key={index} className="glass p-8 rounded-3xl border-white/5 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto mb-32">
        <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: "How do I join the affiliate program?", a: "Simply click the 'Join now' button and complete the sign-up process. Your account will be reviewed quickly." },
            { q: "How and when do I get paid?", a: "We process payments monthly for all commissions earned in the previous month. Minimum threshold is $300." },
            { q: "What is the commission rate?", a: "We offer a fixed $100 commission for each successful referral." },
            { q: "What is the cookie window?", a: "We offer a 30 day cookie window." }
          ].map((item, index) => (
            <div key={index} className="glass p-6 rounded-2xl border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <HelpCircle className="w-5 h-5 text-orange-500" />
                <h4 className="font-bold">{item.q}</h4>
              </div>
              <p className="text-sm text-gray-500 pl-8">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-12 rounded-[2.5rem] border-orange-500/20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start earning?</h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join hundreds of affiliates helping to grow the world&apos;s most powerful AI app builder.</p>
        <button className="px-10 py-5 brand-btn rounded-2xl font-bold shadow-xl shadow-orange-500/20">
          Sign Up Now
        </button>
      </div>
    </div>
  );
}
