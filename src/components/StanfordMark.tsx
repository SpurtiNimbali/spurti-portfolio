import { useEffect, useRef } from "react";
import type { Definition } from "../content";
import { useHoverEffects } from "./HoverEffectsContext";

const OPEN_DELAY_MS = 120;

type Props = {
  definition: Definition;
  children: React.ReactNode;
  onReveal: (definition: Definition | null) => void;
};

export function StanfordMark({ definition, children, onReveal }: Props) {
  const { setStanfordHover } = useHoverEffects();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);

  const clearOpenTimer = () => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  };

  const show = (immediate = false) => {
    clearOpenTimer();
    setStanfordHover(true);
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
    setStanfordHover(false);
    if (!activeRef.current) return;
    activeRef.current = false;
    onReveal(null);
  };

  useEffect(() => () => {
    clearOpenTimer();
    setStanfordHover(false);
  }, [setStanfordHover]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) hide();
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [definition]);

  return (
    <span
      ref={wrapRef}
      className="mark squiggle"
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
      {children}
    </span>
  );
}
