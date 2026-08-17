export const LINKS = {
  projects: "#projects",
  research: "#research",
  readme: "#readme",
} as const;

/** Flip to false to use alternate level 4/5 copy without SAIL. */
export const SAIL_IS_REAL = true;

export type MarkKind = "squiggle";

export type Definition = {
  entity: string;
  role: string;
};

export type PredicatePart = {
  text: string;
  mark?: MarkKind;
  definition?: Definition;
};

export type IntensityLevel = {
  label: string;
  parts: PredicatePart[];
};

const ENTITY: Record<"Stanford" | "Slack" | "SAIL", Definition> = {
  Stanford: { entity: "Stanford CS", role: "building in public" },
  Slack: { entity: "Slack", role: "software intern" },
  SAIL: { entity: "SAIL", role: "translational AI" },
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
        { text: "." },
      ],
    }
  : {
      label: "bold",
      parts: [
        { text: "builds AI at " },
        sq("Stanford"),
        { text: " and ships software at " },
        sq("Slack"),
        { text: "." },
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
        { text: ", and is not especially humble about any of it." },
      ],
    }
  : {
      label: "undeniable",
      parts: [
        { text: "builds AI at " },
        sq("Stanford"),
        { text: ", ships it at " },
        sq("Slack"),
        { text: ", and you dragged this all the way up, so." },
      ],
    };

/** Single source of truth for axis copy. Edit text here, not in components. */
export const INTENSITY_LEVELS: IntensityLevel[] = [
  {
    label: "quiet",
    parts: [
      { text: "writes software at " },
      sq("Stanford"),
      { text: "." },
    ],
  },
  {
    label: "modest",
    parts: [
      { text: "studies CS at " },
      sq("Stanford"),
      { text: " and writes software." },
    ],
  },
  {
    label: "warm",
    parts: [
      { text: "builds small AI things at " },
      sq("Stanford"),
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
      { text: "." },
    ],
  },
  LEVEL_4_BOLD,
  LEVEL_5_UNDENIABLE,
];

export const DEFAULT_INTENSITY = 3;
export const INTENSITY_MIN = 0;
export const INTENSITY_MAX = INTENSITY_LEVELS.length - 1;

export const NAV = [
  {
    id: "projects" as const,
    file: "projects.config",
    title: "Projects",
    hint: "things that shipped",
    href: LINKS.projects,
  },
  {
    id: "research" as const,
    file: "research.md",
    title: "Research",
    hint: "papers & explorations",
    href: LINKS.research,
  },
  {
    id: "readme" as const,
    file: "readme.txt",
    title: "Read Me",
    hint: "the longer note",
    href: LINKS.readme,
  },
] as const;
