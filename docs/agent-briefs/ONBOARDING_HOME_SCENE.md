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
- Current MVP launch selection is the implementation list in `docs/specs/seed/music-communities.json` and `apps/web/src/data/music-communities.ts`.
- Current MVP launch matrix is `6` launch cities x `8` launch music communities = `48` city-tier Home Scene tuples; see `docs/specs/seed/launch-community-city-matrix.json`.
- Current MVP launch geofence readiness uses one city-center point plus a `50000` meter voting radius per launch city; all `8` music-community scenes in the same city inherit that city geofence for exact active Home Scene voting verification.
- Launch geofences are a voting-readiness locality gate only. Do not use them as tier logic, state/national scope logic, discovery radius logic, or city-specific runtime behavior.
- Home Scene architecture is invariant. City and music-community identity change the scene data, membership, content, activity, and later generated Prime-model structures; they must not change screens, menus, tabs, actions, player behavior, or routing.
- Sects, generated channels, and sub-communities happen later through the Prime model rather than as launch seed architecture variants.
- Missing-music-community requests are intake only. They do not create selectable onboarding options or live scenes until repeated submissions from distinct people in distinct cities make the request eligible for review.
- Current intake endpoint is `POST /onboarding/music-community-requests`.
- Missing-music-community intake stores distinct requester/city review signals but does not define a final approval threshold in code.
- Taste tags are not collected during onboarding.
- Home Scene selection is stored regardless of GPS verification.
- Setting a Home Scene auto-joins the resolved active city-tier scene membership.
- GPS is requested to enable voting rights only.
- Users can participate without GPS but cannot vote when GPS is denied/unavailable.
- If the selected city-tier scene is inactive/unavailable, preserve pioneer intent and route to nearest active city scene for the selected parent community.
- For inactive/unavailable Home Scenes, the submitted city/state/music-community remains the user's pioneer intent while `tunedSceneId` stores the resolved active listening/voting anchor.
- For inactive/unavailable Home Scenes, GPS verification checks the submitted city/state locality, while `tunedSceneId` stores the resolved active listening/voting anchor.
- Voting for a pioneer fallback user is allowed in the resolved nearest active community after submitted-location GPS verification; voting is not allowed in arbitrary visitor scenes.
- Pioneer follow-up appears through the top-right notification icon in the profile strip after Home Scene context loads.

## Current Runtime Pointers

- `/onboarding` captures and persists Home Scene and GPS state.
- `/plot` resolves Home Scene context and surfaces pioneer follow-up through the notification icon.
- `GET /communities/resolve-home` resolves exact Home Scene tuple for Plot/community anchoring.
- `POST /onboarding/home-scene` is the server-authoritative Home Scene persistence path.
- `POST /onboarding/gps-verify` verifies voting eligibility against the exact active Home Scene geofence, or against submitted city/state locality when the submitted Home Scene is inactive/unavailable.
- `POST /onboarding/music-community-requests` stores missing music-community intake without creating a `Community` or selector option.

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
- Do not turn a missing-music-community request into an immediate community creation path.
- Do not add missing-music-community requests to `MUSIC_COMMUNITIES` or `docs/specs/seed/music-communities.json` until explicitly approved.
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
