import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommunitiesService } from '../src/communities/communities.service';

describe('CommunitiesService.discoverScenes', () => {
  const mockPrisma = {
    user: { findUnique: jest.fn(), update: jest.fn() },
    community: { findMany: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
    communityMember: { create: jest.fn() },
    artistBand: { findMany: jest.fn(), findFirst: jest.fn() },
    track: { findMany: jest.fn() },
    follow: { groupBy: jest.fn() },
    signal: { findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn() },
    signalAction: { findMany: jest.fn(), groupBy: jest.fn(), upsert: jest.fn() },
    collection: { upsert: jest.fn() },
    collectionItem: { upsert: jest.fn() },
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

  it('returns deterministic scene items without home-scene markers when reads are anonymous', async () => {
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
    ]);

    const result = await service.discoverScenes(null, {
      tier: 'city',
      musicCommunity: 'Punk',
      state: 'TX',
      limit: 50,
    });

    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    expect(result.items).toEqual([
      expect.objectContaining({
        entryType: 'city_scene',
        sceneId: 'c1',
        isHomeScene: false,
      }),
    ]);
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

  it('returns neutral context when discovery context is requested without auth', async () => {
    const result = await service.getDiscoveryContext(null);

    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    expect(result).toEqual({
      tunedSceneId: null,
      tunedScene: null,
      homeSceneId: null,
      isVisitor: false,
    });
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

  it('resolveActiveSceneId returns tuned scene id when available', async () => {
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

    await expect(service.resolveActiveSceneId('u1')).resolves.toBe('c2');
  });

  it('resolveActiveSceneId falls back to home scene id when tuned is absent', async () => {
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

    await expect(service.resolveActiveSceneId('u1')).resolves.toBe('c1');
  });

  it('searchCommunityDiscover returns local artist and song results for a scene', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'c1',
      name: 'Austin Punk',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });
    mockPrisma.artistBand.findMany.mockResolvedValue([
      {
        id: 'ab1',
        name: 'Signal Rise',
        slug: 'signal-rise',
        entityType: 'artist',
        homeSceneId: 'c1',
        homeScene: { name: 'Austin Punk' },
        _count: { members: 2 },
      },
    ]);
    mockPrisma.track.findMany.mockResolvedValue([
      {
        id: 't1',
        title: 'Signal Fire',
        artist: 'Signal Rise',
        coverArt: null,
        playCount: 12,
        likeCount: 5,
        status: 'ready',
        uploadedById: 'uploader-1',
        communityId: 'c1',
        community: { name: 'Austin Punk' },
      },
    ]);
    mockPrisma.follow.groupBy.mockResolvedValue([{ entityId: 'ab1', _count: { entityId: 3 } }]);
    mockPrisma.artistBand.findFirst.mockResolvedValueOnce({
      id: 'ab1',
      name: 'Signal Rise',
    });

    const result = await service.searchCommunityDiscover('u1', 'c1', {
      query: 'signal',
      limit: 6,
    });

    expect(result.community.id).toBe('c1');
    expect(result.artists).toEqual([
      expect.objectContaining({
        artistBandId: 'ab1',
        name: 'Signal Rise',
        followCount: 3,
      }),
    ]);
    expect(result.songs).toEqual([
      expect.objectContaining({
        trackId: 't1',
        artistBandId: 'ab1',
        artistBandName: 'Signal Rise',
      }),
    ]);
  });

  it('getCommunityDiscoverHighlights aggregates popular singles lenses and listener recommendations', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'c1',
      name: 'Austin Punk',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });
    mockPrisma.signal.findMany
      .mockResolvedValueOnce([
        {
          id: 's1',
          type: 'single',
          metadata: { title: 'Signal Fire' },
          communityId: 'c1',
          createdAt: new Date('2026-03-23T10:00:00.000Z'),
        },
        {
          id: 's2',
          type: 'single',
          metadata: { title: 'City Burn' },
          communityId: 'c1',
          createdAt: new Date('2026-03-23T11:00:00.000Z'),
        },
      ]);
    mockPrisma.signalAction.findMany.mockResolvedValue([
      {
        id: 'recommend-1',
        createdAt: new Date('2026-03-24T12:00:00.000Z'),
        user: {
          id: 'u2',
          username: 'listener2',
          displayName: 'Listener Two',
          avatar: null,
        },
        signal: {
          id: 's1',
          type: 'single',
          metadata: { title: 'Signal Fire' },
          communityId: 'c1',
          createdAt: new Date('2026-03-23T10:00:00.000Z'),
        },
      },
    ]);
    mockPrisma.signalAction.groupBy
      .mockResolvedValueOnce([
        { signalId: 's1', type: 'RECOMMEND', _count: { type: 4 } },
        { signalId: 's1', type: 'ADD', _count: { type: 6 } },
        { signalId: 's2', type: 'ADD', _count: { type: 3 } },
        { signalId: 's2', type: 'SUPPORT', _count: { type: 5 } },
      ])
      .mockResolvedValueOnce([
        { signalId: 's1', type: 'SUPPORT', _count: { type: 2 } },
        { signalId: 's2', type: 'SUPPORT', _count: { type: 5 } },
      ]);

    const result = await service.getCommunityDiscoverHighlights('u1', 'c1', { limit: 8 });

    expect(result.popularSingles.mostAdded).toEqual([
      expect.objectContaining({
        signalId: 's1',
        lensMetricValue: 6,
        lensMetricLabel: 'All-time adds',
      }),
      expect.objectContaining({
        signalId: 's2',
        lensMetricValue: 3,
        lensMetricLabel: 'All-time adds',
      }),
    ]);
    expect(result.popularSingles.supportedNow).toEqual([
      expect.objectContaining({
        signalId: 's2',
        lensMetricValue: 5,
        lensMetricLabel: 'Supports in the last 7 days',
      }),
      expect.objectContaining({
        signalId: 's1',
        lensMetricValue: 2,
        lensMetricLabel: 'Supports in the last 7 days',
      }),
    ]);
    expect(result.popularSingles.recentRises).toEqual([]);
    expect(result.recommendations).toEqual([
      expect.objectContaining({
        recommendationId: 'recommend-1',
        actor: expect.objectContaining({
          id: 'u2',
          username: 'listener2',
        }),
        signal: expect.objectContaining({
          signalId: 's1',
          lensMetricValue: 4,
          lensMetricLabel: 'Active recommendations',
          actionCounts: expect.objectContaining({ recommend: 4 }),
        }),
      }),
    ]);

    expect(mockPrisma.signal.findMany).toHaveBeenCalledWith(
      expect.not.objectContaining({
        take: expect.any(Number),
      }),
    );
    expect(mockPrisma.signalAction.findMany).toHaveBeenCalledWith(
      expect.not.objectContaining({
        take: expect.any(Number),
      }),
    );
  });

  it('saveDiscoverUprise creates or reuses an Uprise signal and adds it to the uprises shelf', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'c1',
      name: 'Austin Punk',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });
    mockPrisma.signal.findFirst.mockResolvedValue(null);
    mockPrisma.signal.create.mockResolvedValue({ id: 'signal-u1' });
    mockPrisma.collection.upsert.mockResolvedValue({ id: 'collection-1' });
    mockPrisma.signalAction.upsert.mockResolvedValue({ id: 'action-1' });
    mockPrisma.collectionItem.upsert.mockResolvedValue({ id: 'item-1' });

    const result = await service.saveDiscoverUprise('user-1', { sceneId: 'c1' });

    expect(result).toEqual(
      expect.objectContaining({
        signalId: 'signal-u1',
        collectionId: 'collection-1',
        collectionItemId: 'item-1',
        actionId: 'action-1',
        shelf: 'uprises',
      }),
    );
    expect(mockPrisma.signal.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'uprise',
          communityId: 'c1',
        }),
      }),
    );
  });
});
