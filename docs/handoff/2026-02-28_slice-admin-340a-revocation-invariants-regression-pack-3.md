# SLICE-ADMIN-340A — Revocation invariants regression pack 3

## Scope
- Reinforced revocation invariants and invalid-state regression checks in existing service/controller paths.
- No route/schema/UI additions.

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
{"completed":true,"taskId":"SLICE-ADMIN-340A","updatedAt":"2026-02-28T02:49:26.923Z"}
```
