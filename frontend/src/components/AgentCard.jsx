
const PATTERN_BADGES = {
  ReAct:  { cls: "cc-badge cc-badge--react",  label: "ReAct" },
  RAG:    { cls: "cc-badge cc-badge--rag",    label: "RAG" },
  "Chain-of-Thought": { cls: "cc-badge cc-badge--cot", label: "CoT" },
  CoT:    { cls: "cc-badge cc-badge--cot",    label: "CoT" },
  Planner:{ cls: "cc-badge cc-badge--plan",   label: "Planner" },
  "Tool Use": { cls: "cc-badge cc-badge--rag", label: "Tool Use" },
};

const AGENT_ICONS = {
  "Symptom Analyzer": "🔬",
  "Medical Knowledge": "📚",
  "Knowledge Retriever": "📚",
  "Risk Assessor": "⚖️",
  "Orchestrator": "🧠",
};

const AgentCard = ({ title, pattern, data, isProcessing = false, isDone = false }) => {
  const badge = PATTERN_BADGES[pattern] || { cls: "cc-badge cc-badge--muted", label: pattern };
  const icon = AGENT_ICONS[title] || "🤖";

  return (
    <div
      className={`cc-card agent-card-enter ${isProcessing ? "agent-processing" : ""}`}
      style={{
        borderLeft: isDone ? "3px solid var(--cc-primary-container)" : "3px solid var(--cc-outline-variant)",
        transition: "border-color 0.3s",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--cc-primary-fixed)",
              display: "grid", placeItems: "center",
              fontSize: 18, flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--cc-on-surface)" }}>
              {title}
            </div>
            <div style={{ fontSize: 11, color: "var(--cc-muted)", marginTop: 1 }}>Expert AI Agent</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className={badge.cls}>{badge.label}</span>
          {isProcessing && (
            <div className="proc-dots">
              <div className="proc-dot" />
              <div className="proc-dot" />
              <div className="proc-dot" />
            </div>
          )}
          {isDone && !isProcessing && (
            <span style={{ fontSize: 14 }}>✅</span>
          )}
        </div>
      </div>

      {/* Data */}
      {data ? (
        <div className="cc-mono" style={{ maxHeight: 200, overflow: "auto" }}>
          {typeof data === "object" ? JSON.stringify(data, null, 2) : String(data)}
        </div>
      ) : (
        <div
          className="cc-skeleton"
          style={{ height: 60, borderRadius: "var(--cc-r-md)" }}
        />
      )}
    </div>
  );
};

export default AgentCard;
