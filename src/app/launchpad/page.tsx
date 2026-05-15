"use client";

import { motion } from "framer-motion";
import { Rocket, Trophy, Vote, Calendar, ArrowRight, Star } from "lucide-react";

export default function LaunchpadPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
        <div className="flex-1 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-500 mb-6 uppercase tracking-wider">
            Coming Soon
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Give your app its <br />
            <span className="brand-text-gradient">launch moment</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-xl">
            Submit your published app to LokoAI's weekly showcase, where the community can discover it, vote for it, and help it reach new users.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 brand-btn rounded-2xl font-bold shadow-xl shadow-orange-500/20">
              Submit Your App
            </button>
            <button className="px-8 py-4 glass rounded-2xl font-bold hover:bg-white/5 transition-colors">
              Learn More
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative">
           <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-purple-500/20 blur-3xl rounded-full" />
           <div className="relative glass p-8 rounded-3xl border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="font-bold">Next Voting Cycle</span>
                </div>
                <div className="px-3 py-1 rounded-lg bg-orange-500 text-white text-xs font-bold">
                  Starts Monday
                </div>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-white/10" />
                    <div className="flex-1">
                      <div className="h-3 w-24 bg-white/20 rounded mb-2" />
                      <div className="h-2 w-16 bg-white/10 rounded" />
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Vote className="w-4 h-4" />
                      <span className="text-xs">0</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="glass p-8 rounded-3xl border-white/5">
           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
           </div>
           <h3 className="text-xl font-bold mb-3">200 Credits</h3>
           <p className="text-sm text-gray-500">First place winner receives a massive boost to their AI limits.</p>
        </div>
        <div className="glass p-8 rounded-3xl border-white/5">
           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
              <Trophy className="w-6 h-6 text-gray-400" />
           </div>
           <h3 className="text-xl font-bold mb-3">100 Credits</h3>
           <p className="text-sm text-gray-500">Second place keeps the momentum going with extra power.</p>
        </div>
        <div className="glass p-8 rounded-3xl border-white/5">
           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6 text-orange-500" />
           </div>
           <h3 className="text-xl font-bold mb-3">50 Credits</h3>
           <p className="text-sm text-gray-500">Third place rewards for our community's favorite builders.</p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          {[
            { step: 1, title: "Submit", desc: "Pick a public app and add details." },
            { step: 2, title: "Collect Votes", desc: "Share your launch with your network." },
            { step: 3, title: "Win Spotlight", desc: "Top 3 builders earn free credits." }
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full brand-btn flex items-center justify-center font-bold text-white mb-4">
                {item.step}
              </div>
              <h4 className="font-bold mb-2">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
