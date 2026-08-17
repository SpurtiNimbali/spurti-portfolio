import { useId, useState } from "react";
import { BASES_BLOCK, type ProjectEntry } from "../projects";
import { effectiveTier, tierAtLeast, type ProjectTier } from "../lib/projectTier";
import { useReveal } from "../lib/useReveal";

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
  const showDetail = tierAtLeast(tier, "detail") && Boolean(entry.detail);
  const showFull = tierAtLeast(tier, "full");
  const openable = Boolean(entry.detail || entry.full || entry.stack || entry.awards?.length);

  const body = (
    <div id={panelId} className="pj-small__body">
      <div className={`pj-tier${showDetail ? " is-open" : ""}`} aria-hidden={!showDetail}>
        <div>
          <p className="pj-small__detail">{entry.detail}</p>
        </div>
      </div>

      <div className={`pj-tier${showFull && entry.full ? " is-open" : ""}`} aria-hidden={!(showFull && entry.full)}>
        <div>
          <p className="pj-small__detail">{entry.full}</p>
        </div>
      </div>

      <div
        className={`pj-tier${showFull && entry.awards?.length ? " is-open" : ""}`}
        aria-hidden={!(showFull && entry.awards?.length)}
      >
        <div>
          <ul className="pj-small__awards">
            {entry.awards?.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`pj-tier${showFull && entry.stack ? " is-open" : ""}`} aria-hidden={!(showFull && entry.stack)}>
        <div>
          <p className="pj-small__stack">{entry.stack}</p>
        </div>
      </div>

      <div
        className={`pj-tier${showFull && entry.links?.length ? " is-open" : ""}`}
        aria-hidden={!(showFull && entry.links?.length)}
      >
        <div>
          <p className="pj-small__links">
            {entry.links?.map((link, i) =>
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
        </div>
      </div>
    </div>
  );

  return (
    <article className="pj-small">
      {openable ? (
        <button
          type="button"
          className="pj-small__head"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((open) => !open)}
        >
          <span className="pj-small__year">{entry.year}</span>
          <span className="pj-small__name">{entry.name}</span>
          <span className="pj-small__line">{entry.line}</span>
        </button>
      ) : (
        <div className="pj-small__head pj-small__head--static">
          <span className="pj-small__year">{entry.year}</span>
          <span className="pj-small__name">{entry.name}</span>
          <span className="pj-small__line">{entry.line}</span>
        </div>
      )}
      {body}
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

export function BasesNote() {
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <section ref={ref} className={`pj-bases${revealed ? " is-in" : ""}`}>
      <p className="pj-bases__kicker">on the side</p>
      <h2 className="pj-bases__title">{BASES_BLOCK.title}</h2>
      <p className="pj-bases__period">{BASES_BLOCK.period}</p>
      <p className="pj-bases__body">{BASES_BLOCK.body}</p>
    </section>
  );
}
