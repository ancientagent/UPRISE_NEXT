# SLICE-UXQAREV-603A BLOCKED

Date: 2026-03-16
Lane: E - QA/Docs/Closeout
Task: Batch17 docs/spec consistency pass

## Block Reason
Blocked because the current lock/spec wording is already aligned for Batch17, but the live `/plot` implementation still exposes `Social` in the collapsed MVP tab rail. This slice only permits wording-drift patches, so it cannot resolve an implementation conflict.

## Current Conflict Evidence
- Lock:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md:98-99`
  - `Social` is deferred for MVP.
- Spec:
  - `docs/specs/communities/plot-and-scene-plot.md:118`
  - `Social remains hidden in MVP until endpoint + surface contract ship.`
- Implementation:
  - `apps/web/src/app/plot/page.tsx:46-48`
  - `apps/web/src/app/plot/page.tsx:534-547`
  - `apps/web/src/app/plot/page.tsx:570-578`

## Why This Slice Cannot Complete
- No wording drift remains to patch in the current docs/spec set.
- Matching docs to the live UI would violate the active lock/spec.
- Hiding or removing `Social` from `/plot` is a code change outside this slice scope.

## Required Follow-up
- Remove `Social` from the collapsed MVP `/plot` rail and its fallback body.
- Re-run this docs/spec consistency slice after implementation matches the lock/spec.

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


⏱️  Scan completed in 5ms

✅ Build succeeded: All checks passed!


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit
```
