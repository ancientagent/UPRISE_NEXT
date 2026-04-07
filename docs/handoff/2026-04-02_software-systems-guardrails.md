# 2026-04-02 — software systems guardrails

## What changed
- Added `docs/solutions/SOFTWARE_SYSTEMS_GUARDRAILS_R1.md`.
- Added the new guardrail doc to `docs/solutions/README.md` under the agent workflow section.
- Updated `docs/CHANGELOG.md`.

## Why
Recent UX/product work kept revealing the same implementation failure mode:
- agents treated surfaces as isolated screens
- persistent systems like the player were ignored or duplicated
- context anchors were redefined instead of inherited
- page-local controls were introduced where system contracts should have governed behavior

The new doc is meant to give future agents a strict software-composition lens without letting them invent behavior from abstraction alone.

## Key rules captured
- one source of context per surface
- persistent systems stay authoritative
- no parallel interaction models for the same job
- context inheritance beats re-selection
- geography changes do not equal identity changes
- support visibility outranks vanity customization
- the shell matters as much as the page
- system behavior belongs in system contracts, not page-local hacks

## Intended use
Use this doc alongside:
- founder locks
- `docs/specs/*`
- `docs/solutions/SESSION_STANDING_DIRECTIVES.md`
- `docs/solutions/ANTI_PLATFORM_TROPE_DRIFT.md`

It is a reasoning guardrail, not a substitute source of product truth.
