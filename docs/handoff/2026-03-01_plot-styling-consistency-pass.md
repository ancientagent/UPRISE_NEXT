# /plot Styling Consistency Pass (2026-03-01)

## Scope
- Styling-only normalization for `/plot` surfaces.
- Aligned spacing/typography/button sizing across:
  - Profile header
  - Player shell
  - Tab rail
  - Expanded profile blocks
- No new flows, no new CTAs, no route changes.

## Files Updated
- `apps/web/src/app/plot/page.tsx`
- `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`

## Verify Commands (exact)
```bash
pnpm run docs:lint
pnpm run infra-policy-check
pnpm --filter web typecheck
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


⏱️  Scan completed in 5ms

✅ Build succeeded: All checks passed!


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT_uxmobile/apps/web
> tsc --noEmit
```
