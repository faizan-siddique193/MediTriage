import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const PAGE_TITLES = {
  "/home":     "Dashboard",
  "/triage":   "Symptom Triage",
  "/analysis": "Live Analysis",
  "/reports":  "Report History",
  "/settings": "Settings",
};

export default function AppLayout({ children }) {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || "MediTriage AI";

  return (
    <div className="app-shell">
      <Navbar pageTitle={pageTitle} />

      <main className="app-content">
        {/* Sticky topbar */}
        <div className="app-topbar">
          <h1 className="app-topbar-title">{pageTitle}</h1>
          <div className="app-topbar-right">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="status-dot status-dot--online" />
              <span style={{ fontSize: 12, color: "var(--cc-muted)", fontWeight: 500 }}>
                AI System Online
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="app-page">
          {children}
        </div>

        {/* Fixed glass disclaimer */}
        <div className="disclaimer-banner">
          ⚠️ MediTriage AI is an academic project and is <strong>not a substitute</strong> for professional medical advice.
          Always consult a licensed healthcare provider. Emergency (Pakistan): <strong>1122</strong> or <strong>115</strong>.
        </div>

        <div style={{ height: 52 }} />
      </main>
    </div>
  );
}
