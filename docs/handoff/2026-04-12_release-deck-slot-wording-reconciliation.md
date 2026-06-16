# 2026-04-12 — Release Deck Slot Wording Reconciliation

## Purpose
Normalize the repo language around Release Deck capacity so agents stop treating the early-beta `3` song cap and the `4th` paid ad slot as competing truths.

## What changed
- founder-lock and implementation-plan docs now say:
  - `3` music upload slots
  - `1` paid attached-ad slot in the same Release Deck interface
- canon wording now explicitly distinguishes:
  - music upload capacity
  - interface-level paid ad attachment

## Why
The underlying product rule was already consistent:
- artists may upload up to `3` songs
- the interface may also expose a paid slot for recording a `10` second ad attached to the current new release

The confusion came from mixed wording such as:
- `4 slots total`
- `up to 3 songs`

Those now read as:
- `3` song slots for upload capacity
- `4th` slot for paid ad attachment

## Files reconciled
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ACCOUNT_SOURCE_SIGNAL_SYSTEM_PLAN_R1.md`
- `docs/solutions/MVP_SIGNAL_SYSTEM_CONTRACT_R1.md`
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md`
- `docs/canon/Master Revenue Strategy Canonon.md`
- `docs/canon/Legacy Narrative plus Context .md`
