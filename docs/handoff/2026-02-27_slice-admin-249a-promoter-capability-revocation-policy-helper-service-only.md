# SLICE-ADMIN-249A — Promoter capability revocation policy helper (service-only)

## Scope
- Added internal registrar revocation helper for promoter capability grants.
- Enforced append-only audit behavior with explicit `capability_revoked` log emission.
- Avoided destructive mutation shortcuts; no route/schema/UI changes.

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
{"completed":true,"taskId":"SLICE-ADMIN-249A","updatedAt":"2026-02-27T21:49:26.056Z"}
```
