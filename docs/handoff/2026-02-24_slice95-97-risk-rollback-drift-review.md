# 2026-02-24 — P3-REV-095B: Risk/Rollback + Drift Review (Slices 95-97)

## Scope Reviewed
- Slice 95 commit: `7b5a783` (`POST /registrar/code/verify`, `POST /registrar/code/redeem`)
- Slice 96 commit: `ef996a6` (`UserCapabilityGrant` persistence + promoter read enrichment)
- Slice 97 commit: `b8155dc` (`CapabilityGrantAuditLog` persistence + audit read endpoint)
- Files reviewed across API/service/controller/DTO/tests, Prisma schema + migrations, web typed contract scaffolding, and touched specs/changelog/handoff docs.

## Findings (Severity Ordered)
1. `Medium` — Redeem flow can double-succeed under concurrent requests  
   - Location: `apps/api/src/registrar/registrar.service.ts` (`redeemRegistrarCodeForUser`, around lines 186-315).
   - Detail: code eligibility is checked before transaction, but inside the transaction the code row is updated by `id` only (no `status=issued` or `redeemedAt IS NULL` guard). Two concurrent requests can both pass pre-check and both commit `redeemed` updates plus duplicate audit writes.
   - Impact: duplicate successful redemption responses and duplicate `code_redeemed` / `capability_granted` audit events for one code.
   - Recommendation: use an atomic guarded update (`updateMany` with `id + status=issued + redeemedAt=null`, assert affected row count = 1) before grant/audit writes, or enforce serializable locking semantics around the code row.

2. `Low` — Branch scope includes unrelated queue-control commits beyond slices 95-97  
   - Commits: `7047c5d`, `258ef31`, `234beac`.
   - Detail: these are valid changes but outside the declared slice 95-97 review scope; merging as one unit increases review and rollback blast radius.
   - Recommendation: ship with slice-focused PR boundaries (or cherry-pick slice commits) for cleaner operational rollback.

## Rollback Plan
- Slice 95 (`7b5a783`): revert commit to remove verify/redeem API primitives. No migration rollback required.
- Slice 96 (`ef996a6`): revert commit; if migration is already applied, add compensating migration to drop `user_capability_grants` after data review/export.
- Slice 97 (`b8155dc`): revert commit; if migration is already applied, add compensating migration to drop `capability_grant_audit_logs` after retention review/export.
- If selective rollback is needed: disable dependent routes first (`/registrar/code/*`, `/registrar/promoter/:entryId/capability-audit`) before data-plane rollback.

## Validation Gates (Exact Command Output)
`pnpm run docs:lint`
```text
> uprise-next@1.0.0 docs:lint /home/baris/UPRISE_NEXT
> node scripts/docs-lint.mjs && pnpm run canon:lint

[docs:lint] ✅ No tracked PDFs
[docs:lint] ✅ No tracked Zone.Identifier artifacts
[docs:lint] ✅ Docs directory structure looks present
[docs:lint] ✅ Specs metadata present
[docs:lint] ✅ No unexpected root-level markdown files
[docs:lint] ✅ docs:lint passed

> uprise-next@1.0.0 canon:lint /home/baris/UPRISE_NEXT
> node scripts/canon-lint.mjs

[canon:lint] OK: Checked 10 canon markdown files
```

`pnpm run infra-policy-check`
```text
> uprise-next@1.0.0 infra-policy-check /home/baris/UPRISE_NEXT
> tsx scripts/infra-policy-check.ts


🔍 UPRISE Web-Tier Contract Guard
════════════════════════════════════════════════════════════════════════════════
Scanning: apps/web
Patterns: 24 prohibited patterns
════════════════════════════════════════════════════════════════════════════════


✅ Web-Tier Contract Guard: No violations detected!
   All architectural boundaries are properly enforced.


⏱️  Scan completed in 3ms

✅ Build succeeded: All checks passed!
```

`pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
```text
> api@1.0.0 test /home/baris/UPRISE_NEXT/apps/api
> jest "registrar.dto.test.ts" "registrar.controller.test.ts" "registrar.service.test.ts"

PASS test/registrar.controller.test.ts
PASS test/registrar.service.test.ts
PASS test/registrar.dto.test.ts

Test Suites: 3 passed, 3 total
Tests:       96 passed, 96 total
Snapshots:   0 total
Time:        0.777 s, estimated 1 s
Ran all test suites matching /registrar.dto.test.ts|registrar.controller.test.ts|registrar.service.test.ts/i.
```

`pnpm --filter api typecheck && pnpm --filter web typecheck`
```text
> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit
```

## Review Verdict
- `Conditional Go` for slices 95-97 with follow-up fix recommended for redemption concurrency guard before higher-traffic rollout.
