# SLICE-ADMIN-281A — Admin lifecycle regression matrix expansion pack

## Scope
- Expanded regression matrix for admin lifecycle internals across approval/rejection/issuance/revocation flows.
- Added forbidden/not-found/invalid-state assertions for lifecycle helper paths; no route/schema/UI changes.

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
{"completed":true,"taskId":"SLICE-ADMIN-281A","updatedAt":"2026-02-27T23:41:01.177Z"}
```
