# SLICE-ADMIN-306A — Admin decision transition table strictness hardening

## Scope
- Tightened admin decision transition-table strictness for submitted/approved/rejected flows with deterministic invalid-state handling.
- Added targeted service regression tests; no route/schema/UI additions.

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
{"completed":true,"taskId":"SLICE-ADMIN-306A","updatedAt":"2026-02-28T02:29:09.226Z"}
```
