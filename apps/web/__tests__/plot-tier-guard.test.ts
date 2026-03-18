import { buildRadiyoBroadcastLabel, shouldFetchNearbyForTier } from '@/components/plot/tier-guard';

describe('Plot Tier Guard', () => {
  it('allows nearby lookup for city tier', () => {
    expect(shouldFetchNearbyForTier('city')).toBe(true);
  });

  it('blocks nearby lookup for state and national tiers', () => {
    expect(shouldFetchNearbyForTier('state')).toBe(false);
    expect(shouldFetchNearbyForTier('national')).toBe(false);
  });

  it('keeps the parent music-community anchor stable across tier titles', () => {
    const anchor = {
      name: 'Austin Punk Uprise',
      city: 'Austin',
      state: 'Texas',
      musicCommunity: 'Punk',
    };

    expect(buildRadiyoBroadcastLabel('city', anchor, null)).toBe('Austin, Texas • Punk');
    expect(buildRadiyoBroadcastLabel('state', anchor, null)).toBe('Texas • Punk');
    expect(buildRadiyoBroadcastLabel('national', anchor, null)).toBe('National • Punk');
  });

  it('falls back to home-scene data when the selected anchor lacks scoped fields', () => {
    expect(
      buildRadiyoBroadcastLabel(
        'city',
        { name: 'Fallback Scene' },
        { city: 'Chicago', state: 'Illinois', musicCommunity: 'House' },
      ),
    ).toBe('Chicago, Illinois • House');
  });

  it('keeps state and national labels deterministic from home-scene fallback data', () => {
    const homeScene = { city: 'Chicago', state: 'Illinois', musicCommunity: 'House' };

    expect(buildRadiyoBroadcastLabel('state', null, homeScene)).toBe('Illinois • House');
    expect(buildRadiyoBroadcastLabel('national', null, homeScene)).toBe('National • House');
  });

  it('falls back to the selected anchor name when no community label is available', () => {
    expect(
      buildRadiyoBroadcastLabel(
        'national',
        { name: 'Austin Punk Uprise', city: 'Austin', state: 'Texas' },
        null,
      ),
    ).toBe('National • Austin Punk Uprise');
  });
});
