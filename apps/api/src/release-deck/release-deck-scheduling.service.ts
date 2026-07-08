import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ReleaseDeckScheduleAvailabilityQueryDto,
  ReleaseDeckScheduleCreateDto,
} from './dto/release-deck-schedule.dto';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const RELEASE_DECK_SCHEDULE_POLICY = {
  dailyIntakePlayableSeconds: 15 * 60,
  protectedPoolPlayableSeconds: 45 * 60,
  lookaheadDays: 30,
  newReleaseWindowDays: 10,
  maxTrackSeconds: 6 * 60,
  maxSourceActiveSeconds: 15 * 60,
  maxActiveMusicSlotsPerSource: 3,
} as const;

type TrackEligibilityReason =
  | 'MISSING_SOURCE_OWNERSHIP'
  | 'TRACK_NOT_ATTACHED_TO_COMMUNITY'
  | 'WRONG_COMMUNITY'
  | 'MISSING_SOURCE_HOME_SCENE'
  | 'SOURCE_HOME_SCENE_MISMATCH'
  | 'NOT_READY'
  | 'INVALID_DURATION'
  | 'OVER_MAX_TRACK_SECONDS'
  | 'MISSING_PLAYABLE_URL'
  | 'INVALID_PLAYABLE_URL';

type CapacityReason = 'DATE_DAILY_CAPACITY_FULL' | 'PROTECTED_WINDOW_CAPACITY_FULL';

type CandidateTrack = {
  id: string;
  title: string;
  duration: number;
  status: string | null;
  communityId: string | null;
  artistBandId: string | null;
  fileUrl: string | null;
  artistBand: {
    id: string;
    name: string;
    homeSceneId: string | null;
  } | null;
};

type ScheduledRow = {
  id: string;
  trackId: string;
  scheduledFor: Date;
  status: string;
  track: {
    id: string;
    duration: number;
  } | null;
};

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function parseDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function todayUtcDateOnly(): string {
  return toDateOnly(startOfUtcDay(new Date()));
}

function playableSeconds(value: unknown): number {
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
}

function overlaps(leftStart: Date, leftEnd: Date, rightStart: Date, rightEnd: Date): boolean {
  return leftStart < rightEnd && rightStart < leftEnd;
}

function resolvePlayableUrlReason(fileUrl: string | null): TrackEligibilityReason | null {
  if (!fileUrl?.trim()) return 'MISSING_PLAYABLE_URL';

  try {
    const parsed = new URL(fileUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return 'INVALID_PLAYABLE_URL';
    }
  } catch {
    return 'INVALID_PLAYABLE_URL';
  }

  return null;
}

@Injectable()
export class ReleaseDeckSchedulingService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertSourceOperator(userId: string, trackId: string, communityId: string) {
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
      select: {
        id: true,
        artistBandId: true,
        communityId: true,
        artistBand: {
          select: {
            id: true,
            homeSceneId: true,
            createdById: true,
            members: { where: { userId }, select: { userId: true }, take: 1 },
          },
        },
      },
    });

    if (!track) {
      throw new NotFoundException({ success: false, error: { message: 'Track not found' } });
    }

    if (!track.artistBandId || !track.artistBand) {
      throw new ForbiddenException('Release Deck scheduling requires a managed Artist/Band source');
    }

    const managesSource = track.artistBand.createdById === userId || track.artistBand.members.length > 0;
    if (!managesSource) {
      throw new ForbiddenException('Release Deck scheduling requires a managed Artist/Band source');
    }

    if (track.communityId !== communityId || track.artistBand.homeSceneId !== communityId) {
      throw new BadRequestException('Track community must match the managed source Home Scene');
    }

    return {
      trackId: track.id,
      artistBandId: track.artistBandId,
      communityId,
    };
  }

  private resolveTrackEligibility(
    track: CandidateTrack,
    communityId: string
  ): TrackEligibilityReason | null {
    if (!track.artistBandId || !track.artistBand) return 'MISSING_SOURCE_OWNERSHIP';
    if (!track.communityId) return 'TRACK_NOT_ATTACHED_TO_COMMUNITY';
    if (track.communityId !== communityId) return 'WRONG_COMMUNITY';
    if (!track.artistBand.homeSceneId) return 'MISSING_SOURCE_HOME_SCENE';
    if (track.artistBand.homeSceneId !== communityId) return 'SOURCE_HOME_SCENE_MISMATCH';
    if (track.status !== 'ready') return 'NOT_READY';
    if (!Number.isFinite(track.duration) || track.duration <= 0) return 'INVALID_DURATION';
    if (track.duration > RELEASE_DECK_SCHEDULE_POLICY.maxTrackSeconds)
      return 'OVER_MAX_TRACK_SECONDS';
    const playableUrlReason = resolvePlayableUrlReason(track.fileUrl);
    if (playableUrlReason) return playableUrlReason;
    return null;
  }

  private emptyFailure(
    code: string,
    message: string,
    trackId: string,
    extra: Record<string, unknown> = {}
  ) {
    return {
      success: false as const,
      error: {
        code,
        message,
        trackId,
        diagnostics: [],
        capacityInputs: null,
        ...extra,
      },
    };
  }

  async getAvailability(query: ReleaseDeckScheduleAvailabilityQueryDto): Promise<any> {
    const communityId = query.communityId?.trim();
    const trackId = query.trackId?.trim();
    const from = query.from?.trim();

    if (!communityId || !trackId || !from) {
      throw new BadRequestException({
        success: false,
        error: { message: 'communityId, trackId, and from are required' },
      });
    }

    const fromDate = parseDateOnly(from);
    const lookaheadDays = Number(query.days);
    if (
      !fromDate ||
      !Number.isInteger(lookaheadDays) ||
      lookaheadDays < 1 ||
      lookaheadDays > RELEASE_DECK_SCHEDULE_POLICY.lookaheadDays
    ) {
      throw new BadRequestException({
        success: false,
        error: { message: 'from must be YYYY-MM-DD and days must be between 1 and 30' },
      });
    }

    const community = await this.prisma.community.findUnique({
      where: { id: communityId },
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        musicCommunity: true,
        tier: true,
        isActive: true,
      },
    });

    if (!community) {
      throw new NotFoundException({
        success: false,
        error: { message: 'Community not found' },
      });
    }

    if (community.tier !== 'city') {
      throw new BadRequestException({
        success: false,
        error: { message: 'Release Deck scheduling is limited to city-tier communities' },
      });
    }

    const track = (await this.prisma.track.findUnique({
      where: { id: trackId },
      select: {
        id: true,
        title: true,
        duration: true,
        status: true,
        communityId: true,
        artistBandId: true,
        fileUrl: true,
        artistBand: { select: { id: true, name: true, homeSceneId: true } },
      },
    })) as CandidateTrack | null;

    if (!track) {
      throw new NotFoundException({
        success: false,
        error: { message: 'Track not found' },
      });
    }

    const eligibilityReason = this.resolveTrackEligibility(track, communityId);
    if (eligibilityReason) {
      return this.emptyFailure(
        'TRACK_NOT_ELIGIBLE',
        'Track is not eligible for Release Deck scheduling',
        track.id,
        {
          reason: eligibilityReason,
        }
      );
    }

    const existingSchedule = await this.prisma.releaseDeckSchedule.findFirst({
      where: { trackId: track.id, status: { in: ['scheduled', 'ingested'] } },
      select: { id: true, status: true, scheduledFor: true },
    });

    if (existingSchedule) {
      return {
        success: false as const,
        error: {
          code: 'ALREADY_SCHEDULED_OR_ACTIVE',
          message: 'Track is already scheduled or active in RADIYO',
          trackId: track.id,
          diagnostics: [],
          capacityInputs: null,
        },
      };
    }

    const activeRotation = await this.prisma.rotationEntry.findFirst({
      where: { trackId: track.id },
      select: { id: true },
    });

    if (activeRotation) {
      return {
        success: false as const,
        error: {
          code: 'ALREADY_SCHEDULED_OR_ACTIVE',
          message: 'Track is already scheduled or active in RADIYO',
          trackId: track.id,
          diagnostics: [],
          capacityInputs: null,
        },
      };
    }

    const sourceReadyTracks = (await this.prisma.track.findMany({
      where: {
        artistBandId: track.artistBandId,
        communityId,
        status: 'ready',
      },
      select: { id: true, duration: true, status: true },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    })) as Array<{ id: string; duration: number; status: string }>;

    const readyTracks = sourceReadyTracks.some((readyTrack) => readyTrack.id === track.id)
      ? sourceReadyTracks
      : [...sourceReadyTracks, { id: track.id, duration: track.duration, status: 'ready' }];
    const sourceReadyTrackCount = readyTracks.length;
    const sourceReadyPlayableSeconds = readyTracks.reduce(
      (sum, readyTrack) => sum + playableSeconds(readyTrack.duration),
      0
    );

    if (sourceReadyTrackCount > RELEASE_DECK_SCHEDULE_POLICY.maxActiveMusicSlotsPerSource) {
      return this.emptyFailure(
        'SOURCE_SLOT_CAP_REACHED',
        'Source has reached the Release Deck active music slot cap',
        track.id,
        {
          reason: 'SOURCE_SLOT_CAP_REACHED',
        }
      );
    }

    if (sourceReadyPlayableSeconds > RELEASE_DECK_SCHEDULE_POLICY.maxSourceActiveSeconds) {
      return this.emptyFailure(
        'SOURCE_DURATION_CAP_REACHED',
        'Source has reached the Release Deck active duration cap',
        track.id,
        {
          reason: 'SOURCE_DURATION_CAP_REACHED',
        }
      );
    }

    const trackPlayableSeconds = playableSeconds(track.duration);
    const capacityInputs = {
      trackPlayableSeconds,
      sourceReadyTrackCount,
      sourceReadyPlayableSeconds,
      sourceRemainingPlayableSeconds: Math.max(
        0,
        RELEASE_DECK_SCHEDULE_POLICY.maxSourceActiveSeconds - sourceReadyPlayableSeconds
      ),
      dailyIntakePlayableSeconds: RELEASE_DECK_SCHEDULE_POLICY.dailyIntakePlayableSeconds,
      protectedPoolPlayableSeconds: RELEASE_DECK_SCHEDULE_POLICY.protectedPoolPlayableSeconds,
      newReleaseWindowDays: RELEASE_DECK_SCHEDULE_POLICY.newReleaseWindowDays,
      lookaheadDays,
      maxTrackSeconds: RELEASE_DECK_SCHEDULE_POLICY.maxTrackSeconds,
      maxSourceActiveSeconds: RELEASE_DECK_SCHEDULE_POLICY.maxSourceActiveSeconds,
      maxActiveMusicSlotsPerSource: RELEASE_DECK_SCHEDULE_POLICY.maxActiveMusicSlotsPerSource,
    };

    const scheduleRangeStart = addDays(
      fromDate,
      -(RELEASE_DECK_SCHEDULE_POLICY.newReleaseWindowDays - 1)
    );
    const scheduleRangeEnd = addDays(
      fromDate,
      lookaheadDays + RELEASE_DECK_SCHEDULE_POLICY.newReleaseWindowDays
    );
    const scheduledRows = (await this.prisma.releaseDeckSchedule.findMany({
      where: {
        communityId,
        status: 'scheduled',
        scheduledFor: {
          gte: scheduleRangeStart,
          lt: scheduleRangeEnd,
        },
      },
      select: {
        id: true,
        trackId: true,
        scheduledFor: true,
        status: true,
        track: { select: { id: true, duration: true } },
      },
      orderBy: [{ scheduledFor: 'asc' }, { id: 'asc' }],
    })) as ScheduledRow[];

    const diagnostics = Array.from({ length: lookaheadDays }, (_, index) => {
      const date = addDays(fromDate, index);
      const dayStart = startOfUtcDay(date);
      const dayEnd = addDays(dayStart, 1);
      const protectedWindowStart = dayStart;
      const protectedWindowEnd = addDays(
        dayStart,
        RELEASE_DECK_SCHEDULE_POLICY.newReleaseWindowDays
      );

      const dailyScheduledPlayableSeconds = scheduledRows
        .filter((row) => row.scheduledFor >= dayStart && row.scheduledFor < dayEnd)
        .reduce((sum, row) => sum + playableSeconds(row.track?.duration), 0);

      const protectedWindowScheduledPlayableSeconds = scheduledRows
        .filter((row) => {
          const rowStart = startOfUtcDay(row.scheduledFor);
          const rowEnd = addDays(rowStart, RELEASE_DECK_SCHEDULE_POLICY.newReleaseWindowDays);
          return overlaps(rowStart, rowEnd, protectedWindowStart, protectedWindowEnd);
        })
        .reduce((sum, row) => sum + playableSeconds(row.track?.duration), 0);

      const dailyRequestedPlayableSeconds = dailyScheduledPlayableSeconds + trackPlayableSeconds;
      const protectedWindowRequestedPlayableSeconds =
        protectedWindowScheduledPlayableSeconds + trackPlayableSeconds;
      const reasons: CapacityReason[] = [];

      if (dailyRequestedPlayableSeconds > RELEASE_DECK_SCHEDULE_POLICY.dailyIntakePlayableSeconds) {
        reasons.push('DATE_DAILY_CAPACITY_FULL');
      }
      if (
        protectedWindowRequestedPlayableSeconds >
        RELEASE_DECK_SCHEDULE_POLICY.protectedPoolPlayableSeconds
      ) {
        reasons.push('PROTECTED_WINDOW_CAPACITY_FULL');
      }

      return {
        date: toDateOnly(dayStart),
        valid: reasons.length === 0,
        reasons,
        trackPlayableSeconds,
        dailyScheduledPlayableSeconds,
        dailyRequestedPlayableSeconds,
        dailyRemainingPlayableSeconds: Math.max(
          0,
          RELEASE_DECK_SCHEDULE_POLICY.dailyIntakePlayableSeconds - dailyScheduledPlayableSeconds
        ),
        protectedWindowScheduledPlayableSeconds,
        protectedWindowRequestedPlayableSeconds,
        protectedWindowRemainingPlayableSeconds: Math.max(
          0,
          RELEASE_DECK_SCHEDULE_POLICY.protectedPoolPlayableSeconds -
            protectedWindowScheduledPlayableSeconds
        ),
      };
    });

    const alternatives = diagnostics
      .filter((diagnostic) => diagnostic.valid)
      .map((diagnostic) => diagnostic.date);
    const soonestValidDate = alternatives[0] ?? null;

    if (!soonestValidDate) {
      return {
        success: false as const,
        error: {
          code: 'NO_VALID_DATE_IN_LOOKAHEAD',
          message: 'No valid Release Deck schedule date is available in the requested lookahead',
          trackId: track.id,
          requestedDate: toDateOnly(fromDate),
          soonestValidDate: null,
          alternatives,
          diagnostics,
          capacityInputs,
        },
      };
    }

    const requestedDateDiagnostic = diagnostics[0];
    if (requestedDateDiagnostic && !requestedDateDiagnostic.valid) {
      return {
        success: false as const,
        error: {
          code: 'DATE_CAPACITY_FULL',
          message: 'Requested Release Deck schedule date is not available',
          trackId: track.id,
          requestedDate: requestedDateDiagnostic.date,
          soonestValidDate,
          alternatives,
          diagnostics,
          capacityInputs,
        },
      };
    }

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
        track: {
          id: track.id,
          title: track.title,
          sourceId: track.artistBandId,
          sourceName: track.artistBand?.name ?? null,
          playableSeconds: trackPlayableSeconds,
        },
        from: toDateOnly(fromDate),
        days: lookaheadDays,
        soonestValidDate,
        alternatives,
        diagnostics,
        capacityInputs,
      },
    };
  }

  async scheduleTrack(userId: string, dto: ReleaseDeckScheduleCreateDto): Promise<any> {
    const communityId = dto.communityId?.trim();
    const trackId = dto.trackId?.trim();
    const mode = dto.mode;

    if (!communityId || !trackId) {
      throw new BadRequestException({
        success: false,
        error: { message: 'communityId and trackId are required' },
      });
    }

    const managed = await this.assertSourceOperator(userId, trackId, communityId);
    const requestedDate = mode === 'chosen' ? dto.requestedDate : undefined;
    if (mode === 'chosen' && !requestedDate) {
      throw new BadRequestException({
        success: false,
        error: { message: 'requestedDate is required when mode is chosen' },
      });
    }

    const from = requestedDate ?? todayUtcDateOnly();
    const availability = await this.getAvailability({
      communityId,
      trackId,
      from,
      days: RELEASE_DECK_SCHEDULE_POLICY.lookaheadDays,
    });

    let scheduledDate: string | null = null;
    let capacitySnapshot: Record<string, unknown>;

    if (availability.success) {
      scheduledDate = availability.data.soonestValidDate;
      capacitySnapshot = availability.data;
    } else if (mode === 'soonest' && availability.error?.soonestValidDate) {
      scheduledDate = availability.error.soonestValidDate;
      capacitySnapshot = availability.error;
    } else {
      return availability;
    }

    if (!scheduledDate) {
      return availability;
    }

    const scheduledFor = parseDateOnly(scheduledDate);
    if (!scheduledFor) {
      throw new BadRequestException({
        success: false,
        error: { message: 'Resolved schedule date is invalid' },
      });
    }

    try {
      const schedule = await this.prisma.releaseDeckSchedule.create({
        data: {
          trackId: managed.trackId,
          communityId: managed.communityId,
          artistBandId: managed.artistBandId,
          scheduledFor,
          assignmentMode: mode,
          requestedFor: requestedDate ? parseDateOnly(requestedDate) : null,
          status: 'scheduled',
          capacitySnapshot: capacitySnapshot as any,
          createdById: userId,
        },
        select: {
          id: true,
          trackId: true,
          communityId: true,
          artistBandId: true,
          scheduledFor: true,
          assignmentMode: true,
          requestedFor: true,
          status: true,
          capacitySnapshot: true,
          createdById: true,
        },
      });

      return { success: true as const, data: schedule };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException({
          success: false,
          error: { code: 'ALREADY_SCHEDULED_OR_ACTIVE', message: 'Track is already scheduled' },
        });
      }
      throw error;
    }
  }
}
