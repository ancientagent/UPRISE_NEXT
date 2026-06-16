# Art Department

This top-level workspace is the repo's non-production design and visual-development department.

Use `art/` for:
- legacy visual builds and old design explorations
- messy brainstorm notes tied to visual direction
- mockups and wireframes
- external-agent image outputs and design exports
- website/UI visual reference material
- art/specification documents that explain visual composition, asset classes, or design-system intent

Do not use `art/` for shipped runtime assets by default.

Shipped/product assets still belong in the appropriate runtime locations, such as:
- `assets/`
- `apps/web/public/`
- package/app-specific asset folders

## Department Structure
- `art/brainstorm/`
  - rough visual thinking, messy notes, unstructured ideation
- `art/legacy/`
  - older build snapshots, deprecated visual systems, historical design carry-forward
- `art/reference/`
  - reference captures, inspirational direction, visual comparison material
- `art/specifications/`
  - visual/specification docs for asset classes, layout rules, and design constraints
- `art/website/`
  - website-specific visual work
- `art/mockups/web-ui/`
  - app/web UI mockups and wireframes
- `art/mockups/website/`
  - website marketing/presentation mockups
- `art/intake/external-agents/`
  - direct outputs from Gemini, Claude design tools, Uizard, Adobe Express, etc.

## Working Rule
Treat everything in `art/` as design-department material until it is intentionally promoted into a shipped asset path.

## Naming Guidance
Prefer date-stamped subfolders for intake batches and exports, for example:
- `art/intake/external-agents/2026-04-18/`
- `art/mockups/web-ui/2026-04-18_artist-profile-pass/`
