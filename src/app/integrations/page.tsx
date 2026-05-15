"use client";

import { integrations } from "@/data/integrations";
import { motion } from "framer-motion";
import { LayoutGrid, ArrowRight, ExternalLink } from "lucide-react";

export default function IntegrationsPage() {
  const categories = Array.from(new Set(integrations.map(i => i.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Extend with <span className="brand-text-gradient">Integrations</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover pre-built integrations that let you connect to APIs, services, and tools to extend your app's capabilities.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Categories</h3>
            <div className="flex flex-col gap-1">
              <button className="px-4 py-2 rounded-lg bg-white/10 text-white text-left text-sm font-medium">
                All Integrations
              </button>
              {categories.map(cat => (
                <button key={cat} className="px-4 py-2 rounded-lg hover:bg-white/5 text-gray-400 text-left text-sm font-medium transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="glass p-6 rounded-2xl border-orange-500/20">
            <h4 className="text-sm font-bold mb-2">Request an Integration</h4>
            <p className="text-xs text-gray-500 mb-4">Don't see what you need? Let us know what we should build next.</p>
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold transition-colors">
              Request Now
            </button>
          </div>
        </div>

        {/* Integration Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass p-6 rounded-2xl group hover:border-white/20 transition-all cursor-pointer flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
                    <LayoutGrid className="w-6 h-6 text-orange-500" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                </div>
                
                <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  {item.description}
                </p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 px-2 py-1 rounded bg-white/5">
                    {item.category}
                  </span>
                  <div className="text-xs font-semibold flex items-center gap-1 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Docs
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
