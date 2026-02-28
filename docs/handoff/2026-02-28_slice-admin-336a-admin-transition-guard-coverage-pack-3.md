# SLICE-ADMIN-336A — Admin transition guard coverage pack 3

## Scope
- Expanded transition-guard coverage for valid/invalid state edges in existing admin internals only.
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
{"completed":true,"taskId":"SLICE-ADMIN-336A","updatedAt":"2026-02-28T02:46:03.326Z"}
```
