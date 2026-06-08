import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAgents, healthCheck } from "../api";

/* ─── Stat Card ──────────────────────────────────────────────── */
function StatCard({ label, value, icon, accent, delay = 0 }) {
  return (
    <div
      className="stat-card"
      style={{ animationDelay: `${delay}ms`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}
    >
      <div>
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value" style={{ color: accent || "var(--cc-on-surface)" }}>
          {value}
        </div>
      </div>
      <div className="stat-card-icon" style={{ background: (accent ? accent + "18" : undefined), color: accent || "var(--cc-primary)" }}>
        {icon}
      </div>
    </div>
  );
}

/* ─── Pipeline Step ──────────────────────────────────────────── */
function PipelineStep({ num, title, pattern, role, accent, last }) {
  return (
    <div style={{ display: "flex", gap: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 36, flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: accent + "18", border: `2px solid ${accent}`,
          display: "grid", placeItems: "center",
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: accent,
        }}>{num}</div>
        {!last && <div style={{ width: 2, flex: 1, background: "var(--cc-outline-variant)", minHeight: 24, margin: "4px 0" }} />}
      </div>
      <div style={{ paddingLeft: 14, paddingBottom: last ? 0 : 20, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--cc-on-surface)" }}>{title}</span>
          <code style={{
            fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 500,
            background: accent + "18", color: accent,
            border: `1px solid ${accent}44`,
            borderRadius: 999, padding: "1px 8px",
          }}>{pattern}</code>
        </div>
        <p style={{ fontSize: 13, color: "var(--cc-on-surface-variant)", lineHeight: 1.5, margin: 0 }}>{role}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [health, setHealth] = useState(null);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [loadingHealth, setLoadingHealth] = useState(true);

  // Load from localStorage
  const savedReports = JSON.parse(localStorage.getItem("medi_reports") || "[]");
  const lastReport = savedReports[0];

  useEffect(() => {
    getAgents()
      .then((data) => { setAgents(data); setLoadingAgents(false); })
      .catch(() => { setAgents([]); setLoadingAgents(false); });

    healthCheck()
      .then((data) => { setHealth(data); setLoadingHealth(false); })
      .catch(() => { setHealth(null); setLoadingHealth(false); });
  }, []);

  const pipeline = [
    { num: 1, title: "Symptom Analyzer", pattern: "ReAct",   accent: "#7c3aed", role: "Extracts structured medical attributes from free-text symptoms" },
    { num: 2, title: "Medical Knowledge", pattern: "RAG",    accent: "#0369a1", role: "Retrieves possible conditions from a curated clinical knowledge base" },
    { num: 3, title: "Risk Assessor",    pattern: "CoT",     accent: "#c2410c", role: "Evaluates urgency using Chain-of-Thought step-by-step reasoning" },
    { num: 4, title: "Orchestrator",     pattern: "Planner", accent: "#166534", role: "Synthesizes all agent outputs into a unified triage recommendation" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Welcome banner ── */}
      <div
        className="cc-card"
        style={{
          background: "linear-gradient(135deg, #005eb8 0%, #00478d 100%)",
          border: "none",
          borderRadius: "var(--cc-r-xl)",
          padding: "28px 28px",
          color: "#fff",
          animation: "fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: -40, right: -40, width: 200, height: 200,
          borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -30, left: 60, width: 120, height: 120,
          borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.15)", borderRadius: 999, padding: "3px 12px",
            fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
            marginBottom: 12, color: "rgba(255,255,255,0.9)",
          }}>
            <span className="status-dot status-dot--online" style={{ boxShadow: "0 0 0 3px rgba(255,255,255,0.3)" }} />
            System Ready
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 8 }}>
            Welcome to MediTriage AI
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.6, maxWidth: 540, marginBottom: 20 }}>
            Your AI-powered medical triage assistant uses a multi-agent architecture to analyze symptoms,
            identify possible conditions, assess risk, and recommend actions — all in seconds.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn-primary"
              onClick={() => navigate("/triage")}
              style={{ background: "#fff", color: "var(--cc-primary)", fontSize: 14, padding: "10px 20px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Start Triage
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/analysis")}
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff", borderColor: "rgba(255,255,255,0.25)" }}
            >
              View Agents
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <StatCard
          label="API Status"
          value={loadingHealth ? "Checking…" : (health ? "Online" : "Offline")}
          accent={loadingHealth ? "#f59e0b" : (health ? "#22c55e" : "#ef4444")}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
          delay={100}
        />
        <StatCard
          label="AI Agents"
          value={loadingAgents ? "—" : agents.length}
          accent="var(--cc-primary-container)"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>}
          delay={150}
        />
        <StatCard
          label="Saved Reports"
          value={savedReports.length}
          accent="#793100"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
          delay={200}
        />
        <StatCard
          label="Last Urgency"
          value={lastReport ? lastReport.payload?.urgency_level || "—" : "None yet"}
          accent={lastReport?.payload?.urgency_level === "EMERGENCY" ? "#ef4444" :
                  lastReport?.payload?.urgency_level === "URGENT" ? "#f97316" :
                  lastReport?.payload?.urgency_level === "MODERATE" ? "#eab308" : "#22c55e"}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
          delay={250}
        />
      </div>

      {/* ── Bottom row — Agents + Pipeline ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Active agents */}
        <div className="cc-card" style={{ animation: "fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}>
          <div style={{ marginBottom: 16 }}>
            <div className="cc-section-title">AI Agents</div>
            <div className="cc-section-desc">Backend agents available for triage processing</div>
          </div>
          {loadingAgents ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[1,2,3,4].map(i => <div key={i} className="cc-skeleton" style={{ height: 52, borderRadius: 10 }} />)}
            </div>
          ) : agents.length === 0 ? (
            <div className="cc-alert cc-alert--warning" style={{ fontSize: 13 }}>
              Backend not reachable. Start the Python server on port 8000.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {agents.map((agent, i) => {
                const colors = ["#7c3aed", "#0369a1", "#c2410c", "#166534"];
                const color = colors[i % colors.length];
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px",
                    background: "var(--cc-surface-low)",
                    border: "1px solid var(--cc-outline-variant)",
                    borderRadius: "var(--cc-r-lg)",
                    animation: `agentEnter 0.4s ${i * 80}ms both`,
                  }}>
                    <span className="status-dot status-dot--online" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--cc-on-surface)" }}>
                        {agent.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--cc-muted)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {agent.role}
                      </div>
                    </div>
                    <code style={{
                      fontFamily: "var(--font-mono)", fontSize: 10,
                      background: color + "18", color,
                      border: `1px solid ${color}33`,
                      borderRadius: 999, padding: "2px 8px",
                      flexShrink: 0,
                    }}>{agent.pattern}</code>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Agent pipeline */}
        <div className="cc-card" style={{ animation: "fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}>
          <div style={{ marginBottom: 16 }}>
            <div className="cc-section-title">Agent Pipeline</div>
            <div className="cc-section-desc">Sequential multi-agent orchestration flow</div>
          </div>
          <div>
            {pipeline.map((step, i) => (
              <PipelineStep key={i} {...step} last={i === pipeline.length - 1} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent activity ── */}
      {savedReports.length > 0 && (
        <div className="cc-card" style={{ animation: "fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div className="cc-section-title">Recent Triage Reports</div>
              <div className="cc-section-desc">Your last {Math.min(savedReports.length, 3)} saved reports</div>
            </div>
            <button className="btn-secondary" style={{ fontSize: 12, padding: "6px 14px", minHeight: 32 }} onClick={() => navigate("/reports")}>
              View all
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {savedReports.slice(0, 3).map((r, i) => {
              const level = r.payload?.urgency_level || "MILD";
              const urgencyColors = { MILD: "#22c55e", MODERATE: "#eab308", URGENT: "#f97316", EMERGENCY: "#ef4444" };
              const color = urgencyColors[level] || "#22c55e";
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px",
                  background: "var(--cc-surface-low)",
                  border: "1px solid var(--cc-outline-variant)",
                  borderRadius: "var(--cc-r-lg)",
                }}>
                  <div style={{ width: 4, height: 36, borderRadius: 2, background: color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--cc-on-surface)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      Report #{r.id}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--cc-muted)", marginTop: 1 }}>
                      {r.payload?.generatedAt ? new Date(r.payload.generatedAt).toLocaleString() : ""}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                    background: color + "18", color, border: `1px solid ${color}44`,
                    borderRadius: 999, padding: "2px 10px",
                  }}>{level}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
