# 2026-04-12 Release Deck Reconciliation

## Summary
- Reconciled legacy artist upload/release understanding against current source-dashboard and signal-system law.
- Locked the current implementation direction for the artist-side Release Deck.

## Legacy Findings
Recovered from:
- `docs/legacy/uprise_mob_code/docs/project-narrative/06_UPRISE_Song_Management_System.md`
- `docs/legacy/uprise_mob_code/docs/Previous-Investigation/SONG-UPLOAD-IMPLEMENTATION.md`
- `docs/legacy/uprise_mob_code/docs/webapp reviews/WEBAPP-ANGULAR-SYSTEM-ANALYSIS.md`
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md`

Legacy-compatible patterns:
- artist-side song release belongs on the source-facing side
- songs should feed RaDIYo/Fair Play rather than being treated as generic feed posts
- feed and radio/music should remain separate systems

Legacy conflict areas:
- older canon currently states an early-beta release deck of `3` songs
- legacy docs also carried heavier assumptions about automatic location/genre assignment and a full upload/media-processing pipeline
- those assumptions do not map cleanly to the current one-account/source-dashboard/source-signal system

## Locked Now
Current implementation direction:
- artist-side music release belongs inside `Source Dashboard`
- `Release Deck` is the next creator tool in that system
- the deck has `4` slots total:
  - `3` music slots
  - `1` paid slot for a `10` second ad attached to the new release

Important boundary:
- the paid attached-ad slot is not to be treated as an extra music slot
- it is also not yet widened into a general independent signal class

## Authority Note
- Until canon is intentionally reconciled, the founder-lock docs control implementation direction where the older canon still says `3` release-deck songs.

## Files Updated
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
- `docs/solutions/MVP_SIGNAL_SYSTEM_CONTRACT_R1.md`
- `docs/solutions/MVP_ACCOUNT_SOURCE_SIGNAL_SYSTEM_PLAN_R1.md`
- `docs/CHANGELOG.md`

## Next Implementation Implication
- the artist-side `Release Deck` web flow should be built as a Source Dashboard tool using the existing `POST /tracks` ingestion seam, while keeping media-pipeline and billing complexity scoped to what is already explicitly locked.
