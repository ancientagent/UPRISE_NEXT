import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient, RotationPool } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient();

const WEB_ORIGIN = process.env.UPRISE_DEV_WEB_ORIGIN || 'http://127.0.0.1:3000';
const AUDIO_RELATIVE_PATH = '/dev-audio/qa-broadcast-tone.wav';
const AUDIO_DURATION_SECONDS = 2;
const AUDIO_SAMPLE_RATE = 22050;
const AUDIO_FILE_PATH = resolve(__dirname, '../../web/public/dev-audio/qa-broadcast-tone.wav');

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

function ensureAudioFixture() {
  mkdirSync(dirname(AUDIO_FILE_PATH), { recursive: true });
  if (existsSync(AUDIO_FILE_PATH)) {
    return;
  }

  const wav = generateSineWaveWavBuffer({
    durationSeconds: AUDIO_DURATION_SECONDS,
    sampleRate: AUDIO_SAMPLE_RATE,
    frequency: 440,
  });
  writeFileSync(AUDIO_FILE_PATH, wav);
}

async function resolveTargetScene() {
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

async function upsertTrack({ title, sceneId, uploaderId }) {
  const fileUrl = `${WEB_ORIGIN}${AUDIO_RELATIVE_PATH}`;
  const existing = await prisma.track.findFirst({
    where: { title, artist: 'UPRISE QA', communityId: sceneId },
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
      artist: 'UPRISE QA',
      album: 'Dev Fixtures',
      duration: AUDIO_DURATION_SECONDS,
      fileUrl,
      uploadedById: uploaderId,
      communityId: sceneId,
      status: 'ready',
    },
    select: { id: true, title: true, fileUrl: true },
  });
}

async function ensureRotationEntry({ trackId, sceneId, pool }) {
  const existing = await prisma.rotationEntry.findFirst({
    where: { trackId, sceneId },
    select: { id: true, pool: true },
  });

  if (existing) {
    if (existing.pool !== pool) {
      await prisma.rotationEntry.update({
        where: { id: existing.id },
        data: { pool, enteredPoolAt: new Date() },
      });
    }
    return;
  }

  await prisma.rotationEntry.create({
    data: {
      trackId,
      sceneId,
      pool,
      enteredPoolAt: new Date(),
    },
  });
}

async function main() {
  ensureAudioFixture();
  const scene = await resolveTargetScene();
  const uploader = await resolveUploader();

  const [newTrack, currentTrack] = await Promise.all([
    upsertTrack({ title: 'QA Broadcast Tone (New)', sceneId: scene.id, uploaderId: uploader.id }),
    upsertTrack({ title: 'QA Broadcast Tone (Current)', sceneId: scene.id, uploaderId: uploader.id }),
  ]);

  await ensureRotationEntry({
    trackId: newTrack.id,
    sceneId: scene.id,
    pool: RotationPool.NEW_RELEASES,
  });
  await ensureRotationEntry({
    trackId: currentTrack.id,
    sceneId: scene.id,
    pool: RotationPool.MAIN_ROTATION,
  });

  console.log(JSON.stringify({
    success: true,
    scene,
    uploader,
    tracks: [newTrack, currentTrack],
    audioFilePath: AUDIO_FILE_PATH,
    audioUrl: `${WEB_ORIGIN}${AUDIO_RELATIVE_PATH}`,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
