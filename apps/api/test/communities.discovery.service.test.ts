import { NotFoundException } from '@nestjs/common';
import { CommunitiesService } from '../src/communities/communities.service';

describe('CommunitiesService.discoverScenes', () => {
  const mockPrisma = {
    user: { findUnique: jest.fn() },
    community: { findMany: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn() },
  };

  let service: CommunitiesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CommunitiesService(mockPrisma as any);
  });

  it('throws NotFoundException when user does not exist', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.discoverScenes('missing-user', {
        tier: 'city',
        musicCommunity: 'Punk',
        limit: 50,
      })
    ).rejects.toThrow(NotFoundException);
  });

  it('returns deterministic city-scene items with home-scene marker', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });

    mockPrisma.community.findMany.mockResolvedValue([
      {
        id: 'c1',
        name: 'Austin Punk',
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'Punk',
        memberCount: 120,
        isActive: true,
      },
      {
        id: 'c2',
        name: 'Dallas Punk',
        city: 'Dallas',
        state: 'TX',
        musicCommunity: 'Punk',
        memberCount: 90,
        isActive: true,
      },
    ]);

    const result = await service.discoverScenes('u1', {
      tier: 'city',
      musicCommunity: 'Punk',
      state: 'TX',
      limit: 50,
    });

    expect(result.tier).toBe('city');
    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toMatchObject({
      entryType: 'city_scene',
      sceneId: 'c1',
      isHomeScene: true,
    });
    expect(result.items[1]).toMatchObject({
      entryType: 'city_scene',
      sceneId: 'c2',
      isHomeScene: false,
    });
  });

  it('returns national state rollups for the selected music community', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });

    mockPrisma.community.findMany.mockResolvedValue([
      {
        id: 'tx-austin',
        name: 'Austin Punk',
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'Punk',
        memberCount: 120,
        isActive: true,
      },
      {
        id: 'ca-la',
        name: 'LA Punk',
        city: 'Los Angeles',
        state: 'CA',
        musicCommunity: 'Punk',
        memberCount: 200,
        isActive: true,
      },
      {
        id: 'ca-sf',
        name: 'SF Punk',
        city: 'San Francisco',
        state: 'CA',
        musicCommunity: 'Punk',
        memberCount: 90,
        isActive: true,
      },
    ]);

    const result = await service.discoverScenes('u1', {
      tier: 'national',
      musicCommunity: 'Punk',
      limit: 50,
    });

    expect(result.tier).toBe('national');
    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toMatchObject({
      entryType: 'state_rollup',
      state: 'CA',
      citySceneCount: 2,
      totalMembers: 290,
      isHomeSceneState: false,
    });
    expect(result.items[1]).toMatchObject({
      entryType: 'state_rollup',
      state: 'TX',
      citySceneCount: 1,
      totalMembers: 120,
      isHomeSceneState: true,
    });
  });

  it('returns tune context and visitor=true when scene differs from home scene', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });

    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'c2',
      name: 'Dallas Punk',
      city: 'Dallas',
      state: 'TX',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });

    mockPrisma.community.findFirst.mockResolvedValue({ id: 'c1' });

    const result = await service.tuneScene('u1', { sceneId: 'c2' });

    expect(result.tunedSceneId).toBe('c2');
    expect(result.homeSceneId).toBe('c1');
    expect(result.isVisitor).toBe(true);
  });

  it('returns tune context and visitor=false when scene equals home scene', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });

    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'c1',
      name: 'Austin Punk',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });

    mockPrisma.community.findFirst.mockResolvedValue({ id: 'c1' });

    const result = await service.tuneScene('u1', { sceneId: 'c1' });

    expect(result.tunedSceneId).toBe('c1');
    expect(result.homeSceneId).toBe('c1');
    expect(result.isVisitor).toBe(false);
  });
});
