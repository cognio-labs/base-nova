"use client";

import { integrations } from "@/data/integrations";
import { motion } from "framer-motion";
import { 
  Search, 
  Home, 
  LayoutGrid, 
  Users, 
  FileStack, 
  Plus, 
  ChevronRight, 
  MoreHorizontal,
  Bot,
  Layers
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIntegrations = integrations.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f9fafb] text-slate-900">
      {/* Vertical Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col fixed h-[calc(100vh-80px)] top-20">
        <div className="p-4 flex flex-col gap-2">
          <div className="flex flex-col p-1 bg-slate-100 rounded-xl">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-900 bg-white shadow-sm rounded-lg">
              <Layers className="w-4 h-4" />
              Apps
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              <Bot className="w-4 h-4" />
              Superagents
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 flex flex-col gap-1">
          <NavItem icon={Home} label="Home" />
          <NavItem icon={LayoutGrid} label="All apps" />
          <NavItem icon={Layers} label="Integrations" active />
          <NavItem icon={Users} label="Community" hasArrow />
          <NavItem icon={FileStack} label="Templates" />

          <div className="mt-8">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Favorites</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </div>
            <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center">
              <p className="text-[10px] text-slate-400">No favorites yet<br />Add your apps for quick access</p>
            </div>
          </div>

          <div className="mt-8">
             <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recents</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex flex-col gap-1">
              <RecentItem label="Sakshi Dham International" />
              <RecentItem label="SpaceTech Consulting" />
              <button className="text-[10px] text-slate-400 font-medium px-2 py-1 text-left hover:text-slate-600">View all</button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Integrations</h1>
            <p className="text-slate-500">
              Discover pre-built integrations that let you connect to APIs, services, and tools to extend your app&apos;s capabilities.
            </p>
          </div>

          <div className="relative mb-12 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Connectors</h2>
            <p className="text-xs text-slate-500">Quick OAuth connections to popular services, supported by Base44.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredIntegrations.map((item, index) => (
              <IntegrationCard key={item.name} item={item} index={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, hasArrow }: { icon: any, label: string, active?: boolean, hasArrow?: boolean }) {
  return (
    <button className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      active ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
    }`}>
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      {hasArrow && <ChevronRight className="w-3 h-3 text-slate-400" />}
    </button>
  );
}

function RecentItem({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-all text-left">
      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function IntegrationCard({ item, index }: { item: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col h-full hover:border-sky-200 hover:shadow-md transition-all group cursor-pointer"
    >
      <div className="mb-6">
        <div className="w-10 h-10 relative flex items-center justify-center rounded-lg overflow-hidden bg-slate-50">
          <Image 
            src={`https://www.google.com/s2/favicons?domain=${item.domain || item.name.toLowerCase() + '.com'}&sz=64`}
            alt={item.name}
            width={32}
            height={32}
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
      
      <h3 className="text-sm font-bold text-slate-900 mb-1">{item.name}</h3>
      <p className="text-[11px] text-slate-500 leading-relaxed mb-6 line-clamp-2">
        {item.description}
      </p>
      
      <div className="mt-auto">
        <button className="w-full py-2 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          How to use
        </button>
      </div>
    </motion.div>
  );
}
