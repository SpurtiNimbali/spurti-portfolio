function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/** 100% chroma in CSS Color 4's oklch() definition. */
const CHROMA_FULL_SCALE = 0.4;

const HUE_TO_DEG: Record<string, number> = {
  deg: 1,
  rad: 180 / Math.PI,
  grad: 0.9,
  turn: 360,
};

function channel(token: string, fullScale: number): number | null {
  if (!token) return null;
  if (token === "none") return 0;

  const percent = token.endsWith("%");
  const n = Number(percent ? token.slice(0, -1) : token);
  if (!Number.isFinite(n)) return null;
  return percent ? (n / 100) * fullScale : n;
}

function hue(token: string): number | null {
  if (!token) return null;
  if (token === "none") return 0;

  const m = token.match(/^([+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?)(deg|rad|grad|turn)?$/i);
  if (!m) return null;
  return Number(m[1]) * (m[2] ? HUE_TO_DEG[m[2].toLowerCase()] : 1);
}

/**
 * Accepts both authored and computed forms. Browsers re-serialize oklch() when
 * it comes back through getComputedStyle, so `oklch(0.955 0.014 88)` arrives as
 * `oklch(95.5% .014 88)`: lightness as a percentage, leading zeros dropped.
 */
export function parseOklch(value: string): [number, number, number] | null {
  const body = value.trim().match(/^oklch\(([^)]*)\)$/i)?.[1];
  if (!body) return null;

  const parts = body.split("/")[0].trim().split(/\s+/);
  if (parts.length < 3) return null;

  const L = channel(parts[0], 1);
  const C = channel(parts[1], CHROMA_FULL_SCALE);
  const H = hue(parts[2]);
  if (L === null || C === null || H === null) return null;

  return [L, C, H];
}

/** OKLCH → linear sRGB, using the Oklab inverse matrix. */
export function oklchToLinearSrgb(L: number, C: number, hDeg: number): [number, number, number] {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return [clamp01(r), clamp01(g), clamp01(bl)];
}

export function tokenToLinear(name: string): [number, number, number] | null {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  const parsed = parseOklch(raw);
  if (!parsed) return null;
  return oklchToLinearSrgb(...parsed);
}
