import { NotFoundException } from '@nestjs/common';
import { CommunitiesService } from '../src/communities/communities.service';

describe('CommunitiesService.getEvents', () => {
  const mockPrisma = {
    community: { findUnique: jest.fn() },
    event: { findMany: jest.fn() },
  };

  let service: CommunitiesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CommunitiesService(mockPrisma as any);
  });

  it('throws NotFoundException when community does not exist', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);

    await expect(service.getEvents('missing', { limit: 20, includePast: false })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('returns deterministic upcoming events payload', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({ id: 'community-1' });

    mockPrisma.event.findMany.mockResolvedValue([
      {
        id: 'event-1',
        title: 'DIY Night',
        description: 'Basement showcase',
        startDate: new Date('2026-02-21T20:00:00.000Z'),
        endDate: new Date('2026-02-21T23:00:00.000Z'),
        locationName: 'South Venue',
        address: '101 Main St',
        attendeeCount: 40,
        maxAttendees: 100,
        createdAt: new Date('2026-02-18T10:00:00.000Z'),
        createdBy: { id: 'u1', username: 'promoter1', displayName: 'Promoter 1', avatar: null },
      },
    ]);

    const result = await service.getEvents('community-1', { limit: 10, includePast: false });

    expect(result.limit).toBe(10);
    expect(result.includePast).toBe(false);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe('DIY Night');
    expect(result.items[0].startDate).toBe('2026-02-21T20:00:00.000Z');
    expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        orderBy: [{ startDate: 'asc' }, { createdAt: 'desc' }],
      }),
    );
  });
});
