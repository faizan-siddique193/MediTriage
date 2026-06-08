import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/Card";
import DoctorSuggestions from "./DoctorSuggestions";
import AgentReasoning from "./AgentReasoning";
import generateReport from "../utils/generateReport";
import { buildPdfPayload } from "../utils/buildPdfPayload";
import { toAsciiText } from "../utils/formatText";

const URGENCY_CONFIG = {
  MILD: { pillCls: "urgency-pill mild", label: "Mild", accent: "#22C55E", desc: "Monitor at home" },
  MODERATE: { pillCls: "urgency-pill moderate", label: "Moderate", accent: "#EAB308", desc: "See a clinician within 24-48 hours" },
  URGENT: { pillCls: "urgency-pill urgent", label: "Urgent", accent: "#F97316", desc: "Seek medical attention today" },
  EMERGENCY: { pillCls: "urgency-pill emergency", label: "Emergency", accent: "#EF4444", desc: "Emergency care now" },
};

export default function TriageReport({ data, meta = {} }) {
  const [showReasoning, setShowReasoning] = useState(false);

  if (!data) return null;

  const urgencyKey = (data.urgency || "MILD").toUpperCase();
  const uc = URGENCY_CONFIG[urgencyKey] || URGENCY_CONFIG.MILD;
  const sa = data.symptom_analysis || {};
  const symptomsList = sa.symptoms || sa.structured?.main_symptoms || [];

  const downloadPdf = () => {
    generateReport(
      buildPdfPayload(data, {
        reportId: meta.reportId,
        symptoms: meta.symptoms,
        city: meta.city,
        country: meta.country,
        completedAt: meta.completedAt,
      })
    );
  };

  return (
    <div className={`triage-report ${urgencyKey.toLowerCase()}`}>
      <div className="report-toolbar">
        <button type="button" className="btn-secondary" onClick={downloadPdf}>
          Download PDF
        </button>
        {meta.reportId && <span className="text-caption">ID {meta.reportId}</span>}
      </div>

      <Card className="report-hero" style={{ borderLeft: `4px solid ${uc.accent}` }}>
        <div className="report-hero__inner">
          <div>
            <p className="text-caption">Primary assessment</p>
            <h2 className="text-h2">{toAsciiText(data.primary_disease || "Triage summary")}</h2>
            <p className="text-body text-muted">{uc.desc}</p>
            {data.location_string && (
              <p className="text-caption">Location: {toAsciiText(data.location_string)}</p>
            )}
          </div>
          <span className={uc.pillCls}>{uc.label}</span>
        </div>
      </Card>

      {(symptomsList.length > 0 || sa.severity) && (
        <div className="report-facts">
          {symptomsList.length > 0 && (
            <div className="report-fact">
              <span className="report-fact__label">Symptoms</span>
              <span className="report-fact__value">{symptomsList.join(", ")}</span>
            </div>
          )}
          {sa.severity != null && (
            <div className="report-fact">
              <span className="report-fact__label">Severity</span>
              <span className="report-fact__value">{sa.severity}/10</span>
            </div>
          )}
          {data.specialist_needed && (
            <div className="report-fact">
              <span className="report-fact__label">Specialist</span>
              <span className="report-fact__value">{toAsciiText(data.specialist_needed)}</span>
            </div>
          )}
        </div>
      )}

      {data.summary && (
        <Card>
          <CardHeader title="Clinical overview" />
          <CardContent>
            <p className="text-body-lg">{toAsciiText(data.summary)}</p>
          </CardContent>
        </Card>
      )}

      {data.what_to_do && (
        <Card className="report-action-card" style={{ borderLeft: `4px solid ${uc.accent}` }}>
          <CardHeader title="Recommended actions" />
          <CardContent>
            <p className="text-body-lg report-action-card__text">{toAsciiText(data.what_to_do)}</p>
          </CardContent>
        </Card>
      )}

      {data.detected_diseases?.length > 0 && (
        <Card>
          <CardHeader title="Possible conditions" />
          <CardContent className="condition-list">
            {data.detected_diseases.map((c, i) => (
              <div key={c.condition || i} className="condition-item">
                <span className="condition-item__rank">{i + 1}</span>
                <div>
                  <div className="text-body" style={{ fontWeight: 600 }}>
                    {toAsciiText(c.condition)}
                  </div>
                  {c.explanation && (
                    <p className="text-body text-muted">{toAsciiText(c.explanation)}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {data.doctor_suggestions && (
        <Card>
          <CardHeader title="Care near you" />
          <CardContent>
            <DoctorSuggestions suggestions={data.doctor_suggestions} />
          </CardContent>
        </Card>
      )}

      <button
        type="button"
        className="btn-ghost reasoning-toggle__btn"
        onClick={() => setShowReasoning(!showReasoning)}
      >
        {showReasoning ? "Hide agent details" : "Show how agents reasoned"}
      </button>

      {showReasoning && <AgentReasoning data={data} />}
    </div>
  );
}
