import { useEffect, useRef, useState, type CSSProperties } from "react";
import { INTENSITY_MAX, INTENSITY_MIN } from "../content";
import { useIntensity } from "./IntensityContext";

/**
 * How much wheel travel spends one tone.
 *
 * Trackpads and mice fire a stream of small deltas per gesture, so movement is
 * banked and spent a tone at a time. Acting on every event let one flick run
 * the sentence from quiet to undeniable and back.
 */
const WHEEL_STEP = 58;

/**
 * The tone control: one bar you scrub, nonchalant at one end and try hard at
 * the other.
 *
 * It is a native range input under the paint, which is most of why this file is
 * short. Dragging the thumb, clicking anywhere along the rail, arrow keys,
 * Home/End, touch, and the value announcements all arrive with the input; a
 * hand-rolled pointer-tracking div would have had to earn every one of those
 * back, and would still not be a slider to a screen reader.
 *
 * What it deliberately has not got: a numeric readout, and the old pair of
 * arrowed steppers whose weight and ink encoded how much headroom was left in
 * each direction. The thumb's position says where you are, which is all that
 * readout was for, and the sentence above is already showing you the result.
 */
export function IntensityAxis() {
  const { intensity, setIntensity, label } = useIntensity();
  const [touched, setTouched] = useState(false);
  const firstRender = useRef(true);
  const trackRef = useRef<HTMLSpanElement>(null);
  const banked = useRef(0);

  // Any change retires the idle hint for good, including one that did not come
  // from a hand on this bar.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setTouched(true);
  }, [intensity]);

  /*
   * Scrubbing by scroll, which the input will not do on its own. Bound by hand
   * rather than through onWheel because React's synthetic wheel handler is
   * passive: preventDefault inside it warns and does nothing, and without it
   * the gesture can bounce the page behind the bar.
   */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Sideways intent wins where there is any, that being the axis the bar
      // lies along; otherwise an ordinary vertical wheel drives it.
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!delta) return;
      e.preventDefault();

      // A reversal starts its own gesture, so the bank does not have to be paid
      // off before the bar will turn around.
      if (Math.sign(delta) !== Math.sign(banked.current)) banked.current = 0;
      banked.current += delta;
      if (Math.abs(banked.current) < WHEEL_STEP) return;

      // One tone per crossing, and the bank is emptied rather than debited: a
      // single event can carry hundreds of pixels of momentum, and spending all
      // of it at once would teleport the sentence several tones on one flick.
      // Sustained scrolling still walks along, a tone per WHEEL_STEP.
      const dir = Math.sign(banked.current);
      banked.current = 0;
      setIntensity(intensity + dir);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [intensity, setIntensity]);

  const span = INTENSITY_MAX - INTENSITY_MIN;
  const progress = (intensity - INTENSITY_MIN) / span;

  return (
    <aside className="tone-axis" style={{ "--tone-progress": progress } as CSSProperties}>
      {/* Both ends stay legible; the one you are nearer carries more ink, so the
          pair reads as a position rather than as two buttons. */}
      <span className="tone-axis__end tone-axis__end--down">nonchalant</span>

      <span className="tone-axis__track" ref={trackRef}>
        <span className="tone-axis__notches" aria-hidden="true">
          {Array.from({ length: span + 1 }, (_, i) => (
            <i
              key={i}
              className="tone-axis__notch"
              /* Its own fraction of the way along, worked out here rather than
                 as a division in CSS, so a seventh tone would need no edit to
                 the stylesheet. */
              style={{ "--at": i / span } as CSSProperties}
              data-behind={i <= intensity}
            />
          ))}
        </span>

        <input
          type="range"
          className="tone-axis__input"
          min={INTENSITY_MIN}
          max={INTENSITY_MAX}
          step={1}
          value={intensity}
          aria-label="Tone of the sentence above"
          /* Replaces the bare "3" a range would otherwise announce. */
          aria-valuetext={`${intensity + 1} of ${INTENSITY_MAX + 1} — ${label}`}
          data-idle={!touched}
          onChange={(e) => setIntensity(Number(e.target.value))}
        />
      </span>

      <span className="tone-axis__end tone-axis__end--up">try hard</span>
    </aside>
  );
}
