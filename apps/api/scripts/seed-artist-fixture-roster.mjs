import { PrismaClient, RotationPool } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = process.env.UPRISE_ARTIST_FIXTURE_PASSWORD || 'ArtistFixture123!';
const DEFAULT_COUNT = 10;
const DEV_AUDIO_URL = process.env.UPRISE_DEV_AUDIO_URL || 'http://127.0.0.1:3000/dev-audio/qa-broadcast-tone-a.wav';

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

const SINGLE_SIGNAL_FIXTURES = [
  {
    ownerIndex: 0,
    title: 'Static on the Southside',
    addUserIndexes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    blastUserIndexes: [2, 5, 8],
    recommendUserIndexes: [3, 7],
    riseEnteredPoolAt: '2026-04-15T20:00:00.000Z',
  },
  {
    ownerIndex: 1,
    title: 'Mercy Circuit',
    addUserIndexes: [0, 2, 3, 4, 5, 6, 7, 8],
    blastUserIndexes: [0, 4, 6],
    recommendUserIndexes: [5],
    riseEnteredPoolAt: '2026-04-14T20:00:00.000Z',
  },
  {
    ownerIndex: 2,
    title: 'Ashline Signal',
    addUserIndexes: [0, 1, 3, 4, 5, 6, 7],
    blastUserIndexes: [1, 6],
    recommendUserIndexes: [4],
  },
  {
    ownerIndex: 3,
    title: 'Youth Frequency',
    addUserIndexes: [0, 1, 2, 4, 5, 6],
    blastUserIndexes: [2, 5],
    recommendUserIndexes: [],
  },
  {
    ownerIndex: 4,
    title: 'Bloom Relay',
    addUserIndexes: [0, 1, 2, 3, 5],
    blastUserIndexes: [1],
    recommendUserIndexes: [],
  },
];

const UPRISE_SIGNAL_FIXTURES = [
  {
    ownerIndex: 5,
    title: 'Austin Punk Uprise Dispatch',
    addUserIndexes: [0, 1, 2, 3],
    blastUserIndexes: [4, 7],
    recommendUserIndexes: [8],
  },
  {
    ownerIndex: 6,
    title: 'State Line Uprise Call',
    addUserIndexes: [2, 3, 4],
    blastUserIndexes: [0, 5],
    recommendUserIndexes: [1],
  },
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

async function ensureStateScene(scene, createdById) {
  if (!scene.state || !scene.musicCommunity) {
    return null;
  }

  const existing = await prisma.community.findFirst({
    where: {
      tier: 'state',
      state: scene.state,
      musicCommunity: scene.musicCommunity,
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

  if (existing) return existing;

  return prisma.community.create({
    data: {
      name: `${scene.state} ${scene.musicCommunity}`,
      slug: slugify(`${scene.state}-${scene.musicCommunity}-fixture-state`),
      description: 'Fixture state scene for artist signal activity QA.',
      createdById,
      state: scene.state,
      musicCommunity: scene.musicCommunity,
      tier: 'state',
      isActive: true,
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

async function upsertSignal({ type, title, ownerUserId, ownerArtistBandId, ownerArtistBandName, scene }) {
  const existing = await prisma.signal.findFirst({
    where: {
      type,
      communityId: scene.id,
      createdById: ownerUserId,
    },
    select: {
      id: true,
      metadata: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  const metadata = {
    title,
    artist: ownerArtistBandName,
    artistBandId: ownerArtistBandId,
    kind: type,
  };

  if (existing) {
    return prisma.signal.update({
      where: { id: existing.id },
      data: {
        metadata,
      },
      select: {
        id: true,
        type: true,
        metadata: true,
        communityId: true,
      },
    });
  }

  return prisma.signal.create({
    data: {
      type,
      communityId: scene.id,
      createdById: ownerUserId,
      metadata,
    },
    select: {
      id: true,
      type: true,
      metadata: true,
      communityId: true,
    },
  });
}

async function ensureTrackForSingle({ title, artistName, uploaderUserId, artistBandId, scene }) {
  const existing = await prisma.track.findFirst({
    where: {
      title,
      artist: artistName,
      communityId: scene.id,
      artistBandId,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return prisma.track.update({
      where: { id: existing.id },
      data: {
        status: 'ready',
        fileUrl: DEV_AUDIO_URL,
        duration: 180,
      },
      select: { id: true, title: true, artist: true },
    });
  }

  return prisma.track.create({
    data: {
      title,
      artist: artistName,
      artistBandId,
      album: 'Fixture Singles',
      duration: 180,
      fileUrl: DEV_AUDIO_URL,
      uploadedById: uploaderUserId,
      communityId: scene.id,
      status: 'ready',
    },
    select: { id: true, title: true, artist: true },
  });
}

async function ensureRotationEntry({ trackId, sceneId, enteredPoolAt }) {
  const existing = await prisma.rotationEntry.findFirst({
    where: { trackId, sceneId },
    select: { id: true },
  });

  if (existing) {
    return prisma.rotationEntry.update({
      where: { id: existing.id },
      data: {
        pool: RotationPool.MAIN_ROTATION,
        enteredPoolAt,
        recurrenceScore: 0,
        graduatedAt: null,
      },
      select: { id: true },
    });
  }

  return prisma.rotationEntry.create({
    data: {
      trackId,
      sceneId,
      pool: RotationPool.MAIN_ROTATION,
      enteredPoolAt,
      recurrenceScore: 0,
    },
    select: { id: true },
  });
}

async function ensureCollectionAdd({ userId, signalId, shelf }) {
  const collection = await prisma.collection.upsert({
    where: { userId_name: { userId, name: shelf } },
    update: {},
    create: { userId, name: shelf },
    select: { id: true },
  });

  await prisma.collectionItem.upsert({
    where: {
      collectionId_signalId: {
        collectionId: collection.id,
        signalId,
      },
    },
    update: {},
    create: {
      collectionId: collection.id,
      signalId,
    },
  });

  return prisma.signalAction.upsert({
    where: {
      userId_signalId_type: {
        userId,
        signalId,
        type: 'ADD',
      },
    },
    update: {},
    create: {
      userId,
      signalId,
      type: 'ADD',
    },
    select: { id: true },
  });
}

async function ensureSignalAction({ userId, signalId, type }) {
  return prisma.signalAction.upsert({
    where: {
      userId_signalId_type: {
        userId,
        signalId,
        type,
      },
    },
    update: {},
    create: {
      userId,
      signalId,
      type,
    },
    select: { id: true, type: true },
  });
}

async function seedSignalActivity({ roster, cityScene, stateScene }) {
  const signalSummaries = [];

  for (const fixture of SINGLE_SIGNAL_FIXTURES) {
    const owner = roster[fixture.ownerIndex];
    if (!owner) continue;

    const signal = await upsertSignal({
      type: 'single',
      title: fixture.title,
      ownerUserId: owner.user.id,
      ownerArtistBandId: owner.artistBand.id,
      ownerArtistBandName: owner.artistBand.name,
      scene: cityScene,
    });

    for (const userIndex of fixture.addUserIndexes) {
      const account = roster[userIndex];
      if (!account) continue;
      await ensureCollectionAdd({
        userId: account.user.id,
        signalId: signal.id,
        shelf: 'singles',
      });
    }

    for (const userIndex of fixture.blastUserIndexes) {
      const account = roster[userIndex];
      if (!account) continue;
      await ensureSignalAction({
        userId: account.user.id,
        signalId: signal.id,
        type: 'BLAST',
      });
    }

    for (const userIndex of fixture.recommendUserIndexes) {
      const account = roster[userIndex];
      if (!account) continue;
      await ensureSignalAction({
        userId: account.user.id,
        signalId: signal.id,
        type: 'RECOMMEND',
      });
    }

    let rise = null;
    if (stateScene && fixture.riseEnteredPoolAt) {
      const track = await ensureTrackForSingle({
        title: fixture.title,
        artistName: owner.artistBand.name,
        uploaderUserId: owner.user.id,
        artistBandId: owner.artistBand.id,
        scene: cityScene,
      });
      await ensureRotationEntry({
        trackId: track.id,
        sceneId: stateScene.id,
        enteredPoolAt: new Date(fixture.riseEnteredPoolAt),
      });
      rise = {
        stateSceneId: stateScene.id,
        enteredPoolAt: fixture.riseEnteredPoolAt,
        trackId: track.id,
      };
    }

    signalSummaries.push({
      signalId: signal.id,
      type: signal.type,
      title: fixture.title,
      ownerArtistBandId: owner.artistBand.id,
      adds: fixture.addUserIndexes.length,
      blasts: fixture.blastUserIndexes.length,
      recommends: fixture.recommendUserIndexes.length,
      rise,
    });
  }

  for (const fixture of UPRISE_SIGNAL_FIXTURES) {
    const owner = roster[fixture.ownerIndex];
    if (!owner) continue;

    const signal = await upsertSignal({
      type: 'uprise',
      title: fixture.title,
      ownerUserId: owner.user.id,
      ownerArtistBandId: owner.artistBand.id,
      ownerArtistBandName: owner.artistBand.name,
      scene: cityScene,
    });

    for (const userIndex of fixture.addUserIndexes) {
      const account = roster[userIndex];
      if (!account) continue;
      await ensureCollectionAdd({
        userId: account.user.id,
        signalId: signal.id,
        shelf: 'uprises',
      });
    }

    for (const userIndex of fixture.blastUserIndexes) {
      const account = roster[userIndex];
      if (!account) continue;
      await ensureSignalAction({
        userId: account.user.id,
        signalId: signal.id,
        type: 'BLAST',
      });
    }

    for (const userIndex of fixture.recommendUserIndexes) {
      const account = roster[userIndex];
      if (!account) continue;
      await ensureSignalAction({
        userId: account.user.id,
        signalId: signal.id,
        type: 'RECOMMEND',
      });
    }

    signalSummaries.push({
      signalId: signal.id,
      type: signal.type,
      title: fixture.title,
      ownerArtistBandId: owner.artistBand.id,
      adds: fixture.addUserIndexes.length,
      blasts: fixture.blastUserIndexes.length,
      recommends: fixture.recommendUserIndexes.length,
    });
  }

  return signalSummaries;
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

  const stateScene = await ensureStateScene(scene, results[0]?.user.id ?? null);
  const signals = await seedSignalActivity({
    roster: results,
    cityScene: scene,
    stateScene,
  });

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
        stateScene: stateScene
          ? {
              id: stateScene.id,
              name: stateScene.name,
              state: stateScene.state,
              musicCommunity: stateScene.musicCommunity,
            }
          : null,
        password: args.password ?? DEFAULT_PASSWORD,
        accounts: results,
        signals,
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
