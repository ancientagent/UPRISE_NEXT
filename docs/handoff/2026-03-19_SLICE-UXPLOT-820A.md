# SLICE-UXPLOT-820A

Date: 2026-03-19
Lane: A (`lane-a-ux-plot-batch25`)
Task: Plot/profile seam interaction regression lock
Status: completed

## Scope
Execute one MVP slice only: reinforce collapsed/peek/expanded seam-state transitions and route-stable ownership for profile panel interactions.

## Result
- No additional code change was required.
- Current implementation already satisfies this scope in:
  - `apps/web/src/app/plot/page.tsx`
  - `apps/web/__tests__/plot-ux-regression-lock.test.ts`

## Drift Guard Confirmation
- Touched locked decision: collapsed/peek/expanded seam-state remains owned by `/plot` route state.
  - Confirmed unchanged.
- Touched locked decision: profile-panel interactions remain route-stable.
  - Confirmed unchanged.
- Touched locked decision: compact player shell does not own panel-state transitions.
  - Confirmed unchanged.
- New founder decision requests:
  - none

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
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
> jest "plot-ux-regression-lock.test.ts"

PASS __tests__/plot-ux-regression-lock.test.ts
  /plot UX regression lock
    ✓ locks player mode labels to explicit RADIYO vs Collection copy (1 ms)
    ✓ locks panel-state ownership to the /plot route container
    ✓ locks compact player shell scaffolding for track row and tier stack (1 ms)
    ✓ locks collection mode to selection entry and explicit eject return (1 ms)
    ✓ locks engagement wheel actions to deterministic mode-specific sets (1 ms)
    ✓ locks expanded-profile behavior to swap out Plot tabs/body (1 ms)
    ✓ locks Top Songs + Scene Activity to statistics-only placement
    ✓ locks primary Plot tab ownership to explicit Feed/Events/Promotions/Statistics bodies
    ✓ locks feed copy to scene-scoped deterministic, non-personalized states

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        0.42 s, estimated 1 s
Ran all test suites matching /plot-ux-regression-lock.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
