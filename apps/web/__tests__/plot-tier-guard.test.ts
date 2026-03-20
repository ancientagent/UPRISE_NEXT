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
    const anchor = { name: 'Fallback Scene' };
    const homeScene = { city: 'Chicago', state: 'Illinois', musicCommunity: 'House' };

    expect(buildRadiyoBroadcastLabel('state', anchor, homeScene)).toBe('Illinois • House');
    expect(buildRadiyoBroadcastLabel('national', anchor, homeScene)).toBe('National • House');
  });

  it('falls back to the selected anchor name when no community label is available', () => {
    const anchor = { name: 'Austin Underground', city: 'Austin', state: 'Texas' };

    expect(buildRadiyoBroadcastLabel('city', anchor, null)).toBe('Austin, Texas • Austin Underground');
    expect(buildRadiyoBroadcastLabel('state', anchor, null)).toBe('Texas • Austin Underground');
    expect(buildRadiyoBroadcastLabel('national', anchor, null)).toBe('National • Austin Underground');
  });

  it('preserves the selected anchor community over conflicting home-scene fallback data', () => {
    const anchor = {
      name: 'Austin Punk Uprise',
      city: 'Austin',
      state: 'Texas',
      musicCommunity: 'Punk',
    };
    const homeScene = {
      city: 'Chicago',
      state: 'Illinois',
      musicCommunity: 'House',
    };

    expect(buildRadiyoBroadcastLabel('city', anchor, homeScene)).toBe('Austin, Texas • Punk');
    expect(buildRadiyoBroadcastLabel('state', anchor, homeScene)).toBe('Texas • Punk');
    expect(buildRadiyoBroadcastLabel('national', anchor, homeScene)).toBe('National • Punk');
  });

  it('normalizes padded anchor and fallback fields before building tier titles', () => {
    const anchor = {
      city: ' Austin ',
      state: ' Texas ',
      musicCommunity: ' Punk ',
    };
    const homeScene = {
      city: ' Chicago ',
      state: ' Illinois ',
      musicCommunity: ' House ',
    };

    expect(buildRadiyoBroadcastLabel('city', anchor, homeScene)).toBe('Austin, Texas • Punk');
    expect(buildRadiyoBroadcastLabel('state', anchor, homeScene)).toBe('Texas • Punk');
    expect(buildRadiyoBroadcastLabel('national', anchor, homeScene)).toBe('National • Punk');
  });

  it('falls back to UPRISE when no anchor or home-scene label data exists', () => {
    expect(buildRadiyoBroadcastLabel('city', {}, null)).toBe('UPRISE');
    expect(buildRadiyoBroadcastLabel('state', {}, null)).toBe('UPRISE');
    expect(buildRadiyoBroadcastLabel('national', {}, null)).toBe('National • UPRISE');
  });

  it('uses home-scene community when anchor only provides scoped location fields', () => {
    const anchor = { city: 'Austin', state: 'Texas' };
    const homeScene = { city: 'Chicago', state: 'Illinois', musicCommunity: 'House' };

    expect(buildRadiyoBroadcastLabel('city', anchor, homeScene)).toBe('Austin, Texas • House');
    expect(buildRadiyoBroadcastLabel('state', anchor, homeScene)).toBe('Texas • House');
    expect(buildRadiyoBroadcastLabel('national', anchor, homeScene)).toBe('National • House');
  });

  it('prefers anchor community over fallback name when both are present', () => {
    const anchor = { name: 'Austin Underground', city: 'Austin', state: 'Texas', musicCommunity: 'Punk' };

    expect(buildRadiyoBroadcastLabel('city', anchor, null)).toBe('Austin, Texas • Punk');
    expect(buildRadiyoBroadcastLabel('state', anchor, null)).toBe('Texas • Punk');
    expect(buildRadiyoBroadcastLabel('national', anchor, null)).toBe('National • Punk');
  });

  it('falls back to anchor name when home-scene only contributes location fields', () => {
    const anchor = { name: 'Austin Underground', city: 'Austin', state: 'Texas' };
    const homeScene = { city: 'Chicago', state: 'Illinois' };

    expect(buildRadiyoBroadcastLabel('city', anchor, homeScene)).toBe('Austin, Texas • Austin Underground');
    expect(buildRadiyoBroadcastLabel('state', anchor, homeScene)).toBe('Texas • Austin Underground');
    expect(buildRadiyoBroadcastLabel('national', anchor, homeScene)).toBe('National • Austin Underground');
  });

  it('prefers anchor city/state over home-scene location fallback when both exist', () => {
    const anchor = { city: 'Austin', state: 'Texas', musicCommunity: 'Punk' };
    const homeScene = { city: 'Chicago', state: 'Illinois', musicCommunity: 'House' };

    expect(buildRadiyoBroadcastLabel('city', anchor, homeScene)).toBe('Austin, Texas • Punk');
    expect(buildRadiyoBroadcastLabel('state', anchor, homeScene)).toBe('Texas • Punk');
  });
});
