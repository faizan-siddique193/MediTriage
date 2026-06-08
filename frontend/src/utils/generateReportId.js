export function generateReportId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0");
  return `MT-${year}-${rand}`;
}
