"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutGrid, Zap, Users, Rocket, Trophy, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";

const navItems = [
  { name: "Home", href: "/", icon: Sparkles },
  { name: "Integrations", href: "/integrations", icon: LayoutGrid },
  { name: "Partners", href: "/partners", icon: Users },
  { name: "Launchpad", href: "/launchpad", icon: Rocket },
  { name: "Affiliate", href: "/affiliate", icon: Trophy },
  { name: "Pricing", href: "/pricing", icon: Zap },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 dark:border-white/10 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 overflow-hidden shadow-[0_0_15px_rgba(0,210,255,0.3)] rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <Image 
                  src="/logo.png" 
                  alt="LokoAI Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white group-hover:brand-text-gradient transition-all duration-300">
                LokoAI
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                  pathname === item.href
                    ? "bg-white/10 text-blue-400 shadow-[0_0_15px_rgba(0,210,255,0.2)] border border-white/10"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`p-3 rounded-2xl border-2 transition-all duration-500 flex items-center justify-center group ${
                  theme === "dark"
                    ? "bg-[#020617] border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(0,210,255,0.4)]"
                    : "bg-white border-blue-500/50 text-black shadow-xl"
                }`}
              >
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 group-hover:rotate-[360deg] transition-transform duration-700" />
                ) : (
                  <Sun className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                )}
              </button>
            )}

            <button className="text-sm font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
              Log in
            </button>
            <button className="px-8 py-3 rounded-2xl brand-btn text-sm font-black uppercase tracking-widest shadow-[0_0_25px_rgba(255,0,255,0.3)]">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
             {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-2.5 rounded-xl border transition-all duration-300 ${
                    theme === "dark" ? "bg-[#020617] border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(0,210,255,0.3)]" : "bg-white border-blue-500/50 text-black"
                  }`}
                >
                  {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
              )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-white p-2"
            >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden absolute top-20 left-4 right-4 glass-frosted border border-white/20 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-magenta-500/10 blur-[100px] pointer-events-none" />
            <div className="flex flex-col gap-4 relative z-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] flex items-center gap-4 ${
                    pathname === item.href
                      ? "bg-white/10 text-blue-400 border border-white/10 shadow-lg"
                      : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-8 mt-4 border-t border-white/10 flex flex-col gap-4">
                <button className="w-full py-4 text-center font-black uppercase tracking-widest text-gray-500 hover:text-white">
                  Log in
                </button>
                <button className="w-full py-5 brand-btn rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
// eslint-disable-next-line react-hooks/set-state-in-effect
