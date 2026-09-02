import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { FairPlayGraduationService } from './fair-play-graduation.service';
import { FairPlayIngestionService } from './fair-play-ingestion.service';

const LIFECYCLE_OPERATION_KEY = 'fair-play-city-tier-lifecycle';
const LIFECYCLE_LEASE_MILLISECONDS = 5 * 60 * 1000;
const ERROR_SUMMARY_LIMIT = 500;

type LifecycleRunOptions = {
  asOf?: string;
  dryRun?: boolean;
  ownerId?: string;
};

type LifecycleStepResult =
  | { status: 'completed'; data: unknown }
  | { status: 'failed'; error: string };

type LeaseRow = { operationKey: string };

type LifecycleResult = {
  communityId: string;
  ingestion: LifecycleStepResult;
  graduation: LifecycleStepResult;
};

function errorMessage(error: unknown): string {
  const value = error instanceof Error ? error.message : String(error);
  return value.slice(0, ERROR_SUMMARY_LIMIT);
}

function modeFor(options: LifecycleRunOptions): 'dry_run' | 'mutation' {
  return options.dryRun === false ? 'mutation' : 'dry_run';
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
    const startedAt = new Date();
    const runId = randomUUID();
    const attemptId = randomUUID();
    const ownerId = options.ownerId?.trim() || `manual:${process.pid}`;
    const acquired = await this.acquireLease({ ownerId, runId, now: startedAt });

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
          status: 'running',
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
          ...(options.asOf === undefined ? {} : { asOf: options.asOf }),
          ...(options.dryRun === undefined ? {} : { dryRun: options.dryRun }),
        };
        const ingestion = await this.runStep(() => this.ingestionService.ingestDueSchedules(request));
        const graduation = await this.runStep(() => this.graduationService.runGraduation(request));
        results.push({ communityId: community.id, ingestion, graduation });
        await this.refreshLease({ ownerId, runId });
      }

      const failedStepCount = results.reduce(
        (count, result) =>
          count + Number(result.ingestion.status === 'failed') + Number(result.graduation.status === 'failed'),
        0,
      );
      const finishedAt = new Date();
      const summary = this.summarizeResults(results);
      await this.prisma.fairPlayLifecycleRun.update({
        where: { id: runId },
        data: {
          status: failedStepCount === 0 ? 'completed' : 'partial_failure',
          finishedAt,
          activeCityCommunityCount: communities.length,
          failedStepCount,
          resultSummary: summary,
          errorSummary: summary.failedSteps.length === 0 ? undefined : { failedSteps: summary.failedSteps },
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
      const finishedAt = new Date();
      await this.prisma.fairPlayLifecycleRun.update({
        where: { id: runId },
        data: {
          status: 'failed',
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

  private async acquireLease(input: { ownerId: string; runId: string; now: Date }): Promise<boolean> {
    const leaseExpiresAt = new Date(input.now.getTime() + LIFECYCLE_LEASE_MILLISECONDS);
    const rows = await this.prisma.$queryRaw<LeaseRow[]>`
      INSERT INTO "fair_play_lifecycle_leases"
        ("operationKey", "ownerId", "currentRunId", "leaseExpiresAt", "createdAt", "updatedAt")
      VALUES
        (${LIFECYCLE_OPERATION_KEY}, ${input.ownerId}, ${input.runId}, ${leaseExpiresAt}, ${input.now}, ${input.now})
      ON CONFLICT ("operationKey") DO UPDATE
      SET
        "ownerId" = EXCLUDED."ownerId",
        "currentRunId" = EXCLUDED."currentRunId",
        "leaseExpiresAt" = EXCLUDED."leaseExpiresAt",
        "updatedAt" = EXCLUDED."updatedAt"
      WHERE "fair_play_lifecycle_leases"."leaseExpiresAt" <= ${input.now}
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
        status: 'lease_refused',
        startedAt: input.startedAt,
        finishedAt: new Date(),
        errorSummary: { code: 'LIFECYCLE_LEASE_HELD' },
      },
    });
  }

  private async refreshLease(input: { ownerId: string; runId: string }) {
    const refreshed = await this.prisma.fairPlayLifecycleLease.updateMany({
      where: {
        operationKey: LIFECYCLE_OPERATION_KEY,
        ownerId: input.ownerId,
        currentRunId: input.runId,
      },
      data: { leaseExpiresAt: new Date(Date.now() + LIFECYCLE_LEASE_MILLISECONDS) },
    });
    if (refreshed.count !== 1) {
      throw new Error('Fair Play lifecycle lease was lost before the run completed.');
    }
  }

  private async releaseLease(input: { ownerId: string; runId: string }) {
    await this.prisma.fairPlayLifecycleLease.updateMany({
      where: {
        operationKey: LIFECYCLE_OPERATION_KEY,
        ownerId: input.ownerId,
        currentRunId: input.runId,
      },
      data: { leaseExpiresAt: new Date() },
    });
  }

  private summarizeResults(results: LifecycleResult[]) {
    const failedSteps: Array<{ communityId: string; step: 'ingestion' | 'graduation'; error: string }> = [];
    const communities = results.map((result) => {
      for (const [step, stepResult] of Object.entries({
        ingestion: result.ingestion,
        graduation: result.graduation,
      }) as Array<['ingestion' | 'graduation', LifecycleStepResult]>) {
        if (stepResult.status === 'failed') {
          failedSteps.push({ communityId: result.communityId, step, error: stepResult.error });
        }
      }
      return {
        communityId: result.communityId,
        ingestion: result.ingestion.status,
        graduation: result.graduation.status,
      };
    });
    return { communities, failedSteps };
  }

  private async runStep(run: () => Promise<unknown>): Promise<LifecycleStepResult> {
    try {
      return { status: 'completed', data: await run() };
    } catch (error) {
      return { status: 'failed', error: errorMessage(error) };
    }
  }
}
