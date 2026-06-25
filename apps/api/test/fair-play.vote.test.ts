import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
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
  userMusicCommunityPreference: {
    findUnique: jest.fn(),
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

  it('creates vote for GPS-verified pioneer user in fallback voting scene', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      gpsVerified: true,
      tunedSceneId: 'scene-austin-punk',
      homeSceneCity: 'Houston',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.track.findUnique.mockResolvedValue({ id: 'track-1' });
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-austin-punk',
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
      sceneId: 'scene-austin-punk',
      tier: 'city',
      playbackSessionId: 'sess-1',
    });

    const result = await service.castVote('user-1', 'track-1', {
      sceneId: 'scene-austin-punk',
      playbackSessionId: 'sess-1',
      nowPlayingTrackId: 'track-1',
    });

    expect(result.success).toBe(true);
    expect(result.data.sceneId).toBe('scene-austin-punk');
  });

  it('creates vote for GPS-verified user in another registered preference resolved in their verified city', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      gpsVerified: true,
      tunedSceneId: 'scene-austin-punk',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.track.findUnique.mockResolvedValue({ id: 'track-1' });
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-austin-metal',
      tier: 'city',
      isActive: true,
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Metal',
    });
    mockPrisma.rotationEntry.findFirst.mockResolvedValue({ id: 'entry-1' });
    mockPrisma.userMusicCommunityPreference.findUnique.mockResolvedValue({
      id: 'pref-metal',
      userId: 'user-1',
      musicCommunity: 'Metal',
    });
    mockPrisma.trackVote.create.mockResolvedValue({
      id: 'vote-1',
      userId: 'user-1',
      trackId: 'track-1',
      sceneId: 'scene-austin-metal',
      tier: 'city',
      playbackSessionId: 'sess-1',
    });

    const result = await service.castVote('user-1', 'track-1', {
      sceneId: 'scene-austin-metal',
      playbackSessionId: 'sess-1',
      nowPlayingTrackId: 'track-1',
    });

    expect(result.success).toBe(true);
    expect(result.data.sceneId).toBe('scene-austin-metal');
    expect(mockPrisma.userMusicCommunityPreference.findUnique).toHaveBeenCalledWith({
      where: { userId_musicCommunity: { userId: 'user-1', musicCommunity: 'Metal' } },
      select: { id: true },
    });
  });

  it('creates vote for a registered preference in the resolved same-state proxy scene', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      gpsVerified: true,
      tunedSceneId: 'scene-el-paso-punk',
      homeSceneCity: 'El Paso',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.track.findUnique.mockResolvedValue({ id: 'track-1' });
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-austin-metal',
      tier: 'city',
      isActive: true,
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Metal',
    });
    mockPrisma.rotationEntry.findFirst.mockResolvedValue({ id: 'entry-1' });
    mockPrisma.userMusicCommunityPreference.findUnique.mockResolvedValue({
      id: 'pref-metal',
      userId: 'user-1',
      musicCommunity: 'Metal',
    });
    mockPrisma.community.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 'scene-austin-metal',
        tier: 'city',
        isActive: true,
        city: 'Austin',
        state: 'TX',
        musicCommunity: 'Metal',
      });
    mockPrisma.trackVote.create.mockResolvedValue({
      id: 'vote-1',
      userId: 'user-1',
      trackId: 'track-1',
      sceneId: 'scene-austin-metal',
      tier: 'city',
      playbackSessionId: 'sess-1',
    });

    const result = await service.castVote('user-1', 'track-1', {
      sceneId: 'scene-austin-metal',
      playbackSessionId: 'sess-1',
      nowPlayingTrackId: 'track-1',
    });

    expect(result.success).toBe(true);
    expect(result.data.sceneId).toBe('scene-austin-metal');
    expect(mockPrisma.community.findFirst).toHaveBeenNthCalledWith(1, {
      where: { city: 'El Paso', state: 'TX', musicCommunity: 'Metal', tier: 'city', isActive: true },
      select: { id: true },
    });
    expect(mockPrisma.community.findFirst).toHaveBeenNthCalledWith(2, {
      where: { state: 'TX', musicCommunity: 'Metal', tier: 'city', isActive: true },
      select: { id: true },
      orderBy: [{ memberCount: 'desc' }, { name: 'asc' }, { id: 'asc' }],
    });
  });

  it('rejects vote in current city when the music community is not a registered preference', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      gpsVerified: true,
      tunedSceneId: 'scene-austin-punk',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.track.findUnique.mockResolvedValue({ id: 'track-1' });
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-austin-jazz',
      tier: 'city',
      isActive: true,
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Jazz',
    });
    mockPrisma.rotationEntry.findFirst.mockResolvedValue({ id: 'entry-1' });
    mockPrisma.userMusicCommunityPreference.findUnique.mockResolvedValue(null);

    await expect(
      service.castVote('user-1', 'track-1', {
        sceneId: 'scene-austin-jazz',
        playbackSessionId: 'sess-1',
        nowPlayingTrackId: 'track-1',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects vote in a registered preference when the target scene is not the resolved city or proxy scene', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      gpsVerified: true,
      tunedSceneId: 'scene-austin-punk',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.track.findUnique.mockResolvedValue({ id: 'track-1' });
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-dallas-metal',
      tier: 'city',
      isActive: true,
      city: 'Dallas',
      state: 'TX',
      musicCommunity: 'Metal',
    });
    mockPrisma.rotationEntry.findFirst.mockResolvedValue({ id: 'entry-1' });
    mockPrisma.userMusicCommunityPreference.findUnique.mockResolvedValue({
      id: 'pref-metal',
      userId: 'user-1',
      musicCommunity: 'Metal',
    });
    mockPrisma.community.findFirst.mockResolvedValueOnce({
      id: 'scene-austin-metal',
      tier: 'city',
      isActive: true,
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Metal',
    });

    await expect(
      service.castVote('user-1', 'track-1', {
        sceneId: 'scene-dallas-metal',
        playbackSessionId: 'sess-1',
        nowPlayingTrackId: 'track-1',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects voting against non-city tier scenes even when tuned scene matches', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      gpsVerified: true,
      tunedSceneId: 'scene-texas-punk',
      homeSceneCity: 'Austin',
      homeSceneState: 'TX',
      homeSceneCommunity: 'Punk',
    });
    mockPrisma.track.findUnique.mockResolvedValue({ id: 'track-1' });
    mockPrisma.community.findUnique.mockResolvedValue({
      id: 'scene-texas-punk',
      tier: 'state',
      isActive: true,
      city: null,
      state: 'TX',
      musicCommunity: 'Punk',
    });
    mockPrisma.rotationEntry.findFirst.mockResolvedValue({ id: 'entry-1' });

    await expect(
      service.castVote('user-1', 'track-1', {
        sceneId: 'scene-texas-punk',
        playbackSessionId: 'sess-1',
        nowPlayingTrackId: 'track-1',
      }),
    ).rejects.toThrow(BadRequestException);
    expect(mockPrisma.trackVote.create).not.toHaveBeenCalled();
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
