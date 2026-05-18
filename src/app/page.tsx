"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, Check, Star, ArrowRight, ChevronRight,
  Mail, Video, Calendar, MessageSquare, BookOpen, Activity, ShoppingBag
} from "lucide-react";
import AuthModal from "@/components/AuthModal";

// Custom Brand SVG Icons (Since trademark brands are removed/unsupported in some lucide-react versions)
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const SlackIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <rect x="13" y="2" width="3" height="8" rx="1.5" />
    <path d="M19 8.5a1.5 1.5 0 1 1-3 0V7h1.5A1.5 1.5 0 0 1 19 8.5z" />
    <rect x="14" y="14" width="8" height="3" rx="1.5" />
    <path d="M15.5 19a1.5 1.5 0 1 1 0-3H17v1.5a1.5 1.5 0 0 1-1.5 1.5z" />
    <rect x="8" y="14" width="3" height="8" rx="1.5" />
    <path d="M5 15.5a1.5 1.5 0 1 1 3 0V17H6.5A1.5 1.5 0 0 1 5 15.5z" />
    <rect x="2" y="7" width="8" height="3" rx="1.5" />
    <path d="M8.5 5a1.5 1.5 0 1 1 0 3H7V6.5A1.5 1.5 0 0 1 8.5 5z" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Brand Logo Details for Section 2 (Infinite Marquee)
// Brand Logo Details for Section 2 (Infinite Marquee)
const clientBrands = [
  { 
    name: "Deloitte.", 
    font: "font-sans font-black tracking-tight", 
    color: "text-[#86BC25]",
    bg: "bg-[#86BC25]/5 hover:bg-[#86BC25]/10 border-[#86BC25]/15 dark:border-[#86BC25]/30 shadow-[#86BC25]/5 hover:shadow-[#86BC25]/15" 
  },
  { 
    name: "zomato", 
    font: "font-serif italic font-extrabold", 
    color: "text-[#E23744]",
    bg: "bg-[#E23744]/5 hover:bg-[#E23744]/10 border-[#E23744]/15 dark:border-[#E23744]/30 shadow-[#E23744]/5 hover:shadow-[#E23744]/15" 
  },
  { 
    name: "BHASHINI", 
    font: "font-sans font-bold tracking-widest", 
    color: "text-[#0A2540] dark:text-[#4F8BFF]",
    bg: "bg-[#0A2540]/5 hover:bg-[#0A2540]/10 border-[#0A2540]/15 dark:border-[#4F8BFF]/30 shadow-[#0A2540]/5 hover:shadow-[#4F8BFF]/15" 
  },
  { 
    name: "OpenAI", 
    font: "font-mono font-bold", 
    color: "text-slate-900 dark:text-white",
    bg: "bg-slate-500/5 hover:bg-slate-500/10 border-slate-500/15 dark:border-slate-500/30 shadow-slate-500/5" 
  },
  { 
    name: "Google Gemini", 
    font: "font-sans font-extrabold tracking-tight", 
    color: "text-sky-500",
    bg: "bg-sky-500/5 hover:bg-sky-500/10 border-sky-500/15 dark:border-sky-500/30 shadow-sky-500/5 hover:shadow-sky-500/15" 
  },
  { 
    name: "Anthropic", 
    font: "font-serif font-bold", 
    color: "text-[#E0B883]",
    bg: "bg-[#E0B883]/5 hover:bg-[#E0B883]/10 border-[#E0B883]/15 dark:border-[#E0B883]/30 shadow-[#E0B883]/5 hover:shadow-[#E0B883]/15" 
  },
  { 
    name: "Meta Llama", 
    font: "font-sans font-bold", 
    color: "text-blue-600",
    bg: "bg-blue-600/5 hover:bg-blue-600/10 border-blue-600/15 dark:border-blue-600/30 shadow-blue-600/5 hover:shadow-blue-600/15" 
  },
  { 
    name: "Cohere", 
    font: "font-mono", 
    color: "text-[#3B593E] dark:text-[#6BB374]",
    bg: "bg-[#3B593E]/5 hover:bg-[#3B593E]/10 border-[#3B593E]/15 dark:border-[#6BB374]/30 shadow-[#3B593E]/5 hover:shadow-[#6BB374]/15" 
  },
  { 
    name: "Vercel", 
    font: "font-sans font-black tracking-tighter", 
    color: "text-black dark:text-white",
    bg: "bg-slate-500/5 hover:bg-slate-500/10 border-slate-500/15 dark:border-slate-500/30 shadow-slate-500/5" 
  },
  { 
    name: "Supabase", 
    font: "font-sans font-bold", 
    color: "text-[#3ECF8E]",
    bg: "bg-[#3ECF8E]/5 hover:bg-[#3ECF8E]/10 border-[#3ECF8E]/15 dark:border-[#3ECF8E]/30 shadow-[#3ECF8E]/5 hover:shadow-[#3ECF8E]/15" 
  },
  { 
    name: "Pinecone", 
    font: "font-sans font-extrabold", 
    color: "text-amber-500",
    bg: "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/15 dark:border-amber-500/30 shadow-amber-500/5 hover:shadow-amber-500/15" 
  },
  { 
    name: "LangChain", 
    font: "font-mono font-bold", 
    color: "text-emerald-500",
    bg: "bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/15 dark:border-emerald-500/30 shadow-emerald-500/5 hover:shadow-emerald-500/15" 
  }
];

// App/Tool Icons for Section 3 (Opposing Vertical Scrolling grids)
const integrationTools = [
  { name: "Gmail", icon: Mail, color: "text-[#EA4335] bg-red-500/5 border-red-500/10 dark:border-red-500/20" },
  { name: "Google Meet", icon: Video, color: "text-[#0F9D58] bg-emerald-500/5 border-emerald-500/10 dark:border-emerald-500/20" },
  { name: "Calendly", icon: Calendar, color: "text-[#006BFF] bg-blue-500/5 border-blue-500/10 dark:border-blue-500/20" },
  { name: "YouTube", icon: YoutubeIcon, color: "text-[#FF0000] bg-rose-500/5 border-rose-500/10 dark:border-rose-500/20" },
  { name: "LinkedIn", icon: LinkedinIcon, color: "text-[#0A66C2] bg-sky-500/5 border-sky-500/10 dark:border-sky-500/20" },
  { name: "Twitter X", icon: TwitterIcon, color: "text-slate-900 dark:text-white bg-slate-500/5 border-slate-500/10 dark:border-slate-500/20" },
  { name: "WhatsApp", icon: MessageSquare, color: "text-[#25D366] bg-green-500/5 border-green-500/10 dark:border-green-500/20" },
  { name: "Notion", icon: BookOpen, color: "text-slate-900 dark:text-white bg-slate-500/5 border-slate-500/10 dark:border-slate-500/20" },
  { name: "Slack", icon: SlackIcon, color: "text-[#4A154B] dark:text-purple-400 bg-purple-500/5 border-purple-500/10 dark:border-purple-500/20" },
  { name: "GitHub", icon: GithubIcon, color: "text-slate-900 dark:text-white bg-slate-500/5 border-slate-500/10 dark:border-slate-500/20" },
  { name: "HubSpot", icon: Activity, color: "text-[#FF7A59] bg-orange-500/5 border-orange-500/10 dark:border-orange-500/20" },
  { name: "Shopify", icon: ShoppingBag, color: "text-[#7AB55C] bg-lime-500/5 border-lime-500/10 dark:border-lime-500/20" }
];

// Testimonials for Section 4 (9 realistic cards)
const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Operations Lead @ BrightPath Agency",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    review: "LokoAI helped us automate tasks we were still doing manually every day. The setup was surprisingly fast, and the agents just work without constant babysitting."
  },
  {
    name: "David Chen",
    role: "Senior AI Engineer @ Cortex Labs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    review: "LokoAI strikes a great balance between flexibility and simplicity. Multi-model support, tool integrations, and clean execution make it easy to build serious agents without infrastructure overhead."
  },
  {
    name: "Arjun Mehta",
    role: "Lead Architect @ DataForge",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    review: "The agent orchestration and model switching are very well designed. We can route different tasks to different LLMs without rewriting logic, which is a big win."
  },
  {
    name: "Emily Watson",
    role: "Product Manager @ LaunchStack",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    review: "What impressed me most was how quickly we went from idea to a live agent. No complex workflows — just explain the task and deploy. It's now part of our daily operations."
  },
  {
    name: "Sofia Rodriguez",
    role: "Customer Success Manager @ Helpwise",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    review: "Our support workflows are much smoother now. The chatbot handles common queries, and escalations are seamless when a human is needed."
  },
  {
    name: "Rohan Das",
    role: "Growth & Strategy @ ScaleUp Studio",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80",
    review: "LokoAI helped us automate lead qualification and internal reporting. What used to take hours now runs quietly in the background."
  },
  {
    name: "Jessica Taylor",
    role: "Marketing Manager @ Vantage Digital",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    review: "We use LokoAI for content generation and campaign research. It saves hours every week and keeps everything in one place instead of juggling multiple tools."
  },
  {
    name: "Marcus Stone",
    role: "Founder @ NovaBridge",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80",
    review: "We replaced three separate AI subscriptions with LokoAI. Lower cost, better control, and far less complexity for our team."
  },
  {
    name: "Dr. Priya Nair",
    role: "Academic Researcher @ IIT Delhi",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
    review: "LokoAI has been extremely useful in managing academic workflows. From organizing course materials to assisting with research summaries, it has significantly reduced repetitive effort."
  }
];

// LokoAI Pricing Plan details for Section 5 (Pricing page integration)
const pricingPlans = [
  {
    name: "Starter",
    monthlyPrice: 19,
    yearlyPrice: 15,
    highlight: "Best for trying LokoAI",
    credits: "120 Monthly credits",
    integCredits: "3k Integration credits",
    features: [
      "Unlimited apps and superagents",
      "Built-in integrations",
      "2-way GitHub sync",
      "Email support",
    ],
    popular: false,
    cta: "Get Starter"
  },
  {
    name: "Builder",
    monthlyPrice: 39,
    yearlyPrice: 31,
    highlight: "Best for solo founders",
    credits: "300 Monthly credits",
    integCredits: "12k Integration credits",
    features: [
      "Unlimited apps and superagents",
      "Unlimited collaborators with shared credits",
      "Custom domain & Remove branding",
      "Automations & In-app code editing",
      "Choose your favorite AI model",
    ],
    popular: true,
    cta: "Get Builder"
  },
  {
    name: "Pro",
    monthlyPrice: 79,
    yearlyPrice: 63,
    highlight: "Best for growing product teams",
    credits: "650 Monthly credits",
    integCredits: "25k Integration credits",
    features: [
      "Everything in Builder",
      "Private templates",
      "Priority generations",
      "Advanced workflow automations",
      "Team sharing controls",
      "Faster support turnaround",
    ],
    popular: false,
    cta: "Get Pro"
  },
  {
    name: "Elite",
    monthlyPrice: 149,
    yearlyPrice: 119,
    highlight: "Best for agencies and scale-ups",
    credits: "1.5k Monthly credits",
    integCredits: "60k Integration credits",
    features: [
      "Everything in Pro",
      "Dedicated onboarding",
      "Early feature access",
      "Premium support",
      "High-volume generation capacity",
      "Custom workspace guidance",
    ],
    popular: false,
    cta: "Get Elite"
  }
];

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden">
      
      {/* ========================================================================= */}
      {/* BACKGROUND ELEMENTS & GRID MESH (Same to same as Hero Image) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-grid-pattern opacity-80 pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-sky-400/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-cyan-400/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-sky-300/5 rounded-full blur-[160px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* SECTION 1: HERO SECTION (Same as First Image) */}
      {/* ========================================================================= */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          {/* Elegant Top Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-gray-400 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Trusted by teams across 3 continents
            <span className="text-slate-300 dark:text-gray-700">|</span>
            <span>Plans from $19/mo</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-[5.25rem] font-black tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-6">
            Stop Paying for 12 AI Subscriptions.<br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-600 bg-clip-text text-transparent">
              One Platform, 100+ Superagents.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-10 max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-slate-600 dark:text-gray-400">
            Build custom AI agents, collaborate with your team, and access every major model — GPT-4, Claude, Gemini, Llama, and more. Starting at <span className="font-bold text-slate-900 dark:text-white">$19/month</span>.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 max-w-md mx-auto sm:max-w-none">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-4 transition-all shadow-lg shadow-sky-500/20 active:scale-95 group text-sm md:text-base cursor-pointer"
            >
              <Sparkles className="w-5 h-5 animate-pulse text-sky-200" />
              Build Your First Agent
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold px-8 py-4 transition-all active:scale-95 text-sm md:text-base cursor-pointer"
            >
              Book a demo
            </button>
          </div>

          {/* Checks */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs md:text-sm font-semibold text-slate-500 dark:text-gray-400 border-t border-slate-200/50 dark:border-white/5 pt-8 max-w-4xl mx-auto">
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-500" /> 100+ AI Models</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-500" /> No Code Required</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-500" /> Team Collaboration</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-500" /> Pay-as-you-go</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-500" /> Cancel Anytime</span>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: CUSTOMERS LOGO SCROLLER (Same as Second Image) */}
      {/* ========================================================================= */}
      <section className="relative py-12 border-y border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-600 dark:text-sky-400">
            Our Trusted Customers
          </p>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10 hidden md:block" />
        </div>

        {/* Horizontal Infinite Slider */}
        <div className="relative w-full flex overflow-hidden">
          <div className="flex gap-4 animate-marquee py-2 whitespace-nowrap">
            {/* First Set of 12 logo cards */}
            {clientBrands.map((brand, idx) => (
              <div 
                key={`b1-${idx}`}
                className={`inline-flex items-center justify-center border rounded-2xl px-8 py-5 min-w-[200px] shadow-sm hover:shadow transition-all hover:scale-105 duration-300 select-none ${brand.bg}`}
              >
                <span className={`${brand.font} ${brand.color} text-lg md:text-xl`}>
                  {brand.name}
                </span>
              </div>
            ))}
            {/* Duplicate Set for Seamless Marquee */}
            {clientBrands.map((brand, idx) => (
              <div 
                key={`b2-${idx}`}
                className={`inline-flex items-center justify-center border rounded-2xl px-8 py-5 min-w-[200px] shadow-sm hover:shadow transition-all hover:scale-105 duration-300 select-none ${brand.bg}`}
              >
                <span className={`${brand.font} ${brand.color} text-lg md:text-xl`}>
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: CONNECT WITH THE TOOLS YOU LOVE (Same as Third Image) */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Copy Area */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
              Seamless Ecosystem
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
              Connect with the<br />
              <span className="text-sky-500">tools you love.</span>
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-gray-400">
              Stop switching tabs. Streamline your workflow by integrating LokoAI with over 50+ popular platforms. Sync data, automate tasks, and stay in your flow state.
            </p>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold px-7 py-3.5 transition-all shadow-md shadow-sky-500/10 active:scale-95 cursor-pointer text-sm"
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Sliding Grid/Mockup Mockup Box */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[480px] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-2xl overflow-hidden"
          >
            {/* Top Mockup Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-4">
              <div className="flex gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-sm" />
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm" />
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-sm" />
              </div>
              <div className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                LokoAI Integrations Mockup
              </div>
              <div className="w-12 h-2" />
            </div>

            {/* Scrolling columns inside the box */}
            <div className="grid grid-cols-3 gap-4 h-[380px] overflow-hidden relative">
              
              {/* Overlay Gradient at top & bottom to fade scrolling items */}
              <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-slate-50 dark:from-[#0d1527] to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-slate-50 dark:from-[#0d1527] to-transparent z-10 pointer-events-none" />

              {/* Column 1: Scrolling Up */}
              <div className="flex flex-col gap-3 animate-marquee-vertical-up">
                {integrationTools.slice(0, 4).map((tool, idx) => (
                  <div key={`c1-${idx}`} className={`flex items-center justify-center border rounded-[1.25rem] p-4 aspect-square bg-white dark:bg-slate-950 transition-all hover:scale-105 shadow-sm hover:shadow ${tool.color}`}>
                    <tool.icon className="w-7 h-7 stroke-[2]" />
                  </div>
                ))}
                {integrationTools.slice(0, 4).map((tool, idx) => (
                  <div key={`c1-dup-${idx}`} className={`flex items-center justify-center border rounded-[1.25rem] p-4 aspect-square bg-white dark:bg-slate-950 transition-all hover:scale-105 shadow-sm hover:shadow ${tool.color}`}>
                    <tool.icon className="w-7 h-7 stroke-[2]" />
                  </div>
                ))}
              </div>

              {/* Column 2: Scrolling Down */}
              <div className="flex flex-col gap-3 animate-marquee-vertical-down">
                {integrationTools.slice(4, 8).map((tool, idx) => (
                  <div key={`c2-${idx}`} className={`flex items-center justify-center border rounded-[1.25rem] p-4 aspect-square bg-white dark:bg-slate-950 transition-all hover:scale-105 shadow-sm hover:shadow ${tool.color}`}>
                    <tool.icon className="w-7 h-7 stroke-[2]" />
                  </div>
                ))}
                {integrationTools.slice(4, 8).map((tool, idx) => (
                  <div key={`c2-dup-${idx}`} className={`flex items-center justify-center border rounded-[1.25rem] p-4 aspect-square bg-white dark:bg-slate-950 transition-all hover:scale-105 shadow-sm hover:shadow ${tool.color}`}>
                    <tool.icon className="w-7 h-7 stroke-[2]" />
                  </div>
                ))}
              </div>

              {/* Column 3: Scrolling Up */}
              <div className="flex flex-col gap-3 animate-marquee-vertical-up">
                {integrationTools.slice(8, 12).map((tool, idx) => (
                  <div key={`c3-${idx}`} className={`flex items-center justify-center border rounded-[1.25rem] p-4 aspect-square bg-white dark:bg-slate-950 transition-all hover:scale-105 shadow-sm hover:shadow ${tool.color}`}>
                    <tool.icon className="w-7 h-7 stroke-[2]" />
                  </div>
                ))}
                {integrationTools.slice(8, 12).map((tool, idx) => (
                  <div key={`c3-dup-${idx}`} className={`flex items-center justify-center border rounded-[1.25rem] p-4 aspect-square bg-white dark:bg-slate-950 transition-all hover:scale-105 shadow-sm hover:shadow ${tool.color}`}>
                    <tool.icon className="w-7 h-7 stroke-[2]" />
                  </div>
                ))}
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: TESTIMONIALS (What Our Users Say - Same as Fourth Image) */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 border-t border-slate-100 dark:border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            What Our Users Say
          </h2>
          <p className="mx-auto max-w-2xl text-slate-500 dark:text-gray-400 text-base sm:text-lg">
            Teams and builders across 3 continents trust LokoAI to power their AI workflows.
          </p>
        </div>

        {/* 9 beautiful Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-md hover:shadow-xl dark:hover:border-sky-500/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Avatar Info */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={t.avatar} 
                      alt={t.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950 dark:text-white text-sm">{t.name}</h4>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: SIMPLE AND FEASIBLE PRICING (Same as Fifth Image) */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 border-t border-slate-100 dark:border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Simple and Feasible Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-slate-500 dark:text-gray-400 text-base sm:text-lg mb-8">
            Choose a plan that scales with your AI ambitions. No hidden fees, cancel anytime.
          </p>

          {/* Toggle billing plan */}
          <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                !isYearly ? "bg-white dark:bg-white/10 text-slate-950 dark:text-white shadow-sm" : "text-slate-500"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isYearly ? "bg-sky-500 text-white shadow-sm" : "text-slate-500"
              }`}
            >
              Yearly
              <span className="bg-white/20 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {pricingPlans.map((plan, idx) => {
            const finalPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className={`flex flex-col overflow-hidden rounded-[2rem] border bg-white/95 dark:bg-slate-900/60 shadow-xl transition-all duration-300 relative ${
                  plan.popular
                    ? "border-sky-400 dark:border-sky-500 shadow-[0_18px_50px_rgba(14,165,233,0.14)]"
                    : "border-slate-200 dark:border-white/5"
                }`}
              >
                {/* Popular label bar */}
                {plan.popular && (
                  <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-sky-500 to-cyan-400 py-1.5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    Most Popular
                  </div>
                )}

                <div className={`p-6 flex flex-col justify-between h-full ${plan.popular ? "pt-10" : ""}`}>
                  <div>
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{plan.name}</h3>
                      <p className="mt-1.5 text-xs text-slate-500 dark:text-gray-400 font-semibold">{plan.highlight}</p>
                    </div>

                    {/* Price & Billing */}
                    <div className="border-y border-slate-100 dark:border-white/5 py-4 mb-4">
                      <div className="flex items-end gap-1 mb-2">
                        <span className="text-4xl font-extrabold text-slate-950 dark:text-white">${finalPrice}</span>
                        <span className="text-sm text-slate-400 dark:text-gray-500 pb-0.5">/mo</span>
                      </div>
                      
                      <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-3 shadow-inner">
                        <p className="text-[11px] font-bold text-slate-900 dark:text-white">{plan.credits}</p>
                        <p className="text-[11px] font-bold text-slate-900 dark:text-white mt-1">{plan.integCredits}</p>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3 mb-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">Plan Benefits</p>
                      {plan.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5">
                          <div className="h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/20">
                            <Check className="h-2.5 w-2.5 text-emerald-500" />
                          </div>
                          <span className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Call to action button */}
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className={`w-full rounded-2xl py-3 text-xs font-extrabold transition-all cursor-pointer ${
                      plan.popular
                        ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-md shadow-sky-500/20 hover:opacity-90 active:scale-95"
                        : "border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* AuthModal component for logging/signing up */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
