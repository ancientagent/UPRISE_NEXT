# 2026-06-19 — Onboarding ZIP Preview

## Scope

Added optional ZIP/postal-code handling to onboarding setup preview without changing Home Scene identity or voting authority.

## Current Truth

- Home Scene identity remains `city + state + music community`.
- ZIP is submitted-location detail only.
- If the user types ZIP during onboarding, the review step should automatically show it in the submitted-location preview.
- If GPS reverse geocoding returns a postal code, onboarding may prefill the same ZIP field.
- ZIP does not replace city/state, does not create a community key, and does not change fallback or voting rules.

## Runtime Files

- `apps/web/src/app/onboarding/page.tsx`
  - Adds optional `ZIP Code` input.
  - Includes ZIP in local Home Scene selection state.
  - Shows `Submitted location: <city>, <state> <zip>` in setup review when available.
  - Prefills ZIP from `/places/reverse` when the reverse geocoder returns `postalCode`.
- `apps/web/src/store/onboarding.ts`
  - Adds optional `postalCode` to `HomeSceneSelection`.
- `apps/web/src/lib/onboarding/review-resolution.ts`
  - Keeps `formatHomeSceneLabel` ZIP-free.
  - Adds `formatSubmittedLocationLabel` for preview-only city/state/ZIP display.
- `apps/api/src/places/places.service.ts`
  - Adds `postalCode` to reverse geocode results.
  - Fake provider returns deterministic launch-city postal codes for local smoke.
  - Google reverse geocoding extracts `postal_code` when available.

## Tests

- `apps/web/__tests__/onboarding-page-lock.test.ts`
- `apps/web/__tests__/onboarding-regression-lock.test.ts`
- `apps/web/__tests__/onboarding-review-resolution.test.ts`
- `apps/api/test/places.service.test.ts`

## Boundary

No Prisma migration was added. Server-side durable user ZIP storage remains a separate follow-up if/when the product needs ZIP beyond onboarding preview/local persisted client state.
