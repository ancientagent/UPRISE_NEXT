# MVP Figma Execution Pack R1

Purpose: execute mobile-first UX work in Figma with deterministic, lane-based output and no behavior drift.

## Source of Truth (Read First)
1. `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`
2. `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
3. `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
4. `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
5. `docs/solutions/MVP_FOUNDER_DECISION_REGISTER_R1.md`

## Figma Setup (Required)
- Use Figma MCP with OAuth-authenticated session.
- Confirm MCP connectivity before design tasks:
  - list files/projects
  - fetch one frame/node successfully
- If MCP auth fails, stop and fix auth first. Do not continue with speculative output.

## File Structure (Figma)
Create one file with these pages:
- `00_Tokens`
- `01_Mobile Shell`
- `02_Player States`
- `03_Profile Expanded`
- `04_Plot Tabs`
- `05_Onboarding`
- `06_Interaction Specs`

## Lane Plan

### Lane A: Tokens + Base Components
Deliver:
- color/text/spacing/radius tokens
- mobile viewport shell component
- tab bar component
- bottom nav component

Acceptance:
- token names are stable and reusable
- no behavior assumptions introduced

### Lane B: Player + Engagement Contracts
Deliver:
- RADIYO player state
- Collection player state
- mode/rotation control placement per locked decisions
- tier stack (national/state/city)

Acceptance:
- player remains outside plot ownership
- no extra CTA/actions added

### Lane C: Profile Expanded/Collapsed
Deliver:
- collapsed profile strip
- expanded profile panel
- collection tab layout contracts

Acceptance:
- expand/collapse modeled as panel-state transition, not route change
- player anchor behavior preserved in interaction notes

### Lane D: Onboarding + Home Scene Routing
Deliver:
- scene details screen
- review/routing screen for inactive home scene
- GPS decision prompt flow

Acceptance:
- mobile-only onboarding constraint called out
- nearest-active fallback described without adding new policy

### Lane E: QA Drift Check + Founder Walkthrough
Deliver:
- frame-by-frame checklist pass/fail
- open decision list with exact blockers
- founder walkthrough script (ordered)

Acceptance:
- each fail maps to exact source-of-truth file section
- no “creative fill” for missing canon answers

## Required Output per Lane
Each lane must return:
1. Figma page/frame list changed
2. pass/fail checklist against source docs
3. explicit drift list (if any)
4. handoff note path under `docs/handoff/`
5. changelog line in `docs/CHANGELOG.md`

## Non-Negotiables
- No platform trope imports.
- No unapproved placeholder CTAs.
- If canon is silent on a behavior decision: stop and ask founder.
- Do not reinterpret scope to “improve” UX outside locked behavior.
