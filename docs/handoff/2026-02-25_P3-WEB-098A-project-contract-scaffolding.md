# 2026-02-25 — P3-WEB-098A: Registrar project web contract scaffolding

## Summary
Added web-tier typed contract/client scaffolding for `POST /registrar/project` without introducing new user-facing actions.

## Changed Files
- `apps/web/src/lib/registrar/contractInventory.ts`
- `apps/web/src/lib/registrar/client.ts`
- `apps/web/__tests__/registrar-contract-inventory.test.ts`

## Implementation
- Contract inventory updates:
  - kept `registrar.project.submit` as `gap` with `web_surface_missing` (API exists, no web action).
  - updated `registrar.sect_motion.submit` to `web_surface_missing` for API parity.
  - added endpoint helper `registrarProjectEndpoints.submit()`.
- Typed client scaffolding:
  - added `RegistrarProjectRegistrationPayload` and `RegistrarProjectRegistrationResult`.
  - added `submitProjectRegistration(payload, token)` calling `/registrar/project`.
- Added web unit coverage for project endpoint helper path construction.

## Guardrails
- No new CTA/button/action added to registrar UI.
- Web-tier boundary preserved (API client usage only).

## Validation Commands
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter web test -- registrar-contract-inventory.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Risk / Rollback
- Risk: low (typed contract/client scaffolding only; no UI behavior changes).
- Rollback: revert the three changed web files and this handoff note.
