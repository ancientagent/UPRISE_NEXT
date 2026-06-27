import { MusicCommunityPreferenceResolverService } from '../src/users/music-community-preference-resolver.service';

const mockPrisma = {
  userMusicCommunityPreference: {
    findFirst: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

describe('MusicCommunityPreferenceResolverService', () => {
  let service: MusicCommunityPreferenceResolverService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MusicCommunityPreferenceResolverService(mockPrisma as any);
  });

  it('prefers the explicit default music-community preference over the compatibility field', async () => {
    mockPrisma.userMusicCommunityPreference.findFirst.mockResolvedValue({ musicCommunity: 'Metal' });

    const result = await service.resolveDefaultMusicCommunity('user-1', 'Punk');

    expect(result).toBe('Metal');
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('falls back to the supplied compatibility field when no default preference exists', async () => {
    mockPrisma.userMusicCommunityPreference.findFirst.mockResolvedValue(null);

    const result = await service.resolveDefaultMusicCommunity('user-1', ' Punk ');

    expect(result).toBe('Punk');
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('loads the compatibility fallback when it is not supplied', async () => {
    mockPrisma.userMusicCommunityPreference.findFirst.mockResolvedValue(null);
    mockPrisma.user.findUnique.mockResolvedValue({ homeSceneCommunity: 'Jazz' });

    const result = await service.resolveDefaultMusicCommunity('user-1');

    expect(result).toBe('Jazz');
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: { homeSceneCommunity: true },
    });
  });

  it('returns null when neither default preference nor compatibility fallback exists', async () => {
    mockPrisma.userMusicCommunityPreference.findFirst.mockResolvedValue(null);
    mockPrisma.user.findUnique.mockResolvedValue({ homeSceneCommunity: null });

    const result = await service.resolveDefaultMusicCommunity('user-1');

    expect(result).toBeNull();
  });
});
