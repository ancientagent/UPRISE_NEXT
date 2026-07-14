import { api, resolveApiErrorMessage } from '../src/lib/api';

describe('API error messages', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('resolves a structured Nest error nested under message', () => {
    expect(
      resolveApiErrorMessage({
        error: 'Bad Request',
        message: {
          success: false,
          error: { code: 'SCHEDULE_CAPACITY_CHANGED', message: 'Capacity changed.' },
        },
      })
    ).toBe('Capacity changed.');
  });

  it('surfaces the nested server message through the API client', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: 'Conflict',
        message: {
          success: false,
          error: { code: 'SCHEDULE_CAPACITY_CHANGED', message: 'Capacity changed.' },
        },
      }),
    }) as jest.Mock;

    await expect(api.post('/release-deck/schedule', {}, { token: 'token-1' })).rejects.toThrow(
      'Capacity changed.'
    );
  });
});
