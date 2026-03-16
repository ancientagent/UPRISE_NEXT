# 2026-03-16 — Plot Social Hidden Lock Pass

## Scope
- Canon-lock alignment pass only.
- Removed deferred `Social` tab rendering from `/plot` to match MVP lock (`Feed`, `Events`, `Promotions`, `Statistics` only).
- Updated regression lock assertions to enforce primary tabs only.

## Files Changed
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`

## Commands Run
```bash
pnpm run docs:lint
pnpm run infra-policy-check
pnpm --filter web typecheck
pnpm --filter api typecheck
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

⏱️  Scan completed in 8ms

✅ Build succeeded: All checks passed!

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```

## Result
- Pass. `/plot` now enforces primary tabs only, consistent with current MVP lock docs.
