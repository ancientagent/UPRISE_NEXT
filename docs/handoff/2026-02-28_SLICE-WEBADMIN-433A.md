# SLICE-WEBADMIN-433A — Registrar client auth/error parity pack 6

## Summary
- Added auth-error parity assertions for missing-token propagation across read/submit/code registrar web client methods.
- Scope remained tests-only.

## Claim Command (exact)
```bash
node scripts/reliant-slice-queue.mjs claim --queue .reliant/queue/mvp-lane-b-web-contract-batch15.json --runtime .reliant/runtime/current-task-lane-b-batch15.json
```

## Claim Output (exact)
```json
{"claimed":true,"resultCode":"claimed_new_task","task":{"taskId":"SLICE-WEBADMIN-433A","title":"Registrar client auth/error parity pack 6","prompt":"Execute one MVP slice only: normalize auth/error propagation assertions across existing registrar web client methods; tests-only.","verifyCommand":"pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- registrar-client.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck","sourceQueue":null,"claimedAt":"2026-02-28T06:21:25.079Z"}}
```

## Verify Command (exact)
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- registrar-client.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
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
> jest "registrar-client.test.ts"

PASS __tests__/registrar-client.test.ts

Test Suites: 1 passed, 1 total
Tests:       56 passed, 56 total
Snapshots:   0 total
Time:        0.545 s, estimated 1 s
Ran all test suites matching /registrar-client.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
