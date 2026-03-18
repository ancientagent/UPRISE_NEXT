# SLICE-UXDISC-704A

## Scope
- Queue: `.reliant/queue/mvp-lane-b-ux-discovery-batch21.json`
- Runtime: `.reliant/runtime/current-task-lane-b-ux-batch21.json`
- Prompt: `Execute one MVP slice only: verify tuned-scene persistence boundaries from Discover into Plot and harden deterministic context patching.`

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`

## Implementation
- Updated `toDiscoveryContextPatch()` to derive `tunedSceneId` from `tunedScene.id` when the API omits the top-level `tunedSceneId`.
- Added regression coverage for that partial context shape.

## Files Touched
- `apps/web/src/lib/discovery/context.ts`
- `apps/web/__tests__/discovery-context.test.ts`
- `docs/CHANGELOG.md`

## Drift Guard Confirmation
- No route, CTA, or entitlement behavior changed.
- The slice stays limited to deterministic discovery transport-context normalization.
- Web-tier boundary unchanged.

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


⏱️  Scan completed in 22ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "discovery-context.test.ts" "plot-tier-guard.test.ts"

PASS __tests__/plot-tier-guard.test.ts
PASS __tests__/discovery-context.test.ts

Test Suites: 2 passed, 2 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        2.702 s
Ran all test suites matching /discovery-context.test.ts|plot-tier-guard.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
