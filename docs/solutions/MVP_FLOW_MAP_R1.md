# MVP Flow Map R1 (Spec-Linked, Web-First)

Status: R1 flow lock (docs-only)
Last Updated: 2026-02-28
Owner: Lane B (Web/Contract)

## Purpose
This document locks the current MVP web flow map to existing specs only. It does not add product semantics.

## Scope
User-visible flow chain:
1. Onboarding
2. The Plot
3. Registrar
4. Core Actions (Signals)

## Flow Map

| Flow | Spec Links | Current Implemented Status | Deferred Status | Blocking Dependencies | Canonical Source Links |
|---|---|---|---|---|---|
| Onboarding -> Home Scene Resolution | `docs/specs/users/onboarding-home-scene-resolution.md` (`USER-ONBOARDING`), `docs/specs/communities/scenes-uprises-sects.md` | Implemented endpoints and web flow: `POST /onboarding/home-scene`, `POST /onboarding/gps-verify`, `GET /communities/resolve-home`; onboarding web store/page captures Home Scene + GPS voting eligibility. | Parent-scene routing for free-text sect names; pioneer incentive tooling. | User must complete Home Scene resolution before deterministic Plot anchoring and Registrar scene-scoped submissions. | `docs/canon/Master Narrative Canon.md`, `docs/canon/Master Glossary Canon.md` |
| Enter The Plot (Scene Dashboard) | `docs/specs/communities/plot-and-scene-plot.md` (`COMM-PLOT`) | Plot shell and scene-scoped reads are implemented (`feed`, `events`, `promotions`, `statistics`, `scene-map` plus active-scene fallback and Home Scene resolve-home anchoring). | Advanced registrar lifecycle dashboard in Plot; Social tab message boards/listening rooms (V2). | Requires resolved Home Scene tuple and selected/active community anchor from onboarding context. | `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md`, `docs/canon/Master Narrative Canon.md` |
| Registrar Entry + Registrar Status Actions | `docs/specs/system/registrar.md` (`SYS-REGISTRAR`), `docs/specs/users/identity-roles-capabilities.md` | Implemented-now registrar read/write primitives include artist registration + materialize/invites/sync, promoter registration + read/audit, project/sect read surfaces, capability code verify/redeem, invite preview/register claim, and web registrar action-gated status panels. | Registrar-admin approval/issuance orchestration for promoter capability codes; revocation/admin-management workflows; advanced Plot registrar dashboard surfaces remain deferred. | Depends on Home Scene scoping, GPS verification rules for artist submit path, and submitter-owned entry authorization. | `docs/canon/Master Narrative Canon.md`, `docs/canon/Legacy Narrative plus Context .md` |
| Core Actions (Signals: ADD/BLAST/SUPPORT/FOLLOW) | `docs/specs/core/signals-and-universal-actions.md` (`CORE-SIGNALS`), `docs/specs/social/message-boards-groups-blast.md` | Implemented signal write/action contracts: `POST /signals`, `POST /signals/:id/add`, `POST /signals/:id/blast`, `POST /signals/:id/support`, `POST /follow`; idempotent action behavior and typed collection shelves. | Discourse-signal contracts and proof-of-support extensions remain future work; no algorithmic ranking semantics allowed. | Requires authenticated user context and signal/action contract integrity; downstream civic workflows remain registrar-governed. | `docs/canon/Master Narrative Canon.md`, `docs/canon/Master Glossary Canon.md` |

## End-to-End MVP Chain (R1 Lock)

1. Onboarding sets Home Scene and civic eligibility context.
2. Plot uses Home Scene/active-scene context to render deterministic scene surfaces.
3. Registrar handles civic registration actions and status tracking under scene + authorization guardrails.
4. Core actions operate as explicit non-ranked signal interactions.

## Founder Decision Required
- Exact R2 UX sequencing for how Plot should prioritize registrar status versus feed/events/promotions in first-load navigation is not explicitly ordered in current specs.
- Social tab exposure policy is now locked for MVP: hidden until endpoint + surface contract ship.

## Notes
- This map is spec-linked and execution-scoped for R1 only.
- No new behavior definitions are introduced here.
- Batch14 Lane E consistency pass confirms flow-map wording remains aligned with registrar implemented-now/deferred boundaries after batch14 QA/review slices.
