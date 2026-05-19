import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

export default function DashboardPage() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 18 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>Dashboard</h2>
          <p style={{ marginTop: 8, opacity: 0.75 }}>This is a starter dashboard generated in offline mode.</p>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {["Revenue", "Orders", "Customers", "Conversion"].map((k) => (
              <div key={k} style={{ padding: 16, borderRadius: 18, border: "1px solid rgba(15,23,42,0.08)", background: "white" }}>
                <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.6 }}>{k.toUpperCase()}</div>
                <div style={{ marginTop: 6, fontSize: 24, fontWeight: 900 }}>{Math.floor(Math.random() * 900 + 100)}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
