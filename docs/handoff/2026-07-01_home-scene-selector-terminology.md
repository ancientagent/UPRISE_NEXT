# Home Scene Selector Terminology

Status: completed
Date: 2026-07-01
Branch: `fix/home-scene-switcher-terminology`
Agent: Codex

## Summary

Founder clarification supersedes the old Home Scene switching term. The active model is:

- `Home Scene selector` for the read model / API / code contract.
- `Home Scene swiper` for the upper-app gesture presentation when the user swipes horizontally.
- Left/right arrows and horizontal swipe are what change a user from one active/resolved Home Scene context to another.
- User-facing UI should not display a control label like `Home Scene Selector`; it should show the active scene context and arrows/swipe affordance.

## Files Updated

- `docs/PLATFORM_START_HERE.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/system/documentation-framework.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/founder-sessions/2026-07-01_plot-home-scene-visual-skin.md`
- `apps/api/src/users/users.controller.ts`
- `apps/api/src/users/users.service.ts`
- `apps/api/scripts/smoke-authenticated-onboarding-persistence.mjs`
- `apps/api/test/users.profile.collection.test.ts`
- `apps/api/test/onboarding-location-smoke-safety.test.ts`
- `apps/web/src/lib/users/client.ts`
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/users-client.test.ts`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`
- `docs/handoff/README.md`

## Runtime Contract

- Current endpoint is `GET /users/me/home-scene-selector`.
- Current web client wrapper is `getHomeSceneSelector(token)`.
- Current `/plot` data slot is `data-slot="home-scene-selector"`.
- The visible `/plot` control has no explicit `Home Scene Selector` label.
- Preference chips use `Shown in Home` instead of naming the selector.
- Saved Away Scenes remain profile/collection context and do not appear in the selector/swiper.

## Historical Handoff Boundary

Older dated handoff bodies may still contain superseded terminology because they describe past implementation work. Treat those as historical evidence only. Current active docs, runtime code, tests, and this handoff supersede that terminology.

Do not copy old terminology from historical handoffs into new active specs, briefs, tests, prompts, or UI copy.

## Validation

To run after patch:

```bash
pnpm --filter api test -- users.profile.collection.test.ts onboarding-location-smoke-safety.test.ts --runInBand
pnpm --filter web test -- users-client.test.ts plot-ux-regression-lock.test.ts --runInBand
pnpm --filter web typecheck
pnpm --filter api typecheck
pnpm run docs:lint
git diff --check
```
