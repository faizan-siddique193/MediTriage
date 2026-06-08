import { hostFromUrl, isUrl, toAsciiText, truncate } from "./formatText";

function cleanName(name) {
  const n = toAsciiText(name);
  if (n.length > 52) return "Medical reference (online)";
  return n;
}

export function normalizeDoctorSuggestions(raw, locationFallback = "") {
  if (!raw) return null;
  if (raw.skipped || raw.error) return raw;

  const block = raw.output || raw;
  const list = block.suggestions || raw.suggestions || [];
  const searchLocation =
    toAsciiText(block.location_searched || raw.search_location || locationFallback);

  if (!list.length && !block.general_advice && !raw.general_advice) return null;

  const suggestions = list.map((s) => {
    const rawHint = s.address_hint || s.address_area || "";
    const webUrl = isUrl(rawHint)
      ? rawHint
      : isUrl(s.contact_info)
        ? s.contact_info
        : null;

    return {
      name: cleanName(s.name),
      type: toAsciiText(s.specialization || s.type || "Specialist"),
      why_recommended: truncate(s.why_recommended || "", 220),
      address_hint: webUrl
        ? searchLocation || "See online listing"
        : toAsciiText(rawHint || searchLocation),
      web_url: webUrl,
      web_label: webUrl ? hostFromUrl(webUrl) : "",
      urgency_note: toAsciiText(
        s.urgency_suitability || s.urgency_note || "Call ahead to confirm"
      ),
    };
  });

  let general = toAsciiText(block.general_advice || raw.general_advice || "");
  if (general.toLowerCase().includes("verified-style results from tavily")) {
    general = "";
  }

  return {
    search_location: searchLocation,
    general_advice: general,
    suggestions,
  };
}
