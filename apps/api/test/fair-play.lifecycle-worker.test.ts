import { FairPlayLifecycleWorkerService } from '../src/fair-play/fair-play-lifecycle-worker.service';

const CITY_AUSTIN = { id: 'city-austin' };
const CITY_DALLAS = { id: 'city-dallas' };

function createWorker(overrides: Record<string, any> = {}) {
  const prisma = {
    $queryRaw: overrides.$queryRaw ?? jest.fn().mockResolvedValue([{ operationKey: 'fair-play-city-tier-lifecycle' }]),
    community: {
      findMany: jest.fn().mockResolvedValue([CITY_AUSTIN, CITY_DALLAS]),
      ...(overrides.community ?? {}),
    },
    fairPlayLifecycleRun: {
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      ...(overrides.fairPlayLifecycleRun ?? {}),
    },
    fairPlayLifecycleLease: {
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      ...(overrides.fairPlayLifecycleLease ?? {}),
    },
    trackEngagement: {
      aggregate: jest.fn(),
      ...(overrides.trackEngagement ?? {}),
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
  it('refuses a live durable lease without calling lifecycle services', async () => {
    const { worker, prisma, ingestionService, graduationService } = createWorker({
      $queryRaw: jest.fn().mockResolvedValue([]),
    });

    await expect(worker.runForActiveCityCommunities()).resolves.toEqual({
      success: false,
      error: {
        code: 'LIFECYCLE_LEASE_HELD',
        message: 'A Fair Play lifecycle run currently owns the durable lease.',
      },
    });
    expect(prisma.fairPlayLifecycleRun.create).not.toHaveBeenCalled();
    expect(prisma.community.findMany).not.toHaveBeenCalled();
    expect(ingestionService.ingestDueSchedules).not.toHaveBeenCalled();
    expect(graduationService.runGraduation).not.toHaveBeenCalled();
  });

  it('acquires an expired durable lease through the atomic query and persists a successful run', async () => {
    const { worker, prisma, ingestionService, graduationService } = createWorker({
      community: { findMany: jest.fn().mockResolvedValue([CITY_AUSTIN]) },
    });

    const result = await worker.runForActiveCityCommunities({
      asOf: '2026-08-16',
      dryRun: false,
      ownerId: 'test-owner',
    });

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    expect(prisma.$queryRaw.mock.calls[0][0].join('')).toContain('ON CONFLICT ("operationKey") DO UPDATE');
    expect(prisma.$queryRaw.mock.calls[0][0].join('')).toContain('"leaseExpiresAt" <=');
    expect(prisma.fairPlayLifecycleRun.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        operationKey: 'fair-play-city-tier-lifecycle',
        ownerId: 'test-owner',
        mode: 'mutation',
        status: 'running',
        id: expect.any(String),
        attemptId: expect.any(String),
      }),
    });
    expect(ingestionService.ingestDueSchedules).toHaveBeenCalledWith({
      communityId: CITY_AUSTIN.id,
      asOf: '2026-08-16',
      dryRun: false,
    });
    expect(graduationService.runGraduation).toHaveBeenCalledWith({
      communityId: CITY_AUSTIN.id,
      asOf: '2026-08-16',
      dryRun: false,
    });
    expect(prisma.fairPlayLifecycleRun.update).toHaveBeenCalledWith({
      where: { id: expect.any(String) },
      data: expect.objectContaining({
        status: 'completed',
        activeCityCommunityCount: 1,
        failedStepCount: 0,
        resultSummary: {
          communities: [
            { communityId: CITY_AUSTIN.id, ingestion: 'completed', graduation: 'completed' },
          ],
          failedSteps: [],
        },
      }),
    });
    expect(prisma.fairPlayLifecycleLease.updateMany).toHaveBeenCalledWith({
      where: expect.objectContaining({
        operationKey: 'fair-play-city-tier-lifecycle',
        ownerId: 'test-owner',
        currentRunId: expect.any(String),
      }),
      data: { leaseExpiresAt: expect.any(Date) },
    });
    expect(result).toMatchObject({
      success: true,
      data: { activeCityCommunityCount: 1, failedStepCount: 0 },
    });
  });

  it('isolates partial failures, records them, and continues later city lifecycle steps', async () => {
    const { worker, prisma, ingestionService, graduationService } = createWorker({
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
    expect(prisma.fairPlayLifecycleRun.update).toHaveBeenCalledWith({
      where: { id: expect.any(String) },
      data: expect.objectContaining({
        status: 'partial_failure',
        activeCityCommunityCount: 2,
        failedStepCount: 1,
        errorSummary: {
          failedSteps: [
            { communityId: CITY_AUSTIN.id, step: 'ingestion', error: 'ingestion unavailable' },
          ],
        },
      }),
    });
    expect(result).toMatchObject({
      success: true,
      data: {
        activeCityCommunityCount: 2,
        failedStepCount: 1,
        results: [
          expect.objectContaining({
            communityId: CITY_AUSTIN.id,
            ingestion: { status: 'failed', error: 'ingestion unavailable' },
          }),
          expect.objectContaining({ communityId: CITY_DALLAS.id }),
        ],
      },
    });
  });

  it('preserves underlying dry-run defaults and never invokes recurrence aggregation', async () => {
    const { worker, prisma, ingestionService, graduationService } = createWorker({
      community: { findMany: jest.fn().mockResolvedValue([CITY_AUSTIN]) },
    });

    await worker.runForActiveCityCommunities();

    expect(ingestionService.ingestDueSchedules).toHaveBeenCalledWith({ communityId: CITY_AUSTIN.id });
    expect(graduationService.runGraduation).toHaveBeenCalledWith({ communityId: CITY_AUSTIN.id });
    expect(prisma.trackEngagement.aggregate).not.toHaveBeenCalled();
  });
});
