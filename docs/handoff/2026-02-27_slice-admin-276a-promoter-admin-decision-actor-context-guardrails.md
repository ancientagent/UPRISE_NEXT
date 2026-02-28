# SLICE-ADMIN-276A — Promoter admin decision actor-context guardrails

## Scope
- Hardened admin decision helpers with explicit system-only actor-context guards.
- Added deterministic forbidden handling for non-system actor paths; no route/schema/UI additions.

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
{"completed":true,"taskId":"SLICE-ADMIN-276A","updatedAt":"2026-02-27T23:35:47.396Z"}
```
