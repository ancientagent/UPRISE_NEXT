# Browser QA Lane Readiness

**Date:** 2026-06-25  
**Branch:** `docs/browser-qa-lane-readiness`  
**Base:** `main` at `a65d457`  
**Mode:** read-only staging/browser-QA preparation  
**Runtime changed:** no  
**Provider state changed:** no  
**Database writes run:** no  

## Summary

Browser/device onboarding QA is still blocked by the same staging CORS issue documented in `docs/handoff/2026-06-24_onboarding-browser-qa-blocked-cors.md`.

The Fly API and Neon/PostGIS health checks pass, but the Fly API still does not allow the current Vercel staging origins. Therefore a browser pass would not prove onboarding behavior; it would only run into API CORS failures.

## Read-Only Checks Run

API-only staging readiness smoke, with Google Places calls skipped:

```bash
UPRISE_SKIP_PLACES_CHECK=1 pnpm run smoke:staging:readiness
```

Result: passed.

Confirmed:

- `https://uprise-api-staging.fly.dev/health/live` returned `200`.
- `https://uprise-api-staging.fly.dev/health/db` returned `200`.
- `https://uprise-api-staging.fly.dev/health/postgis` returned `200`.
- `https://uprise-api-staging.fly.dev/health/ready` returned `200`.
- No API writes.
- No database writes.
- No provider mutation.
- Google Places behavior was skipped intentionally with `UPRISE_SKIP_PLACES_CHECK=1`.

Vercel `main` branch alias CORS check:

```bash
UPRISE_WEB_URL=https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app \
UPRISE_SKIP_PLACES_CHECK=1 \
pnpm run smoke:staging:readiness
```

Result:

```text
CORS allow-origin mismatch: expected https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app, received null
```

Stable Vercel project domain CORS check:

```bash
UPRISE_WEB_URL=https://uprise-web-staging.vercel.app \
UPRISE_SKIP_PLACES_CHECK=1 \
pnpm run smoke:staging:readiness
```

Result:

```text
CORS allow-origin mismatch: expected https://uprise-web-staging.vercel.app, received null
```

## Current Blocker

Classification: `environment`

Fly staging app `uprise-api-staging` must allow the intended Vercel staging web origin(s) in `CORS_ORIGIN` before browser/device QA can run meaningfully.

Minimum origins still needing confirmation/allowlisting:

- `https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app`
- `https://uprise-web-staging.vercel.app`

Do not change Fly secrets or provider config without explicit provider/account approval.

## Browser QA Matrix To Run After CORS Is Fixed

Use a stable authenticated browser session per `AGENTS.md`. Do not open a new browser/profile if the founder has already completed provider login/security checks.

1. Manual city/state/music-community entry persists submitted Home Scene intent.
2. GPS denied keeps submitted Home Scene intent and leaves voting disabled.
3. GPS accepted verifies voting eligibility for an exact active Home Scene.
4. Submitted location near an active launch city resolves correctly without replacing the canonical `city + state + music community` identity.
5. Inactive/unavailable Home Scene resolves to the active proxy scene for the selected parent music community.
6. Missing-music-community intake stores a request only; it does not create a live `Community` or mutate the approved selector list.
7. ZIP/postal code remains preview/context only and does not change Home Scene identity, proxy routing, or voting authority.
8. Profile/Home Scene roller shows registered/resolvable music-community preferences and excludes saved Away Scenes.

## Required Preflight Before Browser QA

Run these before claiming browser/device QA:

```bash
UPRISE_WEB_URL=<confirmed Vercel staging origin> \
UPRISE_SKIP_PLACES_CHECK=1 \
pnpm run smoke:staging:readiness
```

Then, if Google Places behavior is intentionally in scope and the staging key is expected to be active:

```bash
UPRISE_WEB_URL=<confirmed Vercel staging origin> \
pnpm run smoke:staging:readiness
```

Only after these pass should a live browser/device QA pass begin.

## What Was Not Done

- No browser/device QA was claimed.
- No Fly secret was changed.
- No Vercel setting was changed.
- No database writes or seed commands were run.
- No Google Places calls were made in the checks above.
- No untracked `art/` files were touched.

## Files Changed

- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_browser-qa-lane-readiness.md`

