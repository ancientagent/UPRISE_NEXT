# 2026-07-01 - Plot Context Panel Removal

Branch: `refactor/plot-community-context-panel`
Base: `main` at `1dba67d`
Status: implementation handoff

## Summary

Removed the forced non-expanded `/plot` community context panel instead of preserving it as a standalone component. The removed panel grouped SourceAccountSwitcher, Registrar Access, and Selected Community context beside every Plot tab, but founder clarification rejected that as unnecessary forced Plot furniture.

## Product Clarification Captured

Founder-session note: `docs/founder-sessions/2026-07-01_plot-archive-registrar-placement.md`

Current rule:

- Non-expanded Plot should show the active Plot surface, not a forced companion context column.
- Source selector access can move through the listener profile/source identity path in a separate slice.
- Registrar/community-information placement should be handled through Archive/community information or a dedicated owner-spec slice, not a generic always-visible Plot box. When rendered there, Registrar belongs on top and records/status history below.
- Deprecated community-information naming was removed from active docs/code comments in favor of plain Archive/community information wording.

## Runtime Changes

- Removed `PlotCommunityContextPanel` from `/plot`.
- Removed the component file instead of keeping dead structure.
- Changed the non-expanded Plot body from a two-column wide layout to a single active Plot surface wrapper.
- Kept registrar summary fetching because expanded listener profile status cards still use the registrar-linked Band Status context.
- Did not move SourceAccountSwitcher into profile in this slice.
- Did not add a new Registrar/Archive module in this slice.
- Did not touch provider, DB, schema, art, or source-dashboard routes.

## Tests / Locks Updated

- `apps/web/__tests__/plot-ux-regression-lock.test.ts` now asserts SourceAccountSwitcher, Registrar Access, Selected Community, Open Community, and Open Registrar do not appear in the non-expanded `/plot` body.
- Existing Print Shop source-facing locks remain intact.

## Validation

To run before closeout:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand
pnpm --filter web typecheck
pnpm run docs:lint
rg -n "deprecated community-information label" docs apps packages --glob '!node_modules' --glob '!docs/legacy/**'
git diff --check
```
