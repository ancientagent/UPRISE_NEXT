import { getDefaultLocationQueryForTier } from '../src/lib/discovery/query-state';

describe('discovery query state', () => {
  it('uses city context for city tier', () => {
    expect(
      getDefaultLocationQueryForTier(
        'city',
        { city: 'Austin', state: 'TX', musicCommunity: 'Punk' },
        null,
      ),
    ).toBe('Austin');
  });

  it('uses state context for state tier', () => {
    expect(
      getDefaultLocationQueryForTier(
        'state',
        { city: 'Austin', state: 'TX', musicCommunity: 'Punk' },
        null,
      ),
    ).toBe('TX');
  });

  it('clears location for national tier', () => {
    expect(
      getDefaultLocationQueryForTier(
        'national',
        { city: 'Austin', state: 'TX', musicCommunity: 'Punk' },
        null,
      ),
    ).toBe('');
  });

  it('falls back to tuned scene context when home scene is unset', () => {
    expect(
      getDefaultLocationQueryForTier(
        'city',
        null,
        {
          id: 'scene-1',
          name: 'Dallas Punk',
          city: 'Dallas',
          state: 'TX',
          musicCommunity: 'Punk',
          tier: 'city',
          isActive: true,
        },
      ),
    ).toBe('Dallas');
  });

  it('prefers the active tuned scene context over the stored home scene', () => {
    expect(
      getDefaultLocationQueryForTier(
        'city',
        { city: 'Austin', state: 'TX', musicCommunity: 'Punk' },
        {
          id: 'scene-2',
          name: 'Dallas Punk',
          city: 'Dallas',
          state: 'TX',
          musicCommunity: 'Punk',
          tier: 'city',
          isActive: true,
        },
      ),
    ).toBe('Dallas');
  });
});
