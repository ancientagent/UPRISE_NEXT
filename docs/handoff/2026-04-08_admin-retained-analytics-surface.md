# 2026-04-08 Admin Retained Analytics Surface

## Summary
- Added a live MVP admin analytics read surface so retained metrics are no longer doc-only.
- The implementation stays read-only and uses the current authenticated guard; RBAC remains deferred per spec.

## Backend
- Added `GET /admin/analytics/query`
- Route returns:
  - platform totals
  - signal action totals
  - retained metric data/availability for:
    - `listenCountAllTime`
    - `mostListenedSignals`
    - `mostUpvotedSignals`
    - `mixtapeAppearanceCount`
    - `appearanceCountByTier`
- Uses current runtime sources only:
  - users, communities, artist bands, events, tracks, signals, follows
  - signal actions
  - track play counts
  - track votes
  - rotation entries by scene tier
- Does not invent later-version data. Mixtape metrics remain explicitly unavailable until that runtime exists.

## Web
- Added `/admin` as a minimal read-only admin page for retained analytics.
- The page requires sign-in and currently exposes:
  - platform totals cards
  - signal action total cards
  - retained metric cards/tables

## Spec Alignment
- `docs/specs/admin/super-admin-controls.md` now records:
  - implemented `GET /admin/analytics/query`
  - current authenticated guard with RBAC deferred
  - minimal MVP `/admin` read surface

## Verification
- `pnpm --filter api test -- admin-analytics.service admin-config.service`
- `pnpm run typecheck`

## Follow-Up
- Add RBAC when super-admin role enforcement is ready.
- Expand `/admin/analytics/query` into scoped/historical query semantics later instead of widening the current MVP summary route ad hoc.
