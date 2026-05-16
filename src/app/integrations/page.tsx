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

  const categories = ["All", "Productivity", "Communication", "Storage", "CRM", "Social", "Development", "AI"];

  const filteredIntegrations = integrations.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         i.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || i.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-500">
      <main className="p-6 md:p-12 lg:p-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-bold uppercase tracking-widest mb-4 border border-sky-500/20"
            >
              <Plug className="w-3 h-3" />
              Connect & Automate
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Integrations <span className="brand-text-gradient">Catalog</span>
            </h1>
            <p className="text-base text-slate-500 dark:text-gray-400 leading-relaxed max-w-2xl mb-10">
              Discover pre-built integrations that let you connect to APIs, services, and tools to extend your app's capabilities.
            </p>

            <div className="relative w-full max-w-xl group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Horizontal Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                  activeCategory === cat 
                  ? "bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/20" 
                  : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:border-sky-500/50 hover:text-sky-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Connectors</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">Quick OAuth connections to popular services, supported by LokoAI.</p>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              className="text-center py-20"
            >
              <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No integrations found</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400">Try adjusting your filters.</p>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col h-full hover:border-sky-500/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-sky-500/5 cursor-pointer"
    >
      <div className="mb-6 flex justify-between items-start">
        <div 
          className="w-12 h-12 relative flex items-center justify-center rounded-xl overflow-hidden border border-slate-100 dark:border-white/10 bg-white shadow-sm"
        >
          <Image 
            src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`}
            alt={item.name}
            width={32}
            height={32}
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sky-500 transition-colors">
          {item.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed mb-6 line-clamp-2">
          {item.description}
        </p>
      </div>
      
      <div className="mt-auto">
        <button 
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
        >
          How to use
        </button>
      </div>
    </motion.div>
  );
}
