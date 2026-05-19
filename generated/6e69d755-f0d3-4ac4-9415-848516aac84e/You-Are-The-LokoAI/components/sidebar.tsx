export default function Sidebar() {
  const items = ["Overview", "Orders", "Menu", "Customers", "Settings"];
  return (
    <aside style={{
      width: 260,
      padding: 16,
      borderRight: "1px solid rgba(15,23,42,0.08)",
      background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(10px)",
    }}>
      <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 1.5, opacity: 0.6 }}>DASHBOARD</div>
      <div style={{ height: 10 }} />
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((label) => (
          <div key={label} style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(15,23,42,0.08)",
            background: "white",
            fontSize: 13,
            fontWeight: 800,
          }}>
            {label}
          </div>
        ))}
      </div>
    </aside>
  );
}
