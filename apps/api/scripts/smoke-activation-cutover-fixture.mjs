#!/usr/bin/env node
import { createHmac } from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const API_URL = process.env.UPRISE_API_URL || 'http://localhost:4000';
const RUN_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const DRY_RUN = process.argv.includes('--dry-run');
const SMOKE_NAME = 'activation-cutover-fixture';
const MUSIC_COMMUNITY = 'Punk';
const STATE = 'Texas';
const NATURAL_CITY = `Smoke Natural ${RUN_ID}`;
const PROXY_CITY = `Smoke Proxy ${RUN_ID}`;

const created = {
  userIds: [],
  communityIds: [],
  artistBandIds: [],
  trackIds: [],
  activationAuditIds: [],
};

let prisma;

function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

function resolveApiHost() {
  try {
    return new URL(API_URL).host;
  } catch {
    throw new Error(`UPRISE_API_URL must be a valid URL. Received: ${API_URL}`);
  }
}

function isLocalApiHost(host) {
  const hostname = host.split(':')[0];
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

async function currentDatabaseName() {
  const rows = await getPrisma().$queryRaw`SELECT current_database() as database`;
  return rows[0]?.database;
}

async function assertSmokeTargetAllowed() {
  const host = resolveApiHost();
  const database = await currentDatabaseName();
  if (isLocalApiHost(host)) return { host, database, confirmationRequired: null };

  const requiredConfirmation = `activation-cutover:${host}:${database}`;
  if (process.env.UPRISE_CONFIRM_ACTIVATION_CUTOVER_SMOKE !== requiredConfirmation) {
    throw new Error(
      [
        `Refusing activation cutover fixture smoke writes against non-local API ${API_URL}.`,
        `Connected Prisma database is ${database || '<unknown>'}.`,
        'This smoke creates temporary source/listener/community/track rows, calls the manual activation endpoint, verifies persisted cutover effects, and cleans the rows up through Prisma.',
        `Set UPRISE_CONFIRM_ACTIVATION_CUTOVER_SMOKE=${requiredConfirmation} only after confirming API and DATABASE_URL target the intended staging environment.`,
      ].join(' '),
    );
  }

  return { host, database, confirmationRequired: requiredConfirmation };
}

function buildDryRunPlan() {
  const host = resolveApiHost();
  const confirmationPattern = isLocalApiHost(host) ? null : `activation-cutover:${host}:<database_name>`;

  return {
    smoke: SMOKE_NAME,
    mode: 'dry-run',
    apiUrl: API_URL,
    writesApi: false,
    writesDatabase: false,
    nonLocalConfirmationPattern: confirmationPattern,
    fixture: {
      naturalTuple: {
        city: NATURAL_CITY,
        state: STATE,
        musicCommunity: MUSIC_COMMUNITY,
      },
      proxyTuple: {
        city: PROXY_CITY,
        state: STATE,
        musicCommunity: MUSIC_COMMUNITY,
      },
      sources: 5,
      playableMinutesPerSource: 10,
      totalCappedPlayableMinutes: 50,
      proxyListeners: 2,
    },
    proves: [
      'Manual activation uses the real API endpoint after fixture readiness exists.',
      'The natural city-tier Home Scene is created or activated from the full city/state/music-community tuple.',
      'Matching source accounts are re-anchored for future uploads.',
      'Matching listeners are rerooted from proxy to natural Home Scene.',
      'Former proxy scenes are saved as profile Away Scenes and activation notices/audit rows are persisted.',
      'Existing proxy-scene tracks remain on the proxy scene and are not moved during cutover.',
    ],
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${path} failed ${response.status}: ${JSON.stringify(payload)}`);
  }
  return payload?.data ?? payload;
}

function assert(condition, message, details = {}) {
  if (!condition) {
    throw new Error(`${message}: ${JSON.stringify(details)}`);
  }
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url');
}

function signJwt(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
  const signature = createHmac('sha256', secret).update(unsigned).digest('base64url');
  return `${unsigned}.${signature}`;
}

function resolveJwtSecret(target) {
  const configured = process.env.JWT_SECRET?.trim();
  if (configured) return configured;
  if (!isLocalApiHost(target.host)) {
    throw new Error('JWT_SECRET must be available to sign the admin smoke token for non-local API targets.');
  }
  return 'super-secret-key';
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function createUser(label, overrides = {}) {
  const db = getPrisma();
  const safe = slugify(label);
  const user = await db.user.create({
    data: {
      email: `qa-${SMOKE_NAME}-${safe}-${RUN_ID}@uprise.local`,
      username: `qa${safe}${RUN_ID}`.replace(/[^a-z0-9]/g, '').slice(0, 30),
      displayName: `QA ${label}`,
      password: 'SMOKE_NO_LOGIN',
      ...overrides,
    },
    select: { id: true, email: true, username: true },
  });
  created.userIds.push(user.id);
  return user;
}

async function createFixture(target) {
  const db = getPrisma();
  const owner = await createUser('activation-owner');

  const proxy = await db.community.create({
    data: {
      name: `${PROXY_CITY}, ${STATE} ${MUSIC_COMMUNITY}`,
      slug: `smoke-proxy-${slugify(RUN_ID)}-${slugify(MUSIC_COMMUNITY)}`,
      description: `Temporary proxy scene for ${SMOKE_NAME} ${RUN_ID}.`,
      city: PROXY_CITY,
      state: STATE,
      musicCommunity: MUSIC_COMMUNITY,
      tier: 'city',
      isActive: true,
      isPrivate: false,
      memberCount: 0,
      createdById: owner.id,
    },
    select: { id: true },
  });
  created.communityIds.push(proxy.id);

  const sourceIds = [];
  const trackIds = [];
  for (const index of [1, 2, 3, 4, 5]) {
    const source = await db.artistBand.create({
      data: {
        name: `Smoke Source ${index} ${RUN_ID}`,
        slug: `smoke-source-${index}-${slugify(RUN_ID)}`,
        entityType: 'band',
        homeSceneId: proxy.id,
        sourceOriginCity: NATURAL_CITY,
        sourceOriginState: STATE,
        sourceOriginMusicCommunity: MUSIC_COMMUNITY,
        createdById: owner.id,
      },
      select: { id: true },
    });
    created.artistBandIds.push(source.id);
    sourceIds.push(source.id);

    const track = await db.track.create({
      data: {
        title: `Smoke Activation Track ${index}`,
        artist: `Smoke Source ${index}`,
        artistBandId: source.id,
        duration: 600,
        fileUrl: `https://example.invalid/uprise-smoke/${RUN_ID}/track-${index}.mp3`,
        uploadedById: owner.id,
        communityId: proxy.id,
        status: 'ready',
      },
      select: { id: true },
    });
    created.trackIds.push(track.id);
    trackIds.push(track.id);
  }

  const directListener = await createUser('activation-direct-listener', {
    homeSceneCity: NATURAL_CITY,
    homeSceneState: STATE,
    homeSceneCommunity: MUSIC_COMMUNITY,
    tunedSceneId: proxy.id,
  });
  const preferenceListener = await createUser('activation-preference-listener', {
    homeSceneCity: NATURAL_CITY,
    homeSceneState: STATE,
    homeSceneCommunity: null,
    tunedSceneId: proxy.id,
  });

  await db.userMusicCommunityPreference.createMany({
    data: [
      { userId: directListener.id, musicCommunity: MUSIC_COMMUNITY, isDefault: true },
      { userId: preferenceListener.id, musicCommunity: MUSIC_COMMUNITY, isDefault: true },
    ],
  });

  const token = signJwt(
    {
      sub: owner.id,
      email: owner.email,
      username: owner.username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    resolveJwtSecret(target),
  );

  return {
    owner,
    token,
    proxySceneId: proxy.id,
    sourceIds,
    trackIds,
    listenerIds: [directListener.id, preferenceListener.id],
  };
}

async function runActivation(fixture) {
  const diagnosticsBefore = await request('/admin/analytics/activation-readiness', {
    token: fixture.token,
  });
  const candidateBefore = diagnosticsBefore.candidates.find(
    (candidate) =>
      candidate.city === NATURAL_CITY &&
      candidate.state === STATE &&
      candidate.musicCommunity === MUSIC_COMMUNITY,
  );

  assert(candidateBefore?.ready === true, 'Fixture did not produce a ready activation candidate', {
    candidateBefore,
    thresholds: diagnosticsBefore.thresholds,
  });

  const activation = await request('/admin/analytics/activation-readiness/activate', {
    method: 'POST',
    token: fixture.token,
    body: {
      city: NATURAL_CITY.toUpperCase(),
      state: STATE.toUpperCase(),
      musicCommunity: MUSIC_COMMUNITY.toUpperCase(),
    },
  });

  created.activationAuditIds.push(activation.activationAuditId);
  if (activation.sceneId) {
    created.communityIds.push(activation.sceneId);
  }

  return { diagnosticsBefore, candidateBefore, activation };
}

async function verifyCutover(fixture, activation) {
  const db = getPrisma();
  const naturalScene = await db.community.findUnique({
    where: { id: activation.sceneId },
    select: {
      id: true,
      city: true,
      state: true,
      musicCommunity: true,
      tier: true,
      isActive: true,
    },
  });
  assert(naturalScene?.isActive === true, 'Natural scene was not activated', { naturalScene, activation });
  assert(naturalScene.city === NATURAL_CITY, 'Natural scene city mismatch', naturalScene);
  assert(naturalScene.state === STATE, 'Natural scene state mismatch', naturalScene);
  assert(naturalScene.musicCommunity === MUSIC_COMMUNITY, 'Natural scene music community mismatch', naturalScene);
  assert(naturalScene.tier === 'city', 'Natural scene tier mismatch', naturalScene);

  const reanchoredSources = await db.artistBand.findMany({
    where: { id: { in: fixture.sourceIds } },
    select: {
      id: true,
      homeSceneId: true,
      sourceOriginCity: true,
      sourceOriginState: true,
      sourceOriginMusicCommunity: true,
    },
  });
  assert(reanchoredSources.length === fixture.sourceIds.length, 'Source rows missing after cutover', reanchoredSources);
  for (const source of reanchoredSources) {
    assert(source.homeSceneId === naturalScene.id, 'Source was not reanchored to natural scene', source);
    assert(source.sourceOriginCity === NATURAL_CITY, 'Source origin city changed unexpectedly', source);
    assert(source.sourceOriginState === STATE, 'Source origin state changed unexpectedly', source);
    assert(source.sourceOriginMusicCommunity === MUSIC_COMMUNITY, 'Source origin music community changed unexpectedly', source);
  }

  const listeners = await db.user.findMany({
    where: { id: { in: fixture.listenerIds } },
    select: { id: true, tunedSceneId: true },
  });
  assert(listeners.length === fixture.listenerIds.length, 'Listener rows missing after cutover', listeners);
  for (const listener of listeners) {
    assert(listener.tunedSceneId === naturalScene.id, 'Listener was not rerooted to natural scene', listener);
  }

  const savedAwayScenes = await db.userSavedScene.findMany({
    where: {
      userId: { in: fixture.listenerIds },
      communityId: fixture.proxySceneId,
      reason: 'former_proxy_cutover',
    },
    select: { id: true, userId: true, communityId: true, reason: true, context: true },
  });
  assert(savedAwayScenes.length === fixture.listenerIds.length, 'Former proxy scene was not saved for all listeners', savedAwayScenes);

  const notices = await db.userActivationNotice.findMany({
    where: {
      userId: { in: fixture.listenerIds },
      toSceneId: naturalScene.id,
      reason: 'natural_home_scene_activated',
    },
    select: { id: true, userId: true, fromSceneId: true, toSceneId: true, status: true },
  });
  assert(notices.length === fixture.listenerIds.length, 'Activation notices were not created for all listeners', notices);
  for (const notice of notices) {
    assert(notice.fromSceneId === fixture.proxySceneId, 'Activation notice did not preserve proxy scene', notice);
    assert(notice.status === 'unread', 'Activation notice should start unread', notice);
  }

  const audit = await db.communityActivationAudit.findUnique({
    where: { id: activation.activationAuditId },
    select: {
      id: true,
      sceneId: true,
      city: true,
      state: true,
      musicCommunity: true,
      createdScene: true,
      reanchoredSourceIds: true,
      cutoverListenerIds: true,
      savedAwaySceneCount: true,
      activationNoticeCount: true,
      thresholds: true,
    },
  });
  assert(Boolean(audit), 'Activation audit row missing', { activation });
  assert(audit.sceneId === naturalScene.id, 'Activation audit scene mismatch', audit);
  assert(audit.savedAwaySceneCount === fixture.listenerIds.length, 'Activation audit saved Away Scene count mismatch', audit);
  assert(audit.activationNoticeCount === fixture.listenerIds.length, 'Activation audit notice count mismatch', audit);

  const tracks = await db.track.findMany({
    where: { id: { in: fixture.trackIds } },
    select: { id: true, communityId: true, artistBandId: true, status: true },
  });
  assert(tracks.length === fixture.trackIds.length, 'Track rows missing after cutover', tracks);
  for (const track of tracks) {
    assert(track.communityId === fixture.proxySceneId, 'Existing track moved out of former proxy scene', track);
    assert(track.status === 'ready', 'Track status changed unexpectedly', track);
  }

  const diagnosticsAfter = await request('/admin/analytics/activation-readiness', {
    token: fixture.token,
  });
  const stillCandidate = diagnosticsAfter.candidates.find(
    (candidate) =>
      candidate.city === NATURAL_CITY &&
      candidate.state === STATE &&
      candidate.musicCommunity === MUSIC_COMMUNITY,
  );
  assert(!stillCandidate, 'Activated tuple still appears as a readiness candidate', stillCandidate);

  return {
    naturalScene,
    reanchoredSourceCount: reanchoredSources.length,
    cutoverListenerCount: listeners.length,
    savedAwaySceneCount: savedAwayScenes.length,
    activationNoticeCount: notices.length,
    audit: {
      id: audit.id,
      createdScene: audit.createdScene,
      thresholds: audit.thresholds,
    },
    tracksRemainingInProxyCount: tracks.filter((track) => track.communityId === fixture.proxySceneId).length,
  };
}

async function cleanup() {
  const db = getPrisma();
  const userIds = [...new Set(created.userIds)];
  const communityIds = [...new Set(created.communityIds)];
  const artistBandIds = [...new Set(created.artistBandIds)];
  const trackIds = [...new Set(created.trackIds)];

  const result = await db.$transaction(async (tx) => {
    const activationAudits = await tx.communityActivationAudit.deleteMany({
      where: {
        OR: [
          { id: { in: [...new Set(created.activationAuditIds)] } },
          { city: NATURAL_CITY, state: STATE, musicCommunity: MUSIC_COMMUNITY },
        ],
      },
    });
    const activationNotices = await tx.userActivationNotice.deleteMany({
      where: { OR: [{ userId: { in: userIds } }, { toSceneId: { in: communityIds } }, { fromSceneId: { in: communityIds } }] },
    });
    const savedScenes = await tx.userSavedScene.deleteMany({
      where: { OR: [{ userId: { in: userIds } }, { communityId: { in: communityIds } }] },
    });
    const preferences = await tx.userMusicCommunityPreference.deleteMany({ where: { userId: { in: userIds } } });
    const votes = await tx.trackVote.deleteMany({ where: { OR: [{ userId: { in: userIds } }, { trackId: { in: trackIds } }, { sceneId: { in: communityIds } }] } });
    const engagements = await tx.trackEngagement.deleteMany({ where: { OR: [{ userId: { in: userIds } }, { trackId: { in: trackIds } }] } });
    const rotationEntries = await tx.rotationEntry.deleteMany({ where: { OR: [{ trackId: { in: trackIds } }, { sceneId: { in: communityIds } }] } });
    const tracks = await tx.track.deleteMany({ where: { id: { in: trackIds } } });
    const artistBandMembers = await tx.artistBandMember.deleteMany({ where: { OR: [{ userId: { in: userIds } }, { artistBandId: { in: artistBandIds } }] } });
    const registrarEntries = await tx.registrarEntry.deleteMany({
      where: {
        OR: [
          { createdById: { in: userIds } },
          { artistBandId: { in: artistBandIds } },
          { sourceOriginCity: NATURAL_CITY, sourceOriginState: STATE, sourceOriginMusicCommunity: MUSIC_COMMUNITY },
        ],
      },
    });
    const artistBands = await tx.artistBand.deleteMany({ where: { id: { in: artistBandIds } } });
    const communityMembers = await tx.communityMember.deleteMany({
      where: { OR: [{ userId: { in: userIds } }, { communityId: { in: communityIds } }] },
    });
    const communities = await tx.community.deleteMany({
      where: {
        OR: [
          { id: { in: communityIds } },
          { city: { in: [NATURAL_CITY, PROXY_CITY] }, state: STATE, musicCommunity: MUSIC_COMMUNITY, tier: 'city' },
        ],
      },
    });
    const users = await tx.user.deleteMany({ where: { id: { in: userIds } } });

    return {
      activationAudits: activationAudits.count,
      activationNotices: activationNotices.count,
      savedScenes: savedScenes.count,
      preferences: preferences.count,
      votes: votes.count,
      engagements: engagements.count,
      rotationEntries: rotationEntries.count,
      tracks: tracks.count,
      artistBandMembers: artistBandMembers.count,
      registrarEntries: registrarEntries.count,
      artistBands: artistBands.count,
      communityMembers: communityMembers.count,
      communities: communities.count,
      users: users.count,
    };
  });

  return result;
}

async function main() {
  if (DRY_RUN) {
    console.log(JSON.stringify(buildDryRunPlan(), null, 2));
    return;
  }

  const target = await assertSmokeTargetAllowed();
  const health = await request('/health/ready');
  const fixture = await createFixture(target);
  const { candidateBefore, activation } = await runActivation(fixture);
  const verification = await verifyCutover(fixture, activation);
  const cleanupResult = await cleanup();

  console.log(JSON.stringify({
    smoke: SMOKE_NAME,
    apiUrl: API_URL,
    target,
    health,
    fixture: {
      naturalTuple: { city: NATURAL_CITY, state: STATE, musicCommunity: MUSIC_COMMUNITY },
      proxySceneId: fixture.proxySceneId,
      sourceCount: fixture.sourceIds.length,
      trackCount: fixture.trackIds.length,
      listenerCount: fixture.listenerIds.length,
    },
    candidateBefore: {
      ready: candidateBefore.ready,
      cappedPlayableMinutes: candidateBefore.cappedPlayableMinutes,
      distinctSourceCount: candidateBefore.distinctSourceCount,
    },
    activation,
    verification,
    cleanup: cleanupResult,
  }, null, 2));
}

main()
  .catch(async (error) => {
    const cleanupResult = await cleanup().catch((cleanupError) => ({ error: cleanupError.message }));
    console.error(JSON.stringify({ smoke: SMOKE_NAME, error: error.message, cleanup: cleanupResult }, null, 2));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma?.$disconnect();
  });
