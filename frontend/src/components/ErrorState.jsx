export default function ErrorState({
  title = "Something went wrong",
  message = "We could not complete your request. Please try again.",
  onRetry,
  compact = false,
}) {
  return (
    <div
      className="cc-card error-state"
      style={{
        textAlign: compact ? "left" : "center",
        padding: compact ? "1.25rem 1.5rem" : "2.5rem 2rem",
        border: "1px solid var(--cc-outline-variant)",
        background: "var(--cc-surface)",
      }}
    >
      <div
        className="error-state__icon"
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "var(--cc-surface-container)",
          color: "var(--cc-on-surface-variant)",
          display: "grid",
          placeItems: "center",
          margin: compact ? "0 0 1rem" : "0 auto 1.25rem",
          fontSize: "1.25rem",
        }}
        aria-hidden
      >
        !
      </div>
      <h3 className="text-h3" style={{ marginBottom: "0.5rem" }}>
        {title}
      </h3>
      <p className="text-body" style={{ color: "var(--cc-on-surface-variant)", maxWidth: 420, margin: compact ? "0 0 1rem" : "0 auto 1.5rem" }}>
        {message}
      </p>
      {onRetry && (
        <button type="button" className="btn-primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
