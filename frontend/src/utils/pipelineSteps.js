import { toAsciiText, truncate } from "./formatText";

export const PIPELINE_STEPS = [
  {
    id: "geo",
    label: "Geolocation",
    pattern: "Preprocess",
    detail: "Resolve city and country for care search",
    parallel: false,
  },
  {
    id: "struct",
    label: "Symptom structuring",
    pattern: "ReAct",
    detail: "Extract symptoms, duration, severity, red flags",
    parallel: true,
  },
  {
    id: "rag",
    label: "Medical knowledge",
    pattern: "RAG",
    detail: "Match conditions from knowledge base",
    parallel: true,
  },
  {
    id: "risk",
    label: "Risk scoring",
    pattern: "Chain-of-Thought",
    detail: "Compute urgency score and level",
    parallel: true,
  },
  {
    id: "hospital",
    label: "Care search",
    pattern: "Tool Use",
    detail: "Find hospitals and specialists nearby",
    parallel: false,
  },
  {
    id: "plan",
    label: "Report synthesis",
    pattern: "Planner",
    detail: "Build summary and action plan",
    parallel: false,
  },
];

function tokenizeSymptoms(text) {
  return toAsciiText(text)
    .toLowerCase()
    .split(/[,;.\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2)
    .slice(0, 5);
}

export function buildStepPreview(stepId, context) {
  const { symptoms = "", city = "", country = "" } = context;
  const location =
    city && country ? `${city}, ${country}` : city || country || "your region";
  const tokens = tokenizeSymptoms(symptoms);

  switch (stepId) {
    case "geo":
      return {
        fields: [
          { k: "Location", v: location },
          { k: "Source", v: city || country ? "User input" : "Default / IP fallback" },
        ],
      };
    case "struct":
      return {
        fields: [
          { k: "Symptoms", v: tokens.length ? tokens.join(", ") : "Parsing narrative..." },
          { k: "Method", v: "ReAct reasoning loop" },
        ],
      };
    case "rag":
      return {
        fields: [
          { k: "Query", v: truncate(symptoms, 80) || "Symptom embedding" },
          { k: "Retrieval", v: "Top medical condition matches" },
        ],
      };
    case "risk":
      return {
        fields: [
          { k: "Inputs", v: "Symptoms + condition candidates" },
          { k: "Output", v: "Urgency score and level" },
        ],
      };
    case "hospital":
      return {
        fields: [
          { k: "Search", v: `Gastroenterology near ${location}` },
          { k: "Tool", v: "Web search (Tavily)" },
        ],
      };
    case "plan":
      return {
        fields: [
          { k: "Merge", v: "All agent JSON outputs" },
          { k: "Output", v: "Clinical overview and next steps" },
        ],
      };
    default:
      return { fields: [] };
  }
}
