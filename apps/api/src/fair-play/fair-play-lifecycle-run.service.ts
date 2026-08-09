import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { FairPlayGraduationService } from './fair-play-graduation.service';
import { FairPlayIngestionService } from './fair-play-ingestion.service';
import { FairPlayService } from './fair-play.service';

export const FAIR_PLAY_LIFECYCLE_JOB = {
  RELEASE_DECK_INGESTION: 'release_deck_ingestion',
  NEW_RELEASES_GRADUATION: 'new_releases_graduation',
  RECURRENCE_RECOMPUTE: 'recurrence_recompute',
} as const;

type FairPlayLifecycleJobType =
  (typeof FAIR_PLAY_LIFECYCLE_JOB)[keyof typeof FAIR_PLAY_LIFECYCLE_JOB];
type DispatchJobType =
  | typeof FAIR_PLAY_LIFECYCLE_JOB.RELEASE_DECK_INGESTION
  | typeof FAIR_PLAY_LIFECYCLE_JOB.NEW_RELEASES_GRADUATION;
type LifecycleTransaction = Prisma.TransactionClient;

export type LifecycleLease = {
  id: string;
  jobType: FairPlayLifecycleJobType;
  communityId: string;
  cadenceBucket: string;
  workerId: string;
  leaseToken: string;
  leaseExpiresAt: Date;
  attemptCount: number;
};

type LifecycleRunRow = LifecycleLease & {
  status: string;
  claimedAt: Date;
  completedAt: Date | null;
  failedAt: Date | null;
};

type ClaimDispatchInput = {
  jobType: DispatchJobType;
  communityId: string;
  cadenceBucket: string;
  workerId: string;
  leaseDurationSeconds: number;
};

type ClaimRecurrenceInput = Omit<ClaimDispatchInput, 'jobType' | 'cadenceBucket'>;
type ClaimBucketInput = Omit<ClaimDispatchInput, 'jobType'> & {
  jobType: FairPlayLifecycleJobType;
};
type LeaseReference = Pick<LifecycleLease, 'id' | 'jobType' | 'workerId' | 'leaseToken'>;
type LeaseGuard = { databaseNow: Date; communityId: string };
type LifecycleResultSummary = Record<string, number>;

const MAX_LEASE_SECONDS = 24 * 60 * 60;
const MAX_ERROR_SUMMARY_LENGTH = 2_000;
const MAX_RESULT_SUMMARY_BYTES = 8 * 1024;

@Injectable()
export class FairPlayLifecycleRunService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ingestion: FairPlayIngestionService,
    private readonly graduation: FairPlayGraduationService,
    private readonly fairPlay: FairPlayService,
  ) {}

  async claimDispatch(input: ClaimDispatchInput): Promise<LifecycleLease | null> {
    this.assertDispatchInput(input);
    return this.prisma.$transaction((tx) => this.claimBucket(tx, input));
  }

  async claimRecurrence(input: ClaimRecurrenceInput): Promise<LifecycleLease | null> {
    this.assertClaimInput(input);

    return this.prisma.$transaction(async (tx) => {
      const completedRuns = await tx.$queryRaw<Array<{ id: string; completedAt: Date; eligible: boolean }>>(
        Prisma.sql`
          WITH clock AS (SELECT clock_timestamp() AS now)
          SELECT
            "id",
            "completedAt",
            clock.now >= "completedAt" + INTERVAL '48 hours' AS "eligible"
          FROM "fair_play_lifecycle_runs"
          CROSS JOIN clock
          WHERE "jobType" = ${FAIR_PLAY_LIFECYCLE_JOB.RECURRENCE_RECOMPUTE}
            AND "communityId" = ${input.communityId}
            AND "status" = 'completed'
            AND "completedAt" IS NOT NULL
          ORDER BY "completedAt" DESC, "id" DESC
          LIMIT 1
          FOR UPDATE
        `,
      );

      const prior = completedRuns[0];
      if (prior && !prior.eligible) {
        return null;
      }

      return this.claimBucket(tx, {
        ...input,
        jobType: FAIR_PLAY_LIFECYCLE_JOB.RECURRENCE_RECOMPUTE,
        cadenceBucket: prior ? `after:${prior.id}` : 'initial',
      });
    });
  }

  private async withLease<T>(
    lease: LeaseReference,
    expectedJobType: FairPlayLifecycleJobType,
    apply: (tx: LifecycleTransaction, guard: LeaseGuard) => Promise<{
      value: T;
      resultSummary: LifecycleResultSummary;
    }>,
  ): Promise<T> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const guard = await this.guardLease(tx, lease, expectedJobType);
        const result = await apply(tx, guard);
        await this.completeInTransaction(tx, lease, result.resultSummary);
        return result.value;
      });
    } catch (error) {
      try {
        await this.fail(lease, this.toErrorSummary(error));
      } catch {
        // A stale/expired lease cannot be marked failed by this worker. Preserve
        // the original lifecycle error instead of masking it with cleanup noise.
      }
      throw error;
    }
  }

  async applyIngestionWithLease(lease: LeaseReference): Promise<any> {
    return this.withLease(lease, FAIR_PLAY_LIFECYCLE_JOB.RELEASE_DECK_INGESTION, async (tx, guard) => {
      const value = await this.ingestion.applyDueSchedulesInTransaction(tx, {
        communityId: guard.communityId,
        asOf: guard.databaseNow.toISOString().slice(0, 10),
      });
      return {
        value,
        resultSummary: this.resultSummary(value?.data, [
          'dueCount',
          'ingestedCount',
          'skippedCount',
        ]),
      };
    });
  }

  async applyGraduationWithLease(lease: LeaseReference): Promise<any> {
    return this.withLease(lease, FAIR_PLAY_LIFECYCLE_JOB.NEW_RELEASES_GRADUATION, async (tx, guard) => {
      const value = await this.graduation.applyGraduationInTransaction(tx, {
        communityId: guard.communityId,
        asOf: guard.databaseNow,
      });
      return {
        value,
        resultSummary: this.resultSummary(value?.data, [
          'scannedCount',
          'eligibleCount',
          'graduatedCount',
          'skippedCount',
        ]),
      };
    });
  }

  async applyRecurrenceWithLease(lease: LeaseReference): Promise<any> {
    return this.withLease(lease, FAIR_PLAY_LIFECYCLE_JOB.RECURRENCE_RECOMPUTE, async (tx, guard) => {
      const value = await this.fairPlay.aggregateRecurrenceScoresInTransaction(tx, {
        sceneId: guard.communityId,
        asOf: guard.databaseNow,
        requireActiveCity: true,
      });
      return {
        value,
        resultSummary: this.resultSummary(value?.data, ['updatedCount']),
      };
    });
  }

  async fail(lease: LeaseReference, errorSummary: string): Promise<boolean> {
    const boundedError = this.boundErrorSummary(errorSummary);
    return this.prisma.$transaction(async (tx) => {
      await this.guardLease(tx, lease, lease.jobType);
      const updated = await tx.$queryRaw<Array<{ id: string }>>(
        Prisma.sql`
          WITH clock AS (SELECT clock_timestamp() AS now)
          UPDATE "fair_play_lifecycle_runs"
          SET
            "status" = 'failed',
            "failedAt" = (SELECT now FROM clock),
            "errorSummary" = ${boundedError},
            "updatedAt" = (SELECT now FROM clock)
          WHERE "id" = ${lease.id}
            AND "jobType" = ${lease.jobType}
            AND "status" = 'leased'
            AND "workerId" = ${lease.workerId}
            AND "leaseToken" = ${lease.leaseToken}
            AND "leaseExpiresAt" > (SELECT now FROM clock)
          RETURNING "id"
        `,
      );

      return updated.length === 1;
    });
  }

  private async claimBucket(
    tx: LifecycleTransaction,
    input: ClaimBucketInput,
  ): Promise<LifecycleLease | null> {
    const id = randomUUID();
    const leaseToken = randomUUID();
    const rows = await tx.$queryRaw<LifecycleRunRow[]>(
      Prisma.sql`
        WITH clock AS (SELECT clock_timestamp() AS now)
        INSERT INTO "fair_play_lifecycle_runs" (
          "id", "jobType", "communityId", "cadenceBucket", "status",
          "attemptCount", "workerId", "leaseToken", "claimedAt",
          "leaseExpiresAt", "createdAt", "updatedAt"
        )
        SELECT
          ${id}, ${input.jobType}, ${input.communityId}, ${input.cadenceBucket}, 'leased',
          1, ${input.workerId}, ${leaseToken}, clock.now,
          clock.now + (${input.leaseDurationSeconds}::int * INTERVAL '1 second'),
          clock.now, clock.now
        FROM "communities"
        CROSS JOIN clock
        WHERE "id" = ${input.communityId}
          AND "tier" = 'city'
          AND "isActive" = true
        ON CONFLICT ("jobType", "communityId", "cadenceBucket") DO UPDATE
        SET
          "status" = 'leased',
          "attemptCount" = "fair_play_lifecycle_runs"."attemptCount" + 1,
          "workerId" = EXCLUDED."workerId",
          "leaseToken" = EXCLUDED."leaseToken",
          "claimedAt" = (SELECT now FROM clock),
          "leaseExpiresAt" = (SELECT now FROM clock) + (${input.leaseDurationSeconds}::int * INTERVAL '1 second'),
          "completedAt" = NULL,
          "failedAt" = NULL,
          "resultSummary" = NULL,
          "errorSummary" = NULL,
          "updatedAt" = (SELECT now FROM clock)
        WHERE EXISTS (
          SELECT 1
          FROM "communities"
          WHERE "communities"."id" = ${input.communityId}
            AND "communities"."tier" = 'city'
            AND "communities"."isActive" = true
        )
          AND (
            "fair_play_lifecycle_runs"."status" = 'failed'
            OR (
              "fair_play_lifecycle_runs"."status" = 'leased'
              AND "fair_play_lifecycle_runs"."leaseExpiresAt" <= (SELECT now FROM clock)
            )
          )
        RETURNING
          "id", "jobType", "communityId", "cadenceBucket", "status",
          "workerId", "leaseToken", "leaseExpiresAt", "attemptCount",
          "claimedAt", "completedAt", "failedAt"
      `,
    );

    return rows[0] ?? null;
  }

  private async guardLease(
    tx: LifecycleTransaction,
    lease: LeaseReference,
    expectedJobType: FairPlayLifecycleJobType,
  ): Promise<LeaseGuard> {
    const rows = await tx.$queryRaw<LeaseGuard[]>(
      Prisma.sql`
        WITH clock AS (SELECT clock_timestamp() AS now)
        SELECT run."communityId", clock.now AS "databaseNow"
        FROM "fair_play_lifecycle_runs" AS run
        INNER JOIN "communities" AS community ON community."id" = run."communityId"
        CROSS JOIN clock
        WHERE run."id" = ${lease.id}
          AND run."jobType" = ${expectedJobType}
          AND run."status" = 'leased'
          AND run."workerId" = ${lease.workerId}
          AND run."leaseToken" = ${lease.leaseToken}
          AND run."leaseExpiresAt" > clock.now
          AND community."tier" = 'city'
          AND community."isActive" = true
        FOR UPDATE OF run, community
      `,
    );

    if (!rows[0]) {
      throw new ConflictException({
        success: false,
        error: { message: 'Fair Play lifecycle lease is not current' },
      });
    }

    return rows[0];
  }

  private async completeInTransaction(
    tx: LifecycleTransaction,
    lease: LeaseReference,
    resultSummary: LifecycleResultSummary,
  ) {
    const serialized = JSON.stringify(resultSummary);
    if (Buffer.byteLength(serialized, 'utf8') > MAX_RESULT_SUMMARY_BYTES) {
      throw new BadRequestException({
        success: false,
        error: { message: 'Fair Play lifecycle result summary exceeds the allowed size' },
      });
    }

    const updated = await tx.$queryRaw<Array<{ id: string }>>(
      Prisma.sql`
        WITH clock AS (SELECT clock_timestamp() AS now)
        UPDATE "fair_play_lifecycle_runs"
        SET
          "status" = 'completed',
          "completedAt" = (SELECT now FROM clock),
          "failedAt" = NULL,
          "errorSummary" = NULL,
          "resultSummary" = ${serialized}::jsonb,
          "updatedAt" = (SELECT now FROM clock)
        WHERE "id" = ${lease.id}
          AND "jobType" = ${lease.jobType}
          AND "status" = 'leased'
          AND "workerId" = ${lease.workerId}
          AND "leaseToken" = ${lease.leaseToken}
          AND "leaseExpiresAt" > (SELECT now FROM clock)
        RETURNING "id"
      `,
    );

    if (updated.length !== 1) {
      throw new ConflictException({
        success: false,
        error: { message: 'Fair Play lifecycle lease expired before completion' },
      });
    }
  }

  private assertDispatchInput(input: ClaimDispatchInput) {
    if (!input.cadenceBucket.trim()) {
      throw new BadRequestException({ success: false, error: { message: 'cadenceBucket is required' } });
    }
    this.assertClaimInput(input);
  }

  private assertClaimInput(input: Pick<ClaimDispatchInput, 'communityId' | 'workerId' | 'leaseDurationSeconds'>) {
    if (!input.communityId?.trim() || !input.workerId?.trim()) {
      throw new BadRequestException({
        success: false,
        error: { message: 'communityId and workerId are required' },
      });
    }
    if (
      !Number.isInteger(input.leaseDurationSeconds)
      || input.leaseDurationSeconds <= 0
      || input.leaseDurationSeconds > MAX_LEASE_SECONDS
    ) {
      throw new BadRequestException({
        success: false,
        error: { message: 'leaseDurationSeconds must be a positive integer no greater than one day' },
      });
    }
  }

  private boundErrorSummary(value: string) {
    return value.slice(0, MAX_ERROR_SUMMARY_LENGTH);
  }

  private toErrorSummary(error: unknown) {
    if (error instanceof Error) return this.boundErrorSummary(error.message);
    return this.boundErrorSummary(String(error));
  }

  private resultSummary(data: unknown, keys: string[]): LifecycleResultSummary {
    if (!data || typeof data !== 'object') return {};
    const source = data as Record<string, unknown>;
    return keys.reduce<LifecycleResultSummary>((summary, key) => {
      if (typeof source[key] === 'number' && Number.isFinite(source[key])) {
        summary[key] = source[key] as number;
      }
      return summary;
    }, {});
  }
}
