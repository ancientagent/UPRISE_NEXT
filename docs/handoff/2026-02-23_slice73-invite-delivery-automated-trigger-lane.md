# 2026-02-23 — Slice 73: Invite Delivery Automated Trigger Lane

## Scope
- Implement an internal, env-gated automated execution lane for queued invite delivery processing.
- Keep behavior additive and migration-free.
- Keep delivery provider as the existing no-op seam; no real email integration in this slice.

## Implementation
- `apps/api/src/registrar/registrar-invite-delivery-trigger.service.ts`
  - Added `RegistrarInviteDeliveryTriggerService` (`OnModuleInit`/`OnModuleDestroy` lifecycle).
  - Trigger is disabled unless `REGISTRAR_INVITE_DELIVERY_AUTORUN_ENABLED` is truthy.
  - Poll interval is configurable via `REGISTRAR_INVITE_DELIVERY_AUTORUN_INTERVAL_MS`.
  - Interval has minimum floor (`5000ms`) to avoid runaway loop configuration.
  - Added overlap guard: if a prior worker run is still active, the next tick is skipped.
  - Each tick delegates queue execution to `RegistrarInviteDeliveryWorkerService.processQueuedDeliveries()`.
- `apps/api/src/registrar/registrar.module.ts`
  - Wired `RegistrarInviteDeliveryTriggerService` into registrar module providers and exports.
- `apps/api/test/registrar.invite-delivery-trigger.service.test.ts`
  - Added focused unit coverage:
    - disabled mode does not start polling,
    - enabled mode schedules polling and invokes worker,
    - interval clamped to minimum safety floor,
    - overlap guard prevents concurrent worker invocations.

## Docs
- Updated:
  - `docs/specs/system/registrar.md`
  - `docs/specs/users/identity-roles-capabilities.md`
  - `docs/CHANGELOG.md`

## Validation
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed
- `pnpm --filter api test -- registrar.invite-delivery-worker.test.ts registrar.invite-delivery-trigger.service.test.ts` — passed
- `pnpm --filter api typecheck` — passed
- `pnpm --filter web typecheck` — passed
- `pnpm run qa:phase2` — passed

## Risk / Rollback
- Risk: low-medium (new background trigger behavior, but default-off and env-gated).
- Rollback: single commit revert; no migration rollback required.
