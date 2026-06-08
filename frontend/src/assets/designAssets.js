// Re-export design images from the extracted design folder using Vite-friendly URLs
export const landingHero = new URL(
  "../../../stitch_modern_ui_ux_design/meditriage_ai_landing_page/screen.png",
  import.meta.url,
).href;
export const symptomEntry = new URL(
  "../../../stitch_modern_ui_ux_design/meditriage_ai_symptom_entry/screen.png",
  import.meta.url,
).href;
export const liveAnalysis = new URL(
  "../../../stitch_modern_ui_ux_design/meditriage_ai_live_analysis/screen.png",
  import.meta.url,
).href;
export const highFidelityReport = new URL(
  "../../../stitch_modern_ui_ux_design/meditriage_ai_high_fidelity_triage_report/screen.png",
  import.meta.url,
).href;
