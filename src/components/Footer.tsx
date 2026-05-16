import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Github, Disc as Discord } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <span className="text-xl font-bold tracking-tight text-slate-950">LokoAI</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-8">
              LokoAI is the AI-powered platform that lets users build fully functioning apps in minutes. Using nothing but natural language, LokoAI enables anyone to turn their words into productivity apps, back-office tools, customer portals, or complete enterprise products that are ready to use—no integrations required.
            </p>
            <div className="flex gap-5">
              <Link href="#" className="text-slate-400 hover:text-sky-500 transition-colors"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="text-slate-400 hover:text-sky-500 transition-colors"><Discord className="w-5 h-5" /></Link>
              <Link href="#" className="text-slate-400 hover:text-sky-500 transition-colors"><Linkedin className="w-5 h-5" /></Link>
              <Link href="#" className="text-slate-400 hover:text-sky-500 transition-colors"><Github className="w-5 h-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-950 mb-8">Company</h4>
            <ul className="flex flex-col gap-4 text-xs font-medium text-slate-500">
              <li><Link href="/about" className="hover:text-sky-500 transition-colors">About Us</Link></li>
              <li><Link href="/affiliate" className="hover:text-sky-500 transition-colors">Affiliate Program</Link></li>
              <li><Link href="/careers" className="hover:text-sky-500 transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-950 mb-8">Product</h4>
            <ul className="flex flex-col gap-4 text-xs font-medium text-slate-500">
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Features</Link></li>
              <li><Link href="/integrations" className="hover:text-sky-500 transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Enterprise</Link></li>
              <li><Link href="/pricing" className="hover:text-sky-500 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Roadmap</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Changelog</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Feature Request</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Use Cases</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Status</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Backend Platform</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Superagents</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">AI App Builder</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">AI Website Builder</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-950 mb-8">Resources</h4>
            <ul className="flex flex-col gap-4 text-xs font-medium text-slate-500">
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Docs & FAQs</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Higher Ed</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Community</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Blog</Link></li>
              <li><Link href="/partners" className="hover:text-sky-500 transition-colors">Hire a Partner</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-950 mb-8">Legal</h4>
            <ul className="flex flex-col gap-4 text-xs font-medium text-slate-500">
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Report Misuse</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Responsible Use Policy</Link></li>
              <li><Link href="#" className="hover:text-sky-500 transition-colors">Accessibility Statement</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-medium text-slate-400">
            © 2026 LokoAI Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-2 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
