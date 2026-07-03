import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

type ActivationReadinessClient = Pick<PrismaService, 'track' | 'community'>;

const REQUIRED_PLAYABLE_SECONDS = 45 * 60;
const MAX_PLAYABLE_SECONDS_PER_SOURCE = 15 * 60;
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
    return this.buildActivationReadinessDiagnostics(this.prisma);
  }

  private async buildActivationReadinessDiagnostics(client: ActivationReadinessClient) {
    const tracks = await client.track.findMany({
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

    const activeScenes = await client.community.findMany({
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
      const city = this.normalizeActivationTuplePart(source?.sourceOriginCity);
      const state = this.normalizeActivationTuplePart(source?.sourceOriginState);
      const musicCommunity = this.normalizeActivationTuplePart(source?.sourceOriginMusicCommunity);

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

    const existingCommunity = await this.findCityTierCommunityByTuple(this.prisma, city, state, musicCommunity);

    if (existingCommunity?.isActive) {
      throw new ConflictException('Community is already active');
    }

    if (!candidate?.ready) {
      throw new BadRequestException('Activation readiness threshold has not been met');
    }

    const activatedAt = new Date();

    const cutover = await this.prisma.$transaction(async (tx) => {
      const txDiagnostics = await this.buildActivationReadinessDiagnostics(tx as unknown as ActivationReadinessClient);
      const txCandidate = txDiagnostics.data.candidates.find(
        (item) => this.activationTupleKey(item.city, item.state, item.musicCommunity) === requestedKey,
      );
      const txExistingCommunity = await this.findCityTierCommunityByTuple(tx, city, state, musicCommunity);

      if (txExistingCommunity?.isActive) {
        throw new ConflictException('Community is already active');
      }

      if (!txCandidate?.ready) {
        throw new BadRequestException('Activation readiness threshold has not been met');
      }

      const activationCity = txCandidate.city;
      const activationState = txCandidate.state;
      const activationMusicCommunity = txCandidate.musicCommunity;
      const sourceIds = txCandidate.sources.map((source: { sourceId: string }) => source.sourceId).sort();

      const community = txExistingCommunity
        ? await tx.community.update({
            where: { id: txExistingCommunity.id },
            data: { isActive: true },
          })
        : await tx.community.create({
            data: {
              name: `${activationCity}, ${activationState} ${activationMusicCommunity}`,
              slug: slugifyLaunchCommunity(activationCity, activationState, activationMusicCommunity),
              description: `City-tier Home Scene for ${activationMusicCommunity} in ${activationCity}, ${activationState}.`,
              city: activationCity,
              state: activationState,
              musicCommunity: activationMusicCommunity,
              tier: 'city',
              isActive: true,
              isPrivate: false,
              createdById: (await ensureLaunchCommunitySeedOwner(tx as any)).id,
            },
          });

      const reanchoredSources =
        sourceIds.length === 0
          ? { count: 0 }
          : await tx.artistBand.updateMany({
              where: { id: { in: sourceIds } },
              data: { homeSceneId: community.id },
            });

      const listeners = await this.findActivationListeners(tx, activationCity, activationState, activationMusicCommunity);
      const listenerIds = listeners.map((listener: { id: string }) => listener.id);
      const formerProxyScenes = listeners.filter(
        (listener: { tunedSceneId: string | null }) => Boolean(listener.tunedSceneId) && listener.tunedSceneId !== community.id,
      );

      const savedAwayScenes =
        formerProxyScenes.length === 0
          ? { count: 0 }
          : await tx.userSavedScene.createMany({
              data: formerProxyScenes.map((listener: { id: string; tunedSceneId: string | null }) => ({
                userId: listener.id,
                communityId: listener.tunedSceneId as string,
                reason: 'former_proxy_cutover',
                context: {
                  from: 'activation_cutover',
                  activatedSceneId: community.id,
                  city: activationCity,
                  state: activationState,
                  musicCommunity: activationMusicCommunity,
                  activatedAt: activatedAt.toISOString(),
                },
              })),
              skipDuplicates: true,
            });

      const activationNotices =
        listeners.length === 0
          ? { count: 0 }
          : await tx.userActivationNotice.createMany({
              data: listeners.map((listener: { id: string; tunedSceneId: string | null }) => ({
                userId: listener.id,
                fromSceneId: listener.tunedSceneId === community.id ? null : listener.tunedSceneId,
                toSceneId: community.id,
                city: activationCity,
                state: activationState,
                musicCommunity: activationMusicCommunity,
                reason: 'natural_home_scene_activated',
                status: 'unread',
                message: `${activationCity}, ${activationState} ${activationMusicCommunity} is now active because enough local source music is ready. Your former proxy scene stays available as an Away Scene where supported.`,
              })),
              skipDuplicates: true,
            });

      const cutoverListeners =
        listenerIds.length === 0
          ? { count: 0 }
          : await tx.user.updateMany({
              where: { id: { in: listenerIds } },
              data: {
                tunedSceneId: community.id,
                tunedSceneUpdatedAt: activatedAt,
              },
            });

      const audit = await tx.communityActivationAudit.create({
        data: {
          sceneId: community.id,
          city: activationCity,
          state: activationState,
          musicCommunity: activationMusicCommunity,
          createdScene: !txExistingCommunity,
          reanchoredSourceIds: sourceIds as unknown as Prisma.JsonArray,
          cutoverListenerIds: listenerIds as unknown as Prisma.JsonArray,
          savedAwaySceneCount: savedAwayScenes.count,
          activationNoticeCount: activationNotices.count,
          thresholds: txDiagnostics.data.thresholds as unknown as Prisma.JsonObject,
        },
        select: { id: true },
      });

      return {
        sceneId: community.id,
        city: activationCity,
        state: activationState,
        musicCommunity: activationMusicCommunity,
        created: !txExistingCommunity,
        activationAuditId: audit.id,
        reanchoredSourceCount: reanchoredSources.count,
        cutoverListenerCount: cutoverListeners.count,
        savedAwaySceneCount: savedAwayScenes.count,
        activationNoticeCount: activationNotices.count,
        thresholds: txDiagnostics.data.thresholds,
        candidate: txCandidate,
      };
    });

    return {
      success: true as const,
      data: {
        sceneId: cutover.sceneId,
        city: cutover.city,
        state: cutover.state,
        musicCommunity: cutover.musicCommunity,
        created: cutover.created,
        activated: true,
        activationAuditId: cutover.activationAuditId,
        reanchoredSourceCount: cutover.reanchoredSourceCount,
        cutoverListenerCount: cutover.cutoverListenerCount,
        savedAwaySceneCount: cutover.savedAwaySceneCount,
        activationNoticeCount: cutover.activationNoticeCount,
        thresholds: cutover.thresholds,
        candidate: cutover.candidate,
      },
    };
  }

  private activationTupleKey(city: string | null | undefined, state: string | null | undefined, musicCommunity: string | null | undefined) {
    return [city, state, musicCommunity].map((part) => this.normalizeActivationTuplePart(part).toLowerCase()).join('::');
  }

  private normalizeActivationTuplePart(value: string | null | undefined) {
    return (value ?? '').trim().replace(/\s+/g, ' ');
  }

  private async findCityTierCommunityByTuple(client: any, city: string, state: string, musicCommunity: string) {
    const targetKey = this.activationTupleKey(city, state, musicCommunity);
    const candidates = await client.community.findMany({
      where: {
        tier: 'city',
        AND: [
          ...this.activationContainsFilters('city', city),
          ...this.activationContainsFilters('state', state),
          ...this.activationContainsFilters('musicCommunity', musicCommunity),
        ],
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

    return candidates
      .filter(
        (candidate: { city: string | null; state: string | null; musicCommunity: string | null }) =>
          this.activationTupleKey(candidate.city, candidate.state, candidate.musicCommunity) === targetKey,
      )
      .sort(
        (a: { id: string; isActive: boolean }, b: { id: string; isActive: boolean }) =>
          Number(b.isActive) - Number(a.isActive) || a.id.localeCompare(b.id),
      )[0] ?? null;
  }

  private async findActivationListeners(client: any, city: string, state: string, musicCommunity: string) {
    const targetCityStateKey = this.activationTupleKey(city, state, '');
    const targetTupleKey = this.activationTupleKey(city, state, musicCommunity);
    const candidates = await client.user.findMany({
      where: {
        homeSceneCity: { not: null },
        homeSceneState: { not: null },
        AND: [
          ...this.activationContainsFilters('homeSceneCity', city),
          ...this.activationContainsFilters('homeSceneState', state),
        ],
        OR: [
          { homeSceneCommunity: { not: null } },
          {
            musicCommunityPreferences: {
              some: { isDefault: true },
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

    return candidates
      .filter((listener: {
        homeSceneCity: string | null;
        homeSceneState: string | null;
        homeSceneCommunity: string | null;
        musicCommunityPreferences?: Array<{ musicCommunity: string }>;
      }) => {
        if (this.activationTupleKey(listener.homeSceneCity, listener.homeSceneState, '') !== targetCityStateKey) {
          return false;
        }

        if (this.activationTupleKey(listener.homeSceneCity, listener.homeSceneState, listener.homeSceneCommunity) === targetTupleKey) {
          return true;
        }

        return (listener.musicCommunityPreferences ?? []).some(
          (preference) => this.activationTupleKey(listener.homeSceneCity, listener.homeSceneState, preference.musicCommunity) === targetTupleKey,
        );
      })
      .map((listener: { id: string; tunedSceneId: string | null }) => ({
        id: listener.id,
        tunedSceneId: listener.tunedSceneId,
      }));
  }

  private activationContainsFilters(field: string, value: string) {
    return this.normalizeActivationTuplePart(value)
      .split(' ')
      .filter(Boolean)
      .map((token) => ({
        [field]: { contains: token, mode: 'insensitive' },
      }));
  }
}
