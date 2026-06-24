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

function assertSmokeTargetAllowed() {
  const host = resolveApiHost();
  if (isLocalApiHost(host)) return;

  const requiredConfirmation = `smoke-onboarding-location:${host}`;
  if (process.env.UPRISE_CONFIRM_ONBOARDING_SMOKE !== requiredConfirmation) {
    throw new Error(
      [
        `Refusing onboarding smoke writes against non-local API ${API_URL}.`,
        'This smoke registers temporary users and cleans them up through the configured Prisma database.',
        `Set UPRISE_CONFIRM_ONBOARDING_SMOKE=${requiredConfirmation} only after confirming API and DATABASE_URL target the intended staging environment.`,
      ].join(' '),
    );
  }
}

function buildDryRunPlan() {
  const host = resolveApiHost();
  const requiredConfirmation = isLocalApiHost(host) ? null : `smoke-onboarding-location:${host}`;

  return {
    smoke: 'onboarding-location',
    mode: 'dry-run',
    apiUrl: API_URL,
    writesApi: false,
    writesDatabase: false,
    nonLocalConfirmationRequired: requiredConfirmation,
    scenarios: [
      {
        name: 'manual_austin_denied_gps',
        proves: 'Manual city/state/music-community remains Home Scene intent when GPS is skipped or denied; voting remains disabled.',
      },
      {
        name: 'gps_first_austin',
        proves: 'GPS-first reverse geocoding can supply submitted city/state before Home Scene persistence, then GPS is rechecked after Home Scene exists.',
      },
      {
        name: 'pioneer_el_paso_fallback',
        proves: 'Inactive/unavailable submitted city preserves pioneer intent while routing voting/listening to the nearest active city-tier scene.',
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

async function registerUser(label) {
  const safeLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const email = `qa-${safeLabel}-${RUN_ID}@uprise.local`;
  createdEmails.push(email);
  const auth = await request('/auth/register', {
    method: 'POST',
    body: {
      email,
      username: `qa${safeLabel}${RUN_ID}`.replace(/[^a-z0-9]/g, '').slice(0, 30),
      displayName: `QA ${label}`,
      password: PASSWORD,
      confirmPassword: PASSWORD,
    },
  });

  return { email, token: auth.accessToken };
}

async function runManualAustinDeniedGps() {
  const user = await registerUser('manual-austin');
  const homeScene = await request('/onboarding/home-scene', {
    method: 'POST',
    token: user.token,
    body: { city: 'Austin', state: 'Texas', musicCommunity: 'Punk' },
  });

  return {
    scenario: 'manual_austin_denied_gps',
    email: user.email,
    sceneId: homeScene.sceneId,
    resolvedCitySceneLabel: homeScene.resolvedCitySceneLabel,
    pioneer: homeScene.pioneer,
    votingEligible: homeScene.votingEligible,
  };
}

async function runGpsFirstAustin() {
  const user = await registerUser('gps-austin');
  const coords = { latitude: 30.2672, longitude: -97.7431 };
  const preHomeGps = await request('/onboarding/gps-verify', {
    method: 'POST',
    token: user.token,
    body: coords,
  });
  const detected = await request('/places/reverse?latitude=30.2672&longitude=-97.7431&country=US');
  const homeScene = await request('/onboarding/home-scene', {
    method: 'POST',
    token: user.token,
    body: { city: detected.city, state: detected.state, musicCommunity: 'Punk' },
  });
  const postHomeGps = await request('/onboarding/gps-verify', {
    method: 'POST',
    token: user.token,
    body: coords,
  });

  return {
    scenario: 'gps_first_austin',
    email: user.email,
    detected,
    preHomeGpsReason: preHomeGps.reason,
    resolvedCitySceneLabel: homeScene.resolvedCitySceneLabel,
    pioneer: homeScene.pioneer,
    postHomeVotingEligible: postHomeGps.votingEligible,
    postHomeVotingSceneId: postHomeGps.votingSceneId,
    postHomeReason: postHomeGps.reason,
  };
}

async function runPioneerElPasoFallback() {
  const user = await registerUser('pioneer-el-paso');
  const coords = { latitude: 31.7619, longitude: -106.485 };
  const homeScene = await request('/onboarding/home-scene', {
    method: 'POST',
    token: user.token,
    body: { city: 'El Paso', state: 'Texas', musicCommunity: 'Punk' },
  });
  const gps = await request('/onboarding/gps-verify', {
    method: 'POST',
    token: user.token,
    body: coords,
  });

  return {
    scenario: 'pioneer_el_paso_fallback',
    email: user.email,
    pioneerHomeScene: homeScene.pioneerHomeScene,
    resolvedCitySceneLabel: homeScene.resolvedCitySceneLabel,
    pioneer: homeScene.pioneer,
    votingEligible: gps.votingEligible,
    votingSceneId: gps.votingSceneId,
    reason: gps.reason,
  };
}

async function cleanup() {
  if (createdEmails.length === 0) return { users: 0, memberships: 0 };
  const db = getPrisma();
  const users = await db.user.findMany({
    where: { email: { in: createdEmails } },
    select: { id: true },
  });
  const userIds = users.map((user) => user.id);
  const memberships = userIds.length
    ? await db.communityMember.deleteMany({ where: { userId: { in: userIds } } })
    : { count: 0 };
  const deletedUsers = await db.user.deleteMany({ where: { email: { in: createdEmails } } });
  return { users: deletedUsers.count, memberships: memberships.count };
}

async function main() {
  if (DRY_RUN) {
    console.log(JSON.stringify(buildDryRunPlan(), null, 2));
    return;
  }

  assertSmokeTargetAllowed();

  const health = await request('/health/ready');
  const results = [
    await runManualAustinDeniedGps(),
    await runGpsFirstAustin(),
    await runPioneerElPasoFallback(),
  ];
  const cleanupResult = await cleanup();

  console.log(JSON.stringify({ apiUrl: API_URL, health, results, cleanup: cleanupResult }, null, 2));
}

main()
  .catch(async (error) => {
    const cleanupResult = await cleanup().catch((cleanupError) => ({ error: cleanupError.message }));
    console.error(JSON.stringify({ error: error.message, cleanup: cleanupResult }, null, 2));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma?.$disconnect();
  });
