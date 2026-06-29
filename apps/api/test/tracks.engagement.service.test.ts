import { TracksService } from '../src/tracks/tracks.service';
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';

// Mock PrismaService with trackEngagement
const mockPrisma = {
  artistBand: {
    findFirst: jest.fn(),
  },
  track: {
    findUnique: jest.fn(),
    aggregate: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
  community: {
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

describe('TracksService.createTrack', () => {
  let service: TracksService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.track.aggregate.mockResolvedValue({
      _sum: {
        duration: 0,
      },
    });
    mockPrisma.track.count.mockResolvedValue(0);
    service = new TracksService(mockPrisma as any);
  });

  it('creates a track with uploadedById from the authenticated user', async () => {
    const createdTrack = {
      id: 'track-1',
      title: 'QA Song',
      artist: 'QA Artist',
      duration: 181,
      fileUrl: 'https://example.com/audio.mp3',
      uploadedById: 'user-1',
      communityId: 'community-1',
      status: 'ready',
    };

    mockPrisma.community.findUnique.mockResolvedValue({ id: 'community-1' });
    mockPrisma.artistBand.findFirst.mockResolvedValue({
      id: 'artist-band-1',
      name: 'Youngblood QA Source',
      homeSceneId: 'community-1',
    });
    mockPrisma.track.create.mockResolvedValue(createdTrack);

    const result = await service.createTrack('user-1', {
      title: 'QA Song',
      artist: 'QA Artist',
      artistBandId: 'artist-band-1',
      duration: 181,
      fileUrl: 'https://example.com/audio.mp3',
      communityId: 'community-1',
    });

    expect(mockPrisma.track.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: 'QA Song',
        artist: 'Youngblood QA Source',
        artistBandId: 'artist-band-1',
        duration: 181,
        fileUrl: 'https://example.com/audio.mp3',
        uploadedById: 'user-1',
        communityId: 'community-1',
        status: 'ready',
      }),
    });
    expect(result).toEqual(createdTrack);
  });

  it('throws NotFoundException when communityId does not resolve', async () => {
    mockPrisma.community.findUnique.mockResolvedValue(null);

    await expect(
      service.createTrack('user-1', {
        title: 'QA Song',
        artist: 'QA Artist',
        duration: 181,
        fileUrl: 'https://example.com/audio.mp3',
        communityId: 'community-1',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException when artistBandId is not managed by the signed-in user', async () => {
    mockPrisma.artistBand.findFirst.mockResolvedValue(null);

    await expect(
      service.createTrack('user-1', {
        title: 'QA Song',
        artist: 'QA Artist',
        artistBandId: 'artist-band-1',
        duration: 181,
        fileUrl: 'https://example.com/audio.mp3',
        communityId: 'community-1',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects ready Release Deck tracks that would exceed 15 active minutes for the source in one community', async () => {
    mockPrisma.artistBand.findFirst.mockResolvedValue({
      id: 'artist-band-1',
      name: 'Youngblood QA Source',
      homeSceneId: 'community-1',
    });
    mockPrisma.community.findUnique.mockResolvedValue({ id: 'community-1' });
    mockPrisma.track.aggregate.mockResolvedValue({
      _sum: {
        duration: 850,
      },
    });

    await expect(
      service.createTrack('user-1', {
        title: 'Too Long For Rotation',
        artist: 'QA Artist',
        artistBandId: 'artist-band-1',
        duration: 181,
        fileUrl: 'https://example.com/audio.mp3',
        communityId: 'community-1',
      }),
    ).rejects.toThrow(BadRequestException);

    expect(mockPrisma.track.aggregate).toHaveBeenCalledWith({
      where: {
        artistBandId: 'artist-band-1',
        communityId: 'community-1',
        status: 'ready',
      },
      _sum: {
        duration: true,
      },
    });
    expect(mockPrisma.track.create).not.toHaveBeenCalled();
  });

  it('rejects a fourth ready Release Deck music slot for the source in one community', async () => {
    mockPrisma.artistBand.findFirst.mockResolvedValue({
      id: 'artist-band-1',
      name: 'Youngblood QA Source',
      homeSceneId: 'community-1',
    });
    mockPrisma.community.findUnique.mockResolvedValue({ id: 'community-1' });
    mockPrisma.track.count.mockResolvedValue(3);

    await expect(
      service.createTrack('user-1', {
        title: 'Fourth Active Song',
        artist: 'QA Artist',
        artistBandId: 'artist-band-1',
        duration: 181,
        fileUrl: 'https://example.com/audio.mp3',
        communityId: 'community-1',
      }),
    ).rejects.toThrow(BadRequestException);

    expect(mockPrisma.track.count).toHaveBeenCalledWith({
      where: {
        artistBandId: 'artist-band-1',
        communityId: 'community-1',
        status: 'ready',
      },
    });
    expect(mockPrisma.track.create).not.toHaveBeenCalled();
  });

  it('does not count processing tracks as active Release Deck music slots', async () => {
    const createdTrack = {
      id: 'track-processing',
      title: 'Processing Song',
      artist: 'Youngblood QA Source',
      duration: 181,
      fileUrl: 'https://example.com/audio.mp3',
      uploadedById: 'user-1',
      communityId: 'community-1',
      status: 'processing',
    };

    mockPrisma.community.findUnique.mockResolvedValue({ id: 'community-1' });
    mockPrisma.artistBand.findFirst.mockResolvedValue({
      id: 'artist-band-1',
      name: 'Youngblood QA Source',
      homeSceneId: 'community-1',
    });
    mockPrisma.track.count.mockResolvedValue(3);
    mockPrisma.track.aggregate.mockResolvedValue({
      _sum: {
        duration: 900,
      },
    });
    mockPrisma.track.create.mockResolvedValue(createdTrack);

    const result = await service.createTrack('user-1', {
      title: 'Processing Song',
      artist: 'QA Artist',
      artistBandId: 'artist-band-1',
      duration: 181,
      fileUrl: 'https://example.com/audio.mp3',
      communityId: 'community-1',
      status: 'processing',
    });

    expect(mockPrisma.track.count).not.toHaveBeenCalled();
    expect(mockPrisma.track.aggregate).not.toHaveBeenCalled();
    expect(mockPrisma.track.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: 'Processing Song',
        artist: 'Youngblood QA Source',
        artistBandId: 'artist-band-1',
        communityId: 'community-1',
        status: 'processing',
      }),
    });
    expect(result).toEqual(createdTrack);
  });
});
