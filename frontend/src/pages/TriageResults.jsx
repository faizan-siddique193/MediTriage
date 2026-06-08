import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTriageStore } from "../store/triageStore";
import TriageReport from "../components/TriageReport";

export default function TriageResults() {
  const navigate = useNavigate();
  const session = useTriageStore((s) => s.session);
  const clearSession = useTriageStore((s) => s.clearSession);

  useEffect(() => {
    if (!session?.result) {
      navigate("/triage", { replace: true });
    }
  }, [session, navigate]);

  if (!session?.result) return null;

  const startNew = () => {
    clearSession();
    navigate("/triage");
  };

  return (
    <div className="page page--wide">
      <div className="results-toolbar">
        <button type="button" className="btn-ghost" onClick={startNew}>
          Back to new analysis
        </button>
        <span className="text-caption">
          {new Date(session.completedAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      </div>

      <header className="page-header page-header--compact">
        <h1 className="text-h1">Your triage report</h1>
        <p className="text-body text-muted">
          Review urgency, recommended actions, and care options below.
        </p>
      </header>

      <TriageReport
        data={session.result}
        meta={{
          reportId: session.reportId,
          symptoms: session.symptoms,
          city: session.city,
          country: session.country,
          completedAt: session.completedAt,
        }}
      />

      <p className="text-caption" style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <Link to="/reports">View report history</Link>
      </p>
    </div>
  );
}
