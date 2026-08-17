import { useEffect, useRef, useState, type CSSProperties } from "react";
import { INTENSITY_MAX, INTENSITY_MIN } from "../content";
import { simbaAriaText } from "../lib/simba";
import { useIntensity } from "./IntensityContext";

/**
 * The page loads Plus Jakarta Sans as static instances, so only these six exist and
 * asking for anything between them would snap or synthesise. Six levels against five
 * weights means one repeat, spent at the top where ink separates them instead.
 */
const STEP_WEIGHTS = [400, 500, 600, 700, 800, 800];

/**
 * `strength` is how much headroom is left in this direction, 0..1. The stepper with
 * nowhere left to go fades out; the one with room ahead is crisp and inviting, so the
 * pair is the only thing that needs to state the position.
 *
 * All three axes ramp together — weight, ink and tracking — because they're the whole
 * readout: adjacent levels have to be told apart on sight, and weight alone is too
 * coarse to do it in five steps.
 */
function stepperStyle(strength: number): CSSProperties {
  return {
    fontWeight: STEP_WEIGHTS[Math.round(strength * 5)],
    color: `color-mix(in oklch, var(--ink) ${(14 + 86 * strength).toFixed(1)}%, transparent)`,
    letterSpacing: `${(0.1 - 0.085 * strength).toFixed(3)}em`,
  };
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  const d =
    dir === "right"
      ? "M0.6 5h23.8M19.4 0.9 24.4 5l-5 4.1"
      : "M24.4 5H0.6M5.6 0.9 0.6 5l5 4.1";
  return (
    <svg className="tone-axis__arrow" viewBox="0 0 25 10" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Two uppercase labels with hairline arrows, and nothing else — no track, no notches,
 * no readout. How each label is set says how far you can still travel that way, which
 * is the same information a value display would carry, and the sentence overhead is
 * already showing you the result.
 */
export function IntensityAxis({ inline = false }: { inline?: boolean }) {
  const { intensity, setIntensity } = useIntensity();
  const [touched, setTouched] = useState(false);
  const firstRender = useRef(true);

  // Any change — including one made from elsewhere — retires the idle nudge.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setTouched(true);
  }, [intensity]);

  const step = (delta: number) => {
    setTouched(true);
    setIntensity(intensity + delta);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setTouched(true);
      setIntensity(INTENSITY_MIN);
    } else if (e.key === "End") {
      e.preventDefault();
      setTouched(true);
      setIntensity(INTENSITY_MAX);
    }
  };

  const atMin = intensity <= INTENSITY_MIN;
  const atMax = intensity >= INTENSITY_MAX;
  const roomDown = (intensity - INTENSITY_MIN) / (INTENSITY_MAX - INTENSITY_MIN);
  const roomUp = 1 - roomDown;

  return (
    <aside className={`tone-axis${inline ? " tone-axis--inline" : ""}`}>
      <div
        className="tone-axis__stack"
        role="group"
        aria-label="Tone of the sentence above"
        onKeyDown={onKeyDown}
      >
        <button
          type="button"
          className="tone-axis__step tone-axis__step--down"
          style={stepperStyle(roomDown)}
          aria-disabled={atMin}
          aria-label="Say it more nonchalantly"
          data-idle={!touched}
          onClick={() => {
            if (!atMin) step(-1);
          }}
        >
          <Arrow dir="left" />
          <span>nonchalant</span>
        </button>

        <span className="tone-axis__spacer" aria-hidden="true" />

        <button
          type="button"
          className="tone-axis__step tone-axis__step--up"
          style={stepperStyle(roomUp)}
          aria-disabled={atMax}
          aria-label="Try harder"
          data-idle={!touched}
          onClick={() => {
            if (!atMax) step(1);
          }}
        >
          <span>try hard</span>
          <Arrow dir="right" />
        </button>
      </div>

      <p className="tone-axis__status" role="status" aria-live="polite">
        {`Tone ${intensity + 1} of ${INTENSITY_MAX + 1} — ${simbaAriaText(intensity)}`}
      </p>
    </aside>
  );
}
