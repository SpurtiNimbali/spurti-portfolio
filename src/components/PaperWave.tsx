/**
 * The torn top edge of a band. Filled with the band's own wash so it reads as
 * that sheet of paper overlapping the one above it, with a hairline along the
 * tear so the edge stays legible when two washes sit close in tone.
 */
const EDGES = [
  "M0,44 C168,10 352,4 566,28 C782,52 986,76 1186,62 C1300,54 1382,42 1440,33",
  "M0,28 C186,60 372,72 588,55 C806,38 1014,10 1224,21 C1322,26 1392,35 1440,43",
  "M0,36 C142,62 300,66 520,46 C742,26 1004,16 1198,34 C1308,44 1388,52 1440,56",
];

export function PaperWave({ variant }: { variant: number }) {
  const curve = EDGES[variant % EDGES.length];

  return (
    <svg
      className="pj-wave"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="pj-wave__fill" d={`${curve} L1440,80 L0,80 Z`} />
      <path className="pj-wave__edge" d={curve} />
    </svg>
  );
}
