import { useEffect, useRef, type CSSProperties } from "react";
import { definitionLabel, type Definition } from "../content";
import { useHoverEffects } from "./HoverEffectsContext";

type Props = {
  definition: Definition;
  children: React.ReactNode;
  onSpawn?: (definition: Definition, at: HTMLElement | null) => void;
  /** Carries the rewrite stagger down to the crossfading span. */
  beat?: CSSProperties;
};

export function StanfordMark({ definition, children, onSpawn, beat }: Props) {
  const { setStanfordHover } = useHoverEffects();
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(
    () => () => {
      setStanfordHover(false);
    },
    [setStanfordHover],
  );

  return (
    <span
      ref={wrapRef}
      className="mark squiggle"
      style={beat}
      onMouseEnter={() => setStanfordHover(true)}
      onMouseLeave={() => setStanfordHover(false)}
      onFocus={() => setStanfordHover(true)}
      onBlur={() => setStanfordHover(false)}
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
