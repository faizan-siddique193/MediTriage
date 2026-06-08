"""Design Pattern: Tool Use"""

from __future__ import annotations

import os
from typing import Any

import httpx
from dotenv import dotenv_values, load_dotenv

from agents._utils import parse_json_object
from groq_client import chat_async
from models import DoctorSuggestionsOutput, HospitalSuggestion

DESIGN_PATTERN = "Tool Use"
TAVILY_SEARCH_URL = "https://api.tavily.com/search"


async def _tavily_search(query: str, max_results: int = 3) -> list[dict[str, Any]]:
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    load_dotenv(env_path, override=True)
    values = dotenv_values(env_path)
    api_key = (values.get("TAVILY_API_KEY") or os.getenv("TAVILY_API_KEY") or "").strip()

    if not api_key:
        return []

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(
            TAVILY_SEARCH_URL,
            json={
                "api_key": api_key,
                "query": query,
                "search_depth": "basic",
                "max_results": max_results,
                "include_answer": False,
            },
        )
        response.raise_for_status()
        data = response.json()

    return data.get("results") or []


def _results_to_suggestions(results: list[dict[str, Any]], specialist: str) -> list[dict[str, str]]:
    suggestions: list[dict[str, str]] = []
    for item in results[:3]:
        title = (item.get("title") or "Medical facility").strip()
        content = (item.get("content") or "").strip()
        url = (item.get("url") or "").strip()
        suggestions.append(
            {
                "name": title,
                "type": specialist,
                "why_recommended": content[:220] if content else "Relevant facility from web search",
                "address_hint": url or "See listing URL",
                "urgency_note": "Call ahead to confirm availability",
            }
        )
    return suggestions


async def _llm_fallback_suggestions(
    city: str,
    country: str,
    specialist: str,
    conditions: list[str],
    urgency_level: str,
) -> dict[str, Any]:
    conditions_text = ", ".join(conditions) if conditions else "general symptoms"
    prompt = f"""
You are a medical directory assistant. Tavily search was unavailable.
Location: {city}, {country}
Specialist needed: {specialist}
Conditions: {conditions_text}
Urgency: {urgency_level}

Provide 3 care resources. Respond ONLY with JSON:
{{
  "search_location": "{city}, {country}",
  "suggestions": [
    {{
      "name": "Facility name",
      "type": "{specialist}",
      "why_recommended": "one sentence",
      "address_hint": "area in city",
      "urgency_note": "Walk-in / Call ahead / Emergency"
    }}
  ],
  "general_advice": "one practical sentence"
}}
"""
    response_text = await chat_async(prompt, json_mode=True)
    return parse_json_object(response_text)


async def find_doctors(
    urgency_level: str,
    conditions: list[str],
    city: str,
    country: str,
    specialist: str = "General Physician",
) -> dict[str, Any]:
    """
    Tool Use: Tavily hospital search for TriageState['doctor_suggestions'].
    Falls back to Groq JSON if Tavily key is missing.
    """
    location_label = f"{city}, {country}".strip(", ")

    if urgency_level == "MILD":
        return {
            "design_pattern": DESIGN_PATTERN,
            "specialist": specialist,
            "search_query": "",
            "search_location": location_label,
            "skipped": True,
            "reason": "Mild symptoms can often be managed at home.",
            "home_care": "Rest, stay hydrated, and monitor symptoms. See a doctor if they worsen.",
            "hospitals": [],
            "suggestions": [],
            "tool_used": "none",
        }

    conditions_text = ", ".join(conditions) if conditions else "reported symptoms"
    search_query = f"{specialist} hospital clinic {city} {country} {conditions_text}"

    try:
        results = await _tavily_search(search_query, max_results=3)
        tool_used = "tavily" if results else "llm_fallback"

        if results:
            suggestions = _results_to_suggestions(results, specialist)
            hospitals = [
                HospitalSuggestion(
                    name=item["name"],
                    address=item.get("address_hint", ""),
                    url=item.get("address_hint", "") if item.get("address_hint", "").startswith("http") else "",
                ).model_dump()
                for item in suggestions
            ]
            output = DoctorSuggestionsOutput(
                specialist=specialist,
                hospitals=hospitals,
                search_query=search_query,
            )
            payload = output.model_dump()
            payload["design_pattern"] = DESIGN_PATTERN
            payload["search_location"] = location_label
            payload["suggestions"] = suggestions
            payload["general_advice"] = f"Verified-style results from Tavily for {specialist} near {location_label}."
            payload["tool_used"] = tool_used
            payload["raw_results"] = results
            payload["skipped"] = False
            return payload

        llm_data = await _llm_fallback_suggestions(city, country, specialist, conditions, urgency_level)
        llm_data["design_pattern"] = DESIGN_PATTERN
        llm_data["specialist"] = specialist
        llm_data["search_query"] = search_query
        llm_data["tool_used"] = "llm_fallback"
        llm_data["skipped"] = False
        llm_data.setdefault("search_location", location_label)
        llm_data.setdefault("suggestions", [])
        return llm_data

    except Exception as exc:
        return {
            "design_pattern": DESIGN_PATTERN,
            "specialist": specialist,
            "search_query": search_query,
            "search_location": location_label,
            "error": True,
            "message": str(exc),
            "skipped": False,
            "suggestions": [],
            "tool_used": "error",
        }
