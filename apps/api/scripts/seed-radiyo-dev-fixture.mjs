import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient, RotationPool } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient();

const WEB_ORIGIN = process.env.UPRISE_DEV_WEB_ORIGIN || 'http://127.0.0.1:3000';
const AUDIO_DURATION_SECONDS = 2;
const AUDIO_SAMPLE_RATE = 22050;
const AUDIO_DIRECTORY = resolve(__dirname, '../../web/public/dev-audio');
const QA_ARTIST = 'UPRISE QA';
const QA_ALBUM = 'Dev Fixtures';

const AUDIO_FIXTURES = [
  {
    title: 'QA Broadcast Tone A',
    relativePath: '/dev-audio/qa-broadcast-tone-a.wav',
    frequency: 440,
  },
  {
    title: 'QA Broadcast Tone B',
    relativePath: '/dev-audio/qa-broadcast-tone-b.wav',
    frequency: 554.37,
  },
  {
    title: 'QA Broadcast Tone C',
    relativePath: '/dev-audio/qa-broadcast-tone-c.wav',
    frequency: 659.25,
  },
  {
    title: 'QA Broadcast Tone D',
    relativePath: '/dev-audio/qa-broadcast-tone-d.wav',
    frequency: 783.99,
  },
].map((fixture) => ({
  ...fixture,
  filePath: resolve(AUDIO_DIRECTORY, fixture.relativePath.replace('/dev-audio/', '')),
  fileUrl: `${WEB_ORIGIN}${fixture.relativePath}`,
}));

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function generateSineWaveWavBuffer({ durationSeconds, sampleRate, frequency }) {
  const channelCount = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * channelCount * bitsPerSample / 8;
  const blockAlign = channelCount * bitsPerSample / 8;
  const sampleCount = Math.floor(durationSeconds * sampleRate);
  const dataSize = sampleCount * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0, 'ascii');
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8, 'ascii');
  buffer.write('fmt ', 12, 'ascii');
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channelCount, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36, 'ascii');
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / sampleRate;
    const amplitude = Math.sin(2 * Math.PI * frequency * t);
    const sample = Math.max(-1, Math.min(1, amplitude)) * 0x5fff;
    buffer.writeInt16LE(sample, 44 + (i * 2));
  }

  return buffer;
}

function ensureAudioFixtures() {
  mkdirSync(AUDIO_DIRECTORY, { recursive: true });

  for (const fixture of AUDIO_FIXTURES) {
    const wav = generateSineWaveWavBuffer({
      durationSeconds: AUDIO_DURATION_SECONDS,
      sampleRate: AUDIO_SAMPLE_RATE,
      frequency: fixture.frequency,
    });
    writeFileSync(fixture.filePath, wav);
  }
}

async function resolveCityScene() {
  const preferredScene = await prisma.community.findFirst({
    where: {
      city: 'Austin',
      state: 'TX',
      musicCommunity: 'Punk',
      tier: 'city',
    },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      state: true,
      musicCommunity: true,
      isActive: true,
    },
  });

  if (preferredScene) {
    return preferredScene;
  }

  const fallbackScene = await prisma.community.findFirst({
    where: { tier: 'city' },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      state: true,
      musicCommunity: true,
      isActive: true,
    },
  });

  if (!fallbackScene) {
    throw new Error('No city-tier community exists to seed a RaDIYo dev fixture');
  }

  return fallbackScene;
}

async function resolveUploader() {
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true, username: true },
  });

  if (!user) {
    throw new Error('No user exists to own the RaDIYo dev fixture tracks');
  }

  return user;
}

async function ensureStateScene(cityScene, createdById) {
  const existing = await prisma.community.findFirst({
    where: {
      tier: 'state',
      state: cityScene.state,
      musicCommunity: cityScene.musicCommunity,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      state: true,
      musicCommunity: true,
      isActive: true,
    },
  });

  if (existing) {
    if (!existing.isActive) {
      return prisma.community.update({
        where: { id: existing.id },
        data: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          state: true,
          musicCommunity: true,
          isActive: true,
        },
      });
    }
    return existing;
  }

  return prisma.community.create({
    data: {
      name: `${cityScene.state} ${cityScene.musicCommunity}`,
      slug: slugify(`${cityScene.state}-${cityScene.musicCommunity}-state-fixture`),
      description: 'QA fixture state scene for RaDIYo playback verification.',
      createdById,
      state: cityScene.state,
      musicCommunity: cityScene.musicCommunity,
      tier: 'state',
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      state: true,
      musicCommunity: true,
      isActive: true,
    },
  });
}

async function upsertTrack({ title, fileUrl, sceneId, uploaderId }) {
  const existing = await prisma.track.findFirst({
    where: { title, artist: QA_ARTIST, album: QA_ALBUM, communityId: sceneId },
    select: { id: true },
  });

  if (existing) {
    return prisma.track.update({
      where: { id: existing.id },
      data: {
        duration: AUDIO_DURATION_SECONDS,
        fileUrl,
        uploadedById: uploaderId,
        status: 'ready',
      },
      select: { id: true, title: true, fileUrl: true },
    });
  }

  return prisma.track.create({
    data: {
      title,
      artist: QA_ARTIST,
      album: QA_ALBUM,
      duration: AUDIO_DURATION_SECONDS,
      fileUrl,
      uploadedById: uploaderId,
      communityId: sceneId,
      status: 'ready',
    },
    select: { id: true, title: true, fileUrl: true },
  });
}

async function upsertRotationEntry({ trackId, sceneId, pool, enteredPoolAt, recurrenceScore = 0 }) {
  const existing = await prisma.rotationEntry.findFirst({
    where: { trackId, sceneId },
    select: { id: true },
  });

  if (existing) {
    return prisma.rotationEntry.update({
      where: { id: existing.id },
      data: { pool, enteredPoolAt, recurrenceScore },
      select: { id: true, trackId: true, pool: true, enteredPoolAt: true },
    });
  }

  return prisma.rotationEntry.create({
    data: {
      trackId,
      sceneId,
      pool,
      enteredPoolAt,
      recurrenceScore,
    },
    select: { id: true, trackId: true, pool: true, enteredPoolAt: true },
  });
}

async function pruneSceneQaFixture(sceneId, keepTrackIds) {
  const keepIds = new Set(keepTrackIds);
  const qaTracks = await prisma.track.findMany({
    where: {
      communityId: sceneId,
      artist: QA_ARTIST,
      album: QA_ALBUM,
    },
    select: { id: true },
  });

  for (const track of qaTracks) {
    if (keepIds.has(track.id)) continue;

    await prisma.rotationEntry.deleteMany({
      where: {
        sceneId,
        trackId: track.id,
      },
    });
  }
}

async function seedSceneRotation(scene, uploaderId, fixturesByPool) {
  const seededTracks = [];
  const now = Date.now();

  for (const [pool, fixtureDefs] of Object.entries(fixturesByPool)) {
    for (const [index, fixture] of fixtureDefs.entries()) {
      const track = await upsertTrack({
        title: fixture.title,
        fileUrl: fixture.fileUrl,
        sceneId: scene.id,
        uploaderId,
      });

      seededTracks.push(track);
      await upsertRotationEntry({
        trackId: track.id,
        sceneId: scene.id,
        pool,
        enteredPoolAt: new Date(now + (index * 1000)),
        recurrenceScore: pool === RotationPool.MAIN_ROTATION ? fixtureDefs.length - index : 0,
      });
    }
  }

  await pruneSceneQaFixture(
    scene.id,
    seededTracks.map((track) => track.id),
  );

  return seededTracks;
}

async function main() {
  ensureAudioFixtures();
  const cityScene = await resolveCityScene();
  const uploader = await resolveUploader();
  const stateScene = await ensureStateScene(cityScene, uploader.id);

  const cityTracks = await seedSceneRotation(cityScene, uploader.id, {
    [RotationPool.NEW_RELEASES]: [
      {
        title: 'QA Austin New 1',
        fileUrl: AUDIO_FIXTURES[0].fileUrl,
      },
      {
        title: 'QA Austin New 2',
        fileUrl: AUDIO_FIXTURES[1].fileUrl,
      },
    ],
    [RotationPool.MAIN_ROTATION]: [
      {
        title: 'QA Austin Current 1',
        fileUrl: AUDIO_FIXTURES[2].fileUrl,
      },
      {
        title: 'QA Austin Current 2',
        fileUrl: AUDIO_FIXTURES[3].fileUrl,
      },
    ],
  });

  const stateTracks = await seedSceneRotation(stateScene, uploader.id, {
    [RotationPool.NEW_RELEASES]: [
      {
        title: 'QA Texas New 1',
        fileUrl: AUDIO_FIXTURES[1].fileUrl,
      },
      {
        title: 'QA Texas New 2',
        fileUrl: AUDIO_FIXTURES[2].fileUrl,
      },
    ],
    [RotationPool.MAIN_ROTATION]: [
      {
        title: 'QA Texas Current 1',
        fileUrl: AUDIO_FIXTURES[0].fileUrl,
      },
      {
        title: 'QA Texas Current 2',
        fileUrl: AUDIO_FIXTURES[3].fileUrl,
      },
    ],
  });

  console.log(
    JSON.stringify(
      {
        success: true,
        uploader,
        scenes: {
          city: cityScene,
          state: stateScene,
        },
        tracks: {
          city: cityTracks,
          state: stateTracks,
        },
        audioFixtures: AUDIO_FIXTURES.map((fixture) => ({
          title: fixture.title,
          filePath: fixture.filePath,
          fileUrl: fixture.fileUrl,
        })),
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
