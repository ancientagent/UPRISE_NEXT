# 2026-02-16 — Spec Completion Pass

## Scope

Extended the spec hardening pass to remove remaining draft/TBD module specs and align all modules to canon + current repository implementation state.

## Updated Specs

- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/system/registrar.md`
- `docs/specs/social/message-boards-groups-blast.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/engagement/activity-points-and-analytics.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/specs/economy/revenue-and-pricing.md`
- `docs/specs/system/moderation-and-quality-control.md`
- `docs/specs/system/edge-cases-and-compliance.md`
- `docs/specs/admin/super-admin-controls.md`
- `docs/specs/core/terminology-and-taxonomy.md`
- `docs/specs/discovery/vibe-check-and-taste-profiles.md`
- `docs/specs/v2/search-parties.md`
- `docs/specs/v2/listening-rooms.md`
- `docs/specs/v2/mixologist-and-mixes.md`
- `docs/specs/v2/ambassador-system.md`
- `docs/specs/seed/music-community-taxonomy.md`
- `docs/specs/system/README.md`
- `docs/specs/users/README.md`

## What Changed

- Converted module specs to `Status: active` and updated `Last Updated` metadata.
- Replaced placeholder/TBD API/model sections with explicit:
  - **Implemented now** behavior (from current codebase evidence)
  - **Deferred (not implemented yet)** scope
  - planned endpoints/models where applicable
- Locked canon constraints across all modules:
  - no recommendation/personalization drift
  - no Fair Play bypass via paid/promotional/admin surfaces
  - role/capability semantics remain additive to one user identity
- Synced documentation indexes (`users/README`, `system/README`) to real spec inventory.

## Validation

- `pnpm run docs:lint` ✅
  - includes `canon:lint`

## Deferred / Blocked

- Founder-lock and policy constants still centralized in `docs/specs/DECISIONS_REQUIRED.md`:
  - propagation thresholds
  - Fair Play timing windows
  - Activity Points scoring/decay details
  - moderation thresholds/appeals
  - pricing constants and promotional slot mechanics

