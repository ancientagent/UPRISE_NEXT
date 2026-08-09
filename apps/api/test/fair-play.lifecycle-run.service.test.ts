import { FairPlayLifecycleRunService } from '../src/fair-play/fair-play-lifecycle-run.service';

const LEASE = {
  id: 'run-1',
  jobType: 'release_deck_ingestion',
  communityId: 'community-austin-punk',
  cadenceBucket: '2026-08-02T12:00:00.000Z',
  workerId: 'worker-a',
  leaseToken: 'lease-a',
  leaseExpiresAt: new Date('2026-08-02T12:10:00.000Z'),
  attemptCount: 1,
  status: 'leased',
  claimedAt: new Date('2026-08-02T12:00:00.000Z'),
  completedAt: null,
  failedAt: null,
};

function createHarness(queryResults: unknown[][] = []) {
  const tx = {
    $queryRaw: jest.fn(async () => queryResults.shift() ?? []),
  };
  const prisma = {
    $transaction: jest.fn(async (callback: (client: typeof tx) => unknown) => callback(tx)),
  };
  const ingestion = { applyDueSchedulesInTransaction: jest.fn() };
  const graduation = { applyGraduationInTransaction: jest.fn() };
  const fairPlay = { aggregateRecurrenceScoresInTransaction: jest.fn() };
  return {
    tx,
    prisma,
    ingestion,
    graduation,
    fairPlay,
    service: new FairPlayLifecycleRunService(prisma as any, ingestion as any, graduation as any, fairPlay as any),
  };
}

describe('FairPlayLifecycleRunService', () => {
  it('claims a dispatch bucket only when the database returns the atomic claim row', async () => {
    const { service, tx } = createHarness([[LEASE]]);

    await expect(service.claimDispatch({
      jobType: 'release_deck_ingestion',
      communityId: LEASE.communityId,
      cadenceBucket: LEASE.cadenceBucket,
      workerId: LEASE.workerId,
      leaseDurationSeconds: 300,
    })).resolves.toMatchObject({ id: LEASE.id, leaseToken: LEASE.leaseToken });

    expect(tx.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it('does not claim an already leased or completed dispatch bucket', async () => {
    const { service } = createHarness([[]]);

    await expect(service.claimDispatch({
      jobType: 'new_releases_graduation',
      communityId: LEASE.communityId,
      cadenceBucket: LEASE.cadenceBucket,
      workerId: LEASE.workerId,
      leaseDurationSeconds: 300,
    })).resolves.toBeNull();
  });

  it('derives the recurrence bucket from the latest successful run', async () => {
    const prior = { id: 'completed-run', completedAt: new Date('2026-08-02T12:00:00.000Z') };
    const recurrenceLease = {
      ...LEASE,
      jobType: 'recurrence_recompute',
      cadenceBucket: 'after:completed-run',
    };
    const { service, tx } = createHarness([[{ ...prior, eligible: true }], [recurrenceLease]]);

    await expect(service.claimRecurrence({
      communityId: LEASE.communityId,
      workerId: LEASE.workerId,
      leaseDurationSeconds: 300,
    })).resolves.toMatchObject({ cadenceBucket: 'after:completed-run' });

    expect(tx.$queryRaw).toHaveBeenCalledTimes(2);
  });

  it('rejects recurrence before the database-authoritative 48-hour boundary', async () => {
    const prior = { id: 'completed-run', completedAt: new Date('2026-08-02T12:00:00.000Z') };
    const { service, tx } = createHarness([[{ ...prior, eligible: false }]]);

    await expect(service.claimRecurrence({
      communityId: LEASE.communityId,
      workerId: LEASE.workerId,
      leaseDurationSeconds: 300,
    })).resolves.toBeNull();

    expect(tx.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it('locks a current lease, applies work, and completes within one transaction', async () => {
    const databaseNow = new Date('2026-08-02T12:00:00.000Z');
    const { service, tx } = createHarness([
      [{ databaseNow, communityId: LEASE.communityId }],
      [{ id: LEASE.id }],
    ]);
    const apply = jest.fn(async (_tx, guard) => ({
      value: 'applied',
      resultSummary: { updatedCount: 2 },
    }));

    await expect((service as any).withLease(LEASE, LEASE.jobType, apply)).resolves.toBe('applied');

    expect(apply).toHaveBeenCalledWith(tx, {
      databaseNow,
      communityId: LEASE.communityId,
    });
    expect(tx.$queryRaw).toHaveBeenCalledTimes(2);
  });

  it('does not mask a stale lease with a failure-write attempt', async () => {
    const { service } = createHarness([[], []]);

    await expect((service as any).withLease(LEASE, LEASE.jobType, async () => ({
      value: 'never',
      resultSummary: {},
    }))).rejects.toMatchObject({ response: { error: { message: 'Fair Play lifecycle lease is not current' } } });
  });

  it('uses the guarded transaction seam for recurrence and records only aggregate counts', async () => {
    const databaseNow = new Date('2026-08-02T12:00:00.000Z');
    const { service, fairPlay } = createHarness([
      [{ databaseNow, communityId: LEASE.communityId }],
      [{ id: LEASE.id }],
    ]);
    fairPlay.aggregateRecurrenceScoresInTransaction.mockResolvedValue({
      success: true,
      data: { updatedCount: 3, ignored: 'not persisted' },
    });

    await expect(service.applyRecurrenceWithLease(LEASE)).resolves.toMatchObject({
      data: { updatedCount: 3 },
    });

    expect(fairPlay.aggregateRecurrenceScoresInTransaction).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        sceneId: LEASE.communityId,
        asOf: databaseNow,
        requireActiveCity: true,
      }),
    );
  });

  it('rejects a lease when it is used for the wrong lifecycle stage', async () => {
    const { service, fairPlay } = createHarness([[], []]);

    await expect(service.applyRecurrenceWithLease(LEASE)).rejects.toMatchObject({
      response: { error: { message: 'Fair Play lifecycle lease is not current' } },
    });
    expect(fairPlay.aggregateRecurrenceScoresInTransaction).not.toHaveBeenCalled();
  });
});
