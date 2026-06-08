import { useState } from "react";

/* ─── Icons (inline SVG only — no icon font dependency) ──────── */
const Icon = {
  logo: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C13.1 5.5 16 7.5 20 8C16 8.5 13.5 11 13.5 14.5C12.5 11 9.5 8.5 4 8C8 7.5 10.9 5.5 12 2Z" fill="currentColor"/>
      <path d="M12 14.5C12.6 16.5 14 17.8 16 18.2C14 18.6 12.8 20 12 21.5C11.2 20 10 18.6 8 18.2C10 17.8 11.4 16.5 12 14.5Z" fill="currentColor" opacity="0.5"/>
    </svg>
  ),
  arrowRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 12h18M3 6h18M3 18h18"/>
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 18L18 6M6 6l12 12"/>
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  brain: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 014.26-2.9A2.5 2.5 0 019.5 2z"/>
      <path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.44 2.5 2.5 0 002.96-3.08 3 3 0 00.34-5.58 2.5 2.5 0 00-4.26-2.9A2.5 2.5 0 0014.5 2z"/>
    </svg>
  ),
  book: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  ),
  scale: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21"/><path d="M3 6l9 6 9-6"/><path d="M3 18l9-6 9 6"/>
    </svg>
  ),
  hub: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><line x1="12" y1="9" x2="12" y2="3"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="9" y1="12" x2="3" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/>
    </svg>
  ),
  edit: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  analyze: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  report: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  download: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
    </svg>
  ),
  location: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  history: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 106 5.3L3 8"/>
      <line x1="12" y1="7" x2="12" y2="12"/><line x1="12" y1="12" x2="15" y2="15"/>
    </svg>
  ),
  waveform: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  github: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.468-2.381 1.235-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.51 11.51 0 013.003-.404c1.02.005 2.046.138 3.006.404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.652.243 2.873.12 3.176.77.84 1.232 1.911 1.232 3.221 0 4.61-2.807 5.624-5.48 5.921.43.37.815 1.102.815 2.222 0 1.605-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
};

/* ─── Data ───────────────────────────────────────────────────── */
const STATS = [
  { value: "4,920+", label: "Medical Conditions" },
  { value: "4",      label: "Specialist AI Agents" },
  { value: "< 30s",  label: "Average Analysis" },
  { value: "100%",   label: "Free to Use" },
];

const STEPS = [
  { num: "01", icon: "edit",    title: "Describe Symptoms",       text: "Type your symptoms in plain language — no medical jargon needed. Include duration, severity and location." },
  { num: "02", icon: "analyze", title: "4 AI Agents Analyze",     text: "ReAct, RAG, and Chain-of-Thought agents reason through your case. The Orchestrator synthesizes everything." },
  { num: "03", icon: "report",  title: "Get Your Triage Report",  text: "Receive urgency classification, possible conditions, nearby doctor suggestions, and a downloadable PDF." },
];

const AGENTS = [
  {
    icon: "brain",    name: "Symptom Analyzer",  badge: "ReAct",
    accent: "#7c3aed", bg: "#f3e8ff", border: "#e9d5ff",
    text: "Extracts clinical attributes from plain text — symptoms, duration, severity, body location — using step-by-step Reason+Act loops.",
  },
  {
    icon: "book",     name: "Medical Knowledge", badge: "RAG",
    accent: "#0369a1", bg: "#e0f2fe", border: "#bae6fd",
    text: "Retrieves relevant conditions from a 4,920-row medical dataset using vector search, then generates ranked differential diagnoses.",
  },
  {
    icon: "scale",    name: "Risk Assessor",     badge: "Chain-of-Thought",
    accent: "#c2410c", bg: "#fff7ed", border: "#fed7aa",
    text: "Evaluates urgency step-by-step: checks red flags, duration, severity score, and symptom progression before scoring.",
  },
  {
    icon: "hub",      name: "Orchestrator",      badge: "Planner",
    accent: "#166534", bg: "#f0fdf4", border: "#bbf7d0",
    text: "Dispatches all 3 agents, collects outputs, resolves conflicts, and synthesizes one final triage report using the Planner pattern.",
  },
];

const URGENCY = [
  { emoji: "🟢", title: "Mild",      color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", action: "Home monitoring. Rest, hydrate, OTC medication. Monitor for 24–48 hours." },
  { emoji: "🟡", title: "Moderate",  color: "#eab308", bg: "#fefce8", border: "#fef08a", action: "See a GP within 24–48 hours. Not urgent but needs medical attention." },
  { emoji: "🟠", title: "Urgent",    color: "#f97316", bg: "#fff7ed", border: "#fed7aa", action: "See a doctor today. Same-day appointment or urgent care visit required." },
  { emoji: "🔴", title: "Emergency", color: "#ef4444", bg: "#fef2f2", border: "#fecaca", action: "Go to ER immediately or call 1122 (Pakistan) / your local emergency number." },
];

const FEATURES = [
  { icon: "download", title: "Downloadable PDF Report",   text: "Every analysis generates a clinical PDF with all agent outputs, doctor suggestions, and your health summary." },
  { icon: "location", title: "Doctor Finder by City",      text: "After triage, get AI-suggested hospitals and clinics in your city — Lahore, Karachi, Faisalabad, or anywhere." },
  { icon: "history",  title: "Triage History",            text: "Every session is saved locally. Review past analyses and track how your symptoms change over time." },
];

/* ─── Styles (pure CSS vars — no Tailwind utilities) ────────── */
const S = {
  page: {
    minHeight: "100vh",
    background: "var(--cc-bg)",
    fontFamily: "var(--font-body)",
    color: "var(--cc-on-surface)",
    overflowX: "hidden",
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
    width: "100%",
  },
  sectionLabel: {
    display: "inline-flex", alignItems: "center", gap: 6,
    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "var(--cc-primary-container)",
    background: "var(--cc-primary-fixed)", border: "1px solid var(--cc-primary-fixed-dim)",
    borderRadius: 999, padding: "3px 12px", marginBottom: 14,
  },
  h2: {
    fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: 800, color: "var(--cc-on-surface)", lineHeight: 1.2,
    letterSpacing: "-0.02em", margin: "0 0 12px",
  },
  subtext: {
    fontSize: 17, lineHeight: 1.6, color: "var(--cc-on-surface-variant)",
    maxWidth: 560, margin: "0 auto",
  },
  card: {
    background: "var(--cc-surface)",
    border: "1px solid var(--cc-outline-variant)",
    borderRadius: 20, padding: 24,
    boxShadow: "var(--cc-shadow-sm)",
  },
  badge: (accent, bg, border) => ({
    display: "inline-flex", alignItems: "center",
    fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
    fontFamily: "var(--font-mono)",
    background: bg, color: accent, border: `1px solid ${border}`,
    borderRadius: 999, padding: "2px 10px",
  }),
};

/* ─── Shared Section wrapper ─────────────────────────────────── */
function Section({ id, style, children }) {
  return (
    <section id={id} style={{ padding: "80px 0", ...style }}>
      <div style={S.container}>{children}</div>
    </section>
  );
}

function SectionHeader({ label, title, subtitle, center = true }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 52 }}>
      <div style={S.sectionLabel}>{label}</div>
      <h2 style={{ ...S.h2, textAlign: center ? "center" : "left" }}>{title}</h2>
      {subtitle && (
        <p style={{ ...S.subtext, margin: center ? "0 auto" : undefined }}>{subtitle}</p>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "How It Works", href: "#how" },
    { label: "AI Agents",    href: "#agents" },
    { label: "Features",     href: "#features" },
    { label: "Urgency Scale",href: "#urgency" },
  ];

  return (
    <div style={S.page}>

      {/* ══════════════ NAVBAR ══════════════════════════════════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(249,249,255,0.92)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--cc-outline-variant)",
      }}>
        <div style={{ ...S.container, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Brand */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--cc-on-surface)" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: "linear-gradient(135deg, #005eb8, #00478d)",
              display: "grid", placeItems: "center", color: "#fff", flexShrink: 0,
            }}>
              {Icon.logo}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, lineHeight: 1.1, color: "var(--cc-on-surface)" }}>
                MediTriage <span style={{ color: "var(--cc-primary-container)" }}>AI</span>
              </div>
              <div style={{ fontSize: 10, color: "var(--cc-muted)", letterSpacing: "0.04em" }}>Clinical Triage System</div>
            </div>
          </a>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="lp-desktop-nav">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} style={{
                fontSize: 14, fontWeight: 600, color: "var(--cc-on-surface-variant)",
                textDecoration: "none", transition: "color 0.15s",
              }}
              onMouseEnter={e => e.target.style.color = "var(--cc-primary-container)"}
              onMouseLeave={e => e.target.style.color = "var(--cc-on-surface-variant)"}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="/triage" style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
              background: "linear-gradient(135deg, #005eb8, #00478d)",
              color: "#fff", textDecoration: "none",
              borderRadius: 999, padding: "9px 20px",
              boxShadow: "0 2px 12px rgba(0,71,141,0.25)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,71,141,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,71,141,0.25)"; }}
            >
              Start Free Triage
              <span style={{ opacity: 0.8 }}>{Icon.arrowRight}</span>
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: "none", width: 40, height: 40,
                background: "var(--cc-surface-container)",
                border: "1px solid var(--cc-outline-variant)",
                borderRadius: 10, cursor: "pointer",
                color: "var(--cc-on-surface-variant)",
                alignItems: "center", justifyContent: "center",
              }}
              className="lp-menu-btn"
              aria-label="Toggle menu"
            >
              {menuOpen ? Icon.close : Icon.menu}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: "var(--cc-surface)",
            borderTop: "1px solid var(--cc-outline-variant)",
            padding: "16px 24px 20px",
          }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 0", fontSize: 15, fontWeight: 600,
                  color: "var(--cc-on-surface)", textDecoration: "none",
                  borderBottom: "1px solid var(--cc-outline-variant)",
                }}
              >
                {l.label}
                <span style={{ opacity: 0.4 }}>{Icon.arrowRight}</span>
              </a>
            ))}
            <a href="/triage" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginTop: 16, padding: "12px 0",
              background: "linear-gradient(135deg, #005eb8, #00478d)",
              color: "#fff", fontWeight: 700, fontSize: 15,
              borderRadius: 12, textDecoration: "none",
            }}>
              Start Free Triage {Icon.arrowRight}
            </a>
          </div>
        )}
      </nav>

      {/* ══════════════ HERO ════════════════════════════════════ */}
      <header style={{ padding: "96px 0 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Background radial glow */}
        <div style={{
          position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: 800, height: 500, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,94,184,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ ...S.container, position: "relative" }}>
          {/* Pulsing badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--cc-primary-fixed)", border: "1px solid var(--cc-primary-fixed-dim)",
            borderRadius: 999, padding: "6px 16px", marginBottom: 28,
            fontSize: 12, fontWeight: 600, color: "var(--cc-primary-container)",
          }}>
            <span style={{ position: "relative", width: 8, height: 8 }}>
              <span style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "#22c55e", animation: "lp-ping 1.5s ease-out infinite",
                opacity: 0.6,
              }} />
              <span style={{
                position: "absolute", inset: "1px", borderRadius: "50%",
                background: "#22c55e",
              }} />
            </span>
            Powered by Llama 3.3 via Groq · Live
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "var(--cc-on-surface)",
            maxWidth: 820, margin: "0 auto 24px",
          }}>
            AI-Powered Symptom Triage{" "}
            <span style={{
              background: "linear-gradient(135deg, #005eb8, #00478d)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              for Everyone
            </span>
          </h1>

          <p style={{
            fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.65,
            color: "var(--cc-on-surface-variant)",
            maxWidth: 620, margin: "0 auto 40px",
          }}>
            Describe your symptoms. Our 4 specialist AI agents analyze, cross-reference
            medical databases, assess risk, and suggest nearby doctors — all in under 30 seconds.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <a href="/triage" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
              background: "linear-gradient(135deg, #005eb8, #00478d)",
              color: "#fff", textDecoration: "none",
              borderRadius: 999, padding: "14px 32px",
              boxShadow: "0 4px 24px rgba(0,71,141,0.3)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,71,141,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,71,141,0.3)"; }}
            >
              Start Triage — It's Free
              {Icon.arrowRight}
            </a>
            <a href="https://github.com/faizan-siddique193/AI-Powered-Medical-Symptom-Triage-System" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
              background: "var(--cc-surface)", color: "var(--cc-on-surface)",
              border: "1px solid var(--cc-outline-variant)",
              textDecoration: "none", borderRadius: 999, padding: "14px 28px",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--cc-surface-container)"; e.currentTarget.style.borderColor = "var(--cc-outline)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--cc-surface)"; e.currentTarget.style.borderColor = "var(--cc-outline-variant)"; }}
            >
              {Icon.github}
              View on GitHub
            </a>
          </div>

          {/* Trust badges */}
          <div style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20,
            marginTop: 36, fontSize: 13, color: "var(--cc-muted)", fontWeight: 500,
          }}>
            {["No account required", "No credit card", "Open source codebase"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#22c55e" }}>{Icon.check}</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ══════════════ STATS BAR ════════════════════════════════ */}
      <div style={{
        borderTop: "1px solid var(--cc-outline-variant)",
        borderBottom: "1px solid var(--cc-outline-variant)",
        background: "var(--cc-surface)",
        padding: "28px 0",
      }}>
        <div style={{
          ...S.container,
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0, textAlign: "center",
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              position: "relative", padding: "4px 16px",
              borderRight: i < STATS.length - 1 ? "1px solid var(--cc-outline-variant)" : undefined,
            }}>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800,
                color: "var(--cc-primary-container)", lineHeight: 1.1, marginBottom: 4,
              }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "var(--cc-muted)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ HOW IT WORKS ═════════════════════════════ */}
      <Section id="how" style={{ background: "var(--cc-surface-container-lowest)" }}>
        <SectionHeader
          label="How It Works"
          title="From symptoms to clarity in seconds"
          subtitle="A streamlined clinical workflow designed for speed, accuracy, and full explainability."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, position: "relative" }}>
          {/* Connecting line */}
          <div style={{
            position: "absolute", top: 44, left: "16.6%", right: "16.6%", height: 1,
            background: "var(--cc-outline-variant)", zIndex: 0,
            borderTop: "2px dashed var(--cc-outline-variant)",
          }} />
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
              ...S.card, position: "relative", zIndex: 1,
              display: "flex", flexDirection: "column", gap: 16,
              animation: `fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms both`,
            }}>
              {/* Step number */}
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #005eb8, #00478d)",
                display: "grid", placeItems: "center",
                fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 12, color: "#fff",
              }}>{step.num}</div>
              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: "var(--cc-primary-fixed)", color: "var(--cc-primary-container)",
                display: "grid", placeItems: "center",
              }}>{Icon[step.icon]}</div>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--cc-on-surface)", marginBottom: 8 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--cc-on-surface-variant)", margin: 0 }}>
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════════ AI AGENTS ════════════════════════════════ */}
      <Section id="agents">
        <SectionHeader
          label="The System"
          title="4 Agents. One orchestrated answer."
          subtitle="Each agent uses a distinct AI design pattern, making the reasoning transparent and auditable."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {AGENTS.map((agent, i) => (
            <div key={agent.name} style={{
              ...S.card,
              display: "flex", alignItems: "flex-start", gap: 16,
              animation: `fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`,
              transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--cc-shadow-md)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: agent.bg, color: agent.accent,
                border: `1px solid ${agent.border}`,
                display: "grid", placeItems: "center",
              }}>{Icon[agent.icon]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--cc-on-surface)" }}>
                    {agent.name}
                  </span>
                  <span style={S.badge(agent.accent, agent.bg, agent.border)}>{agent.badge}</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--cc-on-surface-variant)", margin: 0 }}>
                  {agent.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════════ URGENCY SCALE ════════════════════════════ */}
      <Section id="urgency" style={{ background: "var(--cc-surface-container-lowest)" }}>
        <SectionHeader
          label="Urgency Scale"
          title="What do the results mean?"
          subtitle="Every analysis produces one of four urgency levels — each with a clear action plan."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {URGENCY.map((u, i) => (
            <div key={u.title} style={{
              background: u.bg,
              border: `1px solid ${u.border}`,
              borderRadius: 20, padding: 24,
              borderTop: `4px solid ${u.color}`,
              animation: `fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`,
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{u.emoji}</div>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: 18, color: u.color, marginBottom: 10,
              }}>{u.title}</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--cc-on-surface-variant)", margin: 0 }}>
                {u.action}
              </p>
            </div>
          ))}
        </div>

      </Section>

      {/* ══════════════ FEATURES ═════════════════════════════════ */}
      <Section id="features">
        <SectionHeader
          label="Features"
          title="Everything you need for smart triage"
          subtitle="Built for clinical clarity, speed, and accessibility — from any device, anywhere."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} style={{
              ...S.card,
              animation: `fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both`,
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cc-primary-fixed-dim)"; e.currentTarget.style.boxShadow = "var(--cc-shadow-md)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14, marginBottom: 14,
                background: "var(--cc-primary-fixed)", color: "var(--cc-primary-container)",
                display: "grid", placeItems: "center",
              }}>{Icon[f.icon]}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--cc-on-surface)", marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--cc-on-surface-variant)", margin: 0 }}>
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════════ CTA BANNER ═══════════════════════════════ */}
      <section style={{ padding: "0 0 80px" }}>
        <div style={{
          ...S.container,
          background: "linear-gradient(135deg, #005eb8 0%, #00478d 100%)",
          borderRadius: 28, padding: "64px 56px", textAlign: "center",
          position: "relative", overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: 40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div style={{ position: "relative" }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800, color: "#fff", marginBottom: 16, lineHeight: 1.15,
            }}>
              Check your symptoms.<br />It's completely free.
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
              No account required. No credit card. Just describe your symptoms and get a triage report in seconds.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
              <a href="/triage" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
                background: "#fff", color: "var(--cc-primary-container)",
                textDecoration: "none", borderRadius: 999, padding: "14px 32px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)"; }}
              >
                Quick Triage {Icon.arrowRight}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ═══════════════════════════════════ */}
      <footer style={{
        borderTop: "1px solid var(--cc-outline-variant)",
        background: "var(--cc-surface)", padding: "48px 0 32px",
      }}>
        <div style={S.container}>
          {/* Top: brand + links */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 48, alignItems: "flex-start", marginBottom: 40 }}>
            {/* Brand */}
            <div>
              <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--cc-on-surface)", marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #005eb8, #00478d)", display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}>
                  {Icon.logo}
                </div>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15 }}>MediTriage AI</span>
              </a>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--cc-muted)", maxWidth: 300, margin: 0 }}>
                AI-powered clinical triage for underserved communities.
                A capstone project — free, open, and transparent.
              </p>
            </div>

            {/* Tech stack */}
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--cc-on-surface)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                Tech Stack
              </div>
              {["FastAPI · LangGraph", "React + Zustand", "Pinecone RAG", "Groq LLM", "Tavily Tool Use"].map(item => (
                <div key={item} style={{ fontSize: 13, color: "var(--cc-muted)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
                  {item}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--cc-on-surface)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                Navigation
              </div>
              {[
                { label: "Symptom Triage", href: "/triage" },
                { label: "Report History", href: "/reports" },
                { label: "Settings", href: "/settings" },
              ].map(l => (
                <div key={l.href} style={{ marginBottom: 6 }}>
                  <a href={l.href} style={{ fontSize: 13, color: "var(--cc-on-surface-variant)", textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => e.target.style.color = "var(--cc-primary-container)"}
                  onMouseLeave={e => e.target.style.color = "var(--cc-on-surface-variant)"}
                  >{l.label}</a>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: "1px solid var(--cc-outline-variant)", paddingTop: 24,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
          }}>
            <p style={{ fontSize: 13, color: "var(--cc-muted)", margin: 0 }}>
              © {new Date().getFullYear()} MediTriage AI — Academic project, not a licensed medical device.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "4px 12px",
                background: "var(--cc-surface-container)",
                border: "1px solid var(--cc-outline-variant)",
                borderRadius: 999,
              }}>
                <span style={{ position: "relative", width: 8, height: 8 }}>
                  <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#22c55e", animation: "lp-ping 1.5s ease-out infinite", opacity: 0.5 }} />
                  <span style={{ position: "absolute", inset: "1px", borderRadius: "50%", background: "#22c55e" }} />
                </span>
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--cc-on-surface-variant)", fontWeight: 600 }}>v1.0.0 · Live</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Landing page local animations ──────────────────────── */}
      <style>{`
        @keyframes lp-ping {
          0%   { transform: scale(1); opacity: 0.6; }
          70%  { transform: scale(2); opacity: 0; }
          100% { transform: scale(2); opacity: 0; }
        }
        @media (max-width: 860px) {
          .lp-desktop-nav { display: none !important; }
          .lp-menu-btn    { display: flex !important; }
        }
        @media (max-width: 700px) {
          #how    > div > div:last-child { grid-template-columns: 1fr !important; }
          #agents > div > div:last-child { grid-template-columns: 1fr !important; }
          #urgency > div > div:first-of-type { grid-template-columns: repeat(2,1fr) !important; }
          #features > div > div:last-child  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          footer div[style*="grid-template-columns: 1fr auto auto"] {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}
