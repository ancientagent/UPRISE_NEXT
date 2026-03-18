# SLICE-UXPLOT-726A

Date: 2026-03-18
Lane: A (`lane-a-ux-plot-batch22`)
Task: Plot tab rail parity lock (MVP-only tabs)
Status: completed

## Scope
Execute one MVP slice only: lock `/plot` collapsed tab rail to `Feed`/`Events`/`Promotions`/`Statistics` only and add focused regression assertions for no Social exposure.

## Result
- No additional code change was required.
- Current implementation already satisfies this scope in:
  - `apps/web/src/app/plot/page.tsx`
  - `apps/web/__tests__/plot-ux-regression-lock.test.ts`
  - `apps/web/__tests__/plot-tier-guard.test.ts`

## Drift Guard Confirmation
- Touched locked decision: collapsed `/plot` tab rail remains `Feed`, `Events`, `Promotions`, `Statistics` only.
  - Confirmed unchanged.
- Touched locked decision: Social remains hidden in MVP collapsed `/plot`.
  - Confirmed unchanged.
- Touched locked decision: tab-body ownership remains explicit and route-stable.
  - Confirmed unchanged.
- New founder decision requests:
  - none

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tier-guard.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
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


⏱️  Scan completed in 10ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "plot-ux-regression-lock.test.ts" "plot-tier-guard.test.ts"

PASS __tests__/plot-ux-regression-lock.test.ts
PASS __tests__/plot-tier-guard.test.ts

Test Suites: 2 passed, 2 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        0.627 s, estimated 1 s
Ran all test suites matching /plot-ux-regression-lock.test.ts|plot-tier-guard.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
