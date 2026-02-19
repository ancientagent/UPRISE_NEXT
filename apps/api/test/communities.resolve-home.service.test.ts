import { CommunitiesService } from '../src/communities/communities.service';

describe('CommunitiesService.resolveHomeCommunity', () => {
  const mockPrisma = {
    community: { findFirst: jest.fn() },
  };

  let service: CommunitiesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CommunitiesService(mockPrisma as any);
  });

  it('returns matching city-tier community for exact tuple', async () => {
    mockPrisma.community.findFirst.mockResolvedValue({
      id: 'c1',
      name: 'Austin Punk',
      slug: 'austin-punk',
      memberCount: 120,
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
    });

    const result = await service.resolveHomeCommunity({
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
    });

    expect(result?.id).toBe('c1');
    expect(mockPrisma.community.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { city: 'Austin', state: 'TX', musicCommunity: 'Punk', tier: 'city' },
      }),
    );
  });

  it('returns null when no match exists', async () => {
    mockPrisma.community.findFirst.mockResolvedValue(null);

    const result = await service.resolveHomeCommunity({
      city: 'Unknown',
      state: 'XX',
      musicCommunity: 'Punk',
    });

    expect(result).toBeNull();
  });
});
