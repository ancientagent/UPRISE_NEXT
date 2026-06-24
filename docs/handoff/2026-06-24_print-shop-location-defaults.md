# 2026-06-24 Print Shop Location Defaults

## Status

Implemented on branch `fix/print-shop-location-defaults`.

## Why

The launch audit identified a systems-scale violation in `/print-shop`: the event creation form initialized venue coordinates to Austin (`30.2672`, `-97.7431`) and used an Austin-specific address placeholder. Runtime Print Shop behavior must work across the full city/community/source matrix and must not silently create events with one launch city's location data.

## Changed

- `apps/web/src/app/print-shop/page.tsx`
  - Replaced hardcoded Austin coordinate defaults with blank coordinate fields.
  - Added explicit client-side coordinate validation before `POST /print-shop/events`.
  - Preserved the API payload contract by parsing latitude/longitude to numbers only after validation.
  - Replaced the Austin-specific address placeholder with generic venue address copy.
- `apps/web/__tests__/route-ux-consistency-lock.test.ts`
  - Added a regression lock that forbids Austin coordinates, Austin address placeholders, and blank-coordinate coercion to `0` in the Print Shop route.
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
  - Added the Print Shop explicit-venue rule and no city-specific runtime defaults boundary.
- `docs/CHANGELOG.md`
  - Added this slice to the Unreleased section.

## Current Contract

- Print Shop remains source-facing.
- Event creation still uses the resolved Home Scene as the event community anchor.
- Venue coordinates must be entered explicitly for the event being created.
- The runtime must not seed hidden defaults from Austin or any other launch city.
- Fixture/test data may still use Austin coordinates when explicitly operating as fixture data.

## Validation

Passed:

```bash
pnpm --filter web test -- route-ux-consistency-lock.test.ts print-shop-client.test.ts
pnpm --filter web typecheck
```

Pending before PR/merge closeout:

```bash
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
```

## Notes

This slice does not add maps, geocoding, venue lookup, source Home Scene coordinate derivation, or calendar behavior. Those require separate approved scopes.
