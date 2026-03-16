# SLICE-UXPLOT-551A

Date: 2026-03-16
Lane: A (`lane-a-ux-plot-batch16`)
Task: Plot tab-system closeout + regression lock
Status: completed

## Scope
Execute one MVP slice only: finalize Plot tab coherence pass across Feed/Events/Promotions/Statistics and extend focused regression locks for tab/body ownership.

## Canon / Spec Anchors
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/scene-map-and-metrics.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_UX_BATCH16_DRIFT_WATCHLIST.md`

## Implemented
- Refactored `apps/web/src/app/plot/page.tsx` so primary Plot tabs use explicit ownership paths:
  - `Feed` -> `SeedFeedPanel`
  - `Events` -> `PlotEventsPanel`
  - `Promotions` -> `PlotPromotionsPanel`
  - `Statistics` -> `StatisticsPanel` + `TopSongsPanel` + `Scene Activity Snapshot`
- Split `primaryPlotTabs` from deferred `Social` handling so the unresolved Social decision remains isolated from the primary tab-body routing logic.
- Extended `apps/web/__tests__/plot-ux-regression-lock.test.ts` with tab/body ownership assertions for the four primary tabs and the separate deferred Social fallback path.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tier-guard.test.ts plot-statistics-request.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```

## Exact Verify Output
```text
> uprise-next@1.0.0 docs:lint /home/baris/UPRISE_NEXT
> node scripts/docs-lint.mjs && pnpm run canon:lint

[docs:lint] ✅ No tracked PDFs
[docs:lint] ✅ No tracked Zone.Identifier artifacts
[docs:lint] ✅ Docs directory structure looks present
[docs:lint] ✅ Specs metadata present
[docs:lint] ✅ No unexpected root-level markdown files
[docs:lint] ✅ docs:lint passed

> uprise-next@1.0.0 canon:lint /home/baris/UPRISE_NEXT
> node scripts/canon-lint.mjs

[canon:lint] OK: Checked 10 canon markdown files

> uprise-next@1.0.0 infra-policy-check /home/baris/UPRISE_NEXT
> tsx scripts/infra-policy-check.ts

🔍 UPRISE Web-Tier Contract Guard
════════════════════════════════════════════════════════════════════════════════
Scanning: apps/web
Patterns: 24 prohibited patterns
════════════════════════════════════════════════════════════════════════════════

✅ Web-Tier Contract Guard: No violations detected!
   All architectural boundaries are properly enforced.

⏱️  Scan completed in 12ms

✅ Build succeeded: All checks passed!

> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "plot-ux-regression-lock.test.ts" "plot-tier-guard.test.ts" "plot-statistics-request.test.ts"

PASS __tests__/plot-ux-regression-lock.test.ts
PASS __tests__/plot-statistics-request.test.ts
PASS __tests__/plot-tier-guard.test.ts

Test Suites: 3 passed, 3 total
Tests:       21 passed, 21 total
Snapshots:   0 total
Time:        0.688 s, estimated 1 s
Ran all test suites matching /plot-ux-regression-lock.test.ts|plot-tier-guard.test.ts|plot-statistics-request.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```

## Files Touched
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`
