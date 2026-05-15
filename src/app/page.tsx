"use client";

import { motion } from "framer-motion";
import { Search, Mic, Plus, Settings2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            LokoAI is now in Beta
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            What will you <span className="brand-text-gradient">build</span> next?
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group mt-10"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative glass p-4 md:p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
            <div className="flex items-start gap-4">
              <textarea
                placeholder="Describe the app you want to create..."
                className="w-full bg-transparent border-none focus:ring-0 text-lg md:text-xl text-white placeholder-gray-500 resize-none min-h-[100px]"
              />
            </div>
            
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors">
                  <Settings2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Plan: Free</span>
                  <div className="w-8 h-4 bg-white/10 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-2 h-2 bg-gray-400 rounded-full" />
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-xl brand-btn shadow-lg shadow-orange-500/30">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-3"
        >
          <span className="text-sm text-gray-500 w-full mb-2">What would you like to create?</span>
          {["Tasks & Workflows", "CRM & Sales", "Content & Sites", "Finance", "Booking", "More"].map((item) => (
            <button
              key={item}
              className="px-4 py-2 rounded-lg glass-hover glass text-sm font-medium text-gray-300 border border-white/5"
            >
              {item}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Featured Apps Section Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 opacity-40">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
          <div className="w-1 h-1 rounded-full bg-gray-500" />
          Recent Apps
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
          <div className="w-1 h-1 rounded-full bg-gray-500" />
          Templates
        </div>
      </div>
    </div>
  );
}
