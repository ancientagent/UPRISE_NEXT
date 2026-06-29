# 2026-06-29 Staging Truth Refresh

## Status

Read-only provider/staging truth pass from `main` at `90e5f95`.

Runtime changed: no
Provider state changed: no
Database writes run: no
Deploys run: no
Secrets read or changed: no

## Summary

The previous browser-QA blocker that said Fly staging did not allow Vercel staging origins is no longer current. As of this pass, the stable Vercel staging web URL loads publicly, the Fly API is healthy, Neon/PostGIS is healthy through API readiness checks, and Vercel-to-Fly CORS passes for both documented Vercel staging origins.

## Verified Current Staging Shape

- Web provider: Vercel.
- Vercel project: `uprise-web-staging`.
- Vercel project ID: `prj_4Z25uKShCFZBrI6s0VVRy3XrSruR`.
- Vercel team/account ID: `team_TqZNzO9ssCsNnMGeqCzbYwEc`.
- Latest production deployment: `dpl_8n5EvLvf28pPCSxkLGQSDRsT33iT`, state `READY`.
- Latest production deployment commit: `90e5f95b6504cb940ca2d460fb1707034ef75703`.
- Stable web URL: `https://uprise-web-staging.vercel.app`.
- Git main branch alias: `https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app`.
- API provider: Fly.
- API app URL: `https://uprise-api-staging.fly.dev`.
- Database provider: Neon Postgres/PostGIS.
- Neon organization: `UPRISE`.
- Neon project: `uprise` / `misty-fire-63832725`.
- Neon branch: `staging` / `br-lucky-water-atjlgbjo`.
- Neon compute: `ep-damp-cake-atvclrj2`, read-write, active.

## Read-Only Checks Run

API health smoke:

```bash
UPRISE_API_URL=https://uprise-api-staging.fly.dev pnpm run smoke:staging:api
```

Result: passed.

Confirmed:

- `/health/live` returned `200`.
- `/health/db` returned `200`.
- `/health/postgis` returned `200`.
- `/health/ready` returned `200`.
- Postgres reported healthy through API readiness.
- PostGIS reported healthy through API readiness.
- No API writes.
- No database writes.

Readiness smoke without web/CORS/Places:

```bash
UPRISE_SKIP_PLACES_CHECK=1 pnpm run smoke:staging:readiness
```

Result: passed.

Stable Vercel staging URL + CORS smoke:

```bash
UPRISE_API_URL=https://uprise-api-staging.fly.dev \
UPRISE_WEB_URL=https://uprise-web-staging.vercel.app \
UPRISE_SKIP_PLACES_CHECK=1 \
pnpm run smoke:staging:readiness
```

Result: passed.

Confirmed:

- `https://uprise-web-staging.vercel.app` returned `200`.
- API health endpoints returned `access-control-allow-origin: https://uprise-web-staging.vercel.app`.
- API CORS preflight returned `204` with `allowOrigin: https://uprise-web-staging.vercel.app`.

Git main branch alias + CORS smoke:

```bash
UPRISE_API_URL=https://uprise-api-staging.fly.dev \
UPRISE_WEB_URL=https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app \
UPRISE_SKIP_PLACES_CHECK=1 \
pnpm run smoke:staging:readiness
```

Result: passed with web-load caveat.

Confirmed:

- The git main branch alias direct web load returned Vercel-auth `protected` / SSO redirect for unauthenticated HTTP.
- API health endpoints returned `access-control-allow-origin: https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app`.
- API CORS preflight returned `204` with `allowOrigin: https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app`.

Direct HTTP spot check:

```bash
curl -I -L --max-time 15 https://uprise-web-staging.vercel.app
curl -I -L --max-time 15 https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app
curl -sS -D - --max-time 15 https://uprise-api-staging.fly.dev/health/ready
```

Confirmed:

- Stable Vercel staging URL returned `200` and web-tier guard headers.
- Git main branch alias redirected to Vercel SSO.
- Fly `/health/ready` returned `200`.

Provider connector checks:

- Vercel MCP `get_project` confirmed project `uprise-web-staging`, domains, latest production deployment, and project identity.
- Vercel MCP `list_deployments` confirmed latest production deployment for commit `90e5f95` is `READY`.
- Neon MCP search confirmed project `uprise` and organization `UPRISE`.
- Neon MCP search confirmed branch `staging`.
- Neon MCP `list_branch_computes` confirmed active read-write compute for the staging branch.

## What Was Not Run

- Google Places behavior was intentionally skipped with `UPRISE_SKIP_PLACES_CHECK=1` to avoid unnecessary provider/API usage.
- Launch-community DB verifier was not run because it requires a `DATABASE_URL`; no connection string was requested or used in this pass.
- Music-community preference DB verifier was not run because it requires a `DATABASE_URL`; no connection string was requested or used in this pass.
- No Fly CLI, Vercel CLI, or Neon CLI command was run. Those CLIs were not installed in this WSL session.
- No seed, migration, deploy, provider-secret edit, or provider-resource mutation was run.

## Media Posture Confirmed

Media remains URL-only for the current MVP path.

- Release Deck accepts hosted `http(s)` audio URLs.
- Real upload, object storage, transcoding, waveform extraction, queue runtime, and worker deployment remain deferred per `docs/solutions/MEDIA_STORAGE_DECISION_PACKET_R1.md`.
- The existing worker code is scaffold/prototype infrastructure, not an active production dependency for the current Vercel/Fly/Neon staging path.

## Current Blockers / Follow-Up

1. Google Places behavior still needs one intentional quota-aware smoke if provider-backed geocoding/autocomplete is in scope.
2. Launch-community seed/geofence state still needs read-only DB verification against the confirmed Neon staging database before claiming data readiness.
3. Music-community preference compatibility data still needs read-only DB verification before any schema cleanup or compatibility demotion.
4. Browser/device onboarding QA can now proceed against the stable staging URL from a normal web-load/CORS standpoint, but should still start with an authenticated-session plan and no database writes unless explicitly confirmed.
5. Media upload/storage/transcoding should remain out of production readiness until explicitly activated.

## Files Changed

- `docs/CHANGELOG.md`
- `docs/DEPLOY_ENV_MATRIX_R1.md`
- `docs/handoff/2026-06-29_staging-truth-refresh.md`
