import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   PREMIUM DATA MANIFESTS
───────────────────────────────────────────────────────────── */
const agents = [
  {
    num: "01",
    title: "Symptom Extractor",
    desc: "Gathers raw input and identifies key medical entities, translating layman terms into standardized clinical vocabulary.",
    color: "#0ea5e9", // Sky Blue
    bgLight: "rgba(14,165,233,0.06)",
    borderLight: "rgba(14,165,233,0.15)",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Differential Analyzer",
    desc: "Cross-references symptoms against medical knowledge to surface likely causes ranked by probability.",
    color: "#6366f1", // Indigo Accent
    bgLight: "rgba(99,102,241,0.06)",
    borderLight: "rgba(99,102,241,0.15)",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Triage Assessor",
    desc: "Assigns urgency level and produces practical next-step guidance tailored to your specific situation.",
    color: "#10b981", // Emerald Green
    bgLight: "rgba(16,185,129,0.06)",
    borderLight: "rgba(16,185,129,0.15)",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
];

const features = [
  {
    title: "Fast & Efficient",
    text: "Quick preliminary assessment that helps you decide your next steps with less uncertainty.",
    bg: "rgba(14,165,233,0.06)",
    color: "#0ea5e9",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "Accessible Experience",
    text: "A clear and simple triage flow designed to be easy to use for patients and families.",
    bg: "rgba(16,185,129,0.06)",
    color: "#10b981",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
  },
  {
    title: "Structured Guidance",
    text: "Get organized next-step guidance you can review before talking with a healthcare professional.",
    bg: "rgba(99,102,241,0.06)",
    color: "#6366f1",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
  },
];

const footerLinks = {
  Product: ["Features", "Architecture", "How It Works", "Support"],
  Developers: ["GitHub Repo", "Documentation", "API Reference", "Contributing"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookies", "Disclaimer"],
};

/* ─────────────────────────────────────────────────────────────
   UTILITY INTERACTION HOOKS
───────────────────────────────────────────────────────────── */
function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
}

function useProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const d = document.documentElement;
      const scrollableHeight = d.scrollHeight - d.clientHeight;
      setPct(scrollableHeight > 0 ? (d.scrollTop / scrollableHeight) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return pct;
}

function useInView(once = true) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);
  return [ref, visible];
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED WRAPPER COMPONENT
───────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform motion-reduce:transition-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PREMIUM LANDING COMPONENT
───────────────────────────────────────────────────────────── */
export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();
  const progress = useProgress();

  const scrollTo = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans selection:bg-sky-500 selection:text-white overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 z-50 transition-all duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />

      {/* ══════════════════════════════════════════
          NAVBAR (Sticky Glassmorphic)
          ══════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm py-3.5"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#fff"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 font-display">
              MediTriage <span className="text-sky-500 bg-clip-text">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a
              href="#features"
              onClick={(e) => scrollTo(e, "features")}
              className="hover:text-sky-600 transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#agents"
              onClick={(e) => scrollTo(e, "agents")}
              className="hover:text-sky-600 transition-colors duration-200"
            >
              Architecture
            </a>
            <a
              href="#overview"
              onClick={(e) => scrollTo(e, "overview")}
              className="hover:text-sky-600 transition-colors duration-200"
            >
              Platform
            </a>
          </nav>

          {/* Action Triggers */}
          <div className="hidden md:flex items-center gap-4">
            <a
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                width="15"
                height="15"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              Star on GitHub
            </a>
            <Link
              to="/triage"
              className="text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transform active:scale-95 transition-all duration-200"
            >
              Start Triage
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="md:hidden text-slate-700 hover:bg-slate-100 p-2 rounded-xl transition-colors focus:outline-none"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Dropdown Menu Container */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200/80 bg-white shadow-xl px-6 py-4 flex flex-col gap-4 text-base font-medium text-slate-700 absolute top-full left-0 right-0 animation-slide-down">
            <a
              href="#features"
              onClick={(e) => scrollTo(e, "features")}
              className="py-2 hover:text-sky-600 border-b border-slate-50"
            >
              Features
            </a>
            <a
              href="#agents"
              onClick={(e) => scrollTo(e, "agents")}
              className="py-2 hover:text-sky-600 border-b border-slate-50"
            >
              Architecture
            </a>
            <a
              href="#overview"
              onClick={(e) => scrollTo(e, "overview")}
              className="py-2 hover:text-sky-600 border-b border-slate-50"
            >
              Platform
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="py-2 hover:text-sky-600 border-b border-slate-50 flex items-center gap-2"
            >
              Star on GitHub
            </a>
            <Link
              to="/triage"
              className="mt-2 text-center text-white bg-gradient-to-r from-sky-500 to-indigo-600 font-semibold py-3 rounded-xl shadow-lg shadow-sky-500/10 active:opacity-90"
              onClick={() => setMenuOpen(false)}
            >
              Start Triage Now →
            </Link>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════
          HERO SECTION (Visual Canvas Layout)
          ══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden bg-white">
        {/* Subtle Graphic Glow Elements */}
        <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.06),transparent_65%)] pointer-events-none" />
        <div className="absolute top-20 right-10 -z-10 h-72 w-72 rounded-full bg-indigo-50/50 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center">
          <Reveal>
            {/* Status Live Tag */}
            <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Advanced Multi-Agent Framework
            </div>

            {/* Typography Canvas */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.12] mb-6 max-w-4xl mx-auto">
              Understand Symptoms with Clear,{" "}
              <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-indigo-500 to-indigo-600">
                Practical Guidance
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Share your health symptoms in natural, everyday language.
              Instantly generate structured urgency reports, triage steps, and
              objective contextual references.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-flex sm:flex-row items-center justify-center gap-4 mb-14">
              <Link
                to="/triage"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-sky-500/20 hover:opacity-95 transform active:scale-[0.98] transition-all"
                id="hero-cta-triage"
              >
                Start Triage Now
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <a
                href="#agents"
                onClick={(e) => scrollTo(e, "agents")}
                className="w-full sm:w-auto inline-flex items-center justify-center font-semibold px-8 py-4 bg-slate-100 text-slate-700 border border-slate-200/80 rounded-xl hover:bg-slate-200/60 transition-colors"
              >
                How it works
              </a>
            </div>

            {/* Core Pillars Bullet Highlights */}
            <div className="border-t border-slate-100 pt-8 max-w-3xl mx-auto">
              <ul
                className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 text-sm font-medium text-slate-500"
                aria-label="Key benefits"
              >
                <li className="flex items-center justify-center gap-2">
                  <svg
                    className="text-sky-500 h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Plain Language Input
                </li>
                <li className="flex items-center justify-center gap-2">
                  <svg
                    className="text-indigo-500 h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Urgency Level Scaling
                </li>
                <li className="flex items-center justify-center gap-2">
                  <svg
                    className="text-emerald-500 h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Structured Summary Outputs
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES GRID SECTION
          ══════════════════════════════════════════ */}
      <section
        className="py-20 md:py-28 border-t border-slate-200/50"
        id="features"
      >
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest text-sky-600 uppercase mb-3">
              Core Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4 font-display">
              Built for clear triage communication
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Intelligence built intentionally around privacy, operational
              transparency, and accessible decision support interfaces.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="bg-white border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col items-start">
                  <div
                    className="p-3.5 rounded-xl mb-6 flex items-center justify-center"
                    style={{ background: f.bg, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {f.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ARCHITECTURAL PIPELINE / MULTI-AGENT SECTION
          ══════════════════════════════════════════ */}
      <section
        className="py-20 md:py-28 bg-slate-100 border-y border-slate-200/60"
        id="agents"
      >
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <div className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-3">
              Multi-Agent Architecture
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4 font-display">
              Three-stage analysis, one unified report
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Specialized decoupled software modules work together in a
              structured pipeline execution layer to extract metrics safely.
            </p>
          </Reveal>

          {/* Cards Stack Component Structure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {agents.map((a, i) => (
              <Reveal key={a.num} delay={i * 120}>
                <div
                  className="bg-white border border-slate-200 rounded-2xl p-7 relative overflow-hidden flex flex-col h-full shadow-sm"
                  style={{ borderTop: `4px solid ${a.color}` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="p-2.5 rounded-xl flex items-center justify-center"
                      style={{ color: a.color, background: a.bgLight }}
                    >
                      {a.icon}
                    </div>
                    <span
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-md border"
                      style={{
                        color: a.color,
                        backgroundColor: a.bgLight,
                        borderColor: a.borderLight,
                      }}
                    >
                      Agent {a.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {a.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-grow">
                    {a.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Graphical Sequential Pipeline Pipeline Flow Visual */}
          <Reveal>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 shadow-sm">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                <span className="h-7 w-7 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                Your Symptoms
              </div>

              <svg
                className="text-slate-300 rotate-90 md:rotate-0 transform transition-transform"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>

              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                <span className="h-7 w-7 rounded-lg bg-indigo-50/10 text-indigo-600 flex items-center justify-center font-mono text-xs">
                  3X
                </span>
                Autonomous Agents
              </div>

              <svg
                className="text-slate-300 rotate-90 md:rotate-0 transform transition-transform"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>

              <div className="flex items-center gap-3 text-sm font-semibold text-white bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-900">
                <span className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
                Structured Triage Report
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PLATFORM OVERVIEW PANEL SECTION
          ══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white" id="overview">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-slate-900 rounded-3xl p-8 md:p-14 relative overflow-hidden shadow-xl text-slate-300">
            {/* Background Accent Gradients */}
            <div className="absolute top-0 right-0 h-80 w-80 bg-gradient-to-bl from-sky-500/10 to-indigo-500/0 blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <Reveal>
                  <div className="text-xs font-bold tracking-widest text-sky-400 uppercase mb-3">
                    Platform Design
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4 font-display">
                    Transparent, localized code implementation
                  </h2>
                  <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-8">
                    MediTriage AI enables rapid deployment pathways for
                    communities that require non-emergency evaluation options.
                    The architecture separates visualization layout engines
                    cleanly from core inference APIs.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-3 text-slate-900 bg-white hover:bg-slate-50 rounded-xl transition-all shadow-md shadow-black/10"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                      View Code Repository
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center justify-center text-xs font-semibold px-5 py-3 text-slate-300 hover:text-white bg-slate-800 border border-slate-700/60 rounded-xl hover:bg-slate-700/50 transition-all"
                    >
                      Read Architecture Document
                    </a>
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-5">
                <Reveal delay={150}>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="bg-slate-800/60 border border-slate-700/40 p-5 rounded-2xl">
                      <strong className="block text-white text-base mb-1">
                        Symptom Input
                      </strong>
                      <span className="text-xs text-slate-400">
                        Structured terminology matchers
                      </span>
                    </div>
                    <div className="bg-slate-800/60 border border-slate-700/40 p-5 rounded-2xl">
                      <strong className="block text-white text-base mb-1">
                        Triage Summary
                      </strong>
                      <span className="text-xs text-slate-400">
                        Clear categorical urgency logs
                      </span>
                    </div>
                    <div className="bg-slate-800/60 border border-slate-700/40 p-5 rounded-2xl">
                      <strong className="block text-white text-base mb-1">
                        Risk Evaluation
                      </strong>
                      <span className="text-xs text-slate-400">
                        Decoupled execution streams
                      </span>
                    </div>
                    <div className="bg-slate-800/60 border border-slate-700/40 p-5 rounded-2xl">
                      <strong className="block text-white text-base mb-1">
                        React + Tailwind
                      </strong>
                      <span className="text-xs text-slate-400">
                        Production client stack
                      </span>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CALL TO ACTION GRADIENT BANNER
          ══════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/60 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4 font-display">
              Ready to analyze your symptoms?
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto mb-8 text-sm md:text-base">
              Begin a structured, private triage overview session immediately.
              No profiles or personal access setups required.
            </p>
            <Link
              to="/triage"
              className="inline-flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-7 py-4 rounded-xl shadow-lg transform active:scale-95 transition-all"
              id="cta-final-triage"
            >
              Start Free Triage Assessment
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER & COMPREHENSIVE DISCLAIMER
          ══════════════════════════════════════════ */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs pt-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
            {/* Branding Column */}
            <div className="md:col-span-4">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="h-7 w-7 bg-sky-500 rounded-lg flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#fff"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <span className="text-base font-bold text-white tracking-tight">
                  MediTriage AI
                </span>
              </Link>
              <p className="text-slate-500 leading-relaxed mb-4">
                Structured clinical communications and urgency indexing tools
                for global community workflows.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <svg
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Columns Grid Mapping */}
            <div className="md:col-span-8 grid grid-cols-3 gap-6">
              {Object.entries(footerLinks).map(([heading, links]) => (
                <div className="flex flex-col gap-2.5" key={heading}>
                  <h4 className="text-white font-semibold tracking-wide uppercase text-[10px] text-slate-400 mb-1">
                    {heading}
                  </h4>
                  {links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="hover:text-white transition-colors duration-150 text-slate-500"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Sub Footer Row */}
          <div className="border-t border-slate-800 py-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
            <span>
              &copy; {new Date().getFullYear()} MediTriage AI. All rights
              reserved.
            </span>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                System Status
              </a>
            </div>
          </div>
        </div>

        {/* Legal Medical Safety Disclaimer Stripe */}
        <div className="bg-slate-950 text-slate-500 border-t border-slate-900/60 py-5">
          <div className="max-w-5xl mx-auto px-6 flex items-start gap-3">
            <svg
              className="text-amber-500/80 shrink-0 mt-0.5"
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="leading-relaxed text-[11px]">
              <strong className="text-slate-400">Medical Disclaimer:</strong>{" "}
              MediTriage AI is an informational multi-agent orchestration
              software template. It does not contain clinical evaluation
              algorithms, provide diagnostic medical directives, or substitute
              professional expert health consults or active critical clinical
              evaluation processes. Always request authorized professional
              physician intervention immediately for emergency medical needs.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
