# Profile Source Identity Access

Date: 2026-07-01
Branch: `feat/profile-source-identity-access`
Owner: Codex

## Summary

Moved source account identity access into the expanded `/plot` listener profile, behind a scoped `profile-source-identity-access` slot, for users who manage Artist/Band source accounts.

This preserves the Plot cleanup rule from `2026-07-01_plot-context-panel-removal.md`: non-expanded Plot does not force a companion context panel beside Feed, Events, or Archive. Source-side tools still live in source/admin surfaces.

## Runtime Scope

Changed:
- `apps/web/src/components/plot/PlotListenerProfile.tsx`
  - imports and renders `SourceAccountSwitcher` only when `managedArtistBands.length > 0`
  - places it in `data-slot="profile-source-identity-access"`
  - routes source selection through `onOpenSourceDashboard`
- `apps/web/src/app/plot/page.tsx`
  - passes the authenticated user id and managed Artist/Band source accounts into the expanded profile
  - routes selected source accounts to `/source-dashboard`

Not changed:
- no non-expanded Plot side/context panel
- no Release Deck, Print Shop, source-posting, or Registrar controls inside the listener profile body
- no provider, database, schema, migration, or art changes

## Contract Updates

Updated `docs/agent-briefs/UI_CURRENT.md` to clarify:
- source identity/account switching is allowed in the expanded listener profile for users who manage Artist/Band sources
- source management tools remain outside listener profile and belong to source/admin surfaces
- Registrar placement remains Archive/community information with Registrar on top and records/status history below

## Regression Locks

Updated tests so future agents preserve the boundary:
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
  - allows `SourceAccountSwitcher` only in `PlotListenerProfile`
  - locks the `profile-source-identity-access` slot
  - keeps non-expanded Plot free of direct `SourceAccountSwitcher`, context panel, Print Shop, and Registrar shortcuts
- `apps/web/__tests__/source-account-switcher-lock.test.ts`
  - preserves the one-account source-context switcher contract
  - verifies source identity access is mounted through the profile component, not the Plot route body

## Validation

Passed in this branch:

```bash
pnpm --filter web test -- source-account-switcher-lock.test.ts plot-ux-regression-lock.test.ts route-ux-consistency-lock.test.ts --runInBand
pnpm --filter web typecheck
pnpm run docs:lint
git diff --check
```

## Follow-Up

None required for this slice unless product design changes the expanded profile header layout. Source tooling remains owned by Source Dashboard/source routes.
