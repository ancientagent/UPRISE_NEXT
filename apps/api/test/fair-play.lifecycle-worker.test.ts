import { FairPlayLifecycleWorkerService } from '../src/fair-play/fair-play-lifecycle-worker.service';

const CITY_AUSTIN = { id: 'city-austin' };
const CITY_DALLAS = { id: 'city-dallas' };
const DATABASE_NOW = new Date('2026-08-16T23:58:00.000Z');

function defaultQueryRaw(strings: TemplateStringsArray) {
  const sql = strings.join('');
  if (sql.includes('SELECT CURRENT_TIMESTAMP')) {
    return Promise.resolve([{ now: DATABASE_NOW }]);
  }
  return Promise.resolve([{ operationKey: 'fair-play-city-tier-lifecycle' }]);
}

function createWorker(overrides: Record<string, any> = {}) {
  const prisma = {
    $queryRaw: overrides.$queryRaw ?? jest.fn(defaultQueryRaw),
    community: {
      findMany: jest.fn().mockResolvedValue([CITY_AUSTIN, CITY_DALLAS]),
      ...(overrides.community ?? {}),
    },
    fairPlayLifecycleRun: {
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      ...(overrides.fairPlayLifecycleRun ?? {}),
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
    const $queryRaw = jest.fn((strings: TemplateStringsArray) => {
      const sql = strings.join('');
      if (sql.includes('SELECT CURRENT_TIMESTAMP')) return Promise.resolve([{ now: DATABASE_NOW }]);
      if (sql.includes('INSERT INTO "fair_play_lifecycle_leases"')) return Promise.resolve([]);
      return Promise.resolve([{ operationKey: 'fair-play-city-tier-lifecycle' }]);
    });
    const { worker, prisma, ingestionService, graduationService } = createWorker({ $queryRaw });

    await expect(worker.runForActiveCityCommunities()).resolves.toEqual({
      success: false,
      error: {
        code: 'LIFECYCLE_LEASE_HELD',
        message: 'A Fair Play lifecycle run currently owns the durable lease.',
      },
    });
    expect(prisma.fairPlayLifecycleRun.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        operationKey: 'fair-play-city-tier-lifecycle',
        mode: 'DRY_RUN',
        status: 'LEASE_REFUSED',
        finishedAt: DATABASE_NOW,
        errorSummary: { code: 'LIFECYCLE_LEASE_HELD' },
      }),
    });
    expect(prisma.community.findMany).not.toHaveBeenCalled();
    expect(ingestionService.ingestDueSchedules).not.toHaveBeenCalled();
    expect(graduationService.runGraduation).not.toHaveBeenCalled();
  });

  it('acquires only through database-time conditional ownership and persists a successful run', async () => {
    const { worker, prisma, ingestionService, graduationService } = createWorker({
      community: { findMany: jest.fn().mockResolvedValue([CITY_AUSTIN]) },
    });

    const result = await worker.runForActiveCityCommunities({
      asOf: '2026-08-16',
      dryRun: false,
      ownerId: 'test-owner',
    });

    const acquisitionSql = prisma.$queryRaw.mock.calls
      .map(([strings]: [TemplateStringsArray]) => strings.join(''))
      .find((sql: string) => sql.includes('INSERT INTO "fair_play_lifecycle_leases"'));
    expect(acquisitionSql).toContain('CURRENT_TIMESTAMP');
    expect(acquisitionSql).toContain('ON CONFLICT ("operationKey") DO UPDATE');
    expect(acquisitionSql).toContain('"leaseExpiresAt" <= CURRENT_TIMESTAMP');
    expect(prisma.fairPlayLifecycleRun.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        operationKey: 'fair-play-city-tier-lifecycle',
        ownerId: 'test-owner',
        mode: 'MUTATION',
        status: 'RUNNING',
        startedAt: DATABASE_NOW,
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
        status: 'COMPLETED',
        activeCityCommunityCount: 1,
        failedStepCount: 0,
        resultSummary: expect.objectContaining({
          totalCommunityCount: 1,
          totalFailedStepCount: 0,
        }),
      }),
    });
    expect(result).toMatchObject({
      success: true,
      data: { activeCityCommunityCount: 1, failedStepCount: 0 },
    });
  });

  it('checks database-backed lease ownership before every lifecycle step and stops after lease loss', async () => {
    let lifecycleLeaseUpdateCount = 0;
    const $queryRaw = jest.fn((strings: TemplateStringsArray) => {
      const sql = strings.join('');
      if (sql.includes('SELECT CURRENT_TIMESTAMP')) return Promise.resolve([{ now: DATABASE_NOW }]);
      if (sql.includes('INSERT INTO "fair_play_lifecycle_leases"')) {
        return Promise.resolve([{ operationKey: 'fair-play-city-tier-lifecycle' }]);
      }
      if (sql.includes('UPDATE "fair_play_lifecycle_leases"')) {
        lifecycleLeaseUpdateCount += 1;
        return Promise.resolve(
          lifecycleLeaseUpdateCount === 2 ? [] : [{ operationKey: 'fair-play-city-tier-lifecycle' }],
        );
      }
      return Promise.resolve([]);
    });
    const { worker, prisma, ingestionService, graduationService } = createWorker({ $queryRaw });

    await expect(worker.runForActiveCityCommunities({ dryRun: false })).resolves.toMatchObject({
      success: false,
      error: { code: 'LIFECYCLE_RUN_FAILED' },
    });

    expect(ingestionService.ingestDueSchedules).toHaveBeenCalledTimes(1);
    expect(graduationService.runGraduation).not.toHaveBeenCalled();
    expect(ingestionService.ingestDueSchedules).toHaveBeenCalledWith({
      communityId: CITY_AUSTIN.id,
      asOf: '2026-08-16',
      dryRun: false,
    });
    const refreshSql = prisma.$queryRaw.mock.calls
      .map(([strings]: [TemplateStringsArray]) => strings.join(''))
      .find((sql: string) => sql.includes('"leaseExpiresAt" > CURRENT_TIMESTAMP'));
    expect(refreshSql).toContain('"leaseExpiresAt" > CURRENT_TIMESTAMP');
    expect(prisma.fairPlayLifecycleRun.update).toHaveBeenCalledWith({
      where: { id: expect.any(String) },
      data: expect.objectContaining({ status: 'FAILED' }),
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
        status: 'PARTIAL_FAILURE',
        activeCityCommunityCount: 2,
        failedStepCount: 1,
        errorSummary: {
          failedSteps: [
            { communityId: CITY_AUSTIN.id, step: 'ingestion', error: 'ingestion unavailable' },
          ],
          omittedFailedStepCount: 0,
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

  it('uses one database-derived UTC asOf across every city when the caller omits it', async () => {
    const { worker, ingestionService, graduationService } = createWorker();

    await worker.runForActiveCityCommunities();

    expect(ingestionService.ingestDueSchedules).toHaveBeenNthCalledWith(1, {
      communityId: CITY_AUSTIN.id,
      asOf: '2026-08-16',
    });
    expect(graduationService.runGraduation).toHaveBeenNthCalledWith(1, {
      communityId: CITY_AUSTIN.id,
      asOf: '2026-08-16',
    });
    expect(ingestionService.ingestDueSchedules).toHaveBeenNthCalledWith(2, {
      communityId: CITY_DALLAS.id,
      asOf: '2026-08-16',
    });
    expect(graduationService.runGraduation).toHaveBeenNthCalledWith(2, {
      communityId: CITY_DALLAS.id,
      asOf: '2026-08-16',
    });
  });

  it('bounds stored per-community and failed-step summary detail while retaining aggregate counts', () => {
    const { worker } = createWorker();
    const results = Array.from({ length: 30 }, (_, index) => ({
      communityId: `city-${index}`,
      ingestion: { status: 'failed' as const, error: `error-${index}` },
      graduation: { status: 'failed' as const, error: `graduation-${index}` },
    }));

    const summary = (worker as any).summarizeResults(results, 60);

    expect(summary).toMatchObject({
      communitySummaryLimit: 25,
      failedStepSummaryLimit: 25,
      totalCommunityCount: 30,
      omittedCommunityCount: 5,
      totalFailedStepCount: 60,
      omittedFailedStepCount: 35,
    });
    expect(summary.communities).toHaveLength(25);
    expect(summary.failedSteps).toHaveLength(25);
  });

  it('never invokes recurrence aggregation', async () => {
    const { worker, prisma } = createWorker({
      community: { findMany: jest.fn().mockResolvedValue([CITY_AUSTIN]) },
    });

    await worker.runForActiveCityCommunities();

    expect(prisma.trackEngagement.aggregate).not.toHaveBeenCalled();
  });
});
