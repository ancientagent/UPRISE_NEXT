# SLICE-WEBADMIN-403A — Registrar client auth/error parity pack 5

## Summary
- Extended auth/error propagation parity assertions for remaining registrar web client submit/list/materialize/dispatch/sync methods.
- Scope remained tests-only; no contract or behavior changes.

## Runtime Clean Command (exact)
```bash
pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task-lane-b-batch14.json
```

## Runtime Clean Output (exact)
```text
> uprise-next@1.0.0 reliant:runtime:clean /home/baris/UPRISE_NEXT
> node scripts/reliant-runtime-clean.mjs "--" "--runtime" ".reliant/runtime/current-task-lane-b-batch14.json"

{
  "cleared": true,
  "dryRun": false,
  "wouldClear": true,
  "runtimeState": "present",
  "runtimePath": ".reliant/runtime/current-task-lane-b-batch14.json",
  "checkedAt": "2026-02-28T05:37:50.006Z",
  "previousTaskId": "SLICE-WEBADMIN-402A"
}
```

## Claim Command (exact)
```bash
node scripts/reliant-slice-queue.mjs claim --queue .reliant/queue/mvp-lane-b-web-contract-batch14.json --runtime .reliant/runtime/current-task-lane-b-batch14.json
```

## Claim Output (exact)
```json
{"claimed":true,"resultCode":"claimed_new_task","task":{"taskId":"SLICE-WEBADMIN-403A","title":"Registrar client auth/error parity pack 5","prompt":"Execute one MVP slice only: normalize auth/error propagation assertions across existing registrar web client methods; tests-only.","verifyCommand":"pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- registrar-client.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck","sourceQueue":null,"claimedAt":"2026-02-28T05:37:50.028Z"}}
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


⏱️  Scan completed in 3ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "registrar-client.test.ts"

PASS __tests__/registrar-client.test.ts

Test Suites: 1 passed, 1 total
Tests:       53 passed, 53 total
Snapshots:   0 total
Time:        0.533 s, estimated 1 s
Ran all test suites matching /registrar-client.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
