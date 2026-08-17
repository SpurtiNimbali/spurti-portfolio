export function withIntensity(path: string, intensity: number): string {
  const url = new URL(path, window.location.origin);
  url.searchParams.set("v", String(intensity));
  return `${url.pathname}${url.search}`;
}
