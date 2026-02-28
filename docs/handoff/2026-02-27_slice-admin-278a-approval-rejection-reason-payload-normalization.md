# SLICE-ADMIN-278A — Approval/rejection reason payload normalization

## Scope
- Normalized admin decision reason metadata to bounded stable shape (trimmed, empty->null, capped length).
- Preserved additive metadata and existing endpoint behavior; no route/schema/UI changes.

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
{"completed":true,"taskId":"SLICE-ADMIN-278A","updatedAt":"2026-02-27T23:38:05.397Z"}
```
