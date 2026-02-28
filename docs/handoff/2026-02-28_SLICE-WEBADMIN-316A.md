# SLICE-WEBADMIN-316A — Invite summary read shape stability pack 2

## Summary
- Hardened invite summary typed assertions for claimed/existing-user outcome counters at top-level and per-entry fields.
- Kept scope aligned to current API behavior and test-only changes.

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


⏱️  Scan completed in 4ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "registrar-client.test.ts"

PASS __tests__/registrar-client.test.ts
  registrar client scaffolding
    ✓ exposes published registrar code verify/redeem endpoints and keeps issue endpoint unresolved (1 ms)
    ✓ calls registrar code verify endpoint and returns typed payload (1 ms)
    ✓ throws when registrar code verify response has no data payload (9 ms)
    ✓ calls registrar code redeem endpoint and returns typed payload (1 ms)
    ✓ throws when registrar code redeem response has no data payload
    ✓ propagates forbidden error from registrar code verify endpoint (1 ms)
    ✓ propagates not-found error from registrar code verify endpoint
    ✓ propagates invalid-state error from registrar code redeem endpoint
  registrar project read client scaffolding
    ✓ calls list project endpoint and returns fallback when data is empty
    ✓ calls list project endpoint and returns fallback when data is null (1 ms)
    ✓ calls project detail endpoint and returns payload
    ✓ preserves nullable fields in project detail response shape
    ✓ keeps project detail contract stable when scene is null and projectName is present (1 ms)
    ✓ throws when project detail response has no data payload
    ✓ throws when project detail response data is null
    ✓ returns project list payload unchanged when data is present
  registrar sect-motion read client scaffolding
    ✓ calls sect-motion list endpoint and returns fallback when data is empty (1 ms)
    ✓ calls sect-motion list endpoint and returns fallback when data is null
    ✓ calls sect-motion detail endpoint and returns payload
    ✓ preserves nullable fields in sect-motion detail response shape
    ✓ keeps sect-motion detail contract stable when scene is present and payload contains nullable keys
    ✓ throws when sect-motion detail response has no data payload
    ✓ throws when sect-motion detail response data is null
  registrar promoter read client scaffolding
    ✓ calls promoter list endpoint and returns fallback when data is empty
    ✓ calls promoter list endpoint and returns fallback when data is null (6 ms)
    ✓ calls promoter detail endpoint and returns payload
    ✓ calls promoter capability-audit endpoint and returns payload (1 ms)
    ✓ preserves capability-audit event ordering and nullable/additive event fields
    ✓ handles capability-audit empty-state and sparse nullable event payloads (1 ms)
    ✓ preserves sparse capability-audit event arrays when total exceeds materialized rows
    ✓ throws when promoter detail response has no data payload
    ✓ throws when promoter detail response data is null
    ✓ throws when promoter capability-audit response has no data payload
    ✓ throws when promoter capability-audit response data is null
    ✓ returns promoter list payload unchanged when data is present (1 ms)
  registrar invite-status read client scaffolding
    ✓ passes through invite delivery outcome fields from invite-status response
    ✓ keeps queued/claimed invite outcomes with stable nullable field mapping (1 ms)
    ✓ preserves invite summary top-level and per-entry shape stability
    ✓ preserves invite summary outcome counters for claimed/existing-user outcomes
    ✓ throws when invite-status response has no data payload (1 ms)
  registrar client auth-error propagation consistency
    ✓ propagates Unauthorized errors across registrar read methods (1 ms)
    ✓ propagates Unauthorized errors for registrar code verify/redeem methods
    ✓ propagates Forbidden errors across registrar read and code methods (1 ms)

Test Suites: 1 passed, 1 total
Tests:       43 passed, 43 total
Snapshots:   0 total
Time:        0.493 s, estimated 1 s
Ran all test suites matching /registrar-client.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
