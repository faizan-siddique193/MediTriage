import { isN8nResponse, parseN8nResponse } from "./parseN8nResponse";
import { normalizeDoctorSuggestions } from "./normalizeDoctorSuggestions";

/**
 * Normalize FastAPI, LangGraph, or n8n webhook payloads for the UI.
 */
export function parseTriageResponse(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid response: expected a JSON object from the triage API.");
  }

  if (isN8nResponse(raw)) {
    return parseN8nResponse(raw);
  }

  const urgency = normalizeUrgency(raw.urgency || raw.final_report?.urgency);
  const detected = Array.isArray(raw.detected_diseases)
    ? raw.detected_diseases.filter((c) => c && (c.condition || c.name))
    : [];

  const agent_outputs = raw.agent_outputs || {
    symptom_analyzer: raw.symptom_analysis || {},
    medical_knowledge: raw.medical_knowledge || {},
    risk_assessor: raw.risk_assessment || {},
    doctor_finder: raw.doctor_suggestions || {},
  };

  return {
    source: "fastapi",
    request_id: null,
    primary_disease: raw.primary_disease || detected[0]?.condition || "Unknown Condition",
    detected_diseases: detected.map((c) => ({
      condition: c.condition || c.name || "Unknown",
      explanation: c.explanation || c.description || "",
    })),
    urgency,
    summary: raw.summary || raw.final_report?.summary || "",
    what_to_do: raw.what_to_do || raw.final_report?.what_to_do || "",
    symptom_analysis: raw.symptom_analysis || agent_outputs.symptom_analyzer || {},
    risk_assessment: raw.risk_assessment || agent_outputs.risk_assessor || {},
    doctor_suggestions: normalizeDoctorSuggestions(
      raw.doctor_suggestions,
      raw.location_string || ""
    ),
    medical_knowledge: raw.medical_knowledge || agent_outputs.medical_knowledge || null,
    final_report: raw.final_report || null,
    location_string: raw.location_string || "",
    specialist_needed: null,
    disclaimer:
      raw.disclaimer ||
      raw.final_report?.disclaimer ||
      "This is not a substitute for professional medical advice.",
    agent_outputs,
  };
}

function normalizeUrgency(value) {
  const upper = String(value || "MODERATE").toUpperCase();
  if (["MILD", "MODERATE", "URGENT", "EMERGENCY"].includes(upper)) return upper;
  if (upper === "HIGH") return "URGENT";
  if (upper === "LOW") return "MILD";
  return "MODERATE";
}

