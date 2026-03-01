# SLICE-UXGEST-507A — Profile pull-down state table

## Summary
- Updated `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md` with a strict `collapsed` / `peek` / `expanded` transition table.
- Added explicit threshold constants and allowed trigger rules for deterministic gesture-state transitions.

## Claim Command (exact)
```bash
node scripts/reliant-slice-queue.mjs claim --queue .reliant/queue/mvp-lane-b-ux-gesture-r1.json --runtime .reliant/runtime/current-task-lane-b-ux-r1.json
```

## Claim Output (exact)
```json
{"claimed":true,"resultCode":"claimed_new_task","task":{"taskId":"SLICE-UXGEST-507A","title":"Profile pull-down state table","prompt":"Docs-only: add strict collapsed/peek/expanded transition table with thresholds and allowed triggers.","verifyCommand":"pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck","sourceQueue":"mvp-lane-b-ux-gesture-r1.json","claimedAt":"2026-03-01T05:40:03.871Z"}}
```

## Verify Command (exact)
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck
```

## Verify Output (exact)
```text
> uprise-next@1.0.0 docs:lint /home/baris/UPRISE_NEXT_uxmobile
> node scripts/docs-lint.mjs && pnpm run canon:lint

[docs:lint] ✅ No tracked PDFs
[docs:lint] ✅ No tracked Zone.Identifier artifacts
[docs:lint] ✅ Docs directory structure looks present
[docs:lint] ✅ Specs metadata present
[docs:lint] ✅ No unexpected root-level markdown files
[docs:lint] ✅ docs:lint passed

> uprise-next@1.0.0 canon:lint /home/baris/UPRISE_NEXT_uxmobile
> node scripts/canon-lint.mjs

[canon:lint] OK: Checked 10 canon markdown files

> uprise-next@1.0.0 infra-policy-check /home/baris/UPRISE_NEXT_uxmobile
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


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT_uxmobile/apps/web
> tsc --noEmit
```
