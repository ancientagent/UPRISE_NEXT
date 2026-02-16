import { NotFoundException } from '@nestjs/common';
import { CommunitiesService } from '../src/communities/communities.service';

describe('CommunitiesService.getFeed', () => {
  const mockPrisma = {
    community: { findUnique: jest.fn() },
    signalAction: { findMany: jest.fn() },
    track: { findMany: jest.fn() },
    event: { findMany: jest.fn() },
    signal: { findMany: jest.fn() },
  };

  let service: CommunitiesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CommunitiesService(mockPrisma as any);
  });

  it('throws NotFoundException when community does not exist', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);

    await expect(service.getFeed('missing-community', { limit: 20 })).rejects.toThrow(NotFoundException);
  });

  it('merges explicit items and returns deterministic descending order with limit and cursor', async () => {
    const now = new Date('2026-02-16T12:00:00.000Z');
    const oneMinuteAgo = new Date('2026-02-16T11:59:00.000Z');
    const twoMinutesAgo = new Date('2026-02-16T11:58:00.000Z');
    const threeMinutesAgo = new Date('2026-02-16T11:57:00.000Z');

    mockPrisma.community.findUnique.mockResolvedValue({ id: 'community-1' });
    mockPrisma.signalAction.findMany.mockResolvedValue([
      {
        id: 'blast-1',
        type: 'BLAST',
        signalId: 'signal-1',
        createdAt: now,
        user: { id: 'u1', username: 'a', displayName: 'A', avatar: null },
        signal: { id: 'signal-1', type: 'SONG', metadata: { source: 'blast' } },
      },
    ]);
    mockPrisma.track.findMany.mockResolvedValue([
      {
        id: 'track-1',
        title: 'Song 1',
        artist: 'Artist 1',
        duration: 180,
        createdAt: oneMinuteAgo,
        uploadedBy: { id: 'u2', username: 'b', displayName: 'B', avatar: null },
      },
    ]);
    mockPrisma.event.findMany.mockResolvedValue([
      {
        id: 'event-1',
        title: 'Event 1',
        startDate: new Date('2026-02-20T02:00:00.000Z'),
        locationName: 'Venue 1',
        createdAt: twoMinutesAgo,
        createdBy: { id: 'u3', username: 'c', displayName: 'C', avatar: null },
      },
    ]);
    mockPrisma.signal.findMany.mockResolvedValue([
      {
        id: 'signal-2',
        type: 'PROJECT',
        metadata: { name: 'Project 1' },
        createdAt: threeMinutesAgo,
        createdBy: { id: 'u4', username: 'd', displayName: 'D', avatar: null },
      },
    ]);

    const result = await service.getFeed('community-1', { limit: 3 });

    expect(result.items).toHaveLength(3);
    expect(result.items[0].type).toBe('blast');
    expect(result.items[1].type).toBe('track_release');
    expect(result.items[2].type).toBe('event_created');
    expect(result.nextCursor).toBe(twoMinutesAgo.toISOString());
  });
});
