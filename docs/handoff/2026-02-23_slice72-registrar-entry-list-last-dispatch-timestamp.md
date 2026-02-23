# 2026-02-23 — Slice 72: Registrar Entry-List Last Dispatch Timestamp

## Scope
- Extend existing `GET /registrar/artist/entries` read surface with per-entry dispatch timing context.
- No new endpoints, no migrations, no UI changes.

## Implementation
- `apps/api/src/registrar/registrar.service.ts`
  - Added per-entry `lastInviteDispatchAt` derived from the latest non-null `RegistrarInviteDelivery.dispatchedAt` linked to each registrar entry.
  - Preserved existing invite count summaries and response shape.
- `apps/api/test/registrar.service.test.ts`
  - Added assertions for latest timestamp selection.
  - Verified empty-entry path does not query delivery rows and keeps stable shape.

## Docs
- Updated:
  - `docs/specs/system/registrar.md`
  - `docs/specs/users/identity-roles-capabilities.md`
  - `docs/CHANGELOG.md`

## Validation
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed
- `pnpm --filter api test -- registrar.service.test.ts registrar.controller.test.ts` — passed
- `pnpm --filter api typecheck` — passed
- `pnpm --filter web typecheck` — passed
- `pnpm run qa:phase2` — passed

## Risk / Rollback
- Risk: low (read-only additive field).
- Rollback: single commit revert; migration-free.
