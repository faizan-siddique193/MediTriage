from models import (
    Condition,
    SymptomAnalysis,
    TriageRequest,
    TriageResponse,
)
from agents.risk_assessor import to_risk_assessment
from langgraph_pipeline import request_to_initial_state, triage_graph


def _conditions_from_knowledge(knowledge: dict) -> list[Condition]:
    return [Condition(**item) for item in knowledge.get("conditions", [])]


def _symptom_model(payload: dict) -> SymptomAnalysis:
    return SymptomAnalysis.model_validate(payload)


async def run_triage(request: TriageRequest) -> TriageResponse:
    initial_state = request_to_initial_state(request)
    final_state = await triage_graph.ainvoke(initial_state)

    knowledge_payload = final_state.get("medical_knowledge") or {}
    symptom_payload = final_state.get("symptom_analysis") or {}
    risk_payload = final_state.get("risk_assessment") or {}
    doctor_payload = final_state.get("doctor_suggestions")
    final_report = final_state.get("final_report") or {}

    conditions = _conditions_from_knowledge(knowledge_payload)
    risk_legacy = to_risk_assessment(risk_payload)
    urgency = risk_legacy.urgency

    return TriageResponse.from_triage_state(
        final_state,
        primary_disease=final_report.get("primary_disease")
        or (conditions[0].condition if conditions else "Unknown Condition"),
        detected_diseases=conditions,
        urgency=urgency,
        summary=final_report.get("summary", ""),
        what_to_do=final_report.get("what_to_do", ""),
        symptom_analysis=_symptom_model(symptom_payload),
        risk_assessment=risk_legacy,
        doctor_suggestions=doctor_payload,
    )
