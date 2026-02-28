# SLICE-ADMIN-308A — Approval payload normalization edge-case matrix

## Scope
- Expanded admin approval/rejection reason normalization edge-case coverage (nullability and empty-reason guards).
- Preserved existing API shape and behavior; tests-only expansion in targeted paths.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts && pnpm --filter api typecheck && pnpm --filter web typecheck
```

## Verify Output (exact)
```text

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

```

## Queue Transition
```text
{"completed":true,"taskId":"SLICE-ADMIN-308A","updatedAt":"2026-02-28T02:31:08.910Z"}
```
