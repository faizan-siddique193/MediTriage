import { useNavigate } from "react-router-dom";

const STEPS = [
  {
    num: "01",
    emoji: "🩺",
    title: "Describe Your Symptoms",
    desc: "Type your symptoms in plain language — no medical jargon. Include duration, severity (1–10), and body location for best results.",
  },
  {
    num: "02",
    emoji: "🤖",
    title: "4 AI Agents Analyze",
    desc: "Our AI pipeline (ReAct → RAG → Chain-of-Thought → Orchestrator) reasons through your case and cross-references 4,920+ medical conditions.",
  },
  {
    num: "03",
    emoji: "📋",
    title: "Read Your Triage Report",
    desc: "You get an urgency level (Mild / Moderate / Urgent / Emergency), possible conditions, recommended next steps, and nearby doctor suggestions.",
  },
  {
    num: "04",
    emoji: "⬇️",
    title: "Download & Save",
    desc: "Download a PDF clinical summary. Your reports are saved locally in your browser — no account needed.",
  },
];

const SAFETY = [
  "This tool is for informational guidance only — not a medical diagnosis.",
  "Always consult a licensed doctor before making health decisions.",
  "For life-threatening emergencies call 1122 (Rescue) or 115 (Edhi) in Pakistan.",
  "Do not delay emergency care based on AI triage results.",
];

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--cc-bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
    }}>
      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: 680,
        background: "var(--cc-surface)",
        border: "1px solid var(--cc-outline-variant)",
        borderRadius: 24,
        boxShadow: "var(--cc-shadow-md)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #005eb8, #00478d)",
          padding: "36px 36px 32px",
          color: "#fff",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: "rgba(255,255,255,0.15)",
            display: "grid", placeItems: "center",
            fontSize: 26, marginBottom: 16,
          }}>🩺</div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800,
            color: "#fff", margin: "0 0 10px", lineHeight: 1.2,
          }}>
            Welcome to MediTriage AI
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.5 }}>
            Your AI-powered clinical triage assistant. Here's what you need to know before you start.
          </p>
        </div>

        {/* Steps */}
        <div style={{ padding: "32px 36px" }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--cc-muted)",
            marginBottom: 20,
          }}>How It Works</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {STEPS.map((step, i) => (
              <div key={step.num} style={{ display: "flex", gap: 0 }}>
                {/* Timeline */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "var(--cc-primary-fixed)",
                    border: "2px solid var(--cc-primary-fixed-dim)",
                    display: "grid", placeItems: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>{step.emoji}</div>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: "var(--cc-outline-variant)", minHeight: 20, margin: "4px 0" }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ paddingLeft: 16, paddingBottom: i < STEPS.length - 1 ? 24 : 0, flex: 1 }}>
                  <div style={{
                    fontFamily: "var(--font-display)", fontWeight: 700,
                    fontSize: 15, color: "var(--cc-on-surface)", marginBottom: 4, lineHeight: 1.3,
                  }}>{step.title}</div>
                  <p style={{ fontSize: 13, color: "var(--cc-on-surface-variant)", lineHeight: 1.6, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Safety Notice */}
          <div style={{
            marginTop: 28,
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 14, padding: "16px 18px",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "#92400e",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Safety Guidelines
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {SAFETY.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>
                  <span style={{ color: "#f59e0b", marginTop: 2, flexShrink: 0 }}>•</span>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <button
              onClick={() => navigate("/triage")}
              style={{
                flex: 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "13px 24px",
                background: "linear-gradient(135deg, #005eb8, #00478d)",
                color: "#fff", border: "none",
                borderRadius: 12, cursor: "pointer",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
                boxShadow: "0 4px 16px rgba(0,71,141,0.25)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,71,141,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,71,141,0.25)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z"/>
              </svg>
              Start My Triage
            </button>
            <button
              onClick={() => navigate("/home")}
              style={{
                padding: "13px 20px",
                background: "var(--cc-surface-container)",
                color: "var(--cc-on-surface-variant)",
                border: "1px solid var(--cc-outline-variant)",
                borderRadius: 12, cursor: "pointer",
                fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--cc-surface-container-high)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--cc-surface-container)"}
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Back link */}
      <a href="/" style={{
        marginTop: 20, fontSize: 13, color: "var(--cc-muted)",
        textDecoration: "none", display: "flex", alignItems: "center", gap: 4,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to homepage
      </a>
    </div>
  );
}
