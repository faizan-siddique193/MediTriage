import { useState } from "react";

const SymptomForm = ({ onSubmit, isLoading }) => {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState(5);
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Pakistan");

  const charCount = symptoms.length;
  const maxChars = 1000;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    const summary = `${symptoms.trim()}\nDuration: ${duration || "unknown"}; Severity: ${severity}/10; Location: ${location || "general"}`;
    onSubmit(summary, false, city, country);
  };

  const severityLabel = (v) => {
    if (v <= 2) return { text: "Minimal", color: "#22c55e" };
    if (v <= 4) return { text: "Mild", color: "#86efac" };
    if (v <= 6) return { text: "Moderate", color: "#eab308" };
    if (v <= 8) return { text: "Severe", color: "#f97316" };
    return { text: "Critical", color: "#ef4444" };
  };

  const sv = severityLabel(Number(severity));

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Main symptoms textarea */}
      <div>
        <label className="cc-label">
          Describe your symptoms
          <span style={{ fontWeight: 400, color: "var(--cc-muted)", marginLeft: 4 }}>(required)</span>
        </label>
        <textarea
          className="cc-textarea"
          rows={5}
          placeholder="Please describe your symptoms in detail... (e.g., I have had a throbbing headache on the right side for 3 days, accompanied by nausea and sensitivity to light)"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value.slice(0, maxChars))}
          disabled={isLoading}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
          <span style={{ fontSize: 11, color: charCount > maxChars * 0.9 ? "var(--cc-error)" : "var(--cc-muted)" }}>
            {charCount}/{maxChars}
          </span>
        </div>
      </div>

      {/* Supplementary fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label className="cc-label">Duration</label>
          <input
            className="cc-input"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 3 days, 2 hours"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="cc-label">Body Location</label>
          <input
            className="cc-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., chest, right knee"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Severity slider */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <label className="cc-label" style={{ margin: 0 }}>Pain / Discomfort Severity</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 12, fontWeight: 700, color: "#fff",
              background: sv.color, padding: "2px 10px",
              borderRadius: 999, fontFamily: "var(--font-display)"
            }}>{sv.text}</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--cc-on-surface)", minWidth: 24, textAlign: "center" }}>
              {severity}
            </span>
            <span style={{ fontSize: 12, color: "var(--cc-muted)" }}>/10</span>
          </div>
        </div>
        <input
          type="range" min="0" max="10" value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          disabled={isLoading}
          style={{
            width: "100%", accentColor: sv.color, height: 6,
            borderRadius: 999, cursor: "pointer",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 10, color: "var(--cc-muted)" }}>None</span>
          <span style={{ fontSize: 10, color: "var(--cc-muted)" }}>Moderate</span>
          <span style={{ fontSize: 10, color: "var(--cc-muted)" }}>Extreme</span>
        </div>
      </div>

      {/* Location */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label className="cc-label">City</label>
          <input
            className="cc-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g., Lahore, Karachi"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="cc-label">Country</label>
          <select
            className="cc-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled={isLoading}
          >
            <option value="Pakistan">Pakistan</option>
            <option value="India">India</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="UAE">UAE</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="cc-alert cc-alert--info" style={{ fontSize: 12 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" strokeLinecap="round"/>
        </svg>
        <span>Your symptoms are processed by AI only for triage assessment. This is not a medical diagnosis.</span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn-primary"
        disabled={isLoading || !symptoms.trim()}
        style={{ alignSelf: "flex-end", minWidth: 200 }}
      >
        {isLoading ? (
          <>
            <div className="cc-spinner cc-spinner--sm" style={{ borderTopColor: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.3)" }} />
            <span>Analyzing symptoms…</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Analyze Symptoms</span>
          </>
        )}
      </button>
    </form>
  );
};

export default SymptomForm;
