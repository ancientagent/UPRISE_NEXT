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
