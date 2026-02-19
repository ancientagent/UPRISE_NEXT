import { NotFoundException } from '@nestjs/common';
import { RotationPool } from '@prisma/client';
import { FairPlayService } from '../src/fair-play/fair-play.service';

const mockPrisma = {
  fairPlayConfig: {
    findUnique: jest.fn(),
  },
  track: {
    findUnique: jest.fn(),
  },
  community: {
    findUnique: jest.fn(),
  },
  rotationEntry: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  trackEngagement: {
    findMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('FairPlayService.aggregateRecurrenceScores', () => {
  let service: FairPlayService;
  const asOf = new Date('2026-02-19T00:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.fairPlayConfig.findUnique.mockResolvedValue({ recurrenceRollingWindowDays: 14 });
    service = new FairPlayService(mockPrisma as any);
  });

  it('throws NotFoundException if scene does not exist', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);

    await expect(service.aggregateRecurrenceScores('missing-scene', asOf)).rejects.toThrow(NotFoundException);
  });

  it('updates MAIN_ROTATION recurrence scores using 14-day engagement sums', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({ id: 'scene-1' });
    mockPrisma.rotationEntry.findMany.mockResolvedValue([
      { id: 'entry-1', trackId: 'track-1' },
      { id: 'entry-2', trackId: 'track-2' },
    ]);
    mockPrisma.trackEngagement.findMany.mockResolvedValue([
      { trackId: 'track-1', score: 3 },
      { trackId: 'track-1', score: 2 },
      { trackId: 'track-2', score: 1 },
    ]);
    mockPrisma.rotationEntry.update.mockImplementation(({ where, data }: any) => ({
      where,
      data,
    }));
    mockPrisma.$transaction.mockResolvedValue([]);

    const result = await service.aggregateRecurrenceScores('scene-1', asOf);

    expect(result.success).toBe(true);
    expect(result.data.updatedCount).toBe(2);
    expect(mockPrisma.rotationEntry.findMany).toHaveBeenCalledWith({
      where: { sceneId: 'scene-1', pool: RotationPool.MAIN_ROTATION },
      select: { id: true, trackId: true },
    });
    expect(mockPrisma.$transaction).toHaveBeenCalledWith([
      { where: { id: 'entry-1' }, data: { recurrenceScore: 5 } },
      { where: { id: 'entry-2' }, data: { recurrenceScore: 1 } },
    ]);
  });

  it('is idempotent for same inputs', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({ id: 'scene-1' });
    mockPrisma.rotationEntry.findMany.mockResolvedValue([{ id: 'entry-1', trackId: 'track-1' }]);
    mockPrisma.trackEngagement.findMany.mockResolvedValue([{ trackId: 'track-1', score: 3 }]);
    mockPrisma.rotationEntry.update.mockImplementation(({ where, data }: any) => ({
      where,
      data,
    }));
    mockPrisma.$transaction.mockResolvedValue([]);

    await service.aggregateRecurrenceScores('scene-1', asOf);
    await service.aggregateRecurrenceScores('scene-1', asOf);

    expect(mockPrisma.$transaction).toHaveBeenNthCalledWith(1, [
      { where: { id: 'entry-1' }, data: { recurrenceScore: 3 } },
    ]);
    expect(mockPrisma.$transaction).toHaveBeenNthCalledWith(2, [
      { where: { id: 'entry-1' }, data: { recurrenceScore: 3 } },
    ]);
  });
});
