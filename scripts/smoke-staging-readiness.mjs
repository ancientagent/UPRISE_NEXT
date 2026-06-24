#!/usr/bin/env node
const API_URL = process.env.UPRISE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://uprise-api-staging.fly.dev';
const WEB_URL = process.env.UPRISE_WEB_URL || process.env.NEXT_PUBLIC_WEB_APP_URL || '';
const EXPECTED_ORIGIN = process.env.UPRISE_EXPECTED_CORS_ORIGIN || (WEB_URL ? new URL(WEB_URL).origin : '');
const SKIP_PLACES = process.env.UPRISE_SKIP_PLACES_CHECK === '1';
const REQUIRED_HEALTH_PATHS = ['/health/live', '/health/db', '/health/postgis', '/health/ready'];

function toBaseUrl(value, label) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('must use http(s)');
    }
    return url.toString().replace(/\/$/, '');
  } catch (error) {
    throw new Error(`${label} must be a valid http(s) URL. Received: ${value || '<empty>'}`);
  }
}

const apiBase = toBaseUrl(API_URL, 'UPRISE_API_URL or NEXT_PUBLIC_API_URL');
const webBase = WEB_URL ? toBaseUrl(WEB_URL, 'UPRISE_WEB_URL or NEXT_PUBLIC_WEB_APP_URL') : null;

function apiUrl(path) {
  return `${apiBase}${path.startsWith('/') ? path : `/${path}`}`;
}

async function fetchJson(url, options = {}) {
  const started = Date.now();
  const response = await fetch(url, options);
  const elapsedMs = Date.now() - started;
  const body = await response.json().catch(async () => {
    const text = await response.text().catch(() => '');
    return text ? { text: text.slice(0, 500) } : null;
  });
  return { response, elapsedMs, body };
}

async function readHealth(path) {
  const { response, elapsedMs, body } = await fetchJson(apiUrl(path), {
    method: 'GET',
    headers: EXPECTED_ORIGIN ? { Origin: EXPECTED_ORIGIN } : undefined,
  });

  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}: ${JSON.stringify(body)}`);
  }

  return {
    check: `api:${path}`,
    status: response.status,
    elapsedMs,
    corsAllowOrigin: EXPECTED_ORIGIN
      ? response.headers.get('access-control-allow-origin') ?? null
      : 'not-checked',
    body,
  };
}

async function readWeb() {
  if (!webBase) {
    return { check: 'web:load', status: 'skipped', reason: 'Set UPRISE_WEB_URL to check the Vercel web surface.' };
  }

  const started = Date.now();
  const response = await fetch(webBase, { method: 'GET', redirect: 'manual' });
  const elapsedMs = Date.now() - started;
  const location = response.headers.get('location');

  if ([301, 302, 303, 307, 308].includes(response.status) && location?.includes('vercel.com/sso-api')) {
    return {
      check: 'web:load',
      url: webBase,
      status: 'protected',
      httpStatus: response.status,
      elapsedMs,
      reason:
        'Vercel Authentication redirected this unauthenticated smoke to SSO; use Vercel MCP/automation bypass or an authenticated browser session for full web-page proof.',
    };
  }

  const text = await response.text().catch(() => '');

  if (!response.ok) {
    throw new Error(`web load returned ${response.status} for ${webBase}`);
  }

  return {
    check: 'web:load',
    url: webBase,
    status: response.status,
    elapsedMs,
    contentType: response.headers.get('content-type') ?? null,
    htmlSample: text.slice(0, 120),
  };
}

async function checkCorsPreflight() {
  if (!EXPECTED_ORIGIN) {
    return {
      check: 'api:cors-preflight',
      status: 'skipped',
      reason: 'Set UPRISE_EXPECTED_CORS_ORIGIN or UPRISE_WEB_URL to check API CORS.',
    };
  }

  const response = await fetch(apiUrl('/health/ready'), {
    method: 'OPTIONS',
    headers: {
      Origin: EXPECTED_ORIGIN,
      'Access-Control-Request-Method': 'GET',
    },
  });
  const allowOrigin = response.headers.get('access-control-allow-origin');
  const allowMethods = response.headers.get('access-control-allow-methods');

  if (!response.ok && response.status !== 204) {
    throw new Error(`CORS preflight returned ${response.status} for ${EXPECTED_ORIGIN}`);
  }
  if (allowOrigin !== EXPECTED_ORIGIN && allowOrigin !== '*') {
    throw new Error(`CORS allow-origin mismatch: expected ${EXPECTED_ORIGIN}, received ${allowOrigin}`);
  }

  return {
    check: 'api:cors-preflight',
    status: response.status,
    origin: EXPECTED_ORIGIN,
    allowOrigin,
    allowMethods,
  };
}

function assertCityResult(payload, expectedCity, expectedStates) {
  const data = payload?.data ?? payload;
  const city = data?.city;
  const state = data?.state;
  if (city !== expectedCity || !expectedStates.includes(state)) {
    throw new Error(
      `Places reverse returned unexpected locality: ${JSON.stringify({ city, state, expectedCity, expectedStates })}`
    );
  }
  return data;
}

async function checkPlaces() {
  if (SKIP_PLACES) {
    return {
      check: 'api:places-google-behavior',
      status: 'skipped',
      reason: 'UPRISE_SKIP_PLACES_CHECK=1; Google-backed public Places endpoints were not called.',
    };
  }

  const reverse = await fetchJson(apiUrl('/places/reverse?latitude=30.2672&longitude=-97.7431&country=US'));
  if (!reverse.response.ok) {
    throw new Error(`/places/reverse returned ${reverse.response.status}: ${JSON.stringify(reverse.body)}`);
  }
  const reverseData = assertCityResult(reverse.body, 'Austin', ['TX', 'Texas']);

  const autocomplete = await fetchJson(apiUrl('/places/cities?input=Austin&country=us'));
  if (!autocomplete.response.ok) {
    throw new Error(`/places/cities returned ${autocomplete.response.status}: ${JSON.stringify(autocomplete.body)}`);
  }
  const suggestions = autocomplete.body?.data ?? [];
  if (!Array.isArray(suggestions) || !suggestions.some((item) => String(item.description).includes('Austin'))) {
    throw new Error(`Places autocomplete did not return an Austin suggestion: ${JSON.stringify(autocomplete.body)}`);
  }

  return {
    check: 'api:places-google-behavior',
    status: 'passed',
    note: 'Calls public API Places endpoints; hosted API may call Google Geocoding and Place Autocomplete unless fake provider is enabled.',
    reverse: {
      status: reverse.response.status,
      elapsedMs: reverse.elapsedMs,
      city: reverseData.city,
      state: reverseData.state,
      postalCode: reverseData.postalCode ?? null,
    },
    autocomplete: {
      status: autocomplete.response.status,
      elapsedMs: autocomplete.elapsedMs,
      suggestionCount: suggestions.length,
      firstSuggestion: suggestions[0] ?? null,
    },
  };
}

async function main() {
  const checks = [];
  checks.push(await readWeb());
  for (const path of REQUIRED_HEALTH_PATHS) {
    checks.push(await readHealth(path));
  }
  checks.push(await checkCorsPreflight());
  checks.push(await checkPlaces());

  const healthCorsMismatches = EXPECTED_ORIGIN
    ? checks.filter(
        (check) =>
          typeof check.corsAllowOrigin === 'string' &&
          check.corsAllowOrigin !== EXPECTED_ORIGIN &&
          check.corsAllowOrigin !== '*'
      )
    : [];
  if (healthCorsMismatches.length > 0) {
    throw new Error(
      `CORS origin mismatch for ${healthCorsMismatches.map((check) => check.check).join(', ')}; expected ${EXPECTED_ORIGIN}`
    );
  }

  console.log(
    JSON.stringify(
      {
        smoke: 'staging-readiness',
        apiUrl: apiBase,
        webUrl: webBase,
        expectedOrigin: EXPECTED_ORIGIN || null,
        writesApi: false,
        writesDatabase: false,
        mutatesProviderState: false,
        checks,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(JSON.stringify({ smoke: 'staging-readiness', error: error.message }, null, 2));
  process.exitCode = 1;
});
