export type PlotTier = 'city' | 'state' | 'national';

// Canon guard: tier switching is structural (city/state/national), not radius expansion.
export function shouldFetchNearbyForTier(tier: PlotTier): boolean {
  return tier === 'city';
}
