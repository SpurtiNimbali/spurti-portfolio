import { useEffect, useId, useRef, useState } from "react";
import type { Definition } from "../content";

const OPEN_DELAY_MS = 120;

type Props = {
  definition: Definition;
  children: React.ReactNode;
};

export function DefinitionMark({ definition, children }: Props) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<Span>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardId = useId();

  const clearOpenTimer = () => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  };

  const show = (immediate = false) => {
    clearOpenTimer();
    if (immediate) {
      setOpen(true);
      setVisible(true);
      return;
    }
    openTimer.current = setTimeout(() => {
      setOpen(true);
      setVisible(true);
    }, OPEN_DELAY_MS);
  };

  const hide = () => {
    clearOpenTimer();
    setOpen(false);
    setVisible(false);
  };

  useEffect(() => () => clearOpenTimer(), []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        hide();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

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
        if (open) hide();
        else show(true);
      }}
      tabIndex={0}
      role="button"
      aria-expanded={open}
      aria-describedby={visible ? cardId : undefined}
    >
      {children}
      {visible ? (
        <span className="def-card" id={cardId} role="tooltip">
          <strong>{definition.entity}</strong>
          <em>{definition.role}</em>
        </span>
      ) : null}
    </span>
  );
}

type Span = HTMLSpanElement;
