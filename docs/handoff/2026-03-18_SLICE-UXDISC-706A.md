# SLICE-UXDISC-706A

## Scope
- Queue: `.reliant/queue/mvp-lane-b-ux-discovery-batch21.json`
- Runtime: `.reliant/runtime/current-task-lane-b-ux-batch21.json`
- Prompt: `Execute one MVP slice only: align discover-adjacent fallback copy with onboarding home-scene pioneer routing language and no entitlement assumptions.`

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/discovery-scene-switching.md`

## Implementation
- Tightened the Discover pioneer-routing note from `selected parent music community` to the canon phrase `selected parent community`.
- Kept the existing notification-icon and pioneer-intent wording intact.

## Files Touched
- `apps/web/src/app/discover/page.tsx`
- `docs/CHANGELOG.md`

## Drift Guard Confirmation
- No entitlement, billing, or access-limit copy added.
- No behavior changed beyond text alignment to canon wording.
- Web-tier boundary unchanged.

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


⏱️  Scan completed in 16ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "discovery-client.test.ts" "discovery-context.test.ts"

PASS __tests__/discovery-context.test.ts
PASS __tests__/discovery-client.test.ts

Test Suites: 2 passed, 2 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        1.549 s
Ran all test suites matching /discovery-client.test.ts|discovery-context.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
