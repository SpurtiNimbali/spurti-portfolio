import { useId, useState, type CSSProperties, type ReactNode } from "react";
import type { ProjectEntry } from "../projects";
import { effectiveTier, tierAtLeast, type ProjectTier } from "../lib/projectTier";
import { artFor } from "../lib/projectArt";
import { useReveal } from "../lib/useReveal";
import { isTodo, realList, realOr } from "../lib/todo";
import { withEmphasis } from "../lib/emphasis";
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

/** A win is a fact about the work, so it sits with the summary rather than behind "more". */
export function Awards({ awards }: { awards: string[] }) {
  return (
    <ul className="pj-awards">
      {awards.map((award) => (
        <li key={award} className="pj-awards__item">
          <span className="pj-awards__mark" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <circle cx="8" cy="6.4" r="4.4" />
              <path d="M5.2 10.1 3.9 14.4l4.1-2 4.1 2-1.3-4.3" />
            </svg>
          </span>
          {award}
        </li>
      ))}
    </ul>
  );
}

function ArrowLinks({ links, className }: { links: NonNullable<ProjectEntry["links"]>; className?: string }) {
  return (
    <p className={className ?? "pj-entry__links"}>
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

  // Placeholders are dropped before anything decides what to show, so a band
  // whose only extra content is a TODO offers no "more" to open.
  const year = realOr(entry.year);
  const line = realOr(entry.line);
  const detail = realOr(entry.detail);
  const full = realOr(entry.full);
  const stack = realOr(entry.stack);
  const note = realOr(entry.note);
  const awards = realList(entry.awards, (award) => award);
  const links = realList(entry.links, (link) => link.label).filter(
    (link) => !isTodo(link.href),
  );

  // A primary link is the point of the entry, so it never hides behind "more".
  const primaryLinks = links.filter((link) => link.primary);
  const restLinks = links.filter((link) => !link.primary);

  const showDetail = tierAtLeast(tier, "detail") && Boolean(detail);
  const showFull = tierAtLeast(tier, "full");
  const hasMore = Boolean(full || note || restLinks.length);
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
              {year ? <p className="pj-entry__eyebrow">{year}</p> : null}
              <h2 className="pj-entry__title" id={`${panelId}-title`}>
                {entry.name}
              </h2>
            </div>

            <div className="pj-entry__body">
              {line ? <p className="pj-entry__line">{withEmphasis(line)}</p> : null}

              {awards.length ? <Awards awards={awards} /> : null}

              <div id={panelId}>
                <Tier open={showDetail}>
                  <p className="pj-entry__detail">{withEmphasis(detail)}</p>
                </Tier>

                <Tier open={showFull && Boolean(full)}>
                  <p className="pj-entry__full">{withEmphasis(full)}</p>
                </Tier>

                <Tier open={showFull && Boolean(note)}>
                  <p className="pj-entry__note">{note}</p>
                </Tier>

                <Tier open={showFull && restLinks.length > 0}>
                  {restLinks.length ? <ArrowLinks links={restLinks} /> : null}
                </Tier>
              </div>

              {stack ? <p className="pj-entry__stack">{stack}</p> : null}

              {primaryLinks.length ? (
                <ArrowLinks links={primaryLinks} className="pj-entry__links pj-entry__links--lead" />
              ) : null}

              {hasMore ? (
                <button
                  type="button"
                  className="pj-entry__more"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setExpanded((open) => !open)}
                >
                  <span className="pj-entry__more-mark" aria-hidden="true">
                    <svg viewBox="0 0 12 12" aria-hidden="true">
                      <path d="M2.5 4.5 6 8l3.5-3.5" />
                    </svg>
                  </span>
                  {expanded ? "less" : "more"}
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
