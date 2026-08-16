import { FairPlayLifecycleWorkerService } from '../src/fair-play/fair-play-lifecycle-worker.service';

const CITY_AUSTIN = { id: 'city-austin' };
const CITY_DALLAS = { id: 'city-dallas' };

function createWorker(overrides: Record<string, any> = {}) {
  const prisma = {
    community: {
      findMany: jest.fn().mockResolvedValue([CITY_AUSTIN, CITY_DALLAS]),
      ...(overrides.community ?? {}),
    },
  };
  const ingestionService = {
    ingestDueSchedules: jest.fn().mockResolvedValue({ success: true, data: { ingestedCount: 0 } }),
    ...(overrides.ingestionService ?? {}),
  };
  const graduationService = {
    runGraduation: jest.fn().mockResolvedValue({ success: true, data: { graduatedCount: 0 } }),
    ...(overrides.graduationService ?? {}),
  };

  return {
    prisma,
    ingestionService,
    graduationService,
    worker: new FairPlayLifecycleWorkerService(
      prisma as any,
      ingestionService as any,
      graduationService as any,
    ),
  };
}

describe('FairPlayLifecycleWorkerService', () => {
  it('runs ingestion and graduation for active city-tier communities only', async () => {
    const { worker, prisma, ingestionService, graduationService } = createWorker();

    const result = await worker.runForActiveCityCommunities({ asOf: '2026-08-16', dryRun: false });

    expect(prisma.community.findMany).toHaveBeenCalledWith({
      where: { tier: 'city', isActive: true },
      select: { id: true },
      orderBy: { id: 'asc' },
    });
    expect(ingestionService.ingestDueSchedules).toHaveBeenNthCalledWith(1, {
      communityId: CITY_AUSTIN.id,
      asOf: '2026-08-16',
      dryRun: false,
    });
    expect(ingestionService.ingestDueSchedules).toHaveBeenNthCalledWith(2, {
      communityId: CITY_DALLAS.id,
      asOf: '2026-08-16',
      dryRun: false,
    });
    expect(graduationService.runGraduation).toHaveBeenNthCalledWith(1, {
      communityId: CITY_AUSTIN.id,
      asOf: '2026-08-16',
      dryRun: false,
    });
    expect(graduationService.runGraduation).toHaveBeenNthCalledWith(2, {
      communityId: CITY_DALLAS.id,
      asOf: '2026-08-16',
      dryRun: false,
    });
    expect(result).toMatchObject({
      success: true,
      data: { activeCityCommunityCount: 2, failedStepCount: 0 },
    });
  });

  it('preserves the underlying services defaults when no run options are supplied', async () => {
    const { worker, ingestionService, graduationService } = createWorker({
      community: { findMany: jest.fn().mockResolvedValue([CITY_AUSTIN]) },
    });

    await worker.runForActiveCityCommunities();

    expect(ingestionService.ingestDueSchedules).toHaveBeenCalledWith({ communityId: CITY_AUSTIN.id });
    expect(graduationService.runGraduation).toHaveBeenCalledWith({ communityId: CITY_AUSTIN.id });
  });

  it('isolates a failed lifecycle step and continues subsequent steps and communities', async () => {
    const { worker, ingestionService, graduationService } = createWorker({
      ingestionService: {
        ingestDueSchedules: jest
          .fn()
          .mockRejectedValueOnce(new Error('ingestion unavailable'))
          .mockResolvedValueOnce({ success: true, data: { ingestedCount: 1 } }),
      },
    });

    const result = await worker.runForActiveCityCommunities({ dryRun: true });

    expect(graduationService.runGraduation).toHaveBeenCalledTimes(2);
    expect(ingestionService.ingestDueSchedules).toHaveBeenCalledTimes(2);
    expect(result.data.failedStepCount).toBe(1);
    expect(result.data.results).toEqual([
      expect.objectContaining({
        communityId: CITY_AUSTIN.id,
        ingestion: { status: 'failed', error: 'ingestion unavailable' },
        graduation: expect.objectContaining({ status: 'completed' }),
      }),
      expect.objectContaining({
        communityId: CITY_DALLAS.id,
        ingestion: expect.objectContaining({ status: 'completed' }),
        graduation: expect.objectContaining({ status: 'completed' }),
      }),
    ]);
  });

  it('returns an empty result without calling lifecycle services when no active city communities exist', async () => {
    const { worker, ingestionService, graduationService } = createWorker({
      community: { findMany: jest.fn().mockResolvedValue([]) },
    });

    await expect(worker.runForActiveCityCommunities({ dryRun: true })).resolves.toEqual({
      success: true,
      data: { activeCityCommunityCount: 0, failedStepCount: 0, results: [] },
    });
    expect(ingestionService.ingestDueSchedules).not.toHaveBeenCalled();
    expect(graduationService.runGraduation).not.toHaveBeenCalled();
  });
});
