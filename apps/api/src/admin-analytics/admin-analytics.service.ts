import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AdminAnalyticsQueryData } from '@uprise/types';
import {
  ensureLaunchCommunitySeedOwner,
  slugifyLaunchCommunity,
} from '../seed/launch-community-seed';

type CountByTypeRow = {
  type: string;
  _count: { type?: number; trackId?: number };
};

type ActivationTriggerInput = {
  city: string;
  state: string;
  musicCommunity: string;
};

const REQUIRED_PLAYABLE_SECONDS = 45 * 60;
const MAX_PLAYABLE_SECONDS_PER_SOURCE = 20 * 60;
const REQUIRED_DISTINCT_SOURCES = 5;

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

  async getActivationReadinessDiagnostics() {
    const tracks = await this.prisma.track.findMany({
      where: {
        status: 'ready',
        artistBandId: { not: null },
      },
      select: {
        id: true,
        duration: true,
        status: true,
        artistBand: {
          select: {
            id: true,
            name: true,
            sourceOriginCity: true,
            sourceOriginState: true,
            sourceOriginMusicCommunity: true,
          },
        },
      },
    });

    const activeScenes = await this.prisma.community.findMany({
      where: {
        tier: 'city',
        isActive: true,
      },
      select: {
        id: true,
        city: true,
        state: true,
        musicCommunity: true,
      },
    });

    const activeSceneByTuple = new Map(
      activeScenes.map((scene: { id: string; city: string | null; state: string | null; musicCommunity: string | null }) => [
        this.activationTupleKey(scene.city, scene.state, scene.musicCommunity),
        scene.id,
      ]),
    );

    const grouped = new Map<
      string,
      {
        city: string;
        state: string;
        musicCommunity: string;
        rawPlayableSeconds: number;
        sourceSeconds: Map<string, { sourceId: string; sourceName: string; rawPlayableSeconds: number }>;
      }
    >();

    for (const track of tracks as Array<{
      id: string;
      duration: number;
      status?: string;
      artistBand: {
        id: string;
        name: string;
        sourceOriginCity: string | null;
        sourceOriginState: string | null;
        sourceOriginMusicCommunity: string | null;
      } | null;
    }>) {
      if (track.status && track.status !== 'ready') continue;

      const source = track.artistBand;
      const city = source?.sourceOriginCity?.trim();
      const state = source?.sourceOriginState?.trim();
      const musicCommunity = source?.sourceOriginMusicCommunity?.trim();

      if (!source || !city || !state || !musicCommunity) continue;

      const key = this.activationTupleKey(city, state, musicCommunity);
      const candidate = grouped.get(key) ?? {
        city,
        state,
        musicCommunity,
        rawPlayableSeconds: 0,
        sourceSeconds: new Map<string, { sourceId: string; sourceName: string; rawPlayableSeconds: number }>(),
      };
      const sourceEntry = candidate.sourceSeconds.get(source.id) ?? {
        sourceId: source.id,
        sourceName: source.name,
        rawPlayableSeconds: 0,
      };

      sourceEntry.rawPlayableSeconds += track.duration;
      candidate.rawPlayableSeconds += track.duration;
      candidate.sourceSeconds.set(source.id, sourceEntry);
      grouped.set(key, candidate);
    }

    const candidates = [...grouped.entries()]
      .filter(([key]) => !activeSceneByTuple.has(key))
      .map(([_key, candidate]) => {
        const sources = [...candidate.sourceSeconds.values()].map((source) => ({
          ...source,
          cappedPlayableSeconds: Math.min(source.rawPlayableSeconds, MAX_PLAYABLE_SECONDS_PER_SOURCE),
          cappedPlayableMinutes: Math.round((Math.min(source.rawPlayableSeconds, MAX_PLAYABLE_SECONDS_PER_SOURCE) / 60) * 100) / 100,
        }));
        const cappedPlayableSeconds = sources.reduce((sum, source) => sum + source.cappedPlayableSeconds, 0);
        const distinctSourceCount = sources.length;

        return {
          city: candidate.city,
          state: candidate.state,
          musicCommunity: candidate.musicCommunity,
          distinctSourceCount,
          rawPlayableSeconds: candidate.rawPlayableSeconds,
          rawPlayableMinutes: Math.round((candidate.rawPlayableSeconds / 60) * 100) / 100,
          cappedPlayableSeconds,
          cappedPlayableMinutes: Math.round((cappedPlayableSeconds / 60) * 100) / 100,
          requiredPlayableSeconds: REQUIRED_PLAYABLE_SECONDS,
          requiredDistinctSources: REQUIRED_DISTINCT_SOURCES,
          ready: cappedPlayableSeconds >= REQUIRED_PLAYABLE_SECONDS && distinctSourceCount >= REQUIRED_DISTINCT_SOURCES,
          existingActiveSceneId: null,
          sources: sources.sort((a, b) => a.sourceName.localeCompare(b.sourceName) || a.sourceId.localeCompare(b.sourceId)),
        };
      })
      .sort((a, b) => a.state.localeCompare(b.state) || a.city.localeCompare(b.city) || a.musicCommunity.localeCompare(b.musicCommunity));

    return {
      success: true as const,
      data: {
        thresholds: {
          requiredPlayableSeconds: REQUIRED_PLAYABLE_SECONDS,
          requiredPlayableMinutes: REQUIRED_PLAYABLE_SECONDS / 60,
          requiredDistinctSources: REQUIRED_DISTINCT_SOURCES,
          maxPlayableSecondsPerSource: MAX_PLAYABLE_SECONDS_PER_SOURCE,
          maxPlayableMinutesPerSource: MAX_PLAYABLE_SECONDS_PER_SOURCE / 60,
        },
        candidates,
      },
    };
  }

  async activateReadyCommunity(input: Partial<ActivationTriggerInput> = {}) {
    const city = typeof input.city === 'string' ? input.city.trim() : '';
    const state = typeof input.state === 'string' ? input.state.trim() : '';
    const musicCommunity = typeof input.musicCommunity === 'string' ? input.musicCommunity.trim() : '';

    if (!city || !state || !musicCommunity) {
      throw new BadRequestException('Activation requires city, state, and musicCommunity');
    }

    const diagnostics = await this.getActivationReadinessDiagnostics();
    const requestedKey = this.activationTupleKey(city, state, musicCommunity);
    const candidate = diagnostics.data.candidates.find(
      (item) => this.activationTupleKey(item.city, item.state, item.musicCommunity) === requestedKey,
    );

    const existingCommunity = await this.prisma.community.findFirst({
      where: {
        city,
        state,
        musicCommunity,
        tier: 'city',
      },
      select: {
        id: true,
        city: true,
        state: true,
        musicCommunity: true,
        tier: true,
        isActive: true,
      },
    });

    if (existingCommunity?.isActive) {
      throw new ConflictException('Community is already active');
    }

    if (!candidate?.ready) {
      throw new BadRequestException('Activation readiness threshold has not been met');
    }

    const community = existingCommunity
      ? await this.prisma.community.update({
          where: { id: existingCommunity.id },
          data: { isActive: true },
        })
      : await this.prisma.community.create({
          data: {
            name: `${city}, ${state} ${musicCommunity}`,
            slug: slugifyLaunchCommunity(city, state, musicCommunity),
            description: `City-tier Home Scene for ${musicCommunity} in ${city}, ${state}.`,
            city,
            state,
            musicCommunity,
            tier: 'city',
            isActive: true,
            isPrivate: false,
            createdById: (await ensureLaunchCommunitySeedOwner(this.prisma)).id,
          },
        });

    const reanchoredSources = await this.prisma.artistBand.updateMany({
      where: {
        sourceOriginCity: city,
        sourceOriginState: state,
        sourceOriginMusicCommunity: musicCommunity,
      },
      data: { homeSceneId: community.id },
    });

    const cutoverListeners = await this.prisma.user.updateMany({
      where: {
        homeSceneCity: city,
        homeSceneState: state,
        homeSceneCommunity: musicCommunity,
      },
      data: {
        tunedSceneId: community.id,
        tunedSceneUpdatedAt: new Date(),
      },
    });

    return {
      success: true as const,
      data: {
        sceneId: community.id,
        city,
        state,
        musicCommunity,
        created: !existingCommunity,
        activated: true,
        reanchoredSourceCount: reanchoredSources.count,
        cutoverListenerCount: cutoverListeners.count,
        thresholds: diagnostics.data.thresholds,
        candidate,
      },
    };
  }

  private activationTupleKey(city: string | null | undefined, state: string | null | undefined, musicCommunity: string | null | undefined) {
    return [city, state, musicCommunity].map((part) => (part ?? '').trim().toLowerCase()).join('::');
  }
}
