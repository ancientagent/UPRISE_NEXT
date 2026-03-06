# Uizard MVP Tightening Runbook (2026-03-06)

Purpose: take the screenshot-converted Uizard project and convert it into a strict, lock-compliant MVP B1..B8 set with minimal drift.

## Current State (Observed)
- One screenshot-derived populated frame exists.
- Multiple `New Screen` stubs exist.
- Screenshot-derived frame includes drift items (e.g., `Social`, `View More`, label mismatches).

## Source Lock
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_UIZARD_PROMPT_PACK_R2_STRICT.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

If output conflicts with source lock, output is wrong.

## Non-Negotiable Exclusions
Keep out of MVP screens:
- vibe/recommendation bubble mechanics
- instrument/registrar profile fields
- ambassador/mixologist surfaces
- avatar surfaces
- plus/minus dial as active control

## Execution Strategy
1. Keep screenshot-derived frame as `REF_LegacyScreenshot_Parsed` (reference only).
2. Build B1..B3 via short prompt flow in Autodesigner (`Generate screens` + `Prompt` + `Mobile`, <=300 chars).
3. Build B4..B8 by duplicating B3 and changing active tab/body only.
4. Run acceptance checklist after each screen.

Rationale: reduces AI drift and preserves locked header/tab architecture.

## Screen Naming (Required)
- `B1_plot_collapsed_radiyo`
- `B2_plot_collapsed_collection`
- `B3_profile_expanded_singles_playlists`
- `B4_profile_expanded_events`
- `B5_profile_expanded_photos`
- `B6_profile_expanded_merch`
- `B7_profile_expanded_saved_uprises`
- `B8_profile_expanded_saved_promos_coupons`

## Compact Prompts (<=300 chars target)
### B1
Plot collapsed + RADIYO. Top strip: username, bell, ... only. Player: scene+track+vertical National/State/City. Tabs: Feed, Events, Promos, Statistics. Bottom nav: Home, center UPRISE, Discover. No Social, no View More, no avatar, no mode switch.

### B2
Plot collapsed + Collection mode. Same top strip and bottom nav. Player shows collection title + eject + shuffle. No tier stack. No extra transport controls. No Social, no View More, no avatar, no mode switch.

### B3
Expanded profile replaces plot body (same route). Header: username/handle, activity score, conditional band/promoter, calendar opposite side. Tabs exact order: Singles/Playlists, Events, Photos, Merch, Saved Uprises, Saved Promos/Coupons. Singles active.

## Manual Duplication Rules (B4..B8)
- Duplicate B3 for each tab state.
- Change only active tab + tab body content.
- Do not change header composition/order.
- Do not add controls.

### B4 Events body
- fliers and event artifacts only.
- calendar remains in header.

### B5 Photos body
- saved scene/event photos + listener photography artifacts.

### B6 Merch body
- categories visible: Posters, Shirts, Patches, Buttons, Special Items.

### B7 Saved Uprises body
- saved/followed scene list + scene identity chips (city/state/community).

### B8 Saved Promos/Coupons body
- promo/coupon cards with visible status + expiration labels.

## Acceptance Gate (PASS/FAIL)
A screen fails if any occur:
- avatar shown
- dedicated RADIYO/Collection switch shown
- Social tab present (strict mockups)
- unapproved CTA (e.g., View More, Coming Soon, Join, Upgrade)
- expanded tab order differs from lock
- calendar in Events tab body
- missing required control for that state
- non-listed controls introduced

## Known Drift Corrections from Screenshot-Parsed Frame
- Remove `Social` tab.
- Remove `View More` CTA.
- Rename labels to exact lock: `Promos`, `Statistics`, `Saved Promos/Coupons`.
- Remove vibe-score style mechanics.

## QA Report Format (Use verbatim)
## Screen Bx
- Status: PASS | FAIL
- Violations:
  - ...
- Correction prompt:
  - ...
- Next action:
  - ...
