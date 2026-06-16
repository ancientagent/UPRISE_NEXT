describe('broadcast client', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetModules();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          newReleases: [],
          mainRotation: [],
        },
        meta: {
          sceneId: 'scene-1',
          requestedTier: 'state',
          generatedAt: '2026-04-10T00:00:00.000Z',
          newReleasesCount: 0,
          mainRotationCount: 0,
        },
      }),
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('requests the active broadcast rotation with the requested tier', async () => {
    const { getActiveBroadcastRotation } = await import('../src/lib/broadcast/client');

    await getActiveBroadcastRotation('state', 'token-123');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/broadcast/rotation?tier=state',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer token-123',
        }),
      }),
    );
  });
});
