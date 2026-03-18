# SLICE-UXDISC-616A Handoff

Date: 2026-03-17  
Agent: Codex GPT-5  
Lane: B (`lane-b-ux-discovery-batch18`)

## Scope
Execute one MVP slice only: align discover-adjacent fallback copy with onboarding home-scene pioneer routing language and no entitlement assumptions.

## Canon / Spec Anchors
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/discovery-scene-switching.md`

## Changes
- Updated `apps/web/src/app/discover/page.tsx`.
- Restored the Discover header note explaining nearest-active city fallback and pioneer-intent tracking through the profile-strip notification icon.

## Drift Guard Confirmation
- Touched locked decision: pioneer fallback language now matches onboarding semantics again.
- Confirmed unchanged: no entitlement or pricing assumptions were introduced.

## Files Touched
- `apps/web/src/app/discover/page.tsx`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-03-17_SLICE-UXDISC-616A.md`

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

⏱️  Scan completed in 4ms

✅ Build succeeded: All checks passed!

> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "discovery-client.test.ts" "discovery-context.test.ts"

PASS __tests__/discovery-client.test.ts
PASS __tests__/discovery-context.test.ts

Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        0.418 s, estimated 1 s
Ran all test suites matching /discovery-client.test.ts|discovery-context.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
