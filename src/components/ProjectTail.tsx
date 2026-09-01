import { useId, useState } from "react";
import { type ProjectEntry } from "../projects";
import { effectiveTier, tierAtLeast, type ProjectTier } from "../lib/projectTier";
import { useReveal } from "../lib/useReveal";
import { isTodo, realList, realOr } from "../lib/todo";
import { withEmphasis } from "../lib/emphasis";
import { Awards } from "./ProjectBand";

type Props = {
  heading: string;
  blurb?: string;
  entries: ProjectEntry[];
  axisTier: ProjectTier;
};

function TailEntry({ entry, axisTier }: { entry: ProjectEntry; axisTier: ProjectTier }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const tier = effectiveTier(axisTier, expanded);

  const year = realOr(entry.year);
  const line = realOr(entry.line);
  const detail = realOr(entry.detail);
  const full = realOr(entry.full);
  const stack = realOr(entry.stack);
  const awards = realList(entry.awards, (award) => award);
  const links = realList(entry.links, (link) => link.label).filter(
    (link) => !isTodo(link.href),
  );

  const showDetail = tierAtLeast(tier, "detail") && Boolean(detail);
  const showFull = tierAtLeast(tier, "full") && Boolean(full);
  /* Links are the whole point of a card this small, so they never hide behind "more". */
  const openable = Boolean(detail || full);

  const heading = (
    <>
      {year ? <span className="pj-small__year">{year}</span> : null}
      <span className="pj-small__title">
        <span className="pj-small__name">{entry.name}</span>
        {openable ? (
          <svg className="pj-small__caret" viewBox="0 0 12 12" aria-hidden="true">
            <path
              d="M2.5 4.5 6 8l3.5-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      {line ? <span className="pj-small__line">{withEmphasis(line)}</span> : null}
    </>
  );

  return (
    <article className="pj-small">
      {openable ? (
        <button
          type="button"
          className={`pj-small__head${expanded ? " is-open" : ""}`}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((open) => !open)}
        >
          {heading}
        </button>
      ) : (
        <div className="pj-small__head pj-small__head--static">{heading}</div>
      )}

      {awards.length ? <Awards awards={awards} /> : null}
      {stack ? <p className="pj-small__stack">{stack}</p> : null}

      {links.length ? (
        <p className="pj-small__links">
          {links.map((link, i) =>
            link.href.startsWith("http") ? (
              <a key={i} className="pj-link" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
                <span className="pj-link__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ) : (
              <span key={i} className="pj-link is-pending">
                {link.label}
              </span>
            ),
          )}
        </p>
      ) : null}

      <div id={panelId} className="pj-small__body">
        <div className={`pj-tier${showDetail ? " is-open" : ""}`} aria-hidden={!showDetail}>
          <div>
            <p className="pj-small__detail">{withEmphasis(detail)}</p>
          </div>
        </div>

        <div className={`pj-tier${showFull ? " is-open" : ""}`} aria-hidden={!showFull}>
          <div>
            <p className="pj-small__detail">{withEmphasis(full)}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProjectTail({ heading, blurb, entries, axisTier }: Props) {
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <section ref={ref} className={`pj-tail${revealed ? " is-in" : ""}`}>
      <h2 className="pj-tail__heading">{heading}</h2>
      {blurb ? <p className="pj-tail__blurb">{blurb}</p> : null}
      <div className="pj-tail__grid">
        {entries.map((entry) => (
          <TailEntry key={entry.id} entry={entry} axisTier={axisTier} />
        ))}
      </div>
    </section>
  );
}

