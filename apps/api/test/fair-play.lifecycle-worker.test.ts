import { FairPlayLifecycleWorkerService } from '../src/fair-play/fair-play-lifecycle-worker.service';

const CITY_AUSTIN = { id: 'city-austin' };
const CITY_DALLAS = { id: 'city-dallas' };
const DATABASE_NOW = new Date('2026-08-16T23:58:00.000Z');

function queryResult(strings: TemplateStringsArray) {
  const sql = strings.join('');
  if (sql.includes('SELECT CURRENT_TIMESTAMP')) return Promise.resolve([{ now: DATABASE_NOW }]);
  return Promise.resolve([{ operationKey: 'fair-play-city-tier-lifecycle' }]);
}

function createWorker(overrides: Record<string, any> = {}) {
  const transaction = {
    $queryRaw: overrides.transactionQueryRaw ?? jest.fn(queryResult),
    fairPlayLifecycleRun: {
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      ...(overrides.transactionRun ?? {}),
    },
  };
  const prisma = {
    $queryRaw: overrides.$queryRaw ?? jest.fn(queryResult),
    $transaction: overrides.$transaction ?? jest.fn(async (callback: any) => callback(transaction)),
    community: {
      findMany: jest.fn().mockResolvedValue([CITY_AUSTIN, CITY_DALLAS]),
      ...(overrides.community ?? {}),
    },
    fairPlayLifecycleRun: {
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
    transaction,
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
  it('never creates a durable live lease when run-attempt creation fails', async () => {
    const { worker, transaction, prisma, ingestionService, graduationService } = createWorker({
      transactionRun: { create: jest.fn().mockRejectedValue(new Error('run persistence unavailable')) },
    });

    await expect(worker.runForActiveCityCommunities()).rejects.toThrow('run persistence unavailable');

    const attemptedSql = transaction.$queryRaw.mock.calls.map(([strings]: [TemplateStringsArray]) => strings.join(''));
    expect(attemptedSql.some((sql: string) => sql.includes('INSERT INTO "fair_play_lifecycle_leases"'))).toBe(false);
    expect(prisma.community.findMany).not.toHaveBeenCalled();
    expect(ingestionService.ingestDueSchedules).not.toHaveBeenCalled();
    expect(graduationService.runGraduation).not.toHaveBeenCalled();
  });

  it('records a refused attempt atomically without calling lifecycle services', async () => {
    const transactionQueryRaw = jest.fn((strings: TemplateStringsArray) => {
      const sql = strings.join('');
      if (sql.includes('SELECT CURRENT_TIMESTAMP')) return Promise.resolve([{ now: DATABASE_NOW }]);
      if (sql.includes('INSERT INTO "fair_play_lifecycle_leases"')) return Promise.resolve([]);
      return Promise.resolve([{ operationKey: 'fair-play-city-tier-lifecycle' }]);
    });
    const { worker, transaction, prisma, ingestionService, graduationService } = createWorker({
      transactionQueryRaw,
    });

    await expect(worker.runForActiveCityCommunities()).resolves.toMatchObject({
      success: false,
      error: { code: 'LIFECYCLE_LEASE_HELD' },
    });
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(transaction.fairPlayLifecycleRun.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ status: 'RUNNING', startedAt: DATABASE_NOW }),
    });
    expect(transaction.fairPlayLifecycleRun.update).toHaveBeenCalledWith({
      where: { id: expect.any(String) },
      data: expect.objectContaining({ status: 'LEASE_REFUSED', finishedAt: DATABASE_NOW }),
    });
    expect(ingestionService.ingestDueSchedules).not.toHaveBeenCalled();
    expect(graduationService.runGraduation).not.toHaveBeenCalled();
  });

  it('commits RUNNING run creation with the database-time conditional lease claim', async () => {
    const { worker, transaction, prisma, ingestionService, graduationService } = createWorker({
      community: { findMany: jest.fn().mockResolvedValue([CITY_AUSTIN]) },
    });

    const result = await worker.runForActiveCityCommunities({
      asOf: '2026-08-16',
      dryRun: false,
      ownerId: 'test-owner',
    });

    const acquisitionSql = transaction.$queryRaw.mock.calls
      .map(([strings]: [TemplateStringsArray]) => strings.join(''))
      .find((sql: string) => sql.includes('INSERT INTO "fair_play_lifecycle_leases"'));
    expect(acquisitionSql).toContain('CURRENT_TIMESTAMP');
    expect(acquisitionSql).toContain('ON CONFLICT ("operationKey") DO UPDATE');
    expect(acquisitionSql).toContain('"leaseExpiresAt" <= CURRENT_TIMESTAMP');
    expect(transaction.fairPlayLifecycleRun.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        operationKey: 'fair-play-city-tier-lifecycle',
        ownerId: 'test-owner',
        mode: 'MUTATION',
        status: 'RUNNING',
      }),
    });
    expect(ingestionService.ingestDueSchedules).toHaveBeenCalledWith({
      communityId: CITY_AUSTIN.id,
      asOf: '2026-08-16',
      dryRun: false,
      lifecycleLease: expect.objectContaining({ ownerId: 'test-owner', runId: expect.any(String) }),
    });
    expect(graduationService.runGraduation).toHaveBeenCalledWith({
      communityId: CITY_AUSTIN.id,
      asOf: '2026-08-16',
      dryRun: false,
      lifecycleLease: expect.objectContaining({ ownerId: 'test-owner', runId: expect.any(String) }),
    });
    expect(prisma.fairPlayLifecycleRun.update).toHaveBeenCalledWith({
      where: { id: expect.any(String) },
      data: expect.objectContaining({ status: 'COMPLETED' }),
    });
    expect(result).toMatchObject({ success: true, data: { activeCityCommunityCount: 1 } });
  });

  it('isolates ordinary partial failures and continues later city lifecycle steps', async () => {
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
      data: expect.objectContaining({ status: 'PARTIAL_FAILURE', failedStepCount: 1 }),
    });
    expect(result).toMatchObject({ success: true, data: { failedStepCount: 1 } });
  });

  it('uses one database-derived UTC asOf across every city when the caller omits it', async () => {
    const { worker, ingestionService, graduationService } = createWorker();

    await worker.runForActiveCityCommunities();

    for (const service of [ingestionService.ingestDueSchedules, graduationService.runGraduation]) {
      expect(service).toHaveBeenNthCalledWith(1, expect.objectContaining({
        communityId: CITY_AUSTIN.id,
        asOf: '2026-08-16',
      }));
      expect(service).toHaveBeenNthCalledWith(2, expect.objectContaining({
        communityId: CITY_DALLAS.id,
        asOf: '2026-08-16',
      }));
    }
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
