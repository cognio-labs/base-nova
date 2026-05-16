"use client";

import { integrations } from "@/data/integrations";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Home, 
  LayoutGrid, 
  Users, 
  FileStack, 
  Plus, 
  ChevronRight, 
  Bot,
  Plug,
  ExternalLink,
  Sparkles,
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
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-500">
      {/* Sidebar - Refined Design */}
      <aside className="hidden lg:flex w-72 border-r border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-xl flex-col fixed h-[calc(100vh-80px)] top-20 z-40 transition-all duration-300">
        <div className="p-6 flex flex-col gap-6">
          <div className="space-y-1 bg-slate-100/50 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/10">
            <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-xl">
              <LayoutGrid className="w-4 h-4" />
              All Apps
            </button>
            <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-xl">
              <Bot className="w-4 h-4" />
              Superagents
            </button>
          </div>

          <nav className="flex flex-col gap-1.5">
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-2">Navigation</h3>
            <NavItem icon={Home} label="Home" />
            <NavItem icon={Plug} label="Integrations" active />
            <NavItem icon={Users} label="Community" hasArrow />
            <NavItem icon={FileStack} label="Templates" />
          </nav>

          <div className="mt-4">
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-4 flex justify-between items-center">
              Categories
              <ChevronRight className="w-3 h-3" />
            </h3>
            <div className="flex flex-col gap-1">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                    activeCategory === cat 
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" 
                    : "text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${activeCategory === cat ? "bg-white" : "bg-slate-300 dark:bg-gray-600"}`} />
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto p-6">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-xl shadow-sky-500/20">
            <Sparkles className="w-6 h-6 mb-3" />
            <h4 className="text-sm font-bold mb-1">Request Integration</h4>
            <p className="text-[10px] text-white/80 leading-relaxed mb-4">Can't find what you need? We'll build it for you.</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
              Learn More <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-72 p-6 md:p-12 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-bold uppercase tracking-widest mb-4 border border-sky-500/20"
              >
                <Plug className="w-3 h-3" />
                Connect & Automate
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                Integrations <span className="brand-text-gradient">Catalog</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-gray-400 leading-relaxed">
                Supercharge your Superagents by connecting to over 100+ professional tools and APIs. Seamless data flow, automated workflows.
              </p>
            </div>

            <div className="relative w-full md:w-80 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search 100+ tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
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
              <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No integrations found</h3>
              <p className="text-slate-500 dark:text-gray-400">Try adjusting your search or category filters.</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, hasArrow }: { icon: any, label: string, active?: boolean, hasArrow?: boolean }) {
  return (
    <button className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
      active 
      ? "bg-white dark:bg-white/10 text-sky-600 dark:text-white shadow-md shadow-black/5" 
      : "text-slate-500 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
    }`}>
      <div className="flex items-center gap-4">
        <Icon className={`w-5 h-5 ${active ? "text-sky-500" : ""}`} />
        {label}
      </div>
      {hasArrow && <ChevronRight className="w-4 h-4 text-slate-400" />}
    </button>
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
      whileHover={{ y: -8 }}
      className="group relative bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 flex flex-col h-full hover:border-sky-500/30 transition-all duration-500 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:shadow-sky-500/10 cursor-pointer overflow-hidden"
    >
      {/* Decorative Glow */}
      <div 
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-700"
        style={{ backgroundColor: item.color }}
      />
      
      <div className="mb-8 flex justify-between items-start">
        <div 
          className="w-16 h-16 relative flex items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-white/10 bg-white group-hover:scale-110 transition-transform duration-500"
          style={{ boxShadow: `0 8px 30px ${item.color}20` }}
        >
          <Image 
            src={`https://www.google.com/s2/favicons?domain=${item.domain || item.name.toLowerCase() + '.com'}&sz=128`}
            alt={item.name}
            width={48}
            height={48}
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" title="Active" />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
            {item.name}
          </h3>
          <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed mb-8 line-clamp-3">
          {item.description}
        </p>
      </div>
      
      <div className="mt-auto space-y-3">
        <button 
          className="w-full py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300 flex items-center justify-center gap-2"
        >
          View Documentation
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
