import { shouldFetchNearbyForTier } from '@/components/plot/tier-guard';

describe('Plot Tier Guard', () => {
  it('allows nearby lookup for city tier', () => {
    expect(shouldFetchNearbyForTier('city')).toBe(true);
  });

  it('blocks nearby lookup for state and national tiers', () => {
    expect(shouldFetchNearbyForTier('state')).toBe(false);
    expect(shouldFetchNearbyForTier('national')).toBe(false);
  });
});
