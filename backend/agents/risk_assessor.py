"""Design Pattern: Chain-of-Thought"""

from __future__ import annotations

from typing import Any

from agents._utils import clamp_score, normalize_urgency_level, parse_json_object
from groq_client import chat_async
from models import RiskAssessment, RiskAssessmentOutput

DESIGN_PATTERN = "Chain-of-Thought"


async def assess_risk(symptoms: str, conditions_context: str) -> dict[str, Any]:
    """
    Chain-of-Thought urgency scoring for TriageState['risk_assessment'].
    Uses response_format json_object.
    """
    prompt = f"""
You are a medical risk assessor using Chain-of-Thought reasoning.

Symptoms: {symptoms}
Possible conditions identified: {conditions_context or "Not yet specified"}

Step 1: Red flags (chest pain, breathing difficulty, stroke signs, severe bleeding)?
Step 2: Acute vs chronic timeline?
Step 3: Symptom severity (1-10)?
Step 4: Life-threatening condition possibilities?

Assign:
- urgency_score: integer 1-10 (10 = highest risk)
- level: exactly one of MILD, MODERATE, URGENT, EMERGENCY
- reasoning: show Steps 1-4 then Conclusion

Respond ONLY with valid JSON:
{{
  "urgency_score": 6,
  "level": "MODERATE",
  "reasoning": "Step 1: ... Step 2: ... Step 3: ... Step 4: ... Conclusion: ..."
}}
"""
    response_text = await chat_async(prompt, json_mode=True)
    data = parse_json_object(response_text)

    level = normalize_urgency_level(data.get("level") or data.get("urgency", "MODERATE"))
    output = RiskAssessmentOutput(
        urgency_score=clamp_score(data.get("urgency_score"), default=5),
        level=level,
        reasoning=data.get("reasoning", ""),
    )

    payload = output.model_dump()
    payload["design_pattern"] = DESIGN_PATTERN
    payload["urgency"] = level
    return payload


def to_risk_assessment(payload: dict[str, Any]) -> RiskAssessment:
    """Map agent dict to legacy API model."""
    return RiskAssessment(
        urgency=normalize_urgency_level(payload.get("level") or payload.get("urgency", "MODERATE")),
        reasoning=payload.get("reasoning", ""),
    )
