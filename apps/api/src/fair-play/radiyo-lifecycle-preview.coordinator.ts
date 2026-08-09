import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FairPlayGraduationService } from './fair-play-graduation.service';
import { FairPlayIngestionService } from './fair-play-ingestion.service';

export const RADIYO_LIFECYCLE_CLOCK = 'RADIYO_LIFECYCLE_CLOCK';

export type RadiyoLifecycleClock = {
  now(): Date;
};

type CityTierCommunity = {
  id: string;
  city: string | null;
  state: string | null;
  musicCommunity: string | null;
};

type LifecycleStageResult =
  | { status: 'previewed'; result: unknown }
  | { status: 'failed'; message: string };

/**
 * Preview-only orchestration for the manual lifecycle services. It deliberately
 * does not claim runs, write lifecycle state, call recurrence, or schedule itself.
 */
@Injectable()
export class RadiyoLifecyclePreviewCoordinator {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ingestionService: FairPlayIngestionService,
    private readonly graduationService: FairPlayGraduationService,
    @Inject(RADIYO_LIFECYCLE_CLOCK) private readonly clock: RadiyoLifecycleClock,
  ) {}

  async runOnce(): Promise<{
    success: true;
    mode: 'preview';
    asOf: string;
    scannedCommunityCount: number;
    communities: Array<{
      community: CityTierCommunity;
      ingestion: LifecycleStageResult;
      graduation: LifecycleStageResult;
      recurrence: { status: 'deferred_no_preview_api' };
    }>;
  }> {
    const asOf = this.toUtcDateOnly(this.clock.now());
    const communities = (await this.prisma.community.findMany({
      where: { tier: 'city', isActive: true },
      select: { id: true, city: true, state: true, musicCommunity: true },
      orderBy: [{ state: 'asc' }, { city: 'asc' }, { musicCommunity: 'asc' }, { id: 'asc' }],
    })) as CityTierCommunity[];

    const results = [];
    for (const community of communities) {
      const ingestion = await this.previewStage(() =>
        this.ingestionService.ingestDueSchedules({
          communityId: community.id,
          asOf,
          dryRun: true,
        }),
      );
      const graduation = await this.previewStage(() =>
        this.graduationService.runGraduation({
          communityId: community.id,
          asOf,
          dryRun: true,
        }),
      );

      results.push({
        community,
        ingestion,
        graduation,
        // Recurrence currently has only a write-capable API and no durable cadence state.
        recurrence: { status: 'deferred_no_preview_api' as const },
      });
    }

    return {
      success: true,
      mode: 'preview',
      asOf,
      scannedCommunityCount: communities.length,
      communities: results,
    };
  }

  private async previewStage(run: () => Promise<unknown>): Promise<LifecycleStageResult> {
    try {
      return { status: 'previewed', result: await run() };
    } catch (error) {
      return {
        status: 'failed',
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private toUtcDateOnly(now: Date): string {
    return now.toISOString().slice(0, 10);
  }
}
