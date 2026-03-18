# SLICE-UXDISC-737A

## Scope
- Queue: `.reliant/queue/mvp-lane-b-ux-discovery-batch22.json`
- Runtime: `.reliant/runtime/current-task-lane-b-ux-batch22.json`
- Prompt: `Execute one MVP slice only: close lane B with focused contract/test assertions for discovery scope, states, and handoff integrity.`

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`

## Implementation
- Added a discovery-client assertion proving `GET /discover/context` is called through the typed client with auth headers.
- Added a communities-client assertion proving `getActiveCommunityStatistics()` preserves both `sceneId` metadata and response data when both are present.

## Files Touched
- `apps/web/__tests__/discovery-client.test.ts`
- `apps/web/__tests__/communities-client.test.ts`
- `docs/CHANGELOG.md`

## Drift Guard Confirmation
- No product behavior or copy changed in this slice.
- Locked decisions touched: typed client contract coverage only. Remains unchanged.
- New founder decision requests: none.

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


⏱️  Scan completed in 5ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "discovery-context.test.ts" "discovery-client.test.ts" "communities-client.test.ts"

PASS __tests__/discovery-context.test.ts
PASS __tests__/discovery-client.test.ts
PASS __tests__/communities-client.test.ts

Test Suites: 3 passed, 3 total
Tests:       30 passed, 30 total
Snapshots:   0 total
Time:        0.541 s, estimated 1 s
Ran all test suites matching /discovery-context.test.ts|discovery-client.test.ts|communities-client.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
