# SLICE-UXPLOT-546A

Date: 2026-03-15
Lane: A (`lane-a-ux-plot-batch16`)
Task: Plot Feed IA/state contract overhaul pack 1
Status: completed

## Scope
Execute one MVP slice only: align `/plot` Feed tab composition to locked civic IA with deterministic loading/empty/error states and no recommendation semantics. Keep route/ownership unchanged.

## Canon / Spec Anchors
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`

## Implemented
- Added typed feed client wrappers in `apps/web/src/lib/communities/client.ts` for explicit `/communities/:id/feed` and `/communities/active/feed` reads.
- Updated `apps/web/src/components/plot/SeedFeedPanel.tsx` to render deterministic Feed states:
  - skeleton rows during initial load
  - explicit scene-scoped empty copy
  - retryable error copy with `Retry Feed`
  - context label reflecting current tier/community anchor or active-scene fallback
  - locked copy stating the Feed is scene-scoped, reverse-chronological, and non-personalized
- Wired `selectedTier` into the Feed panel from `apps/web/src/app/plot/page.tsx`.
- Extended `apps/web/__tests__/plot-ux-regression-lock.test.ts` with Feed copy/state guard assertions.

## Non-Changes / Guardrails
- Did not change route ownership, profile expansion behavior, player behavior, or other Plot tabs.
- Did not change Social exposure. Relevant docs remain in conflict on hidden vs visible placeholder treatment and this slice avoided that founder-decision area.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tier-guard.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```

## Verify Result
- Passed exactly as claimed.

## Files Touched
- `apps/web/src/lib/communities/client.ts`
- `apps/web/src/components/plot/SeedFeedPanel.tsx`
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`
