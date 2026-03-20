# SLICE-UXDISC-856A

Date: 2026-03-19
Lane: B (`lane-b-ux-discovery-batch26`)
Task: Onboarding-home-scene fallback copy parity in discover pathways
Status: completed

## Scope
Execute one MVP slice only: align discover-adjacent fallback copy with onboarding home-scene pioneer routing language and no entitlement assumptions.

## Result
- No code change was required.
- Current implementation already satisfies this scope in:
  - `apps/web/src/app/discover/page.tsx`

## Drift Guard Confirmation
- No pricing, entitlement, or upgrade language added.
- Touched locked decision: inactive-city fallback routes to the nearest active city Scene for the selected parent music community.
  - Confirmed unchanged.
- Touched locked decision: pioneer notification delivery remains the top-right notification icon in the profile strip.
  - Confirmed unchanged.
- New founder decision requests:
  - none

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- discovery-client.test.ts discovery-context.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
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
> jest "discovery-client.test.ts" "discovery-context.test.ts"

PASS __tests__/discovery-client.test.ts
PASS __tests__/discovery-context.test.ts

Test Suites: 2 passed, 2 total
Tests:       32 passed, 32 total
Snapshots:   0 total
Time:        0.522 s, estimated 1 s
Ran all test suites matching /discovery-client.test.ts|discovery-context.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
