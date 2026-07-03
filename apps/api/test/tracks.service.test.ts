import { BadRequestException } from '@nestjs/common';
import { TracksService } from '../src/tracks/tracks.service';

const mockPrisma = {
  artistBand: {
    findFirst: jest.fn(),
  },
  track: {
    aggregate: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  community: {
    findUnique: jest.fn(),
  },
};

describe('TracksService Release Deck eligibility', () => {
  let service: TracksService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.artistBand.findFirst.mockResolvedValue({
      id: 'artist-band-1',
      name: 'Youngblood QA Source',
      homeSceneId: 'community-1',
    });
    mockPrisma.community.findUnique.mockResolvedValue({ id: 'community-1' });
    mockPrisma.track.count.mockResolvedValue(0);
    mockPrisma.track.aggregate.mockResolvedValue({ _sum: { duration: 0 } });
    service = new TracksService(mockPrisma as any);
  });

  const baseDto = {
    title: 'Release Deck Single',
    artist: 'Manual Artist Label',
    artistBandId: 'artist-band-1',
    duration: 180,
    fileUrl: 'https://cdn.example.com/audio.mp3',
    communityId: 'community-1',
  };

  it('creates source-owned ready tracks at the exact active-slot and duration boundary', async () => {
    const createdTrack = {
      id: 'track-1',
      title: 'Boundary Single',
      artist: 'Youngblood QA Source',
      artistBandId: 'artist-band-1',
      duration: 360,
      fileUrl: 'https://cdn.example.com/audio.mp3',
      communityId: 'community-1',
      status: 'ready',
      uploadedById: 'user-1',
    };
    mockPrisma.track.count.mockResolvedValue(2);
    mockPrisma.track.aggregate.mockResolvedValue({ _sum: { duration: 540 } });
    mockPrisma.track.create.mockResolvedValue(createdTrack);

    const result = await service.createTrack('user-1', {
      ...baseDto,
      title: 'Boundary Single',
      duration: 360,
    });

    expect(mockPrisma.track.count).toHaveBeenCalledWith({
      where: {
        artistBandId: 'artist-band-1',
        communityId: 'community-1',
        status: 'ready',
      },
    });
    expect(mockPrisma.track.aggregate).toHaveBeenCalledWith({
      where: {
        artistBandId: 'artist-band-1',
        communityId: 'community-1',
        status: 'ready',
      },
      _sum: { duration: true },
    });
    expect(mockPrisma.track.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: 'Boundary Single',
        artist: 'Youngblood QA Source',
        artistBandId: 'artist-band-1',
        duration: 360,
        communityId: 'community-1',
        status: 'ready',
      }),
    });
    expect(result).toEqual(createdTrack);
  });

  it('rejects a fourth active music slot for the same source and community', async () => {
    mockPrisma.track.count.mockResolvedValue(3);

    await expect(service.createTrack('user-1', baseDto)).rejects.toThrow(
      'Release Deck allows 3 active music slots per source per community. Choose a different active song combination before adding another track.',
    );

    expect(mockPrisma.track.create).not.toHaveBeenCalled();
  });

  it('rejects source-owned ready tracks longer than six minutes', async () => {
    await expect(
      service.createTrack('user-1', {
        ...baseDto,
        title: 'Overlength Single',
        duration: 361,
      }),
    ).rejects.toThrow('Release Deck tracks cannot exceed 6 minutes');

    expect(mockPrisma.track.count).not.toHaveBeenCalled();
    expect(mockPrisma.track.aggregate).not.toHaveBeenCalled();
    expect(mockPrisma.track.create).not.toHaveBeenCalled();
  });

  it('rejects source-owned ready tracks that would exceed fifteen active minutes', async () => {
    mockPrisma.track.aggregate.mockResolvedValue({ _sum: { duration: 850 } });

    await expect(
      service.createTrack('user-1', {
        ...baseDto,
        title: 'Over Rotation Cap Single',
        duration: 60,
      }),
    ).rejects.toThrow(
      'Release Deck active rotation cap is 15 minutes per source per community. Choose a different active song combination before adding another track.',
    );

    expect(mockPrisma.track.create).not.toHaveBeenCalled();
  });

  it('does not count processing tracks as active music slots or active rotation minutes', async () => {
    const createdTrack = {
      id: 'track-processing',
      title: 'Processing Single',
      artist: 'Youngblood QA Source',
      artistBandId: 'artist-band-1',
      duration: 420,
      fileUrl: 'https://cdn.example.com/audio.mp3',
      communityId: 'community-1',
      status: 'processing',
      uploadedById: 'user-1',
    };
    mockPrisma.track.count.mockResolvedValue(3);
    mockPrisma.track.aggregate.mockResolvedValue({ _sum: { duration: 900 } });
    mockPrisma.track.create.mockResolvedValue(createdTrack);

    const result = await service.createTrack('user-1', {
      ...baseDto,
      title: 'Processing Single',
      duration: 420,
      status: 'processing',
    });

    expect(mockPrisma.track.count).not.toHaveBeenCalled();
    expect(mockPrisma.track.aggregate).not.toHaveBeenCalled();
    expect(mockPrisma.track.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: 'Processing Single',
        artistBandId: 'artist-band-1',
        status: 'processing',
      }),
    });
    expect(result).toEqual(createdTrack);
  });

  it('keeps Release Deck writes scoped to the managed source Home Scene', async () => {
    await expect(
      service.createTrack('user-1', {
        ...baseDto,
        communityId: 'community-2',
      }),
    ).rejects.toThrow(BadRequestException);

    expect(mockPrisma.track.create).not.toHaveBeenCalled();
  });
});
