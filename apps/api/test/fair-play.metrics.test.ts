import { NotFoundException } from '@nestjs/common';
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
  user: {
    findUnique: jest.fn(),
  },
  rotationEntry: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
  },
  trackEngagement: {
    findMany: jest.fn(),
  },
  trackVote: {
    create: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('FairPlayService.getMetrics', () => {
  let service: FairPlayService;
  const asOf = new Date('2026-02-20T00:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.fairPlayConfig.findUnique.mockResolvedValue({ recurrenceRollingWindowDays: 14 });
    service = new FairPlayService(mockPrisma as any);
  });

  it('throws NotFoundException when scene is missing', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);

    await expect(service.getMetrics('missing-scene', asOf)).rejects.toThrow(NotFoundException);
  });

  it('returns scene metrics and recurrence summary', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({ id: 'scene-1' });
    mockPrisma.rotationEntry.count
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(12);
    mockPrisma.rotationEntry.aggregate.mockResolvedValue({
      _avg: { recurrenceScore: 2.5 },
      _min: { recurrenceScore: 0.5 },
      _max: { recurrenceScore: 9.75 },
    });
    mockPrisma.trackVote.count.mockResolvedValue(22);

    const result = await service.getMetrics('scene-1', asOf);

    expect(result.success).toBe(true);
    expect(result.data.sceneId).toBe('scene-1');
    expect(result.data.activeNewCount).toBe(4);
    expect(result.data.mainRotationCount).toBe(12);
    expect(result.data.recurrence).toEqual({
      avg: 2.5,
      min: 0.5,
      max: 9.75,
    });
    expect(result.data.recurrenceRollingWindowDays).toBe(14);
    expect(result.data.votesInWindow).toBe(22);
  });
});
