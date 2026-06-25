# 2026-06-24 - Documentation Authority Master Review Queue

Date: 2026-06-24
Repo: `/home/baris/UPRISE_NEXT`
Branch observed: `docs/abacus-fusion-swarm-strategy`
Purpose: one master item-by-item queue for founder/Codex review.

Source documents:

- `docs/handoff/2026-06-24_documentation-authority-audit-codex.md`
- `docs/handoff/2026-06-24_documentation-authority-audit-upriseauditor.md`
- `docs/handoff/2026-06-24_documentation-authority-inconsistencies.md`

Status: planning/review artifact. No runtime or spec files were changed by this document.

## Review Legend

Review state values:

- `open` - needs founder/Codex review.
- `accept` - accept the proposed winning truth and make the cleanup later.
- `revise` - founder changes the winning truth or proposed action.
- `defer` - not current stage; keep noted but do not work now.
- `close` - no change needed.

Fix type values:

- `docs-strategy` - changes how agents load/read docs.
- `docs-cleanup` - patch stale docs, comments, indexes, or metadata.
- `runtime-cleanup` - patch stale runtime copy/comments without product behavior change.
- `product-decision` - founder/product decision required before patching.
- `future-scope` - explicitly defer and mark as future.

## Current Winning Truths To Preserve

1. Community identity is always `city + state + music community`.
2. Community architecture is invariant across every city/music-community instance.
3. Launch communities are seed data, not special architecture.
4. Home contains Plot; Plot is not a standalone destination.
5. Current Plot tabs are exactly `Feed`, `Events`, `Archive`.
6. Listener profile, Artist Profile, Source Dashboard, Registrar, and business surfaces are separate concepts.
7. Source Dashboard is the MVP monorepo stand-in for future separate source/admin tooling.
8. GPS gates voting rights, not ordinary participation.
9. Missing music-community requests are intake/review only; they do not create live communities.
10. Business, billing, paid promotion management, premium analytics runtime, media upload/transcode, and Prime model are deferred unless explicitly activated.

## P0 - Review First

| ID | Item | Winning truth / proposed decision | Fix type | Founder decision? | Review state |
| --- | --- | --- | --- | --- | --- |
| M-01 | Agent reading strategy conflict | Accepted: use layered context. Focused implementation loads orientation/router/lane/touched files; audits/architecture/deployment may use the Heavy Authority Pack. | docs-strategy | no | accept |
| M-02 | Missing platform orientation doc | Accepted: platform orientation lives at `docs/PLATFORM_START_HERE.md` so it is repo-level, not agent-brief-only. | docs-strategy | no | accept |
| M-03 | Unknown Home Scene creates inactive Community rows | Accepted: onboarding preserves pioneer intent and routes to nearest active same-parent city-tier community; it does not create inactive `Community` rows. | docs-cleanup | no | accept |
| M-04 | One-off community architecture risk | Accepted: all Home Scene/community instances use invariant architecture; preserved pioneer intent can become active only when the joining-artist/music threshold is met; listener demand alone is not enough. | docs-cleanup | no | accept |
| M-05 | Uprise has no Prisma model | Document current runtime truth: `Uprise` is semantic/canon now; persistence is `Community` plus `Signal`; dedicated model is future. | docs-cleanup | yes for long-term model | open |

### M-01 - Agent Reading Strategy Conflict

Problem: `AGENTS.md` requires broad always-read docs while `CONTEXT_ROUTER.md` pushes lean lane loading.

Founder review decision: accepted layered context. Do not force every task to read every authority doc, but do not starve high-capacity agents of the platform model during audits, architecture, deployment, or strategy work.

Patch later:

- `AGENTS.md`
- `docs/README.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/specs/system/documentation-framework.md`

Source evidence:

- Codex audit: Cross-Lane Inconsistency Table, documentation strategy.
- Hermes audit: R1, Documentation Strategy Recommendation, Issue 1.

### M-02 - Missing Platform Orientation Doc

Problem: no single document says what UPRISE is in five minutes, what assumptions are wrong, and what to read next.

Founder review decision: accepted `docs/PLATFORM_START_HERE.md` as the location. This is repo-level platform orientation, not agent-brief-only context.

Minimum content:

- one-paragraph platform model
- five current truths
- five common wrong assumptions
- phase/lane map
- current MVP vs deferred domains
- links to context router and lane briefs

Source evidence:

- Codex audit: Immediate Fix List item 1.
- Hermes audit: R1 and Issue 1.

### M-03 - Unknown Home Scene / Inactive Community Creation

Problem: older community docs still imply missing or inactive scenes create inactive pioneer `Community` rows.

Founder review decision: accepted current fallback model. No inactive `Community` creation during onboarding.

Patch later:

- `docs/specs/communities/scenes-uprises-sects.md`
- possibly `docs/specs/system/edge-cases-and-compliance.md`
- cross-link to `docs/specs/users/onboarding-home-scene-resolution.md`

Source evidence:

- Codex audit: Community architecture and Unknown/unavailable Home Scene rows.
- Hermes audit: Pioneer fallback row.

### M-04 - One-Off Community Architecture Risk

Problem: agents may misunderstand launch city/community tuples as requiring custom architecture per scene.

Founder review decision: accepted. Reinforce invariant architecture everywhere agents start.

Follow-up clarification: preserved pioneer intent is an activation candidate. It can become a real active city-tier community only when the joining-artist/music activation threshold for that city/music-community is met. Listener demand alone does not activate a community because without participating artists/music there is no music community. This uses the same architecture; it is not a custom community branch.

Activation transition clarification: when the new Home Scene activates, matching pioneer users are notified and become members of the newly active Home Scene. Users with verified submitted-location GPS receive voting rights there; users without GPS remain non-voting until verification. Existing artist/source songs finish their current rotation lifecycle in the prior active/fallback scene, while new songs submitted after activation attach to the newly active Home Scene.

Patch later:

- platform start doc
- `docs/specs/seed/README.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- possible docs-lint/system-scale warning

Source evidence:

- Codex audit: Community Architecture truth.
- Hermes audit: T1/T2 and Home Scene identity row.

### M-05 - Uprise Concept Has No Runtime Model

Problem: canon says Uprise is a dual-state object, but runtime has no `Uprise` Prisma model.

Proposed review decision: document current runtime explicitly; do not create a model until a future data design slice.

Patch later:

- platform start doc
- relevant community/spec brief
- maybe `docs/agent-briefs/CONTEXT_ROUTER.md` note for data-model work

Source evidence:

- Hermes audit: R4 and Uprise persistence row.

## P1 - Review Next

| ID | Item | Winning truth / proposed decision | Fix type | Founder decision? | Review state |
| --- | --- | --- | --- | --- | --- |
| M-06 | Plot tab drift | Current tabs are `Feed`, `Events`, `Archive`. Promotions, Statistics, Social are not current MVP tabs. | docs-cleanup | no | open |
| M-07 | Action grammar drift | RADIYO and SPACE actions stay split; no Blast on RADIYO; no Support button. | docs-cleanup | no | open |
| M-08 | Print Shop placement | Current MVP event-write lane is source-facing/source-dashboard. Broader Print Shop/promo/business is deferred. | docs-cleanup | maybe long-term IA | open |
| M-09 | Plot Events/calendar boundary | Plot Events rows are read-only. Calendar mutation/export needs explicit future scope. | docs-cleanup | yes if calendar is activated | open |
| M-10 | Project vs cause terminology | `cause` is forward product term; runtime `project_registration` remains legacy/internal debt. | product-decision | yes | open |
| M-11 | Taste tags in onboarding | User-facing onboarding does not collect taste tags; API compatibility must be removed, ignored, or documented. | product-decision | yes | open |
| M-12 | Handoff/external tools index stale | Refresh index or replace with latest-by-topic search guidance. | docs-cleanup | no | open |
| M-13 | Hermes auditor stale branch defaults | Remove old branch/task defaults from auditor profile docs. | docs-cleanup | no | open |

### M-06 - Plot Tab Drift

Problem: legacy/canon docs still mention `Promotions`, `Statistics`, and `Social` as Plot surfaces.

Proposed review decision: accept current MVP tab lock: `Feed`, `Events`, `Archive`.

Patch later:

- inline notes in high-traffic canon sections
- extend docs-lint patterns for old tab language
- avoid bulk canon rewrite

Source evidence:

- Codex audit: Plot / Events / Archive truth.
- Hermes audit: R5 and Plot tab labels row.

### M-07 - Action Grammar Drift

Problem: older canon/action language still includes `ADD`, `SUPPORT`, and Blast on the action wheel.

Proposed review decision: accept current action split.

Current action split:

- RADIYO: `Report`, `Skip`, `Play It Loud`, `Collect`, `Upvote`
- SPACE: `Back`, `Pause`, `Blast`, `Recommend`, `Next`
- Artist Profile: no engagement wheel and no Blast

Patch later:

- `docs/canon/Master Narrative Canon.md` action list
- legacy override notes
- docs-lint for stale active-doc action patterns

Source evidence:

- Hermes audit: conflicts 3 and 4; RADIYO wheel actions row.

### M-08 - Print Shop Placement

Problem: docs mix Print Shop under Events, Promotions/business, and source-dashboard.

Proposed review decision: current MVP Print Shop event-write lane is source-facing. Listener Plot Events stays read-only.

Patch later:

- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/agent-briefs/BUSINESS_MONETIZATION.md`

Source evidence:

- Codex audit: Print Shop placement row.
- Hermes audit: Print Shop source-facing and locality rows.

### M-09 - Plot Events / Calendar Boundary

Problem: some docs imply direct calendar actions, while current Plot Events is read-only.

Proposed review decision: current Plot Events rows stay read-only until a calendar slice is explicitly scoped.

Patch later:

- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/agent-briefs/EVENTS_ARCHIVE.md`

Source evidence:

- Codex audit: Calendar/Event behavior row and fix item 6.

### M-10 - Project vs Cause Terminology

Problem: runtime and registrar docs use `project_registration`, while founder lock says `cause` is the product term.

Proposed review decision needed: either migrate/rename in a bounded slice or annotate as internal legacy debt.

Interim patch later:

- add spec notes to registrar and identity docs
- add runtime comment where `project_registration` remains
- avoid new user-facing `project` copy

Source evidence:

- Hermes audit: R3 and project-vs-cause row.

### M-11 - Taste Tags In Onboarding

Problem: docs say no taste tags in onboarding, but API still accepts optional `tasteTag`.

Proposed review decision needed: remove, ignore, or preserve/document compatibility.

Patch later:

- `apps/api/src/onboarding/dto/onboarding.dto.ts`
- `apps/api/src/onboarding/onboarding.service.ts`
- onboarding API tests
- docs if compatibility remains

Source evidence:

- Codex audit: Taste tags onboarding row.
- Hermes audit: legacy Sects-as-taste-tags note.

### M-12 - Handoff / External Tools Index Staleness

Problem: newer 2026-06-24 handoffs are not discoverable through the static handoff index.

Proposed review decision: refresh the index or make it search/latest-topic based.

Patch later:

- `docs/handoff/README.md`
- `docs/agent-briefs/EXTERNAL_TOOLS.md` if needed

Source evidence:

- Codex audit: Handoff index freshness row.

### M-13 - Hermes Auditor Branch Defaults

Problem: auditor profile docs bake in stale branch/task assumptions.

Proposed review decision: branch and task must be prompt-supplied.

Patch later:

- `docs/agent-briefs/UPRISE_HERMES_AUDITOR_AGENT.md`

Source evidence:

- Codex audit: Hermes auditor branch defaults row.

## P2 - Cleanup Queue

| ID | Item | Winning truth / proposed decision | Fix type | Founder decision? | Review state |
| --- | --- | --- | --- | --- | --- |
| M-14 | Promotions endpoint comment | Retained/deferred endpoint, not a current Plot Promotions tab. | runtime-cleanup | no | open |
| M-15 | Registrar Print Shop copy | Event-write lane exists; broader Print Shop/promo/artifact scope remains deferred. | runtime-cleanup | no | open |
| M-16 | Power-flow canon sentence | Clarify hierarchy vs authority flow. | docs-cleanup | maybe wording only | open |
| M-17 | Legacy Pioneer bonuses/recruitment | Historical only; not current MVP. | docs-cleanup | no | open |
| M-18 | No featured/staff picks vs Rock | No editorial picks; user-driven state display can still exist if scoped. | docs-cleanup | maybe | open |
| M-19 | S.E.E.D naming | Define once; current tab label is Feed. | docs-cleanup | no | open |
| M-20 | Deprecated Genre/Observer terms | Use Music Community and Visitor; lint active docs. | docs-cleanup | no | open |
| M-21 | Release Deck 3 + 4th wording | Three music slots; fourth paid ad attachment is deferred and not an extra song slot. | docs-cleanup | no | open |
| M-22 | Statistics/Scene Map names | Retained/deferred names must not imply current Statistics tab. | docs-cleanup | no | open |
| M-23 | Business/billing doctrine | Revenue doctrine is not current billing/runtime scope. | docs-cleanup | activation later | open |
| M-24 | Prime model references | Future/post-launch; do not scaffold now. | future-scope | yes later | open |
| M-25 | Legacy Specifications index | Retire/fix references to non-existent legacy spec IDs. | docs-cleanup | no | open |
| M-26 | Old phase/execution docs look active | Mark superseded/historical and point to current phase index. | docs-cleanup | no | open |
| M-27 | Brief metadata stale | Refresh Last Updated/status metadata during cleanup. | docs-cleanup | no | open |

## Proposed Walkthrough Order With Founder

Use this order in review, not necessarily implementation order:

1. M-01 and M-02: decide the agent reading/onboarding system.
2. M-03 and M-04: lock community architecture/fallback model.
3. M-05, M-10, M-24: decide which conceptual models are current vs future.
4. M-06, M-07, M-09, M-22: clean UX/action/Event/Archive drift.
5. M-08, M-15, M-21, M-23: clean source/business boundary drift.
6. M-11: decide tasteTag compatibility.
7. M-12, M-13, M-25, M-26, M-27: clean routing/index/metadata.
8. M-14, M-16, M-17, M-18, M-19, M-20: lower-risk wording/lint cleanup.

## Proposed Implementation Slices After Review

### Slice A - Orientation And Reading Strategy

Items: M-01, M-02, M-12, M-13, M-26, M-27

Goal: make agent entry safe before changing product docs.

Likely files:

- `AGENTS.md`
- `docs/README.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/PLATFORM_START_HERE.md` or `docs/PLATFORM_START_HERE.md`
- `docs/handoff/README.md`
- `docs/agent-briefs/UPRISE_HERMES_AUDITOR_AGENT.md`
- `docs/CHANGELOG.md`

### Slice B - Community And Onboarding Authority

Items: M-03, M-04, M-11, M-20, M-24

Goal: prevent one-off architecture, inactive-row regression, taste-tag reactivation, and stale onboarding terms.

Likely files:

- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/seed/README.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `apps/api/src/onboarding/*` only if tasteTag behavior is changed
- docs-lint scripts if term rules are added

### Slice C - Plot / Player / Action / Archive Drift

Items: M-06, M-07, M-09, M-14, M-16, M-17, M-18, M-19, M-22

Goal: reconcile high-risk stale UX/action words without changing current runtime behavior.

Likely files:

- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/agent-briefs/EVENTS_ARCHIVE.md`
- `apps/api/src/communities/communities.controller.ts`
- docs-lint scripts if stale patterns are added

### Slice D - Source / Print Shop / Business Boundary

Items: M-08, M-10, M-15, M-21, M-23

Goal: make current source-facing tools clear while deferring business/payment/promo runtime.

Likely files:

- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/system/registrar.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/agent-briefs/BUSINESS_MONETIZATION.md`
- `apps/web/src/app/registrar/page.tsx`
- `apps/api/src/registrar/*` comments only unless migration is approved

### Slice E - Legacy Index And Future Scope Hygiene

Items: M-05, M-24, M-25

Goal: stop agents from chasing non-existent or future-only specs/models.

Likely files:

- `docs/Specifications/README.md`
- `docs/specs/future/prime-model.md` or future index
- community/model brief notes

## Open Founder Decisions

1. Should the platform orientation live at `docs/PLATFORM_START_HERE.md` or `docs/agent-briefs/PLATFORM_START_HERE.md`?
2. Should high-capacity Codex/Hermes sessions load heavy curated platform context by default, or only for audit/architecture prompts?
3. What exact threshold triggers review for missing music-community requests?
4. Should API `tasteTag` be removed, ignored, or preserved as legacy-compatible debt?
5. Should calendar mutation/export be activated now, or stay deferred/read-only in Plot Events?
6. Should `project_registration` be migrated to `cause` now, or annotated as internal legacy debt until later?
7. Is a dedicated `Uprise` model a post-MVP architecture decision, or should it be designed sooner?
8. Should Prime model get only a deferred stub now, or a full design packet?

## Do-Not-Do List While Reviewing

- Do not bulk-overwrite canon.
- Do not implement product behavior while reviewing docs.
- Do not create one-off community architecture.
- Do not add a dedicated `Uprise` model just because canon names Uprise.
- Do not reactivate Statistics or Promotions tabs.
- Do not add calendar mutation UI to Plot Events without explicit scope.
- Do not build billing, Discovery Pass, paid boosts, or business dashboard from revenue doctrine alone.
- Do not treat missing music-community requests as automatic scene creation.

## Validation

This master was created from the two audit reports and the consolidated inconsistency list. It is intended to be the single checklist we review item by item.
