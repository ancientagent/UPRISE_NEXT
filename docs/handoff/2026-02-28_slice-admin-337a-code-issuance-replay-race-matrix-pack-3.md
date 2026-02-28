# SLICE-ADMIN-337A — Code issuance replay race matrix pack 3

## Scope
- Hardened replay/race matrix coverage around approved-entry code issuance internals with focused service tests only.
- No behavior expansion, no endpoint/schema/UI changes.

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
{"completed":true,"taskId":"SLICE-ADMIN-337A","updatedAt":"2026-02-28T02:47:03.186Z"}
```
