export const LINKS = {
  projects: "#projects",
  research: "#research",
  readme: "#readme",
} as const;

export type MarkKind = "line" | "squiggle";

export type Definition = {
  entity: string;
  role: string;
};

export type PredicatePart = {
  text: string;
  mark?: MarkKind;
  href?: string;
  definition?: Definition;
};

export type IntensityLevel = {
  label: string;
  parts: PredicatePart[];
};

/** Single source of truth for axis copy. Edit text here, not in components. */
export const INTENSITY_LEVELS: IntensityLevel[] = [
  {
    label: "quiet",
    parts: [
      { text: "writes " },
      { text: "software", mark: "line", href: LINKS.projects },
      { text: " at " },
      {
        text: "Stanford",
        mark: "squiggle",
        definition: { entity: "Stanford CS", role: "building in public" },
      },
      { text: "." },
    ],
  },
  {
    label: "modest",
    parts: [
      { text: "studies " },
      {
        text: "CS",
        mark: "squiggle",
        definition: { entity: "Stanford CS", role: "undergraduate" },
      },
      { text: " at " },
      {
        text: "Stanford",
        mark: "squiggle",
        definition: { entity: "Stanford CS", role: "building in public" },
      },
      { text: " and writes " },
      { text: "software", mark: "line", href: LINKS.projects },
      { text: "." },
    ],
  },
  {
    label: "warm",
    parts: [
      { text: "builds small " },
      {
        text: "AI",
        mark: "squiggle",
        definition: { entity: "AI × product", role: "human systems" },
      },
      { text: " things at " },
      {
        text: "Stanford",
        mark: "squiggle",
        definition: { entity: "Stanford CS", role: "building in public" },
      },
      { text: " and likes it when they work." },
    ],
  },
  {
    label: "confident",
    parts: [
      { text: "builds " },
      {
        text: "AI",
        mark: "squiggle",
        definition: { entity: "AI × product", role: "human systems" },
      },
      { text: " and writes " },
      { text: "software", mark: "line", href: LINKS.projects },
      { text: " at " },
      {
        text: "Stanford",
        mark: "squiggle",
        definition: { entity: "Stanford CS", role: "building in public" },
      },
      { text: " with " },
      {
        text: "Slack",
        mark: "squiggle",
        definition: { entity: "Slack", role: "software intern" },
      },
      { text: "." },
    ],
  },
  {
    label: "bold",
    parts: [
      { text: "builds " },
      {
        text: "AI",
        mark: "squiggle",
        definition: { entity: "AI × product", role: "human systems" },
      },
      { text: " at " },
      {
        text: "Stanford",
        mark: "squiggle",
        definition: { entity: "Stanford CS", role: "building in public" },
      },
      { text: ", " },
      {
        text: "Slack",
        mark: "squiggle",
        definition: { entity: "Slack", role: "software intern" },
      },
      { text: ", and " },
      {
        text: "SAIL",
        mark: "squiggle",
        definition: { entity: "SAIL", role: "translational AI" },
      },
      { text: "." },
    ],
  },
  {
    label: "undeniable",
    parts: [
      { text: "builds " },
      {
        text: "AI",
        mark: "squiggle",
        definition: { entity: "AI × product", role: "human systems" },
      },
      { text: " at " },
      {
        text: "Stanford",
        mark: "squiggle",
        definition: { entity: "Stanford CS", role: "building in public" },
      },
      { text: ", ships it at " },
      {
        text: "Slack",
        mark: "squiggle",
        definition: { entity: "Slack", role: "software intern" },
      },
      { text: ", and researches it at " },
      {
        text: "SAIL",
        mark: "squiggle",
        definition: { entity: "SAIL", role: "translational AI" },
      },
      { text: "." },
    ],
  },
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
