import { NotFoundException } from '@nestjs/common';
import { CommunitiesService } from '../src/communities/communities.service';

describe('CommunitiesService.getStatistics', () => {
  const mockPrisma = {
    community: { findUnique: jest.fn(), findMany: jest.fn() },
    sectTag: { count: jest.fn() },
    event: { count: jest.fn() },
    signalAction: { count: jest.fn() },
    track: { count: jest.fn(), findMany: jest.fn() },
    user: { count: jest.fn() },
  };

  let service: CommunitiesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CommunitiesService(mockPrisma as any);
  });

  it('throws NotFoundException when anchor community is missing', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);

    await expect(service.getStatistics('missing', { tier: 'city' })).rejects.toThrow(NotFoundException);
  });

  it('returns city-scoped statistics and top songs', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'c1',
      name: 'City Scene',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });

    mockPrisma.community.findMany.mockResolvedValue([
      { id: 'c1', name: 'City Scene', city: 'Austin', state: 'TX', memberCount: 120 },
    ]);

    mockPrisma.sectTag.count.mockResolvedValue(4);
    mockPrisma.event.count.mockResolvedValue(7);
    mockPrisma.signalAction.count.mockResolvedValue(33);
    mockPrisma.track.count.mockResolvedValue(18);
    mockPrisma.track.findMany.mockResolvedValue([
      {
        id: 't1',
        title: 'Track 1',
        artist: 'Band 1',
        duration: 120,
        playCount: 42,
        communityId: 'c1',
        community: { name: 'City Scene' },
      },
    ]);
    mockPrisma.user.count.mockResolvedValue(55);

    const result = await service.getStatistics('c1', { tier: 'city' });

    expect(result.tierScope).toBe('city');
    expect(result.rollupUnit).toBe('local_sect');
    expect(result.metrics.totalMembers).toBe(120);
    expect(result.metrics.activeSects).toBe(4);
    expect(result.metrics.eventsThisWeek).toBe(7);
    expect(result.metrics.activityScore).toBe(33);
    expect(result.topSongs).toHaveLength(1);
    expect(result.topSongs[0].trackId).toBe('t1');
    expect(mockPrisma.user.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          homeSceneCity: 'Austin',
          homeSceneState: 'TX',
          homeSceneCommunity: 'Punk',
        }),
      })
    );
  });

  it('uses state-scoped city pool for aggregation', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'c2',
      name: 'Anchor',
      city: 'Houston',
      state: 'TX',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });

    mockPrisma.community.findMany.mockResolvedValue([
      { id: 'c2', name: 'Anchor', city: 'Houston', state: 'TX', memberCount: 80 },
      { id: 'c3', name: 'Another City', city: 'Dallas', state: 'TX', memberCount: 100 },
    ]);

    mockPrisma.sectTag.count.mockResolvedValue(5);
    mockPrisma.event.count.mockResolvedValue(2);
    mockPrisma.signalAction.count.mockResolvedValue(10);
    mockPrisma.track.count.mockResolvedValue(6);
    mockPrisma.track.findMany.mockResolvedValue([]);
    mockPrisma.user.count.mockResolvedValue(40);

    const result = await service.getStatistics('c2', { tier: 'state' });

    expect(result.tierScope).toBe('state');
    expect(result.rollupUnit).toBe('city');
    expect(result.metrics.totalMembers).toBe(180);
    expect(result.metrics.scopeCommunityCount).toBe(2);
    expect(mockPrisma.community.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tier: 'city',
          state: 'TX',
          musicCommunity: 'Punk',
        }),
      })
    );
  });
});
