import { PrismaClient, RotationPool } from '@prisma/client';
import { FairPlayLifecycleRunService } from '../src/fair-play/fair-play-lifecycle-run.service';
import { FairPlayService } from '../src/fair-play/fair-play.service';

const testDatabaseUrl = process.env.UPRISE_TEST_DATABASE_URL;

function assertLocalTestDatabase(url: string) {
  const parsed = new URL(url);
  const hostIsLocal = ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname);
  const databaseIsReserved = parsed.pathname.replace(/^\//, '').startsWith('uprise_test');
  if (!hostIsLocal || !databaseIsReserved) {
    throw new Error(
      'UPRISE_TEST_DATABASE_URL must target a localhost/loopback database named uprise_test*',
    );
  }
}

if (testDatabaseUrl) assertLocalTestDatabase(testDatabaseUrl);

const describeWithLocalTestDatabase = testDatabaseUrl ? describe : describe.skip;

describeWithLocalTestDatabase('FairPlayLifecycleRunService real Postgres safety', () => {
  let firstClient: PrismaClient;
  let secondClient: PrismaClient;
  const suffix = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const userId = `lifecycle-user-${suffix}`;
  const communityId = `lifecycle-community-${suffix}`;
  const trackId = `lifecycle-track-${suffix}`;

  let firstFairPlay: FairPlayService;
  let secondFairPlay: FairPlayService;
  let firstService: FairPlayLifecycleRunService;
  let secondService: FairPlayLifecycleRunService;

  beforeAll(async () => {
    firstClient = new PrismaClient({ datasources: { db: { url: testDatabaseUrl! } } });
    secondClient = new PrismaClient({ datasources: { db: { url: testDatabaseUrl! } } });
    firstFairPlay = new FairPlayService(firstClient as any);
    secondFairPlay = new FairPlayService(secondClient as any);
    firstService = new FairPlayLifecycleRunService(
      firstClient as any,
      {} as any,
      {} as any,
      firstFairPlay,
    );
    secondService = new FairPlayLifecycleRunService(
      secondClient as any,
      {} as any,
      {} as any,
      secondFairPlay,
    );
    await firstClient.user.create({
      data: {
        id: userId,
        email: `lifecycle-${suffix}@example.test`,
        username: `lifecycle_${suffix}`,
        displayName: 'Lifecycle Test User',
        password: 'test-only',
      },
    });
    await firstClient.community.create({
      data: {
        id: communityId,
        name: 'Lifecycle Test Community',
        slug: `lifecycle-test-${suffix}`,
        description: 'Dedicated local lifecycle test fixture',
        createdById: userId,
        city: 'Austin',
        state: 'Texas',
        musicCommunity: 'Punk',
        tier: 'city',
        isActive: true,
      },
    });
    await firstClient.track.create({
      data: {
        id: trackId,
        title: 'Lifecycle Test Track',
        artist: 'Lifecycle Test Artist',
        duration: 180,
        fileUrl: 'https://example.test/lifecycle-test.mp3',
        uploadedById: userId,
        communityId,
        status: 'ready',
      },
    });
    await firstClient.rotationEntry.create({
      data: {
        trackId,
        sceneId: communityId,
        pool: RotationPool.MAIN_ROTATION,
        enteredPoolAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    });
    await firstClient.trackEngagement.create({
      data: {
        userId,
        trackId,
        type: 'full',
        score: 3,
        sessionId: `lifecycle-session-${suffix}`,
      },
    });
  });

  afterAll(async () => {
    await firstClient.trackEngagement.deleteMany({ where: { trackId } });
    await firstClient.rotationEntry.deleteMany({ where: { trackId } });
    await firstClient.track.deleteMany({ where: { id: trackId } });
    await firstClient.fairPlayLifecycleRun.deleteMany({ where: { communityId } });
    await firstClient.community.deleteMany({ where: { id: communityId } });
    await firstClient.user.deleteMany({ where: { id: userId } });
    await Promise.all([firstClient.$disconnect(), secondClient.$disconnect()]);
  });

  it('permits one concurrent dispatch claim and fences an expired lease', async () => {
    const input = {
      jobType: 'release_deck_ingestion' as const,
      communityId,
      cadenceBucket: '2026-08-02T12:00:00.000Z',
      workerId: 'worker-a',
      leaseDurationSeconds: 300,
    };
    const [first, second] = await Promise.all([
      firstService.claimDispatch(input),
      secondService.claimDispatch({ ...input, workerId: 'worker-b' }),
    ]);
    const winner = first ?? second;
    expect([first, second].filter(Boolean)).toHaveLength(1);
    expect(winner).not.toBeNull();

    await firstClient.fairPlayLifecycleRun.update({
      where: { id: winner!.id },
      data: { leaseExpiresAt: new Date('2020-01-01T00:00:00.000Z') },
    });
    const reclaimed = await secondService.claimDispatch({ ...input, workerId: 'worker-b' });
    expect(reclaimed?.leaseToken).not.toBe(winner!.leaseToken);

    await expect((firstService as any).withLease(winner!, winner!.jobType, async () => ({
      value: 'stale',
      resultSummary: {},
    }))).rejects.toThrow('Fair Play lifecycle lease is not current');
  });

  it('rolls back recurrence scores when completion fails, then commits both on success', async () => {
    const firstLease = await firstService.claimRecurrence({
      communityId,
      workerId: 'worker-recurrence-a',
      leaseDurationSeconds: 300,
    });
    expect(firstLease).not.toBeNull();

    await expect((firstService as any).withLease(firstLease!, firstLease!.jobType, async (tx, guard) => {
      await firstFairPlay.aggregateRecurrenceScoresInTransaction(tx, {
        sceneId: communityId,
        asOf: guard.databaseNow,
        requireActiveCity: true,
      });
      throw new Error('injected completion fault');
    })).rejects.toThrow('injected completion fault');

    const afterFault = await firstClient.rotationEntry.findUniqueOrThrow({
      where: { trackId_sceneId: { trackId, sceneId: communityId } },
      select: { recurrenceScore: true },
    });
    expect(afterFault.recurrenceScore).toBe(0);

    const retryLease = await secondService.claimRecurrence({
      communityId,
      workerId: 'worker-recurrence-b',
      leaseDurationSeconds: 300,
    });
    expect(retryLease?.cadenceBucket).toBe('initial');
    await (secondService as any).withLease(retryLease!, retryLease!.jobType, async (tx, guard) => {
      const value = await secondFairPlay.aggregateRecurrenceScoresInTransaction(tx, {
        sceneId: communityId,
        asOf: guard.databaseNow,
        requireActiveCity: true,
      });
      return { value, resultSummary: { updatedCount: value.data.updatedCount } };
    });

    const afterSuccess = await firstClient.rotationEntry.findUniqueOrThrow({
      where: { trackId_sceneId: { trackId, sceneId: communityId } },
      select: { recurrenceScore: true },
    });
    expect(afterSuccess.recurrenceScore).toBe(3);
    await expect(firstService.claimRecurrence({
      communityId,
      workerId: 'worker-recurrence-c',
      leaseDurationSeconds: 300,
    })).resolves.toBeNull();
  });
});
