import cardea from "../assets/project-cardea.png";
import dares from "../assets/project-dares.png";

/**
 * Presentation only — which artwork and accent a project carries on the index.
 * Kept out of `projects.ts` so that file stays prose the author edits by hand.
 */
export type ProjectArt = {
  /** Accent used for the artwork frame and the band's rule. */
  tint: "cobalt" | "jade" | "flame" | "butter" | "cardinal";
  shots?: { src: string; ratio: number; alt: string }[];
};

export const PROJECT_ART: Record<string, ProjectArt> = {
  "atria-ai": { tint: "cobalt" },
  "ollie-hinkle": {
    tint: "jade",
    shots: [{ src: cardea, ratio: 836 / 1024, alt: "Cardea home screen" }],
  },
  dares: {
    tint: "flame",
    shots: [{ src: dares, ratio: 597 / 1024, alt: "Dares friend feed" }],
  },
  sayso: { tint: "butter" },
  "mindbridge-ref": { tint: "cardinal" },
};

export function artFor(id: string): ProjectArt {
  return PROJECT_ART[id] ?? { tint: "cobalt" };
}
