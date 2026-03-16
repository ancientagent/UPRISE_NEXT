# SLICE-UXQAREV-572A BLOCKED

Date: 2026-03-16
Lane: E - QA/Docs/Closeout
Task: Batch16 docs/spec consistency pass

## Block Reason
Blocked because this slice only allows wording-drift patches, but the current `/plot` implementation still renders `Social` even though the active MVP UX lock and current Plot spec both keep Social hidden/deferred for MVP.

## Current Conflict Evidence
- Locked source:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md:98-99`
  - `Social:`
  - `Deferred for MVP unless explicitly unlocked by spec update.`
- Current spec wording:
  - `docs/specs/communities/plot-and-scene-plot.md:118`
  - `Social remains hidden in MVP until endpoint + surface contract ship.`
- Current implementation:
  - `apps/web/src/app/plot/page.tsx:46-48` defines `primaryPlotTabs`, `deferredPlotTabs`, and `tabs` including `Social`.
  - `apps/web/src/app/plot/page.tsx:534-547` renders the full tab rail from `tabs`.
  - `apps/web/src/app/plot/page.tsx:570-578` renders a visible `Social` fallback body.

## Why This Cannot Be Completed In A Wording-Only Slice
- Docs already align on the intended MVP rule.
- Changing docs again would not resolve the live behavior conflict.
- Removing or hiding `Social` in `/plot` is an implementation change outside this slice scope.

## Required Follow-up
- Resolve the `/plot` implementation to match the current lock/spec.
- After that, re-run this docs/spec consistency pass.

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
