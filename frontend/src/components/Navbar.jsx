import { useState, useEffect } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";

const NAV_ITEMS = [
  {
    to: "/triage",
    label: "Symptom Triage",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="nav-icon" aria-hidden>
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    to: "/reports",
    label: "Report History",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="nav-icon" aria-hidden>
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div
        className="mobile-topbar"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          background: "rgba(248,250,252,0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--cc-outline-variant)",
          padding: "12px 20px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link to="/" className="app-sidebar-brand" style={{ padding: 0, border: "none" }}>
          <div className="app-sidebar-brand-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 2C13.1 5.5 16 7.5 20 8C16 8.5 13.5 11 13.5 14.5C12.5 11 9.5 8.5 4 8C8 7.5 10.9 5.5 12 2Z" fill="white" />
            </svg>
          </div>
          <span className="app-sidebar-brand-name">MediTriage AI</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="btn-ghost"
          style={{ padding: "6px 8px" }}
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <aside className={`app-sidebar${mobileOpen ? " open" : ""}`}>
        <Link to="/" className="app-sidebar-brand" onClick={() => setMobileOpen(false)}>
          <div className="app-sidebar-brand-mark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 2C13.1 5.5 16 7.5 20 8C16 8.5 13.5 11 13.5 14.5C12.5 11 9.5 8.5 4 8C8 7.5 10.9 5.5 12 2Z" fill="white" />
            </svg>
          </div>
          <div>
            <div className="app-sidebar-brand-name">MediTriage AI</div>
            <div className="app-sidebar-brand-sub">Open-source triage</div>
          </div>
        </Link>

        <nav className="app-sidebar-nav">
          <div className="app-sidebar-section-label">Menu</div>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `app-nav-link${isActive ? " active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="app-sidebar-footer" />
      </aside>
    </>
  );
}
