# SLICE-ADMIN-310A — Revocation state guard regression hardening

## Scope
- Tightened revocation state guards to reject impossible transitions deterministically.
- Added focused regression tests for non-revocable grant-state paths; no new behavior beyond policy boundaries.

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
{"completed":true,"taskId":"SLICE-ADMIN-310A","updatedAt":"2026-02-28T02:33:43.921Z"}
```
