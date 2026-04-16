# 2026-04-16 — Discover Feed Insert + Artist Demo Playback Lock

## Summary
Locked the current MVP discovery/listening behavior into active docs before more UI/runtime work.

The main correction is:
- live `/discover` stays deferred while borders remain closed
- discovery/statistics value currently comes through intermittent feed inserts
- clicking those inserts should hand the user into artist-profile demo listening
- collection happens on the artist profile
- blast stays out of the profile and remains tied to `RADIYO` / `Collection`

## Why This Slice Was Needed
The repo had started to accumulate mixed active documentation around:
- live Discover as if open-borders behavior were active MVP
- artist profile actions as `Follow / Add / Support`
- stats/discovery carousels without a clear click/action boundary
- older implementation briefs still teaching now-invalid assumptions

Without a lock pass here, further UI/runtime work would keep compounding drift.

## Locked Behavior
### 1) Discover MVP status
- current MVP is local-community-only
- `/discover` is deferred / placeholder state
- discovery value should surface through intermittent feed inserts, not a live Discover destination

### 2) Feed insert behavior
- inserts are occasional feed moments, not fixed furniture
- inserts should render as titled horizontal carousels
- the cards/squares are read-only discovery launchers
- no inline `Collect`, `Blast`, `Follow`, or wheel actions on those cards

### 3) Click handoff
- clicking a card pauses `RADIYO`
- opens artist-profile demo listening on the selected song
- artist profile becomes the expanded discovery surface for that listening session

### 4) Artist profile listening mode
- artist profile is a demo/listen shell, not a wheel surface
- it should expose `3` song rows
- each row should have play/pause + timeline
- `Collect` happens from that profile listening context
- `Blast` does not happen there

### 5) Blast boundary
- `Blast` remains tied to:
  - `RADIYO`
  - `Collection`
- not feed inserts
- not artist-profile song rows

## Docs Updated
### Rewritten / re-locked
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`

### Reconciled supporting docs
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/solutions/SURFACE_CONTRACT_DISCOVER_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_DOC_AUDIT_R1.md`
- `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md`

## Implementation Slices Now Locked
### Slice A — feed insert shell
- intermittent horizontal feed carousels
- titled sections
- read-only squares/cards
- arrow-based browsing

### Slice B — artist-profile demo rows
- `3` song rows
- play/pause + timeline
- no wheel

### Slice C — handoff wiring
- clicking feed insert pauses `RADIYO`
- artist profile opens in demo-listen mode on selected song

### Slice D — collection entry
- collect from artist-profile listening context
- no collect on the insert card itself

### Slice E — later Discover reactivation
- reopen richer Discover only after communities settle and borders intentionally open

## Residual Debt Still Outside This Slice
- runtime implementation for the feed insert shell is not built yet
- runtime implementation for artist-profile song-row demo playback is not built yet
- later open-borders Discover doctrine is still present in some older historical docs, but current active locks/specs now point the right way

## Verification
- `pnpm run docs:lint`
- `git diff --check`
