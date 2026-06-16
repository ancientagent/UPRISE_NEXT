describe('api client base URL resolution', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const originalFetch = global.fetch;
  const originalLocation = window.location;

  beforeEach(() => {
    jest.resetModules();
    delete process.env.NEXT_PUBLIC_API_URL;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: null }),
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    global.fetch = originalFetch;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('defaults to localhost when no explicit API URL or 127 host context exists', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { hostname: 'localhost' },
    });
    const { api } = await import('../src/lib/api');

    await api.get('/health');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/health',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('follows 127.0.0.1 host context when no explicit API URL is configured', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { hostname: '127.0.0.1' },
    });
    const { api } = await import('../src/lib/api');

    await api.get('/health');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:4000/health',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('prefers NEXT_PUBLIC_API_URL when configured', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.test';
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { hostname: '127.0.0.1' },
    });
    const { api } = await import('../src/lib/api');

    await api.get('/health');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.test/health',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
