import { useMemo, useRef } from "react";
import { INTENSITY_LEVELS, type PredicatePart } from "../content";
import { useIntensity } from "./IntensityContext";
import { DefinitionMark } from "./DefinitionMark";

function partKey(part: PredicatePart) {
  return `${part.text}|${part.mark ?? ""}|${part.definition?.entity ?? ""}`;
}

function partsChanged(prev: PredicatePart[], next: PredicatePart[]) {
  if (prev.length !== next.length) return next.map(() => true);
  return next.map((part, i) => partKey(part) !== partKey(prev[i]));
}

function renderPart(part: PredicatePart, animate: boolean, index: number) {
  const swapClass = animate ? " hero-token--swap" : "";

  if (part.mark === "squiggle" && part.definition) {
    return (
      <DefinitionMark key={index} definition={part.definition}>
        <span className={`hero-token${swapClass}`}>{part.text}</span>
      </DefinitionMark>
    );
  }

  return (
    <span key={index} className={`hero-token${swapClass}`}>
      {part.text}
    </span>
  );
}

export function HeroLine() {
  const { intensity } = useIntensity();
  const level = INTENSITY_LEVELS[intensity];
  const prevPartsRef = useRef<PredicatePart[]>(level.parts);
  const prevIntensityRef = useRef<number | null>(null);

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

  return (
    <div className="hero-wrap">
      <h1 className="hero-line" aria-live="polite">
        <span className="hero-name">Spurti Nimbali</span>{" "}
        <span className="hero-predicate">
          {level.parts.map((part, i) => renderPart(part, animateFlags[i], i))}
        </span>
      </h1>
    </div>
  );
}
