# Registrar Governance Agent Brief

Status: active
Last Updated: 2026-06-25

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
- Source origin is owned by `docs/specs/system/registrar.md#source-origin-contract`: it is the submitted natural `city + state + music community` verified through Registrar/GPS authority, not the temporary proxy scene.
- Current runtime persists source origin on Registrar Artist/Band filings and materialized Artist/Band records separately from the active/proxy operating scene.
- Artist/Band source registration can count toward Home Scene activation only after the registering user is GPS-verified for the submitted source-origin location.
- City-tier Home Scene activation is Registrar/source-driven: at least `45` minutes of approved playable music from at least `5` distinct registered source accounts, with no single source occupying more than `15` minutes of one Uprise rotation.
- Listener onboarding counts, missing-music-community requests, and passive listener demand do not activate a community.
- Promoter capability is additive to the base user identity, not a separate account tree.
- Promoter capability unlocks source-facing event workflows rather than creating listener event-authoring.
- Capability-code verify/redeem remains user-driven and authenticated.
- `Back` is Registrar-only procedural behavior; do not expose it as a public social action.
- Support is a one-tap source-bound Feed-card action with a finite pool; it
  remains outside Registrar and has no current API, ledger, or UI
  implementation. The draft owner contract is
  `docs/specs/engagement/support-and-participation.md`, including the
  `Participation`/`Trusted Roles` qualification direction; its governance
  gates stay open in `docs/specs/DECISIONS_REQUIRED.md` section 9 and grant no
  authority until locked.
- Sect readiness tracking can be built before it is user-visible.
- A Home Scene listener requests a Sect; eligible registered Artist/Band
  sources support it by registering as Sect members through Registrar. Each
  supporting member artist's current eligible Home Scene Release Deck duration
  counts automatically toward readiness. Songs have no separate Sect
  relationship, and previous songs are irrelevant after leaving the current
  eligible deck.
- Passive genre/style metadata does not count toward sect readiness or sect realization by itself.
- Sect readiness and Sect Uprise broadcast authority are owned by `docs/specs/communities/scenes-uprises-sects.md#sect-readiness-and-sect-uprise-boundary`; Registrar-side listener request and Artist/Band membership authority are owned by `docs/specs/system/registrar.md#sect-request-and-artistband-membership-authority`.
- Sect request/membership/progress surfaces remain unimplemented and must follow
  the owner contract rather than inventing per-song Sect state or administrator
  approval.
- Artist/Band Sect membership belongs in Registrar rather than loose self-assigned profile tags.
- Official Sects are pre-Uprise Registrar-recognized subcommunities: visible/inspectable for affiliation and updates once enabled, but not independent broadcast authorities.
- Registrar should eventually show active official sects in the current Home Scene, sects that have already uprisen, and where those uprisen sects exist.
- Sect Uprises should mirror Home Scene behavior wherever possible while staying scoped inside the parent Home Scene/music community.
- Sect membership grants sect voting authority; listening access alone does not.

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
- Do not let proxy-scene routing overwrite source origin.
- Do not use listener demand or onboarding metadata as a community activation trigger.
- Do not create self-issued capability codes.
- Do not grant promoter capability automatically from registration submission alone.
- Do not let voting/governance authority depend on paid status, rankings, or popularity.
- Do not widen cause/project/sect-motion runtime without explicit current locks.
- Do not auto-create Sects from passive genre/style tags.
- Do not make loose profile tags the Artist/Band Sect membership mechanism.
- Do not treat Official Sect status as broadcast authority.
- Do not turn Sect Uprises into standalone city/music-community replacements isolated from the parent Home Scene.
- Do not expose sect progress or sect creation controls publicly before the visibility/unlock rule is explicitly activated.

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
