import { useId, useState } from "react";
import type { ResearchEntry } from "../research";
import {
  effectiveResearchTier,
  tierAtLeast,
  type ResearchTier,
} from "../lib/researchTier";
import { ProjectTierBlock } from "./ProjectTierBlock";
import { ResearchImageRow } from "./ResearchImageRow";

type Props = {
  entry: ResearchEntry;
  axisTier: ResearchTier;
};

function renderLinks(links: ResearchEntry["links"]) {
  if (!links?.length) return null;

  return (
    <p className="research-row__links">
      {links.map((link, i) => (
        <span key={`${link.label}-${i}`}>
          {i > 0 ? " · " : null}
          {link.href.startsWith("http") ? (
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ) : (
            <span>{link.label}</span>
          )}
        </span>
      ))}
    </p>
  );
}

export function ResearchRow({ entry, axisTier }: Props) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const tier = effectiveResearchTier(axisTier, expanded);
  const showApproach = tierAtLeast(tier, "approach");
  const showFinding = tierAtLeast(tier, "finding");

  return (
    <article className="research-row project-row" id={entry.id}>
      <button
        type="button"
        className="project-row__head"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((open) => !open)}
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
        <ProjectTierBlock visible={showApproach} className="research-row__approach">
          <p>{entry.approach}</p>
        </ProjectTierBlock>

        <ProjectTierBlock visible={showFinding} className="research-row__finding-block">
          <p className="research-row__finding">{entry.finding}</p>
          <p className="research-row__limitation">{entry.limitation}</p>
        </ProjectTierBlock>

        <ProjectTierBlock visible={showFinding && Boolean(entry.meta)} className="research-row__meta">
          <p>{entry.meta}</p>
        </ProjectTierBlock>

        {showFinding && entry.imageRow ? (
          <ProjectTierBlock visible className="research-row__images">
            <ResearchImageRow imageRow={entry.imageRow} />
          </ProjectTierBlock>
        ) : null}

        <ProjectTierBlock visible={showFinding && Boolean(entry.links?.length)} className="research-row__links-wrap">
          {renderLinks(entry.links)}
        </ProjectTierBlock>
      </div>
    </article>
  );
}
