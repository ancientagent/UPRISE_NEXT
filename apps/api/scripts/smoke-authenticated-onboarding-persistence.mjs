#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';

const API_URL = process.env.UPRISE_API_URL || 'http://localhost:4000';
const RUN_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const PASSWORD = 'Password123!';
const DRY_RUN = process.argv.includes('--dry-run');
const createdEmails = [];
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

  const requiredConfirmation = `smoke-authenticated-onboarding:${host}:${database}`;
  if (process.env.UPRISE_CONFIRM_AUTH_ONBOARDING_SMOKE !== requiredConfirmation) {
    throw new Error(
      [
        `Refusing authenticated onboarding smoke writes against non-local API ${API_URL}.`,
        `Connected Prisma database is ${database || '<unknown>'}.`,
        'This smoke registers temporary users, persists Home Scene state through the API, and cleans them up through Prisma.',
        `Set UPRISE_CONFIRM_AUTH_ONBOARDING_SMOKE=${requiredConfirmation} only after confirming API and DATABASE_URL target the intended staging environment.`,
      ].join(' '),
    );
  }

  return { host, database, confirmationRequired: requiredConfirmation };
}

function buildDryRunPlan() {
  const host = resolveApiHost();
  const confirmationPattern = isLocalApiHost(host)
    ? null
    : `smoke-authenticated-onboarding:${host}:<database_name>`;

  return {
    smoke: 'authenticated-onboarding-persistence',
    mode: 'dry-run',
    apiUrl: API_URL,
    writesApi: false,
    writesDatabase: false,
    nonLocalConfirmationPattern: confirmationPattern,
    scenarios: [
      {
        name: 'manual_austin_gps_skipped_persists_after_login',
        proves:
          'Authenticated manual Home Scene persistence survives login/reload; GPS skipped keeps voting disabled.',
      },
      {
        name: 'manual_austin_gps_verified_persists_after_login',
        proves:
          'Authenticated Home Scene persistence followed by Austin GPS verification survives login/reload and grants voting.',
      },
      {
        name: 'manual_el_paso_proxy_persists_after_login',
        proves:
          'Inactive submitted Home Scene persists as submitted city/state/music-community while the selector resolves to an active proxy scene.',
      },
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

async function registerUser(label) {
  const safeLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const email = `qa-auth-${safeLabel}-${RUN_ID}@uprise.local`;
  const username = `qaauth${safeLabel}${RUN_ID}`.replace(/[^a-z0-9]/g, '').slice(0, 30);
  createdEmails.push(email);

  const auth = await request('/auth/register', {
    method: 'POST',
    body: {
      email,
      username,
      displayName: `QA Auth ${label}`,
      password: PASSWORD,
      confirmPassword: PASSWORD,
    },
  });

  return { email, username, token: auth.accessToken };
}

async function login(email) {
  return request('/auth/login', {
    method: 'POST',
    body: { email, password: PASSWORD },
  });
}

async function fetchPersistenceState(email, token) {
  const db = getPrisma();
  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      homeSceneCity: true,
      homeSceneState: true,
      homeSceneCommunity: true,
      tunedSceneId: true,
      gpsVerified: true,
      latitude: true,
      longitude: true,
      musicCommunityPreferences: {
        select: { musicCommunity: true, isDefault: true },
        orderBy: [{ isDefault: 'desc' }, { musicCommunity: 'asc' }],
      },
      communities: {
        select: { communityId: true },
      },
    },
  });

  const preferences = await request('/users/me/music-community-preferences', { token });
  const selector = await request('/users/me/home-scene-selector', { token });

  return { user, preferences, selector };
}

function assertDefaultPreference(state, musicCommunity) {
  const apiPreference = state.preferences.find(
    (preference) => preference.musicCommunity === musicCommunity && preference.isDefault === true,
  );
  const dbPreference = state.user?.musicCommunityPreferences.find(
    (preference) => preference.musicCommunity === musicCommunity && preference.isDefault === true,
  );

  assert(Boolean(apiPreference), 'API default music-community preference missing', {
    preferences: state.preferences,
    musicCommunity,
  });
  assert(Boolean(dbPreference), 'DB default music-community preference missing', {
    preferences: state.user?.musicCommunityPreferences,
    musicCommunity,
  });
}

function assertSelectorItem(state, expectation) {
  const item = state.selector.items.find((candidate) => candidate.musicCommunity === expectation.musicCommunity);
  assert(Boolean(item), 'Home Scene selector item missing', {
    selector: state.selector,
    musicCommunity: expectation.musicCommunity,
  });
  assert(item.isDefault === true, 'Home Scene selector item is not default', { item });
  assert(item.resolution === expectation.resolution, 'Home Scene selector resolution mismatch', {
    item,
    expected: expectation.resolution,
  });
  if (expectation.sceneId) {
    assert(item.sceneId === expectation.sceneId, 'Home Scene selector sceneId mismatch', {
      item,
      expected: expectation.sceneId,
    });
  }
  if (expectation.current === true) {
    assert(item.isCurrent === true, 'Home Scene selector item is not current', { item });
  }
  return item;
}

async function runManualAustinGpsSkipped() {
  const registered = await registerUser('manual-austin-skipped');
  const homeScene = await request('/onboarding/home-scene', {
    method: 'POST',
    token: registered.token,
    body: { city: 'Austin', state: 'TX', musicCommunity: 'Punk' },
  });
  const reloadedAuth = await login(registered.email);
  const state = await fetchPersistenceState(registered.email, reloadedAuth.accessToken);

  assert(state.user?.homeSceneCity === 'Austin', 'Austin manual Home Scene city did not persist', state.user);
  assert(state.user?.homeSceneState === 'Texas', 'Austin manual Home Scene state did not normalize/persist', state.user);
  assert(state.user?.homeSceneCommunity === 'Punk', 'Austin manual Home Scene music community did not persist', state.user);
  assert(state.user?.tunedSceneId === homeScene.sceneId, 'Austin manual tuned scene did not persist', {
    user: state.user,
    homeScene,
  });
  assert(state.user?.gpsVerified === false, 'GPS skipped scenario should not grant GPS verification', state.user);
  assert(homeScene.votingEligible === false, 'GPS skipped scenario should not be voting eligible', homeScene);
  assertDefaultPreference(state, 'Punk');
  const selectorItem = assertSelectorItem(state, {
    musicCommunity: 'Punk',
    resolution: 'natural',
    sceneId: homeScene.sceneId,
    current: true,
  });

  return {
    scenario: 'manual_austin_gps_skipped_persists_after_login',
    email: registered.email,
    submittedPostalCode: '78701',
    sceneId: homeScene.sceneId,
    resolvedCitySceneLabel: homeScene.resolvedCitySceneLabel,
    votingEligible: homeScene.votingEligible,
    gpsVerified: state.user.gpsVerified,
    selectorItem,
  };
}

async function runManualAustinGpsVerified() {
  const registered = await registerUser('manual-austin-verified');
  const coords = { latitude: 30.2672, longitude: -97.7431 };
  const homeScene = await request('/onboarding/home-scene', {
    method: 'POST',
    token: registered.token,
    body: { city: 'Austin', state: 'Texas', musicCommunity: 'Punk' },
  });
  const gps = await request('/onboarding/gps-verify', {
    method: 'POST',
    token: registered.token,
    body: coords,
  });
  const reloadedAuth = await login(registered.email);
  const state = await fetchPersistenceState(registered.email, reloadedAuth.accessToken);

  assert(gps.votingEligible === true, 'Austin GPS verification did not grant voting eligibility', gps);
  assert(state.user?.gpsVerified === true, 'Austin GPS verification did not persist after login', state.user);
  assert(state.user?.tunedSceneId === homeScene.sceneId, 'Austin verified tuned scene did not persist', {
    user: state.user,
    homeScene,
  });
  assertDefaultPreference(state, 'Punk');
  const selectorItem = assertSelectorItem(state, {
    musicCommunity: 'Punk',
    resolution: 'natural',
    sceneId: homeScene.sceneId,
    current: true,
  });

  return {
    scenario: 'manual_austin_gps_verified_persists_after_login',
    email: registered.email,
    sceneId: homeScene.sceneId,
    resolvedCitySceneLabel: homeScene.resolvedCitySceneLabel,
    votingEligible: gps.votingEligible,
    votingSceneId: gps.votingSceneId,
    gpsVerified: state.user.gpsVerified,
    selectorItem,
  };
}

async function runManualElPasoProxy() {
  const registered = await registerUser('manual-el-paso-proxy');
  const homeScene = await request('/onboarding/home-scene', {
    method: 'POST',
    token: registered.token,
    body: { city: 'El Paso', state: 'Texas', musicCommunity: 'Punk' },
  });
  const reloadedAuth = await login(registered.email);
  const state = await fetchPersistenceState(registered.email, reloadedAuth.accessToken);

  assert(state.user?.homeSceneCity === 'El Paso', 'El Paso submitted city did not persist', state.user);
  assert(state.user?.homeSceneState === 'Texas', 'El Paso submitted state did not persist', state.user);
  assert(state.user?.homeSceneCommunity === 'Punk', 'El Paso submitted music community did not persist', state.user);
  assert(state.user?.tunedSceneId === homeScene.sceneId, 'El Paso proxy tuned scene did not persist', {
    user: state.user,
    homeScene,
  });
  assert(homeScene.pioneer === true, 'El Paso should resolve through proxy compatibility path', homeScene);
  assertDefaultPreference(state, 'Punk');
  const selectorItem = assertSelectorItem(state, {
    musicCommunity: 'Punk',
    resolution: 'proxy',
    sceneId: homeScene.sceneId,
    current: true,
  });

  return {
    scenario: 'manual_el_paso_proxy_persists_after_login',
    email: registered.email,
    submittedPostalCode: '79901',
    pioneerHomeScene: homeScene.pioneerHomeScene,
    resolvedCitySceneLabel: homeScene.resolvedCitySceneLabel,
    sceneId: homeScene.sceneId,
    gpsVerified: state.user.gpsVerified,
    selectorItem,
  };
}

async function cleanup() {
  if (createdEmails.length === 0) return { users: 0, memberships: 0, decrementedCommunities: 0 };

  return getPrisma().$transaction(async (tx) => {
    const users = await tx.user.findMany({
      where: { email: { in: createdEmails } },
      select: { id: true },
    });
    const userIds = users.map((user) => user.id);
    if (userIds.length === 0) return { users: 0, memberships: 0, decrementedCommunities: 0 };

    const memberships = await tx.communityMember.findMany({
      where: { userId: { in: userIds } },
      select: { communityId: true },
    });
    const membershipCounts = new Map();
    for (const membership of memberships) {
      membershipCounts.set(membership.communityId, (membershipCounts.get(membership.communityId) ?? 0) + 1);
    }

    const deletedMemberships = await tx.communityMember.deleteMany({
      where: { userId: { in: userIds } },
    });

    let decrementedCommunities = 0;
    for (const [communityId, count] of membershipCounts.entries()) {
      const updated = await tx.community.updateMany({
        where: { id: communityId, memberCount: { gte: count } },
        data: { memberCount: { decrement: count } },
      });
      decrementedCommunities += updated.count;
    }

    const deletedUsers = await tx.user.deleteMany({ where: { id: { in: userIds } } });
    return {
      users: deletedUsers.count,
      memberships: deletedMemberships.count,
      decrementedCommunities,
    };
  });
}

async function main() {
  if (DRY_RUN) {
    console.log(JSON.stringify(buildDryRunPlan(), null, 2));
    return;
  }

  const target = await assertSmokeTargetAllowed();
  const health = await request('/health/ready');
  const results = [
    await runManualAustinGpsSkipped(),
    await runManualAustinGpsVerified(),
    await runManualElPasoProxy(),
  ];
  const cleanupResult = await cleanup();

  console.log(
    JSON.stringify(
      {
        smoke: 'authenticated-onboarding-persistence',
        apiUrl: API_URL,
        target,
        health,
        results,
        cleanup: cleanupResult,
      },
      null,
      2,
    ),
  );
}

main()
  .catch(async (error) => {
    const cleanupResult = await cleanup().catch((cleanupError) => ({ error: cleanupError.message }));
    console.error(
      JSON.stringify(
        {
          smoke: 'authenticated-onboarding-persistence',
          error: error.message,
          cleanup: cleanupResult,
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma?.$disconnect();
  });
