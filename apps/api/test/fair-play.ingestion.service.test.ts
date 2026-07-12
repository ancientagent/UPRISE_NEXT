import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { RotationPool } from '@prisma/client';
import { FairPlayIngestionService } from '../src/fair-play/fair-play-ingestion.service';

const COMMUNITY = {
  id: 'community-austin-punk',
  name: 'Austin Punk',
  city: 'Austin',
  state: 'Texas',
  musicCommunity: 'Punk',
  tier: 'city',
  isActive: true,
};

const DUE_DATE = new Date('2026-07-08T00:00:00.000Z');

function createDueSchedule(overrides: Record<string, any> = {}) {
  return {
    id: 'schedule-1',
    trackId: 'track-1',
    communityId: COMMUNITY.id,
    artistBandId: 'source-1',
    scheduledFor: DUE_DATE,
    status: 'scheduled',
    track: {
      id: 'track-1',
      title: 'New Single',
      duration: 300,
      status: 'ready',
      communityId: COMMUNITY.id,
      artistBandId: 'source-1',
      artistBand: {
        id: 'source-1',
        homeSceneId: COMMUNITY.id,
      },
    },
    ...overrides,
  };
}

function createPrismaMock() {
  return {
    community: {
      findUnique: jest.fn().mockResolvedValue(COMMUNITY),
    },
    releaseDeckSchedule: {
      findMany: jest.fn().mockResolvedValue([createDueSchedule()]),
      update: jest.fn(),
    },
    rotationEntry: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: 'rotation-1',
        trackId: 'track-1',
        sceneId: COMMUNITY.id,
        pool: RotationPool.NEW_RELEASES,
        newWindowDays: 10,
      }),
    },
    fairPlayConfig: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    $transaction: jest.fn(async (callback: any) => callback(createPrismaMockTransaction())),
  };
}

function createPrismaMockTransaction(overrides: Record<string, any> = {}) {
  return {
    community: {
      findUnique: jest.fn().mockResolvedValue(COMMUNITY),
      ...(overrides.community ?? {}),
    },
    releaseDeckSchedule: {
      findUnique: jest.fn().mockResolvedValue(createDueSchedule()),
      update: jest.fn().mockResolvedValue({ id: 'schedule-1', status: 'ingested' }),
      ...(overrides.releaseDeckSchedule ?? {}),
    },
    rotationEntry: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: 'rotation-1',
        trackId: 'track-1',
        sceneId: COMMUNITY.id,
        pool: RotationPool.NEW_RELEASES,
        newWindowDays: 10,
      }),
      ...(overrides.rotationEntry ?? {}),
    },
    fairPlayConfig: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      ...(overrides.fairPlayConfig ?? {}),
    },
  };
}

describe('FairPlayIngestionService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let tx: ReturnType<typeof createPrismaMockTransaction>;
  let service: FairPlayIngestionService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = createPrismaMock();
    tx = createPrismaMockTransaction();
    prisma.$transaction.mockImplementation(async (callback: any) => callback(tx));
    service = new FairPlayIngestionService(prisma as any);
  });

  it('dry-runs due Release Deck schedules without creating rotation entries or reading deprecated band config', async () => {
    const result = await service.ingestDueSchedules({
      communityId: COMMUNITY.id,
      asOf: '2026-07-08',
      dryRun: true,
    });

    expect(result).toMatchObject({
      success: true,
      data: {
        dryRun: true,
        communityId: COMMUNITY.id,
        newWindowDays: 10,
        dueCount: 1,
        ingestedCount: 0,
        skippedCount: 0,
      },
    });
    expect(result.data.results[0]).toMatchObject({
      scheduleId: 'schedule-1',
      trackId: 'track-1',
      action: 'would_ingest',
      newWindowDays: 10,
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(prisma.rotationEntry.create).not.toHaveBeenCalled();
    expect(prisma.releaseDeckSchedule.update).not.toHaveBeenCalled();
    expect(prisma.fairPlayConfig.findUnique).not.toHaveBeenCalled();
    expect(prisma.fairPlayConfig.findFirst).not.toHaveBeenCalled();
  });

  it('ingests due schedules transactionally with a fixed 10-day new-release window', async () => {
    const result = await service.ingestDueSchedules({
      communityId: COMMUNITY.id,
      asOf: '2026-07-08',
      dryRun: false,
    });

    expect(result).toMatchObject({
      success: true,
      data: {
        dryRun: false,
        communityId: COMMUNITY.id,
        newWindowDays: 10,
        ingestedCount: 1,
        skippedCount: 0,
      },
    });
    expect(tx.rotationEntry.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        trackId: 'track-1',
        sceneId: COMMUNITY.id,
        pool: RotationPool.NEW_RELEASES,
        newWindowDays: 10,
      }),
      select: expect.any(Object),
    });
    expect(tx.releaseDeckSchedule.update).toHaveBeenCalledWith({
      where: { id: 'schedule-1' },
      data: { status: 'ingested' },
      select: expect.any(Object),
    });
    expect(tx.fairPlayConfig.findUnique).not.toHaveBeenCalled();
    expect(tx.fairPlayConfig.findFirst).not.toHaveBeenCalled();
  });

  it('uses artistBandId for active source guard instead of display artist name', async () => {
    tx.rotationEntry.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'active-source-entry', trackId: 'other-track' });

    const result = await service.ingestDueSchedules({
      communityId: COMMUNITY.id,
      asOf: '2026-07-08',
      dryRun: false,
    });

    expect(result.data.ingestedCount).toBe(0);
    expect(result.data.skippedCount).toBe(1);
    expect(result.data.results[0]).toMatchObject({
      action: 'skipped',
      reason: 'ACTIVE_SOURCE_NEW_RELEASE_EXISTS',
    });
    expect(tx.rotationEntry.findFirst).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: expect.objectContaining({
          sceneId: COMMUNITY.id,
          pool: RotationPool.NEW_RELEASES,
          track: { artistBandId: 'source-1' },
        }),
      })
    );
    expect(tx.rotationEntry.create).not.toHaveBeenCalled();
    expect(tx.releaseDeckSchedule.update).not.toHaveBeenCalled();
  });

  it('dry-run reports active source blockers without writing', async () => {
    prisma.rotationEntry.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'active-source-entry', trackId: 'other-track' });

    const result = await service.ingestDueSchedules({
      communityId: COMMUNITY.id,
      asOf: '2026-07-08',
      dryRun: true,
    });

    expect(result.data.ingestedCount).toBe(0);
    expect(result.data.skippedCount).toBe(1);
    expect(result.data.results[0]).toMatchObject({
      action: 'skipped',
      reason: 'ACTIVE_SOURCE_NEW_RELEASE_EXISTS',
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(prisma.rotationEntry.create).not.toHaveBeenCalled();
    expect(prisma.releaseDeckSchedule.update).not.toHaveBeenCalled();
  });

  it('does not mark a schedule ingested when rotation creation fails', async () => {
    tx.rotationEntry.create.mockRejectedValueOnce({ code: 'P2002' });

    await expect(
      service.ingestDueSchedules({ communityId: COMMUNITY.id, asOf: '2026-07-08', dryRun: false })
    ).rejects.toThrow(ConflictException);

    expect(tx.releaseDeckSchedule.update).not.toHaveBeenCalled();
  });

  it('skips schedules that fail transaction-time eligibility revalidation', async () => {
    tx.releaseDeckSchedule.findUnique.mockResolvedValueOnce(
      createDueSchedule({ track: { ...createDueSchedule().track, status: 'processing' } })
    );

    const result = await service.ingestDueSchedules({
      communityId: COMMUNITY.id,
      asOf: '2026-07-08',
      dryRun: false,
    });

    expect(result.data.ingestedCount).toBe(0);
    expect(result.data.skippedCount).toBe(1);
    expect(result.data.results[0]).toMatchObject({
      action: 'skipped',
      reason: 'TRACK_NOT_READY',
    });
    expect(tx.rotationEntry.create).not.toHaveBeenCalled();
    expect(tx.releaseDeckSchedule.update).not.toHaveBeenCalled();
  });

  it('skips schedules that are no longer due inside the transaction', async () => {
    tx.releaseDeckSchedule.findUnique.mockResolvedValueOnce(
      createDueSchedule({ scheduledFor: new Date('2026-07-09T00:00:00.000Z') })
    );

    const result = await service.ingestDueSchedules({
      communityId: COMMUNITY.id,
      asOf: '2026-07-08',
      dryRun: false,
    });

    expect(result.data.ingestedCount).toBe(0);
    expect(result.data.skippedCount).toBe(1);
    expect(result.data.results[0]).toMatchObject({
      action: 'skipped',
      reason: 'SCHEDULE_NOT_DUE',
    });
    expect(tx.rotationEntry.create).not.toHaveBeenCalled();
    expect(tx.releaseDeckSchedule.update).not.toHaveBeenCalled();
  });

  it('skips schedules whose stored source no longer matches the track source', async () => {
    tx.releaseDeckSchedule.findUnique.mockResolvedValueOnce(
      createDueSchedule({ artistBandId: 'stale-source' })
    );

    const result = await service.ingestDueSchedules({
      communityId: COMMUNITY.id,
      asOf: '2026-07-08',
      dryRun: false,
    });

    expect(result.data.ingestedCount).toBe(0);
    expect(result.data.skippedCount).toBe(1);
    expect(result.data.results[0]).toMatchObject({
      action: 'skipped',
      reason: 'SCHEDULE_SOURCE_MISMATCH',
    });
    expect(tx.rotationEntry.create).not.toHaveBeenCalled();
    expect(tx.releaseDeckSchedule.update).not.toHaveBeenCalled();
  });

  it('aborts write mode when community is no longer active city-tier inside the transaction', async () => {
    tx.community = {
      findUnique: jest.fn().mockResolvedValue({ id: COMMUNITY.id, tier: 'city', isActive: false }),
    };

    await expect(
      service.ingestDueSchedules({ communityId: COMMUNITY.id, asOf: '2026-07-08', dryRun: false })
    ).rejects.toThrow(BadRequestException);

    expect(tx.rotationEntry.create).not.toHaveBeenCalled();
    expect(tx.releaseDeckSchedule.update).not.toHaveBeenCalled();
  });

  it('requires an active city-tier community', async () => {
    prisma.community.findUnique.mockResolvedValueOnce(null);

    await expect(
      service.ingestDueSchedules({ communityId: 'missing', asOf: '2026-07-08', dryRun: true })
    ).rejects.toThrow(NotFoundException);
  });
});
