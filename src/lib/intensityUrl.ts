import { DEFAULT_INTENSITY } from "../content";

/** The default tone is implied, so only a changed one travels in the URL. */
function applyIntensity(url: URL, intensity: number) {
  if (intensity === DEFAULT_INTENSITY) {
    url.searchParams.delete("v");
  } else {
    url.searchParams.set("v", String(intensity));
  }
}

export function withIntensity(path: string, intensity: number): string {
  const url = new URL(path, window.location.origin);
  applyIntensity(url, intensity);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function withIntensityPath(path: string, intensity: number): string {
  const hashIndex = path.indexOf("#");
  const base = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const url = new URL(base, window.location.origin);
  applyIntensity(url, intensity);
  return `${url.pathname}${url.search}${hash}`;
}
