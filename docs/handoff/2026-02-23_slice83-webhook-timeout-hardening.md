# 2026-02-23 — Slice 83: Webhook Timeout Hardening

## Scope
- Add bounded timeout behavior to webhook outbound invite delivery provider.
- Keep behavior additive and migration-free.

## Implementation
- `apps/api/src/registrar/webhook-invite-delivery.provider.ts`
  - Added outbound timeout guard with `AbortController`.
  - Added timeout env config: `REGISTRAR_INVITE_DELIVERY_WEBHOOK_TIMEOUT_MS`.
  - Added default timeout and minimum timeout floor safety.
- `apps/api/test/webhook-invite-delivery.provider.test.ts`
  - Added coverage for:
    - default timeout usage,
    - configured timeout usage,
    - minimum timeout clamp.

## Docs
- Updated:
  - `docs/specs/system/registrar.md`
  - `docs/specs/users/identity-roles-capabilities.md`
  - `docs/CHANGELOG.md`

## Validation
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed
- `pnpm --filter api test -- webhook-invite-delivery.provider.test.ts invite-delivery-provider-selector.test.ts registrar.module.provider-selection.test.ts` — passed
- `pnpm --filter api typecheck` — passed
- `pnpm --filter web typecheck` — passed
- `pnpm run qa:phase2` — passed

## Risk / Rollback
- Risk: low (defensive outbound timeout controls only).
- Rollback: single commit revert; migration-free.
