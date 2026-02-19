# 2026-02-16 — Spec Core Alignment Pass

## Scope

Spec documentation update pass to replace placeholder/TBD sections with current, evidence-backed contracts for core modules tied to onboarding, scene structure, signals, and Fair Play engagement capture.

## Updated Specs

- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`

## What Changed

### 1) Scene/Uprise/Sect Contracts
- Added concrete model and migration references (`Community`, `CommunityMember`, `SectTag`, `UserTag`, user home-scene fields).
- Added actual endpoints for scene/onboarding/community location verification.
- Explicitly separated implemented behavior from deferred behavior (Uprise model, registrar motions, propagation thresholds).

### 2) Plot Spec
- Defined Plot surfaces and canon constraints.
- Documented current implementation state (web shell only) vs deferred API integrations (feed/statistics/promotions/social backends).

### 3) Onboarding Spec
- Replaced placeholder API schema text with exact request/response contracts from current controller/service behavior.
- Added canonical GPS reason codes:
  - `NO_HOME_SCENE`
  - `SCENE_NOT_FOUND`
  - `SCENE_NO_GEOFENCE`
  - `OUTSIDE_GEOFENCE`

### 4) Signals Spec
- Added current `signals` service endpoint contracts and idempotency rules.
- Added migration and unique constraint details for `SignalAction`, `Follow`, `Collection`, and `CollectionItem`.

### 5) Broadcast/Fair Play Spec
- Updated data model section to match real schema (`Track`, `TrackEngagement`).
- Marked `POST /tracks/:id/engage` as implemented.
- Marked rotation engine, vote endpoint, and propagation as deferred.

## Validation

- `pnpm run docs:lint` (expected pass)

## Deferred / Blocked

- Rotation/vote/propagation logic remains founder-lock dependent (`docs/specs/DECISIONS_REQUIRED.md`).
- Plot feed/statistics/social backend APIs are still planned, not implemented.
