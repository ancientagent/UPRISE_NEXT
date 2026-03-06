# SLICE-ADMIN-428A — Registrar approval metadata normalization pack 6

## Scope
- Tightened approval/rejection metadata normalization edge assertions while preserving existing response contracts.
- Added internal-tab preservation normalization coverage for decision reasons.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts && pnpm --filter api typecheck && pnpm --filter web typecheck
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


> api@1.0.0 test /home/baris/UPRISE_NEXT/apps/api
> jest "registrar.controller.test.ts" "registrar.service.test.ts"

PASS test/registrar.service.test.ts
PASS test/registrar.controller.test.ts

Test Suites: 2 passed, 2 total
Tests:       198 passed, 198 total
Snapshots:   0 total
Time:        0.605 s, estimated 1 s
Ran all test suites matching /registrar.controller.test.ts|registrar.service.test.ts/i.

> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

```

## Queue Transition
```text
PENDING
```
