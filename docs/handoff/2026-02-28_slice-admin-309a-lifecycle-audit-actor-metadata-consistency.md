# SLICE-ADMIN-309A — Lifecycle audit actor metadata consistency

## Scope
- Enforced consistency of system actor metadata across decision, issuance, and revocation audit emissions.
- Added targeted assertions only; no endpoint/schema/UI changes.

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
{"completed":true,"taskId":"SLICE-ADMIN-309A","updatedAt":"2026-02-28T02:32:29.563Z"}
```
