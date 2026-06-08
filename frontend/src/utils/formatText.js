/** Replace en/em dashes and special spaces with ASCII equivalents. */
export function toAsciiText(value) {
  if (value == null) return "";
  return String(value)
    .replace(/\u2013|\u2014/g, "-")
    .replace(/\u00a0|\u202f|\u2009/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(value, max = 160) {
  const text = toAsciiText(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}...`;
}

export function isUrl(value) {
  return /^https?:\/\//i.test(String(value || "").trim());
}

export function hostFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
