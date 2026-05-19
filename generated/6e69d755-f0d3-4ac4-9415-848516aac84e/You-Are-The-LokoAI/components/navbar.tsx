export default function Navbar() {
  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 18px",
      borderBottom: "1px solid rgba(15,23,42,0.08)",
      position: "sticky",
      top: 0,
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(10px)",
    }}>
      <div style={{ fontWeight: 900 }}>You Are The LokoAI</div>
      <nav style={{ display: "flex", gap: 12, fontSize: 13, fontWeight: 800 }}>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
      </nav>
    </header>
  );
}
