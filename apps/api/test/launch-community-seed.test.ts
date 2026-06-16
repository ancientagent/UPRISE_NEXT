import launchMatrix from '../../../docs/specs/seed/launch-community-city-matrix.json';
import {
  SYSTEM_COMMUNITY_SEED_OWNER,
  buildLaunchCommunitySeedRecords,
  ensureLaunchCommunitySeedOwner,
  seedLaunchCommunities,
  slugifyLaunchCommunity,
  validateLaunchCommunityMatrix,
} from '../src/seed/launch-community-seed';

describe('launch community seed helpers', () => {
  it('expands the launch matrix into the expected 48 city-tier scene records', () => {
    const records = buildLaunchCommunitySeedRecords(launchMatrix);

    expect(records).toHaveLength(48);
    expect(records[0]).toEqual({
      name: 'Austin, Texas Punk',
      slug: 'home-scene-austin-texas-punk',
      description: 'City-tier Home Scene for Punk in Austin, Texas.',
      city: 'Austin',
      state: 'Texas',
      musicCommunity: 'Punk',
      tier: 'city',
      isActive: true,
      isPrivate: false,
    });
    expect(records.at(-1)).toEqual(
      expect.objectContaining({
        name: 'San Diego, California Hip-Hop',
        slug: 'home-scene-san-diego-california-hip-hop',
        city: 'San Diego',
        state: 'California',
        musicCommunity: 'Hip-Hop',
        tier: 'city',
        isActive: true,
      })
    );
  });

  it('normalizes launch scene slugs without collapsing the city/state/community tuple', () => {
    expect(slugifyLaunchCommunity('San Diego', 'California', 'Spoken Word / Poetry')).toBe(
      'home-scene-san-diego-california-spoken-word-poetry'
    );
  });

  it('rejects matrix files whose expected count no longer matches generated tuples', () => {
    expect(() =>
      validateLaunchCommunityMatrix({
        ...launchMatrix,
        expectedCityTierSceneCount: 47,
      })
    ).toThrow('Launch community matrix expected 47 city-tier scenes but generated 48');
  });

  it('defines a deterministic non-listener system owner for seeded launch communities', () => {
    expect(SYSTEM_COMMUNITY_SEED_OWNER).toEqual({
      email: 'system-community-seed@uprise.local',
      username: 'uprise-community-seed',
      displayName: 'UPRISE Community Seed',
      password: 'SYSTEM_ACCOUNT_NO_LOGIN',
      bio: 'System owner for deterministic launch Home Scene seed records.',
    });
  });
});

describe('launch community Prisma seed runner', () => {
  function createMockPrisma() {
    return {
      user: {
        upsert: jest.fn().mockResolvedValue({ id: 'system-user-1' }),
      },
      community: {
        findFirst: jest.fn(),
        update: jest.fn().mockResolvedValue({ id: 'existing-community-1' }),
        create: jest.fn().mockResolvedValue({ id: 'new-community-1' }),
      },
    };
  }

  it('upserts the deterministic system owner user', async () => {
    const prisma = createMockPrisma();

    const owner = await ensureLaunchCommunitySeedOwner(prisma as any);

    expect(owner).toEqual({ id: 'system-user-1' });
    expect(prisma.user.upsert).toHaveBeenCalledWith({
      where: { email: SYSTEM_COMMUNITY_SEED_OWNER.email },
      update: {
        username: SYSTEM_COMMUNITY_SEED_OWNER.username,
        displayName: SYSTEM_COMMUNITY_SEED_OWNER.displayName,
        bio: SYSTEM_COMMUNITY_SEED_OWNER.bio,
      },
      create: SYSTEM_COMMUNITY_SEED_OWNER,
      select: { id: true },
    });
  });

  it('updates existing tuple matches and creates only missing launch communities', async () => {
    const prisma = createMockPrisma();
    prisma.community.findFirst
      .mockResolvedValueOnce({ id: 'existing-austin-punk' })
      .mockResolvedValueOnce(null);

    const result = await seedLaunchCommunities(prisma as any, {
      matrix: {
        ...launchMatrix,
        cities: launchMatrix.cities.slice(0, 1),
        musicCommunities: launchMatrix.musicCommunities.slice(0, 2),
        expectedCityTierSceneCount: 2,
      },
    });

    expect(result).toEqual({ ownerId: 'system-user-1', created: 1, updated: 1, total: 2 });
    expect(prisma.community.findFirst).toHaveBeenNthCalledWith(1, {
      where: { city: 'Austin', state: 'Texas', musicCommunity: 'Punk', tier: 'city' },
      select: { id: true },
    });
    expect(prisma.community.update).toHaveBeenCalledWith({
      where: { id: 'existing-austin-punk' },
      data: expect.objectContaining({
        name: 'Austin, Texas Punk',
        slug: 'home-scene-austin-texas-punk',
        city: 'Austin',
        state: 'Texas',
        musicCommunity: 'Punk',
        tier: 'city',
        isActive: true,
      }),
    });
    expect(prisma.community.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: 'Austin, Texas Electronic',
        slug: 'home-scene-austin-texas-electronic',
        city: 'Austin',
        state: 'Texas',
        musicCommunity: 'Electronic',
        tier: 'city',
        isActive: true,
        createdById: 'system-user-1',
      }),
    });
  });
});
