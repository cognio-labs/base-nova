"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutGrid, Zap, Users, Rocket, Trophy, Menu, X, Sun, Moon, LogOut, Gauge } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import AuthModal from "@/components/AuthModal";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

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
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isLoading, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : "dark";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center group">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                LokoAI
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  pathname === item.href
                    ? "bg-sky-500/10 text-slate-950 dark:bg-white/10 dark:text-white"
                    : "text-slate-500 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white hover:bg-sky-500/10 dark:hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2.5 rounded-xl border-2 transition-all duration-300 flex items-center justify-center group ${
                currentTheme === "dark"
                  ? "bg-black border-[#00BFFF] text-white shadow-[0_0_15px_rgba(0,191,255,0.3)]"
                  : "bg-white border-[#00BFFF] text-black shadow-lg"
              }`}
            >
              {currentTheme === "dark" ? (
                <Moon className="w-5 h-5 group-hover:rotate-[360deg] transition-transform duration-500" />
              ) : (
                <Sun className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              )}
            </button>

            {!isLoading && user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-sky-500/10 dark:text-gray-200">
                  <Gauge className="h-4 w-4 text-sky-500" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 rounded-full bg-white/70 px-2 py-1.5 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                  <div className="relative h-7 w-7 overflow-hidden rounded-full bg-sky-400/20">
                    {user.user_metadata?.avatar_url ? (
                      <Image src={user.user_metadata.avatar_url} alt="User avatar" fill className="object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xs font-bold text-sky-600">
                        {(user.email || "U").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="max-w-36 truncate text-xs font-medium text-slate-700 dark:text-gray-200">
                    {user.email || user.phone}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={signOut} aria-label="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-950 dark:text-gray-400 dark:hover:text-white"
                >
                  Log in
                </button>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="rounded-full brand-btn px-5 py-2 text-sm font-semibold shadow-lg shadow-sky-500/20"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
             <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`p-2 rounded-lg border transition-all duration-300 ${
                  currentTheme === "dark" ? "bg-black border-[#00BFFF] text-white" : "bg-white border-[#00BFFF] text-black"
                }`}
              >
                {currentTheme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white p-2"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 right-0 glass border-b border-white/10 p-4"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium flex items-center gap-3 ${
                    pathname === item.href
                      ? "bg-sky-500/10 text-slate-950 dark:bg-white/10 dark:text-white"
                      : "text-slate-500 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white hover:bg-sky-500/10 dark:hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-white/5 flex flex-col gap-3">
                {!isLoading && user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-white/5 py-3 font-bold text-slate-700 dark:text-white"
                    >
                      <Gauge className="h-4 w-4 text-sky-500" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        void signOut();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-red-500"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setIsAuthOpen(true);
                      }}
                      className="w-full py-3 text-center font-medium text-slate-500 dark:text-gray-400"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setIsAuthOpen(true);
                      }}
                      className="w-full rounded-xl brand-btn py-3 font-bold"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
}
