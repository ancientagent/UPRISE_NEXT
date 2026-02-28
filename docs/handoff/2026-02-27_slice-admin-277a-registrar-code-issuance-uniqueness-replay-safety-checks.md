# SLICE-ADMIN-277A — Registrar code issuance uniqueness + replay safety checks

## Scope
- Added replay-safe uniqueness guard to block duplicate active code issuance for the same approved promoter registrar entry.
- Kept scope service/test-only with no route/schema/UI changes.

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
{"completed":true,"taskId":"SLICE-ADMIN-277A","updatedAt":"2026-02-27T23:36:44.701Z"}
```
