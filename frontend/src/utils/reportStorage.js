const STORAGE_KEY = "medi_reports";
const MAX_REPORTS = 50;

export function loadReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = JSON.parse(raw || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveReport(entry) {
  const list = loadReports();
  list.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_REPORTS)));
}

export function clearAllReports() {
  localStorage.removeItem(STORAGE_KEY);
}

export function deleteReport(id) {
  const list = loadReports().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
