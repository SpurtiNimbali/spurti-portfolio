import { useCallback, useEffect, useRef, useState } from "react";
import { INTENSITY_LEVELS, INTENSITY_MAX, INTENSITY_MIN } from "../content";
import { useIntensity } from "./IntensityContext";

const POLE_TOP = INTENSITY_LEVELS[INTENSITY_MAX].label;
const POLE_BOTTOM = INTENSITY_LEVELS[INTENSITY_MIN].label;

function useMobileAxis() {
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return mobile;
}

export function IntensityAxis() {
  const { intensity, setIntensity, label } = useIntensity();
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const mobile = useMobileAxis();

  const snapFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const track = trackRef.current;
      if (!track) return;
      const r = track.getBoundingClientRect();
      const t = mobile
        ? (clientX - r.left) / r.width
        : 1 - (clientY - r.top) / r.height;
      const next = Math.round(Math.min(1, Math.max(0, t)) * INTENSITY_MAX);
      setIntensity(next);
    },
    [mobile, setIntensity],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      setIntensity(intensity + 1);
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      setIntensity(intensity - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setIntensity(INTENSITY_MIN);
    } else if (e.key === "End") {
      e.preventDefault();
      setIntensity(INTENSITY_MAX);
    }
  };

  const thumbPct = (intensity / INTENSITY_MAX) * 100;

  return (
    <aside className="intensity-axis" aria-label="Intensity from quiet to undeniable">
      <div className={`intensity-axis__inner${mobile ? " is-mobile" : ""}`}>
        <span className="intensity-pole intensity-pole--top">{POLE_TOP}</span>

        <div
          ref={trackRef}
          className="intensity-track"
          role="slider"
          tabIndex={0}
          aria-valuemin={INTENSITY_MIN}
          aria-valuemax={INTENSITY_MAX}
          aria-valuenow={intensity}
          aria-valuetext={label}
          aria-orientation={mobile ? "horizontal" : "vertical"}
          onKeyDown={onKeyDown}
          onWheel={(e) => e.preventDefault()}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            snapFromPointer(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (!dragging.current) return;
            snapFromPointer(e.clientX, e.clientY);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
        >
          <div className="intensity-track__rail" aria-hidden="true">
            <div
              className="intensity-track__thumb"
              style={
                mobile ? { left: `${thumbPct}%` } : { bottom: `${thumbPct}%` }
              }
            />
          </div>

          <ol className="intensity-notches">
            {INTENSITY_LEVELS.map((level, i) => (
              <li key={level.label}>
                <button
                  type="button"
                  className={`intensity-notch${i === intensity ? " is-on" : ""}`}
                  aria-label={level.label}
                  aria-current={i === intensity ? "true" : undefined}
                  onClick={() => setIntensity(i)}
                >
                  <span className="intensity-notch__dot" aria-hidden="true" />
                  <span className="intensity-notch__label">{level.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <span className="intensity-pole intensity-pole--bottom">{POLE_BOTTOM}</span>
      </div>
    </aside>
  );
}
