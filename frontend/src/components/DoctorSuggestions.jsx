import { useState } from "react";

export default function DoctorSuggestions({ suggestions }) {
  const [selected, setSelected] = useState(null);

  if (!suggestions) return null;

  if (suggestions.skipped) {
    return (
      <div className="cc-alert cc-alert--success">
        <strong>Home care recommended</strong>
        <p className="text-body" style={{ margin: "0.5rem 0 0" }}>
          {suggestions.reason} {suggestions.home_care}
        </p>
      </div>
    );
  }

  if (suggestions.error) {
    return (
      <p className="text-body text-muted">
        Care listings are unavailable. Search maps for providers near{" "}
        {suggestions.search_location || "your area"}.
      </p>
    );
  }

  const list = suggestions.suggestions || [];

  return (
    <div className="doctor-grid-wrap">
      <p className="text-caption">
        {suggestions.search_location
          ? `Near ${suggestions.search_location}`
          : "Suggested care options"}
        {" "}
        (verify before visiting)
      </p>

      <div className="doctor-grid">
        {list.map((s, idx) => (
          <article key={idx} className="doctor-card">
            <div className="doctor-card__head">
              <h4 className="doctor-card__name">{s.name}</h4>
              <span className="doctor-card__type">{s.type}</span>
            </div>
            {s.why_recommended && (
              <p className="doctor-card__why">{s.why_recommended}</p>
            )}
            <div className="doctor-card__meta">
              {s.address_hint && <span>{s.address_hint}</span>}
              {s.urgency_note && <span>{s.urgency_note}</span>}
            </div>
            <div className="doctor-card__actions">
              {s.web_url ? (
                <a
                  href={s.web_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary doctor-card__btn"
                >
                  Open {s.web_label || "listing"}
                </a>
              ) : (
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(`${s.name} ${suggestions.search_location || ""}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary doctor-card__btn"
                >
                  Maps
                </a>
              )}
              <button
                type="button"
                className="btn-ghost doctor-card__btn"
                onClick={() => setSelected(selected === idx ? null : idx)}
              >
                {selected === idx ? "Less" : "More"}
              </button>
            </div>
            {selected === idx && (
              <div className="doctor-card__detail text-caption">
                <div>Type: {s.type}</div>
                <div>Area: {s.address_hint}</div>
                {s.web_url && <div>Source: {s.web_label || s.web_url}</div>}
              </div>
            )}
          </article>
        ))}
      </div>

      {suggestions.general_advice && (
        <p className="text-caption doctor-grid-wrap__advice">{suggestions.general_advice}</p>
      )}
    </div>
  );
}
