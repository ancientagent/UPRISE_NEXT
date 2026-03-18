# SLICE-UXDISC-673A

## Scope
- Queue: `.reliant/queue/mvp-lane-b-ux-discovery-batch20.json`
- Runtime: `.reliant/runtime/current-task-lane-b-ux-batch20.json`
- Prompt: `Execute one MVP slice only: tighten idle/loading/error/empty/results rendering parity for Discover without adding pricing/entitlement copy.`

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`

## Implementation
- Marked the shared Discover summary surface as `role="status"` with `aria-live="polite"`.
- This keeps the existing summary-state pattern intact while making all Discover states announce through the same accessible channel.

## Files Touched
- `apps/web/src/app/discover/page.tsx`
- `docs/CHANGELOG.md`

## Drift Guard Confirmation
- No pricing, billing, entitlement, or access-limit copy added.
- No search behavior or result content changed.
- Web-tier boundary unchanged.

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


⏱️  Scan completed in 19ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "discovery-client.test.ts"

PASS __tests__/discovery-client.test.ts
  discovery client
    ✓ builds discover scenes query from typed params (9 ms)
    ✓ omits city filter outside city tier and skips blank location params (2 ms)
    ✓ keeps state filter for state-tier discovery without adding city lookup semantics (2 ms)
    ✓ never adds artist or band lookup params to discovery queries (5 ms)
    ✓ returns null when discovery context data is empty (1 ms)
    ✓ returns typed context and mutations from tune + set-home wrappers (15 ms)
    ✓ throws when tune or set-home responses are empty (17 ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        1.51 s
Ran all test suites matching /discovery-client.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
