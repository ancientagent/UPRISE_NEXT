# Lane C Handoff - SLICE-INVITE-262A

Slice
Task ID: SLICE-INVITE-262A
Title: Invite delivery state read-model parity tests
Queue: .reliant/queue/mvp-lane-c-invite-next.json
Runtime: .reliant/runtime/current-task-lane-c-next.json

Verify Command:
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts && pnpm --filter web test -- registrar-client.test.ts && pnpm --filter api typecheck && pnpm --filter web typecheck

Verify Output:

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


> api@1.0.0 test /home/baris/UPRISE_NEXT/apps/api
> jest "registrar.controller.test.ts" "registrar.service.test.ts"

PASS test/registrar.service.test.ts
PASS test/registrar.controller.test.ts

Test Suites: 2 passed, 2 total
Tests:       139 passed, 139 total
Snapshots:   0 total
Time:        0.439 s, estimated 1 s
Ran all test suites matching /registrar.controller.test.ts|registrar.service.test.ts/i.

> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "registrar-client.test.ts"

PASS __tests__/registrar-client.test.ts
  registrar client scaffolding
    ✓ exposes published registrar code verify/redeem endpoints and keeps issue endpoint unresolved (2 ms)
    ✓ calls registrar code verify endpoint and returns typed payload (1 ms)
    ✓ throws when registrar code verify response has no data payload (9 ms)
    ✓ calls registrar code redeem endpoint and returns typed payload
    ✓ throws when registrar code redeem response has no data payload
    ✓ propagates forbidden error from registrar code verify endpoint (1 ms)
    ✓ propagates not-found error from registrar code verify endpoint
    ✓ propagates invalid-state error from registrar code redeem endpoint (1 ms)
  registrar project read client scaffolding
    ✓ calls list project endpoint and returns fallback when data is empty
    ✓ calls list project endpoint and returns fallback when data is null (1 ms)
    ✓ calls project detail endpoint and returns payload
    ✓ throws when project detail response has no data payload
    ✓ throws when project detail response data is null (1 ms)
    ✓ returns project list payload unchanged when data is present
  registrar sect-motion read client scaffolding
    ✓ calls sect-motion list endpoint and returns fallback when data is empty
    ✓ calls sect-motion list endpoint and returns fallback when data is null
    ✓ calls sect-motion detail endpoint and returns payload (1 ms)
    ✓ throws when sect-motion detail response has no data payload
    ✓ throws when sect-motion detail response data is null
  registrar promoter read client scaffolding
    ✓ calls promoter list endpoint and returns fallback when data is empty (1 ms)
    ✓ calls promoter list endpoint and returns fallback when data is null
    ✓ calls promoter detail endpoint and returns payload
    ✓ calls promoter capability-audit endpoint and returns payload (1 ms)
    ✓ preserves capability-audit event ordering and nullable/additive event fields
    ✓ throws when promoter detail response has no data payload
    ✓ throws when promoter detail response data is null (1 ms)
    ✓ throws when promoter capability-audit response has no data payload
    ✓ throws when promoter capability-audit response data is null
    ✓ returns promoter list payload unchanged when data is present
  registrar invite-status read client scaffolding
    ✓ passes through invite delivery outcome fields from invite-status response (1 ms)
    ✓ keeps queued/claimed invite outcomes with stable nullable field mapping
    ✓ throws when invite-status response has no data payload

Test Suites: 1 passed, 1 total
Tests:       32 passed, 32 total
Snapshots:   0 total
Time:        0.452 s, estimated 1 s
Ran all test suites matching /registrar-client.test.ts/i.

> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

Complete Command:
node scripts/reliant-slice-queue.mjs complete --queue .reliant/queue/mvp-lane-c-invite-next.json --runtime .reliant/runtime/current-task-lane-c-next.json --task-id SLICE-INVITE-262A --report docs/handoff/2026-02-27_slice-262A-invite-delivery-state-read-model-parity-tests.md

Complete Output:
{"completed":true,"taskId":"SLICE-INVITE-262A","updatedAt":"2026-02-27T21:39:37.722Z"}
