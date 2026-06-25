# 2026-06-24 — Documentation Authority Inconsistency List

Date: 2026-06-24
Repo: `/home/baris/UPRISE_NEXT`
Branch observed: `docs/abacus-fusion-swarm-strategy`
Source reports:

- `docs/handoff/2026-06-24_documentation-authority-audit-codex.md`
- `docs/handoff/2026-06-24_documentation-authority-audit-upriseauditor.md`

Status: consolidated inconsistency list only. No implementation changes were made in this doc.

## How To Read This

This is not a replacement for canon/specs. It is a triage list of places where agents can still get confused.

Winning truth below means the current best interpretation from the two audits, active docs, runtime/tests, and recent founder corrections. Items marked `Founder decision` need product language or timing clarified before implementation. Items marked `Cleanup` can be handled as normal documentation/runtime-comment cleanup.

Context strategy note: the goal is not simply to make agents read less. The safer direction is layered context:

- Tier 0: non-negotiables and repo rules.
- Tier 1: short platform orientation.
- Tier 2: lane brief and exact touched docs/files.
- Tier 3: heavy authority pack for audits, architecture planning, and broad strategy work.

This preserves context-window discipline without forcing high-capacity agents to operate from an underpowered mental model.

## P0 / Highest-Risk Inconsistencies

### 1. Default Agent Reading Strategy Conflicts With Lane Router

Classification: documentation strategy conflict

Winning truth: use a layered context model: `AGENTS.md` rules, a short platform start doc, `CONTEXT_ROUTER.md`, then the lane brief and exact files/specs for the task. Heavy curated context is appropriate for audits and architecture work.

Conflict:

- `AGENTS.md` requires a broad always-read set before task work.
- `docs/agent-briefs/CONTEXT_ROUTER.md` pushes lean lane loading.
- Both are useful, but together they create uncertainty about whether an agent should load everything or stay narrow.

Risk: agents either over-read stale docs or under-read the platform model, then wing implementation.

Recommended fix: create a single documented reading model in `AGENTS.md`, `docs/README.md`, `docs/agent-briefs/CONTEXT_ROUTER.md`, and the documentation framework spec. Add a `PLATFORM_START_HERE` style orientation doc.

Founder decision: no, unless the founder wants a heavier default context for all high-capacity sessions.

Source evidence:

- Codex report: `docs/handoff/2026-06-24_documentation-authority-audit-codex.md`, Cross-Lane Inconsistency Table.
- Hermes report: `docs/handoff/2026-06-24_documentation-authority-audit-upriseauditor.md`, R1 and Documentation Strategy Recommendation.

### 2. No Single Platform Orientation Doc

Classification: documentation architecture gap

Winning truth: UPRISE needs one short orientation that explains the platform before any lane work: community identity, Home/Plot/player/profile, source entities, current MVP surfaces, deferred domains, and common false assumptions.

Conflict:

- AGENTS and router docs explain process.
- Canon explains doctrine.
- Specs explain systems.
- Briefs explain lanes.
- No one doc currently says “here is UPRISE in five minutes and here is what not to assume.”

Risk: agents can pass local lint/tests while misunderstanding the platform.

Recommended fix: add `docs/PLATFORM_START_HERE.md` or `docs/agent-briefs/PLATFORM_START_HERE.md`, then link it from `AGENTS.md`, `docs/README.md`, and `CONTEXT_ROUTER.md`.

Founder decision: no.

Source evidence:

- Hermes report R1 and Issue 1.
- Codex report “Documentation Strategy Recommendation” and “Immediate Fix List”.

### 3. Unknown / Unavailable Home Scene Creation Conflict

Classification: active spec drift

Winning truth: onboarding does not create inactive `Community` rows for unavailable submitted Home Scenes. It preserves pioneer intent, resolves to the nearest active city-tier community for the same parent music community, and uses that as the active listening/voting anchor.

Conflict:

- Newer onboarding docs/runtime: preserve submitted city/state/music community and fallback to nearest active same-parent community.
- Older `scenes-uprises-sects` language says unknown city/community can create inactive pioneer `Community` / Scene records.

Risk: an agent may reintroduce inactive Community creation or build around the wrong persistence model.

Recommended fix: patch `docs/specs/communities/scenes-uprises-sects.md` and related edge-case docs to explicitly say the inactive-row behavior is superseded by onboarding fallback behavior.

Founder decision: no. The current fallback model is already locked by recent implementation/review.

Source evidence:

- Codex report rows: Community architecture and Unknown/unavailable Home Scene.
- Hermes report cross-lane row: Pioneer fallback.

### 4. Community Architecture / One-Off Community Risk

Classification: conceptual drift risk

Winning truth: every community is the same architecture. A community instance is the intersection of `city + state + music community`. Launch rows are seed instances, not special designs. Community differences come from data, membership, events, signals, archive/history, and later Prime-model structures.

Conflict:

- Current onboarding/seed docs say invariant architecture.
- Some older docs and handoffs imply inactive pioneer rows, recruitment tools, activity-point bonuses, or special launch-community behavior.

Risk: agents implement one-off behavior for Austin, Punk, a launch tuple, or a pioneer case instead of scalable system logic.

Recommended fix: reinforce invariant architecture in the platform start doc, seed README, onboarding brief, and docs-lint/system-scale checks.

Founder decision: no.

Source evidence:

- Codex report: Community Architecture truth and Cross-Lane table.
- Hermes report: Top truth T1/T2 and cross-lane Home Scene identity row.

### 5. `Uprise` Concept Has No Runtime Model

Classification: canon/runtime model gap

Winning truth: current runtime persistence uses `Community` plus `Signal` rows. `Uprise` is a canon/platform concept, not a Prisma model today. A dedicated Uprise persistence model is deferred.

Conflict:

- Canon treats Uprise as a dual-state object: broadcast station plus signal.
- Runtime has no `Uprise` model.
- Agent briefs do not clearly warn agents that no `Uprise` table exists.

Risk: agents may add ad-hoc persistence, search for missing models, or create a model before the long-term data design is approved.

Recommended fix: add a brief/spec note: “Uprise is semantic/canon at current MVP runtime; persistence is `Community` + `Signal`; dedicated Uprise model is future/deferred.”

Founder decision: yes for long-term model timing, no for documenting current truth.

Source evidence:

- Hermes report R4 and cross-lane row: Uprise persistence.

## P1 / High-Risk Inconsistencies

### 6. Plot Tab Language Still Drifts Across Canon / Legacy

Classification: stale canon/legacy language

Winning truth: current MVP Plot tabs are exactly `Feed`, `Events`, and `Archive`. There is no current user-facing `Statistics` tab and no current MVP `Promotions` tab. Social is V2/deferred.

Conflict:

- Current UI/spec/brief/runtime/tests use `Feed`, `Events`, `Archive`.
- Master/legacy canon and old reports still mention `Promotions`, `Statistics`, and `Social` as Plot surfaces.
- Some override notes exist but are easy to miss in long files.

Risk: agents reactivate stale tabs or build design mocks around retired surface names.

Recommended fix: reconcile Plot surface language inline in the high-traffic canon sections and keep docs-lint guards for old tab sets.

Founder decision: no.

Source evidence:

- Codex report: Plot / Events / Archive truth and cross-lane table.
- Hermes report R5 and cross-lane row: Plot tab labels.

### 7. Action Grammar Canon Drift: ADD / SUPPORT / Blast-On-Wheel

Classification: stale canon/action language

Winning truth: current action grammar is:

- RADIYO wheel: `Report`, `Skip`, `Play It Loud`, `Collect`, `Upvote`.
- SPACE/personal player: `Back`, `Pause`, `Blast`, `Recommend`, `Next`.
- Artist Profile has no engagement wheel and no Blast.
- `Support` is a derived state, not a button.
- `Collect` is the product language for music/artifacts; `Add` may remain only where event/calendar context explicitly needs it.

Conflict:

- Master Narrative action list still names older actions such as `ADD`, `FOLLOW`, `BLAST`, `SUPPORT`.
- Legacy Narrative still includes “Action Wheel: Upvote, Add, Blast, Skip, Report.”
- Runtime/internal compatibility may still use older names.

Risk: agents put Blast back into RADIYO, add a Support button, or use Add where Collect is intended.

Recommended fix: reconcile Master Narrative action list and extend lint/override notes for legacy action language.

Founder decision: no for current action grammar; yes only if long-term action names change.

Source evidence:

- Hermes report conflicts 3 and 4, stale-term list, and cross-lane RADIYO/action rows.

### 8. Print Shop Placement Is Mixed Across Events, Promotions, And Source Dashboard

Classification: cross-lane IA/current-vs-future mismatch

Winning truth: current MVP Print Shop event-write lane is source-facing/source-dashboard tooling. Listener-facing Plot Events remains read-only. Broader Print Shop artifacts, promo runs, business behavior, and commercial surfaces are deferred.

Conflict:

- Some docs place Print Shop under Events.
- Some docs place it under Promotions/business behavior.
- Current source-dashboard docs place current operational event-write tooling in source-facing context.

Risk: agents build listener-facing event creation inside Plot or prematurely implement promotions/business Print Shop behavior.

Recommended fix: add explicit current-MVP placement notes in Print Shop, Events, Source Dashboard, and Business Monetization docs.

Founder decision: maybe for long-term IA wording, no for current MVP boundary.

Source evidence:

- Codex report: Print Shop placement row and founder decisions.
- Hermes report cross-lane rows: Print Shop as source-facing and Print Shop event locality.

### 9. Plot Events / Calendar Boundary Is Ambiguous

Classification: current/future surface ambiguity

Winning truth: current Plot Events rows are read-only. Calendar is a real concept but not an inline Plot mutation control unless a future scoped spec explicitly adds it.

Conflict:

- Plot/community docs mention users adding events directly to calendar.
- Current Events spec/brief/tests say no inline calendar mutation in Plot Events.

Risk: agents add “Add to Calendar” or other event mutation actions directly into Plot Events without approval.

Recommended fix: clarify current read-only Plot Events list versus future/approved calendar action surface.

Founder decision: yes if calendar becomes active; no for preserving current read-only boundary.

Source evidence:

- Codex report: Calendar/Event behavior row and immediate fix item 6.

### 10. `project` vs `cause` Terminology Debt

Classification: product terminology/runtime debt

Winning truth: `cause` is the forward product term. Runtime still persists `type = "project_registration"` and registrar docs/code still expose `project` terminology in places.

Conflict:

- Founder/source lock says cause is the product term going forward.
- Runtime and registrar specs still use `project_registration` / project language.

Risk: agents create new user-facing copy or models with the old `project` language.

Recommended fix: either do a bounded migration/rename slice, or annotate registrar specs/runtime comments that `project_registration` is legacy/internal and `cause` is the product term.

Founder decision: yes for whether to migrate now or annotate until later.

Source evidence:

- Hermes report R3 and cross-lane project-vs-cause row.

### 11. Taste Tag Onboarding Docs / API Mismatch

Classification: runtime/docs mismatch

Winning truth: taste tags are not collected in user-facing onboarding.

Conflict:

- Onboarding docs/briefs say taste tags are not collected.
- API still accepts optional `tasteTag` and can persist tag rows if supplied.

Risk: an agent or API client reactivates taste-tag onboarding or assumes hidden taste tags are current UX.

Recommended fix: decide whether the API should reject, ignore, or document `tasteTag` as legacy-compatible debt. Add tests around the chosen behavior.

Founder decision: yes, if compatibility should be kept.

Source evidence:

- Codex report: Taste tags onboarding row and founder decisions.
- Hermes report R5 notes legacy “Sects as taste tags” language.

### 12. Handoff Index / External Tools Index Is Stale

Classification: documentation routing stale index

Winning truth: handoffs are context, not authority, but the current high-value handoff list should help agents find the newest relevant dated notes.

Conflict:

- `docs/handoff/README.md` misses newer 2026-06-24 handoffs and audit outputs.
- `EXTERNAL_TOOLS.md` can point external agents toward stale carry-forward lists.

Risk: agents load old handoffs instead of the latest current-context docs.

Recommended fix: refresh the handoff index or replace static “high-value” lists with “search latest by topic” guidance plus a short current pinned list.

Founder decision: no.

Source evidence:

- Codex report: Handoff index freshness row and fix item 10.

### 13. Hermes Auditor Brief Contains Stale Branch/Task Defaults

Classification: agent brief stale default

Winning truth: broad UPRISE auditor jobs should receive branch/task from the current prompt. The agent profile should not bake in an old branch or old launch task.

Conflict:

- `UPRISE_HERMES_AUDITOR_AGENT.md` names an old branch/task default.

Risk: Hermes or another auditor starts on the wrong branch/scope and wastes a run.

Recommended fix: remove branch-specific defaults and make branch/scope explicit prompt inputs.

Founder decision: no.

Source evidence:

- Codex report: Hermes auditor branch defaults row and fix item 11.

## P2 / Medium And Low-Risk Inconsistencies

### 14. Promotions Endpoint Comment Calls It A Current Plot Promotions Tab

Classification: stale runtime comment

Winning truth: promotions infrastructure may be retained/deferred, but there is no current MVP Plot Promotions tab.

Conflict: API comment says “Plot Promotions tab.”

Risk: low, but comments can mislead implementation agents.

Recommended fix: patch comment to “retained/deferred promotions feed/supporting endpoint” or equivalent.

Founder decision: no.

Source evidence:

- Codex report: Promotions endpoint wording row.

### 15. Registrar UI Copy Implies Print Shop Event Creation Is Not Published

Classification: runtime copy stale

Winning truth: current source-facing Print Shop event-write lane exists, while broader Print Shop artifacts/promotions/business behavior remains scoped/deferred.

Conflict: registrar UI copy implies event creation is pending or only available once published.

Risk: medium because user-facing copy can misstate current capability.

Recommended fix: patch copy to distinguish current event-write lane from deferred Print Shop artifact/promo scope.

Founder decision: no.

Source evidence:

- Codex report: Registrar UI Print Shop copy row.

### 16. Master Narrative “Power Flows Downward Only” Confuses Hierarchy

Classification: canon wording conflict

Winning truth: hierarchy and authority flow need clearer wording around Scene, Uprise, Community, Plot, and RADIYO. Current canon treats Uprise as a bridge between structure and content.

Conflict: “Power flows downward only” appears to contradict the hierarchy stated nearby.

Risk: agents misread authority and build wrong mental models.

Recommended fix: rewrite/remove the sentence and point to the glossary dual-state framing.

Founder decision: probably no if this is just clarity; yes if hierarchy semantics change.

Source evidence:

- Hermes report R2, conflict 1, and issue 4.

### 17. Legacy Pioneer Framing Mentions Bonuses / Recruitment Tooling

Classification: stale legacy language

Winning truth: current pioneer fallback preserves intent, routes to a known active scene, and shows notification/eligibility behavior. It does not imply launch-time activity-point bonuses or recruitment tools.

Conflict: legacy narrative still describes early pioneer bonuses/recruitment framing.

Risk: agents implement gamification/recruitment features too early.

Recommended fix: extend top-of-file legacy override note to say pioneer bonuses/recruitment tooling are historical/not current MVP.

Founder decision: no.

Source evidence:

- Hermes report conflict 5 and cross-lane Pioneer fallback row.

### 18. “No Featured / Staff Picks” Can Be Misread Against User-Driven Rock

Classification: canon wording ambiguity

Winning truth: no editorial/staff-picked promotion. User-driven actions such as Rock/Back/Collect-style support are not editorial picks.

Conflict: identity/philosophy canon can be read as forbidding any display of user-driven “Rock”/support state.

Risk: low-medium; agents may remove valid user-driven social proof.

Recommended fix: clarify “no featured/staff picks” means no editorial curation or platform-bestowed spotlight, not no user-driven status display.

Founder decision: no unless product wants different public display rules.

Source evidence:

- Hermes report conflict 6.

### 19. S.E.E.D Acronym / Feed Naming Is Not Consistently Explained

Classification: terminology clarity gap

Winning truth: Feed is the current user-facing Plot tab. S.E.E.D may remain a system/source-feed term where defined.

Conflict: docs use Feed, S.E.E.D Feed, source feed, and scene feed without a short consistent definition.

Risk: agents overbuild feed types or use inconsistent UI copy.

Recommended fix: define S.E.E.D once in platform start / action-source docs and state current user-facing tab label.

Founder decision: no.

Source evidence:

- Hermes report lane 1 stale terms.

### 20. Deprecated Genre / Observer Terms Lack Enforcement

Classification: stale terminology enforcement gap

Winning truth: use `Music Community`, not `Genre Selection`; use `Visitor`, not `Observer`.

Conflict: glossary flags deprecations, but docs-lint does not enforce these terms in active docs.

Risk: agents reintroduce older onboarding/civic language.

Recommended fix: add docs-lint patterns for active docs, excluding legacy files.

Founder decision: no.

Source evidence:

- Hermes report cross-lane rows: Genre Selection copy and Observer term.

### 21. Promotional Slot / Release Deck “3 + 4th” Wording Can Be Misread

Classification: spec wording ambiguity

Winning truth: Release Deck has three music slots plus a deferred paid ad-attachment concept; the fourth slot is not an alternate music slot.

Conflict: revenue/source docs can read as “3 or 4” music slots if isolated from the business boundary.

Risk: agents model the paid slot as another music upload slot.

Recommended fix: add a short note to Release Deck/source docs: three music slots; fourth is paid ad attachment when activated, not extra song capacity.

Founder decision: no unless the commercial slot model changes.

Source evidence:

- Hermes report cross-lane Promotional slot row.

### 22. Statistics / Scene Map Component Names Can Mislead Agents

Classification: retained/deferred implementation naming risk

Winning truth: Archive is current user-facing descriptive history/stat lane. Interactive `StatisticsPanel` / `SceneMap` style explorer is not the current MVP Plot body.

Conflict: retained component/spec names still include `StatisticsPanel` / Scene Map language.

Risk: agents reactivate an interactive Statistics tab or design from the wrong retained component.

Recommended fix: keep brief notes and tests explicit that runtime component names may be retained, but user-facing current tab/body is Archive.

Founder decision: no.

Source evidence:

- Hermes report cross-lane Stats/Scene Map as Plot tab row.
- Codex report Plot/Event/Archive truth.

### 23. Business / Billing Doctrine Can Be Mistaken For Current Runtime

Classification: current-vs-future monetization boundary

Winning truth: revenue doctrine exists, but current MVP business runtime, billing, subscriptions, offers/coupons, paid promotion management, and premium analytics runtime are deferred.

Conflict: revenue canon/specs describe the fuller business model.

Risk: agents build billing/subscriptions/promotions too early.

Recommended fix: keep `BUSINESS_MONETIZATION_BOUNDARY` prominent and add lint/guardrails against unapproved `Subscribe`, `Upgrade`, billing, or paid CTA work in current MVP surfaces.

Founder decision: no for deferral; yes when activating business runtime.

Source evidence:

- Hermes report cross-lane Business/billing runtime and Discovery Pass rows.
- Codex report Business / Media / Monetization truth.

### 24. Prime Model Is Referenced But Not Scoped Enough

Classification: future-system reference gap

Winning truth: Prime model is future/post-launch. It may eventually generate sects/channels/subcommunities, but it is not a launch architecture variant.

Conflict: Prime model is referenced in launch/community docs without a full active spec.

Risk: agents scaffold Prime prematurely or treat future generated structures as launch requirements.

Recommended fix: create a stub `docs/specs/future/prime-model.md` that says deferred and lists non-goals.

Founder decision: yes for future scope, no for deferral note.

Source evidence:

- Hermes report cross-lane Prime model row.

### 25. Specs/Specifications Legacy Index References Non-Existent IDs

Classification: stale documentation index

Winning truth: active module-organized specs live under `docs/specs/`. `docs/Specifications/` is legacy/transition material unless explicitly restored.

Conflict: `docs/Specifications/README.md` references old canonical IDs that do not exist in that folder.

Risk: agents chase missing files or assume old spec IDs still drive current work.

Recommended fix: rewrite the README to say the legacy IDs are retired, or restore actual content-bearing legacy files in a clearly historical location.

Founder decision: no.

Source evidence:

- Hermes report Issue 10.

### 26. Active Old Phase / Execution Docs Still Look Current

Classification: stale execution docs

Winning truth: older 2026-02 phase/execution plans should be historical unless explicitly tied to current active work.

Conflict: some older execution docs still say active or look like current direction.

Risk: agents follow old stage order instead of current launch/doc strategy.

Recommended fix: mark superseded/historical and point to the current phase index / platform start doc.

Founder decision: no.

Source evidence:

- Codex report: Active old phase docs row and follow-up cleanup list.

### 27. Brief Metadata Is Stale In Some Active Briefs

Classification: low-risk metadata stale state

Winning truth: `Last Updated` and status metadata should match material changes and current authority.

Conflict: some briefs were materially revised by handoff/work but still show older update metadata.

Risk: agents distrust or mis-rank current briefs.

Recommended fix: refresh metadata during the documentation strategy cleanup slice.

Founder decision: no.

Source evidence:

- Codex report: Brief metadata freshness row.

## Founder Decisions Still Needed

These are the actual decisions that should not be silently guessed during cleanup:

1. Heavy default context vs layered mode.
   - Recommended: layered model with heavy mode for architecture/audit/planning.

2. Missing music-community request threshold.
   - Current founder direction: several submissions from different people in different cities.
   - Missing: exact threshold number and review trigger.

3. API `tasteTag` compatibility.
   - Remove, ignore, or preserve/document as legacy-compatible debt.

4. Calendar surface timing.
   - Current Plot Events is read-only.
   - Need explicit scope if adding calendar mutation/export later.

5. Long-term Print Shop IA.
   - Current MVP source-facing event-write lane is clear.
   - Long-term relationship among Events, Promotions, source dashboard, artifacts, and business surfaces needs crisp wording when activated.

6. Long-term Uprise persistence.
   - Current runtime uses `Community` + `Signal`.
   - Dedicated Uprise model timing remains future/product architecture.

7. Project-to-cause migration timing.
   - Cause is forward product term; runtime still has `project_registration`.

8. Prime model scope and timing.
   - Current docs should mark it deferred; founder/product should define later.

## Recommended Cleanup Order

1. Add platform orientation and layered reading strategy.
2. Patch active/current-state contradictions first: pioneer fallback, Plot tab/action wording, Events/calendar boundary, Print Shop current placement.
3. Add lint/guardrail patterns for stale active-doc language.
4. Refresh handoff indexes and stale agent profile defaults.
5. Annotate legacy/canon long files rather than bulk-rewriting them.
6. Defer actual product decisions until the founder confirms threshold/timing/model questions.

## What Not To Do

- Do not bulk-overwrite canon from exports.
- Do not implement a dedicated `Uprise` model just because canon names Uprise.
- Do not create one-off community architecture for any city or music community.
- Do not reactivate Plot `Statistics` or `Promotions` tabs.
- Do not build billing, Discovery Pass, paid boosts, or business dashboard from revenue doctrine alone.
- Do not add calendar mutation UI to Plot Events without explicit scope.
- Do not treat missing music-community request as automatic scene creation.

## Validation / State

This file was written as a consolidation artifact only. It did not edit the source audit reports or runtime/spec files.
