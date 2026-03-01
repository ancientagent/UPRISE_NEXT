# MVP Mobile UX Mapping From Plot Prototype (R1)
Status: Frozen mapping artifact
Last updated: 2026-03-01

## Purpose
Capture the current Plot prototype decisions and map them into the mobile-first UX system format.

Primary reference:
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`

## 1) Current Prototype Snapshot (Plot)
Route: `/plot`

Implemented layout order:
1. Profile header row (avatar, identity, notifications, overflow)
2. Player shell
3. Plot tabs
4. Active tab content

## 2) Mobile Interaction Mapping
Profile pull-down behavior:
- Top profile header supports pull-down to expand profile panel.
- Expanded state reveals profile + collection content.
- Pull-up collapses panel.
- Seam toggle fallback is present.

Player mode mapping:
- Explicit mode labels normalized to `RADIYO` and `Collection`.
- RADIYO controls: play/pause/add plus pool toggle.
- Collection controls: back/shuffle/play/pause.

Tier mapping:
- Tier controls embedded in player row.
- Labels: `City`, `State`, `National`.

## 3) Plot Body Mapping
Tabs mapped as:
- Feed
- Events
- Promotions
- Statistics
- Social

Statistics contains:
- Metrics panel
- Top songs
- Scene activity snapshot

## 4) Web Adaptation Notes
Current prototype includes mobile-first interactions in web shell for rapid iteration.
This is a behavior scaffold, not final visual polish.

Desktop/mobile adaptation must continue to follow:
- Same interaction semantics
- No net-new product behavior
- No ranking/recommendation implication drift

## 5) Known Follow-ups
- Replace placeholder broadcast fallback copy for missing Home Scene.
- Finalize seam affordance visuals after founder pass.
- Tune spacing/typography to canonical visual language pass.

## 6) Freeze Intent
This mapping locks what is currently built so next UX work starts from a stable, documented baseline.
