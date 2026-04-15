import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AdminAnalyticsQueryData } from '@uprise/types';

type CountByTypeRow = {
  type: string;
  _count: { type?: number; trackId?: number };
};

@Injectable()
export class AdminAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private buildActionTotals(rows: CountByTypeRow[]) {
    const totals = {
      add: 0,
      blast: 0,
      recommend: 0,
    };

    for (const row of rows) {
      const key = row.type.trim().toUpperCase();
      if (key === 'ADD') totals.add = row._count.type ?? 0;
      if (key === 'BLAST') totals.blast = row._count.type ?? 0;
      if (key === 'RECOMMEND') totals.recommend = row._count.type ?? 0;
    }

    return totals;
  }

  async queryAnalytics(): Promise<{ success: true; data: AdminAnalyticsQueryData }> {
    const [
      users,
      communities,
      artistBands,
      events,
      tracks,
      signals,
      follows,
      signalActionRows,
      totalListening,
      mostListenedTracks,
      trackVoteCount,
      mostUpvotedTrackRows,
      rotationEntries,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.community.count(),
      this.prisma.artistBand.count(),
      this.prisma.event.count(),
      this.prisma.track.count(),
      this.prisma.signal.count(),
      this.prisma.follow.count(),
      this.prisma.signalAction.groupBy({
        by: ['type'],
        _count: { type: true },
      }),
      this.prisma.track.aggregate({
        _sum: { playCount: true },
      }),
      this.prisma.track.findMany({
        select: {
          id: true,
          title: true,
          artist: true,
          playCount: true,
          community: {
            select: {
              name: true,
              tier: true,
            },
          },
        },
        orderBy: [{ playCount: 'desc' }, { createdAt: 'desc' }],
        take: 10,
      }),
      this.prisma.trackVote.count(),
      this.prisma.trackVote.groupBy({
        by: ['trackId'],
        _count: { trackId: true },
        orderBy: {
          _count: {
            trackId: 'desc',
          },
        },
        take: 10,
      }),
      this.prisma.rotationEntry.findMany({
        select: {
          scene: {
            select: {
              tier: true,
            },
          },
        },
      }),
    ]);

    const actionTotals = this.buildActionTotals(signalActionRows as CountByTypeRow[]);

    const topVotedTrackIds = mostUpvotedTrackRows.map((row: { trackId: string }) => row.trackId);
    const mostUpvotedTracks =
      topVotedTrackIds.length === 0
        ? []
        : await this.prisma.track.findMany({
            where: {
              id: {
                in: topVotedTrackIds,
              },
            },
            select: {
              id: true,
              title: true,
              artist: true,
              community: {
                select: {
                  name: true,
                  tier: true,
                },
              },
            },
          });

    const votedTrackMap = new Map(
      mostUpvotedTracks.map((track: {
        id: string;
        title: string;
        artist: string;
        community: { name: string; tier: string } | null;
      }) => [track.id, track]),
    );

    const appearanceCountByTier = rotationEntries.reduce<Record<string, number>>((acc, entry: { scene: { tier: string } | null }) => {
      const tier = entry.scene?.tier ?? 'unknown';
      acc[tier] = (acc[tier] ?? 0) + 1;
      return acc;
    }, {});

    return {
      success: true,
      data: {
        platformTotals: {
          users,
          communities,
          artistBands,
          events,
          tracks,
          signals,
          follows,
        },
        signalActionTotals: {
          ...actionTotals,
          upvote: trackVoteCount,
        },
        retainedMetrics: {
          listenCountAllTime: {
            tracked: true,
            total: totalListening._sum.playCount ?? 0,
          },
          mostListenedSignals: {
            tracked: true,
            items: mostListenedTracks.map((track: {
              id: string;
              title: string;
              artist: string;
              playCount: number;
              community: { name: string; tier: string } | null;
            }) => ({
              trackId: track.id,
              title: track.title,
              artist: track.artist,
              communityName: track.community?.name ?? null,
              communityTier: track.community?.tier ?? null,
              value: track.playCount,
            })),
          },
          mostUpvotedSignals: {
            tracked: true,
            items: mostUpvotedTrackRows.map((row: { trackId: string; _count: { trackId?: number } }) => {
              const track = votedTrackMap.get(row.trackId);

              return {
                trackId: row.trackId,
                title: track?.title ?? 'Unknown Track',
                artist: track?.artist ?? 'Unknown Artist',
                communityName: track?.community?.name ?? null,
                communityTier: track?.community?.tier ?? null,
                value: row._count.trackId ?? 0,
              };
            }),
          },
          mixtapeAppearanceCount: {
            tracked: false,
            reason: 'Mixologist and mixtape runtime is not implemented in the current MVP.',
          },
          appearanceCountByTier: {
            tracked: true,
            counts: appearanceCountByTier,
          },
        },
      },
    };
  }
}
