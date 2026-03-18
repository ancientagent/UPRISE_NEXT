# SLICE-UXPLOT-579A

Date: 2026-03-16
Lane: A (`lane-a-ux-plot-batch17`)
Task: Statistics scene-map copy coherence pass
Status: completed

## Scope
Execute one MVP slice only: align Statistics scene-map context copy to selected tier and active-scene resolution behavior with no metric model changes.

## Canon / Spec Anchors
- `docs/specs/communities/scene-map-and-metrics.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`

## Implemented
- Added tested scene-map copy helpers in `apps/web/src/components/plot/statistics-request.ts`:
  - `getSceneMapScopeCopy()` for tier-specific scope wording
  - `getSceneMapResolutionCopy()` for selected-community vs active-scene fallback wording
- Extended `apps/web/__tests__/plot-statistics-request.test.ts` to lock both copy helpers.
- Updated `apps/web/src/components/plot/StatisticsPanel.tsx` to consume the helpers so the panel wording stays consistent with tested request-resolution behavior.

## Drift Guard Confirmation
- Touched locked decision: Statistics remains the owner of scene-map descriptive context.
  - Confirmed unchanged.
- Touched locked decision: tier changes remain structural scope changes only.
  - Confirmed unchanged.
- Touched locked decision: no metric model changes.
  - Confirmed unchanged.
- New founder decision requests:
  - none

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-statistics-request.test.ts plot-tier-guard.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
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

⏱️  Scan completed in 5ms

✅ Build succeeded: All checks passed!

> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "plot-statistics-request.test.ts" "plot-tier-guard.test.ts"

PASS __tests__/plot-tier-guard.test.ts
PASS __tests__/plot-statistics-request.test.ts

Test Suites: 2 passed, 2 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        0.534 s, estimated 1 s
Ran all test suites matching /plot-statistics-request.test.ts|plot-tier-guard.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
