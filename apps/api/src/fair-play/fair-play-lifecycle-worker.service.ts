import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FairPlayGraduationService } from './fair-play-graduation.service';
import { FairPlayIngestionService } from './fair-play-ingestion.service';

type LifecycleRunOptions = {
  asOf?: string;
  dryRun?: boolean;
};

type LifecycleStepResult =
  | { status: 'completed'; data: unknown }
  | { status: 'failed'; error: string };

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Internal orchestration seam for a later controlled lifecycle runner.
 * It intentionally has no timer, lease, or recurrence scheduling behavior.
 */
@Injectable()
export class FairPlayLifecycleWorkerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ingestionService: FairPlayIngestionService,
    private readonly graduationService: FairPlayGraduationService,
  ) {}

  async runForActiveCityCommunities(options: LifecycleRunOptions = {}) {
    const communities = await this.prisma.community.findMany({
      where: { tier: 'city', isActive: true },
      select: { id: true },
      orderBy: { id: 'asc' },
    });
    const results: Array<{
      communityId: string;
      ingestion: LifecycleStepResult;
      graduation: LifecycleStepResult;
    }> = [];

    for (const community of communities) {
      const request = {
        communityId: community.id,
        ...(options.asOf === undefined ? {} : { asOf: options.asOf }),
        ...(options.dryRun === undefined ? {} : { dryRun: options.dryRun }),
      };
      const ingestion = await this.runStep(() => this.ingestionService.ingestDueSchedules(request));
      const graduation = await this.runStep(() => this.graduationService.runGraduation(request));
      results.push({ communityId: community.id, ingestion, graduation });
    }

    return {
      success: true as const,
      data: {
        activeCityCommunityCount: communities.length,
        failedStepCount: results.reduce(
          (count, result) =>
            count + Number(result.ingestion.status === 'failed') + Number(result.graduation.status === 'failed'),
          0,
        ),
        results,
      },
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
