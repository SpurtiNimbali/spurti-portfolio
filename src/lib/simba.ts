export const SIMBA_POSES = [
  { level: 0, label: "quiet", pose: "curled up asleep" },
  { level: 1, label: "modest", pose: "lying down, head up" },
  { level: 2, label: "warm", pose: "sitting" },
  { level: 3, label: "confident", pose: "standing, ears up" },
  { level: 4, label: "bold", pose: "play bow, mid-bark" },
  { level: 5, label: "undeniable", pose: "up on hind legs, mid-leap" },
] as const;

export function simbaAriaText(index: number) {
  const p = SIMBA_POSES[index] ?? SIMBA_POSES[3];
  return `${p.label} — ${p.pose}`;
}
