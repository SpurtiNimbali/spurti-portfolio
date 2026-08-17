export type ProjectTier = "line" | "detail" | "full";

const TIER_RANK: Record<ProjectTier, number> = {
  line: 0,
  detail: 1,
  full: 2,
};

export function tierFromIntensity(intensity: number): ProjectTier {
  if (intensity <= 1) return "line";
  if (intensity <= 3) return "detail";
  return "full";
}

export function tierAtLeast(current: ProjectTier, required: ProjectTier): boolean {
  return TIER_RANK[current] >= TIER_RANK[required];
}

export function effectiveTier(axisTier: ProjectTier, expanded: boolean): ProjectTier {
  return expanded ? "full" : axisTier;
}
