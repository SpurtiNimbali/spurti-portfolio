import { useEffect, useState } from "react";
import { ABOUT_PHOTOS } from "../content/aboutPage";

/** How long a photo holds before the next one fades up. */
const HOLD = 4600;

const REDUCED = "(prefers-reduced-motion: reduce)";

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
 * all. The dots say where you are and jump straight to one; the whole frame is
 * also a click target for the next one, which is what the page's "click
 * around" is promising.
 *
 * With reduced motion it does not advance at all and does not cross-fade: the
 * first photo sits there and the dots still work.
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

      <div className="ab-photodots" {...hold}>
        {ABOUT_PHOTOS.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            className={`ab-photodot${i === index ? " is-current" : ""}`}
            aria-label={`Show photo ${i + 1} of ${ABOUT_PHOTOS.length}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </>
  );
}
