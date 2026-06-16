# Registrar Governance Agent Brief

Status: active
Last Updated: 2026-04-25

## Use When
Use this brief when the task is about:
- Registrar
- artist/band registration
- promoter registration / capability
- capability codes
- civic filings
- backing / prerequisite actions
- Home Scene-bound governance
- source-facing registrar bridges
- voting/governance gates

## Do Not Use For
- general onboarding unless registrar/capability filing is touched
- source dashboard layout unless registrar bridge/context is visible
- public Artist Profile actions unless registrar/source ownership is involved
- business monetization unless capability/business rules are explicitly in scope

## Loading Rule
Start with the normal repo entry rules, `CONTEXT_ROUTER.md`, then this brief.

Registrar is procedural/civic infrastructure. Do not load it into ordinary UI or source work unless the task touches formalization, capability, backing, voting, or registration state.

## Section Pointers
Runtime files:
- `apps/web/src/app/registrar/page.tsx`
- `apps/api/src/registrar/registrar.controller.ts`
- `apps/api/src/registrar/registrar.service.ts`
- `apps/api/src/registrar/dto/registrar.dto.ts`
- `apps/web/src/lib/registrar/client.ts`

Specs / locks:
- `docs/specs/system/registrar.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`

Tests / verification files:
- registrar tests in API/web packages when touched
- `apps/web/__tests__/registrar-source-context-lock.test.ts`
- onboarding tests when Home Scene/GPS gates are touched

## Current Truth
- Registrar belongs to the listener/base identity side.
- Registrar is Home Scene civic/formalization infrastructure.
- Source-facing routes may link into `/registrar` as transitional bridges, but that does not make Registrar a source-side tool.
- Registrar filings remain Home Scene-bound.
- Visitor listening context does not change registrar scope.
- Artist/Band registration is a registrar-mediated formalization path.
- Promoter capability is additive to the base user identity, not a separate account tree.
- Promoter capability unlocks source-facing event workflows rather than creating listener event-authoring.
- Capability-code verify/redeem remains user-driven and authenticated.
- `Back` is Registrar-only procedural behavior; do not expose it as a public social action.
- Support/backing state is not a direct public button in the intended action model.

## Current Runtime Pointers
- `/registrar` hosts Artist/Band registration, Promoter Registration, and Promoter Capability Code panels.
- Registrar APIs include artist entries, promoter entries, capability-code verify/redeem, and related status/audit reads.
- Source Dashboard and source pages may link users into Registrar while preserving source context visibility.
- Registrar source context is informational only and does not change filing scope.

## Companion Briefs
Load only if touched:
- `ONBOARDING_HOME_SCENE.md` when Home Scene/GPS/voting gates are involved.
- `ARTIST_PROFILE_SOURCE_DASHBOARD.md` when source dashboard or source page routes link into Registrar.
- `ACTIONS_AND_SIGNALS.md` when distinguishing Registrar-only `Back` / backing from public engagement actions.
- `BUSINESS_MONETIZATION.md` when business capability or promoter/business monetization is in scope.
- `UI_CURRENT.md` when designing visible Registrar screens.

## Design / Implementation Boundaries
- Do not turn Registrar into a generic social action surface.
- Do not expose `Back` as a normal feed/profile action.
- Do not make source context override Home Scene filing scope.
- Do not create self-issued capability codes.
- Do not grant promoter capability automatically from registration submission alone.
- Do not let voting/governance authority depend on paid status, rankings, or popularity.
- Do not widen cause/project/sect-motion runtime without explicit current locks.

## Canon Anchors
Use selectively:
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md` for capability/lifecycle boundaries.
- `docs/canon/Master Narrative Canon.md` for Scene / Community / Uprise structure.
- `docs/canon/Master Glossary Canon.md` for Registrar and capability terminology.

## Verification
Use the narrowest relevant checks:
- registrar web/API tests for touched surfaces
- `pnpm --filter web test -- registrar-source-context-lock.test.ts`
- onboarding tests if GPS/Home Scene gates are touched
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `git diff --check`

Use broader `pnpm run verify` before PR/closeout when feasible.

## Update Rule
Patch this brief whenever Registrar actor model, capability flow, Home Scene filing scope, promoter capability, or governance/backing truth changes.
