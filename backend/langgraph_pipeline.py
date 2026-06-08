"""
LangGraph triage pipeline (blueprint topology).

Node 0: preprocess_input (geolocation)
Phase 1 (parallel): symptom_analyzer, medical_knowledge, risk_assessor
Phase 2 (sequential): doctor_finder
Phase 3: orchestrator planner synthesis
"""

from __future__ import annotations

import asyncio

from langgraph.graph import END, START, StateGraph

from agents.doctor_finder import find_doctors
from agents.medical_knowledge import retrieve_medical_knowledge
from agents.orchestrator import synthesize_final_report
from agents.risk_assessor import assess_risk
from agents.symptom_analyzer import analyze_symptoms
from core.geolocation import resolve_location
from models import TriageRequest, TriageState, state_from_request


async def preprocess_input(state: TriageState) -> dict:
    """Node 0: IP geolocation fallback when city/country are blank."""
    location = await resolve_location(
        city=state.get("city", ""),
        country=state.get("country", ""),
        client_ip=state.get("client_ip"),
    )
    return {
        "city": location.city,
        "country": location.country,
        "location_string": location.location_string,
        "geolocation_source": location.source,
    }


async def phase1_parallel(state: TriageState) -> dict:
    """Parallel fan-out/fan-in for agents 1–3."""
    symptom_payload, knowledge_payload, risk_payload = await asyncio.gather(
        analyze_symptoms(state["symptoms"]),
        retrieve_medical_knowledge(state["symptoms"]),
        assess_risk(state["symptoms"], ""),
    )
    return {
        "symptom_analysis": symptom_payload,
        "medical_knowledge": knowledge_payload,
        "risk_assessment": risk_payload,
    }


async def node_doctor_finder(state: TriageState) -> dict:
    knowledge = state.get("medical_knowledge") or {}
    risk = state.get("risk_assessment") or {}
    conditions = knowledge.get("conditions") or []
    top_conditions = [c.get("condition", "") for c in conditions[:2] if c.get("condition")]
    specialist = knowledge.get("specialist", "General Physician")
    urgency = (risk.get("level") or risk.get("urgency") or "MODERATE").upper()

    result = await find_doctors(
        urgency_level=urgency,
        conditions=top_conditions,
        city=state.get("city", ""),
        country=state.get("country", ""),
        specialist=specialist,
    )
    return {"doctor_suggestions": result}


async def node_planner(state: TriageState) -> dict:
    report = await synthesize_final_report(state)
    return {"final_report": report}


def build_triage_graph():
    graph = StateGraph(TriageState)
    graph.add_node("preprocess_input", preprocess_input)
    graph.add_node("phase1_parallel", phase1_parallel)
    graph.add_node("doctor_finder", node_doctor_finder)
    graph.add_node("planner", node_planner)

    graph.add_edge(START, "preprocess_input")
    graph.add_edge("preprocess_input", "phase1_parallel")
    graph.add_edge("phase1_parallel", "doctor_finder")
    graph.add_edge("doctor_finder", "planner")
    graph.add_edge("planner", END)

    return graph.compile()


triage_graph = build_triage_graph()


def request_to_initial_state(request: TriageRequest) -> TriageState:
    state = state_from_request(request, location_string="")
    if request.client_ip:
        state["client_ip"] = request.client_ip
    return state
