/**
 * API configuration (environment only — no UI toggles).
 *
 * FastAPI (default):
 *   - Dev: leave VITE_PYTHON_API_URL unset → uses /api (Vite proxy → :8000)
 *   - Prod: VITE_PYTHON_API_URL=https://your-api.example.com
 *
 * n8n webhook:
 *   - VITE_USE_N8N=true
 *   - VITE_N8N_WEBHOOK_URL=https://your-n8n.example.com/webhook/...
 */
const envUrl = (import.meta.env.VITE_PYTHON_API_URL || "").trim().replace(/\/$/, "");

export const API_BASE_URL = envUrl || "/api";

export const N8N_WEBHOOK_URL = (import.meta.env.VITE_N8N_WEBHOOK_URL || "").trim();

/** Set VITE_USE_N8N=true in .env to send triage requests to the n8n webhook. */
export const USE_N8N =
  import.meta.env.VITE_USE_N8N === "true" && Boolean(N8N_WEBHOOK_URL);

export const IS_DEV = import.meta.env.DEV;
