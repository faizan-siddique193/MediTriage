import { toAsciiText } from "../utils/formatText";

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="insight-row">
      <span className="insight-row__label">{label}</span>
      <span className="insight-row__value">{value}</span>
    </div>
  );
}

function ListRow({ label, items }) {
  if (!items?.length) return null;
  return (
    <div className="insight-row insight-row--stack">
      <span className="insight-row__label">{label}</span>
      <ul className="insight-list">
        {items.map((item) => (
          <li key={item}>{toAsciiText(item)}</li>
        ))}
      </ul>
    </div>
  );
}

export function SymptomInsight({ data }) {
  const ss = data.structured_symptoms || data.structured || data;
  const symptoms = data.symptoms || ss.main_symptoms || [];
  return (
    <div className="insight-block">
      <ListRow label="Symptoms" items={symptoms} />
      <Row label="Duration" value={data.duration || ss.duration} />
      <Row label="Severity" value={data.severity != null ? `${data.severity}/10` : ss.severity_score != null ? `${ss.severity_score}/10` : null} />
      <Row label="Location" value={data.location || ss.body_location} />
      <ListRow label="Red flags" items={data.red_flags || ss.red_flags} />
    </div>
  );
}

export function KnowledgeInsight({ data }) {
  const conditions = data.possible_conditions || data.conditions || [];
  return (
    <div className="insight-block">
      <Row label="Specialist" value={data.recommended_specialist || data.specialist} />
      <Row label="Matches found" value={conditions.length ? String(conditions.length) : null} />
      {conditions.slice(0, 3).map((c, i) => (
        <Row
          key={c.condition || i}
          label={c.condition || `Condition ${i + 1}`}
          value={c.likelihood ? `${c.likelihood} likelihood` : c.explanation}
        />
      ))}
      {data.rag_sources?.length > 0 && (
        <Row label="RAG sources" value={`${data.rag_sources.length} chunks`} />
      )}
    </div>
  );
}

export function RiskInsight({ data }) {
  const risk = data.risk_assessment || data;
  const cot = data.chain_of_thought;
  let reasoning = data.reasoning;
  if (!reasoning && cot && typeof cot === "object") {
    reasoning = Object.values(cot)
      .map((v) => toAsciiText(v))
      .join(" ");
  }
  return (
    <div className="insight-block">
      <Row label="Urgency level" value={risk.level || risk.urgency_level || data.urgency} />
      <Row label="Score" value={risk.urgency_score != null ? `${risk.urgency_score}/10` : data.urgency_score != null ? `${data.urgency_score}/10` : null} />
      <Row label="Action" value={risk.recommended_action} />
      {reasoning && <p className="insight-note">{toAsciiText(reasoning)}</p>}
    </div>
  );
}

export function DoctorInsight({ data }) {
  const block = data.output || data;
  const list = block.suggestions || data.suggestions || [];
  return (
    <div className="insight-block">
      <Row label="Location searched" value={block.location_searched || data.search_location} />
      <Row label="Specialist" value={block.specialist_type || data.specialist} />
      <Row label="Results" value={list.length ? `${list.length} listings` : null} />
      {list.slice(0, 3).map((s, i) => (
        <Row key={s.name || i} label={s.name || `Option ${i + 1}`} value={s.specialization || s.type} />
      ))}
    </div>
  );
}
