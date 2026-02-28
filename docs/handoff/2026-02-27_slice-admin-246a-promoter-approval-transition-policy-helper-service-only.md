# SLICE-ADMIN-246A — Promoter approval transition policy helper (service-only)

## Scope
- Added internal registrar service transition policy helper for promoter approval lifecycle.
- Enforced explicit transition guard: `submitted -> approved|rejected` only.
- Added targeted service tests only; no public route, schema, or UI changes.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api test -- registrar.service.test.ts && pnpm --filter api typecheck && pnpm --filter web typecheck
```

## Verify Output (exact)
```text

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

```

## Queue Transition
```text
{"completed":true,"taskId":"SLICE-ADMIN-246A","updatedAt":"2026-02-27T21:45:47.202Z"}
```
