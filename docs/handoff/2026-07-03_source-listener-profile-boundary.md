# Source / Listener Profile Boundary Hardening

Date: 2026-07-03
Branch: `test/source-listener-profile-boundary`
Base: `main` @ `25e06a2`
Scope: UPRISE Development Plan R1 Task 11

## Summary

Task 11 was completed as a focused tests/docs hardening slice. Runtime already kept source-management tools in the source-dashboard / artist-owned route seams, so this branch adds stronger regression locks instead of changing behavior.

The lock now distinguishes the allowed listener-profile seam from source-admin tools:

- the expanded listener profile may show source identity access for users with managed Artist/Band entities;
- that source identity access may route to `/source-dashboard`;
- Release Deck, Print Shop, Registrar source-admin controls stay out of the listener profile body;
- listener-facing user profiles remain collection/read surfaces with artist links, not source-dashboard, source-admin, or listener-to-artist DM surfaces.

## Files Changed

- `apps/web/__tests__/source-account-switcher-lock.test.ts`
- `apps/web/__tests__/route-ux-consistency-lock.test.ts`
- `docs/operations/ACTIVE_PM.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-07-03_source-listener-profile-boundary.md`

## Product Boundaries Preserved

- Source Dashboard remains the source-side operating shell.
- Listener profile remains the listener collection/profile workspace.
- Source account access in the listener profile is a bridge to Source Dashboard, not embedded source tooling.
- `/users/[id]` remains a listener collection/read profile route.
- Direct listener-to-artist DM affordances remain rejected.
- Registrar remains the listener-to-source formalization path and is not embedded in the listener collection body.

## Runtime Impact

None. This branch changes tests and execution-state/docs only.

No provider, database, schema, migration, art, or environment state was touched.

## Validation

Passed:

```bash
pnpm --filter web test -- source-dashboard-shell-lock.test.ts source-account-switcher-lock.test.ts plot-ux-regression-lock.test.ts route-ux-consistency-lock.test.ts --runInBand
pnpm --filter web typecheck
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```

## Notes

Draft PR #212 (`docs/linear-clean-context-agent-roles`) is intentionally preserved and registered so workspace audit can pass without merging or closing that lower-priority process branch.

## Next Signal

Start Task 12 after this branch is pushed/PR'd or merged: Print Shop source-facing event path.
