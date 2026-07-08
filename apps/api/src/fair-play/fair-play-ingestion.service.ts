import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RotationPool } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const NEW_RELEASE_WINDOW_DAYS = 10;
const MAX_TRACK_SECONDS = 6 * 60;

type IngestDueSchedulesDto = {
  communityId: string;
  asOf?: string;
  dryRun?: boolean;
};

type DueSchedule = {
  id: string;
  trackId: string;
  communityId: string;
  artistBandId: string;
  scheduledFor: Date;
  status: string;
  track: {
    id: string;
    title: string;
    duration: number;
    status: string | null;
    communityId: string | null;
    artistBandId: string | null;
    artistBand: {
      id: string;
      homeSceneId: string | null;
    } | null;
  } | null;
};

type SkipReason =
  | 'SCHEDULE_NOT_FOUND'
  | 'SCHEDULE_NOT_PENDING'
  | 'TRACK_MISSING'
  | 'MISSING_SOURCE_OWNERSHIP'
  | 'WRONG_COMMUNITY'
  | 'MISSING_SOURCE_HOME_SCENE'
  | 'SOURCE_HOME_SCENE_MISMATCH'
  | 'TRACK_NOT_READY'
  | 'INVALID_DURATION'
  | 'OVER_MAX_TRACK_SECONDS'
  | 'ACTIVE_TRACK_ROTATION_EXISTS'
  | 'ACTIVE_SOURCE_NEW_RELEASE_EXISTS';

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function parseAsOf(value?: string): Date {
  if (!value) return startOfUtcDay(new Date());
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new BadRequestException({
      success: false,
      error: { message: 'asOf must be YYYY-MM-DD' },
    });
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new BadRequestException({
      success: false,
      error: { message: 'asOf must be YYYY-MM-DD' },
    });
  }

  return parsed;
}

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function resolveSkipReason(schedule: DueSchedule, communityId: string): SkipReason | null {
  const track = schedule.track;
  if (schedule.status !== 'scheduled') return 'SCHEDULE_NOT_PENDING';
  if (!track) return 'TRACK_MISSING';
  if (!track.artistBandId || !track.artistBand) return 'MISSING_SOURCE_OWNERSHIP';
  if (track.communityId !== communityId || schedule.communityId !== communityId) return 'WRONG_COMMUNITY';
  if (!track.artistBand.homeSceneId) return 'MISSING_SOURCE_HOME_SCENE';
  if (track.artistBand.homeSceneId !== communityId) return 'SOURCE_HOME_SCENE_MISMATCH';
  if (track.status !== 'ready') return 'TRACK_NOT_READY';
  if (!Number.isFinite(track.duration) || track.duration <= 0) return 'INVALID_DURATION';
  if (track.duration > MAX_TRACK_SECONDS) return 'OVER_MAX_TRACK_SECONDS';
  return null;
}

function resultFor(schedule: DueSchedule, action: string, extra: Record<string, unknown> = {}) {
  return {
    scheduleId: schedule.id,
    trackId: schedule.trackId,
    communityId: schedule.communityId,
    artistBandId: schedule.artistBandId,
    scheduledFor: toDateOnly(schedule.scheduledFor),
    action,
    ...extra,
  };
}

@Injectable()
export class FairPlayIngestionService {
  constructor(private readonly prisma: PrismaService) {}

  async ingestDueSchedules(dto: IngestDueSchedulesDto): Promise<any> {
    const communityId = dto.communityId?.trim();
    if (!communityId) {
      throw new BadRequestException({
        success: false,
        error: { message: 'communityId is required' },
      });
    }

    const asOfDay = parseAsOf(dto.asOf);
    const asOfEnd = addDays(asOfDay, 1);
    const dryRun = dto.dryRun !== false;

    const community = await this.prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true, tier: true, isActive: true },
    });
    if (!community) {
      throw new NotFoundException({ success: false, error: { message: 'Community not found' } });
    }
    if (community.tier !== 'city' || !community.isActive) {
      throw new BadRequestException({
        success: false,
        error: { message: 'Fair Play ingestion is limited to active city-tier communities' },
      });
    }

    const dueSchedules = (await this.prisma.releaseDeckSchedule.findMany({
      where: {
        communityId,
        status: 'scheduled',
        scheduledFor: { lt: asOfEnd },
      },
      select: {
        id: true,
        trackId: true,
        communityId: true,
        artistBandId: true,
        scheduledFor: true,
        status: true,
        track: {
          select: {
            id: true,
            title: true,
            duration: true,
            status: true,
            communityId: true,
            artistBandId: true,
            artistBand: { select: { id: true, homeSceneId: true } },
          },
        },
      },
      orderBy: [{ scheduledFor: 'asc' }, { id: 'asc' }],
    })) as DueSchedule[];

    if (dryRun) {
      const results = await Promise.all(dueSchedules.map(async (schedule) => {
        const reason = resolveSkipReason(schedule, communityId);
        if (reason) return resultFor(schedule, 'skipped', { reason });
        const runtimeReason = await this.resolveRuntimeBlocker(this.prisma, schedule, communityId);
        if (runtimeReason) return resultFor(schedule, 'skipped', { reason: runtimeReason });
        return resultFor(schedule, 'would_ingest', { newWindowDays: NEW_RELEASE_WINDOW_DAYS });
      }));

      return this.buildResponse({ communityId, asOfDay, dryRun, dueSchedules, results });
    }

    const results = await this.prisma.$transaction(async (tx: any) => {
      const transactionResults: any[] = [];
      for (const dueSchedule of dueSchedules) {
        const schedule = (await tx.releaseDeckSchedule.findUnique({
          where: { id: dueSchedule.id },
          select: {
            id: true,
            trackId: true,
            communityId: true,
            artistBandId: true,
            scheduledFor: true,
            status: true,
            track: {
              select: {
                id: true,
                title: true,
                duration: true,
                status: true,
                communityId: true,
                artistBandId: true,
                artistBand: { select: { id: true, homeSceneId: true } },
              },
            },
          },
        })) as DueSchedule | null;

        if (!schedule) {
          transactionResults.push({
            scheduleId: dueSchedule.id,
            trackId: dueSchedule.trackId,
            communityId: dueSchedule.communityId,
            artistBandId: dueSchedule.artistBandId,
            scheduledFor: toDateOnly(dueSchedule.scheduledFor),
            action: 'skipped',
            reason: 'SCHEDULE_NOT_FOUND' satisfies SkipReason,
          });
          continue;
        }

        const reason = resolveSkipReason(schedule, communityId);
        if (reason) {
          transactionResults.push(resultFor(schedule, 'skipped', { reason }));
          continue;
        }

        const runtimeReason = await this.resolveRuntimeBlocker(tx, schedule, communityId);
        if (runtimeReason) {
          transactionResults.push(resultFor(schedule, 'skipped', { reason: runtimeReason }));
          continue;
        }

        let rotationEntry;
        try {
          rotationEntry = await tx.rotationEntry.create({
            data: {
              trackId: schedule.trackId,
              sceneId: communityId,
              pool: RotationPool.NEW_RELEASES,
              enteredPoolAt: asOfDay,
              newWindowDays: NEW_RELEASE_WINDOW_DAYS,
            },
            select: {
              id: true,
              trackId: true,
              sceneId: true,
              pool: true,
              enteredPoolAt: true,
              newWindowDays: true,
            },
          });
        } catch (error: any) {
          if (error?.code === 'P2002') {
            throw new ConflictException({
              success: false,
              error: { code: 'ROTATION_ENTRY_EXISTS', message: 'Track already has a rotation entry' },
            });
          }
          throw error;
        }

        await tx.releaseDeckSchedule.update({
          where: { id: schedule.id },
          data: { status: 'ingested' },
          select: { id: true, status: true },
        });

        transactionResults.push(
          resultFor(schedule, 'ingested', {
            rotationEntryId: rotationEntry.id,
            newWindowDays: NEW_RELEASE_WINDOW_DAYS,
          })
        );
      }
      return transactionResults;
    });

    return this.buildResponse({ communityId, asOfDay, dryRun, dueSchedules, results });
  }

  private async resolveRuntimeBlocker(
    client: Pick<PrismaService, 'rotationEntry'>,
    schedule: DueSchedule,
    communityId: string
  ): Promise<SkipReason | null> {
    const activeTrackEntry = await client.rotationEntry.findFirst({
      where: { trackId: schedule.trackId, sceneId: communityId },
      select: { id: true, trackId: true },
    });
    if (activeTrackEntry) return 'ACTIVE_TRACK_ROTATION_EXISTS';

    const activeSourceEntry = await client.rotationEntry.findFirst({
      where: {
        sceneId: communityId,
        pool: RotationPool.NEW_RELEASES,
        track: { artistBandId: schedule.artistBandId },
      },
      select: { id: true, trackId: true },
    });
    if (activeSourceEntry) return 'ACTIVE_SOURCE_NEW_RELEASE_EXISTS';

    return null;
  }

  private buildResponse(input: {
    communityId: string;
    asOfDay: Date;
    dryRun: boolean;
    dueSchedules: DueSchedule[];
    results: any[];
  }) {
    const ingestedCount = input.results.filter((result) => result.action === 'ingested').length;
    const wouldIngestCount = input.results.filter((result) => result.action === 'would_ingest').length;
    const skippedCount = input.results.filter((result) => result.action === 'skipped').length;

    return {
      success: true as const,
      data: {
        dryRun: input.dryRun,
        communityId: input.communityId,
        asOf: toDateOnly(input.asOfDay),
        newWindowDays: NEW_RELEASE_WINDOW_DAYS,
        dueCount: input.dueSchedules.length,
        ingestedCount,
        wouldIngestCount,
        skippedCount,
        results: input.results,
      },
    };
  }
}
