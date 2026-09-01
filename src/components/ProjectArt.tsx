import type { CSSProperties } from "react";
import { artFor } from "../lib/projectArt";
import { Chip } from "./Chip";
import { ProjectObject } from "./ProjectObjects";

/**
 * Artwork sits in the band like something dropped on a desk: tilted, shadowed,
 * with a few marks tucked into its corners. Projects with no screenshot render
 * no art at all — their band goes typographic instead of showing a stand-in.
 */
export function ProjectArt({ id }: { id: string }) {
  const art = artFor(id);
  const shots = art.shots ?? [];
  const accents = art.accents ?? [];
  if (!shots.length) return null;

  const layout = art.layout ?? (shots.length > 2 ? "deck" : shots.length === 2 ? "pair" : undefined);

  return (
    /* `data-art` is the hook for the per-project nudges a shared layout can't carry. */
    <div className={`pj-art${layout ? ` pj-art--${layout}` : ""}`} data-art={id}>
      {/* With real frames layered on each other, a blank backing sheet adds nothing. */}
      {layout ? null : <span className="pj-art__backing" aria-hidden="true" />}

      {shots.map((shot, i) => (
        <figure
          key={shot.src}
          className="pj-art__shot"
          style={{ "--i": String(i), aspectRatio: String(shot.ratio) } as CSSProperties}
        >
          <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" />
        </figure>
      ))}

      {accents.map((accent) => {
        if (accent.type === "logo") {
          return (
            <img
              key={accent.src}
              className={`pj-mark pj-mark--logo pj-mark--${accent.at}`}
              src={accent.src}
              alt={accent.alt}
              loading="lazy"
              decoding="async"
            />
          );
        }
        if (accent.type === "object") {
          return (
            <span
              key={accent.kind}
              className={`pj-mark pj-mark--object pj-mark--obj-${accent.kind} pj-mark--${accent.at}`}
            >
              <ProjectObject kind={accent.kind} />
            </span>
          );
        }
        return <Chip key={accent.kind} kind={accent.kind} className={`pj-mark pj-mark--chip pj-mark--${accent.at}`} />;
      })}
    </div>
  );
}
