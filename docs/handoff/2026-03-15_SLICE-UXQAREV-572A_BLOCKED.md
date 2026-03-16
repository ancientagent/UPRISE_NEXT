# SLICE-UXQAREV-572A BLOCKED

Date: 2026-03-15
Lane: E - QA/Docs/Closeout
Task: Batch16 docs/spec consistency pass

## Block Reason
Blocked because the current `/plot` implementation still exposes and renders a `Social` tab, which conflicts with the active MVP UX lock that marks Social as deferred for MVP. This slice only permits wording-drift patches, so I cannot resolve an implementation-versus-lock conflict by editing docs.

## Conflict Evidence
- Locked source: `docs/solutions/MVP_UX_MASTER_LOCK_R1.md:98-99`
  - `Social:`
  - `Deferred for MVP unless explicitly unlocked by spec update.`
- Current spec wording: `docs/specs/communities/plot-and-scene-plot.md:118`
  - `Social remains placeholder until endpoint ships.`
- Current implementation:
  - `apps/web/src/app/plot/page.tsx:44` defines `const tabs = ['Feed', 'Events', 'Promotions', 'Statistics', 'Social'];`
  - `apps/web/src/app/plot/page.tsx:441` renders `Message boards and listening rooms.`
  - `apps/web/src/app/plot/page.tsx:485-488` renders a fallback body for `Social`.

## Why This Blocks A Wording-Only Pass
- Updating docs to match the current code would contradict the active UX lock.
- Updating the UX lock/spec to permit Social would be a product-scope change, not wording drift.
- Removing the Social implementation would be a code change outside this slice's allowed scope.

## Required Follow-up
- Resolve the source-of-truth conflict first:
  - either remove the `Social` tab implementation from `/plot` to match the master lock,
  - or explicitly update canon/spec/lock to authorize Social for MVP.
- After that resolution, re-run this docs/spec consistency slice.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck
```

## Exact Output
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


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit
```
