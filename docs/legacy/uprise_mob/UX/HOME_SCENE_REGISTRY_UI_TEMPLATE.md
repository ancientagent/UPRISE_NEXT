# Home Scene Registry – Revolutionary UI Template (Updated)

## Core Design Principles
- Revolutionary Tone: Bold typography, activist visuals, and clear verification status indicators (checkbox + warning icon).
- Clear Hierarchy: Top‑to‑bottom stacked funnel.
- Responsive Autocomplete: Dropdown collapses after selection.
- Symbolic Language: Black flag = Verified, Grey flag = Pending.

---

## Header Section
**Title:** Home Scene Registry

**Subtext:**
> Home Scenes represent the core music communities in your city of residence. These are the communities where you’ll have influence through your music and your vote. (GPS Verification Required)

---

## City Verification Section
**Input Row:**
- Field Label: City of Residence
- Input: Zipcode field with placeholder: Enter Zip Code
- Action Button: Verify with GPS
- Verification status row: Checked checkbox = Verified, warning icon = Not Verified

**Behavior:**
- When ZIP matches GPS → checkbox shows as checked and community name displays in confirmation box.
- If verification fails due to GPS issue → Error modal with retry options (Open Settings / Try Again / Verify Later).
- If verification fails due to mismatch → Prompt: “GPS shows [xxxxx]. Confirm or Verify Later.”
- If Verify Later → Confirmation text: “To enable voting from Home Scene dashboard go to Profile > Settings > GPS Verification.” with Continue.

**Loading State:**
- Rely on the Verify with GPS button and OS permission dialogs; no custom animation in v1.

---

## Genre Selection Section
**Field Label:** Primary Genre of Interest / Affiliation
- Autocomplete Dropdown: Scrollable list of genres, alphabetized, narrows as you type.
- Behavior: Once a genre is selected, dropdown disappears.
- Selection Display: Genre appears inside input field.

---

## Confirmation Box
- Dynamic Display: Shows resolved community name based on City + Genre (e.g., Austin, Texas Hip Hop).
- Join Button: “Join Home Scene” (disabled until ZIP→City/State and Genre are present; prompt if GPS not verified).

**Behavior:**
- If user presses Join without verifying → Modal:  
  Title: Zip Verification  
  Copy: You chose not to verify your home zip. This means you will not have the ability to vote in your Home Scene.  
  Actions: [Verify] [Join Home Scene]

---

## UX Enhancements
- Checkbox + warning icon communicate verification status; consider black flag treatment in a later polish pass.
- Red accents for failed states, subtle pulsing grey for pending.
- No custom loader in v1; animation polish may follow under `HOME_SCENE_UI_V2`.
- Revolutionary typography consistent with UPRISE brand.
- Space‑efficient stacked layout: Title → City → Genre → Confirmation → Action.

---

## Implementation Notes (App)
- Phase 1 (JS‑only, low risk):
  - Apply copy changes, stacked layout, and ensure genre dropdown closes after select.
  - Add “Open Settings” deep link (Linking.openSettings with iOS fallback).
  - Use emoji‑based resist‑fist loader as a harmless fallback while verifying GPS.
- Phase 2 (Assets/Animation):
  - Add black‑flag icons (verified/pending) and light wave animation.
  - Centralize theme tokens for “revolutionary” color accents.
- Phase 3 (A11y/Polish):
  - Accessibility labels for verify button/flags/preview; high contrast check; larger touch targets.

Feature Flags (recommended):
- HOME_SCENE_UI_V2=true (enables visual polish/flags/loader)
- Keep functional logic unaffected when toggled off.

---

## Backend Notes
- GET /geo/zip-lookup?zip=XXXXX → { city, state_abbr, state_name, county, coords:{lat,lng}, metroArea }
- GET/POST /onboarding/validate-community → { active, needed, nearestActive, primary.community_key }
