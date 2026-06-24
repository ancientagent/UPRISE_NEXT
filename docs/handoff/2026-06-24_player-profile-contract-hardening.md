# 2026-06-24 — Player/Profile Contract Hardening

Branch: `feat/player-profile-contract-hardening`
Mode: tests/docs hardening only
Runtime changed: no

## Summary

Recreated the player/profile contract-hardening slice in the real UPRISE repo after receiving the external-agent handoff. Current runtime already matched the active player/profile pull-down truth, so this branch only adds regression coverage and a changelog entry.

The guarded current behavior is:

- Listener profile expands in-place from `/plot`; it is not opened through `/users/[id]` route navigation.
- The player supports and is wired to `profile-bottom` placement while the listener profile is expanded.
- The expanded listener profile replaces Plot tabs/body and collapse restores the Plot tab/body branch.
- Source management controls are excluded from the expanded listener profile branch.
- `/users/[id]` remains a listener profile / collection read surface, not a source-dashboard tooling surface.
- Artist Page/Profile remains separate from the listener profile pull-down seam.
- `/source-dashboard` remains the source tooling surface.

## Files Changed

- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `apps/web/__tests__/route-ux-consistency-lock.test.ts`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-24_player-profile-contract-hardening.md`

## Runtime Evidence Checked

- `apps/web/src/app/plot/page.tsx` owns `profilePanelState`, `isProfileExpanded`, `playerPanel`, `placement={isProfileExpanded ? 'profile-bottom' : 'top'}`, `data-slot="expanded-profile-player-strip"`, and `Return to Plot Tabs`.
- The expanded profile branch contains listener collection sections and does not contain `SourceAccountSwitcher`, `Source Dashboard`, `Release Deck`, `Print Shop`, or `Registrar` controls.
- `apps/web/src/app/users/[id]/page.tsx` contains `User Profile`, `Collection Display`, `Collection`, and linked artist/band entities, but no source tooling controls.
- `apps/web/src/app/artist-bands/[id]/page.tsx` is the public Artist Page/Profile and does not contain the listener pull-down seam or expanded-profile player strip.
- `apps/web/src/app/source-dashboard/page.tsx` remains the source-facing tooling surface.

## Validation

Run for this slice:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts source-dashboard-shell-lock.test.ts route-ux-consistency-lock.test.ts source-account-switcher-lock.test.ts
pnpm --filter web typecheck
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
```

## Remaining Notes

No blocking gaps remain for this tests/docs slice. A future component-level interaction test can be added when the web test harness has stable React rendering around auth/store/API mocks; current coverage follows the repo's existing static regression-lock style.
