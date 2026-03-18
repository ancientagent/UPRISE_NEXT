# SLICE-UXDISC-585A Handoff

Date: 2026-03-16  
Agent: Codex GPT-5  
Lane: B (`lane-b-ux-discovery-batch17`)

## Scope
Execute one MVP slice only: normalize scene card metadata/copy fields to lock docs and remove explanatory drift text.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`

## Changes
- Updated `apps/web/src/app/discover/page.tsx`.
- Normalized city-scene status labels to `Home Scene`, `Tuned Scene`, `Active`, or `Inactive`.
- Added explicit `Scope` metadata for city-scene cards.
- Reduced state-rollup chip copy from `State Rollup` to `State` to keep the card metadata-oriented instead of explanatory.

## Drift Guard Confirmation
- Touched locked decision: Discover cards remain Scene-scoped metadata surfaces.
- Confirmed unchanged: no pricing, entitlement, recommendation, or join-style copy was introduced.
- Confirmed unchanged: action controls and route behavior remain unchanged.

## Files Touched
- `apps/web/src/app/discover/page.tsx`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-03-16_SLICE-UXDISC-585A.md`

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- discovery-client.test.ts communities-client.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
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
> jest "discovery-client.test.ts" "communities-client.test.ts"

PASS __tests__/discovery-client.test.ts
PASS __tests__/communities-client.test.ts

Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        0.443 s, estimated 1 s
Ran all test suites matching /discovery-client.test.ts|communities-client.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
