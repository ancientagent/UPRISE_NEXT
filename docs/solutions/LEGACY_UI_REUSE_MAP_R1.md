# Legacy UI Reuse Map (R1)

Status: Founder review artifact  
Last Updated: 2026-02-28  
Purpose: Compare legacy `uprise_mob` UX architecture against current canon/spec so we can reuse structure safely without importing wrong behavior.

## Source Inputs
- Legacy reference: `/mnt/d/uprise_mob/src/components`, `/mnt/d/uprise_mob/src/screens`
- Canon/spec anchors:
  - `docs/specs/users/onboarding-home-scene-resolution.md`
  - `docs/specs/communities/plot-and-scene-plot.md`
  - `docs/specs/system/registrar.md`
  - `docs/specs/core/signals-and-universal-actions.md`
  - `docs/solutions/MVP_FLOW_MAP_R1.md`

## Decision Labels
- `KEEP`: structure/flow is canon-compatible as-is (or near-as-is)
- `ADAPT`: architecture useful, but copy/behavior/contracts must change
- `DROP`: conflicts with canon/spec or no longer useful for current MVP

## A) Screen Architecture Reuse

| Legacy Screen Area | Decision | Why | Canon/Spec Guard |
|---|---|---|---|
| `screens/Onboarding/*` | ADAPT | Multi-step structure is good; semantics must be Home Scene + GPS voting gate | `USER-ONBOARDING` |
| `screens/Home/*` | KEEP | Main shell/tab architecture aligns with Plot multi-surface UX | `COMM-PLOT` |
| `screens/Feed/*` | ADAPT | Feed container pattern good; must be deterministic scene action feed (no personalization) | `COMM-PLOT`, `CORE-SIGNALS` |
| `screens/Events/*` | ADAPT | Surface split is correct; data contracts + empty/error states must match current API | `COMM-PLOT` |
| `screens/Promos/*` | ADAPT | Separate promotions surface is correct; avoid governance/ranking implications | `COMM-PLOT` |
| `screens/Statistics/*` | ADAPT | Dedicated stats/map surface is canon-aligned; metrics semantics must remain descriptive only | `COMM-PLOT` |
| `screens/Discovery/*` | ADAPT | Keep route/surface concept; behavior must be rebuilt from current discovery specs | `docs/specs/discovery/*` |
| `screens/Signup/*`, `screens/Login/*` | ADAPT | Auth flows likely reusable structurally; language and provider assumptions may be outdated | current auth/user specs |
| `screens/BandDetails/*` | ADAPT | Drill-down architecture may help; entity semantics likely changed and need remap | registrar + current entity specs |
| `screens/RadioPreferences/*`, `screens/radioScreen/*` | ADAPT | Broadcast UX patterns may help, but must be rebuilt to current Fair Play/canon constraints | broadcast spec |
| `screens/ActionButtonsModel/*` | DROP | Legacy action model naming likely non-canon for current universal actions | `CORE-SIGNALS` |
| `screens/SampleTest/*`, debug-only screens | DROP | Not product UX surfaces | n/a |

## B) Shared Component Reuse

| Legacy Component | Decision | Notes |
|---|---|---|
| `URContainer`, `URHeaderContainer` | KEEP | Good structural wrappers; recreate as shadcn layout primitives + design tokens |
| `URTextfield`, `TypeaheadInput` | ADAPT | Keep input architecture; migrate to shadcn form field primitives and updated validation/copy |
| `RadioButton`, `URCheckBox` | ADAPT | Keep interaction role; replace visuals and state logic with current component system |
| `Loader` | KEEP | Loading-state pattern reusable; update motion/accessibility standards |
| `TitleWithMultiSelect` | ADAPT | Potentially useful for selection UX; must match onboarding/community semantics |
| `URLineChart`, `URPieChat` | ADAPT | Chart containers useful; metric meaning and labels must match current stats spec |
| `Applebtn`, `Googlebtn` | DROP (unless re-approved) | Provider CTA assumptions may be outdated; only keep if current auth requirements explicitly require |
| `SliderEntry` | ADAPT | Optional for onboarding/tutorial UX; not required for core MVP |
| `SvgImage` | KEEP | Utility-level helper pattern is fine |

## C) Canon Mismatch Hotspots (High Risk)

1. Any legacy copy implying recommendation, ranking, or personalized feed order in Plot.
2. Any legacy CTA implying unavailable/deferred registrar admin actions.
3. Any legacy discovery/social behavior not explicitly authorized in current specs.
4. Any legacy auth/provider presentation not confirmed in current product scope.
5. Any metric wording that turns descriptive stats into governance/ranking claims.

## D) Practical Migration Strategy

1. Reuse layout architecture first (shell, tabs, list/detail, state panels).
2. Replace visual primitives with current web system (shadcn + project tokens).
3. Re-bind data to current API contracts only.
4. Re-write copy with canon-safe language.
5. Validate each migrated slice against spec and decision register before expanding.

## E) Founder Review Checklist (edit live)

- [ ] Confirm which legacy screen groups are approved as architectural templates.
- [ ] Confirm dropped groups/components that must not be carried forward.
- [ ] Confirm auth-provider UI policy (keep/drop).
- [ ] Confirm discovery/social legacy structures allowed for MVP phase.
- [ ] Confirm final KEEP/ADAPT/DROP decisions before UX slice implementation.

## F) Next UX Slice Candidates (post-approval)

1. Onboarding structure migration (`ADAPT`) with canon-correct fields/copy/states.
2. Plot shell + tab architecture migration (`KEEP/ADAPT`) with deterministic feed semantics.
3. Registrar status/action panel architecture migration (`ADAPT`) preserving action-gated boundaries.
