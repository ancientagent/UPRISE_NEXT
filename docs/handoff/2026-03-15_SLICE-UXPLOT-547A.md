# SLICE-UXPLOT-547A

Date: 2026-03-15
Lane: A (`lane-a-ux-plot-batch16`)
Task: Plot Events IA/state contract overhaul pack 1
Status: completed

## Scope
Execute one MVP slice only: refine `/plot` Events tab ordering and deterministic loading/empty/error states to match canon scene-scoped behavior.

## Canon / Spec Anchors
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`

## Implemented
- Added typed events client wrappers in `apps/web/src/lib/communities/client.ts` for explicit `/communities/:id/events` and `/communities/active/events` reads.
- Updated `apps/web/src/components/plot/PlotEventsPanel.tsx` to render deterministic Events states:
  - skeleton rows during initial load
  - explicit scene-scoped empty copy
  - retryable error copy with `Retry Events`
  - locked copy stating ordering is by canonical start time with no personalized ranking
- Added web client coverage in `apps/web/__tests__/communities-client.test.ts` for active-scene events query construction.

## Non-Changes / Guardrails
- Did not change Feed, Promotions, Statistics, Social, or route ownership behavior.
- Did not alter event creation/write semantics; this remains a read-only Plot surface.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts communities-client.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```

## Verify Result
- Passed exactly as claimed.

## Files Touched
- `apps/web/src/lib/communities/client.ts`
- `apps/web/src/components/plot/PlotEventsPanel.tsx`
- `apps/web/__tests__/communities-client.test.ts`
- `docs/CHANGELOG.md`
