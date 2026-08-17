import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { INTENSITY_LEVELS, INTENSITY_MAX, INTENSITY_MIN } from "../content";
import { simbaAriaText } from "../lib/simba";
import { useIntensity } from "./IntensityContext";
import { SimbaThumb } from "./SimbaThumb";

const TRACK_H = 300;
const NOTCH_STEP = 60;

function notchY(index: number) {
  return (INTENSITY_MAX - index) * NOTCH_STEP;
}

function dotSize(index: number) {
  return 4 + (index / INTENSITY_MAX) * 5;
}

function labelOpacity(index: number) {
  return 0.35 + (index / INTENSITY_MAX) * 0.25;
}

const NOTCH_ORDER = [...INTENSITY_LEVELS].reverse();

export function IntensityAxis() {
  const { intensity, setIntensity } = useIntensity();
  const trackRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(intensity);
  const [simbaStyle, setSimbaStyle] = useState<CSSProperties>({});
  const [fillHeight, setFillHeight] = useState(0);

  const activeIndex = isDragging ? preview : intensity;

  const syncGeometry = useCallback(() => {
    const track = trackRef.current;
    const dot = dotRefs.current[activeIndex];
    if (!track || !dot) return;
    const tr = track.getBoundingClientRect();
    const dr = dot.getBoundingClientRect();
    const cy = Math.min(TRACK_H - 22, Math.max(22, dr.top + dr.height / 2 - tr.top));
    const cx = dr.left + dr.width / 2 - tr.left;
    setSimbaStyle({ top: `${cy}px`, left: `${cx}px` });
    setFillHeight(Math.max(0, TRACK_H - cy));
  }, [activeIndex]);

  useEffect(() => {
    syncGeometry();
    const id = requestAnimationFrame(syncGeometry);
    window.addEventListener("resize", syncGeometry);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", syncGeometry);
    };
  }, [syncGeometry, intensity, preview, isDragging]);

  const indexFromPointer = useCallback((clientY: number) => {
    const track = trackRef.current;
    if (!track) return intensity;
    const r = track.getBoundingClientRect();
    const t = 1 - (clientY - r.top) / r.height;
    return Math.round(Math.min(1, Math.max(0, t)) * INTENSITY_MAX);
  }, [intensity]);

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

  const ariaLabel = INTENSITY_LEVELS[intensity]?.label ?? "confident";
  const ariaPose = simbaAriaText(activeIndex);

  return (
    <aside className="intensity-axis" aria-label="Intensity from quiet to undeniable">
      <div
        ref={trackRef}
        className="intensity-track"
        style={{ height: TRACK_H }}
        role="slider"
        tabIndex={0}
        aria-valuemin={INTENSITY_MIN}
        aria-valuemax={INTENSITY_MAX}
        aria-valuenow={intensity}
        aria-valuetext={`${ariaLabel} — ${ariaPose}`}
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        onWheel={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          setIsDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
          const next = indexFromPointer(e.clientY);
          setPreview(next);
          setIntensity(next);
        }}
        onPointerMove={(e) => {
          if (!isDragging) return;
          setPreview(indexFromPointer(e.clientY));
        }}
        onPointerUp={(e) => {
          const next = indexFromPointer(e.clientY);
          setIsDragging(false);
          setPreview(next);
          setIntensity(next);
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={() => {
          setIsDragging(false);
          setPreview(intensity);
        }}
      >
        <div className="intensity-rail" aria-hidden="true">
          <div className="intensity-rail__fill" style={{ height: fillHeight }} />
        </div>

        <ol className="intensity-notches">
          {NOTCH_ORDER.map((level, vi) => {
            const i = INTENSITY_MAX - vi;
            const size = dotSize(i);
            const opacity = labelOpacity(i);
            return (
              <li
                key={level.label}
                className="intensity-notch-row"
                style={{ top: notchY(i) }}
              >
                <button
                  type="button"
                  className={`intensity-notch${i === intensity ? " is-on" : ""}`}
                  aria-label={level.label}
                  aria-current={i === intensity ? "true" : undefined}
                  onClick={() => setIntensity(i)}
                >
                  <span
                    className="intensity-notch__label"
                    style={{ opacity: i === intensity ? 1 : opacity }}
                  >
                    {level.label}
                  </span>
                  <span
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    className="intensity-notch__dot"
                    style={{ width: size, height: size }}
                    aria-hidden="true"
                  />
                </button>
              </li>
            );
          })}
        </ol>

        <SimbaThumb index={activeIndex} style={simbaStyle} />
      </div>
    </aside>
  );
}
