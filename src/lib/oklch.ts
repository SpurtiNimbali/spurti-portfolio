function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export function parseOklch(value: string): [number, number, number] | null {
  const m = value
    .trim()
    .match(/oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:deg)?\s*\)/i);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
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

export function tokenToLinear(name: string): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  const parsed = parseOklch(raw);
  if (!parsed) {
    throw new Error(`Expected oklch() token for ${name}, got "${raw.trim()}"`);
  }
  return oklchToLinearSrgb(...parsed);
}
