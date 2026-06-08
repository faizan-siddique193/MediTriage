
export default function DoctorDetailModal({ open, onClose, doctor }) {
  if (!open || !doctor) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(25,28,33,0.45)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 480,
          background: "var(--cc-surface)",
          border: "1px solid var(--cc-outline-variant)",
          borderRadius: 20,
          boxShadow: "var(--cc-shadow-md)",
          overflow: "hidden",
          animation: "fadeSlideUp 0.25s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--cc-outline-variant)",
          gap: 12,
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: 17, color: "var(--cc-on-surface)", marginBottom: 4,
            }}>
              {doctor.name}
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center",
              fontSize: 11, fontWeight: 600,
              background: "var(--cc-primary-fixed)",
              color: "var(--cc-primary-container)",
              border: "1px solid var(--cc-primary-fixed-dim)",
              borderRadius: 999, padding: "2px 10px",
            }}>
              {doctor.type}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: "var(--cc-surface-container)",
              border: "1px solid var(--cc-outline-variant)",
              cursor: "pointer", color: "var(--cc-on-surface-variant)",
              display: "grid", placeItems: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--cc-surface-container-high)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--cc-surface-container)"}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Why recommended */}
          <div style={{
            background: "var(--cc-surface-low)",
            border: "1px solid var(--cc-outline-variant)",
            borderRadius: 12, padding: "12px 14px",
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
              textTransform: "uppercase", color: "var(--cc-muted)", marginBottom: 6,
            }}>Why Recommended</div>
            <p style={{ fontSize: 13, color: "var(--cc-on-surface)", lineHeight: 1.6, margin: 0 }}>
              {doctor.why_recommended}
            </p>
          </div>

          {/* Address */}
          {doctor.address_hint && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cc-muted)" strokeWidth="2" strokeLinecap="round" style={{ marginTop: 2, flexShrink: 0 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span style={{ fontSize: 13, color: "var(--cc-on-surface-variant)", lineHeight: 1.5 }}>
                {doctor.address_hint}
              </span>
            </div>
          )}

          {/* Urgency note */}
          {doctor.urgency_note && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cc-muted)" strokeWidth="2" strokeLinecap="round" style={{ marginTop: 2, flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span style={{ fontSize: 13, color: "var(--cc-on-surface-variant)", lineHeight: 1.5 }}>
                {doctor.urgency_note}
              </span>
            </div>
          )}

          {/* AI disclaimer */}
          <div style={{
            fontSize: 11, color: "var(--cc-muted)", fontStyle: "italic",
            paddingTop: 8, borderTop: "1px solid var(--cc-outline-variant)",
          }}>
            ⚠️ AI-generated suggestion — always call ahead to verify availability and specialisation.
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", gap: 10, padding: "0 24px 20px",
        }}>
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent((doctor.name || "") + " " + (doctor.address_hint || ""))}`}
            target="_blank" rel="noreferrer"
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "11px 0",
              background: "var(--cc-primary-fixed)",
              color: "var(--cc-primary-container)",
              border: "1px solid var(--cc-primary-fixed-dim)",
              borderRadius: 10, textDecoration: "none",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--cc-primary-fixed-dim)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--cc-primary-fixed)"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Get Directions
          </a>
          <button
            onClick={onClose}
            style={{
              padding: "11px 18px",
              background: "var(--cc-surface-container)",
              color: "var(--cc-on-surface-variant)",
              border: "1px solid var(--cc-outline-variant)",
              borderRadius: 10, cursor: "pointer",
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
