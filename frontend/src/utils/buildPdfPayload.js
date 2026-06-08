import { generateReportId } from "./generateReportId";

/**
 * Maps parsed triage API response → PDF generator payload.
 */
export function buildPdfPayload(result, meta = {}) {
  const generatedAt = meta.generatedAt || new Date().toISOString();
  const city = meta.city || "";
  const country = meta.country || "Pakistan";

  return {
    reportId: meta.reportId || generateReportId(),
    generatedAt,
    symptoms: meta.symptoms || "",
    urgency_level: result.urgency,
    primary_disease: result.primary_disease,
    triage_summary: result.summary,
    summary: result.summary,
    what_to_do: result.what_to_do,
    location_string: result.location_string,
    agent1_output: result.symptom_analysis || {},
    agent2_output: {
      possible_conditions: result.detected_diseases || [],
      specialist: result.medical_knowledge?.specialist,
    },
    agent3_output: result.risk_assessment || {},
    doctor_suggestions: result.doctor_suggestions,
    user: { city, country },
  };
}
