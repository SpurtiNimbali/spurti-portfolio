import { useId, useState, type CSSProperties, type ReactNode } from "react";
import type { ProjectEntry } from "../projects";
import { effectiveTier, tierAtLeast, type ProjectTier } from "../lib/projectTier";
import { artFor } from "../lib/projectArt";
import { useReveal } from "../lib/useReveal";
import { withIntensityPath } from "../lib/intensityUrl";
import { navigate } from "../lib/navigate";
import { useIntensity } from "./IntensityContext";
import { PaperWave } from "./PaperWave";
import { ProjectArt } from "./ProjectArt";

type Props = {
  entry: ProjectEntry;
  axisTier: ProjectTier;
  index: number;
};

function ArrowLinks({ links }: { links: NonNullable<ProjectEntry["links"]> }) {
  return (
    <p className="pj-entry__links">
      {links.map((link, i) => {
        const external = link.href.startsWith("http");
        return external ? (
          <a key={`${link.label}-${i}`} className="pj-link" href={link.href} target="_blank" rel="noreferrer">
            {link.label}
            <span className="pj-link__arrow" aria-hidden="true">
              →
            </span>
          </a>
        ) : (
          <span key={`${link.label}-${i}`} className="pj-link is-pending">
            {link.label}
          </span>
        );
      })}
    </p>
  );
}

/** Collapses to nothing when the current tier does not earn it. */
function Tier({ open, className, children }: { open: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={`pj-tier${open ? " is-open" : ""}`} aria-hidden={!open}>
      <div className={className}>{children}</div>
    </div>
  );
}

/** A project that gets its own sheet of paper. */
export function ProjectBand({ entry, axisTier, index }: Props) {
  const { intensity } = useIntensity();
  const { ref, revealed } = useReveal<HTMLElement>();
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  const tier = effectiveTier(axisTier, expanded);
  const showDetail = tierAtLeast(tier, "detail") && Boolean(entry.detail);
  const showFull = tierAtLeast(tier, "full");
  const hasMore = Boolean(entry.full || entry.stack || entry.awards?.length || entry.links?.length);
  const art = artFor(entry.id);
  const hasArt = Boolean(art.shots?.length);

  if (entry.crossRef) {
    const href = withIntensityPath(entry.crossRef.href, intensity);
    return (
      <section
        ref={ref}
        className={`pj-band pj-band--pointer${revealed ? " is-in" : ""}`}
        data-tint={String(index % 3)}
      >
        <PaperWave variant={index} />
        <div className="pj-band__inner">
          <p className="pj-pointer">
            <span className="pj-pointer__name">{entry.name}</span>
            <a
              className="pj-link"
              href={href}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                navigate(href);
              }}
            >
              read it under {entry.crossRef.label}
              <span className="pj-link__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className={`pj-band${revealed ? " is-in" : ""}`}
      data-tint={String(index % 3)}
      style={{ "--accent": `var(--pj-${art.tint})` } as CSSProperties}
      aria-labelledby={`${panelId}-title`}
    >
      <PaperWave variant={index} />

      <div className="pj-band__inner">
        <div className={`pj-entry${hasArt ? "" : " pj-entry--type"}`}>
          <div className="pj-entry__text">
            <div className="pj-entry__head">
              <p className="pj-entry__eyebrow">{entry.year}</p>
              <h2 className="pj-entry__title" id={`${panelId}-title`}>
                {entry.name}
              </h2>
            </div>

            <div className="pj-entry__body">
              <p className="pj-entry__line">{entry.line}</p>

              <div id={panelId}>
                <Tier open={showDetail}>
                  <p className="pj-entry__detail">{entry.detail}</p>
                </Tier>

                <Tier open={showFull && Boolean(entry.full)}>
                  <p className="pj-entry__full">{entry.full}</p>
                </Tier>

                <Tier open={showFull && Boolean(entry.awards?.length)}>
                  <ul className="pj-entry__awards">
                    {entry.awards?.map((award) => (
                      <li key={award}>{award}</li>
                    ))}
                  </ul>
                </Tier>

                <Tier open={showFull && Boolean(entry.stack)}>
                  <p className="pj-entry__stack">{entry.stack}</p>
                </Tier>

                <Tier open={showFull && Boolean(entry.note)}>
                  <p className="pj-entry__note">{entry.note}</p>
                </Tier>

                <Tier open={showFull && Boolean(entry.links?.length)}>
                  {entry.links?.length ? <ArrowLinks links={entry.links} /> : null}
                </Tier>
              </div>

              {hasMore ? (
                <button
                  type="button"
                  className="pj-entry__more"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setExpanded((open) => !open)}
                >
                  {expanded ? "less" : "more"}
                  <span className="pj-entry__more-mark" aria-hidden="true">
                    {expanded ? "−" : "+"}
                  </span>
                </button>
              ) : null}
            </div>
          </div>

          {hasArt ? <ProjectArt id={entry.id} /> : null}
        </div>
      </div>
    </section>
  );
}
