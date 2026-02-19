import { NotFoundException } from '@nestjs/common';
import { RotationPool } from '@prisma/client';
import { FairPlayService } from '../src/fair-play/fair-play.service';

const mockPrisma = {
  track: {
    findUnique: jest.fn(),
  },
  community: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
  },
  user: {
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
  trackVote: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('FairPlayService.getRotation', () => {
  let service: FairPlayService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FairPlayService(mockPrisma as any);
  });

  it('throws NotFoundException when scene is missing', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);

    await expect(service.getRotation('missing-scene')).rejects.toThrow(NotFoundException);
  });

  it('returns ordered pools and meta counts', async () => {
    mockPrisma.community.findUnique.mockResolvedValue({ id: 'scene-1' });
    mockPrisma.rotationEntry.findMany
      .mockResolvedValueOnce([
        {
          id: 'new-1',
          track: { id: 'track-new-1', title: 'New 1' },
          enteredPoolAt: new Date('2026-02-01T00:00:00Z'),
        },
        {
          id: 'new-2',
          track: { id: 'track-new-2', title: 'New 2' },
          enteredPoolAt: new Date('2026-02-02T00:00:00Z'),
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'main-1',
          track: { id: 'track-main-1', title: 'Main 1' },
          recurrenceScore: 12,
          enteredPoolAt: new Date('2026-01-01T00:00:00Z'),
        },
        {
          id: 'main-2',
          track: { id: 'track-main-2', title: 'Main 2' },
          recurrenceScore: 5,
          enteredPoolAt: new Date('2026-01-02T00:00:00Z'),
        },
      ]);

    const result = await service.getRotation('scene-1');

    expect(result.success).toBe(true);
    expect(result.data.newReleases.map((t: any) => t.id)).toEqual(['track-new-1', 'track-new-2']);
    expect(result.data.mainRotation.map((t: any) => t.id)).toEqual(['track-main-1', 'track-main-2']);
    expect(result.meta.sceneId).toBe('scene-1');
    expect(result.meta.newReleasesCount).toBe(2);
    expect(result.meta.mainRotationCount).toBe(2);

    expect(mockPrisma.rotationEntry.findMany).toHaveBeenNthCalledWith(1, {
      where: { sceneId: 'scene-1', pool: RotationPool.NEW_RELEASES },
      orderBy: { enteredPoolAt: 'asc' },
      include: { track: true },
    });
    expect(mockPrisma.rotationEntry.findMany).toHaveBeenNthCalledWith(2, {
      where: { sceneId: 'scene-1', pool: RotationPool.MAIN_ROTATION },
      orderBy: [{ recurrenceScore: 'desc' }, { enteredPoolAt: 'asc' }],
      include: { track: true },
    });
  });
});

describe('FairPlayService.getActiveRotation', () => {
  let service: FairPlayService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FairPlayService(mockPrisma as any);
  });

  it('uses tuned scene id when present', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      tunedSceneId: 'scene-tuned',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.community.findUnique.mockResolvedValueOnce({ id: 'scene-tuned' });
    mockPrisma.rotationEntry.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const result = await service.getActiveRotation('u1');

    expect(result.success).toBe(true);
    expect(result.meta.sceneId).toBe('scene-tuned');
    expect(mockPrisma.community.findFirst).toHaveBeenCalledTimes(1);
  });

  it('falls back to home scene when tuned scene id is absent', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      tunedSceneId: null,
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.community.findFirst.mockResolvedValue({ id: 'scene-home' });
    mockPrisma.community.findUnique.mockResolvedValueOnce({ id: 'scene-home' });
    mockPrisma.rotationEntry.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const result = await service.getActiveRotation('u1');

    expect(result.success).toBe(true);
    expect(result.meta.sceneId).toBe('scene-home');
  });

  it('throws NotFoundException when user does not exist', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(service.getActiveRotation('missing-user')).rejects.toThrow(NotFoundException);
  });
});
