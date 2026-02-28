# SLICE-ADMIN-248A — Capability audit-log emission parity for approval and issuance

## Scope
- Hardened registrar approval/issuance audit-log emission metadata to deterministic additive-only shapes.
- Added targeted service assertions for approval transition and issuance metadata parity.
- No route/schema/UI changes.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api test -- registrar.service.test.ts registrar.controller.test.ts && pnpm --filter api typecheck && pnpm --filter web typecheck
```

## Verify Output (exact)
```text

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

```

## Queue Transition
```text
{"completed":true,"taskId":"SLICE-ADMIN-248A","updatedAt":"2026-02-27T21:48:14.593Z"}
```
