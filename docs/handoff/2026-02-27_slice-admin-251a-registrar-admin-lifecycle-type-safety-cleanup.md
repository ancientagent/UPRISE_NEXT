# SLICE-ADMIN-251A — Registrar admin lifecycle type-safety cleanup

## Scope
- Tightened service-layer type contracts for registrar admin lifecycle internals (status literals + audit metadata typing).
- Preserved existing behavior and did not add endpoints or UI actions.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck
```

## Verify Output (exact)
```text

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

```

## Queue Transition
```text
{"completed":true,"taskId":"SLICE-ADMIN-251A","updatedAt":"2026-02-27T21:51:18.596Z"}
```
