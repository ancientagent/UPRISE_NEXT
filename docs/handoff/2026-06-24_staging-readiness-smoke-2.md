# 2026-06-24 - Staging Readiness Smoke 2

Branch: `chore/staging-readiness-smoke-2`
Mode: non-destructive staging verification / repo-side smoke hardening
Runtime changed: no product behavior changed
Provider state changed: no
Database writes run: no

## 2026-06-25 Status Update

The prior Fly staging CORS mismatch is resolved for the current staging origins.
Fly app `uprise-api-staging` accepts CORS preflight requests from:

- `https://uprise-web-staging.vercel.app`
- `https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app`

Follow-up verification:

```bash
UPRISE_WEB_URL=https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app pnpm run smoke:staging:readiness
```

Result: passed API health, Neon DB, PostGIS, readiness, CORS preflight, and
public Places checks. Web load remains `protected` behind Vercel Authentication
for unauthenticated HTTP.

## Summary

This slice adds one repeatable root smoke command for the current Vercel -> Fly -> Neon/PostGIS staging path:

```bash
pnpm run smoke:staging:readiness
```

The command is read-only and reports:

- Vercel web URL load state when `UPRISE_WEB_URL` is supplied.
- Fly API health: `/health/live`, `/health/db`, `/health/postgis`, `/health/ready`.
- Optional API CORS preflight when `UPRISE_EXPECTED_CORS_ORIGIN` or `UPRISE_WEB_URL` is supplied.
- Public Places behavior through `/places/reverse` and `/places/cities` unless `UPRISE_SKIP_PLACES_CHECK=1` is set.

## Live Verification Evidence

Repo state before work:

- `main` matched `origin/main` at `452fdf2`.
- Tracked worktree was clean.
- Existing untracked files were user-owned `art/` assets and were not touched.

Read-only Vercel lookup:

- Project: `uprise-web-staging`.
- Team: `team_TqZNzO9ssCsNnMGeqCzbYwEc`.
- Latest production deployment for `main`: `uprise-web-staging-mzvvb4z5f-ben-risemans-projects.vercel.app`.
- Branch alias: `uprise-web-staging-git-main-ben-risemans-projects.vercel.app`.
- Deployment commit: `452fdf20744651a4fd61d0dc765b69cea1c0ffdd`.

Read-only API smoke passed with default API target:

```bash
pnpm run smoke:staging:readiness
```

Confirmed:

- `https://uprise-api-staging.fly.dev/health/live` returned `200` healthy.
- `https://uprise-api-staging.fly.dev/health/db` returned `200` healthy against hosted PostgreSQL.
- `https://uprise-api-staging.fly.dev/health/postgis` returned `200` healthy with PostGIS `3.6`, `spatialRefSysCount: 8500`, and spatial functionality passing.
- `https://uprise-api-staging.fly.dev/health/ready` returned `200` healthy with API/database/PostGIS checks.
- `/places/reverse?latitude=30.2672&longitude=-97.7431&country=US` returned Austin, `TX`.
- `/places/cities?input=Austin&country=us` returned Austin suggestions.

## Current Blocker Found

When run with the current Vercel `main` branch alias:

```bash
UPRISE_WEB_URL=https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app \
  pnpm run smoke:staging:readiness
```

The smoke fails on CORS:

```text
CORS allow-origin mismatch: expected https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app, received null
```

Manual preflight confirmed the same for both current Vercel origins:

- `https://uprise-web-staging-mzvvb4z5f-ben-risemans-projects.vercel.app`
- `https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app`

Both return `204` to `OPTIONS /health/ready`, but omit `access-control-allow-origin`.

This means the Fly API is healthy and the Google-backed Places behavior works, but current Fly `CORS_ORIGIN` does not authorize the current Vercel deployment URL or branch alias. No Fly secret was changed in this slice.

## Vercel Auth Note

Direct unauthenticated HTTP requests to the current Vercel URLs return a Vercel Authentication redirect to `vercel.com/sso-api`. The smoke now reports this as `web:load` status `protected` instead of following the redirect and mistaking the auth page for the app.

For full web-page proof, use one of:

- Vercel MCP protected URL fetch.
- A stable authenticated browser session per `AGENTS.md`.
- Vercel automation bypass if explicitly configured.

## Files Changed

- `scripts/smoke-staging-readiness.mjs`
- `package.json`
- `apps/api/test/staging-readiness-smoke.test.ts`
- `docs/CHANGELOG.md`
- `docs/DEPLOY_ENV_MATRIX_R1.md`
- `docs/DEPLOY_ACCOUNT_SETUP_CHECKLIST_R1.md`
- `docs/handoff/2026-06-24_staging-readiness-smoke-2.md`

## Validation

Run in this slice:

```bash
pnpm --filter api test -- staging-readiness-smoke.test.ts --runInBand
pnpm run smoke:staging:readiness
UPRISE_WEB_URL=https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app pnpm run smoke:staging:readiness
```

The final command intentionally failed on the CORS origin mismatch above.

## Next Action

Update Fly staging `CORS_ORIGIN` only after explicitly confirming the intended stable Vercel staging origin(s). Recommended minimum candidates from current provider state:

- `https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app`
- a stable custom staging domain, when selected

After the Fly secret update/redeploy, rerun:

```bash
UPRISE_WEB_URL=<confirmed staging web origin> pnpm run smoke:staging:readiness
```
