# 2026-02-23 — Slice 78: Outbound Webhook Invite Provider

## Scope
- Add an outbound invite delivery provider option while preserving existing default-safe behavior.
- Keep API contracts, DB schema, and web surfaces unchanged.

## Implementation
- `apps/api/src/registrar/webhook-invite-delivery.provider.ts`
  - Added `WebhookInviteDeliveryProvider` for outbound invite delivery handoff.
  - Provider sends `POST` JSON payloads to `REGISTRAR_INVITE_DELIVERY_WEBHOOK_URL`.
  - Optional bearer token header from `REGISTRAR_INVITE_DELIVERY_WEBHOOK_TOKEN`.
  - Returns `sent` on `2xx`, `failed` on non-`2xx` or exceptions.
- `apps/api/src/registrar/invite-delivery-provider-selector.ts`
  - Added safe provider-kind resolver with default `noop` fallback.
- `apps/api/src/registrar/registrar.module.ts`
  - Switched invite provider token wiring to env-driven selection:
    - `noop` (default),
    - `webhook`.
  - Unknown/empty config values fallback to `noop`.
- Tests:
  - `apps/api/test/webhook-invite-delivery.provider.test.ts`
  - `apps/api/test/invite-delivery-provider-selector.test.ts`

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
- Risk: low-medium (new outbound provider mode; default remains noop).
- Rollback: single commit revert; migration-free.
