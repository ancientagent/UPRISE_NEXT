# MVP Figma Execution Pack R2 (Strict)

Purpose: eliminate UX drift during Figma production by enforcing strict constraints, explicit acceptance gates, and stop conditions.

## Required Inputs (No Substitutions)
1. `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`
2. `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
3. `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
4. `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
5. `docs/solutions/MVP_FOUNDER_DECISION_REGISTER_R1.md`
6. `docs/solutions/MVP_FIGMA_EXECUTION_PACK_R1.md`

## MUST
- Validate Figma MCP session before design execution.
- Keep player ownership outside Plot content ownership.
- Keep profile expand/collapse as panel-state transition (not route navigation).
- Keep tier stack semantics intact (`National`, `State`, `City`).
- Emit pass/fail for every required screen/page against source docs.
- Stop and request founder input when canon/docs are silent.

## MUST NOT
- Must not add new CTAs, actions, or policy claims not present in source docs.
- Must not add platform-trope interactions as defaults.
- Must not merge unresolved high-severity drift items into a “done” report.
- Must not silently change terminology (`RADIYO`, `Collection`, `Plot`, tier labels).

## Execution Order (Single-Operator Default)
1. `00_Tokens`
2. `01_Mobile Shell`
3. `02_Player States`
4. `03_Profile Expanded`
5. `04_Plot Tabs`
6. `05_Onboarding`
7. `06_Interaction Specs`
8. QA pass + founder walkthrough checklist

## Acceptance Gates

### Gate 1: Structure Lock
- All required pages exist with correct names.
- Component variants for player/profile states are present.

### Gate 2: Behavior Lock
- No contradiction with required inputs.
- Player mode vs tier vs rotation controls remain non-overloaded.

### Gate 3: Drift Lock
- Every discrepancy is logged with severity + file reference.
- High-severity items are either fixed or explicitly founder-approved.

### Gate 4: Handoff Lock
- Output includes:
  - changed frame list
  - pass/fail matrix
  - drift register
  - founder decision blockers
  - dated handoff note path

## Failure Conditions (Stop Immediately)
- MCP cannot authenticate/fetch frame.
- Required source file is missing or contradictory.
- A requested change conflicts with canon and has no founder override.

## Output Template (Required)
1. `Frames Changed`
2. `Acceptance Matrix (Pass/Fail)`
3. `Drift Register (Severity + Reference)`
4. `Blocked Decisions (Founder Needed)`
5. `Next Action (single deterministic step)`
