import { Injectable } from '@nestjs/common';
import { FairPlayLifecycleRunMode, FairPlayLifecycleRunStatus } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { FairPlayGraduationService } from './fair-play-graduation.service';
import { FairPlayIngestionService } from './fair-play-ingestion.service';

const LIFECYCLE_OPERATION_KEY = 'fair-play-city-tier-lifecycle';
const ERROR_SUMMARY_LIMIT = 500;
const STORED_COMMUNITY_SUMMARY_LIMIT = 25;
const STORED_FAILED_STEP_SUMMARY_LIMIT = 25;

type LifecycleRunOptions = {
  asOf?: string;
  dryRun?: boolean;
  ownerId?: string;
};

type LifecycleStepResult =
  | { status: 'completed'; data: unknown }
  | { status: 'failed'; error: string };

type LeaseRow = { operationKey: string };
type DatabaseTimeRow = { now: Date };

type LifecycleResult = {
  communityId: string;
  ingestion: LifecycleStepResult;
  graduation: LifecycleStepResult;
};

function errorMessage(error: unknown): string {
  const value = error instanceof Error ? error.message : String(error);
  return value.slice(0, ERROR_SUMMARY_LIMIT);
}

function modeFor(options: LifecycleRunOptions): FairPlayLifecycleRunMode {
  return options.dryRun === false ? FairPlayLifecycleRunMode.MUTATION : FairPlayLifecycleRunMode.DRY_RUN;
}

function toUtcDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Internal orchestration seam. It has no timer, endpoint, queue, or recurrence
 * aggregation call; another approved operational slice must explicitly invoke it.
 */
@Injectable()
export class FairPlayLifecycleWorkerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ingestionService: FairPlayIngestionService,
    private readonly graduationService: FairPlayGraduationService,
  ) {}

  async runForActiveCityCommunities(options: LifecycleRunOptions = {}) {
    const startedAt = await this.databaseNow();
    const asOf = options.asOf ?? toUtcDateOnly(startedAt);
    const runId = randomUUID();
    const attemptId = randomUUID();
    const ownerId = options.ownerId?.trim() || `manual:${process.pid}`;
    const acquired = await this.acquireLease({ ownerId, runId });

    if (!acquired) {
      await this.recordLeaseRefusal({ ownerId, attemptId, runId, startedAt, options });
      return {
        success: false as const,
        error: {
          code: 'LIFECYCLE_LEASE_HELD',
          message: 'A Fair Play lifecycle run currently owns the durable lease.',
        },
      };
    }

    try {
      await this.prisma.fairPlayLifecycleRun.create({
        data: {
          id: runId,
          operationKey: LIFECYCLE_OPERATION_KEY,
          ownerId,
          attemptId,
          mode: modeFor(options),
          status: FairPlayLifecycleRunStatus.RUNNING,
          startedAt,
        },
      });
    } catch (error) {
      await this.releaseLease({ ownerId, runId });
      return {
        success: false as const,
        error: {
          code: 'LIFECYCLE_RUN_RECORD_FAILED',
          message: errorMessage(error),
        },
      };
    }

    try {
      const communities = await this.prisma.community.findMany({
        where: { tier: 'city', isActive: true },
        select: { id: true },
        orderBy: { id: 'asc' },
      });
      const results: LifecycleResult[] = [];

      for (const community of communities) {
        const request = {
          communityId: community.id,
          asOf,
          ...(options.dryRun === undefined ? {} : { dryRun: options.dryRun }),
        };
        await this.assertActiveLease({ ownerId, runId });
        const ingestion = await this.runStep(() => this.ingestionService.ingestDueSchedules(request));
        await this.assertActiveLease({ ownerId, runId });
        const graduation = await this.runStep(() => this.graduationService.runGraduation(request));
        results.push({ communityId: community.id, ingestion, graduation });
      }

      const failedStepCount = results.reduce(
        (count, result) =>
          count + Number(result.ingestion.status === 'failed') + Number(result.graduation.status === 'failed'),
        0,
      );
      const finishedAt = await this.databaseNow();
      const summary = this.summarizeResults(results, failedStepCount);
      await this.prisma.fairPlayLifecycleRun.update({
        where: { id: runId },
        data: {
          status:
            failedStepCount === 0
              ? FairPlayLifecycleRunStatus.COMPLETED
              : FairPlayLifecycleRunStatus.PARTIAL_FAILURE,
          finishedAt,
          activeCityCommunityCount: communities.length,
          failedStepCount,
          resultSummary: summary,
          errorSummary:
            summary.failedSteps.length === 0
              ? undefined
              : {
                  failedSteps: summary.failedSteps,
                  omittedFailedStepCount: summary.omittedFailedStepCount,
                },
        },
      });

      return {
        success: true as const,
        data: {
          runId,
          activeCityCommunityCount: communities.length,
          failedStepCount,
          results,
        },
      };
    } catch (error) {
      const finishedAt = await this.databaseNow();
      await this.prisma.fairPlayLifecycleRun.update({
        where: { id: runId },
        data: {
          status: FairPlayLifecycleRunStatus.FAILED,
          finishedAt,
          failedStepCount: 1,
          errorSummary: { error: errorMessage(error) },
        },
      });
      return {
        success: false as const,
        error: { code: 'LIFECYCLE_RUN_FAILED', message: errorMessage(error) },
      };
    } finally {
      await this.releaseLease({ ownerId, runId });
    }
  }

  private async databaseNow(): Promise<Date> {
    const rows = await this.prisma.$queryRaw<DatabaseTimeRow[]>`
      SELECT CURRENT_TIMESTAMP AS "now";
    `;
    return rows[0].now;
  }

  private async acquireLease(input: { ownerId: string; runId: string }): Promise<boolean> {
    const rows = await this.prisma.$queryRaw<LeaseRow[]>`
      INSERT INTO "fair_play_lifecycle_leases"
        ("operationKey", "ownerId", "currentRunId", "leaseExpiresAt", "createdAt", "updatedAt")
      VALUES
        (${LIFECYCLE_OPERATION_KEY}, ${input.ownerId}, ${input.runId}, CURRENT_TIMESTAMP + INTERVAL '5 minutes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT ("operationKey") DO UPDATE
      SET
        "ownerId" = EXCLUDED."ownerId",
        "currentRunId" = EXCLUDED."currentRunId",
        "leaseExpiresAt" = EXCLUDED."leaseExpiresAt",
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "fair_play_lifecycle_leases"."leaseExpiresAt" <= CURRENT_TIMESTAMP
      RETURNING "operationKey";
    `;
    return rows.length === 1;
  }

  private async recordLeaseRefusal(input: {
    ownerId: string;
    attemptId: string;
    runId: string;
    startedAt: Date;
    options: LifecycleRunOptions;
  }) {
    await this.prisma.fairPlayLifecycleRun.create({
      data: {
        id: input.runId,
        operationKey: LIFECYCLE_OPERATION_KEY,
        ownerId: input.ownerId,
        attemptId: input.attemptId,
        mode: modeFor(input.options),
        status: FairPlayLifecycleRunStatus.LEASE_REFUSED,
        startedAt: input.startedAt,
        finishedAt: await this.databaseNow(),
        errorSummary: { code: 'LIFECYCLE_LEASE_HELD' },
      },
    });
  }

  private async assertActiveLease(input: { ownerId: string; runId: string }) {
    const rows = await this.prisma.$queryRaw<LeaseRow[]>`
      UPDATE "fair_play_lifecycle_leases"
      SET
        "leaseExpiresAt" = CURRENT_TIMESTAMP + INTERVAL '5 minutes',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "operationKey" = ${LIFECYCLE_OPERATION_KEY}
        AND "ownerId" = ${input.ownerId}
        AND "currentRunId" = ${input.runId}
        AND "leaseExpiresAt" > CURRENT_TIMESTAMP
      RETURNING "operationKey";
    `;
    if (rows.length !== 1) {
      throw new Error('Fair Play lifecycle lease was lost before the next lifecycle step.');
    }
  }

  private async releaseLease(input: { ownerId: string; runId: string }) {
    await this.prisma.$queryRaw<LeaseRow[]>`
      UPDATE "fair_play_lifecycle_leases"
      SET
        "leaseExpiresAt" = CURRENT_TIMESTAMP,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "operationKey" = ${LIFECYCLE_OPERATION_KEY}
        AND "ownerId" = ${input.ownerId}
        AND "currentRunId" = ${input.runId}
      RETURNING "operationKey";
    `;
  }

  private summarizeResults(results: LifecycleResult[], failedStepCount: number) {
    const failedSteps: Array<{ communityId: string; step: 'ingestion' | 'graduation'; error: string }> = [];
    const communities = results.slice(0, STORED_COMMUNITY_SUMMARY_LIMIT).map((result) => {
      for (const [step, stepResult] of Object.entries({
        ingestion: result.ingestion,
        graduation: result.graduation,
      }) as Array<['ingestion' | 'graduation', LifecycleStepResult]>) {
        if (stepResult.status === 'failed' && failedSteps.length < STORED_FAILED_STEP_SUMMARY_LIMIT) {
          failedSteps.push({ communityId: result.communityId, step, error: stepResult.error });
        }
      }
      return {
        communityId: result.communityId,
        ingestion: result.ingestion.status,
        graduation: result.graduation.status,
      };
    });
    return {
      communitySummaryLimit: STORED_COMMUNITY_SUMMARY_LIMIT,
      failedStepSummaryLimit: STORED_FAILED_STEP_SUMMARY_LIMIT,
      totalCommunityCount: results.length,
      omittedCommunityCount: Math.max(0, results.length - communities.length),
      totalFailedStepCount: failedStepCount,
      omittedFailedStepCount: Math.max(0, failedStepCount - failedSteps.length),
      communities,
      failedSteps,
    };
  }

  private async runStep(run: () => Promise<unknown>): Promise<LifecycleStepResult> {
    try {
      return { status: 'completed', data: await run() };
    } catch (error) {
      return { status: 'failed', error: errorMessage(error) };
    }
  }
}
