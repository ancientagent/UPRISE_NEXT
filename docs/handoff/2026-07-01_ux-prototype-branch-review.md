# UX Prototype Branch Review

Date: 2026-07-01
Branch: `docs/active-pm-ux-prototype-review`
Base: `main` at `ee171b5`
Mode: docs-only branch/worktree review

## Summary

Reviewed the remaining UX/prototype branches left in `docs/operations/ACTIVE_PM.md` after the resolver/onboarding, docs/audit, and Phase3 automation/runtime branch reviews.

No runtime code was merged, no branches were deleted, no worktrees were removed, and no product/design decisions were made. This pass only records which remaining UX branches are cleanup candidates, old generated batch output, or design/runtime reference branches that must be preserved until an explicit extraction/archive decision.

## Current Workspace Evidence

- `main` is clean at `ee171b5`.
- Open PR queue was empty at review time.
- Attached worktrees remain:
  - `/home/baris/UPRISE_NEXT/.worktrees/batch18` -> `feat/ux-batch18-prep`
  - `/home/baris/UPRISE_NEXT/.worktrees/batch19` -> `feat/ux-batch19-prep`
  - `/home/baris/UPRISE_NEXT_runtime` -> `phase3-no-automation-rollback`
  - `/home/baris/UPRISE_NEXT_uximpl` -> `ux-implementation`
  - `/home/baris/UPRISE_NEXT_uxmobile` -> `ux-mobile-r1-build`

## Branch Classifications

| Branch | HEAD | Unique commits vs `main` | Classification | Recommendation |
| --- | --- | ---: | --- | --- |
| `feat/ux-batch17` | `9fb382e` | 3 | Old UX/Reliant batch output. Includes queue/runtime files, Discover/Plot/RADIYO/statistics tests, Reliant script changes, and many March handoffs. | Do not merge wholesale. Preserve as historical batch-output/reference until a UX owner explicitly extracts or archives it. |
| `feat/ux-batch18-prep` | `629a39e` | 1 | Queue/prep-only branch for batch 18. Attached worktree. | Cleanup candidate after explicit worktree/branch removal approval; do not merge directly. |
| `feat/ux-batch18-run` | `77d2e26` | 3 | Old UX/Reliant batch run output. Includes queue/runtime files, Plot/Discover/player tests, Reliant automation edits, Social-hidden MVP note, and handoffs. | Do not merge wholesale. Preserve as historical batch-output/reference until a UX owner explicitly extracts or archives it. |
| `feat/ux-batch19-prep` | `7a66a72` | 2 | Queue/prep-only branch for batches 18/19. Attached worktree. | Cleanup candidate after explicit worktree/branch removal approval; do not merge directly. |
| `ux-mobile-r1-build` | `b59a63c` | 26 | Broad mobile-first UX prototype. Touches onboarding, Plot, community page, RADIYO player, subgenre range helper, mobile UX specs, and many March handoffs. Attached worktree. | Preserve as design/runtime reference. Requires explicit founder/design extraction decision before cleanup. |
| `ux-implementation` | `be4ddde` | 14 | Broad Plot/profile/player/source-dashboard prototype. Adds Plot UI state machine/store, player strip, profile expansion panel, artist dashboard prototype docs, and several spec edits. Attached worktree. | Preserve as design/runtime reference. Requires explicit founder/design extraction decision before cleanup. |

## Why Not Merge These Branches Directly

- All six branches are hundreds of commits behind current `main`.
- The broad UX branches modify active runtime paths such as `/plot`, onboarding, Discover, RADIYO/player components, and source-dashboard/artist-dashboard prototype surfaces.
- Current `main` already has newer Plot/Home Scene Roller, Archive/Event terminology, source/dashboard, activation, Release Deck, and PM/handoff work that these old snapshots do not know about.
- Wholesale merges would risk reintroducing stale Statistics/Social/old prototype assumptions or deleting newer current work through conflict resolution mistakes.

## Safe Follow-Up Options

1. Delete only the prep branches/worktrees after explicit approval:
   - `feat/ux-batch18-prep` and `/home/baris/UPRISE_NEXT/.worktrees/batch18`
   - `feat/ux-batch19-prep` and `/home/baris/UPRISE_NEXT/.worktrees/batch19`
2. Keep `feat/ux-batch17` and `feat/ux-batch18-run` as historical Reliant batch output unless a UX owner wants a targeted extraction.
3. Use `ux-mobile-r1-build` and `ux-implementation` as design-reference branches only. If useful ideas are extracted, do it through fresh small branches from current `main`, with current owner specs and regression locks.

## Validation

Docs-only review. Local validation for this branch:

```bash
pnpm run docs:lint # passed
git diff --check # passed
```

## Safety Confirmation

- No branch deletion.
- No worktree removal.
- No runtime code edits.
- No provider, database, schema, or art changes.
- No product/design decision made.
