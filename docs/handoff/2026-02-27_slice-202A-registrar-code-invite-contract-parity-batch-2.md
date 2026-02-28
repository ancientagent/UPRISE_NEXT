# Lane C Handoff — SLICE-CODEINV-202A

## Slice
- Task ID: SLICE-CODEINV-202A
- Title: Registrar code/invite contract parity batch 2
- Queue: .reliant/queue/mvp-lane-c-code-invite-backlog.json
- Runtime: .reliant/runtime/current-task-lane-c.json

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts && pnpm --filter web test -- registrar-client.test.ts registrar-contract-inventory.test.ts && pnpm --filter api typecheck && pnpm --filter web typecheck
```

## Verify Output
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

PASS test/registrar.controller.test.ts
PASS test/registrar.service.test.ts

Test Suites: 2 passed, 2 total
Tests:       139 passed, 139 total
Snapshots:   0 total
Time:        0.474 s, estimated 1 s
Ran all test suites matching /registrar.controller.test.ts|registrar.service.test.ts/i.

> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "registrar-client.test.ts" "registrar-contract-inventory.test.ts"

PASS __tests__/registrar-client.test.ts
PASS __tests__/registrar-contract-inventory.test.ts

Test Suites: 2 passed, 2 total
Tests:       43 passed, 43 total
Snapshots:   0 total
Time:        0.501 s, estimated 1 s
Ran all test suites matching /registrar-client.test.ts|registrar-contract-inventory.test.ts/i.

> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit
```

## Complete Command
```bash
node scripts/reliant-slice-queue.mjs complete --queue .reliant/queue/mvp-lane-c-code-invite-backlog.json --runtime .reliant/runtime/current-task-lane-c.json --task-id SLICE-CODEINV-202A --report docs/handoff/2026-02-27_slice-202A-registrar-code-invite-contract-parity-batch-2.md
```

## Complete Output
```json
{"completed":true,"taskId":"SLICE-CODEINV-202A"}
```
