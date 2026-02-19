import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { FairPlayService } from '../src/fair-play/fair-play.service';

const mockPrisma = {
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
  },
  trackEngagement: {
    findMany: jest.fn(),
  },
  trackVote: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('FairPlayService.castVote', () => {
  let service: FairPlayService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FairPlayService(mockPrisma as any);
  });

  it('rejects when nowPlayingTrackId does not match route track id', async () => {
    await expect(
      service.castVote('user-1', 'track-1', {
        sceneId: 'scene-1',
        playbackSessionId: 'sess-1',
        nowPlayingTrackId: 'track-2',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects when user is not GPS verified', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      gpsVerified: false,
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.track.findUnique.mockResolvedValue({ id: 'track-1' });
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      tier: 'city',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
    });
    mockPrisma.rotationEntry.findFirst.mockResolvedValue({ id: 'entry-1' });

    await expect(
      service.castVote('user-1', 'track-1', {
        sceneId: 'scene-1',
        playbackSessionId: 'sess-1',
        nowPlayingTrackId: 'track-1',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects when user home scene does not match target scene', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      gpsVerified: true,
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.track.findUnique.mockResolvedValue({ id: 'track-1' });
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      tier: 'city',
      city: 'Los Angeles',
      state: 'CA',
      musicCommunity: 'Punk',
    });
    mockPrisma.rotationEntry.findFirst.mockResolvedValue({ id: 'entry-1' });

    await expect(
      service.castVote('user-1', 'track-1', {
        sceneId: 'scene-1',
        playbackSessionId: 'sess-1',
        nowPlayingTrackId: 'track-1',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('creates vote for GPS-verified user in matching Home Scene', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      gpsVerified: true,
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.track.findUnique.mockResolvedValue({ id: 'track-1' });
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      tier: 'city',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
    });
    mockPrisma.rotationEntry.findFirst.mockResolvedValue({ id: 'entry-1' });
    mockPrisma.trackVote.create.mockResolvedValue({
      id: 'vote-1',
      userId: 'user-1',
      trackId: 'track-1',
      sceneId: 'scene-1',
      tier: 'city',
      playbackSessionId: 'sess-1',
    });

    const result = await service.castVote('user-1', 'track-1', {
      sceneId: 'scene-1',
      playbackSessionId: 'sess-1',
      nowPlayingTrackId: 'track-1',
    });

    expect(result.success).toBe(true);
    expect(result.data.id).toBe('vote-1');
  });

  it('rejects duplicate vote with ConflictException', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      gpsVerified: true,
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.track.findUnique.mockResolvedValue({ id: 'track-1' });
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-1',
      tier: 'city',
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
    });
    mockPrisma.rotationEntry.findFirst.mockResolvedValue({ id: 'entry-1' });
    const duplicate = new Error('Unique constraint failed') as any;
    duplicate.code = 'P2002';
    mockPrisma.trackVote.create.mockRejectedValue(duplicate);

    await expect(
      service.castVote('user-1', 'track-1', {
        sceneId: 'scene-1',
        playbackSessionId: 'sess-1',
        nowPlayingTrackId: 'track-1',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('rejects when scene does not exist', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      gpsVerified: true,
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.track.findUnique.mockResolvedValue({ id: 'track-1' });
    mockPrisma.community.findUnique.mockResolvedValue(null);
    mockPrisma.rotationEntry.findFirst.mockResolvedValue({ id: 'entry-1' });

    await expect(
      service.castVote('user-1', 'track-1', {
        sceneId: 'scene-1',
        playbackSessionId: 'sess-1',
        nowPlayingTrackId: 'track-1',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
