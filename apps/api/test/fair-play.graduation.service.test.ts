import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RotationPool } from '@prisma/client';
import { FairPlayGraduationService } from '../src/fair-play/fair-play-graduation.service';

const COMMUNITY = {
  id: 'community-austin-punk',
  tier: 'city',
  isActive: true,
};

function createEntry(overrides: Record<string, any> = {}) {
  return {
    id: 'rotation-1',
    trackId: 'track-1',
    sceneId: COMMUNITY.id,
    enteredPoolAt: new Date('2026-07-01T00:00:00.000Z'),
    newWindowDays: 10,
    graduatedAt: null,
    ...overrides,
  };
}

function createClient(overrides: Record<string, any> = {}) {
  return {
    community: {
      findUnique: jest.fn().mockResolvedValue(COMMUNITY),
      ...(overrides.community ?? {}),
    },
    fairPlayConfig: {
      findUnique: jest.fn().mockResolvedValue({ recurrenceRollingWindowDays: 14 }),
      ...(overrides.fairPlayConfig ?? {}),
    },
    rotationEntry: {
      findMany: jest.fn().mockResolvedValue([createEntry()]),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      ...(overrides.rotationEntry ?? {}),
    },
    trackEngagement: {
      findMany: jest.fn().mockResolvedValue([]),
      ...(overrides.trackEngagement ?? {}),
    },
  };
}

function createPrismaMock() {
  const tx = createClient();
  const prisma = {
    ...createClient(),
    $transaction: jest.fn(async (callback: any) => callback(tx)),
  };
  return { prisma, tx };
}

describe('FairPlayGraduationService', () => {
  let prisma: ReturnType<typeof createPrismaMock>['prisma'];
  let tx: ReturnType<typeof createPrismaMock>['tx'];
  let service: FairPlayGraduationService;

  beforeEach(() => {
    jest.clearAllMocks();
    ({ prisma, tx } = createPrismaMock());
    service = new FairPlayGraduationService(prisma as any);
  });

  it('dry-runs exact stored-window eligibility and recurrence scoring without writes', async () => {
    prisma.rotationEntry.findMany.mockResolvedValue([
      createEntry(),
      createEntry({
        id: 'rotation-not-due',
        trackId: 'track-2',
        enteredPoolAt: new Date('2026-07-02T00:00:00.000Z'),
      }),
      createEntry({
        id: 'rotation-legacy-time',
        trackId: 'track-3',
        enteredPoolAt: new Date('2026-07-01T12:00:00.000Z'),
      }),
      createEntry({ id: 'rotation-invalid-window', trackId: 'track-4', newWindowDays: 0 }),
      createEntry({
        id: 'rotation-invalid-state',
        trackId: 'track-5',
        graduatedAt: new Date('2026-07-10T00:00:00.000Z'),
      }),
    ]);
    prisma.trackEngagement.findMany.mockResolvedValue([
      { trackId: 'track-1', score: 3 },
      { trackId: 'track-1', score: 2 },
    ]);

    const result = await service.runGraduation({
      communityId: COMMUNITY.id,
      asOf: '2026-07-11',
      dryRun: true,
    });

    expect(result).toMatchObject({
      success: true,
      data: {
        dryRun: true,
        asOf: '2026-07-11',
        recurrenceRollingWindowDays: 14,
        scannedCount: 5,
        eligibleCount: 1,
        graduatedCount: 0,
        wouldGraduateCount: 1,
        skippedCount: 4,
      },
    });
    expect(result.data.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rotationEntryId: 'rotation-1',
          action: 'would_graduate',
          eligibleAt: '2026-07-11T00:00:00.000Z',
          initialRecurrenceScore: 5,
        }),
        expect.objectContaining({
          rotationEntryId: 'rotation-not-due',
          action: 'skipped',
          reason: 'NOT_DUE',
        }),
        expect.objectContaining({
          rotationEntryId: 'rotation-legacy-time',
          action: 'skipped',
          reason: 'NOT_DUE',
        }),
        expect.objectContaining({
          rotationEntryId: 'rotation-invalid-window',
          action: 'skipped',
          reason: 'INVALID_NEW_WINDOW_DAYS',
        }),
        expect.objectContaining({
          rotationEntryId: 'rotation-invalid-state',
          action: 'skipped',
          reason: 'INVALID_GRADUATION_STATE',
        }),
      ]),
    );
    expect(prisma.trackEngagement.findMany).toHaveBeenCalledWith({
      where: {
        trackId: { in: ['track-1'] },
        createdAt: {
          gte: new Date('2026-06-27T00:00:00.000Z'),
          lte: new Date('2026-07-11T00:00:00.000Z'),
        },
      },
      select: { trackId: true, score: true },
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(prisma.rotationEntry.updateMany).not.toHaveBeenCalled();
  });

  it('graduates due entries transactionally with a conditional rotation-only update', async () => {
    tx.trackEngagement.findMany.mockResolvedValue([{ trackId: 'track-1', score: 3 }]);

    const result = await service.runGraduation({
      communityId: COMMUNITY.id,
      asOf: '2026-07-11',
      dryRun: false,
    });

    expect(result.data).toMatchObject({
      dryRun: false,
      eligibleCount: 1,
      graduatedCount: 1,
      wouldGraduateCount: 0,
      skippedCount: 0,
    });
    expect(result.data.results[0]).toMatchObject({
      action: 'graduated',
      initialRecurrenceScore: 3,
    });
    expect(tx.rotationEntry.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'rotation-1',
        sceneId: COMMUNITY.id,
        pool: RotationPool.NEW_RELEASES,
        enteredPoolAt: new Date('2026-07-01T00:00:00.000Z'),
        newWindowDays: 10,
        graduatedAt: null,
      },
      data: {
        pool: RotationPool.MAIN_ROTATION,
        graduatedAt: new Date('2026-07-11T00:00:00.000Z'),
        recurrenceScore: 3,
      },
    });
    expect((tx as any).trackVote).toBeUndefined();
    expect((tx as any).releaseDeckSchedule).toBeUndefined();
    expect((tx as any).track).toBeUndefined();
  });

  it('reports a deterministic skip when a concurrent run changes the entry first', async () => {
    tx.rotationEntry.updateMany.mockResolvedValueOnce({ count: 0 });

    const result = await service.runGraduation({
      communityId: COMMUNITY.id,
      asOf: '2026-07-11',
      dryRun: false,
    });

    expect(result.data.graduatedCount).toBe(0);
    expect(result.data.skippedCount).toBe(1);
    expect(result.data.results[0]).toMatchObject({
      action: 'skipped',
      reason: 'NO_LONGER_ELIGIBLE',
    });
  });

  it('revalidates active city-tier community state inside write transaction', async () => {
    tx.community.findUnique.mockResolvedValueOnce({ id: COMMUNITY.id, tier: 'city', isActive: false });

    await expect(
      service.runGraduation({ communityId: COMMUNITY.id, asOf: '2026-07-11', dryRun: false }),
    ).rejects.toThrow(BadRequestException);

    expect(tx.rotationEntry.findMany).not.toHaveBeenCalled();
    expect(tx.rotationEntry.updateMany).not.toHaveBeenCalled();
  });

  it('defaults recurrence to the existing 14-day window and score to zero', async () => {
    prisma.fairPlayConfig.findUnique.mockResolvedValueOnce(null);

    const result = await service.runGraduation({
      communityId: COMMUNITY.id,
      asOf: '2026-07-11',
      dryRun: true,
    });

    expect(result.data.recurrenceRollingWindowDays).toBe(14);
    expect(result.data.results[0]).toMatchObject({
      action: 'would_graduate',
      initialRecurrenceScore: 0,
    });
  });

  it('requires an existing active city-tier community', async () => {
    prisma.community.findUnique.mockResolvedValueOnce(null);
    await expect(
      service.runGraduation({ communityId: 'missing', asOf: '2026-07-11', dryRun: true }),
    ).rejects.toThrow(NotFoundException);

    prisma.community.findUnique.mockResolvedValueOnce({ id: COMMUNITY.id, tier: 'state', isActive: true });
    await expect(
      service.runGraduation({ communityId: COMMUNITY.id, asOf: '2026-07-11', dryRun: true }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects missing community ids and impossible dates', async () => {
    await expect(service.runGraduation({ communityId: '', dryRun: true })).rejects.toThrow(
      BadRequestException,
    );
    await expect(
      service.runGraduation({ communityId: COMMUNITY.id, asOf: '2026-02-30', dryRun: true }),
    ).rejects.toThrow(BadRequestException);
    expect(prisma.community.findUnique).not.toHaveBeenCalled();
  });
});
