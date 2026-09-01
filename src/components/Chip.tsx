import type { CSSProperties } from "react";

/**
 * The accent chip shared by the home page marks and the project bands: a solid
 * face on a hard extruded base, every shape carrying a dark outline, one white
 * glyph on top. Both pages import this rather than restating it, so the two
 * never drift apart.
 */

export type ChipKind = "code" | "spark" | "chart" | "pulse";

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

export function Chip({
  kind,
  className = "pw-chip",
  style,
}: {
  kind: ChipKind;
  className?: string;
  style?: CSSProperties;
}) {
  const paint = CHIP_PAINT[kind];
  const id = `chipface-${kind}`;
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true" style={style}>
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
