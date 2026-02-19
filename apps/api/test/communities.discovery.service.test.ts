import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommunitiesService } from '../src/communities/communities.service';

describe('CommunitiesService.discoverScenes', () => {
  const mockPrisma = {
    user: { findUnique: jest.fn(), update: jest.fn() },
    community: { findMany: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
    communityMember: { create: jest.fn() },
    $transaction: jest.fn(),
  };

  let service: CommunitiesService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(async (callback: any) => callback(mockPrisma));
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
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'u1' },
        data: expect.objectContaining({ tunedSceneId: 'c2' }),
      })
    );
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

  it('sets home scene to a city-tier scene in the same state', async () => {
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
    mockPrisma.user.update.mockResolvedValue({ id: 'u1' });
    mockPrisma.communityMember.create.mockResolvedValue({ id: 'm1' });
    mockPrisma.community.update.mockResolvedValue({ id: 'c2' });

    const result = await service.setHomeScene('u1', { sceneId: 'c2' });

    expect(result.homeSceneId).toBe('c2');
    expect(result.tunedSceneId).toBe('c2');
    expect(result.previousHomeSceneId).toBe('c1');
    expect(result.changed).toBe(true);
  });

  it('returns persisted tuned scene context when available', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      tunedSceneId: 'c2',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });

    mockPrisma.community.findFirst.mockResolvedValue({ id: 'c1' });
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'c2',
      name: 'Dallas Punk',
      city: 'Dallas',
      state: 'TX',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });

    const result = await service.getDiscoveryContext('u1');

    expect(result.tunedSceneId).toBe('c2');
    expect(result.homeSceneId).toBe('c1');
    expect(result.isVisitor).toBe(true);
  });

  it('falls back to home scene when tuned scene is not set', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      tunedSceneId: null,
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });

    mockPrisma.community.findFirst.mockResolvedValue({ id: 'c1' });
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'c1',
      name: 'Austin Punk',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });

    const result = await service.getDiscoveryContext('u1');
    expect(result.tunedSceneId).toBe('c1');
    expect(result.homeSceneId).toBe('c1');
    expect(result.isVisitor).toBe(false);
  });

  it('rejects cross-state home scene switches', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });

    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'c3',
      name: 'Los Angeles Punk',
      city: 'Los Angeles',
      state: 'CA',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });

    await expect(service.setHomeScene('u1', { sceneId: 'c3' })).rejects.toThrow(BadRequestException);
  });

  it('rejects non-city scenes when setting home scene', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });

    mockPrisma.community.findUnique.mockResolvedValue({
      id: 's1',
      name: 'Texas Punk',
      city: null,
      state: 'TX',
      musicCommunity: 'Punk',
      tier: 'state',
      isActive: true,
    });

    await expect(service.setHomeScene('u1', { sceneId: 's1' })).rejects.toThrow(BadRequestException);
  });
});
