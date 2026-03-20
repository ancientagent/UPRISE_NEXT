# SLICE-UXDISC-854A

Date: 2026-03-19
Lane: B (`lane-b-ux-discovery-batch26`)
Task: Discovery -> Plot tuned-scene handoff stability
Status: completed

## Scope
Execute one MVP slice only: verify tuned-scene persistence boundaries from Discover into Plot and harden deterministic context patching.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/communities/plot-and-scene-plot.md`

## Implementation
- Normalized primary tuned-scene payloads so the transport `tunedSceneId` remains authoritative even when the attached `tunedScene.id` is stale.
- Added regression coverage proving Discover-to-Plot context patches now return one consistent tuned-scene id/value pair.

## Files Touched
- `apps/web/src/lib/discovery/context.ts`
- `apps/web/__tests__/discovery-context.test.ts`
- `docs/CHANGELOG.md`

## Drift Guard Confirmation
- Touched locked decision: Discover-to-Plot tuned-scene transport remains deterministic and does not change the winning tuned-scene id.
  - Confirmed unchanged.
- Touched locked decision: Plot reads one authoritative tuned-scene identity from transport state.
  - Confirmed unchanged.
- New founder decision requests:
  - none

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- discovery-context.test.ts plot-tier-guard.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
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


⏱️  Scan completed in 4ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "discovery-context.test.ts" "plot-tier-guard.test.ts"

PASS __tests__/plot-tier-guard.test.ts
PASS __tests__/discovery-context.test.ts

Test Suites: 2 passed, 2 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        0.501 s, estimated 1 s
Ran all test suites matching /discovery-context.test.ts|plot-tier-guard.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
