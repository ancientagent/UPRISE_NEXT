# UPRISE AutoHarness R1

**Date:** 2026-04-05
**Owner:** Codex

## What changed
- Added `docs/solutions/UPRISE_AUTOHARNESS_R1.md`.
- Added `docs/solutions/UPRISE_DRIFT_TAXONOMY_R1.md`.
- Indexed both docs in `docs/solutions/README.md`.
- Recorded the rollout in `docs/CHANGELOG.md`.

## Why
The current working pattern is already founder -> Codex -> external agent. These docs formalize that pattern into a repeatable control layer so model changes do not reset product truth or reintroduce known drift classes.

## Key points
- The harness is repo doctrine first, not a plugin.
- The first version focuses on invariants, review gates, and reusable drift cases.
- Future promotion path is doctrine -> Codex skill -> optional automation.

## Verification
- `pnpm run docs:lint`

## Follow-ups
- Add per-surface contract docs for Home, Plot, Discover, and Community.
- If the doctrine remains stable, convert it into a Codex skill.
