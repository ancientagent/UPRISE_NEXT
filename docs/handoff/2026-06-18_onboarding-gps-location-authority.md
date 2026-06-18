# Onboarding GPS Location Authority

Date: 2026-06-18
Branch: `fix/onboarding-gps-location-authority`
Scope: `/onboarding` Home Scene location authority, GPS voting verification, pioneer fallback

## Founder Correction

Location entry is manual-first, with GPS as the decider only when the user does not manually provide location:

- If the user enters city/state and denies or skips GPS, that submitted city/state remains the Home Scene intent.
- Denying or skipping GPS does not block participation; it only disables voting rights.
- If the user does not enter city/state and accepts GPS, reverse geocoding supplies the submitted city/state before Home Scene review.
- In both manual and GPS-derived cases, if the selected city-tier scene is inactive or unavailable, onboarding preserves the submitted city/state/music-community as pioneer intent and routes the active listening/voting anchor to the nearest active city-tier scene for that parent music community.

## Runtime Fix

`apps/web/src/app/onboarding/page.tsx` now rechecks stored GPS coordinates after authenticated Home Scene persistence.

Why this matters:

- A user can accept GPS before choosing a Home Scene.
- The first `/onboarding/gps-verify` call may correctly return `NO_HOME_SCENE` because no scene exists yet.
- After `/onboarding/home-scene` succeeds, the UI must reuse the stored coordinates and call `/onboarding/gps-verify` again so GPS-first onboarding can enable voting without requiring the user to press GPS twice.

## Docs Updated

- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`

## Tests Updated

- `apps/web/__tests__/onboarding-page-lock.test.ts`

The lock asserts that onboarding reads `gpsCoords`, has `refreshGpsVotingEligibility`, rechecks stored coordinates after Home Scene submit, and preserves the `NO_HOME_SCENE` pre-selection case.

## Verification

Run:

```bash
pnpm --filter web test -- onboarding-page-lock.test.ts
pnpm run docs:lint
git diff --check
```
