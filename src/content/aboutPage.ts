// /about-preview content.
//
// Layout follows marco.fyi/about: a copy card on the left holding every
// section, a widget grid on the right, nav pill centred at the top.
//
// Type scale measured off that page with getComputedStyle:
//   body   18px / w400 / line-height 1.8
// Ours matches at full width and steps down to 14px on a phone.
//
// The copy card used to be six labelled answers. It is now one continuous bio
// in her own words, so it carries no headings — the copy card's prose scrolls
// inside its own box when a viewport is too short for all of it. The page
// itself still never scrolls.
//
// {{Simba}}, {{Stanford}} and {{Slack}} render as squiggle marks that peel real
// photos onto the page when clicked. The current bio uses none of them, and the
// photos card no longer spawns them either now that it carries her own
// photographs rather than the stickers; the mechanism stays wired for whenever
// the bio mentions one of the three again.

import { ENTITY_DEFS } from "./aboutEntities";
import spurtiAvatar from "../assets/spurti.png";
import paraglidersPhoto from "../assets/about-photo-paragliders.webp";
import highTeaPhoto from "../assets/about-photo-hightea.webp";
import friendsPhoto from "../assets/about-photo-friends.webp";
/* The cropped version, always. The original has a stray mouse cursor and a
   burned-in timestamp along its edges; the crop is what removes them. */
import childhoodPhoto from "../assets/about-photo-childhood-cropped.webp";

export type AboutParagraph = {
  id: string;
  body: string;
};

/**
 * Profiles the thread composer's icon row links out to.
 *
 * Same rule as ABOUT_LINKS below: an unset value renders nothing at all. An
 * icon whose href is a placeholder is a dead link wearing a logo, and there is
 * no plain-text fallback for a glyph the way there is for a phrase — so the
 * icon simply does not exist until the URL does. Filling one in is a one-line
 * change. Tracked as item 1.5 in CONTENT-TODO.md.
 */
export const ABOUT_PROFILES: Record<string, string | undefined> = {
  linkedin: undefined,
};

/**
 * Links the bio is still waiting on.
 *
 * `[[phrase]]` in a paragraph below renders as plain text until a URL lands
 * here; then, and only then, the phrase becomes a link. Filling one in is a
 * one-line change — replace the `undefined` with the URL.
 *
 * PENDING, both from Spurti: a poem to sit behind "poems", and wherever her
 * articles and papers live to sit behind "articles or papers". Tracked as item
 * 1.3 in CONTENT-TODO.md.
 *
 * Do not put a placeholder here. A `TODO:` string or a bare `#` shipped as an
 * href is a dead link on a live page; an unset value is just plain text.
 */
export const ABOUT_LINKS: Record<string, string | undefined> = {
  poems: undefined,
  "articles or papers": undefined,
};

/**
 * The bio, in her words. One continuous piece rather than labelled answers, so
 * paragraph order is the argument — don't reorder without reading it aloud.
 */
export const ABOUT_PARAGRAPHS: AboutParagraph[] = [
  {
    id: "where-from",
    body: 'I grew up across India, so "where are you from?" has never had a very short answer.',
  },
  {
    id: "delhi",
    body: "Delhi is the closest thing to home. I spent high school somewhere between neurodivergence research, science fairs, being head girl, and scribbling poetry in the margins of things I was supposed to be paying attention to.",
  },
  {
    id: "writing",
    body: "I hate reading, but I do still write: mostly [[poems]], occasionally things that somehow turn into [[articles or papers]].",
  },
  {
    id: "loves",
    body: "I love food and, more recently, attempting to cook it (results vary), cities that aren't too big or too loud, long walks, people who care deeply about obscure things, dancing till I can't walk the next day, and eternal sunshine (officially consider this my petition to ban gloomy days).",
  },
  {
    id: "home",
    body: "I'm still figuring out what home means, but I've gotten pretty good at collecting little pieces of it wherever I go. Still working on learning to keep my shoelaces tied, though.",
  },
];

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
 * The photos carousel. Four of her own photographs, cycling — no tabs and no
 * captions, because these are not four categories of anything, they are four
 * photographs. Add one by adding an entry; `src` must be an imported asset.
 *
 * `focus` is the `object-position` the frame crops around. The card's frame is
 * roughly square and these range from a 3:5 portrait to a 5:4 landscape, so
 * every one of them loses something to `object-fit: cover` — this is where each
 * photo says which part it cannot afford to lose. Nothing is cropped on disk.
 *
 * `alt` describes the photograph, not the file. Someone who cannot see these
 * should get the same four moments everyone else does.
 */
export const ABOUT_PHOTOS: { id: string; src: string; alt: string; focus: string }[] = [
  {
    id: "paragliders",
    src: paraglidersPhoto,
    alt: "Four paragliders lifting off a grassy coastal bluff above the sea, under a wide sky of scattered cloud.",
    focus: "center 55%",
  },
  {
    id: "hightea",
    src: highTeaPhoto,
    alt: "A tiered afternoon-tea stand crowded with scones, little cakes and s'mores on a marble table, beside a cup of milky tea.",
    focus: "center 48%",
  },
  {
    id: "friends",
    src: friendsPhoto,
    alt: "Four friends piled against one another, laughing, for a mirror selfie in a panelled hallway.",
    focus: "center 38%",
  },
  {
    id: "childhood",
    src: childhoodPhoto,
    alt: "Spurti as a small child in a red pinafore and a wide headband, grinning with one arm around a cream teddy bear.",
    focus: "center 45%",
  },
];

export { ENTITY_DEFS };
