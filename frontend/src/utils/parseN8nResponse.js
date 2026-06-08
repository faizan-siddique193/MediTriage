/**
 * Maps MediTriage AI n8n v3.0 webhook JSON to UI shape (same as FastAPI parse output).
 */

import { normalizeDoctorSuggestions } from "./normalizeDoctorSuggestions";
import { toAsciiText } from "./formatText";

function normalizeUrgency(value) {
  const upper = String(value || "MODERATE")
    .toUpperCase()
    .replace(/\s+/g, "_");
  const map = {
    LOW: "MILD",
    MILD: "MILD",
    MEDIUM: "MODERATE",
    MODERATE: "MODERATE",
    HIGH: "URGENT",
    URGENT: "URGENT",
    EMERGENCY: "EMERGENCY",
    CRITICAL: "EMERGENCY",
  };
  if (map[upper]) return map[upper];
  if (upper.includes("EMERGENCY")) return "EMERGENCY";
  if (upper.includes("URGENT") || upper.includes("HIGH")) return "URGENT";
  if (upper.includes("MODERATE")) return "MODERATE";
  return "MODERATE";
}

function mapDoctorSuggestions(ds, locationFallback) {
  return normalizeDoctorSuggestions(ds, locationFallback);
}

function mapConditions(agents) {
  const list = agents?.medical_knowledge?.output?.possible_conditions || [];
  return list.map((c) => ({
    condition: c.condition || "Unknown",
    explanation: c.explanation || "",
    likelihood: c.likelihood,
  }));
}

function pickPrimaryDisease(conditions) {
  if (!conditions.length) return "Unknown Condition";
  const high = conditions.find((c) => String(c.likelihood).toLowerCase() === "high");
  return (high || conditions[0]).condition;
}

export function isN8nResponse(raw) {
  if (!raw || typeof raw !== "object") return false;
  return (
    raw.success === true ||
    (typeof raw.system === "string" && raw.system.toLowerCase().includes("n8n")) ||
    (Boolean(raw.agents) && Boolean(raw.orchestrator))
  );
}

export function parseN8nResponse(raw) {
  if (!isN8nResponse(raw)) {
    throw new Error("Not a recognized n8n triage payload.");
  }

  const agents = raw.agents || {};
  const triageReport =
    raw.triage_report || raw.orchestrator?.output?.triage_report || {};
  const input = raw.input || {};

  const conditions = mapConditions(agents);
  const urgency = normalizeUrgency(
    raw.urgency_level ||
      triageReport.urgency_level ||
      agents.risk_assessor?.output?.risk_assessment?.urgency_level
  );

  const summaryParts = [
    triageReport.what_your_symptoms_suggest,
    triageReport.what_you_should_know,
  ].filter(Boolean);

  const ss = agents.symptom_analyzer?.output?.structured_symptoms || {};
  const riskOut = agents.risk_assessor?.output || {};
  const risk = riskOut.risk_assessment || {};

  const location_string =
    input.location ||
    [input.city, input.country].filter(Boolean).join(", ") ||
    "";

  const doctorRaw = raw.doctor_suggestions || agents.doctor_finder || null;
  const doctor_suggestions = mapDoctorSuggestions(doctorRaw, location_string);

  const agent_outputs = {
    symptom_analyzer: {
      design_pattern: agents.symptom_analyzer?.pattern || "ReAct",
      ...(agents.symptom_analyzer?.output || {}),
    },
    medical_knowledge: {
      design_pattern: agents.medical_knowledge?.pattern || "RAG",
      ...(agents.medical_knowledge?.output || {}),
    },
    risk_assessor: {
      design_pattern: agents.risk_assessor?.pattern || "Chain-of-Thought",
      ...riskOut,
    },
    doctor_finder: {
      design_pattern: agents.doctor_finder?.pattern || "Tool Use",
      ...(agents.doctor_finder?.output || doctorRaw || {}),
    },
  };

  return {
    source: "n8n",
    request_id: raw.request_id || null,
    primary_disease: pickPrimaryDisease(conditions),
    detected_diseases: conditions.map(({ condition, explanation }) => ({
      condition,
      explanation,
    })),
    urgency,
    summary: summaryParts.join("\n\n"),
    what_to_do: triageReport.what_to_do_next || risk.recommended_action || "",
    symptom_analysis: {
      design_pattern: "ReAct",
      symptoms: ss.main_symptoms || [],
      duration: ss.duration || "",
      severity: ss.severity_score ?? 5,
      location: ss.body_location || "",
      red_flags: ss.red_flags || [],
      structured: ss,
    },
    risk_assessment: {
      design_pattern: "Chain-of-Thought",
      urgency,
      reasoning:
        typeof riskOut.chain_of_thought === "object"
          ? Object.entries(riskOut.chain_of_thought)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" | ")
          : String(risk.recommended_action || ""),
      urgency_score: risk.urgency_score,
    },
    doctor_suggestions,
    medical_knowledge: agent_outputs.medical_knowledge,
    final_report: triageReport,
    location_string:
      location_string || doctor_suggestions?.search_location || "",
    specialist_needed: raw.specialist_needed || agents.medical_knowledge?.output?.recommended_specialist,
    disclaimer: raw.disclaimer || raw.orchestrator?.output?.disclaimer || "",
    agent_outputs,
  };
}
