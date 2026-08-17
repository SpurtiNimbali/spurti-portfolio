import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { INTENSITY_LEVELS, INTENSITY_MAX, INTENSITY_MIN } from "../content";
import { useIntensity } from "./IntensityContext";

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

/** Visual order: undeniable at top, quiet at bottom. */
const NOTCH_ORDER = [...INTENSITY_LEVELS].reverse();

export function IntensityAxis() {
  const { intensity, setIntensity, label } = useIntensity();
  const trackRef = useRef<HTMLDivElement>(null);
  const notchRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dragging = useRef(false);
  const mobile = useMobileAxis();
  const [thumbStyle, setThumbStyle] = useState<CSSProperties>({});

  const syncThumb = useCallback(() => {
    const track = trackRef.current;
    const notch = notchRefs.current[intensity];
    if (!track || !notch) return;
    const tr = track.getBoundingClientRect();
    const nr = notch.getBoundingClientRect();
    if (mobile) {
      const x = nr.left + nr.width / 2 - tr.left;
      setThumbStyle({ left: `${x}px`, top: "50%" });
    } else {
      const y = nr.top + nr.height / 2 - tr.top;
      setThumbStyle({ top: `${y}px`, left: "50%" });
    }
  }, [intensity, mobile]);

  useEffect(() => {
    syncThumb();
    window.addEventListener("resize", syncThumb);
    return () => window.removeEventListener("resize", syncThumb);
  }, [syncThumb]);

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

  return (
    <aside className="intensity-axis" aria-label="Intensity from quiet to undeniable">
      <div className={`intensity-axis__inner${mobile ? " is-mobile" : ""}`}>
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
            <div className="intensity-track__thumb" style={thumbStyle} />
          </div>

          <ol className="intensity-notches">
            {NOTCH_ORDER.map((level, vi) => {
              const i = INTENSITY_MAX - vi;
              return (
                <li key={level.label}>
                  <button
                    ref={(el) => {
                      notchRefs.current[i] = el;
                    }}
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
              );
            })}
          </ol>
        </div>
      </div>
    </aside>
  );
}
