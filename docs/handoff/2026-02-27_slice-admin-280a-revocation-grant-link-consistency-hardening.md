# SLICE-ADMIN-280A — Revocation grant-link consistency hardening

## Scope
- Hardened revocation internals with explicit grant-link consistency checks against target registrar entry.
- Preserved append-only audit trail while carrying source grant code linkage metadata.
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
{"completed":true,"taskId":"SLICE-ADMIN-280A","updatedAt":"2026-02-27T23:40:08.496Z"}
```
