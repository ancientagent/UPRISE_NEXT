import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = process.env.UPRISE_ARTIST_FIXTURE_PASSWORD || 'ArtistFixture123!';
const DEFAULT_COUNT = 10;

const ARTIST_FIXTURE_ROSTER = [
  { displayName: 'Signal Static', stageName: 'Signal Static' },
  { displayName: 'Neon Mercy', stageName: 'Neon Mercy' },
  { displayName: 'Ash Echo', stageName: 'Ash Echo' },
  { displayName: 'Voltage Youth', stageName: 'Voltage Youth' },
  { displayName: 'Cinder Bloom', stageName: 'Cinder Bloom' },
  { displayName: 'Southside Relay', stageName: 'Southside Relay' },
  { displayName: 'Hollow Anthem', stageName: 'Hollow Anthem' },
  { displayName: 'Midnight Lease', stageName: 'Midnight Lease' },
  { displayName: 'Rust Choir', stageName: 'Rust Choir' },
  { displayName: 'Velvet Circuit', stageName: 'Velvet Circuit' },
];

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith('--')) continue;
    const key = value.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      args[key] = next;
      index += 1;
    } else {
      args[key] = 'true';
    }
  }
  return args;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

async function resolveCityScene({ communityId, city, state, musicCommunity }) {
  if (communityId) {
    const exact = await prisma.community.findUnique({
      where: { id: communityId },
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        musicCommunity: true,
        tier: true,
      },
    });

    if (!exact) {
      throw new Error(`Community ${communityId} not found`);
    }
    if (exact.tier !== 'city') {
      throw new Error(`Community ${communityId} is ${exact.tier}; artist fixtures require a city-tier community`);
    }
    return exact;
  }

  const preferredCity = city ?? 'Austin';
  const preferredState = state ?? 'TX';
  const preferredMusicCommunity = musicCommunity ?? 'Punk';

  const preferred = await prisma.community.findFirst({
    where: {
      city: preferredCity,
      state: preferredState,
      musicCommunity: preferredMusicCommunity,
      tier: 'city',
    },
    select: {
      id: true,
      name: true,
      city: true,
      state: true,
      musicCommunity: true,
      tier: true,
    },
  });

  if (preferred) return preferred;

  const fallback = await prisma.community.findFirst({
    where: { tier: 'city' },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      city: true,
      state: true,
      musicCommunity: true,
      tier: true,
    },
  });

  if (!fallback) {
    throw new Error('No city-tier community exists to attach artist fixtures');
  }

  return fallback;
}

async function upsertFixtureUser({ entry, index, passwordHash, scene, domain }) {
  const suffix = String(index + 1).padStart(2, '0');
  const username = `${slugify(entry.stageName).replace(/-/g, '')}${suffix}`.slice(0, 30);
  const email = `${slugify(entry.stageName).replace(/-/g, '.')}+${suffix}@${domain}`;

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      username,
      displayName: entry.displayName,
      password: passwordHash,
      bio: `${entry.stageName} fixture account for local community QA.`,
      city: scene.city ?? undefined,
      homeSceneCity: scene.city ?? undefined,
      homeSceneState: scene.state ?? undefined,
      homeSceneCommunity: scene.musicCommunity ?? undefined,
      collectionDisplayEnabled: true,
    },
    create: {
      email,
      username,
      displayName: entry.displayName,
      password: passwordHash,
      bio: `${entry.stageName} fixture account for local community QA.`,
      city: scene.city ?? undefined,
      homeSceneCity: scene.city ?? undefined,
      homeSceneState: scene.state ?? undefined,
      homeSceneCommunity: scene.musicCommunity ?? undefined,
      collectionDisplayEnabled: true,
      gpsVerified: false,
    },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      homeSceneCity: true,
      homeSceneState: true,
      homeSceneCommunity: true,
    },
  });

  return user;
}

async function ensureArtistBand({ user, entry, scene }) {
  const existingMembership = await prisma.artistBandMember.findFirst({
    where: {
      userId: user.id,
      artistBand: {
        entityType: 'artist',
      },
    },
    include: {
      artistBand: {
        select: {
          id: true,
          name: true,
          slug: true,
          entityType: true,
          homeSceneId: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  if (existingMembership?.artistBand) {
    const artistBand = await prisma.artistBand.update({
      where: { id: existingMembership.artistBand.id },
      data: {
        name: entry.stageName,
        homeSceneId: scene.id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        entityType: true,
        homeSceneId: true,
      },
    });

    return { artistBand, created: false };
  }

  const slugBase = slugify(entry.stageName);
  let slug = slugBase;
  let counter = 1;

  while (await prisma.artistBand.findUnique({ where: { slug }, select: { id: true } })) {
    counter += 1;
    slug = `${slugBase}-${counter}`;
  }

  const artistBand = await prisma.artistBand.create({
    data: {
      name: entry.stageName,
      slug,
      entityType: 'artist',
      createdById: user.id,
      homeSceneId: scene.id,
      members: {
        create: {
          userId: user.id,
          role: 'owner',
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      entityType: true,
      homeSceneId: true,
    },
  });

  return { artistBand, created: true };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const count = Math.max(1, Math.min(DEFAULT_COUNT, Number.parseInt(args.count ?? String(DEFAULT_COUNT), 10) || DEFAULT_COUNT));
  const domain = args.domain ?? 'uprise.test';
  const scene = await resolveCityScene({
    communityId: args['community-id'],
    city: args.city,
    state: args.state,
    musicCommunity: args['music-community'],
  });
  const passwordHash = await bcrypt.hash(args.password ?? DEFAULT_PASSWORD, 10);
  const results = [];

  for (const [index, entry] of ARTIST_FIXTURE_ROSTER.slice(0, count).entries()) {
    const user = await upsertFixtureUser({
      entry,
      index,
      passwordHash,
      scene,
      domain,
    });
    const { artistBand, created } = await ensureArtistBand({ user, entry, scene });

    results.push({
      user,
      artistBand,
      artistBandCreated: created,
    });
  }

  console.log(
    JSON.stringify(
      {
        scene: {
          id: scene.id,
          name: scene.name,
          city: scene.city,
          state: scene.state,
          musicCommunity: scene.musicCommunity,
        },
        password: args.password ?? DEFAULT_PASSWORD,
        accounts: results,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
