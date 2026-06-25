# 2026-06-24 - Onboarding Browser QA Blocked By Staging CORS

Branch: `test/onboarding-browser-qa`
Mode: Task 3 browser/device QA preparation
Runtime changed: no
Provider state changed: no
Database writes run: no

## 2026-06-25 Status Update

Resolved for the current staging origins. Fly staging app `uprise-api-staging`
now allows:

- `https://uprise-web-staging.vercel.app`
- `https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app`

Evidence: direct CORS preflights returned `HTTP/2 204` with matching
`access-control-allow-origin`, and
`UPRISE_WEB_URL=https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app pnpm run smoke:staging:readiness`
passed API live, DB, PostGIS, ready, CORS preflight, and public Places checks.
Unauthenticated web load remains `protected` because Vercel Authentication
redirects to SSO, which is expected.

## Summary

Task 3 from the launch list is the onboarding browser/device QA pass. It should
exercise the deployed web UI for:

- manual location entry
- GPS denied
- GPS accepted
- pioneer fallback to the nearest active city-tier scene for the selected parent
  music community
- missing-music-community intake

This QA pass is currently blocked before valid browser exercise can begin
because the deployed Fly API does not return `access-control-allow-origin` for
the current Vercel staging origins.

## Current Repo State

- Base commit: `eaf7e86`
- Branch: `test/onboarding-browser-qa`
- Tracked worktree before this handoff: clean
- Existing untracked files: user-owned `art/` assets; not inspected or touched

## Evidence

Read-only staging readiness smoke:

```bash
UPRISE_WEB_URL=https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app \
  pnpm run smoke:staging:readiness
```

Result:

```text
CORS allow-origin mismatch: expected https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app, received null
```

Manual preflight for the Vercel `main` branch alias:

```bash
curl -i -X OPTIONS https://uprise-api-staging.fly.dev/health/ready \
  -H 'Origin: https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app' \
  -H 'Access-Control-Request-Method: GET'
```

Observed:

```text
HTTP/2 204
vary: Origin, Access-Control-Request-Headers
access-control-allow-credentials: true
access-control-allow-methods: GET,HEAD,PUT,PATCH,POST,DELETE
```

The response omits `access-control-allow-origin`.

Manual preflight for the stable Vercel project domain:

```bash
curl -i -X OPTIONS https://uprise-api-staging.fly.dev/health/ready \
  -H 'Origin: https://uprise-web-staging.vercel.app' \
  -H 'Access-Control-Request-Method: GET'
```

Observed:

```text
HTTP/2 204
vary: Origin, Access-Control-Request-Headers
access-control-allow-credentials: true
access-control-allow-methods: GET,HEAD,PUT,PATCH,POST,DELETE
```

The response also omits `access-control-allow-origin`.

## Classification

`environment`

The blocker is not currently evidence of an onboarding implementation bug. The
web/API staging path must allow the intended Vercel origin before browser QA can
prove or disprove onboarding behavior.

## Required Unblock

Confirm the intended staging web origin(s), then update Fly staging app
`uprise-api-staging` so API `CORS_ORIGIN` includes at least:

- `https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app`
- `https://uprise-web-staging.vercel.app`

Do not change Fly secrets without explicit provider/account approval. After the
secret update and API restart/redeploy, rerun:

```bash
UPRISE_WEB_URL=https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app \
  pnpm run smoke:staging:readiness

UPRISE_WEB_URL=https://uprise-web-staging.vercel.app \
  pnpm run smoke:staging:readiness
```

## QA Matrix To Run After CORS Is Fixed

Run the browser/device QA from a stable authenticated browser session per
`AGENTS.md`; do not open a fresh browser/profile if the user has already passed
provider login checks.

- Manual city/state/music-community entry persists Home Scene intent.
- GPS denied keeps the submitted Home Scene intent and leaves voting disabled.
- GPS accepted verifies voting eligibility for an exact active Home Scene.
- Inactive/unavailable Home Scene preserves pioneer intent and resolves the
  active listening/voting anchor to the nearest active city-tier scene for the
  selected music community.
- Missing-music-community intake stores a request only; it must not create a
  selectable onboarding option or live `Community`.
- Community identity remains `city + state + music community`; no city-only or
  genre-only fallback.

## What Was Not Done

- No browser/device QA was claimed.
- No Fly secret was changed.
- No Vercel setting was changed.
- No database writes or seed commands were run.
- No global installs were performed.
- User-owned `art/` files were not touched.
