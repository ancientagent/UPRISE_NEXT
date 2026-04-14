import {
  followArtistBand,
  getArtistBandProfile,
} from '../src/lib/artist-bands/client';

describe('artist band client', () => {
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

  it('loads artist profile from the typed profile endpoint', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { id: 'artist-1', name: 'Signal Static' },
      }),
    });

    await getArtistBandProfile('artist-1', 'token-1');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/artist-bands/artist-1/profile',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-1',
        }),
      }),
    );
  });

  it('posts artist follows through the shared follow endpoint', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { entityId: 'artist-1' },
      }),
    });

    await followArtistBand('artist-1', 'token-artist');

    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe('http://localhost:4000/follow');
    expect((global.fetch as jest.Mock).mock.calls[0][1]).toEqual(
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ entityType: 'artistBand', entityId: 'artist-1' }),
      }),
    );
  });
});
