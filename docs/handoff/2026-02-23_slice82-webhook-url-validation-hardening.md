# 2026-02-23 — Slice 82: Webhook URL Validation Hardening

## Scope
- Harden outbound webhook invite delivery configuration validation.
- Keep slice additive and migration-free.

## Implementation
- `apps/api/src/registrar/webhook-invite-delivery.provider.ts`
  - Added `resolveWebhookUrl()` helper with URL parsing and protocol guard.
  - Only `http`/`https` URLs are accepted; malformed or unsupported URLs fail safely.
  - Invalid URL path now returns `failed` without issuing outbound request.
- `apps/api/test/webhook-invite-delivery.provider.test.ts`
  - Added malformed URL failure test.
  - Added unsupported protocol failure test.

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
- Risk: low (defensive config validation only).
- Rollback: single commit revert; migration-free.
