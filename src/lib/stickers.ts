import simbaSit from "../assets/sticker-simba-1.webp";
import simbaBowtie from "../assets/sticker-simba-2.webp";
import simbaSweater from "../assets/sticker-simba-3.webp";
import simbaSock from "../assets/sticker-simba-4.webp";
import slackEvent from "../assets/sticker-slack.webp";
import slackLobby from "../assets/sticker-slack-2.webp";
import slackEntry from "../assets/sticker-slack-3.webp";
import slackTower from "../assets/sticker-slack-4.webp";
import stanfordRainbow from "../assets/sticker-stanford.webp";
import stanfordStadium from "../assets/sticker-stanford-2.webp";
import stanfordWins from "../assets/sticker-stanford-3.webp";
import stanfordPalms from "../assets/sticker-stanford-4.webp";

/**
 * Photos that peel off an underlined word, one click at a time, after
 * ky.fyi's Samwise. Every word uses the same list: add a file, push one
 * entry, cap at four. A click places the next unplaced photo; further
 * clicks wiggle once the list is out.
 *
 * `cutout` frames are die-cut (run the photo through `tools/make-sticker.py`).
 * Polaroid / tape / torn / ink are cropped rectangles with CSS chrome.
 */
export type StickerKey = "simba" | "stanford" | "slack";

export type PrintFrame = "polaroid" | "tape" | "torn" | "ink" | "cutout";

export type Print = {
  src: string;
  /** Photo width in px; frame chrome is added by `printBox`. */
  width: number;
  /** Photo height ÷ width. */
  photoAspect: number;
  /** Degrees off square. Stays under about 10: these are tilted, never turned. */
  tilt: number;
  frame: PrintFrame;
  /** Rim just outside the white edge — only used by `cutout`. */
  tint?: string;
};

/** Must match the CSS padding (and ink border) on `.print--*`. */
export const PRINT_CHROME: Record<PrintFrame, { top: number; right: number; bottom: number; left: number }> = {
  polaroid: { top: 12, right: 12, bottom: 38, left: 12 },
  tape: { top: 7, right: 7, bottom: 7, left: 7 },
  torn: { top: 9, right: 9, bottom: 9, left: 9 },
  ink: { top: 11, right: 11, bottom: 11, left: 11 },
  cutout: { top: 0, right: 0, bottom: 0, left: 0 },
};

export function printBox(print: Print) {
  const c = PRINT_CHROME[print.frame];
  const w = print.width + c.left + c.right;
  const h = print.width * print.photoAspect + c.top + c.bottom;
  return { w, h, aspect: h / w };
}

/** Same cap for every word — Simba, Stanford, Slack. Adding a file is one entry. */
export const PRINT_CAP = 4;

export function printsFor(key: StickerKey): Print[] {
  return PRINTS[key].slice(0, PRINT_CAP);
}

export const PRINTS: Record<StickerKey, Print[]> = {
  simba: [
    {
      src: simbaSit,
      width: 214,
      photoAspect: 519 / 348,
      tilt: -6,
      frame: "cutout",
      tint: "#d4b48a",
    },
    {
      src: simbaBowtie,
      width: 124,
      photoAspect: 900 / 719,
      tilt: 5,
      frame: "torn",
    },
    {
      src: simbaSweater,
      width: 186,
      photoAspect: 668 / 900,
      tilt: -4,
      frame: "tape",
    },
    {
      src: simbaSock,
      width: 148,
      photoAspect: 900 / 589,
      tilt: 8,
      frame: "polaroid",
    },
  ],
  slack: [
    {
      src: slackEvent,
      width: 208,
      photoAspect: 600 / 900,
      tilt: 6,
      frame: "ink",
    },
    /*
     * These three are portrait. They are narrower than the landscape prints so
     * the taller frame still occupies about the same patch of margin.
     */
    {
      src: slackLobby,
      width: 132,
      photoAspect: 5712 / 4284,
      tilt: -5,
      frame: "polaroid",
    },
    {
      src: slackEntry,
      width: 156,
      photoAspect: 5712 / 4284,
      tilt: 4,
      frame: "tape",
    },
    {
      src: slackTower,
      width: 118,
      photoAspect: 5712 / 4284,
      tilt: -7,
      frame: "torn",
    },
  ],
  stanford: [
    {
      src: stanfordRainbow,
      width: 168,
      photoAspect: 900 / 720,
      tilt: -8,
      frame: "polaroid",
    },
    {
      src: stanfordStadium,
      width: 198,
      photoAspect: 2164 / 3848,
      tilt: 5,
      frame: "tape",
    },
    {
      src: stanfordWins,
      width: 128,
      photoAspect: 5712 / 4284,
      tilt: -4,
      frame: "torn",
    },
    {
      src: stanfordPalms,
      width: 156,
      photoAspect: 5540 / 4154,
      tilt: 7,
      frame: "ink",
    },
  ],
};
