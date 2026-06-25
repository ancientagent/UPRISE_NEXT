import {
  addMusicCommunityPreference,
  getHomeSceneRoller,
  getMusicCommunityPreferences,
  setDefaultMusicCommunityPreference,
} from '../src/lib/users/client';

describe('users client music-community preferences', () => {
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

  it('loads current user music-community preferences', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{ id: 'pref-1', musicCommunity: 'Punk', isDefault: true }],
      }),
    });

    const result = await getMusicCommunityPreferences('token-user');

    expect(result[0]).toMatchObject({ musicCommunity: 'Punk', isDefault: true });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/users/me/music-community-preferences',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer token-user' }),
      }),
    );
  });

  it('adds a music-community preference through the current user endpoint', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          { id: 'pref-1', musicCommunity: 'Punk', isDefault: true },
          { id: 'pref-2', musicCommunity: 'Metal', isDefault: false },
        ],
      }),
    });

    const result = await addMusicCommunityPreference('Metal', 'token-user');

    expect(result).toHaveLength(2);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/users/me/music-community-preferences',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ musicCommunity: 'Metal' }),
      }),
    );
  });

  it('sets the explicit default music-community preference', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          { id: 'pref-2', musicCommunity: 'Metal', isDefault: true },
          { id: 'pref-1', musicCommunity: 'Punk', isDefault: false },
        ],
      }),
    });

    const result = await setDefaultMusicCommunityPreference('Metal', 'token-user');

    expect(result[0]).toMatchObject({ musicCommunity: 'Metal', isDefault: true });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/users/me/music-community-preferences/default',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ musicCommunity: 'Metal' }),
      }),
    );
  });

  it('loads the current Home Scene roller read model', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          currentLocation: { city: 'El Paso', state: 'Texas' },
          items: [{ musicCommunity: 'Punk', sceneId: 'scene-austin-punk', resolution: 'proxy' }],
        },
      }),
    });

    const result = await getHomeSceneRoller('token-user');

    expect(result.items[0]).toMatchObject({ musicCommunity: 'Punk', resolution: 'proxy' });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/users/me/home-scene-roller',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer token-user' }),
      }),
    );
  });
});
