import type { Definition } from "../content";

/**
 * Words in the about copy that carry a squiggle and peel photos on click.
 *
 * These reuse the hero's Definition shape and the same sticker keys, so a photo
 * added to lib/stickers.ts shows up in both places with no extra wiring.
 */
export const ENTITY_DEFS: Record<string, Definition> = {
  Stanford: { entity: "Stanford CS", role: "building in public", sticker: "stanford" },
  Slack: { entity: "Slack", role: "software intern", sticker: "slack" },
  Simba: { entity: "Simba", role: "moral support", sticker: "simba" },
};
