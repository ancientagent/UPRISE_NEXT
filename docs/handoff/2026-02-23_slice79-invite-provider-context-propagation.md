# 2026-02-23 — Slice 79: Invite Provider Context Propagation

## Scope
- Propagate provider-level delivery correlation context without changing public API contracts.
- Keep slice additive and migration-free.

## Implementation
- `apps/api/src/registrar/invite-delivery.provider.ts`
  - Extended provider interface with `InviteDeliveryContext`:
    - `deliveryId`
    - `registrarArtistMemberId`
- `apps/api/src/registrar/registrar-invite-delivery-worker.service.ts`
  - Worker now passes delivery context into provider `send(...)`.
- `apps/api/src/registrar/noop-invite-delivery.provider.ts`
  - Updated provider signature for context argument.
- `apps/api/src/registrar/webhook-invite-delivery.provider.ts`
  - Webhook body now includes provider context for downstream correlation.
- Tests:
  - `apps/api/test/registrar.invite-delivery-worker.test.ts` updated for context expectations.
  - `apps/api/test/webhook-invite-delivery.provider.test.ts` updated to assert context propagation.

## Docs
- Updated:
  - `docs/specs/system/registrar.md`
  - `docs/specs/users/identity-roles-capabilities.md`
  - `docs/CHANGELOG.md`

## Validation
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed
- `pnpm --filter api test -- webhook-invite-delivery.provider.test.ts invite-delivery-provider-selector.test.ts registrar.invite-delivery-worker.test.ts` — passed
- `pnpm --filter api typecheck` — passed
- `pnpm --filter web typecheck` — passed
- `pnpm run qa:phase2` — passed

## Risk / Rollback
- Risk: low (internal provider contract extension only).
- Rollback: single commit revert; migration-free.
