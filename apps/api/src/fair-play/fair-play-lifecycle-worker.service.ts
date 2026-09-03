import { Injectable } from '@nestjs/common';
import { FairPlayLifecycleRunMode, FairPlayLifecycleRunStatus } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import {
  FAIR_PLAY_LIFECYCLE_OPERATION_KEY,
  FairPlayLifecycleLeaseContext,
  FairPlayLifecycleLeaseLostError,
} from './fair-play-lifecycle-lease';
import { FairPlayGraduationService } from './fair-play-graduation.service';
import { FairPlayIngestionService } from './fair-play-ingestion.service';

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
    const runId = randomUUID();
    const attemptId = randomUUID();
    const ownerId = options.ownerId?.trim() || `manual:${process.pid}`;
    const attempt = await this.createRunAndClaimLease({ ownerId, attemptId, runId, options });

    if (!attempt.acquired) {
      return {
        success: false as const,
        error: {
          code: 'LIFECYCLE_LEASE_HELD',
          message: 'A Fair Play lifecycle run currently owns the durable lease.',
        },
      };
    }

    const asOf = options.asOf ?? toUtcDateOnly(attempt.startedAt);
    const lifecycleLease: FairPlayLifecycleLeaseContext = { ownerId, runId };

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
          lifecycleLease,
          ...(options.dryRun === undefined ? {} : { dryRun: options.dryRun }),
        };
        const ingestion = await this.runStep(() => this.ingestionService.ingestDueSchedules(request));
        const graduation = await this.runStep(() => this.graduationService.runGraduation(request));
        results.push({ communityId: community.id, ingestion, graduation });
      }

      const failedStepCount = results.reduce(
        (count, result) =>
          count + Number(result.ingestion.status === 'failed') + Number(result.graduation.status === 'failed'),
        0,
      );
      const finishedAt = await this.databaseNow(this.prisma);
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
      const finishedAt = await this.databaseNow(this.prisma);
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

  private async createRunAndClaimLease(input: {
    ownerId: string;
    attemptId: string;
    runId: string;
    options: LifecycleRunOptions;
  }): Promise<{ acquired: boolean; startedAt: Date }> {
    return this.prisma.$transaction(async (tx: any) => {
      const startedAt = await this.databaseNow(tx);
      await tx.fairPlayLifecycleRun.create({
        data: {
          id: input.runId,
          operationKey: FAIR_PLAY_LIFECYCLE_OPERATION_KEY,
          ownerId: input.ownerId,
          attemptId: input.attemptId,
          mode: modeFor(input.options),
          status: FairPlayLifecycleRunStatus.RUNNING,
          startedAt,
        },
      });

      const acquired = await this.acquireLease(tx, input);
      if (!acquired) {
        await tx.fairPlayLifecycleRun.update({
          where: { id: input.runId },
          data: {
            status: FairPlayLifecycleRunStatus.LEASE_REFUSED,
            finishedAt: await this.databaseNow(tx),
            errorSummary: { code: 'LIFECYCLE_LEASE_HELD' },
          },
        });
      }

      return { acquired, startedAt };
    });
  }

  private async databaseNow(client: Pick<PrismaService, '$queryRaw'>): Promise<Date> {
    const rows = await client.$queryRaw<DatabaseTimeRow[]>`
      SELECT CURRENT_TIMESTAMP AS "now";
    `;
    return rows[0].now;
  }

  private async acquireLease(
    client: Pick<PrismaService, '$queryRaw'>,
    input: { ownerId: string; runId: string },
  ): Promise<boolean> {
    const rows = await client.$queryRaw<LeaseRow[]>`
      INSERT INTO "fair_play_lifecycle_leases"
        ("operationKey", "ownerId", "currentRunId", "leaseExpiresAt", "createdAt", "updatedAt")
      VALUES
        (${FAIR_PLAY_LIFECYCLE_OPERATION_KEY}, ${input.ownerId}, ${input.runId}, CURRENT_TIMESTAMP + INTERVAL '5 minutes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
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

  private async releaseLease(input: { ownerId: string; runId: string }) {
    await this.prisma.$queryRaw<LeaseRow[]>`
      UPDATE "fair_play_lifecycle_leases"
      SET
        "leaseExpiresAt" = CURRENT_TIMESTAMP,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "operationKey" = ${FAIR_PLAY_LIFECYCLE_OPERATION_KEY}
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
      if (error instanceof FairPlayLifecycleLeaseLostError) {
        throw error;
      }
      return { status: 'failed', error: errorMessage(error) };
    }
  }
}
