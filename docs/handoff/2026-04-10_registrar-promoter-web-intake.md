# 2026-04-10 — Registrar Promoter Web Intake

## Summary
Added the missing web-side promoter registrar slice so `/registrar` now supports promoter intake and submitter-owned promoter status reads instead of limiting the route to Artist/Band registration only.

## What Changed
- Added `submitPromoterRegistration` to `apps/web/src/lib/registrar/client.ts`.
- Extended `apps/web/src/app/registrar/page.tsx` with:
  - `Promoter Registration` action selection,
  - Home Scene + GPS-gated promoter submit form,
  - submitter-owned promoter registration history,
  - on-demand promoter detail and capability-audit reads,
  - eligibility snapshot explaining Home Scene scope, visitor-context non-authority, and promoter event-creation readiness,
  - `Promoter Capability Code` panel with explicit verify/redeem actions.
- Reconciled `apps/web/src/lib/registrar/contractInventory.ts` and `apps/web/__tests__/registrar-contract-inventory.test.ts` so promoter web intake/read endpoints are now tracked as implemented rather than stale web-surface gaps.
- Reconciled registrar code verify/redeem inventory status so those endpoints are now tracked as implemented web intake rather than action-gated gaps.
- Added targeted web regression coverage in:
  - `apps/web/__tests__/registrar-client.test.ts`
  - `apps/web/__tests__/route-ux-consistency-lock.test.ts`
  - `apps/web/__tests__/registrar-contract-inventory.test.ts`
- Updated `docs/specs/users/identity-roles-capabilities.md` and `docs/CHANGELOG.md`.

## Browser QA
Chrome DevTools MCP on `http://127.0.0.1:9222`:
- Navigated to `http://127.0.0.1:3000/registrar`.
- Verified both registrar actions render:
  - `Band / Artist Registration`
  - `Promoter Registration`
- Opened promoter form and confirmed:
  - Home Scene resolved as `Austin, TX • Punk`
  - GPS gate copy appears when `gpsVerified` is false
  - submit button remains disabled while GPS is unresolved/false
  - promoter history panel renders independently from artist history
- Verified registrar code panel renders with:
  - `Verify Code`
  - `Redeem Code`
- Triggered empty-code verify path and confirmed inline error:
  - `Registrar code is required.`

## Verification
- `pnpm --filter web test -- registrar-client route-ux-consistency-lock`
- `pnpm --filter web test -- registrar-contract-inventory route-ux-consistency-lock registrar-client`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`

## Notes
- This slice closes the obvious web/runtime gap for promoter registrar intake.
- It does not implement promoter approval transitions, code issuance, or Print Shop event creation.
- Event/package runtime is still blocked on the existing deferred Print Shop / pricing / capability decisions.
