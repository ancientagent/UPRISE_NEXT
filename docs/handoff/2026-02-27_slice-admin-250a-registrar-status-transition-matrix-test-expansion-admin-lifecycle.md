# SLICE-ADMIN-250A — Registrar status transition matrix test expansion (admin lifecycle)

## Scope
- Expanded service transition-matrix coverage for promoter approval and capability-revocation lifecycle helpers.
- Added valid + invalid transition assertions without introducing new behavior.
- No route/schema/UI changes.

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
{"completed":true,"taskId":"SLICE-ADMIN-250A","updatedAt":"2026-02-27T21:50:17.100Z"}
```
