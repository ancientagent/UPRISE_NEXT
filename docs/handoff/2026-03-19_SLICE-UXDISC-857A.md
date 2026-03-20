# SLICE-UXDISC-857A

Date: 2026-03-19
Lane: B (`lane-b-ux-discovery-batch26`)
Task: Discovery lane closeout + contract assertions
Status: completed

## Scope
Execute one MVP slice only: close lane B with focused contract/test assertions for discovery scope, states, and handoff integrity.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/communities/plot-and-scene-plot.md`

## Implementation
- Added a communities-client regression proving city active-statistics requests use the approved `tier=city` query shape only.
- This closes the lane with explicit active-scene fallback request-shape assertions across city, state, and national tiers.

## Files Touched
- `apps/web/__tests__/communities-client.test.ts`
- `docs/CHANGELOG.md`

## Drift Guard Confirmation
- Touched locked decision: discovery/plot fallback reads remain scope-driven and deterministic across all approved tiers.
  - Confirmed unchanged.
- Touched locked decision: active-scene statistics transport continues to flow through approved typed web client contracts only.
  - Confirmed unchanged.
- New founder decision requests:
  - none

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- discovery-context.test.ts discovery-client.test.ts communities-client.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
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


⏱️  Scan completed in 6ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "discovery-context.test.ts" "discovery-client.test.ts" "communities-client.test.ts"

PASS __tests__/discovery-client.test.ts
PASS __tests__/discovery-context.test.ts
PASS __tests__/communities-client.test.ts

Test Suites: 3 passed, 3 total
Tests:       43 passed, 43 total
Snapshots:   0 total
Time:        0.554 s, estimated 1 s
Ran all test suites matching /discovery-context.test.ts|discovery-client.test.ts|communities-client.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
