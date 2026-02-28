# SLICE-ADMIN-311A — Admin regression parity pack 2

## Scope
- Expanded registrar admin lifecycle regression coverage for forbidden/not-found/invalid-state parity across current internal flows.
- No endpoint/schema/UI changes.

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
{"completed":true,"taskId":"SLICE-ADMIN-311A","updatedAt":"2026-02-28T02:34:38.841Z"}
```
