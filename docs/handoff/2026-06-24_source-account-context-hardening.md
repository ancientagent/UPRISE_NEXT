# 2026-06-24 Source Account Context Hardening

## Status

Implemented on branch `fix/source-account-context-hardening`.

## Why

The launch audit called out Source Dashboard as the MVP stand-in for a future separate source/admin surface. Source tools already validated managed sources after loading the signed-in user's profile, but the persisted web store only carried `activeSourceId`. That allowed stale or legacy source context to survive user/session changes until each route loaded enough profile data to reject it.

## Changed

- `apps/web/src/store/source-account.ts`
  - Added `activeSourceUserId` beside `activeSourceId`.
  - `setActiveSourceId(sourceId, userId)` now stores the selected source with the signed-in owner.
  - `clearActiveSourceId()` clears both fields.
- `apps/web/src/components/source/SourceAccountSwitcher.tsx`
  - Requires `currentUserId` from callers.
  - Treats a persisted source as active only when `activeSourceUserId === currentUserId`.
- Source routes
  - `/source-dashboard`, `/source-dashboard/release-deck`, `/print-shop`, and `/registrar` clear stale or legacy persisted source context when the stored owner does not match the current signed-in user.
  - Print Shop only attaches `artistBandId` when the active source context belongs to the current user.
- Artist Profile
  - Source-tool handoff links now stamp the active source with the current user ID.
  - The source-context matched state now requires both source ID and user ID to match.
- Tests
  - Store test now locks source ID + user ID storage and clearing.
  - Source switcher and route static locks now require user-scoped context and stale-context cleanup.
- Docs
  - Updated the active Artist/Profile Source Dashboard brief and changelog.

## Current Contract

- Source Dashboard remains separate from listener profile / collection workspace.
- Source context is operator context, not listener identity replacement.
- A persisted source ID is valid only for the current signed-in user.
- Stale source IDs from a prior user/session must clear before source-side tools operate.
- Release Deck, Print Shop, and Registrar remain signed-in/source-context surfaces; this slice does not make them public and does not add new source tools.

## Validation

Planned:

```bash
pnpm --filter web test -- source-account-context.test.ts source-account-switcher-lock.test.ts source-dashboard-shell-lock.test.ts route-ux-consistency-lock.test.ts community-artist-page-lock.test.ts
pnpm --filter web typecheck
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
```

## Notes

This slice is intentionally web-side and context-scoped. Backend ownership validation remains the authority for actual source writes. The web store change prevents stale UI context from carrying a source selection across user/session boundaries before those backend checks are reached.
