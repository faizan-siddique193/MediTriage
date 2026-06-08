"""Shared helpers for agent JSON parsing and normalization."""

from __future__ import annotations

import json
import re
from typing import Any

URGENCY_LEVELS = ("MILD", "MODERATE", "URGENT", "EMERGENCY")


def parse_json_object(raw: str) -> dict[str, Any]:
    text = (raw or "").strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    data = json.loads(text)
    if not isinstance(data, dict):
        raise ValueError("Agent response must be a JSON object")
    return data


def normalize_urgency_level(raw: str) -> str:
    upper = (raw or "").upper()
    for level in URGENCY_LEVELS:
        if level in upper:
            return level
    return "MODERATE"


def clamp_score(value: Any, default: int = 5) -> int:
    try:
        score = int(value)
    except (TypeError, ValueError):
        return default
    return max(1, min(10, score))
