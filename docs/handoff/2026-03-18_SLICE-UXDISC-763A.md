# SLICE-UXDISC-763A

## Scope
- Queue: `.reliant/queue/mvp-lane-b-ux-discovery-batch23.json`
- Runtime: `.reliant/runtime/current-task-lane-b-ux-batch23.json`
- Prompt: `Execute one MVP slice only: tighten idle/loading/error/empty/results rendering parity for Discover without adding pricing/entitlement copy.`

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`

## Implementation
- Added a `data-discovery-state` marker to the shared Discover summary surface.
- This preserves the existing state model while making parity states explicit for inspection and regression coverage.

## Files Touched
- `apps/web/src/app/discover/page.tsx`
- `docs/CHANGELOG.md`

## Drift Guard Confirmation
- No pricing, billing, entitlement, or access-limit copy added.
- Locked decisions touched: shared state summary only. Remains unchanged.
- New founder decision requests: none.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- discovery-client.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
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
> jest "discovery-client.test.ts"

PASS __tests__/discovery-client.test.ts
  discovery client
    ✓ builds discover scenes query from typed params (2 ms)
    ✓ omits city filter outside city tier and skips blank location params
    ✓ keeps state filter for state-tier discovery without adding city lookup semantics (1 ms)
    ✓ limits state-tier discovery queries to the approved scope keys (1 ms)
    ✓ never adds artist or band lookup params to discovery queries (4 ms)
    ✓ limits city-tier discovery queries to the approved scope keys (1 ms)
    ✓ does not carry location filters into national-tier discovery (1 ms)
    ✓ limits national-tier discovery queries to community scope keys only
    ✓ preserves the musicCommunity query key even when the typed value trims blank (1 ms)
    ✓ returns null when discovery context data is empty (1 ms)
    ✓ sends authenticated discovery-context reads through the typed client
    ✓ returns typed context and mutations from tune + set-home wrappers
    ✓ throws when tune or set-home responses are empty (7 ms)

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        0.398 s, estimated 1 s
Ran all test suites matching /discovery-client.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
