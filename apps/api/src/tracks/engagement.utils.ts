// Engagement score mapping per Canon (Master Narrative Canon §4.1.1)
// Full listen: 3 points | Majority (>½): 2 points | Partial (≥⅓): 1 point | Skip: 0 points

import type { EngagementType } from './dto/track-engage.dto';

/**
 * Maps engagement type to numeric score per Canon
 * Canon §4.1.1: "Base allocation per play: Full song completion: 3 points,
 * Majority listen (> 1/2): 2 points, Partial listen (≥ 1/3): 1 point,
 * Skip / early interruption: 0 points"
 */
export function engagementToScore(type: EngagementType): number {
  switch (type) {
    case 'full':
      return 3;
    case 'majority':
      return 2;
    case 'partial':
      return 1;
    case 'skip':
      return 0;
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

/**
 * Validates that engagement score is non-negative (additive model)
 * Canon: "Engagement in UPRISE is additive-only. Songs gain standing only through
 * demonstrated listener engagement. No listener action subtracts from a song's standing."
 */
export function isValidEngagementScore(score: number): boolean {
  return score >= 0;
}
