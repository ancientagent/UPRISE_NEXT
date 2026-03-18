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

  it('omits city filter outside city tier and skips blank location params', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    await listDiscoverScenes(
      {
        tier: 'national',
        musicCommunity: 'Hip-Hop',
        state: '   ',
        city: 'Chicago',
      },
      'token-blank',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/discover/scenes?tier=national&musicCommunity=Hip-Hop',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-blank',
        }),
      }),
    );
  });

  it('keeps state filter for state-tier discovery without adding city lookup semantics', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    await listDiscoverScenes(
      {
        tier: 'state',
        musicCommunity: ' Punk ',
        state: ' TX ',
        city: 'Austin',
      },
      'token-state',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/discover/scenes?tier=state&musicCommunity=Punk&state=TX',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-state',
        }),
      }),
    );
  });

  it('limits state-tier discovery queries to the approved scope keys', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    await listDiscoverScenes(
      {
        tier: 'state',
        musicCommunity: 'Punk',
        state: 'TX',
        city: 'Austin',
      },
      'token-state-keys',
    );

    const [url] = (global.fetch as jest.Mock).mock.calls[0] as [string];
    const keys = Array.from(new URL(url).searchParams.keys()).sort();

    expect(keys).toEqual(['musicCommunity', 'state', 'tier']);
  });

  it('never adds artist or band lookup params to discovery queries', async () => {
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
        musicCommunity: 'Punk',
        state: 'TX',
        city: 'Austin',
      },
      'token-scope',
    );

    const [url] = (global.fetch as jest.Mock).mock.calls[0] as [string];
    const query = new URL(url).searchParams;

    expect(query.get('tier')).toBe('city');
    expect(query.get('musicCommunity')).toBe('Punk');
    expect(query.get('state')).toBe('TX');
    expect(query.get('city')).toBe('Austin');
    expect(query.has('artist')).toBe(false);
    expect(query.has('band')).toBe(false);
  });

  it('limits city-tier discovery queries to the approved scope keys', async () => {
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
        musicCommunity: 'Punk',
        state: 'TX',
        city: 'Austin',
      },
      'token-keys',
    );

    const [url] = (global.fetch as jest.Mock).mock.calls[0] as [string];
    const keys = Array.from(new URL(url).searchParams.keys()).sort();

    expect(keys).toEqual(['city', 'musicCommunity', 'state', 'tier']);
  });

  it('does not carry location filters into national-tier discovery', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    await listDiscoverScenes(
      {
        tier: 'national',
        musicCommunity: 'Punk',
        state: 'TX',
        city: 'Austin',
      },
      'token-national',
    );

    const [url] = (global.fetch as jest.Mock).mock.calls[0] as [string];
    const query = new URL(url).searchParams;

    expect(query.get('tier')).toBe('national');
    expect(query.get('musicCommunity')).toBe('Punk');
    expect(query.has('state')).toBe(false);
    expect(query.has('city')).toBe(false);
  });

  it('limits national-tier discovery queries to community scope keys only', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    await listDiscoverScenes(
      {
        tier: 'national',
        musicCommunity: 'Punk',
        state: 'TX',
        city: 'Austin',
      },
      'token-national-keys',
    );

    const [url] = (global.fetch as jest.Mock).mock.calls[0] as [string];
    const keys = Array.from(new URL(url).searchParams.keys()).sort();

    expect(keys).toEqual(['musicCommunity', 'tier']);
  });

  it('preserves the musicCommunity query key even when the typed value trims blank', async () => {
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
        musicCommunity: '   ',
        state: 'TX',
        city: 'Austin',
      },
      'token-empty-community',
    );

    const [url] = (global.fetch as jest.Mock).mock.calls[0] as [string];
    const query = new URL(url).searchParams;

    expect(query.has('musicCommunity')).toBe(true);
    expect(query.get('musicCommunity')).toBe('');
    expect(Array.from(query.keys()).sort()).toEqual(['city', 'musicCommunity', 'state', 'tier']);
    expect(query.has('artist')).toBe(false);
    expect(query.has('band')).toBe(false);
  });

  it('returns null when discovery context data is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: null,
      }),
    });

    await expect(getDiscoveryContext('token-null')).resolves.toBeNull();
  });

  it('sends authenticated discovery-context reads through the typed client', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          tunedSceneId: 'scene-ctx',
          tunedScene: null,
          homeSceneId: 'scene-home',
          isVisitor: true,
        },
      }),
    });

    await getDiscoveryContext('token-context');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/discover/context',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-context',
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

  it('posts explicit scene ids for tune and set-home mutations through the typed client', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tunedSceneId: 'scene-9',
            tunedScene: null,
            homeSceneId: 'scene-home',
            isVisitor: true,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            tunedSceneId: 'scene-9',
            tunedScene: null,
            homeSceneId: 'scene-9',
            isVisitor: false,
            homeScene: {
              city: 'Austin',
              state: 'TX',
              musicCommunity: 'Punk',
            },
          },
        }),
      });

    await tuneDiscoverScene('scene-9', 'token-mutate');
    await setDiscoverHomeScene('scene-9', 'token-mutate');

    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      'http://localhost:4000/discover/tune',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ sceneId: 'scene-9' }),
        headers: expect.objectContaining({
          Authorization: 'Bearer token-mutate',
        }),
      }),
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      'http://localhost:4000/discover/set-home-scene',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ sceneId: 'scene-9' }),
        headers: expect.objectContaining({
          Authorization: 'Bearer token-mutate',
        }),
      }),
    );
  });

  it('throws when tune or set-home responses are empty', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: null,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: null,
        }),
      });

    await expect(tuneDiscoverScene('scene-empty', 'token-empty')).rejects.toThrow(
      'Tune scene response was empty.',
    );
    await expect(setDiscoverHomeScene('scene-empty', 'token-empty')).rejects.toThrow(
      'Set Home Scene response was empty.',
    );
  });
});
