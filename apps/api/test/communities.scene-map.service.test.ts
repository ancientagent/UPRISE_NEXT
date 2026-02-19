import { NotFoundException } from '@nestjs/common';
import { CommunitiesService } from '../src/communities/communities.service';

describe('CommunitiesService.getSceneMap', () => {
  const mockPrisma = {
    community: { findUnique: jest.fn(), findMany: jest.fn() },
    track: { groupBy: jest.fn() },
    sectTag: { groupBy: jest.fn() },
    event: { groupBy: jest.fn() },
    $queryRaw: jest.fn(),
  };

  let service: CommunitiesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CommunitiesService(mockPrisma as any);
  });

  it('throws NotFoundException when anchor community does not exist', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);
    await expect(service.getSceneMap('missing', { tier: 'city' })).rejects.toThrow(NotFoundException);
  });

  it('returns city-scope points', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'c1',
      name: 'Austin Punk',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
    });
    mockPrisma.community.findMany.mockResolvedValue([
      { id: 'c1', name: 'Austin Punk', city: 'Austin', state: 'TX', memberCount: 120 },
    ]);

    mockPrisma.$queryRaw.mockResolvedValue([{ id: 'c1', lat: 30.2672, lng: -97.7431 }]);
    mockPrisma.track.groupBy.mockResolvedValue([{ communityId: 'c1', _count: { _all: 12 } }]);
    mockPrisma.sectTag.groupBy.mockResolvedValue([{ parentCommunityId: 'c1', _count: { _all: 4 } }]);
    mockPrisma.event.groupBy.mockResolvedValue([{ communityId: 'c1', _count: { _all: 3 } }]);

    const result = await service.getSceneMap('c1', { tier: 'city' });

    expect(result.tierScope).toBe('city');
    expect(result.rollupUnit).toBe('local_sect');
    expect(result.points).toHaveLength(1);
    expect(result.points[0].kind).toBe('community');
    expect(result.points[0].label).toBe('Austin Punk');
  });

  it('rolls up national scope by state', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'c1',
      name: 'Austin Punk',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
    });
    mockPrisma.community.findMany.mockResolvedValue([
      { id: 'c1', name: 'Austin Punk', city: 'Austin', state: 'TX', memberCount: 120 },
      { id: 'c2', name: 'LA Punk', city: 'Los Angeles', state: 'CA', memberCount: 200 },
      { id: 'c3', name: 'SF Punk', city: 'San Francisco', state: 'CA', memberCount: 90 },
    ]);

    mockPrisma.$queryRaw.mockResolvedValue([
      { id: 'c1', lat: 30.2672, lng: -97.7431 },
      { id: 'c2', lat: 34.0522, lng: -118.2437 },
      { id: 'c3', lat: 37.7749, lng: -122.4194 },
    ]);

    mockPrisma.track.groupBy.mockResolvedValue([
      { communityId: 'c1', _count: { _all: 12 } },
      { communityId: 'c2', _count: { _all: 20 } },
      { communityId: 'c3', _count: { _all: 8 } },
    ]);
    mockPrisma.sectTag.groupBy.mockResolvedValue([
      { parentCommunityId: 'c1', _count: { _all: 4 } },
      { parentCommunityId: 'c2', _count: { _all: 5 } },
      { parentCommunityId: 'c3', _count: { _all: 2 } },
    ]);
    mockPrisma.event.groupBy.mockResolvedValue([
      { communityId: 'c1', _count: { _all: 3 } },
      { communityId: 'c2', _count: { _all: 1 } },
      { communityId: 'c3', _count: { _all: 2 } },
    ]);

    const result = await service.getSceneMap('c1', { tier: 'national' });

    expect(result.tierScope).toBe('national');
    expect(result.rollupUnit).toBe('state');
    expect(result.points.some((p) => p.kind === 'state')).toBe(true);
    expect(result.points.find((p) => p.label === 'CA')?.memberCount).toBe(290);
    expect(result.points.find((p) => p.label === 'TX')?.memberCount).toBe(120);
  });
});
