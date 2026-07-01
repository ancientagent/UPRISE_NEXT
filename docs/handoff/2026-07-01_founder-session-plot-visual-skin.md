# Founder Session Capture: Plot/Home Scene Visual Skin

Date: 2026-07-01
Branch: docs/founder-session-plot-visual-skin
Mode: docs-only capture

## Summary

Captured the founder's current Plot/Home Scene UI clarification in `docs/founder-sessions/2026-07-01_plot-home-scene-visual-skin.md`.

The note preserves raw founder wording, separates `Clarifications` from `Feature Sets`, and records the current interpretation for future UX extraction work:

- Home Scene switching uses left/right arrows or horizontal swipe.
- The old roller/Rolodex idea is a context-switcher metaphor, not a full visible preference-management list.
- Plot/Home architecture stays invariant across communities.
- Community visual identity may vary through approved skin layers such as title/wordmark, backdrop/skyline, overlay, color profile, and possible player accents.
- Saved Away Scenes remain profile/collection-only.
- Prototype UX branches remain references only, not merge candidates.

## Files Changed

- `docs/founder-sessions/README.md`
- `docs/founder-sessions/2026-07-01_plot-home-scene-visual-skin.md`
- `docs/handoff/2026-07-01_founder-session-plot-visual-skin.md`
- `docs/handoff/README.md`
- `docs/CHANGELOG.md`

## Validation

- `pnpm run docs:lint`
- `git diff --check`

## Follow-Up

Use this founder-session note as input for the next UX extraction design slice. Do not treat it as runtime approval by itself; promote durable rules into owner specs when implementation begins.
