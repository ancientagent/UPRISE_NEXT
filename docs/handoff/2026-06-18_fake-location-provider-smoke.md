# Fake Location Provider Smoke

Date: 2026-06-18
Branch: `fix/fake-location-provider-smokes`
Area: onboarding / Home Scene / GPS smoke testing

## Summary

Added a local fake location provider for onboarding location smoke tests so agents can exercise manual location, GPS-first reverse geocoding, and pioneer fallback flows without calling Google Maps Platform APIs.

## What Changed

- `apps/api/src/places/places.service.ts`
  - Supports `UPRISE_LOCATION_PROVIDER=fake`.
  - Returns deterministic launch-city suggestions and reverse geocode results from local fixtures.
  - Does not call `fetch` or use `GOOGLE_PLACES_API_KEY` while fake mode is active.
- `apps/api/test/places.service.test.ts`
  - Locks fake reverse geocoding for Austin and El Paso.
  - Locks fake autocomplete for Austin.
  - Asserts Google/fetch is not called in fake mode.
- `apps/api/scripts/smoke-onboarding-location.mjs`
  - Runs a local API smoke against:
    - manual Austin location with GPS denied/skipped
    - GPS-first Austin onboarding
    - El Paso pioneer fallback to nearest active Punk scene
  - Cleans up the temporary QA users it creates.
- `apps/api/package.json`
  - Adds `pnpm --filter api run smoke:onboarding-location`.
- `apps/api/.env.example` and `docs/ENVIRONMENTS.md`
  - Document `UPRISE_LOCATION_PROVIDER`.

## Local Usage

Use fake mode for local/dev smoke testing:

```bash
UPRISE_LOCATION_PROVIDER=fake
```

Restart the API after changing the env, then run:

```bash
pnpm --filter api run smoke:onboarding-location
```

Expected scenario coverage:

- Manual city/state remains authoritative when GPS is skipped or denied; voting remains disabled.
- GPS-first flow can reverse geocode Austin, persist Home Scene, then recheck GPS for voting eligibility.
- El Paso/Punk pioneer intent is preserved while voting is enabled in the resolved nearest active fallback scene after submitted-location verification.

## Cost Boundary

Fake mode is the default local smoke path and should not call Google.

Use Google mode only for intentional provider validation:

```bash
UPRISE_LOCATION_PROVIDER=google
GOOGLE_PLACES_API_KEY=...
```

Do not use provider-backed Google calls for routine local regression testing.

## Verification Evidence

Local smoke command run:

```bash
pnpm --filter api run smoke:onboarding-location
```

Observed result:

- API health healthy.
- Database healthy.
- PostGIS healthy.
- `manual_austin_denied_gps`: `Austin, Texas • Punk`, `pioneer=false`, `votingEligible=false`.
- `gps_first_austin`: detected `Austin, Texas, USA`, pre-home GPS reason `NO_HOME_SCENE`, post-home voting eligible.
- `pioneer_el_paso_fallback`: pioneer intent `El Paso, Texas • Punk`, resolved fallback `Austin, Texas • Punk`, voting eligible.
- Cleanup removed `3` temporary users and `3` memberships.

## Future-Agent Notes

- Local `apps/api/.env` is ignored and may be configured with `UPRISE_LOCATION_PROVIDER=fake`; do not commit local secrets or local env state.
- Staging/prod Google provider secrets are separate provider configuration. This slice does not remove or rotate provider secrets.
- If a future agent needs to verify Google integration specifically, run one narrow provider-backed test with an explicit quota-aware reason, then return routine smokes to fake mode.
