"""Design Pattern: ReAct"""

from __future__ import annotations

from typing import Any

from agents._utils import parse_json_object
from groq_client import chat_async
from models import SymptomAnalysis

DESIGN_PATTERN = "ReAct"


async def analyze_symptoms(symptoms: str) -> dict[str, Any]:
    """
    Parse raw symptom text into structured JSON for TriageState['symptom_analysis'].
    Uses Groq response_format json_object.
    """
    prompt = f"""
You are a medical symptom analysis assistant using the ReAct pattern.
User symptoms: {symptoms}

Thought 1: What are the main symptoms mentioned?
Action 1: List each symptom clearly.
Thought 2: Are there duration, severity (1-10), or body location cues?
Action 2: Extract temporal and intensity details.
Thought 3: Any red-flag symptoms (chest pain, breathing difficulty, confusion, severe bleeding)?
Action 3: List red flags or return an empty list.

Respond ONLY with valid JSON:
{{
  "symptoms": ["symptom1", "symptom2"],
  "duration": "e.g. 2 days",
  "severity": 5,
  "location": "body area or unknown",
  "red_flags": ["flag1"] ,
  "react_trace": {{
    "thoughts": ["..."],
    "actions": ["..."]
  }}
}}
"""
    response_text = await chat_async(prompt, json_mode=True)
    data = parse_json_object(response_text)

    # Pre-process severity: LLMs sometimes return non-integer values like 'unknown'
    raw_severity = data.get("severity", 5)
    if not isinstance(raw_severity, (int, float)):
        try:
            raw_severity = int(float(raw_severity))
        except (ValueError, TypeError):
            raw_severity = 5
    data["severity"] = max(1, min(int(raw_severity), 10))

    validated = SymptomAnalysis.model_validate(data)

    payload = validated.model_dump()
    payload["design_pattern"] = DESIGN_PATTERN
    payload["react_trace"] = data.get("react_trace", {})
    return payload
