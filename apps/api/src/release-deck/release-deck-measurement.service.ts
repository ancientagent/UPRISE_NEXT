import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Slice 1: read-only Uprise-wide Release Deck measurement.
 *
 * Reads every managed source deck inside one city-tier community as a single
 * combined catalog and reports what counts toward readiness, what does not, and
 * why. Owned by `docs/specs/media/release-deck-and-eligibility.md#uprise-wide-deck-system`.
 *
 * This service performs no writes. It must not create schedules, rotation
 * entries, sect backings, or mutate any row.
 *
 * Thresholds mirror the activation-readiness diagnostics in
 * `AdminAnalyticsService` on purpose. They are duplicated locally rather than
 * shared because extracting a common helper would touch activation readiness,
 * which is outside the Slice 1 boundary. Consolidate in a later cleanup slice.
 */
const MAX_PLAYABLE_SECONDS_PER_SOURCE = 15 * 60;
const MAX_TRACK_SECONDS = 6 * 60;
const REQUIRED_PLAYABLE_SECONDS = 45 * 60;
const REQUIRED_DISTINCT_SOURCES = 5;

export const RELEASE_DECK_EXCLUSION_REASONS = [
  'MISSING_SOURCE_OWNERSHIP',
  'TRACK_NOT_ATTACHED_TO_COMMUNITY',
  'WRONG_COMMUNITY',
  'MISSING_SOURCE_HOME_SCENE',
  'SOURCE_HOME_SCENE_MISMATCH',
  'NOT_READY',
  'INVALID_DURATION',
  'OVER_MAX_TRACK_SECONDS',
  'SOURCE_CAP_EXCEEDED',
] as const;

export type ReleaseDeckExclusionReason = (typeof RELEASE_DECK_EXCLUSION_REASONS)[number];

type CandidateTrack = {
  id: string;
  title: string;
  duration: number;
  status: string | null;
  communityId: string | null;
  artistBandId: string | null;
  createdAt: Date;
  artistBand: {
    id: string;
    name: string;
    homeSceneId: string | null;
  } | null;
};

type EligibleTrack = CandidateTrack & {
  artistBand: NonNullable<CandidateTrack['artistBand']>;
};

function toMinutes(seconds: number): number {
  return Math.round((seconds / 60) * 100) / 100;
}

function compareByCreatedAtThenId(a: CandidateTrack, b: CandidateTrack): number {
  const left = a.createdAt?.getTime?.() ?? 0;
  const right = b.createdAt?.getTime?.() ?? 0;
  return left - right || a.id.localeCompare(b.id);
}

@Injectable()
export class ReleaseDeckMeasurementService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the intrinsic exclusion reason for a candidate track, or `null` when
   * the track is eligible to compete for its source's playable-seconds budget.
   *
   * Precedence is fixed so a track with several problems always reports the same
   * reason: source ownership, then community attachment, then source Home Scene
   * context, then track state.
   */
  private resolveExclusionReason(
    track: CandidateTrack,
    communityId: string
  ): ReleaseDeckExclusionReason | null {
    if (!track.artistBandId || !track.artistBand) return 'MISSING_SOURCE_OWNERSHIP';
    if (!track.communityId) return 'TRACK_NOT_ATTACHED_TO_COMMUNITY';
    if (track.communityId !== communityId) return 'WRONG_COMMUNITY';
    if (!track.artistBand.homeSceneId) return 'MISSING_SOURCE_HOME_SCENE';
    if (track.artistBand.homeSceneId !== communityId) return 'SOURCE_HOME_SCENE_MISMATCH';
    if (track.status !== 'ready') return 'NOT_READY';
    if (!Number.isFinite(track.duration) || track.duration <= 0) return 'INVALID_DURATION';
    if (track.duration > MAX_TRACK_SECONDS) return 'OVER_MAX_TRACK_SECONDS';
    return null;
  }

  async measureCommunityDeck(communityId: string) {
    const trimmedCommunityId = communityId?.trim();
    if (!trimmedCommunityId) {
      throw new BadRequestException({
        success: false,
        error: { message: 'communityId is required' },
      });
    }

    const community = await this.prisma.community.findUnique({
      where: { id: trimmedCommunityId },
      select: { id: true, name: true, city: true, state: true, musicCommunity: true, tier: true, isActive: true },
    });

    if (!community) {
      throw new NotFoundException({
        success: false,
        error: { message: 'Community not found' },
      });
    }

    // The Uprise deck is a city-tier concept. State/national aggregates have no
    // Release Deck of their own and no source caps to measure.
    if (community.tier !== 'city') {
      throw new BadRequestException({
        success: false,
        error: { message: 'Release Deck measurement is limited to city-tier communities' },
      });
    }

    // Candidate set is deliberately wider than the community's own tracks so the
    // response can report in-Uprise sources whose tracks are unattached or
    // attached to the wrong community, rather than silently omitting them.
    const candidates = (await this.prisma.track.findMany({
      where: {
        OR: [{ communityId: trimmedCommunityId }, { artistBand: { homeSceneId: trimmedCommunityId } }],
      },
      select: {
        id: true,
        title: true,
        duration: true,
        status: true,
        communityId: true,
        artistBandId: true,
        createdAt: true,
        artistBand: { select: { id: true, name: true, homeSceneId: true } },
      },
    })) as CandidateTrack[];

    const ordered = [...candidates].sort(compareByCreatedAtThenId);

    const excluded: Array<{
      trackId: string;
      title: string;
      durationSeconds: number;
      sourceId: string | null;
      sourceName: string | null;
      reason: ReleaseDeckExclusionReason;
    }> = [];
    const eligibleBySource = new Map<string, EligibleTrack[]>();

    for (const track of ordered) {
      const reason = this.resolveExclusionReason(track, trimmedCommunityId);
      if (reason) {
        excluded.push({
          trackId: track.id,
          title: track.title,
          durationSeconds: track.duration,
          sourceId: track.artistBand?.id ?? null,
          sourceName: track.artistBand?.name ?? null,
          reason,
        });
        continue;
      }

      const eligible = track as EligibleTrack;
      const bucket = eligibleBySource.get(eligible.artistBand.id) ?? [];
      bucket.push(eligible);
      eligibleBySource.set(eligible.artistBand.id, bucket);
    }

    const included: Array<{
      trackId: string;
      title: string;
      durationSeconds: number;
      sourceId: string;
      sourceName: string;
    }> = [];
    const sources: Array<{
      sourceId: string;
      sourceName: string;
      rawPlayableSeconds: number;
      rawPlayableMinutes: number;
      cappedPlayableSeconds: number;
      cappedPlayableMinutes: number;
      remainingCapacitySeconds: number;
      remainingCapacityMinutes: number;
      includedTrackCount: number;
      atSourceCap: boolean;
    }> = [];

    for (const [sourceId, sourceTracks] of eligibleBySource) {
      const sourceName = sourceTracks[0].artistBand.name;
      const rawPlayableSeconds = sourceTracks.reduce((sum, track) => sum + track.duration, 0);

      // First-fit against the source's 900s budget, walking tracks oldest-first.
      // A track that does not fit is excluded as SOURCE_CAP_EXCEEDED; scanning
      // continues so a shorter later track may still occupy the remainder.
      // `POST /tracks` already rejects uploads past the cap, so this only fires
      // on legacy or drifted data.
      let cappedPlayableSeconds = 0;
      let includedTrackCount = 0;
      for (const track of sourceTracks) {
        if (cappedPlayableSeconds + track.duration <= MAX_PLAYABLE_SECONDS_PER_SOURCE) {
          cappedPlayableSeconds += track.duration;
          includedTrackCount += 1;
          included.push({
            trackId: track.id,
            title: track.title,
            durationSeconds: track.duration,
            sourceId,
            sourceName,
          });
        } else {
          excluded.push({
            trackId: track.id,
            title: track.title,
            durationSeconds: track.duration,
            sourceId,
            sourceName,
            reason: 'SOURCE_CAP_EXCEEDED',
          });
        }
      }

      const remainingCapacitySeconds = MAX_PLAYABLE_SECONDS_PER_SOURCE - cappedPlayableSeconds;

      sources.push({
        sourceId,
        sourceName,
        rawPlayableSeconds,
        rawPlayableMinutes: toMinutes(rawPlayableSeconds),
        cappedPlayableSeconds,
        cappedPlayableMinutes: toMinutes(cappedPlayableSeconds),
        remainingCapacitySeconds,
        remainingCapacityMinutes: toMinutes(remainingCapacitySeconds),
        includedTrackCount,
        atSourceCap: remainingCapacitySeconds <= 0,
      });
    }

    sources.sort((a, b) => a.sourceName.localeCompare(b.sourceName) || a.sourceId.localeCompare(b.sourceId));
    included.sort(
      (a, b) =>
        a.sourceName.localeCompare(b.sourceName) ||
        a.sourceId.localeCompare(b.sourceId) ||
        a.trackId.localeCompare(b.trackId)
    );
    excluded.sort((a, b) => a.reason.localeCompare(b.reason) || a.trackId.localeCompare(b.trackId));

    const contributingSources = sources.filter((source) => source.includedTrackCount > 0);
    const distinctSourceCount = contributingSources.length;
    const totalRawPlayableSeconds = sources.reduce((sum, source) => sum + source.rawPlayableSeconds, 0);
    const totalCappedPlayableSeconds = sources.reduce((sum, source) => sum + source.cappedPlayableSeconds, 0);

    const meetsPlayableThreshold = totalCappedPlayableSeconds >= REQUIRED_PLAYABLE_SECONDS;
    const meetsDistinctSourceThreshold = distinctSourceCount >= REQUIRED_DISTINCT_SOURCES;

    return {
      success: true as const,
      data: {
        community: {
          id: community.id,
          name: community.name,
          city: community.city,
          state: community.state,
          musicCommunity: community.musicCommunity,
          tier: community.tier,
          isActive: community.isActive,
        },
        thresholds: {
          requiredPlayableSeconds: REQUIRED_PLAYABLE_SECONDS,
          requiredPlayableMinutes: REQUIRED_PLAYABLE_SECONDS / 60,
          requiredDistinctSources: REQUIRED_DISTINCT_SOURCES,
          maxPlayableSecondsPerSource: MAX_PLAYABLE_SECONDS_PER_SOURCE,
          maxPlayableMinutesPerSource: MAX_PLAYABLE_SECONDS_PER_SOURCE / 60,
          maxTrackSeconds: MAX_TRACK_SECONDS,
          maxTrackMinutes: MAX_TRACK_SECONDS / 60,
        },
        totals: {
          rawPlayableSeconds: totalRawPlayableSeconds,
          rawPlayableMinutes: toMinutes(totalRawPlayableSeconds),
          cappedPlayableSeconds: totalCappedPlayableSeconds,
          cappedPlayableMinutes: toMinutes(totalCappedPlayableSeconds),
          distinctSourceCount,
          includedTrackCount: included.length,
          excludedTrackCount: excluded.length,
        },
        sources,
        includedTracks: included,
        excludedTracks: excluded,
        readiness: {
          ready: meetsPlayableThreshold && meetsDistinctSourceThreshold,
          meetsPlayableThreshold,
          meetsDistinctSourceThreshold,
          remainingPlayableSeconds: Math.max(0, REQUIRED_PLAYABLE_SECONDS - totalCappedPlayableSeconds),
          remainingPlayableMinutes: toMinutes(
            Math.max(0, REQUIRED_PLAYABLE_SECONDS - totalCappedPlayableSeconds)
          ),
          remainingDistinctSources: Math.max(0, REQUIRED_DISTINCT_SOURCES - distinctSourceCount),
        },
      },
    };
  }
}
