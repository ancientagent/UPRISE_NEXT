import { AdminAnalyticsService } from '../src/admin-analytics/admin-analytics.service';

const mockPrisma = {
  user: { count: jest.fn(), upsert: jest.fn(), findMany: jest.fn(), updateMany: jest.fn() },
  userMusicCommunityPreference: { findMany: jest.fn() },
  community: { count: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
  artistBand: { count: jest.fn(), findMany: jest.fn(), updateMany: jest.fn() },
  event: { count: jest.fn() },
  track: { count: jest.fn(), aggregate: jest.fn(), findMany: jest.fn(), updateMany: jest.fn() },
  signal: { count: jest.fn() },
  follow: { count: jest.fn() },
  signalAction: { groupBy: jest.fn() },
  trackVote: { count: jest.fn(), groupBy: jest.fn() },
  rotationEntry: { findMany: jest.fn() },
  userSavedScene: { createMany: jest.fn() },
  userActivationNotice: { createMany: jest.fn() },
  communityActivationAudit: { create: jest.fn() },
  $transaction: jest.fn(),
};

describe('AdminAnalyticsService', () => {
  let service: AdminAnalyticsService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(async (callback: any) => callback(mockPrisma));
    mockPrisma.artistBand.findMany.mockResolvedValue([]);
    mockPrisma.user.findMany.mockResolvedValue([]);
    mockPrisma.userSavedScene.createMany.mockResolvedValue({ count: 0 });
    mockPrisma.userActivationNotice.createMany.mockResolvedValue({ count: 0 });
    mockPrisma.communityActivationAudit.create.mockResolvedValue({ id: 'activation-audit-1' });
    service = new AdminAnalyticsService(mockPrisma as any);
  });

  it('returns retained analytics using current runtime data sources', async () => {
    mockPrisma.user.count.mockResolvedValue(12);
    mockPrisma.community.count.mockResolvedValue(5);
    mockPrisma.artistBand.count.mockResolvedValue(3);
    mockPrisma.event.count.mockResolvedValue(7);
    mockPrisma.track.count.mockResolvedValue(19);
    mockPrisma.signal.count.mockResolvedValue(23);
    mockPrisma.follow.count.mockResolvedValue(11);
    mockPrisma.signalAction.groupBy.mockResolvedValue([
      { type: 'ADD', _count: { type: 20 } },
      { type: 'BLAST', _count: { type: 8 } },
      { type: 'RECOMMEND', _count: { type: 6 } },
    ]);
    mockPrisma.track.aggregate.mockResolvedValue({
      _sum: { playCount: 444 },
    });
    mockPrisma.track.findMany
      .mockResolvedValueOnce([
        {
          id: 'track-1',
          title: 'Signal One',
          artist: 'Artist A',
          playCount: 210,
          community: { name: 'Austin Punk', tier: 'city' },
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'track-1',
          title: 'Signal One',
          artist: 'Artist A',
          community: { name: 'Austin Punk', tier: 'city' },
        },
      ]);
    mockPrisma.trackVote.count.mockResolvedValue(17);
    mockPrisma.trackVote.groupBy.mockResolvedValue([
      { trackId: 'track-1', _count: { trackId: 9 } },
    ]);
    mockPrisma.rotationEntry.findMany.mockResolvedValue([
      { scene: { tier: 'city' } },
      { scene: { tier: 'state' } },
      { scene: { tier: 'state' } },
    ]);

    const result = await service.queryAnalytics();

    expect(result.success).toBe(true);
    expect(result.data.platformTotals).toEqual({
      users: 12,
      communities: 5,
      artistBands: 3,
      events: 7,
      tracks: 19,
      signals: 23,
      follows: 11,
    });
    expect(result.data.signalActionTotals).toEqual({
      add: 20,
      blast: 8,
      recommend: 6,
      upvote: 17,
    });
    expect(result.data.retainedMetrics.listenCountAllTime).toEqual({
      tracked: true,
      total: 444,
    });
    expect(result.data.retainedMetrics.mostListenedSignals.items).toEqual([
      expect.objectContaining({
        trackId: 'track-1',
        value: 210,
      }),
    ]);
    expect(result.data.retainedMetrics.mostUpvotedSignals.items).toEqual([
      expect.objectContaining({
        trackId: 'track-1',
        value: 9,
      }),
    ]);
    expect(result.data.retainedMetrics.mixtapeAppearanceCount).toEqual({
      tracked: false,
      reason: 'Mixologist and mixtape runtime is not implemented in the current MVP.',
    });
    expect(result.data.retainedMetrics.appearanceCountByTier).toEqual({
      tracked: true,
      counts: {
        city: 1,
        state: 2,
      },
    });
  });

  it('returns activation readiness diagnostics from source-origin approved playable minutes', async () => {
    mockPrisma.track.findMany.mockResolvedValue([
      {
        id: 'el-paso-track-1',
        duration: 900,
        artistBand: {
          id: 'source-1',
          name: 'Static Signal',
          sourceOriginCity: 'El Paso',
          sourceOriginState: 'TX',
          sourceOriginMusicCommunity: 'punk',
        },
      },
      {
        id: 'el-paso-track-2',
        duration: 600,
        artistBand: {
          id: 'source-1',
          name: 'Static Signal',
          sourceOriginCity: 'El Paso',
          sourceOriginState: 'TX',
          sourceOriginMusicCommunity: 'punk',
        },
      },
      {
        id: 'el-paso-track-3',
        duration: 600,
        artistBand: {
          id: 'source-2',
          name: 'Border Current',
          sourceOriginCity: 'El Paso',
          sourceOriginState: 'TX',
          sourceOriginMusicCommunity: 'punk',
        },
      },
      {
        id: 'el-paso-track-4',
        duration: 600,
        artistBand: {
          id: 'source-3',
          name: 'Desert Choir',
          sourceOriginCity: 'El Paso',
          sourceOriginState: 'TX',
          sourceOriginMusicCommunity: 'punk',
        },
      },
      {
        id: 'el-paso-track-5',
        duration: 600,
        artistBand: {
          id: 'source-4',
          name: 'Franklin Static',
          sourceOriginCity: 'El Paso',
          sourceOriginState: 'TX',
          sourceOriginMusicCommunity: 'punk',
        },
      },
      {
        id: 'el-paso-track-6',
        duration: 600,
        artistBand: {
          id: 'source-5',
          name: 'Sun City Feedback',
          sourceOriginCity: 'El Paso',
          sourceOriginState: 'TX',
          sourceOriginMusicCommunity: 'punk',
        },
      },
      {
        id: 'austin-track-1',
        duration: 500,
        artistBand: {
          id: 'source-austin',
          name: 'Austin Source',
          sourceOriginCity: 'Austin',
          sourceOriginState: 'TX',
          sourceOriginMusicCommunity: 'punk',
        },
      },
    ]);
    mockPrisma.community.findMany.mockResolvedValue([
      {
        id: 'scene-austin-punk',
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'punk',
        tier: 'city',
        isActive: true,
      },
    ]);

    const result = await service.getActivationReadinessDiagnostics();

    expect(mockPrisma.track.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'ready',
          artistBandId: { not: null },
        }),
      }),
    );
    expect(result.success).toBe(true);
    expect(result.data.thresholds).toEqual({
      requiredPlayableSeconds: 2700,
      requiredPlayableMinutes: 45,
      requiredDistinctSources: 5,
      maxPlayableSecondsPerSource: 900,
      maxPlayableMinutesPerSource: 15,
    });
    expect(result.data.candidates).toEqual([
      expect.objectContaining({
        city: 'El Paso',
        state: 'TX',
        musicCommunity: 'punk',
        distinctSourceCount: 5,
        rawPlayableSeconds: 3900,
        cappedPlayableSeconds: 3300,
        cappedPlayableMinutes: 55,
        ready: true,
        existingActiveSceneId: null,
      }),
    ]);
  });

  it('excludes tracks without ready status or source-origin identity from activation readiness', async () => {
    mockPrisma.track.findMany.mockResolvedValue([
      {
        id: 'processing-track',
        duration: 600,
        status: 'processing',
        artistBand: {
          id: 'source-processing',
          name: 'Processing Source',
          sourceOriginCity: 'El Paso',
          sourceOriginState: 'TX',
          sourceOriginMusicCommunity: 'punk',
        },
      },
      {
        id: 'missing-origin-track',
        duration: 600,
        artistBand: {
          id: 'source-missing-origin',
          name: 'Missing Origin Source',
          sourceOriginCity: null,
          sourceOriginState: 'TX',
          sourceOriginMusicCommunity: 'punk',
        },
      },
    ]);
    mockPrisma.community.findMany.mockResolvedValue([]);

    const result = await service.getActivationReadinessDiagnostics();

    expect(mockPrisma.track.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'ready',
        }),
      }),
    );
    expect(result.data.candidates).toEqual([]);
  });

  it('creates a missing natural scene and re-anchors matching sources when a ready tuple is manually activated', async () => {
    mockPrisma.track.findMany.mockResolvedValue([
      ...[1, 2, 3, 4, 5].map((index) => ({
        id: `el-paso-track-${index}`,
        duration: 600,
        artistBand: {
          id: `source-${index}`,
          name: `El Paso Source ${index}`,
          sourceOriginCity: 'El Paso',
          sourceOriginState: 'Texas',
          sourceOriginMusicCommunity: 'Punk',
        },
      })),
    ]);
    mockPrisma.community.findMany.mockResolvedValue([]);
    mockPrisma.community.findFirst.mockResolvedValue(null);
    mockPrisma.user.upsert.mockResolvedValue({ id: 'system-user-1' });
    mockPrisma.community.create.mockResolvedValue({
      id: 'scene-el-paso-punk',
      name: 'El Paso, Texas Punk',
      city: 'El Paso',
      state: 'Texas',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });
    mockPrisma.artistBand.findMany.mockResolvedValue([
      { id: 'source-1' },
      { id: 'source-2' },
      { id: 'source-3' },
      { id: 'source-4' },
      { id: 'source-5' },
    ]);
    mockPrisma.artistBand.updateMany.mockResolvedValue({ count: 5 });
    mockPrisma.user.findMany.mockResolvedValue([
      {
        id: 'listener-1',
        tunedSceneId: 'scene-austin-punk',
        homeSceneCity: 'El Paso',
        homeSceneState: 'Texas',
        homeSceneCommunity: 'Punk',
        musicCommunityPreferences: [],
      },
      {
        id: 'listener-2',
        tunedSceneId: null,
        homeSceneCity: 'El Paso',
        homeSceneState: 'Texas',
        homeSceneCommunity: 'Punk',
        musicCommunityPreferences: [],
      },
    ]);
    mockPrisma.userSavedScene.createMany.mockResolvedValue({ count: 1 });
    mockPrisma.userActivationNotice.createMany.mockResolvedValue({ count: 2 });
    mockPrisma.user.updateMany.mockResolvedValue({ count: 2 });

    const result = await service.activateReadyCommunity({
      city: 'El Paso',
      state: 'Texas',
      musicCommunity: 'Punk',
    });

    expect(mockPrisma.community.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: 'El Paso, Texas Punk',
        slug: 'home-scene-el-paso-texas-punk',
        city: 'El Paso',
        state: 'Texas',
        musicCommunity: 'Punk',
        tier: 'city',
        isActive: true,
        createdById: 'system-user-1',
      }),
    });
    expect(mockPrisma.artistBand.updateMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: ['source-1', 'source-2', 'source-3', 'source-4', 'source-5'],
        },
      },
      data: { homeSceneId: 'scene-el-paso-punk' },
    });
    expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
      where: {
        homeSceneCity: { contains: 'El Paso', mode: 'insensitive' },
        homeSceneState: { contains: 'Texas', mode: 'insensitive' },
        OR: [
          { homeSceneCommunity: { not: null } },
          {
            musicCommunityPreferences: {
              some: {
                isDefault: true,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        tunedSceneId: true,
        homeSceneCity: true,
        homeSceneState: true,
        homeSceneCommunity: true,
        musicCommunityPreferences: {
          where: { isDefault: true },
          select: { musicCommunity: true },
        },
      },
      orderBy: { id: 'asc' },
    });
    expect(mockPrisma.userSavedScene.createMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          userId: 'listener-1',
          communityId: 'scene-austin-punk',
          reason: 'former_proxy_cutover',
        }),
      ],
      skipDuplicates: true,
    });
    expect(mockPrisma.userActivationNotice.createMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          userId: 'listener-1',
          fromSceneId: 'scene-austin-punk',
          toSceneId: 'scene-el-paso-punk',
          reason: 'natural_home_scene_activated',
        }),
        expect.objectContaining({
          userId: 'listener-2',
          fromSceneId: null,
          toSceneId: 'scene-el-paso-punk',
          reason: 'natural_home_scene_activated',
        }),
      ],
      skipDuplicates: true,
    });
    expect(mockPrisma.user.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['listener-1', 'listener-2'] } },
      data: expect.objectContaining({
        tunedSceneId: 'scene-el-paso-punk',
        tunedSceneUpdatedAt: expect.any(Date),
      }),
    });
    expect(mockPrisma.communityActivationAudit.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        sceneId: 'scene-el-paso-punk',
        city: 'El Paso',
        state: 'Texas',
        musicCommunity: 'Punk',
        createdScene: true,
        reanchoredSourceIds: ['source-1', 'source-2', 'source-3', 'source-4', 'source-5'],
        cutoverListenerIds: ['listener-1', 'listener-2'],
        savedAwaySceneCount: 1,
        activationNoticeCount: 2,
      }),
      select: { id: true },
    });
    expect(mockPrisma.track.updateMany).not.toHaveBeenCalled();
    expect(result.data).toEqual(
      expect.objectContaining({
        sceneId: 'scene-el-paso-punk',
        activationAuditId: 'activation-audit-1',
        city: 'El Paso',
        state: 'Texas',
        musicCommunity: 'Punk',
        created: true,
        activated: true,
        reanchoredSourceCount: 5,
        cutoverListenerCount: 2,
        savedAwaySceneCount: 1,
        activationNoticeCount: 2,
      }),
    );
  });

  it('revalidates activation readiness inside the cutover transaction before writing', async () => {
    const readyTracks = [
      ...[1, 2, 3, 4, 5].map((index) => ({
        id: `el-paso-track-${index}`,
        duration: 600,
        artistBand: {
          id: `source-${index}`,
          name: `El Paso Source ${index}`,
          sourceOriginCity: 'El Paso',
          sourceOriginState: 'Texas',
          sourceOriginMusicCommunity: 'Punk',
        },
      })),
    ];
    mockPrisma.track.findMany
      .mockResolvedValueOnce(readyTracks)
      .mockResolvedValueOnce([
        {
          id: 'stale-track',
          duration: 600,
          artistBand: {
            id: 'source-1',
            name: 'One Source',
            sourceOriginCity: 'El Paso',
            sourceOriginState: 'Texas',
            sourceOriginMusicCommunity: 'Punk',
          },
        },
      ]);
    mockPrisma.community.findMany.mockResolvedValue([]);
    mockPrisma.community.findFirst.mockResolvedValue(null);

    await expect(
      service.activateReadyCommunity({
        city: 'El Paso',
        state: 'Texas',
        musicCommunity: 'Punk',
      }),
    ).rejects.toThrow('Activation readiness threshold has not been met');

    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(mockPrisma.track.findMany).toHaveBeenCalledTimes(2);
    expect(mockPrisma.community.findMany).toHaveBeenCalledTimes(2);
    expect(mockPrisma.community.create).not.toHaveBeenCalled();
    expect(mockPrisma.community.update).not.toHaveBeenCalled();
    expect(mockPrisma.artistBand.updateMany).not.toHaveBeenCalled();
    expect(mockPrisma.user.updateMany).not.toHaveBeenCalled();
  });

  it('cuts over sources and listeners with normalized tuple matching', async () => {
    mockPrisma.track.findMany.mockResolvedValue([
      ...[1, 2, 3, 4, 5].map((index) => ({
        id: `el-paso-track-${index}`,
        duration: 600,
        artistBand: {
          id: `source-${index}`,
          name: `El Paso Source ${index}`,
          sourceOriginCity: ' El Paso ',
          sourceOriginState: ' Texas ',
          sourceOriginMusicCommunity: ' Punk ',
        },
      })),
    ]);
    mockPrisma.community.findMany.mockResolvedValue([]);
    mockPrisma.community.findFirst.mockResolvedValue(null);
    mockPrisma.user.upsert.mockResolvedValue({ id: 'system-user-1' });
    mockPrisma.community.create.mockResolvedValue({
      id: 'scene-el-paso-punk',
      name: 'El Paso, Texas Punk',
      city: 'El Paso',
      state: 'Texas',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });
    mockPrisma.artistBand.updateMany.mockResolvedValue({ count: 5 });
    mockPrisma.user.findMany.mockResolvedValue([
      {
        id: 'listener-case',
        tunedSceneId: 'scene-austin-punk',
        homeSceneCity: ' el paso ',
        homeSceneState: 'TEXAS ',
        homeSceneCommunity: ' punk ',
        musicCommunityPreferences: [],
      },
      {
        id: 'listener-default',
        tunedSceneId: null,
        homeSceneCity: 'EL PASO',
        homeSceneState: 'texas',
        homeSceneCommunity: null,
        musicCommunityPreferences: [{ musicCommunity: ' PUNK ' }],
      },
      {
        id: 'listener-other-state',
        tunedSceneId: 'scene-austin-punk',
        homeSceneCity: 'El Paso',
        homeSceneState: 'New Mexico',
        homeSceneCommunity: 'Punk',
        musicCommunityPreferences: [],
      },
    ]);
    mockPrisma.userSavedScene.createMany.mockResolvedValue({ count: 1 });
    mockPrisma.userActivationNotice.createMany.mockResolvedValue({ count: 2 });
    mockPrisma.user.updateMany.mockResolvedValue({ count: 2 });

    const result = await service.activateReadyCommunity({
      city: 'el paso',
      state: 'texas',
      musicCommunity: 'punk',
    });

    expect(mockPrisma.artistBand.updateMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: ['source-1', 'source-2', 'source-3', 'source-4', 'source-5'],
        },
      },
      data: { homeSceneId: 'scene-el-paso-punk' },
    });
    expect(mockPrisma.user.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['listener-case', 'listener-default'] } },
      data: expect.objectContaining({
        tunedSceneId: 'scene-el-paso-punk',
        tunedSceneUpdatedAt: expect.any(Date),
      }),
    });
    expect(mockPrisma.communityActivationAudit.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        city: 'El Paso',
        state: 'Texas',
        musicCommunity: 'Punk',
        reanchoredSourceIds: ['source-1', 'source-2', 'source-3', 'source-4', 'source-5'],
        cutoverListenerIds: ['listener-case', 'listener-default'],
      }),
      select: { id: true },
    });
    expect(result.data).toEqual(
      expect.objectContaining({
        city: 'El Paso',
        state: 'Texas',
        musicCommunity: 'Punk',
        cutoverListenerCount: 2,
      }),
    );
  });

  it('cuts over listeners by city/state and default music-community preference when compatibility community is stale', async () => {
    mockPrisma.track.findMany.mockResolvedValue([
      ...[1, 2, 3, 4, 5].map((index) => ({
        id: `el-paso-track-${index}`,
        duration: 600,
        artistBand: {
          id: `source-${index}`,
          name: `El Paso Source ${index}`,
          sourceOriginCity: 'El Paso',
          sourceOriginState: 'Texas',
          sourceOriginMusicCommunity: 'Punk',
        },
      })),
    ]);
    mockPrisma.community.findMany.mockResolvedValue([]);
    mockPrisma.community.findFirst.mockResolvedValue(null);
    mockPrisma.user.upsert.mockResolvedValue({ id: 'system-user-1' });
    mockPrisma.community.create.mockResolvedValue({
      id: 'scene-el-paso-punk',
      name: 'El Paso, Texas Punk',
      city: 'El Paso',
      state: 'Texas',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });
    mockPrisma.artistBand.updateMany.mockResolvedValue({ count: 5 });
    mockPrisma.user.findMany.mockResolvedValue([
      {
        id: 'listener-default',
        tunedSceneId: 'scene-austin-punk',
        homeSceneCity: 'El Paso',
        homeSceneState: 'Texas',
        homeSceneCommunity: null,
        musicCommunityPreferences: [{ musicCommunity: 'Punk' }],
      },
    ]);
    mockPrisma.userSavedScene.createMany.mockResolvedValue({ count: 1 });
    mockPrisma.userActivationNotice.createMany.mockResolvedValue({ count: 1 });
    mockPrisma.user.updateMany.mockResolvedValue({ count: 1 });

    await service.activateReadyCommunity({
      city: 'El Paso',
      state: 'Texas',
      musicCommunity: 'Punk',
    });

    expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
      where: {
        homeSceneCity: { contains: 'El Paso', mode: 'insensitive' },
        homeSceneState: { contains: 'Texas', mode: 'insensitive' },
        OR: [
          { homeSceneCommunity: { not: null } },
          {
            musicCommunityPreferences: {
              some: {
                isDefault: true,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        tunedSceneId: true,
        homeSceneCity: true,
        homeSceneState: true,
        homeSceneCommunity: true,
        musicCommunityPreferences: {
          where: { isDefault: true },
          select: { musicCommunity: true },
        },
      },
      orderBy: { id: 'asc' },
    });
    expect(mockPrisma.user.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['listener-default'] } },
      data: expect.objectContaining({
        tunedSceneId: 'scene-el-paso-punk',
        tunedSceneUpdatedAt: expect.any(Date),
      }),
    });
  });

  it('activates an existing inactive natural scene without creating a duplicate', async () => {
    mockPrisma.track.findMany.mockResolvedValue([
      ...[1, 2, 3, 4, 5].map((index) => ({
        id: `el-paso-track-${index}`,
        duration: 600,
        artistBand: {
          id: `source-${index}`,
          name: `El Paso Source ${index}`,
          sourceOriginCity: 'El Paso',
          sourceOriginState: 'Texas',
          sourceOriginMusicCommunity: 'Punk',
        },
      })),
    ]);
    mockPrisma.community.findMany.mockResolvedValue([]);
    mockPrisma.community.findFirst.mockResolvedValue({
      id: 'inactive-el-paso-punk',
      city: 'El Paso',
      state: 'Texas',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: false,
    });
    mockPrisma.community.update.mockResolvedValue({
      id: 'inactive-el-paso-punk',
      city: 'El Paso',
      state: 'Texas',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });
    mockPrisma.artistBand.updateMany.mockResolvedValue({ count: 5 });
    mockPrisma.user.findMany.mockResolvedValue([
      {
        id: 'listener-1',
        tunedSceneId: 'scene-austin-punk',
        homeSceneCity: 'El Paso',
        homeSceneState: 'Texas',
        homeSceneCommunity: 'Punk',
        musicCommunityPreferences: [],
      },
    ]);
    mockPrisma.userSavedScene.createMany.mockResolvedValue({ count: 1 });
    mockPrisma.userActivationNotice.createMany.mockResolvedValue({ count: 1 });
    mockPrisma.user.updateMany.mockResolvedValue({ count: 1 });

    const result = await service.activateReadyCommunity({
      city: 'El Paso',
      state: 'Texas',
      musicCommunity: 'Punk',
    });

    expect(mockPrisma.community.update).toHaveBeenCalledWith({
      where: { id: 'inactive-el-paso-punk' },
      data: { isActive: true },
    });
    expect(mockPrisma.community.create).not.toHaveBeenCalled();
    expect(result.data.created).toBe(false);
    expect(result.data.sceneId).toBe('inactive-el-paso-punk');
    expect(result.data.cutoverListenerCount).toBe(1);
    expect(result.data.savedAwaySceneCount).toBe(1);
  });

  it('rejects manual activation when the source-origin tuple is not ready', async () => {
    mockPrisma.track.findMany.mockResolvedValue([
      {
        id: 'short-track',
        duration: 600,
        artistBand: {
          id: 'source-1',
          name: 'One Source',
          sourceOriginCity: 'El Paso',
          sourceOriginState: 'Texas',
          sourceOriginMusicCommunity: 'Punk',
        },
      },
    ]);
    mockPrisma.community.findMany.mockResolvedValue([]);

    await expect(
      service.activateReadyCommunity({
        city: 'El Paso',
        state: 'Texas',
        musicCommunity: 'Punk',
      }),
    ).rejects.toThrow('Activation readiness threshold has not been met');

    expect(mockPrisma.community.create).not.toHaveBeenCalled();
    expect(mockPrisma.community.update).not.toHaveBeenCalled();
    expect(mockPrisma.artistBand.updateMany).not.toHaveBeenCalled();
    expect(mockPrisma.user.updateMany).not.toHaveBeenCalled();
  });

  it('rejects manual activation requests with missing tuple fields as bad requests', async () => {
    await expect(
      service.activateReadyCommunity({
        city: 'El Paso',
        state: '',
      } as any),
    ).rejects.toThrow('Activation requires city, state, and musicCommunity');

    expect(mockPrisma.track.findMany).not.toHaveBeenCalled();
    expect(mockPrisma.community.create).not.toHaveBeenCalled();
    expect(mockPrisma.artistBand.updateMany).not.toHaveBeenCalled();
    expect(mockPrisma.user.updateMany).not.toHaveBeenCalled();
  });
});
