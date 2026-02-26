import {
  getDiscoveryContext,
  listDiscoverScenes,
  setDiscoverHomeScene,
  tuneDiscoverScene,
} from '../src/lib/discovery/client';

describe('discovery client', () => {
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

  it('builds discover scenes query from typed params', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    await listDiscoverScenes(
      {
        tier: 'city',
        musicCommunity: ' Punk ',
        state: ' TX ',
        city: ' Austin ',
      },
      'token-1',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/discover/scenes?tier=city&musicCommunity=Punk&state=TX&city=Austin',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-1',
        }),
      }),
    );
  });

  it('returns typed context and mutations from tune + set-home wrappers', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tunedSceneId: 'scene-1',
            tunedScene: null,
            homeSceneId: 'scene-2',
            isVisitor: true,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tunedSceneId: 'scene-3',
            tunedScene: {
              id: 'scene-3',
              name: 'Dallas Punk',
              city: 'Dallas',
              state: 'TX',
              musicCommunity: 'Punk',
              tier: 'city',
              isActive: true,
            },
            homeSceneId: 'scene-2',
            isVisitor: true,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tunedSceneId: 'scene-3',
            tunedScene: {
              id: 'scene-3',
              name: 'Dallas Punk',
              city: 'Dallas',
              state: 'TX',
              musicCommunity: 'Punk',
              tier: 'city',
              isActive: true,
            },
            homeSceneId: 'scene-3',
            isVisitor: false,
            homeScene: {
              city: 'Dallas',
              state: 'TX',
              musicCommunity: 'Punk',
            },
          },
        }),
      });

    const context = await getDiscoveryContext('token-2');
    const tuned = await tuneDiscoverScene('scene-3', 'token-2');
    const home = await setDiscoverHomeScene('scene-3', 'token-2');

    expect(context?.tunedSceneId).toBe('scene-1');
    expect(tuned.tunedSceneId).toBe('scene-3');
    expect(home.homeScene.musicCommunity).toBe('Punk');
  });
});
