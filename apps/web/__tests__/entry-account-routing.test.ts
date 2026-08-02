import { resolveAccountEntryDestination } from '../src/lib/auth/entry-routing';

const BASE_USER = {
  id: '9e717075-7366-4fca-b820-0e430dc53a4e',
  email: 'listener@example.test',
  username: 'listener',
  displayName: 'Listener',
  gpsVerified: false,
  isVerified: false,
  createdAt: new Date('2026-08-01T00:00:00.000Z'),
  updatedAt: new Date('2026-08-01T00:00:00.000Z'),
};

describe('account entry routing', () => {
  it('sends an incomplete account to Home Scene onboarding', () => {
    expect(resolveAccountEntryDestination(BASE_USER)).toBe('/onboarding');
  });

  it('sends a returning account with a complete Home Scene tuple to Plot', () => {
    expect(resolveAccountEntryDestination({
      ...BASE_USER,
      homeSceneCity: 'Austin',
      homeSceneState: 'Texas',
      homeSceneCommunity: 'Punk',
    })).toBe('/plot');
  });

  it('does not treat a partial Home Scene tuple as complete', () => {
    expect(resolveAccountEntryDestination({
      ...BASE_USER,
      homeSceneCity: 'Austin',
      homeSceneState: 'Texas',
    })).toBe('/onboarding');
  });
});
