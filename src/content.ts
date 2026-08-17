export const GITHUB = {
  handle: "@SpurtiNimbali",
  href: "https://github.com/SpurtiNimbali",
};

export const LINKS = {
  github: "https://github.com/SpurtiNimbali",
  stanford: "https://www.stanford.edu",
  slack: "https://slack.com",
  sail: "https://ai.stanford.edu",
  projects: "#projects",
  fun: "#fun",
  about: "#about",
};

export type Mark = "name" | "wavy" | "line";

export type HeroPart = {
  text: string;
  mark?: Mark;
  href?: string;
  sticker?: string;
};

export type Line = {
  mode: string;
  parts: HeroPart[];
};

export const LINES: Line[] = [
  {
    mode: "draft",
    parts: [
      { text: "Spurti Nimbali", mark: "name", href: LINKS.github },
      { text: " studies " },
      { text: "CS", mark: "wavy", href: LINKS.stanford, sticker: "Stanford" },
      { text: " at " },
      { text: "Stanford", mark: "wavy", href: LINKS.stanford, sticker: "Stanford" },
      { text: "." },
    ],
  },
  {
    mode: "warm",
    parts: [
      { text: "Spurti Nimbali", mark: "name", href: LINKS.github },
      { text: " studies " },
      { text: "CS", mark: "wavy", href: LINKS.stanford, sticker: "Stanford" },
      { text: " at " },
      { text: "Stanford", mark: "wavy", href: LINKS.stanford, sticker: "Stanford" },
      { text: " and writes " },
      { text: "software", mark: "wavy", href: LINKS.projects },
      { text: "." },
    ],
  },
  {
    mode: "considered",
    parts: [
      { text: "Spurti Nimbali", mark: "name", href: LINKS.github },
      { text: " builds " },
      { text: "AI", mark: "wavy", href: LINKS.sail, sticker: "AI" },
      { text: " and writes " },
      { text: "software", mark: "wavy", href: LINKS.projects },
      { text: " at " },
      { text: "Stanford", mark: "wavy", href: LINKS.stanford, sticker: "Stanford" },
      { text: " with " },
      { text: "Slack", mark: "line", href: LINKS.slack, sticker: "Slack" },
      { text: "." },
    ],
  },
  {
    mode: "builder",
    parts: [
      { text: "Spurti Nimbali", mark: "name", href: LINKS.github },
      { text: " ships " },
      { text: "software", mark: "wavy", href: LINKS.projects },
      { text: " at " },
      { text: "Stanford", mark: "wavy", href: LINKS.stanford, sticker: "Stanford" },
      { text: ", " },
      { text: "Slack", mark: "line", href: LINKS.slack, sticker: "Slack" },
      { text: ", and " },
      { text: "Hackspace", mark: "wavy", href: LINKS.fun, sticker: "Hackspace" },
      { text: "." },
    ],
  },
  {
    mode: "proof",
    parts: [
      { text: "Spurti Nimbali", mark: "name", href: LINKS.github },
      { text: " builds " },
      { text: "AI", mark: "wavy", href: LINKS.sail, sticker: "AI" },
      { text: " at " },
      { text: "Stanford", mark: "wavy", href: LINKS.stanford, sticker: "Stanford" },
      { text: ", " },
      { text: "Slack", mark: "line", href: LINKS.slack, sticker: "Slack" },
      { text: ", and " },
      { text: "SAIL", mark: "wavy", href: LINKS.sail, sticker: "SAIL" },
      { text: "." },
    ],
  },
  {
    mode: "undeniable",
    parts: [
      { text: "Spurti Nimbali", mark: "name", href: LINKS.github },
      { text: " ships " },
      { text: "AI", mark: "wavy", href: LINKS.sail, sticker: "AI" },
      { text: " at " },
      { text: "Stanford", mark: "wavy", href: LINKS.stanford, sticker: "Stanford" },
      { text: ", " },
      { text: "Slack", mark: "line", href: LINKS.slack, sticker: "Slack" },
      { text: ", and " },
      { text: "SAIL", mark: "wavy", href: LINKS.sail, sticker: "SAIL" },
      { text: "." },
    ],
  },
];

export type StickerTone = "paper";

export const STICKERS: Record<
  string,
  { label: string; note: string; tone: StickerTone }
> = {
  Stanford: { label: "Stanford CS", note: "building in public", tone: "paper" },
  Slack: { label: "Slack", note: "software intern", tone: "paper" },
  SAIL: { label: "SAIL", note: "translational AI", tone: "paper" },
  SaySo: { label: "SaySo", note: "Adobe hackathon", tone: "paper" },
  Hackspace: { label: "Hackspace", note: "BASES", tone: "paper" },
  AI: { label: "AI × product", note: "human systems", tone: "paper" },
  Rise: { label: "Rise Fellow", note: "global cohort", tone: "paper" },
};

export const NAV = [
  {
    id: "projects",
    file: "projects.config",
    title: "Projects",
    hint: "things that shipped",
    href: "#projects",
  },
  {
    id: "fun",
    file: "fun.py",
    title: "Fun",
    hint: "side quests",
    href: "#fun",
  },
  {
    id: "about",
    file: "readme.txt",
    title: "About",
    hint: "the longer note",
    href: "#about",
  },
] as const;
