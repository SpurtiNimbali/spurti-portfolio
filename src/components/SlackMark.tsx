import { useCallback, useEffect, useRef, useState } from "react";
import type { Definition } from "../content";
import { useIntensity } from "./IntensityContext";

const OPEN_DELAY_MS = 120;
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
  onReveal: (definition: Definition | null) => void;
  animate?: boolean;
};

export function SlackMark({ definition, children, onReveal, animate }: Props) {
  const { intensity } = useIntensity();
  const markRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [slideMode, setSlideMode] = useState(false);
  const [boxSize, setBoxSize] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const mark = markRef.current;
    const word = wordRef.current;
    const box = boxRef.current;
    if (!mark || !word || !box) return;
    setBoxSize({ w: word.offsetWidth, h: word.offsetHeight });
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

  const clearOpenTimer = () => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  };

  const show = (immediate = false) => {
    clearOpenTimer();
    measure();
    setHovered(true);
    if (immediate) {
      activeRef.current = true;
      onReveal(definition);
      return;
    }
    openTimer.current = setTimeout(() => {
      activeRef.current = true;
      onReveal(definition);
    }, OPEN_DELAY_MS);
  };

  const hide = () => {
    clearOpenTimer();
    setHovered(false);
    if (!activeRef.current) return;
    activeRef.current = false;
    onReveal(null);
  };

  useEffect(() => () => clearOpenTimer(), []);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!markRef.current?.contains(e.target as Node)) hide();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [definition]);

  const swapClass = animate ? " hero-token--swap" : "";

  return (
    <span
      ref={markRef}
      className="mark squiggle slack-mark"
      onMouseEnter={() => show()}
      onMouseLeave={hide}
      onFocus={() => show()}
      onBlur={hide}
      onClick={(e) => {
        if (!window.matchMedia("(hover: none)").matches) return;
        e.preventDefault();
        if (activeRef.current) hide();
        else show(true);
      }}
      tabIndex={0}
      role="button"
      aria-pressed={activeRef.current}
    >
      <span
        ref={boxRef}
        className="slack-mark__box"
        style={{
          width: boxSize.w ? `${boxSize.w}px` : undefined,
          height: boxSize.h ? `${boxSize.h}px` : undefined,
        }}
      >
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
