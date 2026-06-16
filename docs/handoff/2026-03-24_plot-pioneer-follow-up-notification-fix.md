# 2026-03-24 — Plot pioneer follow-up notification fix

## Scope
- Fix only the confirmed `/plot` mismatch where the pioneer follow-up message was not discoverable from the existing profile-strip notification icon.
- Preserve the current profile-strip structure and avoid inventing a new notification system.

## Source inputs
- `AGENTS.md`
- `docs/handoff/2026-03-24_session-context-reconciliation.md`
- `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/plot-and-scene-plot.md`

## Changes
- Added `pioneerFollowUp` state to `apps/web/src/store/onboarding.ts` so onboarding can persist the confirmed pioneer follow-up context into the existing web onboarding store.
- Updated `apps/web/src/app/onboarding/page.tsx` to write pioneer follow-up state whenever onboarding review resolution confirms pioneer fallback, including unsigned review resolution and auth-backed `/onboarding/home-scene` responses.
- Updated `apps/web/src/app/plot/page.tsx` so the existing notification icon toggles a small pioneer follow-up panel when pioneer context is present.
- Kept the message constrained to the locked requirements:
  - temporary nearest-active routing
  - pioneer tracking for the selected Home Scene
  - ability to establish/uprise the user’s own city scene once enough local users join
- Added focused regression coverage in:
  - `apps/web/__tests__/onboarding-pioneer-follow-up.test.ts`
  - `apps/web/__tests__/plot-ux-regression-lock.test.ts`

## Verification
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter web test -- onboarding-pioneer-follow-up.test.ts plot-ux-regression-lock.test.ts`
- `pnpm --filter web typecheck`

## Result
- Passed.

## Residual risk
- The current web pioneer follow-up copy is driven by stored onboarding pioneer state plus the selected Home Scene tuple. Current API responses still do not expose the spec-described resolved nearest-active scene label, so the Plot message explains temporary nearest-active routing generically rather than naming a specific routed city scene.
