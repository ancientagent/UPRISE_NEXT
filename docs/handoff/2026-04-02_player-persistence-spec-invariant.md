# Handoff - 2026-04-02 - Player Persistence Spec Invariant

## Summary
Locked the persistent player in as a required consideration for all future surface/spec work.

## Changes
- Added `Rule 0: Every surface spec must account for the persistent player` to `docs/solutions/SOFTWARE_SYSTEMS_GUARDRAILS_R1.md`.
- Extended the guardrail rejection checklist so specs that omit player visibility/inheritance/effect rules fail review.
- Extended the reusable prompt guard to explicitly require persistent-player consideration in every surface discussion and implementation prompt.
- Added a required `Persistent System Impact` section to `docs/specs/TEMPLATE.md` so new specs must explicitly state:
  - player visibility on the surface/flow
  - inherited player context/state
  - whether the feature affects player state/listening context
  - whether player state constrains search/navigation/travel/content scope
  - why a hidden player would be valid, if applicable

## Why
Founder direction is now explicit: the player always persists, and any screen/feature/menu discussion must include player function in spec.

## Validation
- `pnpm run docs:lint`
