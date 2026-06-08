from __future__ import annotations

from typing import Any, Dict, List, Literal, NotRequired, Optional, TypedDict

from pydantic import BaseModel, ConfigDict, Field, field_validator

UrgencyLevel = Literal["MILD", "MODERATE", "URGENT", "EMERGENCY"]


# --- LangGraph state (blueprint) -------------------------------------------------


class TriageState(TypedDict):
    symptoms: str
    city: str
    country: str
    location_string: str
    symptom_analysis: Dict[str, Any]
    medical_knowledge: Dict[str, Any]
    risk_assessment: Dict[str, Any]
    doctor_suggestions: Dict[str, Any]
    final_report: Dict[str, Any]
    client_ip: NotRequired[str | None]
    geolocation_source: NotRequired[str]


def create_initial_state(
    symptoms: str,
    city: str,
    country: str,
    location_string: str,
) -> TriageState:
    """Empty agent slots for a new LangGraph run."""
    return {
        "symptoms": symptoms,
        "city": city,
        "country": country,
        "location_string": location_string,
        "symptom_analysis": {},
        "medical_knowledge": {},
        "risk_assessment": {},
        "doctor_suggestions": {},
        "final_report": {},
    }


def state_from_request(
    request: "TriageRequest",
    location_string: str,
    city: str | None = None,
    country: str | None = None,
) -> TriageState:
    return create_initial_state(
        symptoms=request.symptoms,
        city=city if city is not None else request.city,
        country=country if country is not None else request.country,
        location_string=location_string,
    )


# --- API request -----------------------------------------------------------------


class TriageRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    symptoms: str = Field(..., min_length=1, max_length=8000)
    city: str = Field(default="")
    country: str = Field(default="")
    client_ip: Optional[str] = Field(
        default=None,
        description="Optional client IP for geolocation when city/country are blank",
    )

    @field_validator("symptoms")
    @classmethod
    def symptoms_not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("symptoms must not be empty")
        return value


# --- Agent output schemas (strict JSON contracts) --------------------------------


class SymptomAnalysis(BaseModel):
    model_config = ConfigDict(extra="ignore")

    symptoms: List[str] = Field(default_factory=list)
    duration: str = ""
    severity: int = Field(default=5, ge=1, le=10)
    location: str = ""
    red_flags: List[str] = Field(default_factory=list)

    @field_validator("severity", mode="before")
    @classmethod
    def coerce_severity(cls, value: Any) -> int:
        """LLMs sometimes return 'unknown' or other strings instead of an int."""
        if isinstance(value, int):
            return max(1, min(value, 10))
        if isinstance(value, (float, str)):
            try:
                return max(1, min(int(float(value)), 10))
            except (ValueError, TypeError):
                return 5
        return 5


class Condition(BaseModel):
    model_config = ConfigDict(extra="ignore")

    condition: str
    explanation: str


class MedicalKnowledgeOutput(BaseModel):
    model_config = ConfigDict(extra="ignore")

    conditions: List[Condition] = Field(default_factory=list)
    specialist: str = "General Physician"
    rag_sources: List[str] = Field(default_factory=list)


class RiskAssessment(BaseModel):
    """Backward-compatible risk block used by the current orchestrator."""

    model_config = ConfigDict(extra="ignore")

    urgency: UrgencyLevel = "MODERATE"
    reasoning: str = ""


class RiskAssessmentOutput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    urgency_score: int = Field(default=5, ge=1, le=10)
    level: UrgencyLevel = "MODERATE"
    reasoning: str = ""

    def to_legacy(self) -> RiskAssessment:
        return RiskAssessment(urgency=self.level, reasoning=self.reasoning)


class HospitalSuggestion(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    address: str = ""
    phone: str = ""
    url: str = ""


class DoctorSuggestionsOutput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    specialist: str = "General Physician"
    hospitals: List[HospitalSuggestion] = Field(default_factory=list)
    search_query: str = ""


class FinalReportOutput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    primary_disease: str = "Unknown Condition"
    urgency: UrgencyLevel = "MODERATE"
    summary: str = ""
    what_to_do: str = ""
    disclaimer: str = "This is not a substitute for professional medical advice."


class AgentOutputs(BaseModel):
    """Intermediate agent payloads for lab transparency (Step 6 UI)."""

    symptom_analyzer: Dict[str, Any] = Field(default_factory=dict)
    medical_knowledge: Dict[str, Any] = Field(default_factory=dict)
    risk_assessor: Dict[str, Any] = Field(default_factory=dict)
    doctor_finder: Dict[str, Any] = Field(default_factory=dict)


# --- API response (frontend + LangGraph bridge) ----------------------------------


class TriageResponse(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    primary_disease: str
    detected_diseases: List[Condition]
    urgency: UrgencyLevel
    summary: str
    what_to_do: str

    symptom_analysis: SymptomAnalysis
    risk_assessment: RiskAssessment

    doctor_suggestions: Optional[Any] = None
    disclaimer: str = "This is not a substitute for professional medical advice."

    location_string: str = ""
    medical_knowledge: Optional[Dict[str, Any]] = None
    final_report: Optional[Dict[str, Any]] = None
    agent_outputs: Optional[AgentOutputs] = None

    @classmethod
    def from_triage_state(
        cls,
        state: TriageState,
        *,
        primary_disease: str,
        detected_diseases: List[Condition],
        urgency: UrgencyLevel,
        summary: str,
        what_to_do: str,
        symptom_analysis: SymptomAnalysis,
        risk_assessment: RiskAssessment,
        doctor_suggestions: Any = None,
    ) -> "TriageResponse":
        final = state.get("final_report") or {}
        return cls(
            primary_disease=primary_disease,
            detected_diseases=detected_diseases,
            urgency=urgency,
            summary=summary,
            what_to_do=what_to_do,
            symptom_analysis=symptom_analysis,
            risk_assessment=risk_assessment,
            doctor_suggestions=doctor_suggestions,
            disclaimer=final.get(
                "disclaimer",
                "This is not a substitute for professional medical advice.",
            ),
            location_string=state.get("location_string", ""),
            medical_knowledge=state.get("medical_knowledge") or None,
            final_report=state.get("final_report") or None,
            agent_outputs=AgentOutputs(
                symptom_analyzer=state.get("symptom_analysis") or {},
                medical_knowledge=state.get("medical_knowledge") or {},
                risk_assessor=state.get("risk_assessment") or {},
                doctor_finder=state.get("doctor_suggestions") or {},
            ),
        )
