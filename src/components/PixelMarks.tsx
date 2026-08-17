import type { CSSProperties, ReactNode } from "react";
import cardea from "../assets/project-cardea.png";
import dares from "../assets/project-dares.png";
import dysdiag from "../assets/research-dysdiag.png";
import mindbridge from "../assets/research-mindbridge.png";
/*
 * The same background-knocked-out cutout the hero sentence peels off, imported
 * rather than re-derived so a better cutout from tools/make-sticker.py drops in
 * here for free. src/lib/stickers.ts owns the hero's copy of this asset.
 */
import cutout from "../assets/sticker-placeholder.png";

/**
 * Marks follow the reference's construction: an extruded side wall behind a
 * front face, a recessed cream panel, a grain wash, then the glyph — every
 * shape carrying a dark outline stroke.
 */

const OUTLINE = "#0044A7";

/** Positions a bloom layer: offsets/rotation it springs to on hover. */
function bloom(index: number, tx: number, ty: number, rot: number): CSSProperties {
  return {
    "--d": String(index),
    "--tx": `${tx}px`,
    "--ty": `${ty}px`,
    "--rot": `${rot}deg`,
  } as CSSProperties;
}

function Grain({ id }: { id: string }) {
  return (
    <>
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <clipPath id={`${id}-clip`}>
        <rect x="11" y="12" width="84" height="84" rx="28" />
      </clipPath>
    </>
  );
}

function ProjectsIcon() {
  return (
    <svg className="pw-icon" viewBox="0 0 110 110" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="pj-edge" x1="105" y1="55" x2="5" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset=".096" stopColor="#6EC5FF" />
          <stop offset=".303" stopColor="#417ADE" />
          <stop offset=".77" stopColor="#417ADE" />
          <stop offset=".919" stopColor="#6EC5FF" />
        </linearGradient>
        <linearGradient id="pj-face" x1="53" y1="6" x2="53" y2="102" gradientUnits="userSpaceOnUse">
          <stop offset=".1" stopColor="#00399A" />
          <stop offset=".88" stopColor="#007AFF" />
        </linearGradient>
        <linearGradient id="pj-cream" x1="53" y1="12" x2="53" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFDBA8" />
          <stop offset="1" stopColor="#FFEFD8" />
        </linearGradient>
        <linearGradient id="pj-ring" x1="76" y1="30" x2="30" y2="78" gradientUnits="userSpaceOnUse">
          <stop stopColor="#479BFF" />
          <stop offset="1" stopColor="#004FA4" />
        </linearGradient>
        <filter id="pj-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feColorMatrix in="SourceAlpha" result="a" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feGaussianBlur stdDeviation="7" />
          <feComposite in2="a" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix values="0 0 0 0 0.21 0 0 0 0 0.80 0 0 0 0 1 0 0 0 1 0" />
          <feBlend in2="SourceGraphic" />
        </filter>
        <Grain id="pj-grain" />
      </defs>

      {/* outer bezel, with the extruded wall reading as a rim highlight */}
      <rect x="4" y="4" width="102" height="102" rx="34" fill="url(#pj-edge)" stroke={OUTLINE} strokeWidth="1.3" />
      <g filter="url(#pj-glow)">
        <rect x="8" y="8" width="94" height="94" rx="31" fill="url(#pj-face)" />
      </g>
      <rect x="8" y="8" width="94" height="94" rx="31" fill="none" stroke={OUTLINE} strokeWidth="1.1" />
      {/* recessed cream panel, grain washed over it */}
      <rect x="15" y="15" width="80" height="80" rx="25" fill="url(#pj-cream)" stroke={OUTLINE} strokeWidth="1.1" />
      <g clipPath="url(#pj-grain-clip)">
        <rect
          x="15"
          y="15"
          width="80"
          height="80"
          filter="url(#pj-grain)"
          opacity=".42"
          style={{ mixBlendMode: "multiply" }}
        />
      </g>
      {/* solid tilted disc with a sparkle sitting on it */}
      <g transform="rotate(-19 55 56)">
        <ellipse cx="55" cy="56" rx="31" ry="13.5" fill="url(#pj-ring)" stroke={OUTLINE} strokeWidth=".9" />
        <ellipse cx="47" cy="51" rx="17" ry="6" fill="#5FA8FF" opacity=".45" />
      </g>
      <path
        fill="#fff"
        d="M55 36.5c1.9 12.9 4.7 15.7 17.6 17.6C59.7 56 56.9 58.8 55 71.7c-1.9-12.9-4.7-15.7-17.6-17.6C50.3 52.2 53.1 49.4 55 36.5Z"
      />
      <path fill="#fff" fillOpacity=".95" d="M74 60c.6 4.1 1.5 5 5.6 5.6-4.1.6-5 1.5-5.6 5.6-.6-4.1-1.5-5-5.6-5.6 4.1-.6 5-1.5 5.6-5.6Z" />
    </svg>
  );
}

const CUBE_W = 20;
const CUBE_H = 11.5;
const CUBE_D = 23;

function Cube({ cx, cy, faces }: { cx: number; cy: number; faces: [string, string, string] }) {
  const pts = (p: number[][]) => p.map(([x, y]) => `${+x.toFixed(1)},${+y.toFixed(1)}`).join(" ");
  const [top, left, right] = faces;
  return (
    <g stroke="#000" strokeWidth=".78" strokeLinejoin="round">
      <polygon
        fill={top}
        points={pts([[cx, cy], [cx + CUBE_W, cy + CUBE_H], [cx, cy + 2 * CUBE_H], [cx - CUBE_W, cy + CUBE_H]])}
      />
      <polygon
        fill={left}
        points={pts([
          [cx - CUBE_W, cy + CUBE_H],
          [cx, cy + 2 * CUBE_H],
          [cx, cy + 2 * CUBE_H + CUBE_D],
          [cx - CUBE_W, cy + CUBE_H + CUBE_D],
        ])}
      />
      <polygon
        fill={right}
        points={pts([
          [cx + CUBE_W, cy + CUBE_H],
          [cx, cy + 2 * CUBE_H],
          [cx, cy + 2 * CUBE_H + CUBE_D],
          [cx + CUBE_W, cy + CUBE_H + CUBE_D],
        ])}
      />
    </g>
  );
}

/**
 * Isometric grid (i, j, k) -> screen. Listed far-to-near so painter order is
 * just array order; `dx`/`dy` detaches the lime cube from the cluster.
 */
type CubeSpec = { i: number; j: number; k: number; dx?: number; dy?: number; faces: [string, string, string] };

const CUBES: CubeSpec[] = [
  { i: 0, j: 0, k: 0, faces: ["#D09900", "#8F6A00", "#A87C00"] },
  { i: 0, j: 0, k: 1, faces: ["#FF81FF", "#C43FC4", "#E05FE0"] },
  { i: 1, j: 0, k: 0, faces: ["#FFBC03", "#B78C14", "#C47200"] },
  { i: 0, j: 1, k: 0, faces: ["#27C300", "#12820F", "#1FA80C"] },
  { i: 1, j: 0, k: 1, faces: ["#007AFF", "#145FB1", "#0A6DD8"] },
  { i: 0, j: 1, k: 1, dx: -8, dy: -5, faces: ["#A4EE00", "#6B9C00", "#86C400"] },
  { i: 1, j: 1, k: 0, faces: ["#FFBC03", "#C47200", "#D09900"] },
  { i: 1, j: 1, k: 1, faces: ["#03E6FF", "#17A6B6", "#06C4DA"] },
];

function ResearchIcon() {
  return (
    <svg className="pw-icon pw-icon--cubes" viewBox="0 0 110 110" fill="none" aria-hidden="true">
      {CUBES.map(({ i, j, k, dx = 0, dy = 0, faces }) => (
        <Cube
          key={`${i}-${j}-${k}`}
          cx={55 + (i - j) * CUBE_W + dx}
          cy={30 + (i + j) * CUBE_H - k * CUBE_D + dy}
          faces={faces}
        />
      ))}
    </svg>
  );
}

function Card({
  className,
  style,
  shot,
  children,
}: {
  className: string;
  style: CSSProperties;
  shot?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${className}${shot ? " is-shot" : ""}`} style={style}>
      {shot ? <img className="pw-shot" src={shot} alt="" /> : children}
    </div>
  );
}

export function ProjectsMark({ shots = [cardea, dares] }: { shots?: (string | undefined)[] }) {
  return (
    <div className="pw-stage" aria-hidden="true">
      <div className="pw-bloom">
        <Card className="pw-ui pw-ui--peach" style={bloom(0, -116, -54, -14)} shot={shots[0]}>
          <span className="pw-ui__pill">All Projects</span>
          <strong>Select project type</strong>
          <span className="pw-row">
            <b className="pw-row__dot pw-row__dot--coin" />
            <i />
          </span>
          <span className="pw-row">
            <b className="pw-row__dot pw-row__dot--clock" />
            <i />
          </span>
          <span className="pw-row">
            <b className="pw-row__dot pw-row__dot--cal" />
            <i />
          </span>
        </Card>

        <Card className="pw-ui pw-ui--blue" style={bloom(1, 74, -82, 11)} shot={shots[1]}>
          <div className="pw-ui__hero" />
          <strong>Mobile app design</strong>
          <span className="pw-ui__meta">
            <i />
            <i />
          </span>
        </Card>

        <div className="pw-key" style={bloom(2, 104, 44, -8)}>
          <span>⌘K</span>
        </div>

        <Chip kind="code" style={bloom(3, -186, 40, -9)} />
        <Chip kind="spark" style={bloom(4, 150, -24, 11)} />
      </div>

      <div className="pw-icon-wrap">
        <ProjectsIcon />
      </div>
    </div>
  );
}

export function ResearchMark({ shots = [dysdiag, mindbridge] }: { shots?: (string | undefined)[] }) {
  return (
    <div className="pw-stage" aria-hidden="true">
      <div className="pw-bloom">
        <Card className="pw-win pw-win--back" style={bloom(0, -92, -48, -12)} shot={shots[0]}>
          <div className="pw-win__bar">
            <b />
            <b />
            <b />
          </div>
          <div className="pw-win__grid">
            <span />
            <span />
            <span />
            <span />
          </div>
        </Card>

        <Card className="pw-win pw-win--front" style={bloom(1, 72, -100, 10)} shot={shots[1]}>
          <div className="pw-win__bar">
            <b />
            <b />
            <b />
          </div>
          <div className="pw-win__body">
            <p>Abode</p>
            <div className="pw-win__tags">
              <em>Swift</em>
              <em>Node</em>
            </div>
          </div>
        </Card>

        <Chip kind="chart" style={bloom(2, -206, 12, -9)} />
        <Chip kind="pulse" style={bloom(3, 182, -28, 10)} />
      </div>

      <div className="pw-icon-wrap pw-icon-wrap--cubes">
        <ResearchIcon />
      </div>
    </div>
  );
}

type ChipKind = "code" | "spark" | "chart" | "pulse";

type ChipPaint = { from: string; to: string; edge: string; line: string };

const CHIP_PAINT: Record<ChipKind, ChipPaint> = {
  code: { from: "#9CBEFF", to: "#3D6FF0", edge: "#2450C4", line: "#16357F" },
  spark: { from: "#FFE79A", to: "#F2B417", edge: "#C98A00", line: "#8A5F00" },
  chart: { from: "#86E3AE", to: "#33B473", edge: "#1E8A55", line: "#135F3B" },
  pulse: { from: "#9CBEFF", to: "#3D6FF0", edge: "#2450C4", line: "#16357F" },
};

/** Glyphs live in the 48-unit chip box, roughly inset to 10..38. */
function ChipGlyph({ kind }: { kind: ChipKind }) {
  switch (kind) {
    case "code":
      return (
        <path
          fill="#fff"
          d="M19.6 14.6 22.3 17.4 15.6 24l6.7 6.6-2.7 2.8L10.2 24zM28.4 14.6 37.8 24l-9.4 9.4-2.7-2.8L32.4 24l-6.7-6.6z"
        />
      );
    case "spark":
      return (
        <path
          fill="#fff"
          d="M24 10c1.1 8.8 2.6 10.3 11.4 11.4C26.6 22.5 25.1 24 24 32.8c-1.1-8.8-2.6-10.3-11.4-11.4C21.4 20.3 22.9 18.8 24 10Z"
        />
      );
    case "chart":
      return (
        <g fill="#fff">
          <rect x="13.5" y="27" width="5.4" height="9.5" rx="1.6" />
          <rect x="21.3" y="21" width="5.4" height="15.5" rx="1.6" />
          <rect x="29.1" y="14.5" width="5.4" height="22" rx="1.6" />
        </g>
      );
    case "pulse":
      return (
        <path
          fill="none"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11 25h4.6l3.1-8.4 4.6 15.6 3.7-10.4 2.5 5.6h7.5"
        />
      );
  }
}

function Chip({ kind, style }: { kind: ChipKind; style: CSSProperties }) {
  const paint = CHIP_PAINT[kind];
  const id = `chipface-${kind}`;
  return (
    <svg className="pw-chip" viewBox="0 0 48 48" fill="none" style={style}>
      <defs>
        <linearGradient id={id} x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor={paint.from} />
          <stop offset="1" stopColor={paint.to} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect x="4" y="4" width="38" height="38" rx="12" />
        </clipPath>
      </defs>
      <rect x="7" y="8" width="38" height="38" rx="12" fill={paint.edge} stroke={paint.line} strokeWidth="1.4" />
      <rect x="4" y="4" width="38" height="38" rx="12" fill={`url(#${id})`} />
      <g clipPath={`url(#${id}-clip)`}>
        <ChipGlyph kind={kind} />
      </g>
      <rect x="4" y="4" width="38" height="38" rx="12" fill="none" stroke={paint.line} strokeWidth="1.4" />
    </svg>
  );
}

/*
 * Read Me objects are built like the keycap: a solid face sitting on a hard
 * extruded base, every shape outlined. Each one is a specific thing about her
 * rather than a stock symbol.
 */

/*
 * India, derived from the DataMeet national boundary rather than drawn by eye:
 * equirectangular projection scaled by cos(mean latitude), then Douglas-Peucker
 * down to 98 points. That count keeps the four features the silhouette is
 * recognised by — the Kashmir spur, the Kathiawar bulge, the concave sweep into
 * the Bay of Bengal, and the taper to Kanyakumari — while staying crisp at the
 * 66px it renders at as an accent.
 */
const INDIA = `M33.3 9.2 39.1 7.4 42.5 9.2 39.3 14.3 37.7 14.4 39.8 18.8 37.9 20 37.2 18.8
36.1 19.3 37.3 23.5 44.5 27.2 41.5 32.1 49.9 36.7 54.4 36.6 57.8 39.2 66.7 40.6 67.1 35.2
68.7 34.5 70.3 39.1 79.6 38.9 78.3 35.8 80.9 35.7 87.8 30.5 89.8 31.3 92.3 30.2 94.1 32.4
93.4 33.2 96.6 34.9 95 36.3 95.7 38.1 92.9 37.4 89.4 39.7 86.3 49.3 83.6 48.4 82.3 55.8
80.3 49.7 78.2 52.4 76.7 50.1 80.8 45.2 72.5 44.3 72 41 71 41.8 67.9 39.7 67 42.5 69.9 44.4
66.7 46.4 69 47.8 70.2 56.9 68.7 55.4 67.5 57.1 66.7 54.8 66.1 56.7 63.2 57.9 63.7 60
61.5 62.7 57.3 64.6 48.6 72.7 48.6 74.4 42.1 77.4 40.8 95.9 39 96.1 37.7 98.7 38.6 99.4
35.7 100.3 33.4 103.6 30.2 100.8 20.4 76.1 17.9 63.1 18.7 56.7 17.4 55.7 18.7 54.7 16.8
54.6 16.1 58.4 12 60.1 6 54.6 10 53.8 10.8 52.3 6.9 52.7 4.4 50.4 5.6 49.1 3.6 50 5.6 47.6
13 47.3 8.1 37.8 10.6 34.9 12.2 36 15.5 35.1 24.4 24.4 24.1 21.5 26.5 20.4 21 17.4 20.2 13
22.6 10.4 17.6 7.9 17.5 6.6 21.7 4.9 21.1 4.2 25.8 3.8Z`;

/*
 * The Siliguri corridor is sub-pixel at this size, so the north-east arm reads as
 * severed. Stroking each layer with its own paint dilates the silhouette, which
 * thickens the corridor and shallows the Bangladesh notch without touching the
 * geometry. The dark layer is stroked wider, and the difference is the outline.
 */
const IN_DILATE = 3.8;
const IN_OUTLINE = 7.2;

function IndiaObject({ style }: { style: CSSProperties }) {
  return (
    <svg className="pw-obj pw-obj--india" viewBox="0 0 100.2 114.2" fill="none" style={style}>
      <defs>
        <linearGradient id="in-face" x1="18" y1="8" x2="80" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFC978" />
          <stop offset=".55" stopColor="#F79A2B" />
          <stop offset="1" stopColor="#E07C12" />
        </linearGradient>
        <linearGradient id="in-shade" x1="0" y1="0" x2="0" y2="104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity=".3" />
          <stop offset=".44" stopColor="#fff" stopOpacity="0" />
          <stop offset=".64" stopColor="#8A4A08" stopOpacity="0" />
          <stop offset="1" stopColor="#8A4A08" stopOpacity=".32" />
        </linearGradient>
      </defs>

      {/* extruded side wall */}
      <g transform="translate(0 7)">
        <path d={INDIA} fill="#5E2C04" stroke="#5E2C04" strokeWidth={IN_OUTLINE} strokeLinejoin="round" />
        <path d={INDIA} fill="#A3510A" stroke="#A3510A" strokeWidth={IN_DILATE} strokeLinejoin="round" />
      </g>

      {/* top face: outline, then the face and its top-light inside it */}
      <path d={INDIA} fill="#5E2C04" stroke="#5E2C04" strokeWidth={IN_OUTLINE} strokeLinejoin="round" />
      <path
        d={INDIA}
        fill="url(#in-face)"
        stroke="url(#in-face)"
        strokeWidth={IN_DILATE}
        strokeLinejoin="round"
      />
      <path
        d={INDIA}
        fill="url(#in-shade)"
        stroke="url(#in-shade)"
        strokeWidth={IN_DILATE}
        strokeLinejoin="round"
      />

      {/* Delhi, projected through the same transform as the boundary */}
      <path
        d="M32.4 28.4c.45 3.2 1.05 3.8 4.25 4.25-3.2.45-3.8 1.05-4.25 4.25-.45-3.2-1.05-3.8-4.25-4.25 3.2-.45 3.8-1.05 4.25-4.25Z"
        fill="#fff"
        stroke="#5E2C04"
        strokeWidth=".9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BobaObject({ style }: { style: CSSProperties }) {
  return (
    <svg className="pw-obj pw-obj--boba" viewBox="0 0 72 108" fill="none" style={style}>
      <defs>
        <linearGradient id="bb-cup" x1="16" y1="44" x2="58" y2="98" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2D3AC" />
          <stop offset=".5" stopColor="#D9A473" />
          <stop offset="1" stopColor="#B87C48" />
        </linearGradient>
      </defs>

      {/* straw first so the lid overlaps its base */}
      <g transform="rotate(15 48 26)">
        <rect x="43" y="4" width="10" height="40" rx="5" fill="#FF7FA8" stroke="#8E2E52" strokeWidth="1.7" />
      </g>

      <path
        d="M17 42h38l-4.6 50a7 7 0 0 1-7 6.4H28.6a7 7 0 0 1-7-6.4z"
        fill="url(#bb-cup)"
        stroke="#5A3A1C"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M24 46h5l-3.4 47h-3z" fill="#fff" opacity=".3" />

      <g fill="#3B2415">
        <circle cx="28" cy="86" r="4.2" />
        <circle cx="37" cy="89" r="4.2" />
        <circle cx="45" cy="85" r="4" />
        <circle cx="33" cy="79" r="3.8" />
        <circle cx="42" cy="78" r="3.6" />
      </g>

      <rect x="11" y="32" width="50" height="13" rx="5" fill="#FFF6E8" stroke="#5A3A1C" strokeWidth="1.8" />
      <ellipse cx="36" cy="32" rx="25" ry="7" fill="#FFFCF4" stroke="#5A3A1C" strokeWidth="1.8" />
    </svg>
  );
}

/**
 * Read Me scatters actual artifacts rather than a generic icon set — the things
 * the hero sentence already claims.
 */
export function ReadMeMark() {
  return (
    <div className="pw-stage pw-stage--me" aria-hidden="true">
      {/*
       * Three objects, so each one is large: the terminal carries the dominant
       * weight at the mass of a Projects card, India is a strong second, and the
       * cup is the one accent. The terminal fans up to her left and India up to
       * her right so the two heavy pieces flank the cutout; the cup sits bottom
       * left, tucked into her contour, rather than stacking under India.
       *
       * Overlaps are real: India lies over the terminal, the cup under her
       * lower-left edge, and the terminal under her hair. DOM order is the
       * z-order and is chosen for that; the stagger index is passed separately
       * so the big pieces still arrive first.
       *
       * The anchor is a cutout rather than a framed square, so its top corners
       * are empty and objects nestle into the contour there, while anything
       * crossing her shoulders is genuinely occluded.
       */}
      <div className="pw-bloom">
        {/*
         * Raised enough that her hair crosses the window's lower edge rather than
         * its output, so it tucks behind her without cutting the text.
         */}
        <div className="pw-art pw-art--term" style={bloom(0, -104, -132, -8)}>
          <div className="pw-term__bar">
            <b />
            <b />
            <b />
            <span>~/spurti</span>
          </div>
          <div className="pw-term__body">
            <p>
              <b className="pw-term__prompt">$</b> whoami
            </p>
            <p>
              <b className="pw-term__prompt">$</b> ls ~/things
            </p>
            <p className="pw-term__out">poems/ papers/ simba.jpg</p>
            <p>
              <b className="pw-term__prompt">$</b>
              <i className="pw-term__caret" />
            </p>
          </div>
        </div>

        <IndiaObject style={bloom(1, 118, -46, 11)} />
        {/*
         * Bottom left, tucked into her lower-left contour rather than free in
         * the corner: the terminal's lower edge climbs away to the right, so the
         * far corner has nothing to sit against. Rotation is mirrored (+10 vs
         * the terminal's -8) so the two do not read as parallel. Kept above the
         * caption ink (y 79) — a naive mirror of the old 98,72 would collide.
         */}
        <BobaObject style={bloom(2, -100, 28, 10)} />
      </div>

      <div className="pw-icon-wrap">
        <div className="pw-portrait">
          <img src={cutout} alt="" />
        </div>
      </div>
    </div>
  );
}
