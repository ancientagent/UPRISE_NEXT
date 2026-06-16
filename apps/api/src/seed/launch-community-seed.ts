export const SYSTEM_COMMUNITY_SEED_OWNER = {
  email: 'system-community-seed@uprise.local',
  username: 'uprise-community-seed',
  displayName: 'UPRISE Community Seed',
  password: 'SYSTEM_ACCOUNT_NO_LOGIN',
  bio: 'System owner for deterministic launch Home Scene seed records.',
} as const;

export interface LaunchCommunityMatrixCity {
  city: string;
  state: string;
  launchOpen?: boolean;
}

export interface LaunchCommunityMatrix {
  cities: LaunchCommunityMatrixCity[];
  musicCommunities: string[];
  expectedCityTierSceneCount: number;
}

export interface LaunchCommunitySeedRecord {
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  musicCommunity: string;
  tier: 'city';
  isActive: boolean;
  isPrivate: boolean;
}

export interface LaunchCommunitySeedResult {
  ownerId: string;
  created: number;
  updated: number;
  total: number;
}

interface LaunchCommunitySeedPrisma {
  user: {
    upsert(args: {
      where: { email: string };
      update: {
        username: string;
        displayName: string;
        bio: string;
      };
      create: typeof SYSTEM_COMMUNITY_SEED_OWNER;
      select: { id: true };
    }): Promise<{ id: string }>;
  };
  community: {
    findFirst(args: {
      where: { city: string; state: string; musicCommunity: string; tier: 'city' };
      select: { id: true };
    }): Promise<{ id: string } | null>;
    update(args: { where: { id: string }; data: LaunchCommunitySeedRecord }): Promise<unknown>;
    create(args: { data: LaunchCommunitySeedRecord & { createdById: string } }): Promise<unknown>;
  };
}

export function slugifyLaunchCommunity(
  city: string,
  state: string,
  musicCommunity: string
): string {
  const slug = `${city}-${state}-${musicCommunity}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `home-scene-${slug}`;
}

export function buildLaunchCommunitySeedRecords(
  matrix: LaunchCommunityMatrix
): LaunchCommunitySeedRecord[] {
  validateLaunchCommunityMatrix(matrix);

  const launchCities = matrix.cities.filter((city) => city.launchOpen !== false);
  return launchCities.flatMap((city) =>
    matrix.musicCommunities.map((musicCommunity) => ({
      name: `${city.city}, ${city.state} ${musicCommunity}`,
      slug: slugifyLaunchCommunity(city.city, city.state, musicCommunity),
      description: `City-tier Home Scene for ${musicCommunity} in ${city.city}, ${city.state}.`,
      city: city.city,
      state: city.state,
      musicCommunity,
      tier: 'city' as const,
      isActive: true,
      isPrivate: false,
    }))
  );
}

export function validateLaunchCommunityMatrix(matrix: LaunchCommunityMatrix): void {
  const launchCityCount = matrix.cities.filter((city) => city.launchOpen !== false).length;
  const generatedCount = launchCityCount * matrix.musicCommunities.length;

  if (generatedCount !== matrix.expectedCityTierSceneCount) {
    throw new Error(
      `Launch community matrix expected ${matrix.expectedCityTierSceneCount} city-tier scenes but generated ${generatedCount}`
    );
  }
}

export async function ensureLaunchCommunitySeedOwner(
  prisma: LaunchCommunitySeedPrisma
): Promise<{ id: string }> {
  return prisma.user.upsert({
    where: { email: SYSTEM_COMMUNITY_SEED_OWNER.email },
    update: {
      username: SYSTEM_COMMUNITY_SEED_OWNER.username,
      displayName: SYSTEM_COMMUNITY_SEED_OWNER.displayName,
      bio: SYSTEM_COMMUNITY_SEED_OWNER.bio,
    },
    create: SYSTEM_COMMUNITY_SEED_OWNER,
    select: { id: true },
  });
}

export async function seedLaunchCommunities(
  prisma: LaunchCommunitySeedPrisma,
  options: { matrix: LaunchCommunityMatrix }
): Promise<LaunchCommunitySeedResult> {
  const owner = await ensureLaunchCommunitySeedOwner(prisma);
  const records = buildLaunchCommunitySeedRecords(options.matrix);
  let created = 0;
  let updated = 0;

  for (const record of records) {
    const existing = await prisma.community.findFirst({
      where: {
        city: record.city,
        state: record.state,
        musicCommunity: record.musicCommunity,
        tier: record.tier,
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.community.update({ where: { id: existing.id }, data: record });
      updated += 1;
      continue;
    }

    await prisma.community.create({ data: { ...record, createdById: owner.id } });
    created += 1;
  }

  return { ownerId: owner.id, created, updated, total: records.length };
}
