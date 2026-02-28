# SLICE-ADMIN-279A — Admin lifecycle audit event ordering guarantees

## Scope
- Added deterministic internal approve+issue helper to preserve decision-before-issuance audit ordering.
- Added focused service assertions for ordered lifecycle audit emissions; no route/schema/UI changes.

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
{"completed":true,"taskId":"SLICE-ADMIN-279A","updatedAt":"2026-02-27T23:39:10.235Z"}
```
