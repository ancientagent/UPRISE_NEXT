import { AdminAnalyticsService } from '../src/admin-analytics/admin-analytics.service';

const mockPrisma = {
  user: { count: jest.fn() },
  community: { count: jest.fn(), findMany: jest.fn() },
  artistBand: { count: jest.fn() },
  event: { count: jest.fn() },
  track: { count: jest.fn(), aggregate: jest.fn(), findMany: jest.fn() },
  signal: { count: jest.fn() },
  follow: { count: jest.fn() },
  signalAction: { groupBy: jest.fn() },
  trackVote: { count: jest.fn(), groupBy: jest.fn() },
  rotationEntry: { findMany: jest.fn() },
};

describe('AdminAnalyticsService', () => {
  let service: AdminAnalyticsService;

  beforeEach(() => {
    jest.clearAllMocks();
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
      maxPlayableSecondsPerSource: 1200,
      maxPlayableMinutesPerSource: 20,
    });
    expect(result.data.candidates).toEqual([
      expect.objectContaining({
        city: 'El Paso',
        state: 'TX',
        musicCommunity: 'punk',
        distinctSourceCount: 5,
        rawPlayableSeconds: 3900,
        cappedPlayableSeconds: 3600,
        cappedPlayableMinutes: 60,
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
});
