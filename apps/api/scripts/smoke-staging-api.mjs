#!/usr/bin/env node
const API_URL = process.env.UPRISE_API_URL || process.env.NEXT_PUBLIC_API_URL;
const EXPECTED_ORIGIN = process.env.UPRISE_EXPECTED_CORS_ORIGIN;
const REQUIRED_HEALTH_PATHS = ['/health/live', '/health/db', '/health/postgis', '/health/ready'];

if (!API_URL) {
  console.error(
    'Set UPRISE_API_URL or NEXT_PUBLIC_API_URL to the hosted API base URL before running this read-only smoke.'
  );
  process.exit(1);
}

function apiUrl(path) {
  return new URL(path, API_URL.endsWith('/') ? API_URL : `${API_URL}/`).toString();
}

async function readHealth(path) {
  const started = Date.now();
  const response = await fetch(apiUrl(path), {
    method: 'GET',
    headers: EXPECTED_ORIGIN ? { Origin: EXPECTED_ORIGIN } : undefined,
  });
  const elapsedMs = Date.now() - started;
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}: ${JSON.stringify(body)}`);
  }

  return {
    path,
    status: response.status,
    elapsedMs,
    cors: EXPECTED_ORIGIN
      ? response.headers.get('access-control-allow-origin') ?? null
      : 'not-checked',
    body,
  };
}

async function main() {
  const checks = [];
  for (const path of REQUIRED_HEALTH_PATHS) {
    checks.push(await readHealth(path));
  }

  if (EXPECTED_ORIGIN) {
    const mismatchedCors = checks.filter(
      (check) => check.cors !== EXPECTED_ORIGIN && check.cors !== '*'
    );
    if (mismatchedCors.length > 0) {
      throw new Error(
        `CORS origin mismatch for ${mismatchedCors.map((check) => check.path).join(', ')}; expected ${EXPECTED_ORIGIN}`
      );
    }
  }

  console.log(
    JSON.stringify(
      {
        smoke: 'staging-api-health',
        apiUrl: API_URL,
        expectedOrigin: EXPECTED_ORIGIN ?? null,
        writesDatabase: false,
        checks,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(JSON.stringify({ smoke: 'staging-api-health', error: error.message }, null, 2));
  process.exitCode = 1;
});
