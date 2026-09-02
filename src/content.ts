import type { StickerKey } from "./lib/stickers";

export const LINKS = {
  projects: "/projects",
  research: "/research",
  readme: "/about",
} as const;

export const GITHUB_USER = "SpurtiNimbali";
export const GITHUB_URL = `https://github.com/${GITHUB_USER}`;

export type MarkKind = "squiggle";

export type Definition = {
  entity: string;
  role: string;
  /** Optional die-cut sticker or campus print, peeled off the word on click. */
  sticker?: StickerKey;
};

/** Keyboard name for a mark — the visible caption is gone. */
export function definitionLabel(definition: Definition) {
  return `${definition.entity} — ${definition.role}`;
}

export type PredicatePart = {
  text: string;
  mark?: MarkKind;
  definition?: Definition;
};

export type IntensityLevel = {
  label: string;
  parts: PredicatePart[];
  /**
   * Shouted by CSS rather than stored in caps, so the marks, the name link and
   * everything read aloud stay in ordinary case.
   */
  caps?: true;
};

const ENTITY: Record<"Stanford" | "Slack" | "Simba", Definition> = {
  Stanford: { entity: "Stanford CS", role: "building in public", sticker: "stanford" },
  Slack: { entity: "Slack", role: "software intern", sticker: "slack" },
  Simba: { entity: "Simba", role: "moral support", sticker: "simba" },
};

const MARKED = Object.keys(ENTITY) as (keyof typeof ENTITY)[];
const MARKED_RE = new RegExp(`\\b(${MARKED.join("|")})\\b`, "g");

/**
 * Copy is written as prose so a whole paragraph stays legible in this file, and
 * only the first mention of each name becomes a squiggle. Later mentions stay
 * plain: every mark peels from the same pile of photos, so a second underlined
 * "Stanford" adds clutter and a duplicate reveal rather than a new payoff.
 */
function line(text: string): PredicatePart[] {
  const parts: PredicatePart[] = [];
  const seen = new Set<string>();
  let last = 0;

  for (const match of text.matchAll(MARKED_RE)) {
    const word = match[1] as keyof typeof ENTITY;
    if (seen.has(word)) continue;
    seen.add(word);
    const at = match.index ?? 0;
    if (at > last) parts.push({ text: text.slice(last, at) });
    parts.push({ text: word, mark: "squiggle", definition: ENTITY[word] });
    last = at + word.length;
  }

  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

/**
 * Single source of truth for axis copy. Edit text here, not in components. Each
 * level picks up after the name link, so it opens lowercase — "Spurti" is drawn
 * separately because it doubles as the GitHub handle.
 */
export const INTENSITY_LEVELS: IntensityLevel[] = [
  {
    label: "quiet",
    parts: line("builds software that is obsessed with people, like she is with Simba."),
  },
  {
    label: "modest",
    parts: line(
      "studies CS and AI at Stanford and likes building software around how people " +
        "actually think and work. Simba mostly thinks about treats.",
    ),
  },
  {
    label: "warm",
    parts: line(
      "builds AI at Stanford and thinks a lot about how people understand, trust, and " +
        "use technology. She spent the summer at Slack seeing what that looks like when " +
        "the software is used by millions. Simba is better than her at the " +
        "human-understanding bit.",
    ),
  },
  {
    label: "confident",
    parts: line(
      "works on AI and does computational neuroscience research at Stanford, mostly " +
        "because she wants to understand people well enough to build technology that " +
        "feels obvious, useful, and actually worth using. This summer at Slack, she got " +
        "to do that on software people live in every day. Simba slept through most of it.",
    ),
  },
  {
    label: "bold",
    parts: line(
      "is obsessed with the gap between how technology is designed and how people " +
        "actually use it. At Stanford, that means computational neuroscience research, " +
        "teaching a CS class where students build projects from scratch, and random 2am " +
        "side projects alongside people equally driven to simply learn and build. At " +
        "Slack, she spent the summer working on third-party integrations and making " +
        "agents easier to discover and use inside the flow of everyday work. Simba still " +
        "makes up most of her camera roll.",
    ),
  },
  {
    label: "undeniable",
    caps: true,
    parts: line(
      "studies AI at Stanford, is a published researcher, builds software at Slack, and " +
        "studies how people think and behave so she can build technology that actually " +
        "works for them. She understands the user need, does the research and builds the " +
        "thing, which is apparently enough of a novel concept that we have to put this " +
        "in all caps. Get her before everyone else figures this out. Simba vouches. His " +
        "standards are extremely high.",
    ),
  },
];

/** Mid-range on purpose: the tone reads as a starting point you can push either way. */
export const DEFAULT_INTENSITY = 2;
export const INTENSITY_MIN = 0;
export const INTENSITY_MAX = INTENSITY_LEVELS.length - 1;

export const NAV = [
  {
    id: "projects" as const,
    file: "projects.py",
    title: "Projects",
    hint: "things that shipped",
    cta: "View projects",
    href: LINKS.projects,
  },
  {
    id: "research" as const,
    file: "research.md",
    title: "Research",
    hint: "papers & explorations",
    cta: "View research",
    href: LINKS.research,
  },
  {
    id: "readme" as const,
    file: "readme.txt",
    title: "Read Me",
    hint: "the longer note",
    cta: "Read the note",
    href: LINKS.readme,
  },
] as const;
