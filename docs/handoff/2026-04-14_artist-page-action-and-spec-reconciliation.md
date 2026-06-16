# 2026-04-14 — Artist Page Action And Spec Reconciliation

## Summary
Reconciled the artist/source page and the most important active specs/locks to the new action-system matrix.

This pass did two things:
1. removed the remaining fake `artist_band` signal behavior from the artist profile runtime
2. aligned the main active docs away from:
   - `flyer` as default signal
   - `event` as source
   - source-level `Add` / `Support`
   - automatic event-calendar population via follow

## Runtime Changes
Removed the synthetic source-level signal path from the artist page:

- deleted `POST /artist-bands/:id/add`
- deleted `POST /artist-bands/:id/support`
- removed synthetic `artist_band` signal creation and action counting from:
  - `apps/api/src/artist-bands/artist-bands.service.ts`
- removed source-level `Add` / `Support` controls from:
  - `apps/web/src/app/artist-bands/[id]/page.tsx`
- removed now-dead client helpers from:
  - `apps/web/src/lib/artist-bands/client.ts`
- removed `actionCounts` from:
  - `packages/types/src/artist-band.ts`

Net effect:
- artist pages are source pages again
- they expose `Follow` plus source-tool entry
- they no longer masquerade as addable/supportable signal cards

## Spec / Founder-Lock Reconciliation
Updated:
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/system/registrar.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/solutions/MVP_SIGNAL_SYSTEM_CONTRACT_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`

Key corrections:
- `single` and `Uprise` remain the active signal classes
- `flyer` is treated as event-bound artifact, not default signal
- events are objects, not sources
- Registrar is listener-side in the intended actor model
- follow is awareness subscription, not automatic event-calendar population
- `Collect` is the intended keep/save verb, while `/add` remains current endpoint debt
- lightweight post expression is closer to `React` than a direct signal/source `Support` button

## What Is Still Deliberately Not Resolved Here
This slice does **not** globally rename runtime `ADD` / `SUPPORT`.

Known remaining debt:
1. `signals` runtime still uses `/signals/:id/add`
2. `signals` runtime still exposes direct `SUPPORT`
3. discovery/community/admin stats still carry `support` naming and counters
4. broader registrar source-bridge runtime remains transitional

Those need a larger follow-up pass because they cross API contracts, metrics, and discovery/admin read models.

## Verification
- `pnpm --filter api test -- artist-bands.service artist-bands.controller`
- `pnpm --filter web test -- artist-band-client community-artist-page-lock`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `git diff --check`
