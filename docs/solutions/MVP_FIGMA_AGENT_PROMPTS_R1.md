# MVP Figma Agent Prompts R1

Purpose: copy/paste prompts for parallel agents executing the Figma-first UX plan with strict anti-drift behavior.

## Global Rules (paste into every lane)

```text
Read AGENTS.md required docs first.

You are executing docs/design-only UX work for UPRISE_NEXT with no feature drift.

Required source-of-truth:
1) docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md
2) docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md
3) docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md
4) docs/solutions/MVP_UX_DRIFT_GUARD_R1.md
5) docs/solutions/MVP_FIGMA_EXECUTION_PACK_R1.md
6) docs/solutions/MVP_FOUNDER_DECISION_REGISTER_R1.md

Hard constraints:
- No speculative redesign.
- No placeholder CTAs.
- If canon is silent, stop and ask founder (do not fill with assumptions).
- Keep outputs concise and implementation-focused.

Required output:
1) Figma page/frame list changed
2) pass/fail checklist against source docs
3) explicit drift list (if any)
4) docs/handoff note path
5) docs/CHANGELOG.md line
```

## Lane A Prompt (Tokens + Shell)

```text
Run Lane A from docs/solutions/MVP_FIGMA_EXECUTION_PACK_R1.md.

Focus:
- 00_Tokens
- 01_Mobile Shell

Deliver:
- token map (color/type/spacing/radius)
- base mobile shell
- tab bar
- bottom nav

Stop condition:
- If any token/component decision is not covered by canon docs, stop and ask founder.
```

## Lane B Prompt (Player + Engagement Contracts)

```text
Run Lane B from docs/solutions/MVP_FIGMA_EXECUTION_PACK_R1.md.

Focus:
- 02_Player States
- 06_Interaction Specs (player interactions only)

Deliver:
- RADIYO player state
- Collection player state
- mode/rotation controls placement
- tier stack (national/state/city)
- engagement wheel action mapping notes

Stop condition:
- If controls conflict with canon/decision register, stop and flag exact conflict with file references.
```

## Lane C Prompt (Profile States + Collection Surfaces)

```text
Run Lane C from docs/solutions/MVP_FIGMA_EXECUTION_PACK_R1.md.

Focus:
- 03_Profile Expanded

Deliver:
- collapsed profile strip contract
- expanded profile panel contract
- collection menu/tab content ownership map

Stop condition:
- If expanded/collapsed behavior implies route navigation, stop and correct to panel-state transition.
```

## Lane D Prompt (Onboarding + Home Scene Routing)

```text
Run Lane D from docs/solutions/MVP_FIGMA_EXECUTION_PACK_R1.md.
Use onboarding canon anchor:
- docs/specs/users/onboarding-home-scene-resolution.md

Focus:
- 05_Onboarding

Deliver:
- scene details screen
- review/routing screen for inactive home scene
- GPS decision prompt sequence
- nearest-active fallback messaging (non-speculative)

Stop condition:
- If flow requires new policy beyond current docs, stop and ask founder.
```

## Lane E Prompt (QA + Founder Walkthrough)

```text
Run Lane E from docs/solutions/MVP_FIGMA_EXECUTION_PACK_R1.md.

Focus:
- cross-page QA drift review
- founder walkthrough script

Deliver:
- pass/fail matrix by screen
- drift register with exact file references
- founder walkthrough steps (ordered)
- blocked decision list for founder confirmation
```

## Supervisor Prompt (single coordinator agent)

```text
You are supervisor for lanes A-E. Do not redesign.

Collect outputs from each lane and produce:
1) consolidated frame index (all pages)
2) merged pass/fail matrix
3) single drift register with severity (high/med/low)
4) ordered founder decision list
5) docs/handoff/<dated>_figma-r1-supervisor-closeout.md

Rules:
- Reject any lane output that adds behavior not present in source-of-truth docs.
- Require file references for every warning/blocker.
- No merge until all high-severity drift items are either fixed or founder-approved.
```
