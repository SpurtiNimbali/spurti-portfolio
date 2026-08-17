import type { StickerKey } from "./lib/stickers";

export const LINKS = {
  projects: "/projects",
  research: "/research",
  readme: "/about",
} as const;

/** Flip to false to use alternate level 4/5 copy without SAIL. */
export const SAIL_IS_REAL = true;

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
};

const ENTITY: Record<"Stanford" | "Slack" | "SAIL" | "Simba", Definition> = {
  Stanford: { entity: "Stanford CS", role: "building in public", sticker: "stanford" },
  Slack: { entity: "Slack", role: "software intern", sticker: "slack" },
  SAIL: { entity: "SAIL", role: "translational AI" },
  Simba: { entity: "Simba", role: "moral support", sticker: "simba" },
};

function sq(word: keyof typeof ENTITY): PredicatePart {
  return { text: word, mark: "squiggle", definition: ENTITY[word] };
}

const LEVEL_4_BOLD: IntensityLevel = SAIL_IS_REAL
  ? {
      label: "bold",
      parts: [
        { text: "builds AI at " },
        sq("Stanford"),
        { text: ", " },
        sq("Slack"),
        { text: ", and " },
        sq("SAIL"),
        { text: ". " },
        sq("Simba"),
        { text: " supervises." },
      ],
    }
  : {
      label: "bold",
      parts: [
        { text: "builds AI at " },
        sq("Stanford"),
        { text: " and ships software at " },
        sq("Slack"),
        { text: ". " },
        sq("Simba"),
        { text: " supervises." },
      ],
    };

const LEVEL_5_UNDENIABLE: IntensityLevel = SAIL_IS_REAL
  ? {
      label: "undeniable",
      parts: [
        { text: "builds AI at " },
        sq("Stanford"),
        { text: ", ships it at " },
        sq("Slack"),
        { text: ", does the research at " },
        sq("SAIL"),
        { text: ", and is not especially humble about any of it. " },
        sq("Simba"),
        { text: " agrees." },
      ],
    }
  : {
      label: "undeniable",
      parts: [
        { text: "builds AI at " },
        sq("Stanford"),
        { text: ", ships it at " },
        sq("Slack"),
        { text: ", and you dragged this all the way up, so. " },
        sq("Simba"),
        { text: " agrees." },
      ],
    };

/** Single source of truth for axis copy. Edit text here, not in components. */
export const INTENSITY_LEVELS: IntensityLevel[] = [
  {
    label: "quiet",
    parts: [
      { text: "writes software at " },
      sq("Stanford"),
      { text: " with " },
      sq("Simba"),
      { text: "." },
    ],
  },
  {
    label: "modest",
    parts: [
      { text: "studies CS at " },
      sq("Stanford"),
      { text: " and writes software with " },
      sq("Simba"),
      { text: "." },
    ],
  },
  {
    label: "warm",
    parts: [
      { text: "builds small AI things at " },
      sq("Stanford"),
      { text: " with " },
      sq("Simba"),
      { text: " and likes it when they work." },
    ],
  },
  {
    label: "confident",
    parts: [
      { text: "builds AI and writes software at " },
      sq("Stanford"),
      { text: " with " },
      sq("Slack"),
      { text: ", and " },
      sq("Simba"),
      { text: "." },
    ],
  },
  LEVEL_4_BOLD,
  LEVEL_5_UNDENIABLE,
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
