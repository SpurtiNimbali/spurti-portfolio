import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ABOUT_PHOTOS } from "../content/aboutPage";

/** How long a photo holds before the next one fades up. */
const HOLD = 4600;

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * A glyph per photograph, keyed by `ABOUT_PHOTOS[].id`.
 *
 * Drawn as filled silhouettes on a 20px grid, because these render at about
 * 15px over a photograph — an outline at that size against arbitrary pixels
 * disappears, and a solid shape does not. Each one is the subject of its own
 * photo rather than a generic marker, which is the whole reason the control bar
 * is worth having icons at all: you can tell which photo you are going to.
 */
const PHOTO_ICONS: Record<string, ReactNode> = {
  paragliders: (
    <>
      <path d="M10 3.5c3.35 0 6.3 1.65 7.95 4.2-2.15-1.15-4.3-1.6-6.25-1.35L10 10.1 8.3 6.35c-1.95-.25-4.1.2-6.25 1.35C3.7 5.15 6.65 3.5 10 3.5z" />
      <path d="M9.4 10.3h1.2v2.6H9.4z" />
      <path d="M10 16.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5z" />
    </>
  ),
  hightea: (
    <>
      <path d="M4 7.6h9.2v2.6a4.6 4.6 0 01-9.2 0z" />
      <path d="M13.9 8.4h.9a2 2 0 010 4h-.55v-1.4h.55a.6.6 0 000-1.2h-.9z" />
      <path d="M3.4 14.3h10.5a.7.7 0 010 1.4H3.4a.7.7 0 010-1.4z" />
    </>
  ),
  friends: (
    <>
      <path d="M7.5 8.5a2.55 2.55 0 110-5.1 2.55 2.55 0 010 5.1z" />
      <path d="M7.5 9.9c2.65 0 4.8 1.8 4.8 4v2.3H2.7v-2.3c0-2.2 2.15-4 4.8-4z" />
      <path d="M13.2 9a2.15 2.15 0 110-4.3 2.15 2.15 0 010 4.3z" />
      <path d="M13.2 10.4c1.95 0 3.5 1.4 3.5 3.2v2.6h-3.2v-2.3c0-1.25-.45-2.4-1.25-3.3.3-.13.62-.2.95-.2z" />
    </>
  ),
  childhood: (
    <>
      <path d="M6.3 5.6a2.05 2.05 0 110-4.1 2.05 2.05 0 010 4.1z" />
      <path d="M13.7 5.6a2.05 2.05 0 110-4.1 2.05 2.05 0 010 4.1z" />
      <path d="M10 15.6c-3.25 0-5.75-2.25-5.75-5.1S6.75 5.4 10 5.4s5.75 2.25 5.75 5.1-2.5 5.1-5.75 5.1z" />
    </>
  ),
};

/**
 * The photos card's carousel.
 *
 * This replaced a tabbed switcher — four labelled icon tabs over four sets. The
 * labels were doing work the photographs don't need: these are not categories,
 * they are four moments, so the card just cycles through them.
 *
 * It advances on its own about every four and a half seconds, the way a photo
 * widget does, and holds while the pointer or the keyboard is inside the card —
 * a photo that swaps out while you are looking at it is worse than no motion at
 * all. The icon bar says where you are and jumps straight to one; the whole
 * frame is also a click target for the next one, which is what the page's
 * "click around" is promising.
 *
 * With reduced motion it does not advance at all and does not cross-fade: the
 * first photo sits there and the icons still work.
 *
 * Every photograph is in the DOM at once, stacked and cross-faded on opacity.
 * That is what keeps the frame from flashing empty on the first cycle, and it
 * means each `alt` is exposed in order rather than swapping under a reader.
 */
export function AboutPhotos() {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [still, setStill] = useState(
    () => typeof window !== "undefined" && window.matchMedia(REDUCED).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(REDUCED);
    const sync = () => setStill(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Keyed on index, so a click resets the clock rather than leaving a photo you
  // just chose to be replaced a moment later.
  useEffect(() => {
    if (still || held || ABOUT_PHOTOS.length < 2) return;
    const t = window.setTimeout(
      () => setIndex((i) => (i + 1) % ABOUT_PHOTOS.length),
      HOLD,
    );
    return () => clearTimeout(t);
  }, [index, still, held]);

  const hold = {
    onPointerEnter: () => setHeld(true),
    onPointerLeave: () => setHeld(false),
    onFocus: () => setHeld(true),
    onBlur: () => setHeld(false),
  };

  return (
    <>
      <div className="ab-photo">
        {ABOUT_PHOTOS.map((photo, i) => (
          <img
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            className={i === index ? "is-current" : ""}
            style={{ objectPosition: photo.focus }}
          />
        ))}

        {/* Transparent, over the photographs and under the dots. A button
            rather than a click handler on the frame so it is reachable by
            keyboard and announces what it does. */}
        <button
          type="button"
          className="ab-photo__advance"
          aria-label="Show the next photo"
          onClick={() => setIndex((i) => (i + 1) % ABOUT_PHOTOS.length)}
          {...hold}
        />
      </div>

      <div className="ab-photonav" {...hold}>
        {ABOUT_PHOTOS.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            className={`ab-photonav__btn${i === index ? " is-current" : ""}`}
            aria-label={photo.label}
            title={photo.label}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              {PHOTO_ICONS[photo.id]}
            </svg>
          </button>
        ))}
      </div>
    </>
  );
}
