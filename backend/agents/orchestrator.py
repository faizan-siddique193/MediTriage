"""Design Pattern: Planner"""

from __future__ import annotations

import json
from typing import Any

from agents._utils import normalize_urgency_level, parse_json_object
from groq_client import chat_async
from models import FinalReportOutput, TriageState

DESIGN_PATTERN = "Planner"


async def synthesize_final_report(state: TriageState) -> dict[str, Any]:
    """
    Planner agent: synthesize all agent outputs into TriageState['final_report'].
    Uses response_format json_object.
    """
    symptom = state.get("symptom_analysis") or {}
    knowledge = state.get("medical_knowledge") or {}
    risk = state.get("risk_assessment") or {}
    doctors = state.get("doctor_suggestions") or {}

    conditions = knowledge.get("conditions") or []
    primary = conditions[0]["condition"] if conditions else "Unknown Condition"
    urgency = normalize_urgency_level(risk.get("level") or risk.get("urgency", "MODERATE"))

    prompt = f"""
You are the MediTriage Planner orchestrator. Synthesize a patient-facing triage report.

Location: {state.get("location_string", "")}
Symptoms (raw): {state.get("symptoms", "")}
Structured symptoms: {json.dumps(symptom, ensure_ascii=False)}
Medical knowledge: {json.dumps(knowledge, ensure_ascii=False)}
Risk assessment: {json.dumps(risk, ensure_ascii=False)}
Doctor search: {json.dumps(doctors, ensure_ascii=False)}

Primary condition: {primary}
Urgency level: {urgency}

Respond ONLY with valid JSON:
{{
  "primary_disease": "{primary}",
  "urgency": "{urgency}",
  "summary": "2-3 sentence plain-language overview",
  "what_to_do": "Clear actionable next steps for this urgency level",
  "disclaimer": "This is not a substitute for professional medical advice."
}}
"""
    try:
        response_text = await chat_async(prompt, json_mode=True)
        data = parse_json_object(response_text)
        report = FinalReportOutput.model_validate(
            {
                "primary_disease": data.get("primary_disease", primary),
                "urgency": normalize_urgency_level(data.get("urgency", urgency)),
                "summary": data.get("summary", ""),
                "what_to_do": data.get("what_to_do", ""),
                "disclaimer": data.get(
                    "disclaimer",
                    "This is not a substitute for professional medical advice.",
                ),
            }
        )
    except Exception:
        report = FinalReportOutput(
            primary_disease=primary,
            urgency=urgency,
            summary=f"Based on your symptoms, possible {primary} with {urgency} urgency.",
            what_to_do="Follow the urgency guidance and consult a licensed clinician if unsure.",
        )

    payload = report.model_dump()
    payload["design_pattern"] = DESIGN_PATTERN
    payload["planner_inputs"] = {
        "symptom_analysis": bool(symptom),
        "medical_knowledge": bool(knowledge),
        "risk_assessment": bool(risk),
        "doctor_suggestions": bool(doctors),
    }
    return payload
