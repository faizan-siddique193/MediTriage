import { useNavigate } from "react-router-dom";
import generateReport from "../utils/generateReport";

const DEMO_REPORT = {
  urgency: "URGENT",
  summary:
    "The combination of sudden, sharp abdominal pain localizing to the lower right quadrant, accompanied by mild nausea and a low-grade fever, is highly suggestive of acute appendicitis. Immediate medical evaluation is required.",
  actions: [
    "Go to the nearest Emergency Room within the next 4–6 hours.",
    "Do NOT eat or drink anything until evaluated by a physician.",
    "Avoid taking pain relievers — they can mask worsening symptoms.",
    "Have someone accompany you. Do not drive yourself.",
  ],
  agents: [
    { name: "Symptom Analyzer", pattern: "ReAct",   output: "Extracted: RLQ pain, nausea, low-grade fever (37.8°C), onset 8 hours ago, severity 7/10" },
    { name: "Medical Knowledge", pattern: "RAG",    output: "Top matches: Acute Appendicitis (high confidence), Ovarian Cyst (if female), Inguinal Hernia" },
    { name: "Risk Assessor",     pattern: "CoT",    output: "Step 1: RLQ pain + fever = red flag. Step 2: Rebound tenderness pattern. Step 3: Urgency → URGENT" },
  ],
};

const URGENCY_CONFIG = {
  URGENT: { color: "#f97316", bg: "#fff7ed", border: "#fed7aa", label: "URGENT" },
  EMERGENCY: { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", label: "EMERGENCY" },
  MODERATE: { color: "#eab308", bg: "#fefce8", border: "#fef08a", label: "MODERATE" },
  MILD: { color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", label: "MILD" },
};

export default function HighFidelityReport() {
  const navigate = useNavigate();
  const uc = URGENCY_CONFIG[DEMO_REPORT.urgency] || URGENCY_CONFIG.URGENT;

  const handleDownload = () => {
    generateReport({
      reportId: "DEMO-HF-001",
      triage_summary: DEMO_REPORT.summary,
      risk_assessment: { urgency: DEMO_REPORT.urgency, reasoning: DEMO_REPORT.summary },
      generatedAt: new Date().toISOString(),
      symptoms: "Sharp abdominal pain, lower right quadrant, nausea, low-grade fever",
      urgency_level: DEMO_REPORT.urgency,
      agent1_output: { symptoms: ["RLQ pain", "nausea", "fever"], severity: "7", duration: "8 hours" },
      agent2_output: { possible_conditions: [{ condition: "Acute Appendicitis", explanation: "High confidence match" }] },
      agent3_output: { urgency: DEMO_REPORT.urgency, reasoning: DEMO_REPORT.summary },
      orchestrator_output: { triage_report: { what_to_do_next: DEMO_REPORT.actions.join("\n") } },
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--cc-bg)",
      padding: "32px 20px 60px",
    }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Back navigation */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "none", border: "1px solid var(--cc-outline-variant)",
              borderRadius: 8, padding: "6px 12px", cursor: "pointer",
              fontSize: 13, color: "var(--cc-on-surface-variant)", fontWeight: 500,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
            background: "var(--cc-surface-container)", border: "1px solid var(--cc-outline-variant)",
            borderRadius: 999, padding: "3px 10px", color: "var(--cc-muted)",
          }}>
            Demo Report — Sample Output
          </div>
        </div>

        {/* Urgency banner */}
        <div style={{
          background: uc.bg, border: `1px solid ${uc.border}`,
          borderTop: `4px solid ${uc.color}`,
          borderRadius: 20, padding: "24px 28px", marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 22 }}>🟠</span>
              <h1 style={{
                fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800,
                color: "var(--cc-on-surface)", margin: 0,
              }}>
                Triage Report — Demo
              </h1>
            </div>
            <p style={{ fontSize: 13, color: "var(--cc-on-surface-variant)", margin: 0 }}>
              Seek medical attention within 4–6 hours. This is a demonstration of a real AI-generated triage output.
            </p>
          </div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 800, letterSpacing: "0.06em",
            background: uc.color, color: "#fff",
            borderRadius: 999, padding: "6px 16px",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.6)", display: "inline-block" }} />
            {uc.label}
          </span>
        </div>

        {/* Clinical summary */}
        <div style={{
          background: "var(--cc-surface)", border: "1px solid var(--cc-outline-variant)",
          borderRadius: 20, padding: "24px 28px", marginBottom: 16,
          boxShadow: "var(--cc-shadow-sm)",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--cc-muted)", marginBottom: 10,
          }}>Clinical Synthesis</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--cc-on-surface)", margin: 0 }}>
            {DEMO_REPORT.summary}
          </p>
        </div>

        {/* Recommended actions */}
        <div style={{
          background: "var(--cc-surface)", border: "1px solid var(--cc-outline-variant)",
          borderRadius: 20, padding: "24px 28px", marginBottom: 16,
          boxShadow: "var(--cc-shadow-sm)",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--cc-muted)", marginBottom: 14,
          }}>Recommended Actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DEMO_REPORT.actions.map((action, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "12px 14px",
                background: "var(--cc-surface-low)",
                border: "1px solid var(--cc-outline-variant)",
                borderRadius: 12,
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: uc.color + "18", color: uc.color,
                  fontSize: 11, fontWeight: 800,
                  display: "grid", placeItems: "center",
                  fontFamily: "var(--font-display)",
                }}>{i + 1}</span>
                <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--cc-on-surface)" }}>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent reasoning */}
        <div style={{
          background: "var(--cc-surface)", border: "1px solid var(--cc-outline-variant)",
          borderRadius: 20, padding: "24px 28px", marginBottom: 20,
          boxShadow: "var(--cc-shadow-sm)",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--cc-muted)", marginBottom: 14,
          }}>AI Agent Reasoning Log</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DEMO_REPORT.agents.map((agent, i) => {
              const patternColors = { ReAct: "#7c3aed", RAG: "#0369a1", CoT: "#c2410c" };
              const color = patternColors[agent.pattern] || "var(--cc-primary-container)";
              return (
                <div key={i} style={{
                  background: "var(--cc-surface-low)",
                  border: "1px solid var(--cc-outline-variant)",
                  borderRadius: 12, padding: "12px 14px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{
                      fontFamily: "var(--font-display)", fontWeight: 700,
                      fontSize: 13, color: "var(--cc-on-surface)",
                    }}>{agent.name}</span>
                    <code style={{
                      fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600,
                      background: color + "18", color, border: `1px solid ${color}33`,
                      borderRadius: 999, padding: "1px 8px",
                    }}>{agent.pattern}</code>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: 12,
                    color: "var(--cc-on-surface-variant)", lineHeight: 1.5, margin: 0,
                  }}>{agent.output}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={handleDownload}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 24px",
              background: "linear-gradient(135deg, #005eb8, #00478d)",
              color: "#fff", border: "none",
              borderRadius: 12, cursor: "pointer",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
              boxShadow: "0 4px 16px rgba(0,71,141,0.25)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Download PDF Report
          </button>
          <button
            onClick={() => navigate("/triage")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 20px",
              background: "var(--cc-surface)",
              color: "var(--cc-on-surface)",
              border: "1px solid var(--cc-outline-variant)",
              borderRadius: 12, cursor: "pointer",
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14,
            }}
          >
            Try with Real Symptoms
          </button>
        </div>

      </div>
    </div>
  );
}
