import axios from "axios";
import { API_BASE_URL, N8N_WEBHOOK_URL, USE_N8N } from "./config";
import { useTriageStore } from "./store/triageStore";
import { parseTriageResponse } from "./utils/parseTriageResponse";
import { isN8nResponse } from "./utils/parseN8nResponse";

function isN8nWrapped(obj) {
  return isN8nResponse(obj.data);
}

const TRIAGE_TIMEOUT_MS = 120000;

const client = axios.create({
  timeout: TRIAGE_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

function triageUrl() {
  if (USE_N8N) return N8N_WEBHOOK_URL;
  return `${API_BASE_URL}/triage`;
}

export function mapApiError(err) {
  if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
    return {
      title: "Analysis took too long",
      message:
        "The triage service did not respond in time. Please try again with a shorter symptom description.",
    };
  }

  if (!err.response) {
    if (!navigator.onLine) {
      return {
        title: "You appear to be offline",
        message: "Check your internet connection and try again.",
      };
    }

    if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
      return {
        title: "Unable to reach the triage service",
        message:
          "The analysis service is temporarily unavailable. Please try again in a few minutes.",
      };
    }

    return {
      title: "Connection problem",
      message: "We could not complete your request. Please try again.",
    };
  }

  const status = err.response.status;
  const detail = err.response.data?.detail;

  if (status === 502 || status === 503 || status === 504) {
    return {
      title: "Service temporarily unavailable",
      message: "Our triage service is under heavy load. Please try again shortly.",
    };
  }

  if (status === 422) {
    return {
      title: "Invalid input",
      message:
        typeof detail === "string"
          ? detail
          : "Please check your symptoms and try again.",
    };
  }

  if (status === 429) {
    return {
      title: "Too many requests",
      message: "Please wait a moment before submitting another analysis.",
    };
  }

  if (status >= 500) {
    return {
      title: "Server error",
      message: "Something went wrong on our side. Please try again later.",
    };
  }

  return {
    title: "Request failed",
    message:
      typeof detail === "string" ? detail : `Error (${status}). Please try again.`,
  };
}

export const submitTriage = async (symptoms, city = "", country = null) => {
  const { defaultCountry } = useTriageStore.getState();
  const resolvedCountry = country || defaultCountry || "Pakistan";

  if (USE_N8N && !N8N_WEBHOOK_URL) {
    const msg = "n8n is enabled but VITE_N8N_WEBHOOK_URL is missing.";
    throw Object.assign(new Error(msg), {
      userTitle: "Configuration error",
      userMessage: msg,
    });
  }

  try {
    const response = await client.post(triageUrl(), {
      symptoms,
      city: city || "",
      country: resolvedCountry,
    });
    let body = response.data;
    if (Array.isArray(body) && body.length > 0) {
      body = body[0];
    }
    if (body?.data && typeof body.data === "object" && isN8nWrapped(body)) {
      body = body.data;
    }
    return parseTriageResponse(body);
  } catch (err) {
    const mapped = mapApiError(err);
    const wrapped = new Error(mapped.message);
    wrapped.userTitle = mapped.title;
    wrapped.userMessage = mapped.message;
    wrapped.cause = err;
    throw wrapped;
  }
};

export const getAgents = async () => {
  const response = await client.get(`${API_BASE_URL}/agents`, { timeout: 10000 });
  return response.data;
};

export const healthCheck = async () => {
  const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 8000 });
  return response.data;
};
