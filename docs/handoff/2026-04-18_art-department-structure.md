# 2026-04-18 — Art Department Structure

## Summary
Created a top-level `art/` workspace so design exploration, legacy visual material, mockups, and external-agent outputs no longer have to live at repo root or pretend to be shipped product assets.

## Added
- `art/README.md`
- `art/intake/external-agents/README.md`
- top-level art department directories:
  - `art/brainstorm/`
  - `art/legacy/`
  - `art/reference/`
  - `art/specifications/`
  - `art/website/`
  - `art/mockups/web-ui/`
  - `art/mockups/website/`
  - `art/intake/external-agents/2026-04-18/`

## Moved
Moved the current root-level design transfer files into:
- `art/intake/external-agents/2026-04-18/`

## Boundary
- `art/` now holds non-production visual/design department material.
- shipped/runtime assets should still live in runtime asset paths such as `assets/` or `apps/web/public/`.

## Related Doc Update
- `docs/PROJECT_STRUCTURE.md` now mentions `art/` as a top-level non-production design workspace.

## Verification
- `pnpm run docs:lint`
- `git diff --check`
