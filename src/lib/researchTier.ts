export type ResearchTier = "question" | "approach" | "finding";

const TIER_RANK: Record<ResearchTier, number> = {
  question: 0,
  approach: 1,
  finding: 2,
};

export function tierFromIntensity(intensity: number): ResearchTier {
  if (intensity <= 1) return "question";
  if (intensity <= 3) return "approach";
  return "finding";
}

export function tierAtLeast(current: ResearchTier, required: ResearchTier): boolean {
  return TIER_RANK[current] >= TIER_RANK[required];
}

export function effectiveResearchTier(axisTier: ResearchTier, expanded: boolean): ResearchTier {
  return expanded ? "finding" : axisTier;
}
