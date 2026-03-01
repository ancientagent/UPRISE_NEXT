# MVP Founder Decision Register (R1)

Status: Active
Purpose: Track only currently unresolved spec/canon ambiguities that block deterministic implementation choices.

Decision posture for all entries: Founder Decision Required.

## Register

| Decision ID | Exact Question | Why Blocked | Affected Specs/Files | Default Do-Not-Assume Posture |
|---|---|---|---|---|
| R1-DEC-001 | What exact City -> State propagation threshold policy should be enforced (minimum conditions, timing window, and trigger mechanics)? | Propagation behavior is referenced but numeric/policy lock is not finalized. | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/communities/scenes-uprises-sects.md` | Do not implement/enforce any City -> State auto-propagation thresholds beyond currently shipped behavior. |
| R1-DEC-002 | What exact State -> National propagation threshold policy should be enforced (minimum conditions, timing window, and trigger mechanics)? | National propagation lock is explicitly unresolved. | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/communities/scenes-uprises-sects.md` | Do not implement/enforce State -> National auto-propagation thresholds. |
| R1-DEC-003 | What is the canonical Main Rotation recurrence mapping model (discrete tier mapping vs weighted scheduler)? | Fair Play references recurrence behavior but mapping lock remains unresolved. | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/broadcast/radiyo-and-fair-play.md` | Keep existing additive engagement capture only; do not introduce new recurrence mapping semantics. |
| R1-DEC-004 | What is the exact propagation threshold formula for Fair Play graduation (listener minimums, rates, confidence terms)? | Formula is listed as unresolved and blocks deterministic scheduler transitions. | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/broadcast/radiyo-and-fair-play.md` | Do not invent formula constants/weights; keep current deferred state. |
| R1-DEC-005 | What numeric value should `GRADUATION_CAP_PER_RUN` use? | Cap is declared with unresolved value (`TBD`). | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/broadcast/radiyo-and-fair-play.md` | Do not set or hardcode a graduation cap value. |
| R1-DEC-006 | What Activity Points scoring table is canon-approved by action type? | Points model is planned; scoring matrix is unresolved. | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/engagement/activity-points-and-analytics.md` | Do not implement Activity Points scoring logic or implied point values. |
| R1-DEC-007 | What decay/seasonality policy applies to Activity Points and scene scores? | Decay policy is unresolved and affects long-term scoring semantics. | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/engagement/activity-points-and-analytics.md` | Do not apply retention/decay windows to activity metrics. |
| R1-DEC-008 | What report-count/velocity threshold triggers moderation auto-flag? | Moderation auto-flag behavior requires explicit threshold lock. | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/system/moderation-and-quality-control.md` | Do not add new auto-flag threshold rules beyond current implemented safeguards. |
| R1-DEC-009 | What appeal/dispute response timeline is required (SLA and escalation)? | Timeline is unresolved and blocks deterministic moderation workflow guarantees. | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/system/moderation-and-quality-control.md` | Do not claim SLA/timeline guarantees not canon-locked. |
| R1-DEC-010 | What final pricing should Discovery Pass use? | Monetization pricing lock is unresolved. | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/economy/revenue-and-pricing.md` | Do not set/display Discovery Pass final prices as decided values. |
| R1-DEC-011 | What final pricing should Play Pass use? | Monetization pricing lock is unresolved. | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/economy/revenue-and-pricing.md` | Do not set/display Play Pass final prices as decided values. |
| R1-DEC-012 | What are the hard mechanics for promotional slots while preserving Fair Play boundaries? | Promotional slot mechanics are unresolved and tied to fairness constraints. | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/economy/revenue-and-pricing.md`, `docs/specs/broadcast/radiyo-and-fair-play.md` | Do not implement promotional slot ordering/boost mechanics not explicitly locked. |
| R1-DEC-013 | What aggregation window policy should Scene Map/Statistics use (e.g., rolling 7-day/30-day/all-time and default)? | Aggregation window lock is unresolved and changes chart/stat semantics. | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/communities/scene-map-and-metrics.md` | Do not hardcode new aggregation windows beyond existing documented placeholders. |
| R1-DEC-014 | What geo aggregation granularity and privacy floor should gate map/stat bucket visibility? | Privacy floor and granularity lock are unresolved and materially affect exposure risk. | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/communities/scene-map-and-metrics.md` | Do not introduce new geo bucket display rules or minimum cohort sizes. |
| R1-DEC-015 | What Top 40 tie-break policy applies when rows have equal standing in a scope? | Ranking tie-break semantics are unresolved and can change visible ordering outcomes. | `docs/specs/DECISIONS_REQUIRED.md`, `docs/specs/communities/scene-map-and-metrics.md` | Do not invent tie-break ordering rules; retain current deferred policy. |

## Usage Rule

When implementation encounters any register item above, stop and request founder lock before adding behavior, constants, or user-facing claims.

## UX Decision Cards (R1)

Status: Founder review queue for mobile-first UX lock.  
Card format: Yes/No decision with recommended default and implementation impact.

| Card ID | Decision Question (Yes/No) | Recommended Default | If Yes | If No | Impacted Artifacts |
|---|---|---|---|---|---|
| UX-R1-001 | Should profile expansion be the primary pull-down interaction from the top header seam on mobile? | **Yes** | Keep pull-down seam as primary interaction, with tap fallback. | Use explicit open/close controls only; no gesture-first model. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/solutions/MVP_PLAYER_PROFILE_INTERACTION_R1.md` |
| UX-R1-002 | Should expanded profile replace Plot body space in-route (push-down model) instead of opening a separate route/sheet? | **Yes** | Preserve single-route state swap and snapshot restore semantics. | Add route/sheet transition rules and update flow map accordingly. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/solutions/MVP_FLOW_MAP_R1.md` |
| UX-R1-003 | Should player mode labels remain exactly `RADIYO` and `Collection` across surfaces? | **Yes** | Lock terminology and normalize copy everywhere. | Define alternative canonical labels before implementation continues. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/solutions/MVP_UX_ALIGNMENT_REPORT_R1.md` |
| UX-R1-004 | Should tier labels remain exactly `City`, `State`, `National` in the player context row? | **Yes** | Keep tier naming stable and update all references to match. | Define replacement tier naming and migration copy. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md` |
| UX-R1-005 | Should Search/Discovery entry be removed from Plot Home context and constrained to Discovery flow? | **Yes** | Keep Plot focused; route discovery actions to Discovery surfaces only. | Permit dual-entry pattern and specify conflict/priority behavior. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/solutions/MVP_UX_ALIGNMENT_REPORT_R1.md` |
| UX-R1-006 | Should non-paying listeners be limited from cross-city scene selection in Discovery? | **Yes** | Gate cross-scene controls for free tier; keep local/home scope defaults. | Allow broader scene switching and update monetization boundaries. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/specs/economy/revenue-and-pricing.md` |
| UX-R1-007 | Should Statistics own Top Songs + Scene Activity sections (not Home tab body)? | **Yes** | Keep these modules under Statistics to preserve Home screen real estate. | Reintroduce mixed-home composition and define ordering rules. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md` |
| UX-R1-008 | Should artist profile navigation be available from the active track/cover in player context? | **Yes** | Keep tap-through to artist profile from now-playing context. | Restrict navigation to dedicated profile/discovery surfaces only. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/specs/communities/plot-and-scene-plot.md` |
| UX-R1-009 | Should mobile interaction model remain source-of-truth with web as adaptation layer? | **Yes** | Continue mobile-first UX locking before web polish divergence. | Move to web-first design and redefine adaptation rules. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/solutions/MVP_HARD_ROADMAP_EXECUTION_PLAN.md` |
| UX-R1-010 | Should unresolved UX behavior cards block implementation slices that depend on them? | **Yes** | Treat unresolved cards as explicit blockers for affected slices. | Allow best-effort assumptions and track retroactive corrections. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/AGENT_STRATEGY_AND_HANDOFF.md` |
| UX-R1-011 | In expanded profile, should section composition order be fixed as `Profile Header -> Player Context -> Collection Preview -> Statistics Preview -> Actions`? | **Yes** | Lock deterministic vertical order and keep tests/docs aligned to this sequence. | Require founder-provided alternative canonical order before implementation/layout updates. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/solutions/MVP_UX_ALIGNMENT_REPORT_R1.md`, `docs/solutions/MVP_FLOW_MAP_R1.md` |
| UX-R1-012 | Should Collection preview always render before Statistics preview in expanded profile? | **Yes** | Preserve music-first context and keep stats as secondary context block. | Re-prioritize stats ahead of collection and update composition contract + copy. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/solutions/MVP_PLATFORM_COVERAGE_MATRIX_R1.md` |
| UX-R1-013 | Should Statistics preview limit to a compact summary (top 2-3 modules) with deep detail routed to Statistics surface? | **Yes** | Keep expanded profile lightweight; route full metrics to Statistics page. | Allow dense in-profile stats and define overflow/scroll priority behavior. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/solutions/MVP_QA_BASELINE_R1.md` |
| UX-R1-014 | In `RADIYO` mode, should `Play/Pause`, `Skip`, and `Signal` controls be mandatory while collection-management controls are hidden? | **Yes** | Keep mode-specific control set minimal and listening-first for `RADIYO`. | Allow mixed controls and define explicit precedence/conflict rules. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/solutions/MVP_UX_ALIGNMENT_REPORT_R1.md` |
| UX-R1-015 | In `Collection` mode, should save/remove/reorder controls be visible while broadcast-only controls are de-emphasized? | **Yes** | Preserve collection-management focus and reduce broadcast control noise. | Keep broadcast-parity controls visible and define icon/priority hierarchy. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/solutions/MVP_PLATFORM_COVERAGE_MATRIX_R1.md` |
| UX-R1-016 | Should the core transport control cluster remain in a fixed persistent position across both `RADIYO` and `Collection` modes? | **Yes** | Lock motor-memory consistency by keeping transport controls stable across mode switches. | Permit mode-dependent relocation and define transition affordances/animation rules. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/solutions/MVP_QA_BASELINE_R1.md` |
| UX-R1-017 | Should global Search entry live in Discovery scope only (not duplicated in Home/Profile expanded contexts)? | **Yes** | Keep Search routed through Discovery and prevent duplicate entry points in home/profile shells. | Permit multi-entry search and define precedence/state synchronization rules. | `docs/solutions/MVP_FLOW_MAP_R1.md`, `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md` |
| UX-R1-018 | Should Discovery placement prioritize `Nearby/Scene-first` content before cross-scene exploration modules? | **Yes** | Preserve home-scene/locality-first order with explicit escalation to broader scopes. | Allow equal-priority global exploration and define default sorting semantics. | `docs/specs/communities/discovery-scene-switching.md`, `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md` |
| UX-R1-019 | Should non-paying listeners be hard-limited from cross-city scene selection until entitlement unlock? | **Yes** | Keep cross-city selector locked for free tier with clear upgrade path copy. | Allow limited cross-city access and define quota/cooldown logic before rollout. | `docs/specs/economy/revenue-and-pricing.md`, `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/solutions/MVP_PLATFORM_COVERAGE_MATRIX_R1.md` |
| UX-R1-020 | Should deferred tabs/surfaces use explicit `Deferred for MVP` language instead of ambiguous placeholders? | **Yes** | Use consistent deferred-state wording that does not imply active capability. | Permit varied placeholder labels and accept copy drift risk. | `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`, `docs/solutions/MVP_QA_BASELINE_R1.md` |
| UX-R1-021 | Should deferred-action guardrail copy explicitly avoid directive CTAs (`Join`, `Upgrade`, `Coming Soon`) unless spec-authorized? | **Yes** | Keep guardrail copy informational-only and spec-safe. | Permit promotional placeholder CTAs and require separate founder/spec approval workflow. | `docs/FEATURE_DRIFT_GUARDRAILS.md`, `docs/RUNBOOK.md`, `docs/solutions/MVP_QA_BASELINE_R1.md` |
| UX-R1-022 | Should deferred surfaces include a canonical fallback sentence template for consistency audits? | **Yes** | Adopt one standard template per surface type for predictable QA checks. | Allow freeform deferred copy and rely on manual review each release. | `docs/solutions/MVP_QA_BASELINE_R1.md`, `docs/solutions/MVP_UX_ALIGNMENT_REPORT_R1.md` |

## Blocked Slice Mapping (UX Decision Queue R1)

| Slice ID | Slice Title | Decision Cards to Resolve | Block Condition |
|---|---|---|---|
| `SLICE-UXDEC-525A` | Founder decision register scaffold | `UX-R1-001` through `UX-R1-010` | Register structure and baseline card set not finalized. |
| `SLICE-UXDEC-526A` | Profile expanded composition decisions | `UX-R1-011`, `UX-R1-012`, `UX-R1-013` | Expanded profile order and collection/statistics priority unresolved. |
| `SLICE-UXDEC-527A` | Player control set decisions | `UX-R1-014`, `UX-R1-015`, `UX-R1-016` | Mode-specific and persistent player control contracts unresolved. |
| `SLICE-UXDEC-528A` | Discovery/search placement decisions | `UX-R1-017`, `UX-R1-018`, `UX-R1-019` | Discovery/search placement and free-tier cross-city limits unresolved. |
| `SLICE-UXDEC-529A` | Deferred surface language decisions | `UX-R1-020`, `UX-R1-021`, `UX-R1-022` | Deferred-language and guardrail-copy conventions unresolved. |
| `SLICE-UXDEC-530A` | Decision register closeout + QA checklist | All cards above | Founder walkthrough/sign-off and downstream slice unblock state not finalized. |

## Founder Walkthrough Checklist (R1)

- [ ] Review cards `UX-R1-001` to `UX-R1-022` and confirm each `Yes/No` lock.
- [ ] Mark any non-default choices explicitly and list affected artifacts to update.
- [ ] Confirm deferred-surface language policy (`UX-R1-020` to `UX-R1-022`) for all MVP-facing copy.
- [ ] Confirm entitlement/search decisions (`UX-R1-017` to `UX-R1-019`) for release messaging and gating behavior.
- [ ] Confirm player control contract decisions (`UX-R1-014` to `UX-R1-016`) for interaction parity QA.
- [ ] Publish sign-off note in dated handoff and unblock dependent UX implementation slices.
