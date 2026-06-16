# Submitted-Location GPS Authority

Date: 2026-06-16
Branch: `feat/submitted-location-gps-authority`
Agent: Codex

## Summary

This slice separates GPS verification authority from fallback voting authority for pioneer users.

- Exact active Home Scene: GPS verifies against the exact community geofence/radius.
- Inactive or unavailable submitted Home Scene: GPS verifies the submitted city/state locality by reverse-geocoding the user's coordinates.
- Fallback voting: `User.tunedSceneId` remains the resolved active city-tier voting anchor for the same parent music community.
- Pioneer intent: submitted `city + state + musicCommunity` remains stored on the user.

## Why

Founder correction: if a user's submitted Home Scene is unavailable, they should still verify that they are in the submitted location for voting eligibility. They should not have to physically be in the fallback city. After verification, they may vote in the nearest known active fallback community.

## Runtime Changes

- `apps/api/src/onboarding/onboarding.service.ts`
  - Exact active Home Scenes keep PostGIS geofence verification.
  - Pioneer fallback users verify submitted city/state through `PlacesService.reverseGeocode`.
  - New GPS failure reasons:
    - `SUBMITTED_LOCATION_NOT_VERIFIED`
    - `SUBMITTED_LOCATION_MISMATCH`
  - No inactive `Community` rows are created.
- `apps/api/src/onboarding/onboarding.module.ts`
  - Imports `PlacesModule` for reverse-geocode verification.
- `apps/api/src/places/places.module.ts`
  - Exports `PlacesService`.
- `apps/web/src/app/onboarding/page.tsx`
  - Maps the new reason codes into listener-facing copy.

## Test Evidence

Red/green was used for this slice.

- API red:
  - `pnpm --filter api test -- onboarding.home-scene-resolution.test.ts --runInBand`
  - Failed because the old implementation attempted fallback geofence verification for a pioneer submitted-location case.
- API green:
  - `pnpm --filter api test -- onboarding.home-scene-resolution.test.ts --runInBand`
  - Passed after submitted-location verification was implemented.
- Web red:
  - `pnpm --filter web test -- onboarding-page-lock.test.ts --runInBand`
  - Failed because the UI had no display mapping for the new reason codes.
- Web green:
  - `pnpm --filter web test -- onboarding-page-lock.test.ts --runInBand`
  - Passed after adding display mapping.

## Boundaries

- No database migration.
- No production/provider changes.
- No launch city or music-community one-off runtime logic.
- No change to the launch community matrix.
- User-owned `art/` files were not touched.

## Follow-Up Verification

Staging smoke should verify:

1. Exact Austin/Punk user verifies GPS with Austin coordinates and votes in Austin/Punk.
2. Pioneer El Paso/Texas/Punk user verifies GPS with El Paso coordinates, receives Austin/Punk as fallback voting scene, and can vote in that fallback scene.
3. Pioneer El Paso/Texas/Punk user using Austin coordinates fails GPS with `SUBMITTED_LOCATION_MISMATCH`.

This staging smoke requires hosted API `GOOGLE_PLACES_API_KEY`; if absent, pioneer fallback verification should return `SUBMITTED_LOCATION_NOT_VERIFIED`.
