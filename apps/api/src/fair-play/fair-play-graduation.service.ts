import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RotationPool } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_RECURRENCE_ROLLING_WINDOW_DAYS = 14;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

type RunGraduationDto = {
  communityId: string;
  asOf?: string;
  dryRun?: boolean;
};

type GraduationEntry = {
  id: string;
  trackId: string;
  sceneId: string;
  enteredPoolAt: Date;
  newWindowDays: number;
  graduatedAt: Date | null;
};

type GraduationClient = Pick<
  PrismaService,
  'community' | 'fairPlayConfig' | 'rotationEntry' | 'trackEngagement'
>;

type SkipReason =
  | 'INVALID_NEW_WINDOW_DAYS'
  | 'INVALID_GRADUATION_STATE'
  | 'NOT_DUE'
  | 'NO_LONGER_ELIGIBLE';

type EvaluatedEntry = {
  entry: GraduationEntry;
  eligibleAt: Date | null;
  reason: Exclude<SkipReason, 'NO_LONGER_ELIGIBLE'> | null;
};

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_IN_MILLISECONDS);
}

function parseAsOf(value?: string): Date {
  if (!value) return startOfUtcDay(new Date());

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw invalidAsOfException();
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
    throw invalidAsOfException();
  }

  return parsed;
}

function invalidAsOfException(): BadRequestException {
  return new BadRequestException({
    success: false,
    error: { message: 'asOf must be YYYY-MM-DD' },
  });
}

function evaluateEntry(entry: GraduationEntry, asOf: Date): EvaluatedEntry {
  if (!Number.isInteger(entry.newWindowDays) || entry.newWindowDays <= 0) {
    return { entry, eligibleAt: null, reason: 'INVALID_NEW_WINDOW_DAYS' };
  }

  const eligibleAt = addDays(entry.enteredPoolAt, entry.newWindowDays);
  if (!Number.isFinite(eligibleAt.getTime())) {
    return { entry, eligibleAt: null, reason: 'INVALID_NEW_WINDOW_DAYS' };
  }
  if (entry.graduatedAt) {
    return { entry, eligibleAt, reason: 'INVALID_GRADUATION_STATE' };
  }
  if (eligibleAt.getTime() > asOf.getTime()) {
    return { entry, eligibleAt, reason: 'NOT_DUE' };
  }

  return { entry, eligibleAt, reason: null };
}

function resultFor(
  evaluated: EvaluatedEntry,
  action: 'would_graduate' | 'graduated' | 'skipped',
  extra: Record<string, unknown> = {},
) {
  return {
    rotationEntryId: evaluated.entry.id,
    trackId: evaluated.entry.trackId,
    communityId: evaluated.entry.sceneId,
    enteredPoolAt: evaluated.entry.enteredPoolAt.toISOString(),
    newWindowDays: evaluated.entry.newWindowDays,
    eligibleAt: evaluated.eligibleAt?.toISOString() ?? null,
    action,
    ...extra,
  };
}

@Injectable()
export class FairPlayGraduationService {
  constructor(private readonly prisma: PrismaService) {}

  async runGraduation(dto: RunGraduationDto): Promise<any> {
    const communityId = dto.communityId?.trim();
    if (!communityId) {
      throw new BadRequestException({
        success: false,
        error: { message: 'communityId is required' },
      });
    }

    const asOf = parseAsOf(dto.asOf);
    const dryRun = dto.dryRun !== false;

    if (dryRun) {
      await this.assertActiveCityCommunity(this.prisma, communityId);
      return this.evaluateGraduation(this.prisma, communityId, asOf, true);
    }

    return this.prisma.$transaction(async (tx: any) => {
      await this.assertActiveCityCommunity(tx, communityId);
      return this.evaluateGraduation(tx, communityId, asOf, false);
    });
  }

  private async assertActiveCityCommunity(client: GraduationClient, communityId: string) {
    const community = await client.community.findUnique({
      where: { id: communityId },
      select: { id: true, tier: true, isActive: true },
    });
    if (!community) {
      throw new NotFoundException({ success: false, error: { message: 'Community not found' } });
    }
    if (community.tier !== 'city' || !community.isActive) {
      throw new BadRequestException({
        success: false,
        error: { message: 'Fair Play graduation is limited to active city-tier communities' },
      });
    }
  }

  private async evaluateGraduation(
    client: GraduationClient,
    communityId: string,
    asOf: Date,
    dryRun: boolean,
  ) {
    const entries = (await client.rotationEntry.findMany({
      where: { sceneId: communityId, pool: RotationPool.NEW_RELEASES },
      select: {
        id: true,
        trackId: true,
        sceneId: true,
        enteredPoolAt: true,
        newWindowDays: true,
        graduatedAt: true,
      },
      orderBy: [{ enteredPoolAt: 'asc' }, { id: 'asc' }],
    })) as GraduationEntry[];

    const evaluatedEntries = entries.map((entry) => evaluateEntry(entry, asOf));
    const dueEntries = evaluatedEntries.filter((entry) => entry.reason === null);
    const { recurrenceRollingWindowDays, scoreByTrackId } = await this.loadRecurrenceScores(
      client,
      dueEntries.map(({ entry }) => entry.trackId),
      asOf,
    );

    const results: any[] = [];
    for (const evaluated of evaluatedEntries) {
      if (evaluated.reason) {
        results.push(resultFor(evaluated, 'skipped', { reason: evaluated.reason }));
        continue;
      }

      const initialRecurrenceScore = scoreByTrackId.get(evaluated.entry.trackId) ?? 0;
      if (dryRun) {
        results.push(resultFor(evaluated, 'would_graduate', { initialRecurrenceScore }));
        continue;
      }

      const update = await client.rotationEntry.updateMany({
        where: {
          id: evaluated.entry.id,
          sceneId: communityId,
          pool: RotationPool.NEW_RELEASES,
          enteredPoolAt: evaluated.entry.enteredPoolAt,
          newWindowDays: evaluated.entry.newWindowDays,
          graduatedAt: null,
        },
        data: {
          pool: RotationPool.MAIN_ROTATION,
          graduatedAt: asOf,
          recurrenceScore: initialRecurrenceScore,
        },
      });

      if (update.count !== 1) {
        results.push(resultFor(evaluated, 'skipped', { reason: 'NO_LONGER_ELIGIBLE' satisfies SkipReason }));
        continue;
      }

      results.push(resultFor(evaluated, 'graduated', { initialRecurrenceScore }));
    }

    return this.buildResponse({
      communityId,
      asOf,
      dryRun,
      recurrenceRollingWindowDays,
      entries,
      dueEntries,
      results,
    });
  }

  private async loadRecurrenceScores(client: GraduationClient, trackIds: string[], asOf: Date) {
    const config = await client.fairPlayConfig.findUnique({
      where: { scope: 'global' },
      select: { recurrenceRollingWindowDays: true },
    });
    const recurrenceRollingWindowDays =
      config?.recurrenceRollingWindowDays ?? DEFAULT_RECURRENCE_ROLLING_WINDOW_DAYS;
    const scoreByTrackId = new Map<string, number>();

    const uniqueTrackIds = Array.from(new Set(trackIds));
    if (uniqueTrackIds.length === 0) {
      return { recurrenceRollingWindowDays, scoreByTrackId };
    }

    const windowStart = addDays(asOf, -recurrenceRollingWindowDays);
    const scores = await client.trackEngagement.findMany({
      where: {
        trackId: { in: uniqueTrackIds },
        createdAt: { gte: windowStart, lte: asOf },
      },
      select: { trackId: true, score: true },
    });

    for (const row of scores) {
      scoreByTrackId.set(row.trackId, (scoreByTrackId.get(row.trackId) ?? 0) + row.score);
    }

    return { recurrenceRollingWindowDays, scoreByTrackId };
  }

  private buildResponse(input: {
    communityId: string;
    asOf: Date;
    dryRun: boolean;
    recurrenceRollingWindowDays: number;
    entries: GraduationEntry[];
    dueEntries: EvaluatedEntry[];
    results: any[];
  }) {
    const graduatedCount = input.results.filter((result) => result.action === 'graduated').length;
    const wouldGraduateCount = input.results.filter(
      (result) => result.action === 'would_graduate',
    ).length;
    const skippedCount = input.results.filter((result) => result.action === 'skipped').length;

    return {
      success: true as const,
      data: {
        dryRun: input.dryRun,
        communityId: input.communityId,
        asOf: input.asOf.toISOString().slice(0, 10),
        recurrenceRollingWindowDays: input.recurrenceRollingWindowDays,
        scannedCount: input.entries.length,
        eligibleCount: input.dueEntries.length,
        graduatedCount,
        wouldGraduateCount,
        skippedCount,
        results: input.results,
      },
    };
  }
}
