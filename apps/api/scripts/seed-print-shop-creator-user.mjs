import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

async function resolveUser({ userId, email, username }) {
  if (userId) {
    return prisma.user.findUnique({
      where: { id: userId },
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
  }

  if (email) {
    return prisma.user.findUnique({
      where: { email },
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
  }

  if (username) {
    return prisma.user.findUnique({
      where: { username },
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
  }

  throw new Error('Provide one of --user-id, --email, or --username');
}

async function resolveHomeScene(user) {
  if (!user.homeSceneCity || !user.homeSceneState || !user.homeSceneCommunity) {
    return null;
  }

  return prisma.community.findFirst({
    where: {
      city: user.homeSceneCity,
      state: user.homeSceneState,
      musicCommunity: user.homeSceneCommunity,
      tier: 'city',
    },
    select: {
      id: true,
      name: true,
      city: true,
      state: true,
      musicCommunity: true,
    },
  });
}

async function ensureArtistBand(user, homeScene) {
  const existingMembership = await prisma.artistBandMember.findFirst({
    where: { userId: user.id },
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
    return {
      artistBand: existingMembership.artistBand,
      membershipCreated: false,
    };
  }

  const baseName = `${user.displayName} Source`;
  const slugBase = slugify(`${user.username}-source`);
  let slug = slugBase;
  let counter = 1;

  while (await prisma.artistBand.findUnique({ where: { slug }, select: { id: true } })) {
    counter += 1;
    slug = `${slugBase}-${counter}`;
  }

  const artistBand = await prisma.artistBand.create({
    data: {
      name: baseName,
      slug,
      entityType: 'artist',
      createdById: user.id,
      homeSceneId: homeScene?.id ?? null,
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

  return {
    artistBand,
    membershipCreated: true,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const user = await resolveUser({
    userId: args['user-id'] ?? process.env.UPRISE_QA_USER_ID,
    email: args.email ?? process.env.UPRISE_QA_USER_EMAIL,
    username: args.username ?? process.env.UPRISE_QA_USERNAME,
  });

  if (!user) {
    throw new Error('Target user not found');
  }

  const homeScene = await resolveHomeScene(user);
  const { artistBand, membershipCreated } = await ensureArtistBand(user, homeScene);

  console.log(
    JSON.stringify(
      {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
        },
        homeScene: homeScene
          ? {
              id: homeScene.id,
              name: homeScene.name,
              city: homeScene.city,
              state: homeScene.state,
              musicCommunity: homeScene.musicCommunity,
            }
          : null,
        artistBand,
        membershipCreated,
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
