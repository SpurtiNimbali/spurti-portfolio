import { useId, useState } from "react";
import type { ResearchEntry } from "../research";
import { ProjectTierBlock } from "./ProjectTierBlock";

type Props = {
  entry: ResearchEntry;
};

function Links({ links }: { links: NonNullable<ResearchEntry["links"]> }) {
  return (
    <p className="research-row__cta">
      {links.map((link, i) =>
        link.href.startsWith("http") || link.href.startsWith("/") ? (
          <a
            key={`${link.label}-${i}`}
            className="research-cta"
            href={link.href}
            target="_blank"
            rel="noreferrer"
          >
            {link.label}
            <span className="research-cta__arrow" aria-hidden="true">
              →
            </span>
          </a>
        ) : (
          <span key={`${link.label}-${i}`} className="research-cta is-pending">
            {link.label}
          </span>
        ),
      )}
    </p>
  );
}

/* Closed is the question and nothing else, so the row owns its own disclosure. */
export function ResearchRow({ entry }: Props) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  return (
    <article className="research-row project-row" id={entry.id}>
      <button
        type="button"
        className="project-row__head"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((isOpen) => !isOpen)}
      >
        <span className="project-row__year">{entry.year}</span>
        <span className="project-row__main">
          <span className="project-row__name">{entry.name}</span>
          <span className="project-row__line research-row__question">{entry.question}</span>
        </span>
        <span className={`project-row__chevron${expanded ? " is-expanded" : ""}`} aria-hidden="true">
          ↓
        </span>
      </button>

      <div id={panelId} className="project-row__body research-row__body">
        <ProjectTierBlock visible={expanded} className="research-row__summary">
          <p>{entry.summary}</p>
          {entry.meta ? <p className="research-row__meta-line">{entry.meta}</p> : null}
          {entry.links?.length ? <Links links={entry.links} /> : null}
        </ProjectTierBlock>
      </div>
    </article>
  );
}
