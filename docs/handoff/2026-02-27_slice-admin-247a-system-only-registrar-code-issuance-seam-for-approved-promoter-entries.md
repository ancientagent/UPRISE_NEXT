# SLICE-ADMIN-247A — System-only registrar code issuance seam for approved promoter entries

## Scope
- Added internal system-only issuance seam for promoter capability codes on approved promoter entries.
- Preserved approved-promoter precondition and system-only issuer authority; no self-issuance path added.
- Added provenance metadata linkage (`sourceRegistrarEntryId`, `sourceRegistrarCodeId`) and targeted service tests.
- No public route/schema/UI changes.

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
{"completed":true,"taskId":"SLICE-ADMIN-247A","updatedAt":"2026-02-27T21:47:12.857Z"}
```
