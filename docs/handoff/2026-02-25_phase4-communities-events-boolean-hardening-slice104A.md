# 2026-02-25 — Phase 4 Slice 104A: Communities Events Boolean Hardening

## Scope Lock
1. Fix `includePast` query boolean parsing for communities events endpoints.
2. Ensure string `false` remains boolean `false`.
3. Reject invalid boolean strings instead of silently coercing them.
4. Add targeted controller coverage for corrected behavior.
5. Keep change additive and migration-free.

## Out of Scope
- Endpoint shape changes.
- Events service business-logic changes.
- Web UI changes.
- Schema migrations.

## Changes Implemented
- `apps/api/src/communities/dto/community.dto.ts`
  - Added strict query boolean parser for string values (`true`/`false` only).
  - Updated `GetCommunityEventsSchema.includePast` to use strict parser.
- `apps/api/test/communities.active.controller.test.ts`
  - Added assertion: `includePast='false'` parses to boolean `false`.
  - Added assertion: invalid string (`includePast='not-boolean'`) throws `BadRequestException`.
- `docs/CHANGELOG.md` updated.

## Validation Commands
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- communities.active.controller.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Validation Results
- `pnpm run docs:lint` ✅ passed
- `pnpm run infra-policy-check` ✅ passed
- `pnpm --filter api test -- communities.active.controller.test.ts` ✅ passed (1 suite, 7 tests)
- `pnpm --filter api typecheck` ✅ passed
- `pnpm --filter web typecheck` ✅ passed

## Risk / Rollback
- Risk: low; query validation correction only.
- Rollback: single commit revert.
