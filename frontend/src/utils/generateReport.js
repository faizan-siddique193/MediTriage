import { jsPDF } from "jspdf";

/**
 * generateReport(payload)
 *
 * Expected payload shape (simplified):
 * {
 *   reportId, generatedAt, symptoms,
 *   urgency_level, primary_disease,
 *   triage_summary,   // AI summary paragraph
 *   what_to_do,       // Action instructions
 *   agent2_output: { possible_conditions: [{ condition, explanation }] },
 *   agent1_output: { symptoms, duration, severity, location },
 *   agent3_output: { urgency, reasoning },
 *   doctor_suggestions,
 *   user: { city, country }
 * }
 */
export default function generateReport(data) {
  const doc     = new jsPDF({ unit: "mm", format: "a4" });
  const PW      = 210;                      // page width
  const PH      = 297;                      // page height
  const M       = 18;                       // margin
  const CW      = PW - M * 2;              // content width

  /* ── Colour palette ──────────────────────────────────────────── */
  const BLUE    = [0, 71, 141];            // primary brand
  const LBLUE   = [0, 94, 184];
  const DARK    = [25, 28, 33];
  const MUTED   = [114, 119, 131];
  const WHITE   = [255, 255, 255];

  const urgencyKey = (data.urgency_level || "MILD").toUpperCase();
  const URGENCY_META = {
    MILD:      { bg: [240, 253, 244], text: [22, 101, 52],  accent: [34, 197, 94],  label: "MILD" },
    MODERATE:  { bg: [254, 252, 232], text: [133, 77, 14],  accent: [234, 179, 8],  label: "MODERATE" },
    URGENT:    { bg: [255, 247, 237], text: [154, 52, 18],  accent: [249, 115, 22], label: "URGENT" },
    EMERGENCY: { bg: [254, 242, 242], text: [127, 29, 29],  accent: [239, 68, 68],  label: "EMERGENCY" },
  };
  const UM = URGENCY_META[urgencyKey] || URGENCY_META.MILD;

  /* ── Helpers ─────────────────────────────────────────────────── */
  

  function footer(pageN, total) {
    const fy = PH - M + 6;
    doc.setDrawColor(...BLUE); doc.setLineWidth(0.3);
    doc.line(M, fy - 5, PW - M, fy - 5);
    doc.setFontSize(8); doc.setTextColor(...MUTED); doc.setFont("helvetica", "normal");
    doc.text("MediTriage AI · AI-generated · NOT a medical diagnosis", M, fy);
    doc.text(`Page ${pageN} of ${total}`, PW - M, fy, { align: "right" });
  }

  function sectionHeader(y, title) {
    doc.setFillColor(...BLUE);
    doc.rect(M, y, 3, 5, "F");
    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK);
    doc.text(title.toUpperCase(), M + 6, y + 3.5);
    return y + 10;
  }

  function wrappedText(text, x, y, maxW, size, color, style = "normal") {
    doc.setFontSize(size); doc.setFont("helvetica", style); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(String(text || ""), maxW);
    doc.text(lines, x, y);
    return y + lines.length * (size * 0.38);
  }

  /* ═══════════════════════════════════════════════════════════
     PAGE 1 — COVER & SUMMARY
     ═══════════════════════════════════════════════════════════ */
  // Header bar
  doc.setFillColor(...LBLUE);
  doc.rect(0, 0, PW, 32, "F");
  doc.setFontSize(20); doc.setFont("helvetica", "bold"); doc.setTextColor(...WHITE);
  doc.text("MediTriage AI", M, 13);
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  doc.text("AI-Powered Clinical Triage Report", M, 21);

  // Report meta (right-aligned)
  const genDate = new Date(data.generatedAt || Date.now());
  const dateStr = genDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    + " " + genDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  doc.setFontSize(8); doc.setTextColor(...WHITE);
  doc.text(dateStr,          PW - M, 13, { align: "right" });
  doc.text("ID: " + (data.reportId || "N/A"), PW - M, 20, { align: "right" });

  // Disclaimer bar
  doc.setFillColor(255, 243, 205);
  doc.rect(0, 32, PW, 12, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(146, 64, 14);
  doc.text("NOT a medical diagnosis. For informational guidance only. Consult a licensed clinician.", M, 38.5);

  let y = 52;

  // ── Urgency badge ──
  doc.setFillColor(...UM.bg);
  doc.roundedRect(M, y, CW, 20, 3, 3, "F");
  doc.setDrawColor(...UM.accent); doc.setLineWidth(0.5);
  doc.roundedRect(M, y, CW, 20, 3, 3, "S");
  doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(...UM.text);
  doc.text(urgencyKey, M + 6, y + 8);
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK);
  doc.text(data.primary_disease || "Condition not determined", M + 6, y + 15);
  y += 26;

  // ── AI Summary ──
  y = sectionHeader(y, "Clinical Summary");
  y = wrappedText(data.triage_summary || data.summary || "", M, y, CW, 10, DARK);
  y += 6;

  // ── What To Do ──
  doc.setFillColor(240, 253, 244);
  const whatToDoLines = doc.splitTextToSize(data.what_to_do || "", CW - 10);
  const wtdH = Math.max(16, whatToDoLines.length * 4.5 + 8);
  doc.roundedRect(M, y, CW, wtdH, 2, 2, "F");
  doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(22, 101, 52);
  doc.text("RECOMMENDED ACTION", M + 4, y + 6);
  doc.setFont("helvetica", "normal"); doc.setTextColor(...DARK);
  doc.text(whatToDoLines, M + 4, y + 11);
  y += wtdH + 8;

  // ── Symptoms submitted ──
  y = sectionHeader(y, "Symptoms Reported");
  doc.setFillColor(249, 250, 251);
  const symLines = doc.splitTextToSize(data.symptoms || "Not provided", CW - 8);
  const symH = Math.max(10, symLines.length * 4.5 + 6);
  doc.roundedRect(M, y, CW, symH, 2, 2, "F");
  doc.setFont("helvetica", "italic"); doc.setFontSize(9.5); doc.setTextColor(...DARK);
  doc.text(symLines, M + 4, y + 5.5);
  y += symH + 8;

  // ── Location ──
  if (data.user?.city || data.user?.country) {
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(...MUTED);
    doc.text("Location: " + [data.user.city, data.user.country].filter(Boolean).join(", "), M, y);
    y += 7;
  }

  footer(1, 3);

  /* ═══════════════════════════════════════════════════════════
     PAGE 2 — DETECTED DISEASES & AGENT ANALYSIS
     ═══════════════════════════════════════════════════════════ */
  doc.addPage();
  y = M;

  y = sectionHeader(y, "Detected Diseases & Possible Conditions");

  const conditions =
    data.agent2_output?.possible_conditions ||
    data.detected_diseases ||
    [];
  if (conditions.length === 0) {
    y = wrappedText("No conditions detected.", M, y, CW, 10, MUTED);
    y += 4;
  } else {
    conditions.forEach((c, i) => {
      const condName = typeof c === "string" ? c : (c.condition || "Unknown");
      const condExpl = typeof c === "string" ? "" : (c.explanation || "");
      const isPrimary = i === 0;

      doc.setFillColor(...(isPrimary ? UM.bg : [249, 250, 251]));
      const exLines = doc.splitTextToSize(condExpl, CW - 50);
      const cardH = Math.max(12, exLines.length * 4 + 10);
      doc.roundedRect(M, y, CW, cardH, 2, 2, "F");

      if (isPrimary) {
        doc.setDrawColor(...UM.accent); doc.setLineWidth(0.4);
        doc.roundedRect(M, y, CW, cardH, 2, 2, "S");
      }

      // Rank number
      doc.setFillColor(...(isPrimary ? UM.accent : [200, 200, 200]));
      doc.circle(M + 5.5, y + cardH / 2, 4, "F");
      doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...WHITE);
      doc.text(String(i + 1), M + 5.5, y + cardH / 2 + 2.5, { align: "center" });

      doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK);
      doc.text(condName + (isPrimary ? "  [PRIMARY]" : ""), M + 13, y + 6);
      doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...MUTED);
      doc.text(exLines, M + 13, y + 11);

      y += cardH + 4;
    });
  }

  y += 10;
  footer(2, 3);

  /* ═══════════════════════════════════════════════════════════
     PAGE 3 — DOCTOR SUGGESTIONS & CLOSING
     ═══════════════════════════════════════════════════════════ */
  doc.addPage();
  y = M;

  y = sectionHeader(y, "Doctor & Facility Suggestions");

  const ds = data.doctor_suggestions || { skipped: true };
  if (ds.skipped) {
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(M, y, CW, 20, 2, 2, "F");
    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(22, 101, 52);
    doc.text("🏠 Home Care Recommended", M + 4, y + 7);
    doc.setFont("helvetica", "normal"); doc.setTextColor(...DARK);
    y = wrappedText(ds.home_care || ds.reason || "", M + 4, y + 13, CW - 8, 9, DARK);
    y += 6;
  } else if (ds.error) {
    y = wrappedText(
      "Doctor suggestions are unavailable. Search Google Maps for doctors near your location.",
      M, y, CW, 10, MUTED
    );
    y += 6;
  } else {
    const suggestions = ds.suggestions || [];
    const cW = (CW - 8) / Math.min(3, suggestions.length || 1);
    suggestions.slice(0, 3).forEach((s, i) => {
      const sx = M + i * (cW + 4);
      const nameLines = doc.splitTextToSize(s.name || "", cW - 4);
      const whyLines  = doc.splitTextToSize(s.why_recommended || "", cW - 4);
      const cardH = 10 + nameLines.length * 5 + whyLines.length * 4.5 + 14;

      doc.setFillColor(249, 250, 251);
      doc.roundedRect(sx, y, cW, cardH, 2, 2, "F");
      doc.setDrawColor(...BLUE); doc.setLineWidth(0.3);
      doc.line(sx, y, sx + cW, y);

      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...DARK);
      doc.text(nameLines, sx + 3, y + 6);
      doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...MUTED);
      doc.text(s.type || "", sx + 3, y + 6 + nameLines.length * 5);
      doc.setTextColor(...DARK);
      doc.text(whyLines, sx + 3, y + 11 + nameLines.length * 5);
      doc.setTextColor(...MUTED);
      const addrY = y + 11 + nameLines.length * 5 + whyLines.length * 4.5;
      doc.text("📍 " + (s.address_hint || ""), sx + 3, addrY);
    });
    y += 60;
  }

  // AI disclaimer box
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(M, y, CW, 18, 2, 2, "F");
  doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(146, 64, 14);
  doc.text("Doctor suggestions are AI-generated for guidance only. Always call ahead to verify availability.", M + 4, y + 7);
  doc.setFont("helvetica", "normal");
  doc.text("MediTriage AI is not responsible for the accuracy of these listings.", M + 4, y + 13);
  y += 24;

  // Emergency note
  if (urgencyKey === "EMERGENCY" || urgencyKey === "URGENT") {
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(M, y, CW, 14, 2, 2, "F");
    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(185, 28, 28);
    doc.text("🚨 Emergency (Pakistan): 1122 (Rescue)  •  115 (Edhi Foundation)  •  1021 (Rescue Rescue)", M + 4, y + 9);
    y += 20;
  }

  // Final report ID + note
  y += 10;
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...MUTED);
  doc.text(
    `Report ID: ${data.reportId || "N/A"}  ·  Generated: ${genDate.toLocaleString()}  ·  MediTriage AI (open-source, academic project)`,
    PW / 2, y, { align: "center" }
  );

  footer(3, 3);

  // ── Save ──
  const ymd = genDate.toISOString().slice(0, 10);
  doc.save(`MediTriage-Report-${data.reportId || "report"}-${ymd}.pdf`);
}
