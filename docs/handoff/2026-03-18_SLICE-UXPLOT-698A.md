# SLICE-UXPLOT-698A

Date: 2026-03-18
Lane: A (`lane-a-ux-plot-batch21`)
Task: Plot events/promotions tab contract polish
Status: completed

## Scope
Execute one MVP slice only: enforce tab body ownership and deterministic fallback states for Events and Promotions without adding new CTA behavior.

## Result
- No additional code change was required.
- Current implementation already satisfies this scope in:
  - `apps/web/src/components/plot/PlotEventsPanel.tsx`
  - `apps/web/src/components/plot/PlotPromotionsPanel.tsx`
  - `apps/web/src/lib/communities/client.ts`
  - `apps/web/__tests__/plot-ux-regression-lock.test.ts`
  - `apps/web/__tests__/communities-client.test.ts`

## Drift Guard Confirmation
- Touched locked decision: Events and Promotions remain distinct owned surfaces.
  - Confirmed unchanged.
- Touched locked decision: empty/error states remain deterministic and descriptive.
  - Confirmed unchanged.
- Touched locked decision: no new CTA behavior was introduced.
  - Confirmed unchanged.
- New founder decision requests:
  - none

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts communities-client.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
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


⏱️  Scan completed in 17ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "plot-ux-regression-lock.test.ts" "communities-client.test.ts"

PASS __tests__/plot-ux-regression-lock.test.ts
PASS __tests__/communities-client.test.ts

Test Suites: 2 passed, 2 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        1.843 s
Ran all test suites matching /plot-ux-regression-lock.test.ts|communities-client.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
