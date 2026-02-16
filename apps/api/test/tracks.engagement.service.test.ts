import { TracksService } from '../src/tracks/tracks.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

// Mock PrismaService with trackEngagement
const mockPrisma = {
  track: {
    findUnique: jest.fn(),
  },
  trackEngagement: {
    create: jest.fn(),
  },
};

jest.mock('../src/prisma/prisma.service', () => ({
  PrismaService: class {
    constructor() {
      return mockPrisma;
    }
  },
}));

describe('TracksService.recordEngagement', () => {
  let service: TracksService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TracksService(mockPrisma as any);
  });

  it('throws NotFoundException if track does not exist', async () => {
    mockPrisma.track.findUnique.mockResolvedValue(null);

    await expect(
      service.recordEngagement('user-1', 'track-1', { sessionId: 'sess-1', type: 'full' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('creates engagement and returns success for valid engagement', async () => {
    const mockTrack = { id: 'track-1', title: 'Test Track' };
    const mockEngagement = {
      id: 'eng-1',
      userId: 'user-1',
      trackId: 'track-1',
      type: 'full',
      score: 3,
      sessionId: 'sess-1',
    };

    mockPrisma.track.findUnique.mockResolvedValue(mockTrack);
    mockPrisma.trackEngagement.create.mockResolvedValue(mockEngagement);

    const result = await service.recordEngagement('user-1', 'track-1', {
      sessionId: 'sess-1',
      type: 'full',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockEngagement);
  });

  it('throws ConflictException on duplicate session (spam guard)', async () => {
    const mockTrack = { id: 'track-1', title: 'Test Track' };
    mockPrisma.track.findUnique.mockResolvedValue(mockTrack);

    // Simulate unique constraint violation (P2002)
    const duplicateError = new Error('Unique constraint failed') as any;
    duplicateError.code = 'P2002';
    mockPrisma.trackEngagement.create.mockRejectedValue(duplicateError);

    await expect(
      service.recordEngagement('user-1', 'track-1', { sessionId: 'sess-1', type: 'full' }),
    ).rejects.toThrow(ConflictException);
  });

  it('maps all engagement types to correct scores', async () => {
    const mockTrack = { id: 'track-1', title: 'Test Track' };
    mockPrisma.track.findUnique.mockResolvedValue(mockTrack);

    const types = ['full', 'majority', 'partial', 'skip'];
    const expectedScores = [3, 2, 1, 0];

    for (let i = 0; i < types.length; i++) {
      mockPrisma.trackEngagement.create.mockResolvedValueOnce({ score: expectedScores[i] } as any);
      const result = await service.recordEngagement('user-1', 'track-1', {
        sessionId: `sess-${i}`,
        type: types[i] as any,
      });
      expect(result.data.score).toBe(expectedScores[i]);
    }
  });
});
