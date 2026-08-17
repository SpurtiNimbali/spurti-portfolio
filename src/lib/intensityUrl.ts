export function withIntensity(path: string, intensity: number): string {
  const url = new URL(path, window.location.origin);
  url.searchParams.set("v", String(intensity));
  return `${url.pathname}${url.search}${url.hash}`;
}

export function withIntensityPath(path: string, intensity: number): string {
  const hashIndex = path.indexOf("#");
  const base = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const url = new URL(base, window.location.origin);
  url.searchParams.set("v", String(intensity));
  return `${url.pathname}${url.search}${hash}`;
}
