// /about-preview content.
//
// Layout follows marco.fyi/about: a copy card on the left holding every
// section, a widget grid on the right, nav pill centred at the top.
//
// Type scale measured off that page with getComputedStyle:
//   label  12px / w500 / uppercase / normal tracking
//   body   18px / w400 / line-height 1.8
// Ours runs body a little tighter (16px / 1.65) purely so the whole thing holds
// one viewport — the label-to-body ratio, which is what the design actually is,
// is unchanged.
//
// HARD CONSTRAINT: one viewport, no scrolling. Ceiling is ~34 words per answer.
// If you add a sentence, cut one.
//
// {{Simba}}, {{Stanford}} and {{Slack}} render as squiggle marks that peel real
// photos onto the page when clicked.

import { ENTITY_DEFS } from "./aboutEntities";
import spurtiAvatar from "../assets/spurti.png";
import simbaPhoto from "../assets/sticker-simba-2.webp";
import simbaAlt from "../assets/sticker-simba-4.webp";
import stanfordPhoto from "../assets/sticker-stanford.webp";
import slackPhoto from "../assets/sticker-slack.webp";

export type AboutSection = {
  id: string;
  label: string;
  body: string;
};

export const ABOUT_TITLE = "What I'm about.";

export const ABOUT_CONTACT = [
  { label: "Email Me", href: "mailto:snimbali@stanford.edu" },
  { label: "GitHub", href: "https://github.com/SpurtiNimbali" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/spurti-nimbali/" },
  { label: "CV", href: "TODO: add CV URL" },
];

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    id: "from",
    label: "where i'm from",
    body: "Delhi. I was head girl at DPS R.K. Puram and spent most of high school building things for science fairs, which is how I ended up doing research with CSIR before my first CS class.",
  },
  {
    id: "used-to-do",
    label: "what i used to do",
    body: "Medical things, without much equipment. A dyslexia and dysgraphia screener for young kids. A pipeline that found oral cancer in slide images. An epilepsy app that calls for help on its own.",
  },
  {
    id: "do-now",
    label: "what i do now",
    body: "CS and data science at {{Stanford}}. Software engineering intern at {{Slack}}, undergraduate researcher at the AI Lab, and I teach — TA for CS 51/52, returning as instructor.",
  },
  {
    id: "working-on",
    label: "what i'm working on",
    body: "Hackspace at BASES — Stanford's largest hackathon, weekly HackerHours with Microsoft's Founders Hub, and demo days. Plus two lab projects I can't talk about yet.",
  },
  {
    id: "at-now",
    label: "where i'm at now",
    body: "Stanford mostly, San Francisco midweek. When I'm not working I'm with {{Simba}}, who is a dog and is unmoved by everything on this page.",
  },
  {
    id: "looking-for",
    label: "what i'm looking for",
    body: "Work where a model has to survive contact with an actual person — a patient, a clinician, a kid being screened. That's where the interesting failures live.",
  },
];

/**
 * Featured poem.
 *
 * `lines` is EMPTY ON PURPOSE. The poems are Spurti's, published in
 * My Paperboats — they are not mine to write, and inventing verse to sit under
 * her name would be worse than leaving the slot visibly unfilled. Paste the
 * poem (or the handful of lines she wants shown) into `lines` and the card
 * renders it; until then it shows a pending state.
 *
 * Keep it short: the card holds roughly 8 lines at this size.
 */
export type Poem = {
  title: string;
  lines: string[];
  from: string;
  href?: string;
};

export const FEATURED_POEM: Poem = {
  title: "",
  lines: [],
  from: "from My Paperboats",
  href: "https://books.google.com/books?id=yZQQEAAAQBAJ",
};

/**
 * Her poetry collection. Links out only — the poems themselves belong in the
 * book, not pasted onto a portfolio page.
 */
export const ABOUT_BOOK = {
  title: "My Paperboats",
  subtitle: "With Whirling Words",
  meta: "40+ poems · OrangeBooks Publication",
  links: [
    { label: "Google Books", href: "https://books.google.com/books?id=yZQQEAAAQBAJ" },
    {
      label: "Flipkart",
      href: "https://www.flipkart.com/my-paperboats/p/itm75a94e6ca6cfc?pid=9789390489596",
    },
  ],
};

/**
 * Now-playing block, after the reference's music card: art tile, title,
 * "artist — album", transport row.
 *
 * There is no audio file and no streaming embed. The play control is a real
 * outbound link to the track; the other controls are inert and marked as such,
 * because a transport that looks live but does nothing is worse than one that
 * admits it.
 *
 * `art` takes a cover image once you have one you may use — drop the file in
 * public/music/ and set the path. It is left unset here on purpose: bundling a
 * label's cover art into the repo would be shipping someone else's copyrighted
 * asset. Until it is set the card falls back to a plain tile.
 */
export const NOW_PLAYING: {
  title: string;
  artist: string;
  album: string;
  href: string;
  note: string;
  art?: string;
} = {
  title: "Yellow",
  artist: "Coldplay",
  album: "Parachutes",
  /** Search URL, so it resolves even if the canonical track id changes. */
  href: "https://open.spotify.com/search/Yellow%20Coldplay",
  note: "Spurti is listening to",
  /*
   * Save the cover as public/music/parachutes.jpg and it appears — no code
   * change. Left pointing at a file that may not exist on purpose: the artwork
   * is the label's, so it is not committed to this repo. The card falls back to
   * a plain sleeve if the file is missing.
   */
  art: "/music/parachutes.jpg",
};

/**
 * Rest of the playlist, shown under the now-playing line. Titles and artists
 * confirmed by Spurti.
 */
export const UP_NEXT: { title: string; artist: string }[] = [
  { title: "Sparks", artist: "Coldplay" },
  { title: "Stargazing", artist: "Myles Smith" },
  { title: "WHERE IS MY HUSBAND!", artist: "RAYE" },
  { title: "Sunflower", artist: "Post Malone & Swae Lee" },
];

/**
 * Contact thread.
 *
 * Her side is scripted; the visitor's answers live in component state only and
 * end up in a prefilled mailto. Nothing is posted anywhere.
 */
export const THREAD_WHO = {
  name: "Spurti",
  avatar: spurtiAvatar,
};

/** Shown before the visitor types, so the card opens as a conversation. */
export const THREAD_OPENING = [
  "want to work together? just want to chat? message me here.",
];

export const THREAD_SCRIPT: { ask: string; placeholder: string; reply?: string }[] = [
  {
    ask: "who am I talking to?",
    placeholder: "iMessage",
    reply: "nice to meet you",
  },
  {
    ask: "what did you want to talk about?",
    placeholder: "a sentence is plenty",
    reply: "got it — I read everything, usually same day.",
  },
];

/**
 * Photo tabs, after the reference's floating segmented bar.
 * Add a tab by adding an entry; `src` must be an imported asset.
 */
export const PHOTO_TABS: { id: string; label: string; src: string }[] = [
  { id: "all", label: "All", src: simbaPhoto },
  { id: "stanford", label: "Stanford", src: stanfordPhoto },
  { id: "work", label: "Work", src: slackPhoto },
  { id: "simba", label: "Simba", src: simbaAlt },
];

export { ENTITY_DEFS };
