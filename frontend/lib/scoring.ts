export interface CrewCandidate {
  id: number;
  name: string;
  rating: number;
  reliability: number;
  base_price: number;
  experience_years: number;
  total_events: number;
  successful_events: number;
  cancellations: number;
  skillMatchRatio: number; // 0-1, computed from crew_skills vs required skills
}

export interface ScoredCrew extends CrewCandidate {
  score: number;
  predictedReliability: number;
}

/**
 * Core scoring function — predicts suitability of a crew member for an event.
 * Combines historical performance signals with fit signals (skills, price).
 */
export function scoreCrewMember(
  crew: CrewCandidate,
  budgetPerRole: number
): ScoredCrew {
  // Reliability prediction: blend stored reliability with computed success rate
  const successRate =
    crew.total_events > 0 ? crew.successful_events / crew.total_events : 0.5;
  const cancellationPenalty =
    crew.total_events > 0 ? crew.cancellations / crew.total_events : 0;

  const predictedReliability =
    crew.reliability * 0.5 + successRate * 100 * 0.4 - cancellationPenalty * 100 * 0.1;

  // Price fit: closer to or under budget scores higher
  const priceScore =
    budgetPerRole > 0
      ? Math.max(0, Math.min(1, budgetPerRole / Math.max(crew.base_price, 1)))
      : 0.5;

  // Experience score, capped
  const experienceScore = Math.min(crew.experience_years / 10, 1);

  const score =
    crew.rating * 10 * 0.25 +
    predictedReliability * 0.3 +
    crew.skillMatchRatio * 100 * 0.2 +
    priceScore * 100 * 0.15 +
    experienceScore * 100 * 0.1;

  return {
    ...crew,
    score: Math.round(score * 100) / 100,
    predictedReliability: Math.round(predictedReliability * 100) / 100,
  };
}