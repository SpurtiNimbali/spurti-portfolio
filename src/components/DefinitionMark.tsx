import type { CSSProperties } from "react";
import { useRef } from "react";
import { definitionLabel, type Definition } from "../content";

type Props = {
  definition: Definition;
  children: React.ReactNode;
  onSpawn?: (definition: Definition, at: HTMLElement | null) => void;
  /** Carries the rewrite stagger down to the crossfading span. */
  beat?: CSSProperties;
};

export function DefinitionMark({ definition, children, onSpawn, beat }: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={wrapRef}
      className="mark squiggle"
      style={beat}
      onClick={(e) => {
        e.preventDefault();
        onSpawn?.(definition, wrapRef.current);
      }}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        onSpawn?.(definition, wrapRef.current);
      }}
      tabIndex={0}
      role="button"
      aria-label={definitionLabel(definition)}
    >
      {children}
    </span>
  );
}
