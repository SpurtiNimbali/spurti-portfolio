import type { ReactElement } from "react";

/**
 * About-page objects, built the same way the project ones are: a solid face on
 * a hard extruded back, a dark outline on every shape, one saturated body
 * colour and interior detail in cream.
 *
 * They replace the app-icon tiles that used to sit in these card corners. Those
 * were flat chips in three other companies' brand colours — the wrong idiom for
 * a site whose every other page carries dimensional objects, and, in Apple's
 * case, artwork its identity guidelines don't allow inside a third-party
 * interface. Each object here is the thing the card is about instead of the
 * service it happens to use: a tape, a stack of prints, a letter.
 *
 * Size and shadow live in about.css on `--mark`, because each of these fills its
 * viewBox differently and a shared width would make the squat one read as
 * twice the size of the tall one.
 */

export type AboutObjectKind = "cassette" | "prints" | "envelope";

/** Now playing: a tape, because a playlist is a mixtape with extra steps. */
function CassetteObject() {
  return (
    <svg className="ab-obj ab-obj--cassette" viewBox="0 0 96 74" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="abo-tape" x1="14" y1="6" x2="78" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE79A" />
          <stop offset="1" stopColor="#EDA80C" />
        </linearGradient>
      </defs>

      <rect x="12" y="10" width="80" height="58" rx="11" fill="#BE7F00" stroke="#7E5600" strokeWidth="1.8" />
      <rect x="8" y="6" width="80" height="58" rx="11" fill="url(#abo-tape)" stroke="#7E5600" strokeWidth="1.8" />

      <rect x="15" y="12" width="66" height="19" rx="4" fill="#FFF6DC" stroke="#7E5600" strokeWidth="1.5" />
      <g stroke="#E0A50C" strokeWidth="2.4" strokeLinecap="round">
        <path d="M22 19h40M22 25h26" />
      </g>

      <rect x="16" y="36" width="64" height="24" rx="7" fill="#C98A00" stroke="#7E5600" strokeWidth="1.5" />
      <path d="M42 48h11" stroke="#7E5600" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="33" cy="48" r="8.5" fill="#FFF6DC" stroke="#7E5600" strokeWidth="1.4" />
      <circle cx="63" cy="48" r="8.5" fill="#FFF6DC" stroke="#7E5600" strokeWidth="1.4" />
      <circle cx="33" cy="48" r="3" fill="#F04E22" stroke="#7E5600" strokeWidth="1.2" />
      <circle cx="63" cy="48" r="3" fill="#F04E22" stroke="#7E5600" strokeWidth="1.2" />
    </svg>
  );
}

/** The photo card: a fanned stack of prints, the same object the stickers are. */
function PrintsObject() {
  return (
    <svg className="ab-obj ab-obj--prints" viewBox="0 0 96 94" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="abo-shot" x1="32" y1="26" x2="76" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#86E3AE" />
          <stop offset="1" stopColor="#2F9E67" />
        </linearGradient>
      </defs>

      <rect
        x="14"
        y="20"
        width="54"
        height="64"
        rx="4.5"
        fill="#EFE6D2"
        stroke="#135F3B"
        strokeWidth="1.6"
        transform="rotate(-19 46 52)"
      />
      <rect
        x="20"
        y="19"
        width="54"
        height="64"
        rx="4.5"
        fill="#FBF4E4"
        stroke="#135F3B"
        strokeWidth="1.6"
        transform="rotate(-9 46 52)"
      />

      <rect x="30" y="24" width="54" height="64" rx="4.5" fill="#2F5C46" stroke="#135F3B" strokeWidth="1.8" />
      <rect x="26" y="20" width="54" height="64" rx="4.5" fill="#FFFDF4" stroke="#135F3B" strokeWidth="1.8" />

      <rect x="31" y="25" width="44" height="45" rx="2.5" fill="url(#abo-shot)" stroke="#135F3B" strokeWidth="1.3" />
      {/* One rolling hill rather than two peaks: two peaks and a disc is the
          broken-image glyph, and this is meant to be a photograph. */}
      <path d="M31.5 69.5V60c7-9 12-11.5 17-7 6 5.4 14 9.6 26 8.8v7.7z" fill="#FFF6DC" />
      <circle cx="63" cy="37" r="5.4" fill="#FFD166" stroke="#135F3B" strokeWidth="1.2" />
      <path d="M38 77h30" stroke="#2F9E67" strokeWidth="2.4" strokeLinecap="round" opacity=".5" />
    </svg>
  );
}

/** Say hi: a letter half out of its envelope, which is all this card is. */
function EnvelopeObject() {
  return (
    <svg className="ab-obj ab-obj--envelope" viewBox="0 0 96 86" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="abo-post" x1="14" y1="34" x2="82" y2="78" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9CBEFF" />
          <stop offset="1" stopColor="#3D6FF0" />
        </linearGradient>
      </defs>

      <rect x="12" y="28" width="80" height="52" rx="9" fill="#2A55C4" stroke="#16357F" strokeWidth="1.8" />
      <rect x="8" y="24" width="80" height="52" rx="9" fill="#3D6FF0" stroke="#16357F" strokeWidth="1.8" />

      <rect x="27" y="4" width="42" height="52" rx="3.5" fill="#FFF6DC" stroke="#16357F" strokeWidth="1.5" />
      <g stroke="#6E97F6" strokeWidth="2.6" strokeLinecap="round">
        <path d="M34 17h28M34 26h28M34 35h16" />
      </g>

      <path
        d="M8 34 48 58 88 34v33q0 9-9 9H17q-9 0-9-9z"
        fill="url(#abo-post)"
        stroke="#16357F"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="48" cy="57" r="5.5" fill="#F04E22" stroke="#16357F" strokeWidth="1.4" />
    </svg>
  );
}

const OBJECTS: Record<AboutObjectKind, () => ReactElement> = {
  cassette: CassetteObject,
  prints: PrintsObject,
  envelope: EnvelopeObject,
};

/**
 * An object at card-corner size. The wrapper carries the class the stylesheet
 * hangs `--mark` and the hover lift off, so the component stays scale-free.
 */
export function AboutMark({ kind }: { kind: AboutObjectKind }) {
  const Shape = OBJECTS[kind];
  return (
    <span className={`ab-mark ab-mark--${kind}`}>
      <Shape />
    </span>
  );
}
