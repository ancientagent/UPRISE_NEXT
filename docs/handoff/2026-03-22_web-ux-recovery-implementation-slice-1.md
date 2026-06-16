# Web UX Recovery Implementation Slice 1 (2026-03-22)

## Scope
First code pass against `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md`.

## Implemented
- `apps/web/src/app/onboarding/page.tsx`
  - removed the desktop-only onboarding dead-end
  - kept the existing web onboarding flow available across desktop/mobile
  - corrected the review-step `Edit Home Scene` button so it returns to the scene-details step
- `apps/web/src/app/plot/page.tsx`
  - removed the redirect-only `/plot -> /onboarding` gate
  - replaced the null state with an unresolved Home Scene guidance surface
- `apps/web/src/app/users/[id]/page.tsx`
  - fixed terminal-state handling when `userId` or auth token is missing
  - added a bounded timeout so profile loads resolve into a visible error instead of hanging indefinitely
- `apps/web/src/app/community/[id]/page.tsx`
  - added a bounded timeout around the community/profile fetch path so the route settles into an error state instead of loading forever
- `apps/web/src/components/plot/SceneContextBadge.tsx`
  - changed unset scene context rendering from false `Local` to neutral `Context unset`
- `apps/web/src/app/discover/page.tsx`
  - removed the client-side hard auth gate that prevented result loading without a token
  - removed stale copy asserting artist/band lookup lockouts from the old narrower Discover spec
  - kept tune/home actions auth-gated while allowing scene results to load when the API permits public reads
  - updated the community CTA copy to `Visit {name}` for the current result surface
- `apps/web/src/lib/discovery/client.ts`
  - made scene-list reads accept optional auth tokens so the current route can attempt public discovery reads

## Regression Coverage Added
- `apps/web/__tests__/discovery-client.test.ts`
  - locks token-optional scene reads
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
  - locks unresolved `/plot` guidance instead of redirect-only dead-end behavior
- `apps/web/__tests__/scene-context-badge.test.ts`
  - source-locks neutral context-unset badge behavior
- `apps/web/jest.setup.js`
  - added `TextEncoder`/`TextDecoder` shims for the current Jest environment

## Validation
- `pnpm --filter web typecheck`
- `pnpm --filter web test -- --runInBand plot-ux-regression-lock.test.ts discovery-client.test.ts scene-context-badge.test.ts registrar-contract-inventory.test.ts`
- `pnpm run infra-policy-check`
- local route head checks:
  - `curl -I http://127.0.0.1:3000/onboarding`
  - `curl -I http://127.0.0.1:3000/plot`

## Remaining Work
- live-route verification of `/users/[id]`, `/community/[id]`, and `/discover` with the code-execution harness
- fuller Discover result-state reconciliation against `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- any remaining registrar-path verification after the updated web onboarding flow is exercised end-to-end
