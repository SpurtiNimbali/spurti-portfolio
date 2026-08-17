import { useEffect, useMemo, useRef, useState } from "react";
import { INTENSITY_LEVELS, type Definition, type PredicatePart } from "../content";
import { useIntensity } from "./IntensityContext";
import { DefinitionMark } from "./DefinitionMark";
import { SlackMark } from "./SlackMark";
import { StanfordMark } from "./StanfordMark";

const FADE_MS = 120;

function partKey(part: PredicatePart) {
  return `${part.text}|${part.mark ?? ""}|${part.definition?.entity ?? ""}`;
}

function partsChanged(prev: PredicatePart[], next: PredicatePart[]) {
  if (prev.length !== next.length) return next.map(() => true);
  return next.map((part, i) => partKey(part) !== partKey(prev[i]));
}

function renderPart(
  part: PredicatePart,
  animate: boolean,
  index: number,
  onReveal: (definition: Definition | null) => void,
) {
  const swapClass = animate ? " hero-token--swap" : "";

  if (part.mark === "squiggle" && part.definition) {
    if (part.text === "Slack") {
      return (
        <SlackMark key={index} definition={part.definition} onReveal={onReveal} animate={animate}>
          {part.text}
        </SlackMark>
      );
    }
    if (part.text === "Stanford") {
      return (
        <StanfordMark key={index} definition={part.definition} onReveal={onReveal}>
          <span className={`hero-token${swapClass}`}>{part.text}</span>
        </StanfordMark>
      );
    }
    return (
      <DefinitionMark key={index} definition={part.definition} onReveal={onReveal}>
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
  const [reveal, setReveal] = useState<Definition | null>(null);
  const [revealVisible, setRevealVisible] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleReveal = (definition: Definition | null) => {
    if (fadeTimer.current) {
      clearTimeout(fadeTimer.current);
      fadeTimer.current = null;
    }

    if (definition) {
      setReveal(definition);
      requestAnimationFrame(() => setRevealVisible(true));
      return;
    }

    setRevealVisible(false);
    fadeTimer.current = setTimeout(() => {
      setReveal(null);
      fadeTimer.current = null;
    }, FADE_MS);
  };

  useEffect(() => () => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
  }, []);

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
          {level.parts.map((part, i) => renderPart(part, animateFlags[i], i, handleReveal))}
        </span>
      </h1>
      <div className="def-reveal" aria-live="polite" aria-atomic="true">
        <p className={`def-reveal__line${revealVisible ? " is-visible" : ""}`}>
          {reveal ? (
            <>
              <strong>{reveal.entity}</strong>{" "}
              <span>{reveal.role}</span>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}
