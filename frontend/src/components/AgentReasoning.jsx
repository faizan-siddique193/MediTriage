import { useState } from "react";
import {
  SymptomInsight,
  KnowledgeInsight,
  RiskInsight,
  DoctorInsight,
} from "./AgentInsight";
import { toAsciiText } from "../utils/formatText";

const AGENTS = [
  {
    key: "symptom_analyzer",
    title: "Agent 1: Symptom Analyzer",
    pattern: "ReAct",
    Insight: SymptomInsight,
    stateKey: "symptom_analysis",
  },
  {
    key: "medical_knowledge",
    title: "Agent 2: Medical Knowledge",
    pattern: "RAG",
    Insight: KnowledgeInsight,
    stateKey: "medical_knowledge",
  },
  {
    key: "risk_assessor",
    title: "Agent 3: Risk Assessor",
    pattern: "Chain-of-Thought",
    Insight: RiskInsight,
    stateKey: "risk_assessment",
  },
  {
    key: "doctor_finder",
    title: "Agent 4: Doctor Finder",
    pattern: "Tool Use",
    Insight: DoctorInsight,
    stateKey: "doctor_suggestions",
  },
];

function AgentPanel({ meta, data, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const [showRaw, setShowRaw] = useState(false);
  const payload = data || {};
  const pattern = toAsciiText(payload.design_pattern || meta.pattern);
  const Insight = meta.Insight;

  return (
    <div className="agent-panel cc-card">
      <button type="button" className="agent-panel__toggle" onClick={() => setOpen(!open)}>
        <div>
          <div className="agent-panel__title">{meta.title}</div>
          <div className="text-caption">Pattern: {pattern}</div>
        </div>
        <span className="agent-panel__chevron">{open ? "-" : "+"}</span>
      </button>

      {open && (
        <div className="agent-panel__body">
          <Insight data={payload} />
          <button
            type="button"
            className="btn-ghost agent-panel__raw-btn"
            onClick={() => setShowRaw(!showRaw)}
          >
            {showRaw ? "Hide raw JSON" : "View raw JSON"}
          </button>
          {showRaw && (
            <pre className="agent-panel__raw">{JSON.stringify(payload, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}

export default function AgentReasoning({ data }) {
  const outputs = data?.agent_outputs || {
    symptom_analyzer: data?.symptom_analysis,
    medical_knowledge: data?.medical_knowledge,
    risk_assessor: data?.risk_assessment,
    doctor_finder: data?.doctor_suggestions,
  };

  return (
    <section className="agent-reasoning">
      <h3 className="text-h3">How the AI reasoned</h3>
      <p className="text-caption">Structured fields extracted by each agent</p>
      <div className="agent-reasoning__list">
        {AGENTS.map((meta, i) => (
          <AgentPanel
            key={meta.key}
            meta={meta}
            data={outputs[meta.key] ?? data?.[meta.stateKey]}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </section>
  );
}
