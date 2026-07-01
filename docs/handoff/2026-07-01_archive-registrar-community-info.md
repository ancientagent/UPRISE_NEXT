# Archive Registrar Community Information

Date: 2026-07-01
Branch: `feat/archive-registrar-community-info`
Owner: Codex

## Summary

Implemented the approved Registrar placement inside `/plot` Archive/community information.

Registrar now appears at the top of the Archive community-information module, with registrar records/status history below it. This follows the owner contracts in `docs/specs/communities/plot-and-scene-plot.md` and `docs/specs/system/registrar.md`.

## Runtime Scope

Changed:
- `apps/web/src/components/plot/PlotPrimaryTabBody.tsx`
  - adds `data-slot="archive-community-information"`
  - adds `data-slot="archive-registrar-entry"` before `data-slot="archive-registrar-records"`
  - links to `/registrar` through the Archive community-information module
  - renders existing artist/band registrar summary and latest promoter status below the Registrar entry
- `apps/web/src/app/plot/page.tsx`
  - passes already-loaded registrar summaries and latest promoter entry into `PlotPrimaryTabBody`

Not changed:
- no non-expanded Plot side/context panel
- no Release Deck, Print Shop, or SourceAccountSwitcher inside Archive
- no Registrar API, database, schema, migration, provider, or art changes
- no event authoring in listener Plot

## Contract Updates

Updated:
- `docs/specs/communities/plot-and-scene-plot.md`
  - marks Archive Registrar community-information placement as implemented
- `docs/agent-briefs/UI_CURRENT.md`
  - changes Registrar placement language from future/should to current/is

## Regression Locks

Updated `apps/web/__tests__/plot-tab-contracts.test.ts` to assert:
- `/plot` passes registrar summary props into `PlotPrimaryTabBody`
- Archive contains `archive-community-information`, `archive-registrar-entry`, and `archive-registrar-records`
- Registrar entry appears before records/status history
- Archive does not mount Release Deck, Print Shop, or SourceAccountSwitcher

## Validation

Passed in this branch:

```bash
pnpm --filter web test -- plot-tab-contracts.test.ts plot-ux-regression-lock.test.ts registrar-source-context-lock.test.ts --runInBand
pnpm --filter web typecheck
pnpm run docs:lint
git diff --check
```
