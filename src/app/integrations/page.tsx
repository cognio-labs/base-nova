"use client";

import { integrations } from "@/data/integrations";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ExternalLink,
  Plug,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Connectors", "AI Tools", "Analytics", "Marketing"];

  const filteredIntegrations = integrations.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         i.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || i.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-500">
      {/* Main Content - No Sidebar */}
      <main className="p-6 md:p-12 lg:p-20 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-16 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-widest mb-6 border border-sky-500/20 shadow-sm"
            >
              <Plug className="w-4 h-4" />
              Connect & Automate
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              Integrations <span className="brand-text-gradient">Catalog</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-gray-400 leading-relaxed max-w-3xl mb-12">
              Supercharge your Superagents by connecting to over 100+ professional tools and APIs. 
              Seamless data flow, automated workflows, and infinite possibilities.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-4xl">
              <div className="relative w-full group">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative flex items-center">
                  <Search className="absolute left-5 w-6 h-6 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search 100+ tools (e.g. Stripe, Notion, Slack...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-3xl text-base focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all shadow-2xl shadow-slate-200/50 dark:shadow-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                  activeCategory === cat 
                  ? "bg-sky-500 border-sky-500 text-white shadow-xl shadow-sky-500/20" 
                  : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:border-sky-500/50 hover:text-sky-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredIntegrations.map((item, index) => (
                <IntegrationCard key={item.name} item={item} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {filteredIntegrations.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No integrations found</h3>
              <p className="text-slate-500 dark:text-gray-400 text-lg">Try adjusting your search or category filters.</p>
              <button 
                onClick={() => {setSearchQuery(""); setActiveCategory("All");}}
                className="mt-8 text-sky-500 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

function IntegrationCard({ item, index }: { item: any, index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -12 }}
      className="group relative bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 flex flex-col h-full hover:border-sky-500/30 transition-all duration-500 shadow-2xl shadow-slate-200/50 dark:shadow-none hover:shadow-sky-500/10 cursor-pointer overflow-hidden"
    >
      {/* Decorative Glow */}
      <div 
        className="absolute -right-6 -top-6 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-700"
        style={{ backgroundColor: item.color }}
      />
      
      <div className="mb-10 flex justify-between items-start">
        <div 
          className="w-20 h-20 relative flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-white/10 bg-white group-hover:scale-110 transition-transform duration-500"
          style={{ boxShadow: `0 12px 40px ${item.color}25` }}
        >
          <Image 
            src={`https://www.google.com/s2/favicons?domain=${item.domain || item.name.toLowerCase() + '.com'}&sz=128`}
            alt={item.name}
            width={56}
            height={56}
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" title="Active" />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors tracking-tight">
            {item.name}
          </h3>
          <ExternalLink className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-base text-slate-500 dark:text-gray-400 leading-relaxed mb-10 line-clamp-3 font-medium">
          {item.description}
        </p>
      </div>
      
      <div className="mt-auto">
        <button 
          className="w-full py-5 rounded-[1.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-sm font-bold text-slate-600 dark:text-gray-300 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300 flex items-center justify-center gap-3 group/btn"
        >
          View Documentation
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
