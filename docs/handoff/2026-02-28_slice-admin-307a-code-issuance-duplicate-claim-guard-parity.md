# SLICE-ADMIN-307A — Code issuance duplicate-claim guard parity

## Scope
- Hardened issuance internals with transactional duplicate-claim guard parity for approved entries.
- Added focused service race-window rejection coverage; no new endpoints or self-issuance path.

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
{"completed":true,"taskId":"SLICE-ADMIN-307A","updatedAt":"2026-02-28T02:30:08.054Z"}
```
