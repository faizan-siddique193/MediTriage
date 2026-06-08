import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitTriage } from "../api";
import { useTriageStore } from "../store/triageStore";
import AnalysisTimeline from "../components/AnalysisTimeline";
import ErrorState from "../components/ErrorState";
import { buildPdfPayload } from "../utils/buildPdfPayload";
import { saveReport } from "../utils/reportStorage";
import { generateReportId } from "../utils/generateReportId";

export default function TriageInput() {
  const navigate = useNavigate();
  const defaultCountry = useTriageStore((s) => s.defaultCountry);
  const setSession = useTriageStore((s) => s.setSession);

  const [symptoms, setSymptoms] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const data = await submitTriage(symptoms.trim(), city.trim(), defaultCountry);
      const reportId = data.request_id || generateReportId();
      const session = {
        result: data,
        symptoms: symptoms.trim(),
        city: city.trim(),
        country: defaultCountry,
        reportId,
        completedAt: new Date().toISOString(),
      };
      setSession(session);
      saveReport({
        id: reportId,
        date: session.completedAt,
        symptoms: symptoms.trim().slice(0, 120),
        urgency: data.urgency,
        primary_disease: data.primary_disease,
        city: city.trim(),
        country: defaultCountry,
        payload: buildPdfPayload(data, {
          reportId,
          symptoms: symptoms.trim(),
          city: city.trim(),
          country: defaultCountry,
          generatedAt: session.completedAt,
        }),
        data,
      });
      navigate("/triage/results", { replace: true });
    } catch (err) {
      setError({
        title: err.userTitle || "Unable to complete analysis",
        message: err.userMessage || err.message || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page page--narrow">
        <AnalysisTimeline active symptoms={symptoms} city={city} country={defaultCountry} />
      </div>
    );
  }

  return (
    <div className="page page--narrow">
      <header className="page-header">
        <h1 className="text-h1">Symptom triage</h1>
        <p className="text-body text-muted">
          Describe what you are experiencing. Our AI agents will assess urgency and suggest next steps.
        </p>
      </header>

      {error ? (
        <ErrorState
          title={error.title}
          message={error.message}
          onRetry={() => setError(null)}
        />
      ) : (
        <form onSubmit={handleSubmit} className="cc-card triage-form">
          <div className="form-field">
            <label className="cc-label" htmlFor="symptoms">
              Symptoms
            </label>
            <textarea
              id="symptoms"
              className="cc-textarea"
              rows={5}
              placeholder="Example: Fever and sore throat for 2 days, mild headache…"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label className="cc-label" htmlFor="city">
              City <span className="text-caption">(optional)</span>
            </label>
            <input
              id="city"
              className="cc-input"
              type="text"
              placeholder="e.g. Lahore"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoComplete="address-level2"
            />
          </div>

          <button type="submit" className="btn-primary btn-primary--full" disabled={!symptoms.trim()}>
            Analyze symptoms
          </button>
        </form>
      )}

    </div>
  );
}
