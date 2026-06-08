export default {
  theme: {
    extend: {
      colors: {
        "clinical-gray-bg": "#F8FAFC",
        surface: "#ffffff",
        "surface-variant": "#f1f5f9",
        "surface-container": "#f8fafc",
        "surface-container-low": "#f1f5f9",
        "on-surface": "#0f172a",
        "on-surface-variant": "#475569",
        primary: "#0ea5e9",
        "primary-container": "#0284c7",
        "on-primary": "#ffffff",
        "on-primary-container": "#e0f2fe",
        "clinical-blue-dark": "#003087",
        secondary: "#475569",
        "outline-variant": "#e2e8f0",
        "inverse-surface": "#1e293b",
        "primary-fixed": "#bae6fd",
        "primary-fixed-dim": "#7dd3fc",
        "triage-mild": "#22C55E",
        "triage-moderate": "#EAB308",
        "triage-urgent": "#F97316",
        "triage-emergency": "#EF4444",
        "surface-tint": "#0ea5e9",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        slideUp: {
          from: { transform: "translateY(24px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        ping: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      animation: {
        slideUp: "slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        fadeIn: "fadeIn 0.4s ease-out forwards",
      },
    },
  },
};
