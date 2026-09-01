import atriaApp from "../assets/project-atria-app.webp";
import atriaCover from "../assets/project-atria-cover.webp";
import treehacks from "../assets/project-treehacks.webp";
import type { ChipKind } from "../components/Chip";
import type { ObjectKind } from "../components/ProjectObjects";
import cardeaHome from "../assets/project-cardea-home.webp";
import cardeaResources from "../assets/project-cardea-resources.webp";
import cookedFeed from "../assets/project-cooked-feed.webp";
import cookedInspo from "../assets/project-cooked-inspo.webp";
import cookedSend from "../assets/project-cooked-send.webp";
import cookedSent from "../assets/project-cooked-sent.webp";
import saysoApp from "../assets/project-sayso-app.webp";
import saysoFlows from "../assets/project-sayso-flows.webp";

/**
 * Presentation only — which artwork and accent a project carries on the index.
 * Kept out of `projects.ts` so that file stays prose the author edits by hand.
 */
/**
 * Where a mark sits against the artwork. Named corners rather than raw offsets,
 * because the frames move with the viewport and a mark that is not pinned to the
 * composition drifts into the text column.
 */
export type AccentSlot = "tl" | "tr" | "rt" | "br" | "bl" | "seam";

/** Small things around the artwork: where it was built, what it does. */
export type ProjectAccent =
  | { type: "logo"; src: string; alt: string; at: AccentSlot }
  | { type: "object"; kind: ObjectKind; at: AccentSlot }
  | { type: "chip"; kind: ChipKind; at: AccentSlot };

/**
 * How the frames are arranged. Declared rather than inferred from the count,
 * because the right arrangement depends on the shape of the shots: phone screens
 * fan out in a row, wide screens layer on each other.
 */
export type ArtLayout = "pair" | "deck";

export type ProjectArt = {
  /** Accent used for the artwork frame and the band's rule. */
  tint: "cobalt" | "jade" | "flame" | "butter" | "cardinal";
  shots?: { src: string; ratio: number; alt: string }[];
  layout?: ArtLayout;
  accents?: ProjectAccent[];
};

export const PROJECT_ART: Record<string, ProjectArt> = {
  /* Console behind, title card in front, fanned so neither frame is buried. */
  "atria-ai": {
    tint: "cobalt",
    shots: [
      { src: atriaApp, ratio: 1024 / 577, alt: "Atria AI console listening, with vitals and a care timeline" },
      { src: atriaCover, ratio: 1024 / 570, alt: "Atria AI title card — for those outside the room" },
    ],
    accents: [
      { type: "logo", src: treehacks, alt: "Built at TreeHacks", at: "tl" },
      { type: "object", kind: "monitor", at: "br" },
    ],
  },
  /* The screen the app opens on behind the resource library it leads to. */
  cardea: {
    tint: "jade",
    shots: [
      { src: cardeaHome, ratio: 1024 / 555, alt: "Cardea's home screen, opening on a mood check-in" },
      { src: cardeaResources, ratio: 1024 / 553, alt: "The OHHF resource library inside Cardea" },
    ],
    accents: [
      { type: "object", kind: "heart", at: "tr" },
      { type: "object", kind: "journal", at: "bl" },
    ],
  },
  /*
   * The dare runs left to right, but the deck is laid the other way so the feed
   * it ends on falls to the back and the library it starts from reads in full.
   */
  cooked: {
    tint: "flame",
    layout: "deck",
    shots: [
      { src: cookedFeed, ratio: 526 / 1024, alt: "The crew feed watching a dare play out" },
      { src: cookedSent, ratio: 540 / 1024, alt: "Dare sent, with a 24-hour clock running" },
      { src: cookedSend, ratio: 513 / 1024, alt: "Composing a dare with a recorded clip" },
      { src: cookedInspo, ratio: 509 / 1024, alt: "COOKED prompt library, sorted by vibe" },
    ],
    accents: [
      { type: "object", kind: "flame", at: "tr" },
      { type: "object", kind: "stopwatch", at: "bl" },
    ],
  },
  /* The journey map that argued for it, behind the add-on that shipped. */
  sayso: {
    tint: "butter",
    shots: [
      { src: saysoApp, ratio: 1024 / 519, alt: "The SaySo panel recording feedback inside Adobe Express" },
      { src: saysoFlows, ratio: 1024 / 579, alt: "SaySo research: existing design review user flows" },
    ],
    accents: [{ type: "object", kind: "trophy", at: "br" }],
  },
};

export function artFor(id: string): ProjectArt {
  return PROJECT_ART[id] ?? { tint: "cobalt" };
}
