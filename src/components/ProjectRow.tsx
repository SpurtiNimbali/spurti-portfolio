import { useId, useState } from "react";
import type { ProjectEntry } from "../projects";
import { effectiveTier, tierAtLeast } from "../lib/projectTier";
import type { ProjectTier } from "../lib/projectTier";
import { ProjectTierBlock } from "./ProjectTierBlock";

type Props = {
  entry: ProjectEntry;
  axisTier: ProjectTier;
};

function renderLinks(links: ProjectEntry["links"]) {
  if (!links?.length) return null;

  return (
    <p className="project-row__links">
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

export function ProjectRow({ entry, axisTier }: Props) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const tier = effectiveTier(axisTier, expanded);
  const showDetail = tierAtLeast(tier, "detail") && Boolean(entry.detail);
  const showFull = tierAtLeast(tier, "full");

  return (
    <article className="project-row">
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
          <span className="project-row__line">{entry.line}</span>
        </span>
        <span className={`project-row__chevron${expanded ? " is-expanded" : ""}`} aria-hidden="true">
          ↓
        </span>
      </button>

      <div id={panelId} className="project-row__body">
        <ProjectTierBlock visible={showDetail} className="project-row__detail">
          <p>{entry.detail}</p>
        </ProjectTierBlock>

        <ProjectTierBlock visible={showFull && Boolean(entry.full)} className="project-row__full">
          <p>{entry.full}</p>
        </ProjectTierBlock>

        <ProjectTierBlock visible={showFull && Boolean(entry.stack)} className="project-row__stack">
          <p>{entry.stack}</p>
        </ProjectTierBlock>

        <ProjectTierBlock visible={showFull && Boolean(entry.note)} className="project-row__note">
          <p>{entry.note}</p>
        </ProjectTierBlock>

        <ProjectTierBlock visible={showFull && Boolean(entry.awards?.length)} className="project-row__awards">
          <ul>
            {entry.awards?.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </ProjectTierBlock>

        <ProjectTierBlock visible={showFull && Boolean(entry.links?.length)} className="project-row__links-wrap">
          {renderLinks(entry.links)}
        </ProjectTierBlock>
      </div>
    </article>
  );
}
