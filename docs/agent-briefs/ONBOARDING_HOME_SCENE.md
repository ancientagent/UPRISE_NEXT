# Onboarding Home Scene Agent Brief

Status: active
Last Updated: 2026-04-25

## Use When
Use this brief when the task is about:
- onboarding
- Home Scene resolution
- city/state/music-community tuple
- GPS verification
- voting eligibility
- pioneer fallback / nearest-active routing
- first-run flow
- onboarding copy
- Home Scene state in Plot or source tools

## Do Not Use For
- general Home/Plot UI unless onboarding or Home Scene state is being changed
- registrar lifecycle work beyond onboarding gates
- business monetization
- Artist Profile direct listening

## Loading Rule
Start with the normal repo entry rules, `CONTEXT_ROUTER.md`, then this brief.

Load registrar/governance context only if the task touches capability filings, voting gates, promoter capability, or civic procedures.

## Section Pointers
Runtime files:
- `apps/web/src/app/onboarding/page.tsx`
- `apps/web/src/store/onboarding.ts`
- `apps/web/src/lib/onboarding/review-resolution.ts`
- `apps/web/src/app/plot/page.tsx`
- `apps/api/src/onboarding/onboarding.controller.ts`
- `apps/api/src/communities/`

Specs / locks:
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/solutions/SURFACE_CONTRACT_HOME_R1.md`
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`

Tests / verification files:
- `apps/web/__tests__/onboarding-page-lock.test.ts`
- `apps/web/__tests__/onboarding-regression-lock.test.ts`
- `apps/web/__tests__/onboarding-pioneer-follow-up.test.ts`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts` when Plot/Home Scene behavior changes

## Current Truth
- Community identity is `city + state + music community`.
- Do not collapse community identity to city-only or genre-only.
- When a flow already knows current community context, inherit the music community instead of asking the user to redefine it.
- Onboarding asks for City, State, and approved parent Music Community.
- Music Community input is selection-only; no free-text genre/community creation in onboarding.
- Taste tags are not collected during onboarding.
- Home Scene selection is stored regardless of GPS verification.
- Setting a Home Scene auto-joins the resolved city-tier scene membership.
- GPS is requested to enable voting rights only.
- Users can participate without GPS but cannot vote when GPS is denied/unavailable.
- If the selected city-tier scene is inactive/unavailable, preserve pioneer intent and route to nearest active city scene for the selected parent community.
- Pioneer follow-up appears through the top-right notification icon in the profile strip after Home Scene context loads.

## Current Runtime Pointers
- `/onboarding` captures and persists Home Scene and GPS state.
- `/plot` resolves Home Scene context and surfaces pioneer follow-up through the notification icon.
- `GET /communities/resolve-home` resolves exact Home Scene tuple for Plot/community anchoring.
- `POST /onboarding/home-scene` is the server-authoritative Home Scene persistence path.
- `POST /onboarding/gps-verify` verifies voting eligibility.

## Companion Briefs
Load only if touched:
- `UI_CURRENT.md` when onboarding affects Home/Plot layout or first-run screen design.
- `ACTIONS_AND_SIGNALS.md` when GPS/Home Scene gates actions such as voting/upvote.
- `REGISTRAR_GOVERNANCE.md` when onboarding connects to registrar filings or capability questions.
- `ARTIST_PROFILE_SOURCE_DASHBOARD.md` when Home Scene state appears inside source-side tools.

## Design / Implementation Boundaries
- Do not require GPS for non-civic participation.
- Do not ask users to redefine a known music community context.
- Do not treat visitor listening context as a Home Scene change.
- Do not treat pioneer fallback as abandoning the user’s intended city.
- Do not add taste-tag onboarding unless explicitly reactivated.
- Do not widen first-run flow with speculative CTAs.

## Canon Anchors
Use selectively:
- `docs/canon/Master Narrative Canon.md` for Scene / Community / Uprise structure.
- `docs/canon/Master Glossary Canon.md` for terminology.
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md` when onboarding changes surface/capability lifecycle.

## Verification
Use the narrowest relevant checks:
- `pnpm --filter web test -- onboarding-page-lock.test.ts`
- `pnpm --filter web test -- onboarding-regression-lock.test.ts`
- `pnpm --filter web test -- onboarding-pioneer-follow-up.test.ts`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `git diff --check`

## Update Rule
Patch this brief whenever onboarding, Home Scene resolution, GPS/voting, pioneer fallback, or community identity truth changes.
