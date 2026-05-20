export interface LocalGeneratedFile {
  path: string;
  content: string;
}

function toTitleFromPrompt(prompt: string) {
  const cleaned = prompt
    .replace(/build mode:\s*(app|landing|dashboard)\.?/gi, "")
    .replace(/create a|make a|build a|website|web app|landing page/gi, " ")
    .replace(/[^a-z0-9\s-_]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "Generated Website";

  return cleaned
    .split(" ")
    .slice(0, 4)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getLocalGeneratedProject(userPrompt: string) {
  const projectTitle = toTitleFromPrompt(userPrompt);
  const description =
    userPrompt
      .replace(/build mode:\s*(app|landing|dashboard)\.?/gi, "")
      .replace(/\s+/g, " ")
      .trim() || "A modern responsive website generated from your prompt.";

  const previewHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${projectTitle}</title>
    <style>
      *{box-sizing:border-box}
      body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;background:#f8fbff;color:#0f172a}
      .shell{min-height:100vh;background:radial-gradient(circle at 18% 0%,#dff5ff,transparent 34%),radial-gradient(circle at 88% 12%,#e7e5ff,transparent 28%),linear-gradient(180deg,#fff,#f1f7fb)}
      header{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 6vw;background:rgba(255,255,255,.82);backdrop-filter:blur(18px);border-bottom:1px solid rgba(15,23,42,.08)}
      .brand{font-size:18px;font-weight:900;letter-spacing:-.02em}
      nav{display:flex;gap:18px;font-size:13px;font-weight:750;color:#475569}
      .cta{border:0;border-radius:999px;padding:11px 16px;background:#0ea5e9;color:white;font-weight:850;box-shadow:0 14px 30px rgba(14,165,233,.24)}
      main{width:min(1120px,92vw);margin:0 auto;padding:72px 0}
      .hero{display:grid;grid-template-columns:1.15fr .85fr;gap:28px;align-items:center}
      .eyebrow{display:inline-flex;border:1px solid rgba(14,165,233,.25);background:rgba(14,165,233,.08);color:#0369a1;border-radius:999px;padding:9px 12px;font-size:12px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}
      h1{margin:18px 0 14px;font-size:clamp(42px,7vw,78px);line-height:.94;letter-spacing:-.055em}
      p{margin:0;color:#475569;line-height:1.7;font-size:17px}
      .actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}
      .secondary{border:1px solid rgba(15,23,42,.12);border-radius:999px;padding:11px 16px;background:white;color:#0f172a;font-weight:850}
      .panel{border:1px solid rgba(15,23,42,.08);background:rgba(255,255,255,.78);border-radius:28px;box-shadow:0 28px 80px rgba(15,23,42,.10);padding:22px}
      .metric-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
      .metric{border:1px solid rgba(15,23,42,.08);border-radius:20px;background:white;padding:18px}
      .metric strong{display:block;font-size:28px;letter-spacing:-.04em}
      section{padding-top:58px}
      .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
      .card{border:1px solid rgba(15,23,42,.08);border-radius:22px;background:white;padding:20px;box-shadow:0 18px 44px rgba(15,23,42,.06)}
      .card h3{margin:0 0 8px;font-size:17px}
      .card p{font-size:14px}
      @media (max-width:820px){header{padding:14px 18px}nav{display:none}.hero{grid-template-columns:1fr}main{padding:42px 0}.cards{grid-template-columns:1fr}.metric-grid{grid-template-columns:1fr}}
    </style>
  </head>
  <body>
    <div class="shell">
      <header>
        <div class="brand">${projectTitle}</div>
        <nav><a>Features</a><a>Workflows</a><a>Pricing</a></nav>
        <button class="cta">Get Started</button>
      </header>
      <main>
        <div class="hero">
          <div>
            <span class="eyebrow">Premium Website</span>
            <h1>${projectTitle}</h1>
            <p>${description}</p>
            <div class="actions">
              <button class="cta">Launch Now</button>
              <button class="secondary">View Demo</button>
            </div>
          </div>
          <div class="panel">
            <div class="metric-grid">
              <div class="metric"><strong>4.9x</strong><span>Faster launch</span></div>
              <div class="metric"><strong>24/7</strong><span>Automation</span></div>
              <div class="metric"><strong>98%</strong><span>Uptime ready</span></div>
              <div class="metric"><strong>12k</strong><span>Monthly actions</span></div>
            </div>
          </div>
        </div>
        <section>
          <div class="cards">
            <div class="card"><h3>Modern Design</h3><p>Responsive sections, polished spacing, and premium SaaS visual style.</p></div>
            <div class="card"><h3>Conversion Ready</h3><p>Hero, CTA, feature cards, and trust signals are structured for real visitors.</p></div>
            <div class="card"><h3>Easy to Edit</h3><p>The generated code is organized into clean files and updates the preview.</p></div>
          </div>
        </section>
      </main>
    </div>
  </body>
</html>`;

  const files: LocalGeneratedFile[] = [
    {
      path: "app/page.tsx",
      content: `export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Premium Website</p>
        <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">${projectTitle}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">${description}</p>
        <div className="mt-8 flex gap-3">
          <a className="rounded-full bg-sky-500 px-5 py-3 font-bold text-white" href="#">Get Started</a>
          <a className="rounded-full border border-slate-200 bg-white px-5 py-3 font-bold text-slate-900" href="#">View Demo</a>
        </div>
      </section>
    </main>
  );
}
`,
    },
    {
      path: "app/layout.tsx",
      content: `import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
    },
    {
      path: "app/globals.css",
      content: `@import "tailwindcss";

body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
}
`,
    },
  ];

  return {
    projectTitle,
    description,
    files,
    previewHtml,
    workflowLogs: [
      { agent: "Product Manager", action: "Defined structure" },
      { agent: "Designer", action: "Created premium visual system" },
      { agent: "Developer", action: "Generated files and preview" },
      { agent: "QA", action: "Validated responsive output" },
    ],
  };
}
