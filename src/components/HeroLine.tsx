import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  GITHUB_URL,
  GITHUB_USER,
  INTENSITY_LEVELS,
  type Definition,
  type PredicatePart,
} from "../content";
import type { Pinned } from "./HeroOverlay";
import { GitTag, StickerBoard } from "./HeroOverlay";
import { IntensityAxis } from "./IntensityAxis";
import { useIntensity } from "./IntensityContext";
import { DefinitionMark } from "./DefinitionMark";
import { SlackMark } from "./SlackMark";
import { StanfordMark } from "./StanfordMark";
import { printsFor } from "../lib/stickers";

function partKey(part: PredicatePart) {
  return `${part.text}|${part.mark ?? ""}|${part.definition?.entity ?? ""}`;
}

function partsChanged(prev: PredicatePart[], next: PredicatePart[]) {
  if (prev.length !== next.length) return next.map(() => true);
  return next.map((part, i) => partKey(part) !== partKey(prev[i]));
}

/**
 * A mark ending in an inline logo opens a break opportunity, which can strand the
 * sentence's final period on a line of its own. Bind the two together.
 */
function bindTail(nodes: ReactNode[], parts: PredicatePart[]) {
  const last = parts.length - 1;
  if (last < 1 || parts[last].mark || !/^[.!?…]+$/.test(parts[last].text)) return nodes;
  if (!parts[last - 1].mark) return nodes;
  return [
    ...nodes.slice(0, last - 1),
    <span key="tail" className="hero-nowrap">
      {nodes[last - 1]}
      {nodes[last]}
    </span>,
  ];
}

function renderPart(
  part: PredicatePart,
  animate: boolean,
  index: number,
  onSpawn: (definition: Definition, at: HTMLElement | null) => void,
  stagger: number,
) {
  const swapClass = animate ? " hero-token--swap" : "";
  // Inherited by whichever inner span carries the crossfade.
  const beat = animate ? ({ "--i": stagger } as CSSProperties) : undefined;

  if (part.mark === "squiggle" && part.definition) {
    if (part.text === "Slack") {
      return (
        <SlackMark
          key={index}
          definition={part.definition}
          onSpawn={onSpawn}
          animate={animate}
          beat={beat}
        >
          {part.text}
        </SlackMark>
      );
    }
    if (part.text === "Stanford") {
      return (
        <StanfordMark
          key={index}
          definition={part.definition}
          onSpawn={onSpawn}
          beat={beat}
        >
          <span className={`hero-token${swapClass}`}>{part.text}</span>
        </StanfordMark>
      );
    }
    return (
      <DefinitionMark
        key={index}
        definition={part.definition}
        onSpawn={onSpawn}
        beat={beat}
      >
        <span className={`hero-token${swapClass}`}>{part.text}</span>
      </DefinitionMark>
    );
  }

  return (
    <span key={index} className={`hero-token${swapClass}`} style={beat}>
      {part.text}
    </span>
  );
}

const FIT_MIN_PX = 18;
const FIT_PASSES = 11;
const FIT_MARGIN_PX = 3;

/** The shared gesture length, read from CSS so there is one source of truth. */
function shiftMs(el: HTMLElement) {
  const raw = getComputedStyle(el).getPropertyValue("--hero-shift").trim();
  const ms = raw.endsWith("ms") ? parseFloat(raw) : parseFloat(raw) * 1000;
  return Number.isFinite(ms) ? ms : 300;
}

/**
 * The sentence box is a fixed height, so changing intensity must never reflow the
 * page. Instead we binary-search a font size that fits the new copy into that box.
 */
function useFitToBox(deps: unknown[]) {
  const boxRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;

    // The Slack mark reserves its box from a measurement, so a size taken mid
    // search can be stale. Checking width as well catches an unbreakable group
    // (a mark bound to its punctuation) running past the edge.
    // A size whose last line ends flush with the limit sits on a wrap boundary,
    // where a sub-pixel shift costs a whole extra line. Search with headroom.
    const spills = (margin = 0) =>
      text.scrollHeight > box.clientHeight - margin + 0.5 ||
      text.scrollWidth > box.clientWidth + 0.5;

    /** Settle the size with the transition suppressed, then let it ease there. */
    const commit = (from: number, target: number) => {
      box.style.setProperty("--hero-fs", `${from}px`);
      void box.offsetHeight;
      delete box.dataset.fitting;
      void box.offsetHeight;
      box.style.setProperty("--hero-fs", `${target}px`);
    };

    const fit = () => {
      const before = parseFloat(getComputedStyle(box).fontSize);
      // Every probe below reads layout, so the size must not be mid-flight.
      box.dataset.fitting = "on";
      box.style.removeProperty("--hero-fs");
      const cap = parseFloat(getComputedStyle(box).fontSize);
      if (!box.clientHeight || !Number.isFinite(cap)) {
        delete box.dataset.fitting;
        return;
      }

      let lo = FIT_MIN_PX;
      let hi = cap;
      let best = FIT_MIN_PX;

      for (let i = 0; i < FIT_PASSES; i++) {
        const mid = (lo + hi) / 2;
        box.style.setProperty("--hero-fs", `${mid}px`);
        if (!spills(FIT_MARGIN_PX)) {
          best = mid;
          lo = mid;
        } else {
          hi = mid;
        }
      }

      // The search can land exactly on a wrap boundary, so step off it before
      // committing — all still with the transition suppressed, so the size is
      // written to the DOM exactly once and eases just the once.
      let size = Math.min(best, cap);
      for (let i = 0; i < 10 && size > FIT_MIN_PX && spills(); i++) {
        size = Math.max(FIT_MIN_PX, size * 0.97);
        box.style.setProperty("--hero-fs", `${size}px`);
      }

      commit(Number.isFinite(before) ? before : cap, size);
    };

    /**
     * Marks settle their own layout a beat after the size lands, which can tip a
     * borderline size over the cliff. Re-measure once things are still and only
     * write a new size if one is actually needed.
     */
    const verify = () => {
      const from = parseFloat(box.style.getPropertyValue("--hero-fs"));
      if (!Number.isFinite(from)) return;
      box.dataset.fitting = "on";
      void box.offsetHeight;
      let size = from;
      for (let i = 0; i < 10 && size > FIT_MIN_PX && spills(); i++) {
        size = Math.max(FIT_MIN_PX, size * 0.97);
        box.style.setProperty("--hero-fs", `${size}px`);
      }
      if (size === from) {
        delete box.dataset.fitting;
        return;
      }
      commit(from, size);
    };

    fit();
    const raf = requestAnimationFrame(fit);
    // Verify only once the size has finished easing, so these read a settled
    // layout rather than a frame partway through the transition.
    const settled = shiftMs(box);
    const checks = [settled + 80, settled + 300, settled + 640].map((ms) =>
      setTimeout(verify, ms),
    );

    window.addEventListener("resize", fit);
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.addEventListener("loadingdone", fit);

    return () => {
      cancelAnimationFrame(raf);
      checks.forEach(clearTimeout);
      window.removeEventListener("resize", fit);
      fonts?.removeEventListener("loadingdone", fit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { boxRef, textRef };
}

export function HeroLine() {
  const { intensity } = useIntensity();
  const level = INTENSITY_LEVELS[intensity];
  const [nameHover, setNameHover] = useState(false);
  // The handle is an overlay now, so the swap costs no layout and needs no refit.
  const { boxRef, textRef } = useFitToBox([intensity]);
  const prevPartsRef = useRef<PredicatePart[]>(level.parts);
  const prevIntensityRef = useRef<number | null>(null);
  const [pinned, setPinned] = useState<Pinned[]>([]);
  const nameRef = useRef<HTMLAnchorElement>(null);
  const nextId = useRef(1);

  /**
   * A click dumps every photo in that word's list (same rule for Simba,
   * Stanford, Slack — capped at four). Hover never spawns. Further clicks
   * wiggle what's already out.
   */
  const handleSpawn = (definition: Definition, at: HTMLElement | null) => {
    const key = definition.sticker;
    if (!key || !at) return;
    const from = at.getBoundingClientRect();
    const queue = printsFor(key);
    setPinned((prev) => {
      const existing = prev.filter((p) => p.key === key);
      if (existing.length >= queue.length) {
        return prev.map((p) => (p.key === key ? { ...p, nudge: p.nudge + 1 } : p));
      }
      const start = existing.length;
      const added = queue.slice(start).map((_, i) => ({
        id: nextId.current++,
        key,
        printIndex: start + i,
        from,
        nudge: 0,
      }));
      return [...prev, ...added];
    });
  };

  const animateFlags = useMemo(() => {
    if (prevIntensityRef.current === null) {
      prevIntensityRef.current = intensity;
      prevPartsRef.current = level.parts;
      return level.parts.map(() => false);
    }
    if (prevIntensityRef.current === intensity) {
      return level.parts.map(() => false);
    }
    const flags = partsChanged(prevPartsRef.current, level.parts);
    prevPartsRef.current = level.parts;
    prevIntensityRef.current = intensity;
    return flags;
  }, [intensity, level.parts]);

  // Only the changed words are staggered, and only against each other, so the
  // rewrite reads left to right however few words actually differ.
  const staggerOrder = useMemo(() => {
    let n = 0;
    return animateFlags.map((changed) => (changed ? n++ : 0));
  }, [animateFlags]);

  /**
   * A tone change re-wraps the lines, which is a discrete jump. Marking the box
   * for the length of the gesture lets the whole sentence soften and settle over
   * the same beat as the size and the word crossfades, so the re-wrap lands
   * inside one movement instead of snapping on its own.
   */
  const [rewriting, setRewriting] = useState(false);
  useEffect(() => {
    if (prevIntensityRef.current === null) return;
    setRewriting(true);
    const box = boxRef.current;
    const timer = setTimeout(() => setRewriting(false), box ? shiftMs(box) + 40 : 340);
    return () => clearTimeout(timer);
  }, [intensity, boxRef]);

  return (
    <div className="hero-wrap">
      {/* Latched on the sentence, not the link: the longer handle slides out
          under the cursor, and releasing here is what stops the swap oscillating. */}
      <h1
        ref={boxRef}
        className="hero-line"
        aria-live="polite"
        data-rewriting={rewriting || undefined}
        onPointerLeave={() => setNameHover(false)}
      >
        <span ref={textRef} className="hero-line__fit">
          <a
            ref={nameRef}
            className="hero-name"
            data-swapped={nameHover}
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={`Spurti — GitHub, @${GITHUB_USER}`}
            onPointerEnter={() => setNameHover(true)}
            onFocus={() => setNameHover(true)}
            onBlur={() => setNameHover(false)}
          >
            {/* In flow, so it keeps defining the sentence's geometry. */}
            <span className="hero-name__word">Spurti</span>
            {/* Out of flow, so showing it costs nothing and refits nothing. */}
            <span className="hero-name__handle" aria-hidden="true">
              @{GITHUB_USER}
              <span className="hero-name__wink"> :&#125;</span>
            </span>
          </a>{" "}
          <span className="hero-predicate">
            {bindTail(
              level.parts.map((part, i) =>
                renderPart(part, animateFlags[i], i, handleSpawn, staggerOrder[i]),
              ),
              level.parts,
            )}
          </span>
        </span>
      </h1>
      <StickerBoard pinned={pinned} onClear={() => setPinned([])} />
      <GitTag target={nameHover ? nameRef.current : null} />
      <IntensityAxis inline />
    </div>
  );
}
