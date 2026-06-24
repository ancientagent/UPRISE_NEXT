# 2026-06-24 Plot Tab Canon Annotations

## Status

Implemented on branch `docs/plot-tab-stale-term-annotations`.

## Why

The launch audit found active runtime/spec/brief layers aligned on current Plot tabs (`Feed`, `Events`, `Archive`) while older canon text still describes Promotions, Statistics, and Social as Plot surfaces or launch tabs. Because all files under `docs/canon/` are canon, careless future agents could load canon first and reintroduce stale current-MVP tab language.

## Changed

Annotation-only canon edits:

- `docs/canon/Master Narrative Canon.md`
  - Added a current MVP runtime override beside `6.3 Plot Surfaces`.
- `docs/canon/Master Glossary Canon.md`
  - Added a current MVP runtime override beside `The Plot` glossary entry.
- `docs/canon/Legacy Narrative plus Context .md`
  - Added a top-of-file runtime override warning that older launch-era tab language is historical/canon context only.
- `docs/CHANGELOG.md`
  - Added this canon annotation slice to Unreleased.

## Current Contract

- Current MVP user-facing Plot tabs are `Feed`, `Events`, and `Archive`.
- Promotions/business surfaces are deferred and are not current Plot tabs.
- Social remains V2/hidden.
- Statistics/Scene Map content is descriptive Archive context, not a current user-facing `Statistics` tab.
- Older canon language is preserved for product semantics/history but does not override current runtime/spec/brief locks.

## Validation

Planned:

```bash
pnpm run docs:lint
pnpm run canon:lint
git diff --check
```

## Notes

This slice intentionally does not bulk-overwrite canon and does not move legacy documents. It adds explicit runtime override notes only where stale tab language was most likely to mislead agents.
