import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PIPELINE_STEPS, buildStepPreview } from "../utils/pipelineSteps";

const STEP_MS = 2400;

export default function AnalysisTimeline({ active = true, symptoms = "", city = "", country = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState([]);

  const context = { symptoms, city, country };

  useEffect(() => {
    if (!active) return undefined;
    setActiveIndex(0);
    setCompleted([]);
    const interval = setInterval(() => {
      setActiveIndex((i) => {
        if (i < PIPELINE_STEPS.length - 1) {
          setCompleted((prev) => (prev.includes(i) ? prev : [...prev, i]));
          return i + 1;
        }
        setCompleted((prev) => (prev.includes(i) ? prev : [...prev, i]));
        return i;
      });
    }, STEP_MS);
    return () => clearInterval(interval);
  }, [active, symptoms, city, country]);

  return (
    <div className="timeline-panel cc-card">
      <header className="timeline-panel__header">
        <h2 className="text-h3">Running analysis</h2>
        <p className="text-caption">Multi-agent pipeline in progress</p>
      </header>

      <div className="timeline-list">
        {PIPELINE_STEPS.map((step, index) => {
          const done = completed.includes(index) || index < activeIndex;
          const current = index === activeIndex && active;
          const pending = index > activeIndex;
          const preview = buildStepPreview(step.id, context);

          return (
            <div
              key={step.id}
              className={`timeline-step${done ? " timeline-step--done" : ""}${current ? " timeline-step--active" : ""}`}
            >
              <div className="timeline-step__rail">
                <div className={`timeline-step__dot${done ? " is-done" : ""}${current ? " is-active" : ""}`}>
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < PIPELINE_STEPS.length - 1 && (
                  <div className={`timeline-step__line${done ? " is-done" : ""}`} />
                )}
              </div>

              <div className="timeline-step__body">
                <div className="timeline-step__title-row">
                  <span className="timeline-step__title">{step.label}</span>
                  <span className="timeline-step__pattern">{step.pattern}</span>
                  {step.parallel && (
                    <span className="timeline-step__badge">Parallel</span>
                  )}
                </div>
                <p className="text-caption">{step.detail}</p>

                {(current || done) && (
                  <motion.div
                    className="timeline-step__extract"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="timeline-step__extract-label">
                      {current ? "Extracting" : "Extracted"}
                    </div>
                    <dl className="extract-fields">
                      {preview.fields.map((row) => (
                        <div key={row.k} className="extract-fields__row">
                          <dt>{row.k}</dt>
                          <dd>{row.v}</dd>
                        </div>
                      ))}
                    </dl>
                  </motion.div>
                )}

                {current && (
                  <div className="timeline-step__progress">
                    <motion.div
                      className="timeline-step__progress-bar"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-caption timeline-panel__note">
        Steps marked Parallel run at the same time. Final report merges all agent outputs.
      </p>
    </div>
  );
}
