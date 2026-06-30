# Plot Feed Card Families And Avatar-Wearable Clarification

Date: 2026-06-29
Branch: `design/plot-neighborhood-menu-pass`
Mode: docs clarification only

## Summary

Captured founder clarification from a cross-thread design discussion:

- The Home Scene mainpage/default state is the Feed tab inside Plot.
- Feed/message card design should map to reusable message-family archetypes, not
  one-off card behavior for every feed row.
- Avatar/merch visual work should use a stable shared avatar base/body model
  with interchangeable clothing/body-piece layers.
- The avatar should behave like a stylized fit model for band merch; clothing
  and band artwork should remain the readable focus.

## Files Updated

- `docs/specs/communities/plot-and-scene-plot.md`
  - Promoted the Home Scene Feed default and feed card-family taxonomy into the
    Plot owner spec.
- `docs/specs/economy/print-shop-and-promotions.md`
  - Added the avatar-wearable framing rule under deferred shirt/avatar merch
    behavior.
- `docs/agent-briefs/UI_CURRENT.md`
  - Added a short agent-facing summary for Feed card taxonomy and avatar/merch
    design boundaries.
- `docs/CHANGELOG.md`
  - Added one Unreleased entry.

## Scope Boundary

No runtime code, CSS, art files, avatar assets, marketplace behavior, merch
issuance models, or Feed API behavior changed in this slice.

This clarification does not activate avatar customization or shirt creation
runtime. It only prevents future design agents from over-rendering avatars,
inventing bespoke feed card behavior, or treating the avatar itself as the
primary merch object.

## Validation

- `pnpm run docs:lint` passed.
- `git diff --check` passed.
