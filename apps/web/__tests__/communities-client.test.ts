import {
  findNearbyCommunities,
  getActiveCommunityEvents,
  getActiveCommunityPromotions,
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

  it('builds active-statistics query from tier context', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: null,
        meta: { sceneId: 'scene-2' },
      }),
    });

    await getActiveCommunityStatistics('state', 'token-stats');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/communities/active/statistics?tier=state',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-stats',
        }),
      }),
    );
  });

  it('returns null sceneId when active-statistics metadata is absent', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: null,
      }),
    });

    await expect(getActiveCommunityStatistics('national', 'token-null-meta')).resolves.toEqual({
      sceneId: null,
      data: null,
    });
  });

  it('preserves active-statistics data when scene metadata is absent', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          community: {
            id: 'scene-5',
            name: 'Austin Punk',
            city: 'Austin',
            state: 'TX',
            musicCommunity: 'Punk',
            tier: 'city',
            isActive: true,
          },
          tierScope: 'city',
          rollupUnit: 'city',
          metrics: {
            totalMembers: 10,
            activeSects: 2,
            eventsThisWeek: 1,
            activityScore: 5,
            activeTracks: 3,
            gpsVerifiedUsers: 4,
            votingEligibleUsers: 4,
            scopeCommunityCount: 1,
          },
          topSongs: [],
          timeWindow: {
            days: 7,
            asOf: '2026-03-18T00:00:00.000Z',
          },
        },
      }),
    });

    await expect(getActiveCommunityStatistics('city', 'token-data-no-meta')).resolves.toEqual({
      sceneId: null,
      data: expect.objectContaining({
        community: expect.objectContaining({ id: 'scene-5' }),
        tierScope: 'city',
      }),
    });
  });

  it('builds active-events query from typed params', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    await getActiveCommunityEvents(
      {
        limit: 20,
        includePast: true,
      },
      'token-3',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/communities/active/events?limit=20&includePast=true',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-3',
        }),
      }),
    );
  });

  it('builds active-promotions query from typed params', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    await getActiveCommunityPromotions(
      {
        limit: 20,
      },
      'token-4',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/communities/active/promotions?limit=20',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-4',
        }),
      }),
    );
  });
});
