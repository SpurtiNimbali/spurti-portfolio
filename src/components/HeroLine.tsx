import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
function shiftMs(el: HTMLElement | null) {
  if (!el) return 300;
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

  // Before paint, not after: an effect here would let the browser show the new
  // copy at the old size for a frame or two first.
  useLayoutEffect(() => {
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

    /**
     * Settle the size with the transition suppressed, then either let it ease to
     * the target or land on it outright. Landing outright is right when the copy
     * has just changed, because the sentence is cleared at that moment — easing
     * there would mean easing down from a size the new copy overflows.
     */
    const commit = (from: number, target: number, animate: boolean) => {
      if (!animate) {
        box.style.setProperty("--hero-fs", `${target}px`);
        void box.offsetHeight;
        delete box.dataset.fitting;
        return;
      }
      box.style.setProperty("--hero-fs", `${from}px`);
      void box.offsetHeight;
      delete box.dataset.fitting;
      void box.offsetHeight;
      box.style.setProperty("--hero-fs", `${target}px`);
    };

    const fit = (animate = true) => {
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

      commit(Number.isFinite(before) ? before : cap, size, animate);
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
      commit(from, size, true);
    };

    // Before paint and without easing: the copy has just changed, so the size
    // must be right the first time it is drawn or the new line renders at the
    // old size and spills out of the box.
    fit(false);
    const raf = requestAnimationFrame(() => fit(true));
    // Verify only once the size has finished easing, so these read a settled
    // layout rather than a frame partway through the transition.
    const settled = shiftMs(box);
    const checks = [settled + 80, settled + 300, settled + 640].map((ms) =>
      setTimeout(verify, ms),
    );

    const onReflow = () => fit(true);
    window.addEventListener("resize", onReflow);
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.addEventListener("loadingdone", onReflow);

    return () => {
      cancelAnimationFrame(raf);
      checks.forEach(clearTimeout);
      window.removeEventListener("resize", onReflow);
      fonts?.removeEventListener("loadingdone", onReflow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { boxRef, textRef };
}

export function HeroLine() {
  const { intensity } = useIntensity();
  // Visible copy lags one out-beat behind `intensity` so the sentence can
  // clear, swap while it is gone, then settle — the CSS keys off data-phase.
  const [shown, setShown] = useState(intensity);
  const shownRef = useRef(intensity);
  const [phase, setPhase] = useState<"out" | "in" | undefined>();
  const level = INTENSITY_LEVELS[shown];
  const [nameHover, setNameHover] = useState(false);
  // Fit only on tone, never on the name swap: the handle takes real space and
  // the following words slide. A font-size jump on hover is the thing to avoid.
  const { boxRef, textRef } = useFitToBox([shown]);
  const prevPartsRef = useRef<PredicatePart[]>(level.parts);
  const prevIntensityRef = useRef<number | null>(null);
  const [pinned, setPinned] = useState<Pinned[]>([]);
  const nameRef = useRef<HTMLAnchorElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const handleRef = useRef<HTMLSpanElement>(null);
  const nextId = useRef(1);

  /**
   * At rest the box is `width: auto` — just "Spurti", no reserved slot. On
   * hover we lock a pixel width so the following words can ease over by the
   * handle's real size. Measuring inside the sentence keeps em / letter-spacing
   * honest; locking at rest was clipping the name after a refit.
   */
  useLayoutEffect(() => {
    const name = nameRef.current;
    const word = wordRef.current;
    const handle = handleRef.current;
    const host = boxRef.current;
    if (!name || !word || !handle || !host) return;

    const measure = (el: HTMLElement) => {
      const probe = el.cloneNode(true) as HTMLElement;
      probe.setAttribute("aria-hidden", "true");
      probe.style.cssText = [
        "position:absolute",
        "left:0",
        "top:0",
        "visibility:hidden",
        "pointer-events:none",
        "display:inline-block",
        "width:max-content",
        "max-width:none",
        "min-width:0",
        "flex:none",
        "overflow:visible",
        "opacity:1",
      ].join(";");
      host.appendChild(probe);
      const w = probe.getBoundingClientRect().width;
      probe.remove();
      return Math.ceil(w);
    };

    if (!nameHover) {
      if (!name.style.width) return;
      const from = name.getBoundingClientRect().width;
      name.style.width = `${from}px`;
      void name.offsetWidth;
      name.style.width = `${measure(word)}px`;
      const timer = window.setTimeout(() => {
        const live = nameRef.current;
        if (live && live.getAttribute("data-swapped") !== "true") {
          live.style.width = "";
        }
      }, shiftMs(name) + 24);
      return () => window.clearTimeout(timer);
    }

    const from = name.getBoundingClientRect().width;
    const to = measure(handle);
    name.style.width = `${from > 1 ? from : measure(word)}px`;
    void name.offsetWidth;
    name.style.width = `${to}px`;
  }, [nameHover, intensity, boxRef]);

  /**
   * One photo per click, same rule for every word. The list is capped at four;
   * further clicks wiggle what's already out.
   */
  const handleSpawn = (definition: Definition, at: HTMLElement | null) => {
    const key = definition.sticker;
    if (!key || !at) return;
    const from = at.getBoundingClientRect();
    const queue = printsFor(key);
    setPinned((prev) => {
      const count = prev.filter((p) => p.key === key).length;
      if (count >= queue.length) {
        return prev.map((p) => (p.key === key ? { ...p, nudge: p.nudge + 1 } : p));
      }
      return [...prev, { id: nextId.current++, key, printIndex: count, from, nudge: 0 }];
    });
  };

  const animateFlags = useMemo(() => {
    if (prevIntensityRef.current === null) {
      prevIntensityRef.current = shown;
      prevPartsRef.current = level.parts;
      return level.parts.map(() => false);
    }
    if (prevIntensityRef.current === shown) {
      return level.parts.map(() => false);
    }
    const flags = partsChanged(prevPartsRef.current, level.parts);
    prevPartsRef.current = level.parts;
    prevIntensityRef.current = shown;
    return flags;
  }, [shown, level.parts]);

  // Only the changed words are staggered, and only against each other, so the
  // rewrite reads left to right however few words actually differ.
  const staggerOrder = useMemo(() => {
    let n = 0;
    return animateFlags.map((changed) => (changed ? n++ : 0));
  }, [animateFlags]);

  /**
   * Out, then swap, then in — all on --hero-shift / --hero-ease. The new copy
   * is written while the sentence is at opacity 0 so there is no empty flash
   * and no snap of overflowing text. The box height never changes.
   */
  useEffect(() => {
    if (shownRef.current === intensity) {
      setPhase(undefined);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shownRef.current = intensity;
      setShown(intensity);
      setPhase(undefined);
      return;
    }
    const total = shiftMs(boxRef.current);
    const outMs = Math.round(total * 0.42);
    const inMs = Math.round(total * 0.58);
    setPhase("out");
    const swap = window.setTimeout(() => {
      shownRef.current = intensity;
      setShown(intensity);
      setPhase("in");
    }, outMs);
    const done = window.setTimeout(() => setPhase(undefined), outMs + inMs);
    return () => {
      window.clearTimeout(swap);
      window.clearTimeout(done);
    };
  }, [intensity, boxRef]);

  return (
    <div className="hero-wrap">
      {/* Latched on the sentence, not the link: the longer handle slides out
          under the cursor, and releasing here is what stops the swap oscillating. */}
      <h1
        ref={boxRef}
        className="hero-line"
        aria-live="polite"
        data-phase={phase}
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
            <span ref={wordRef} className="hero-name__word">
              Spurti
            </span>
            <span ref={handleRef} className="hero-name__handle" aria-hidden="true">
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
