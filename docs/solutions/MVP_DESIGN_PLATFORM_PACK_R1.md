# MVP Design Platform Pack R1

Status: Historical workflow reference

Historical note:
- This file documents an older cross-tool UX generation workflow.
- It is not current authority for product behavior, action grammar, or active MVP surface scope.
- Use current founder locks and the authority map first:
  - `docs/solutions/REPO_AUTHORITY_MAP_R1.md`
  - `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
  - `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
  - `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
  - `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`


Purpose: keep one UX contract across multiple design tools (Uizard, Figma, Penpot, Balsamiq) without drift.

## Source Lock (Always Reference)
- `docs/solutions/REPO_AUTHORITY_MAP_R1.md`
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`

If any platform output conflicts with those newer files, the output is wrong. This document itself is historical workflow guidance, not current product authority.

---

## 1) Uizard (AI-first generation)
Use:
- `docs/solutions/MVP_UIZARD_PROMPT_PACK_R2_STRICT.md`

Workflow:
1. Global rules (Section A)
2. Generate B1..B8 one by one
3. Run acceptance checklist per screen

---

## 2) Figma (manual + AI-assisted)
Use this prompt in Figma AI / design assistant:

```text
Build mobile-only wireframes for UPRISE using this locked contract:
- No avatar in MVP
- Collapsed profile: username + notifications + options only
- Player below profile
- No dedicated RADIYO/Collection switch button
- Collection mode enters via collection selection, exits via eject only
- Expanded profile header includes calendar on opposite side
- Expanded tabs in exact order: Singles/Playlists, Events, Photos, Merch, Saved Uprises, Saved Promos/Coupons
- Bottom nav: Home / center UPRISE action / Discover
- Keep controls compact, high-contrast dark UI, no desktop patterns
- Do not add controls not listed
Generate 8 screens:
1) Plot collapsed + RADIYO
2) Plot collapsed + Collection
3) Expanded + Singles/Playlists
4) Expanded + Events
5) Expanded + Photos
6) Expanded + Merch
7) Expanded + Saved Uprises
8) Expanded + Saved Promos/Coupons
```

Figma QA checklist:
- Component names include state prefix (`plot_collapsed_*`, `profile_expanded_*`)
- One frame per locked screen
- No unapproved CTA/control

---

## 3) Penpot (open-source alternative)
Penpot prompt block (manual design brief):

```text
Design mobile wireframes for UPRISE from locked MVP behavior only.
Follow exact element order and tab order from docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md.
No avatar. No RADIYO/Collection switch button. Collection enters via item selection, exits via eject.
Render 8 state screens (collapsed RADIYO/Collection + expanded profile tabs).
```

Penpot QA:
- Export each screen with filename matching state id (e.g., `B1_plot_collapsed_radiyo.png`)
- Verify tab labels match exact casing and order.

---

## 4) Balsamiq (low-fi flow lock)
Use for:
- Fast layout validation before high-fidelity work.

Template instruction:

```text
Create low-fidelity mobile wireframes for the locked 8-screen MVP set.
Use placeholders for visual styling, but preserve exact control layout, tab order, and mode/tier behavior labels.
No extra controls or social placeholders.
```

---

## 5) Cross-Platform Handoff Format (Required)
For any platform output, provide:
1. Screen map (`B1..B8`)
2. Pass/fail against acceptance checks
3. Violations list (if any)
4. Corrective prompt text

Use this standard:

```md
## Screen Bx
- Status: PASS | FAIL
- Violations:
  - ...
- Correction prompt:
  - ...
```

---

## 6) Recommended Tool Choice by Task
- Fast generation + iteration: Uizard
- Structured design system + component variants: Figma
- Open-source collaboration: Penpot
- Fast low-fi alignment: Balsamiq

The contract stays the same across all tools.