import type { CSSProperties } from "react";
import { artFor } from "../lib/projectArt";

/**
 * Artwork sits in the band like something dropped on a desk: tilted, shadowed,
 * one blank sheet behind it. Projects with no screenshot render no art at all —
 * their band goes typographic instead of showing a stand-in.
 */
export function ProjectArt({ id }: { id: string }) {
  const shots = artFor(id).shots ?? [];
  if (!shots.length) return null;

  return (
    <div className="pj-art">
      <span className="pj-art__backing" aria-hidden="true" />
      {shots.map((shot, i) => (
        <figure
          key={shot.src}
          className="pj-art__shot"
          style={{ "--i": String(i), aspectRatio: String(shot.ratio) } as CSSProperties}
        >
          <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" />
        </figure>
      ))}
    </div>
  );
}
