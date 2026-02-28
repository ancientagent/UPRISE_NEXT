# SLICE-WEBADMIN-256A — Registrar project+sect read inventory consistency pass

## Summary
- Aligned project/sect read contract inventory metadata wording to explicitly reflect implemented API read paths plus action-gated web status.
- Added contract tests to enforce path/template/status alignment and action-gated wording consistency.

## Files Changed
- `apps/web/src/lib/registrar/contractInventory.ts`
- `apps/web/__tests__/registrar-contract-inventory.test.ts`

## Verify Command (exact)
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- registrar-contract-inventory.test.ts registrar-client.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```

## Verify Output (exact)
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


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "registrar-contract-inventory.test.ts" "registrar-client.test.ts"

PASS __tests__/registrar-client.test.ts
PASS __tests__/registrar-contract-inventory.test.ts

Test Suites: 2 passed, 2 total
Tests:       50 passed, 50 total
Snapshots:   0 total
Time:        0.746 s, estimated 1 s
Ran all test suites matching /registrar-contract-inventory.test.ts|registrar-client.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
