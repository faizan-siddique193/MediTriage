import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import generateReport from "../utils/generateReport";
import { loadReports, clearAllReports, deleteReport } from "../utils/reportStorage";
import { buildPdfPayload } from "../utils/buildPdfPayload";

const URGENCY_STYLES = {
  MILD: { bg: "var(--triage-mild-bg)", color: "var(--triage-mild-text)", border: "var(--triage-mild-border)" },
  MODERATE: { bg: "var(--triage-moderate-bg)", color: "var(--triage-moderate-text)", border: "var(--triage-moderate-border)" },
  URGENT: { bg: "var(--triage-urgent-bg)", color: "var(--triage-urgent-text)", border: "var(--triage-urgent-border)" },
  EMERGENCY: { bg: "var(--triage-emergency-bg)", color: "var(--triage-emergency-text)", border: "var(--triage-emergency-border)" },
};

function urgencyStyle(level) {
  return URGENCY_STYLES[(level || "MILD").toUpperCase()] || URGENCY_STYLES.MILD;
}

export default function ReportHistory() {
  const [reports, setReports] = useState([]);

  const refresh = () => setReports(loadReports());

  useEffect(() => {
    refresh();
  }, []);

  const handleDownload = (report) => {
    const payload =
      report.payload ||
      (report.data
        ? buildPdfPayload(report.data, {
            reportId: report.id,
            symptoms: report.symptoms,
            city: report.city,
            country: report.country,
            generatedAt: report.date,
          })
        : null);
    if (payload) generateReport(payload);
  };

  const handleClearAll = () => {
    if (window.confirm("Delete all saved reports? This cannot be undone.")) {
      clearAllReports();
      refresh();
    }
  };

  return (
    <div className="page page--wide">
      <header className="page-header">
        <h1 className="text-h1">Report history</h1>
        <p className="text-body text-muted">
          Reports are saved locally in your browser. Download a PDF anytime.
        </p>
      </header>

      {reports.length === 0 ? (
        <div className="cc-card empty-state">
          <p className="text-body" style={{ marginBottom: "1rem" }}>
            No reports yet. Complete a symptom analysis to save one here.
          </p>
          <Link to="/triage" className="btn-primary">
            Start triage
          </Link>
        </div>
      ) : (
        <>
          <div className="history-list">
            {reports.map((report) => {
              const u = urgencyStyle(report.urgency);
              return (
                <article key={report.id} className="cc-card history-card">
                  <div className="history-card__main">
                    <div className="history-card__top">
                      <span
                        className="urgency-chip"
                        style={{ background: u.bg, color: u.color, borderColor: u.border }}
                      >
                        {(report.urgency || "MILD").toUpperCase()}
                      </span>
                      <span className="text-caption">{report.id}</span>
                    </div>
                    <h2 className="text-h3" style={{ margin: "0.35rem 0" }}>
                      {report.primary_disease || "Triage report"}
                    </h2>
                    <p className="text-body text-muted" style={{ margin: 0 }}>
                      {report.symptoms}
                    </p>
                    <p className="text-caption" style={{ marginTop: "0.5rem" }}>
                      {new Date(report.date).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                      {report.city ? ` · ${report.city}` : ""}
                    </p>
                  </div>
                  <div className="history-card__actions">
                    <button type="button" className="btn-secondary" onClick={() => handleDownload(report)}>
                      Download PDF
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ color: "var(--cc-error)" }}
                      onClick={() => {
                        deleteReport(report.id);
                        refresh();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
            <button type="button" className="btn-ghost" onClick={handleClearAll} style={{ color: "var(--cc-error)" }}>
              Clear all reports
            </button>
          </div>
        </>
      )}
    </div>
  );
}
