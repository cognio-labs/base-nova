"use client";

import { partners } from "@/data/partners";
import { motion } from "framer-motion";
import { ExternalLink, Globe, MapPin, Languages, ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function PartnersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">LokoAI <span className="brand-text-gradient">Partners</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          From first steps to advanced builds, LokoAI Partners provide the expertise and insight to help you achieve the best outcome.
        </p>
        
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button className="px-6 py-3 brand-btn rounded-xl font-semibold shadow-lg shadow-orange-500/20">
            Apply to become a partner
          </button>
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            <input 
              type="text" 
              placeholder="Search partners..." 
              className="bg-transparent border-none focus:ring-0 px-4 py-2 text-sm w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {partners.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6 rounded-2xl flex flex-col gap-6 group hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden"
          >
            {/* Top Row: Avatar & Socials */}
            <div className="flex justify-between items-start">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white/10 border border-white/10 shadow-xl group-hover:scale-105 transition-transform duration-500">
                <Image
                  src={partner.avatar}
                  alt={partner.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex gap-2">
                {partner.linkedin && (
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                {partner.website && (
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <Globe className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{partner.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <MapPin className="w-3 h-3" />
                {partner.location}
              </div>
              <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                {partner.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {partner.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-medium text-gray-400 border border-white/5 uppercase tracking-wider">
                  {tag}
                </span>
              ))}
              {partner.tags.length > 3 && (
                <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-medium text-gray-400 border border-white/5 uppercase tracking-wider">
                  +{partner.tags.length - 3}
                </span>
              )}
            </div>

            {/* Pricing & Languages */}
            <div className="mt-auto pt-6 border-t border-white/5">
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Languages className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{partner.languages.join(", ")}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-white">{partner.startingFrom}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Min project</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-bold text-sm hover:bg-orange-50 transition-colors group/btn">
                  Contact
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
