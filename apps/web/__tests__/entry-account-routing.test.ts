import {
  loadAccountEntryDestination,
  resolveAccountEntryDestination,
} from '../src/lib/auth/entry-routing';

describe('account entry routing', () => {
  it('sends an incomplete account to Home Scene onboarding', () => {
    expect(resolveAccountEntryDestination({
      homeSceneCity: null,
      homeSceneState: null,
      homeSceneCommunity: null,
      hasCompleteHomeScene: false,
    })).toBe('/onboarding');
  });

  it('sends a returning account with a complete Home Scene tuple to Plot', () => {
    expect(resolveAccountEntryDestination({
      homeSceneCity: 'Austin',
      homeSceneState: 'Texas',
      homeSceneCommunity: 'Punk',
      hasCompleteHomeScene: true,
    })).toBe('/plot');
  });

  it('does not treat a partial Home Scene tuple as complete', () => {
    expect(resolveAccountEntryDestination({
      homeSceneCity: 'Austin',
      homeSceneState: 'Texas',
      homeSceneCommunity: null,
      hasCompleteHomeScene: false,
    })).toBe('/onboarding');
  });

  it('loads server-authoritative entry status before routing', async () => {
    const originalFetch = global.fetch;
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          homeSceneCity: 'Austin',
          homeSceneState: 'Texas',
          homeSceneCommunity: 'Punk',
          hasCompleteHomeScene: true,
        },
      }),
    } as Response);
    global.fetch = fetchMock;

    try {
      await expect(loadAccountEntryDestination('access-token')).resolves.toBe('/plot');
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:4000/users/me/entry-status',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer access-token',
          }),
        }),
      );
    } finally {
      global.fetch = originalFetch;
    }
  });
});
