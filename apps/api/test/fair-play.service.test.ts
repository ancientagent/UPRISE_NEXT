import { ConflictException, NotFoundException } from '@nestjs/common';
import { RotationPool } from '@prisma/client';
import { FairPlayService } from '../src/fair-play/fair-play.service';

const mockPrisma = {
  track: {
    findUnique: jest.fn(),
  },
  community: {
    findUnique: jest.fn(),
  },
  rotationEntry: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

describe('FairPlayService.ingestNewRelease', () => {
  let service: FairPlayService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FairPlayService(mockPrisma as any);
  });

  it('creates a NEW_RELEASES entry for a valid track and scene', async () => {
    mockPrisma.track.findUnique.mockResolvedValue({ id: 'track-1', artist: 'artist-a' });
    mockPrisma.community.findUnique.mockResolvedValue({ id: 'scene-1' });
    mockPrisma.rotationEntry.findFirst.mockResolvedValue(null);
    mockPrisma.rotationEntry.create.mockResolvedValue({
      id: 'entry-1',
      trackId: 'track-1',
      sceneId: 'scene-1',
      pool: RotationPool.NEW_RELEASES,
    });

    const result = await service.ingestNewRelease('track-1', 'scene-1');

    expect(result.success).toBe(true);
    expect(result.data.pool).toBe(RotationPool.NEW_RELEASES);
    expect(mockPrisma.rotationEntry.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          trackId: 'track-1',
          sceneId: 'scene-1',
          pool: RotationPool.NEW_RELEASES,
        }),
      }),
    );
  });

  it('throws NotFoundException when track does not exist', async () => {
    mockPrisma.track.findUnique.mockResolvedValue(null);

    await expect(service.ingestNewRelease('missing-track', 'scene-1')).rejects.toThrow(NotFoundException);
  });

  it('throws ConflictException when artist already has active new release in scene', async () => {
    mockPrisma.track.findUnique.mockResolvedValue({ id: 'track-2', artist: 'artist-a' });
    mockPrisma.community.findUnique.mockResolvedValue({ id: 'scene-1' });
    mockPrisma.rotationEntry.findFirst.mockResolvedValue({ id: 'entry-1', trackId: 'track-1' });

    await expect(service.ingestNewRelease('track-2', 'scene-1')).rejects.toThrow(ConflictException);
  });
});
