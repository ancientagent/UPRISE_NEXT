# SLICE-UXDISC-587A Handoff

Date: 2026-03-16  
Agent: Codex GPT-5  
Lane: B (`lane-b-ux-discovery-batch17`)

## Scope
Execute one MVP slice only: close lane B with focused contract/test assertions for discovery scope, states, and handoff integrity.

## Canon / Spec Anchors
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`

## Changes
- Updated `apps/web/__tests__/discovery-client.test.ts`.
- Updated `apps/web/__tests__/communities-client.test.ts`.
- Added coverage for null-safe discovery-context reads when the API returns no persisted tuned-scene payload.
- Added coverage for exact `resolve-home` query shaping from the Home Scene tuple used by discovery-to-plot handoff.

## Drift Guard Confirmation
- Touched locked decision: discovery remains scene/community-only and handoff-safe.
- Confirmed unchanged: no new UI behavior or copy was introduced.
- Confirmed unchanged: no pricing, entitlement, recommendation, or ranking semantics were added.

## Files Touched
- `apps/web/__tests__/discovery-client.test.ts`
- `apps/web/__tests__/communities-client.test.ts`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-03-16_SLICE-UXDISC-587A.md`

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

⏱️  Scan completed in 3ms

✅ Build succeeded: All checks passed!

> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "discovery-context.test.ts" "discovery-client.test.ts" "communities-client.test.ts"

PASS __tests__/discovery-client.test.ts
PASS __tests__/communities-client.test.ts
PASS __tests__/discovery-context.test.ts

Test Suites: 3 passed, 3 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        0.539 s, estimated 1 s
Ran all test suites matching /discovery-context.test.ts|discovery-client.test.ts|communities-client.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
