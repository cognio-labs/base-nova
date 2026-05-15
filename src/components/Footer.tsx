import Link from "next/link";

export default function Footer() {
  return (
    <footer className="glass border-t border-white/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg brand-btn flex items-center justify-center font-bold text-white shadow-lg">
                L
              </div>
              <span className="text-xl font-bold text-white">LokoAI</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              LokoAI is the AI-powered platform that lets users build fully functioning apps in minutes using nothing but natural language.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Company</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/affiliate" className="hover:text-white transition-colors">Affiliate Program</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Product</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500">
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/roadmap" className="hover:text-white transition-colors">Roadmap</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Resources</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500">
              <li><Link href="/docs" className="hover:text-white transition-colors">Docs & FAQs</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Legal</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © 2026 LokoAI Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] font-bold text-gray-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
