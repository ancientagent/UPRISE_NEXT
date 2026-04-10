import { api } from '../src/lib/api';
import { createPrintShopEvent } from '../src/lib/print-shop/client';

jest.mock('../src/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('print shop client', () => {
  const mockedApiPost = api.post as jest.Mock;

  beforeEach(() => {
    mockedApiPost.mockReset();
  });

  it('posts event creation to the print-shop event endpoint', async () => {
    mockedApiPost.mockResolvedValueOnce({
      success: true,
      data: {
        id: 'event-1',
        title: 'Warehouse Show',
        description: 'All-ages punk night.',
        coverImage: null,
        startDate: '2026-04-12T19:00:00.000Z',
        endDate: '2026-04-12T23:00:00.000Z',
        locationName: 'Southside Warehouse',
        address: '123 Main St',
        latitude: 30.2672,
        longitude: -97.7431,
        communityId: '00000000-0000-0000-0000-000000000001',
        createdById: '00000000-0000-0000-0000-000000000002',
        attendeeCount: 0,
        maxAttendees: null,
        createdAt: '2026-04-10T12:00:00.000Z',
        updatedAt: '2026-04-10T12:00:00.000Z',
      },
    });

    const payload = {
      title: 'Warehouse Show',
      description: 'All-ages punk night.',
      startDate: '2026-04-12T19:00',
      endDate: '2026-04-12T23:00',
      locationName: 'Southside Warehouse',
      address: '123 Main St',
      latitude: 30.2672,
      longitude: -97.7431,
      communityId: '00000000-0000-0000-0000-000000000001',
    };

    const response = await createPrintShopEvent(payload as any, 'token-1');

    expect(mockedApiPost).toHaveBeenCalledWith('/print-shop/events', payload, { token: 'token-1' });
    expect(response.id).toBe('event-1');
  });

  it('throws when the event creation response has no data payload', async () => {
    mockedApiPost.mockResolvedValueOnce({ success: true, data: undefined });

    await expect(
      createPrintShopEvent(
        {
          title: 'Warehouse Show',
          description: 'All-ages punk night.',
          startDate: '2026-04-12T19:00',
          endDate: '2026-04-12T23:00',
          locationName: 'Southside Warehouse',
          address: '123 Main St',
          latitude: 30.2672,
          longitude: -97.7431,
          communityId: '00000000-0000-0000-0000-000000000001',
        } as any,
        'token-1',
      ),
    ).rejects.toThrow('Print Shop event creation response returned no data.');
  });
});
