# 2026-02-24 — Slice 97: Capability Grant Audit Persistence + Read Surface

## Scope Lock
1. Add additive capability-grant audit persistence.
2. Emit audit events from registrar code issuance/redeem/grant transitions.
3. Add submitter-owned promoter capability audit read endpoint.
4. Keep implementation additive and API-tier only (no new UI actions).

## Implemented
- Added Prisma model/table `CapabilityGrantAuditLog` and migration:
  - `apps/api/prisma/migrations/20260224213000_add_capability_grant_audit_logs/migration.sql`
- Integrated audit writes into registrar transitions:
  - `issueRegistrarCodeForApprovedPromoterEntry` now records `code_issued`.
  - `redeemRegistrarCodeForUser` now records `code_redeemed` + `capability_granted`.
- Added registrar service read primitive:
  - `listPromoterCapabilityAudit(userId, entryId)`
  - submitter-scoped, promoter-entry-only enforcement.
- Added registrar controller route:
  - `GET /registrar/promoter/:entryId/capability-audit`
- Added unit coverage:
  - service: audit write assertions + audit read success/guard paths,
  - controller: audit endpoint delegation and error propagation.
- Updated web typed contract scaffolding:
  - contract inventory endpoint registration for promoter capability audit,
  - typed client endpoint helpers + response interfaces (no UI wiring).

## Validation
- `pnpm --filter api prisma:generate` ✅
- `pnpm run docs:lint` ✅
- `pnpm run infra-policy-check` ✅
- `pnpm --filter api test -- registrar.service.test.ts registrar.controller.test.ts registrar.dto.test.ts` ✅
- `pnpm --filter api typecheck` ✅
- `pnpm --filter web typecheck` ✅

## Risk
- Low to medium:
  - additive schema and append-oriented audit table,
  - additive read endpoint, submitter-scoped.

## Rollback
- Revert slice commit for code/docs changes.
- If migration already applied, drop `capability_grant_audit_logs` via compensating migration after audit retention review.
