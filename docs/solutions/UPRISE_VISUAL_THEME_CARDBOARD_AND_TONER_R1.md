# UPRISE Visual Theme: Cardboard And Toner R1

Status: founder-settled primary theme direction
Date: 2026-07-14
Founder session: `docs/founder-sessions/2026-07-14_cardboard-and-toner-primary-theme.md`
Routing: `docs/agent-briefs/UI_CURRENT.md`
Visual reference: the 2026-07-14 design-session export page (HTML reference
copy kept in the founder's `uprise-agent-artifacts/design-session-export/`
folder); derived from the runtime `plot-wire` component values.

## What This Is

The primary UPRISE visual theme — fonts and color palette included — settled
by the founder on 2026-07-14 and named "Cardboard and Toner": warm paper/board
ground, near-black toner ink, heavy rules with xerox character, one signal-lime
accent, and marker red reserved for hard boundaries.

This document is the canonical token definition. It formalizes the existing
`plot-wire` family (the paper and lime values below already appear in runtime
components) rather than replacing it. Migrating `apps/web`'s inline hex values
onto these tokens is a separate scoped implementation slice; this doc settles
direction only.

## Color Tokens

### Light ("cardboard") — the default

| Token | Hex | Role |
| --- | --- | --- |
| `paper` | `#f2f0df` | Page/base ground (matches existing runtime value) |
| `paper-raised` | `#eceadb` | Raised panels, table headers |
| `paper-inset` | `#e6e4d2` | Code/inset surfaces |
| `quote` | `#ebe9d6` | Quote/capture blocks |
| `ink` | `#1a1812` | Primary text, heavy rules, borders |
| `ink-soft` | `#5c584d` | Secondary text, metadata |
| `rule-soft` | `#c9c5b2` | Hairline internal rules, row separators |
| `signal` | `#b8d63b` | The accent: signal lime (matches existing runtime value) |
| `signal-ink` | `#4c5a10` | Lime legible on paper: links, eyebrows, markers |
| `marker` | `#c23b2a` | Reserved: boundaries, warnings, stamps — never a general accent |

### Dark ("xerox negative")

| Token | Hex | Role |
| --- | --- | --- |
| `paper` | `#16140f` | Page/base ground |
| `paper-raised` | `#1d1b14` | Raised panels |
| `paper-inset` | `#24221a` | Code/inset surfaces |
| `quote` | `#201e16` | Quote/capture blocks |
| `ink` | `#ebe7d8` | Primary text, rules |
| `ink-soft` | `#a29d8c` | Secondary text |
| `rule-soft` | `#3a372c` | Hairline rules |
| `signal` | `#b8d63b` | Accent (unchanged) |
| `signal-ink` | `#c9e356` | Lime legible on dark ground |
| `marker` | `#e05a47` | Reserved boundary/warning red for dark ground |

Rules:

- Warm neutrals only — every grey carries the paper's hue bias; no pure
  `#808080`-family greys.
- `signal-ink` (not raw `signal`) is the text-safe lime; raw lime is for
  fills, rules, and marks where contrast is carried by the shape.
- One accent. If lime fights the ground, desaturate — do not add a second
  accent hue. Marker red is semantic (boundary/warning/stamp), not decorative.

## Type Roles

| Role | Face | Usage |
| --- | --- | --- |
| Display | **Archivo Black** | Wordmarks, section titles; matches the heavy uppercase weight already used in runtime labels. Use with restraint. |
| Body | **Libre Franklin** | Running text; 400/600/700 weights; italics for captured founder wording. |
| Utility | **IBM Plex Mono** | Eyebrows, labels, paths, metadata, tabular data; uppercase with `0.14–0.2em` letter-spacing; `tabular-nums` where digits align. |

All three are open-license Google Fonts. Fallback stacks: display →
`"Arial Black", sans-serif`; body → `"Helvetica Neue", Arial, sans-serif`;
utility → `monospace`.

## Motif Vocabulary

- Heavy toner rules: 2–3px ink borders and section rules; crisp separation
  over soft shadows (per the existing report-paper direction — no SaaS card
  airiness).
- Mono uppercase eyebrows above section heads.
- Quote/capture blocks: quiet raised ground with a 4px signal-lime left rule.
- Boundary boxes: 2px marker-red border with a red mono label, reserved for
  do-not-cross content.
- Rubber-ink stamp marks: mono uppercase, slight rotation, marker red at
  reduced opacity; low-emphasis, per the existing source-file stamp rules.
- No grunge/torn-paper decoration that hurts legibility (existing rule).

## Scope And Boundaries

- Platform base theme for UPRISE surfaces; community scene skins layer
  atmosphere imagery and accent variation on top per existing community
  visual-system rules — they do not replace the base.
- Existing surface-specific direction (report-paper Source Dashboard, public
  Artist Profile zine posture, plot-wire components) is this same family;
  where an existing lock names specific values, reconcile toward these tokens
  in the token-migration slice rather than forking.
- This doc does not authorize a bulk restyle. The `apps/web` token-extraction
  slice (replacing inline hex with these tokens) is separate scoped work.
