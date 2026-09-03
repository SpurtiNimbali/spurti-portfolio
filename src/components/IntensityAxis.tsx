import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { INTENSITY_MAX, INTENSITY_MIN } from "../content";
import { useIntensity } from "./IntensityContext";

/**
 * How much wheel travel spends one tone, in CSS pixels once deltaMode has been
 * normalised away.
 *
 * Sized so a mouse spends exactly one tone per notch on either engine: Chrome
 * reports a notch as 100 pixels, Firefox as three lines, which is 48 pixels
 * here. A trackpad sends a stream of much smaller deltas instead, so movement
 * is banked and spent a tone at a time — acting on every event let one flick
 * run the sentence from quiet to undeniable and back.
 */
const WHEEL_STEP = 44;

/**
 * What a line and a page are worth. Firefox reports a mouse notch as three
 * lines where Chrome reports the same notch as a hundred pixels, so a line is a
 * third of that rather than a line of text — the point is that one notch of one
 * physical wheel spends one tone on either engine.
 */
const WHEEL_LINE_PX = 100 / 3;
const WHEEL_PAGE_PX = 400;

/**
 * Quiet for this long and the next event begins a fresh gesture. Two deliberate
 * flicks are further apart than this; the events within one are far closer.
 */
const WHEEL_GESTURE_GAP_MS = 140;

/**
 * The most one unbroken gesture may spend. There are only six tones and the
 * thing you are actually reading is the sentence, so no single flick should be
 * able to cross the whole scale — a trackpad hands over a thousand pixels for
 * one hard swipe, most of it momentum the platform does not label as such.
 * Bounding the gesture rather than sniffing the device keeps one rule for the
 * wheel, the trackpad and whatever comes next; pause for a moment and the next
 * flick carries on from where this one stopped.
 */
const WHEEL_GESTURE_MAX = 3;

/**
 * How long the marker takes to fall onto the nearest graduation once you let
 * go. Long enough to read as a settle, short enough that the bar is not
 * finishing the gesture on your behalf.
 */
const SETTLE_MS = 190;

/**
 * Close enough to --pw-spring to belong to the same family: an ease-out with
 * about three percent of overshoot. The snap never travels more than half a
 * tone, so that overshoot is well under a pixel — it reads as weight rather
 * than as a bounce, which at this distance would just look like a twitch.
 */
function settleEase(t: number) {
  const u = t - 1;
  return 1 + 1.9 * u * u * u + 0.9 * u * u;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The tone control: one bar you scrub, nonchalant at one end and try hard at
 * the other.
 *
 * It is a native range input under the paint, which is most of why this file is
 * short. Clicking anywhere along the rail, touch, focus, and the value
 * announcements all arrive with the input; a hand-rolled pointer-tracking div
 * would have had to earn every one of those back, and would still not be a
 * slider to a screen reader.
 *
 * The one thing the native control cannot do for us is stop on tones while
 * still following your finger, so the input's step is a thousandth and the tone
 * is derived by rounding. That buys a marker that tracks the pointer exactly,
 * at the cost of two things that have to be put back by hand: arrow keys would
 * otherwise move a thousandth at a time, so keydown is intercepted and moves
 * whole tones, and the announcement is pinned to the rounded tone so a screen
 * reader never hears a fraction.
 *
 * What it deliberately has not got: a numeric readout, and the old pair of
 * arrowed steppers whose weight and ink encoded how much headroom was left in
 * each direction. The marker's position says where you are, which is all that
 * readout was for, and the sentence above is already showing you the result.
 */
export function IntensityAxis() {
  const { intensity, setIntensity, label } = useIntensity();
  const [touched, setTouched] = useState(false);
  /*
   * Where the marker actually is while a hand is on it, as a fraction of a
   * tone; null whenever it is resting on a graduation. The rest of the file
   * treats `intensity` as the tone and this as the position, which are the same
   * number everywhere except mid-gesture.
   */
  const [scrub, setScrub] = useState<number | null>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const firstRender = useRef(true);
  const trackRef = useRef<HTMLSpanElement>(null);
  const scrubRef = useRef<number | null>(null);
  // The input fires its change during the same gesture that set the state
  // above, so the handler reads the ref rather than a value from a render that
  // may not have happened yet.
  const scrubbingRef = useRef(false);
  const settleRaf = useRef(0);

  // Read inside listeners that are bound once, so a wheel gesture is not
  // interrupted by a rebind every time the tone changes underneath it.
  const latest = useRef({ intensity, setIntensity });
  latest.current = { intensity, setIntensity };

  // Any change retires the idle hint for good, including one that did not come
  // from a hand on this bar.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setTouched(true);
  }, [intensity]);

  useEffect(() => () => cancelAnimationFrame(settleRaf.current), []);

  const stopSettle = () => {
    cancelAnimationFrame(settleRaf.current);
    settleRaf.current = 0;
  };

  /** Put the marker back on a graduation, and stop pretending it is being held. */
  const release = (to: number | null) => {
    stopSettle();
    scrubRef.current = to;
    scrubbingRef.current = false;
    setScrub(to);
    setScrubbing(false);
  };

  /*
   * Letting go drops the marker onto the nearest graduation. It has to be
   * animated here rather than in CSS because the marker is the input's own
   * thumb and its position is the value: there is nothing for a transition to
   * interpolate. Snapping outright would be the one moment in the gesture that
   * jumps, having spent the whole drag not jumping.
   */
  const settle = () => {
    const from = scrubRef.current;
    if (from === null) {
      setScrubbing(false);
      return;
    }
    const to = Math.round(from);
    latest.current.setIntensity(to);
    scrubbingRef.current = false;
    setScrubbing(false);
    if (prefersReducedMotion() || Math.abs(to - from) < 0.002) {
      release(null);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = (now - start) / SETTLE_MS;
      if (t >= 1) {
        release(null);
        return;
      }
      const at = from + (to - from) * settleEase(t);
      scrubRef.current = at;
      setScrub(at);
      settleRaf.current = requestAnimationFrame(step);
    };
    settleRaf.current = requestAnimationFrame(step);
  };

  const onPointerDown = (e: PointerEvent<HTMLInputElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    stopSettle();
    setTouched(true);
    scrubbingRef.current = true;
    setScrubbing(true);
    // On window rather than on the input: a drag that ends with the pointer off
    // the bar, or one the browser cancels, still has to land on a tone.
    const end = () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      settle();
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const at = Number(e.target.value);
    const tone = Math.round(at);
    if (tone !== latest.current.intensity) latest.current.setIntensity(tone);
    // Anything that moved the value without a pointer on it has no gesture to
    // settle, so it lands on the tone directly rather than leaving the marker
    // stranded between two graduations.
    if (!scrubbingRef.current) return;
    scrubRef.current = at;
    setScrub(at);
  };

  /*
   * Whole tones per press, which the input can no longer do for itself: its
   * step is a thousandth so that dragging is continuous, and a thousandth is
   * not a keystroke anyone wants. Page keys are caught for the same reason —
   * left alone they would move a hundredth.
   */
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const from = latest.current.intensity;
    let to: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === "PageDown") to = from - 1;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "PageUp") to = from + 1;
    else if (e.key === "Home") to = INTENSITY_MIN;
    else if (e.key === "End") to = INTENSITY_MAX;
    if (to === null) return;
    e.preventDefault();
    release(null);
    setTouched(true);
    setIntensity(to);
  };

  /*
   * Scrubbing by scroll, which the input will not do on its own. Bound by hand
   * rather than through onWheel because React's synthetic wheel handler is
   * passive: preventDefault inside it warns and does nothing, and without it
   * the gesture can bounce the page behind the bar.
   */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const gesture = { at: 0, dir: 0, bank: 0, spent: 0 };

    const onWheel = (e: WheelEvent) => {
      // Sideways intent wins where there is any, that being the axis the bar
      // lies along; otherwise an ordinary vertical wheel drives it.
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!raw) return;
      e.preventDefault();

      // Firefox reports mouse wheels in lines and some setups in pages. Left
      // unconverted a Firefox notch is a deltaY of 3, which against a threshold
      // measured in pixels means the bar barely moves at all.
      const unit = e.deltaMode === 1 ? WHEEL_LINE_PX : e.deltaMode === 2 ? WHEEL_PAGE_PX : 1;
      const delta = raw * unit;
      const dir = Math.sign(delta);

      // A pause or a reversal starts its own gesture, so the bank does not have
      // to be paid off before the bar will turn around.
      if (e.timeStamp - gesture.at > WHEEL_GESTURE_GAP_MS || dir !== gesture.dir) {
        gesture.dir = dir;
        gesture.bank = 0;
        gesture.spent = 0;
      }
      gesture.at = e.timeStamp;
      if (gesture.spent >= WHEEL_GESTURE_MAX) return;

      gesture.bank += delta;
      if (Math.abs(gesture.bank) < WHEEL_STEP) return;

      // One tone per crossing, and the bank is emptied rather than debited: a
      // single event can carry hundreds of pixels of momentum, and spending all
      // of it at once would teleport the sentence several tones on one flick.
      // Sustained scrolling still walks along, a tone per WHEEL_STEP.
      const step = Math.sign(gesture.bank);
      gesture.bank = 0;
      gesture.spent += 1;
      setTouched(true);
      // A wheel step is a discrete change like a keypress, so it gets the
      // sprung fill rather than the drag's direct one.
      release(null);
      latest.current.setIntensity(latest.current.intensity + step);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const span = INTENSITY_MAX - INTENSITY_MIN;
  const at = scrub ?? intensity;
  const progress = (at - INTENSITY_MIN) / span;

  return (
    <aside
      className="tone-axis"
      style={{ "--tone-progress": progress } as CSSProperties}
      /* The fill is transitioned so a click or a keypress lands with some
         spring in it, which during a drag would mean the paint trailing the
         thing under your finger. Held here rather than only while the pointer
         is down, because the settle is animated frame by frame and would fight
         a transition just as badly. */
      data-scrubbing={scrubbing || scrub !== null ? "true" : undefined}
    >
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
              /* Against the marker's position, not the tone: a graduation goes
                 dark the moment the fill reaches it, which is a thing you can
                 see, rather than at the halfway point where the sentence
                 changes. */
              data-behind={i <= at}
            />
          ))}
        </span>

        <input
          type="range"
          className="tone-axis__input"
          min={INTENSITY_MIN}
          max={INTENSITY_MAX}
          /* Fine enough to sit wherever the pointer is. The six graduations are
             a promise that the sentence changes at fixed levels, so the value
             is rounded for everything anyone can read and snapped back onto a
             tone the moment you let go — nothing ever comes to rest between
             two marks. */
          step={0.001}
          value={at}
          aria-label="Tone of the sentence above"
          /* Both pinned to the tone rather than to the position: mid-drag the
             value is a fraction, and no one needs to hear 3.418. */
          aria-valuenow={intensity}
          aria-valuetext={`${intensity + 1} of ${INTENSITY_MAX + 1} — ${label}`}
          data-idle={!touched}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
          onChange={onChange}
        />
      </span>

      <span className="tone-axis__end tone-axis__end--up">try hard</span>
    </aside>
  );
}
