/** Shadcn-style card primitives using existing design tokens */
export function Card({ className = "", children, style = {} }) {
  return (
    <div
      className={`cc-card ${className}`.trim()}
      style={{ display: "flex", flexDirection: "column", gap: 12, ...style }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <div>
        {title && (
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--cc-on-surface)", margin: 0 }}>
            {title}
          </h3>
        )}
        {description && (
          <p style={{ fontSize: 13, color: "var(--cc-on-surface-variant)", marginTop: 4, marginBottom: 0 }}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardContent({ children, style = {} }) {
  return <div style={style}>{children}</div>;
}
