# 2026-02-25 — P3-QA-098A: Project + Sect Registrar Validation

## Scope
Regression gate for slices:
- `P3-API-099A` (`POST /registrar/sect-motion` skeleton)
- `P3-WEB-098A` (web typed contract scaffolding for `/registrar/project`)

## Commands + Results

`pnpm run docs:lint`
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
```

`pnpm run infra-policy-check`
```text
> uprise-next@1.0.0 infra-policy-check /home/baris/UPRISE_NEXT
> tsx scripts/infra-policy-check.ts

🔍 UPRISE Web-Tier Contract Guard
✅ Web-Tier Contract Guard: No violations detected!
✅ Build succeeded: All checks passed!
```

`pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
```text
PASS test/registrar.controller.test.ts
PASS test/registrar.service.test.ts
PASS test/registrar.dto.test.ts

Test Suites: 3 passed, 3 total
Tests:       112 passed, 112 total
```

`pnpm --filter web test -- registrar-contract-inventory.test.ts`
```text
PASS __tests__/registrar-contract-inventory.test.ts
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
```

`pnpm --filter api typecheck && pnpm --filter web typecheck`
```text
> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit
```

## Verdict
- All required validation gates passed.
- No web-tier boundary violations detected.
- No test regressions in targeted registrar API/web contract suites.
