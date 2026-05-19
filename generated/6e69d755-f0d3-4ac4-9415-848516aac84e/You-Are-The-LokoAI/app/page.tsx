import Navbar from "../components/navbar";

export default function Page() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          padding: 22,
          borderRadius: 20,
          border: "1px solid rgba(15,23,42,0.08)",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(10px)",
        }}>
          <h1 style={{ margin: 0, fontSize: 42, letterSpacing: "-0.03em" }}>You Are The LokoAI</h1>
          <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.8 }}>You are the LokoAI Superagent Orchestrator, an advanced AI IDE system.
      You will simulate a collaborative workflow between 4 specialized agents to build the user's project: c c .
      
      The agents are:
      1. Product Manager (PM): Defines features and structure.
      2. UI/UX Designer: Sets the visual theme (Glassmorphism, SaaS premium effects).
      3. Lead Developer: Writes production-ready code (Next.js, Tailwind, Framer Motion).
      4. QA Tester: Audits for errors and quality.

      IMPORTANT RULES:
      - Always generate full working code (no placeholders)
      - Use Next.js App Router, TypeScript, and Shadcn UI
      - Create responsive, visually stunning layouts
      - Follow modern SaaS design principles automatically

      Return a JSON response with the following structure:
      {
        projectTitle: String,
        workflowLogs: [
          { agent: Product Manager, action: Analyzing requirements... },
          { agent: UI/UX Designer, action: Designing layout... },
          { agent: Lead Developer, action: Building components... },
          { agent: QA Tester, action: Auditing code... }
        ],
        pmSpecs: String,
        designSpecs: String,
        files: [
          { path: String, content: String }
        ],
        previewHtml: String
      }</p>
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/dashboard" style={{
              padding: "12px 14px",
              borderRadius: 14,
              background: "#0ea5e9",
              color: "white",
              fontWeight: 900,
              textDecoration: "none",
            }}>Open Dashboard</a>
            <a href="#features" style={{
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(15,23,42,0.12)",
              background: "white",
              color: "#0f172a",
              fontWeight: 900,
              textDecoration: "none",
            }}>See Features</a>
          </div>
        </div>

        <section id="features" style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {["Beautiful UI", "Fast setup", "Easy editing", "Ready preview"].map((t) => (
            <div key={t} style={{ padding: 16, borderRadius: 18, border: "1px solid rgba(15,23,42,0.08)", background: "white" }}>
              <div style={{ fontWeight: 900 }}>{t}</div>
              <div style={{ marginTop: 6, fontSize: 13, opacity: 0.7 }}>Offline starter file — replace with AI output when API is ready.</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
