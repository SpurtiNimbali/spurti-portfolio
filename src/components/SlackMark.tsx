import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { definitionLabel, type Definition } from "../content";
import { useIntensity } from "./IntensityContext";

const LINE_TOLERANCE = 3;

function canSlideSlack(markEl: HTMLElement, wordEl: HTMLElement): boolean {
  const wordRect = wordEl.getBoundingClientRect();
  if (wordRect.width <= 0) return false;

  const container = markEl.closest(".hero-line") as HTMLElement | null;
  const predicate = markEl.closest(".hero-predicate") as HTMLElement | null;
  if (!container || !predicate) return false;

  const lineTop = wordRect.top;
  const containerRight = container.getBoundingClientRect().right;
  const freeSpace = containerRight - wordRect.right;
  const spaceNeeded = wordRect.width + 12;

  const range = document.createRange();
  range.setStartAfter(markEl);
  range.setEnd(predicate, predicate.childNodes.length);
  const hasSameLineAfter = Array.from(range.getClientRects()).some(
    (rect) => rect.width > 1 && Math.abs(rect.top - lineTop) <= LINE_TOLERANCE,
  );

  return !hasSameLineAfter && freeSpace >= spaceNeeded;
}

function SlackLogo() {
  return (
    <svg className="slack-mark__logo-svg" viewBox="0 0 54 54" aria-hidden="true">
      <path fill="#E01E5A" d="M11.4 22.5a4.5 4.5 0 1 1 0-9h4.5v4.5a4.5 4.5 0 0 1-4.5 4.5Z" />
      <path fill="#36C5F0" d="M13.5 11.4a4.5 4.5 0 1 1 9 0v4.5h-4.5a4.5 4.5 0 0 1-4.5-4.5Z" />
      <path fill="#2EB67D" d="M22.5 42.6a4.5 4.5 0 1 1 0-9h4.5v4.5a4.5 4.5 0 0 1-4.5 4.5Z" />
      <path fill="#ECB22E" d="M42.6 31.5a4.5 4.5 0 1 1-9 0v-4.5h4.5a4.5 4.5 0 0 1 4.5 4.5Z" />
      <path fill="#E01E5A" d="M31.5 42.6a4.5 4.5 0 1 1-4.5-4.5v-4.5h4.5a4.5 4.5 0 0 1 0 9Z" />
      <path fill="#36C5F0" d="M42.6 22.5a4.5 4.5 0 1 1-4.5 4.5h-4.5v-4.5a4.5 4.5 0 0 1 4.5-4.5Z" />
      <path fill="#2EB67D" d="M22.5 11.4a4.5 4.5 0 1 1 4.5 4.5v4.5h-4.5a4.5 4.5 0 0 1-4.5-4.5Z" />
      <path fill="#ECB22E" d="M11.4 31.5a4.5 4.5 0 1 1 4.5-4.5h4.5v4.5a4.5 4.5 0 0 1-4.5 4.5Z" />
    </svg>
  );
}

type Props = {
  definition: Definition;
  children: React.ReactNode;
  onSpawn?: (definition: Definition, at: HTMLElement | null) => void;
  animate?: boolean;
  /** Carries the rewrite stagger down to the crossfading word. */
  beat?: CSSProperties;
};

export function SlackMark({ definition, children, onSpawn, animate, beat }: Props) {
  const { intensity } = useIntensity();
  const markRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [slideMode, setSlideMode] = useState(false);

  const measure = useCallback(() => {
    const mark = markRef.current;
    const word = wordRef.current;
    const box = boxRef.current;
    if (!mark || !word || !box) return;
    setSlideMode(canSlideSlack(mark, word));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, intensity]);

  useEffect(() => {
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [measure, children, intensity]);

  const swapClass = animate ? " hero-token--swap" : "";

  return (
    <span
      ref={markRef}
      className="mark squiggle slack-mark"
      style={beat}
      onMouseEnter={() => {
        measure();
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => {
        measure();
        setHovered(true);
      }}
      onBlur={() => setHovered(false)}
      onClick={(e) => {
        e.preventDefault();
        onSpawn?.(definition, markRef.current);
      }}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        onSpawn?.(definition, markRef.current);
      }}
      tabIndex={0}
      role="button"
      aria-label={definitionLabel(definition)}
    >
      {/* Sized by the word itself: the slide is a transform, so it costs no
          layout, and a reserved pixel size would go stale when the sentence
          refits to a new font size. */}
      <span ref={boxRef} className="slack-mark__box">
        <span
          ref={wordRef}
          className={`slack-mark__word hero-token${swapClass}${hovered ? " is-active" : ""}${slideMode ? " can-slide" : " use-above"}`}
        >
          {children}
        </span>
        <span
          className={`slack-mark__logo${hovered ? " is-visible" : ""}${slideMode ? "" : " is-above"}`}
          aria-hidden="true"
        >
          <SlackLogo />
        </span>
      </span>
    </span>
  );
}
