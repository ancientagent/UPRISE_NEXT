import { AdminAnalyticsService } from '../src/admin-analytics/admin-analytics.service';

const mockPrisma = {
  user: { count: jest.fn() },
  community: { count: jest.fn() },
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
});
