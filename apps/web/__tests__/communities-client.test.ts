import {
  findNearbyCommunities,
  getActiveCommunityStatistics,
  resolveHomeCommunity,
} from '../src/lib/communities/client';

describe('communities client', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('builds nearby query from typed params', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    await findNearbyCommunities(
      {
        lat: 30.2672,
        lng: -97.7431,
        radius: 10000,
        limit: 1,
      },
      'token-1',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/communities/nearby?lat=30.2672&lng=-97.7431&radius=10000&limit=1',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-1',
        }),
      }),
    );
  });

  it('extracts sceneId from active-statistics meta and resolves home anchor', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { id: 'community-1' },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { community: { id: 'scene-9' }, tierScope: 'city' },
          meta: { sceneId: 'scene-9' },
        }),
      });

    const home = await resolveHomeCommunity(
      {
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'Punk',
      },
      'token-2',
    );
    const active = await getActiveCommunityStatistics('city', 'token-2');

    expect(home?.id).toBe('community-1');
    expect(active.sceneId).toBe('scene-9');
    expect(active.data?.community?.id).toBe('scene-9');
  });
});
