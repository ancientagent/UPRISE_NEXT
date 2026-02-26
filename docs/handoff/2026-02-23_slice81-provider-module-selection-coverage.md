# 2026-02-23 — Slice 81: Provider Module Selection Coverage

## Scope
- Harden provider selection wiring by adding explicit unit coverage for module selection behavior.
- Keep slice additive and migration-free.

## Implementation
- `apps/api/src/registrar/invite-delivery-provider-selector.ts`
  - Added `selectInviteDeliveryProvider(...)` helper for module-level provider resolution.
- `apps/api/src/registrar/registrar.module.ts`
  - Updated provider token factory to use shared selector helper.
- `apps/api/test/registrar.module.provider-selection.test.ts`
  - Added coverage for:
    - default `noop` selection,
    - explicit `webhook` selection,
    - unknown-value fallback to `noop`.

## Docs
- Updated:
  - `docs/specs/system/registrar.md`
  - `docs/specs/users/identity-roles-capabilities.md`
  - `docs/CHANGELOG.md`

## Validation
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed
- `pnpm --filter api test -- registrar.module.provider-selection.test.ts invite-delivery-provider-selector.test.ts webhook-invite-delivery.provider.test.ts` — passed
- `pnpm --filter api typecheck` — passed
- `pnpm --filter web typecheck` — passed
- `pnpm run qa:phase2` — passed

## Risk / Rollback
- Risk: low (selector helper + test hardening only).
- Rollback: single commit revert; migration-free.
