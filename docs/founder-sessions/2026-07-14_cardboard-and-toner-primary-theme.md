# Cardboard And Toner Primary Theme Founder Session

Status: raw founder-session capture
Date: 2026-07-14
Source: current chat/session
Related lane(s): UX/UI, design system, web tier, design-agent handoffs
Owner doc: `docs/solutions/UPRISE_VISUAL_THEME_CARDBOARD_AND_TONER_R1.md`

## Raw Founder Notes

> hey you know what I really like this theme you wrote this in its like
> cardboard and toner  lets make a note as this being the primary theme from
> the fonts to the color pallet

Context: the theme in question is the visual treatment of the 2026-07-14
design-session export page — report-paper ground, heavy ink rules, signal-lime
accent, sparing marker red, Archivo Black / Libre Franklin / IBM Plex Mono
type stack, rubber-stamp and mono-eyebrow motifs. It was derived from the
existing `plot-wire` values already present in the web runtime.

## Clarifications

- The "Cardboard and Toner" treatment is the primary UPRISE visual theme:
  fonts and color palette included.
- Type: settled design direction.
- Likely owner: `docs/solutions/UPRISE_VISUAL_THEME_CARDBOARD_AND_TONER_R1.md`
  (created this session); routed by `docs/agent-briefs/UI_CURRENT.md`.

- The theme formalizes, rather than replaces, the existing `plot-wire` family:
  the canonical paper/lime values are the ones already in runtime components.
- Type: continuity clarification.
- Likely owner: theme doc.

## Working Interpretation

- "Cardboard" = the warm paper/board ground and its raised/soft variants;
  "toner" = the near-black ink, heavy rules, and xerox character. Signal lime
  is the single accent; marker red is reserved for hard boundaries/warnings.
- The theme is the platform base. Community scene skins may vary atmosphere
  imagery and accents per existing rules without changing the base system.
- Adopting the theme as tokens across the web app is a separate scoped
  implementation slice; this note settles direction, not a restyle-everything
  mandate.

## Promotion Targets

- Owner doc: `docs/solutions/UPRISE_VISUAL_THEME_CARDBOARD_AND_TONER_R1.md`
- Lane brief: `docs/agent-briefs/UI_CURRENT.md` (routing pointer added)
- Runtime: future token-extraction slice for `apps/web` (not authorized by
  this capture alone).

## Do Not Drift

- Do not introduce new base palettes, fonts, or "safe default" faces (Inter,
  generic system serif heroes) for UPRISE surfaces without a founder decision.
- Do not treat the theme note as permission to restyle all runtime surfaces in
  one pass; token migration is its own scoped slice.
- Do not let community scene skins replace the base theme; they layer on it.
- Do not use marker red as a general accent; it is reserved for boundary/
  warning semantics. Signal lime is the accent.
