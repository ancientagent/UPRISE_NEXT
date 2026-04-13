# 2026-04-13 — Release Deck Source Context Continuity

## Goal
Bring `Release Deck` up to the same source-shell continuity standard as `Source Dashboard`, `Registrar`, and `Print Shop` without widening the release feature itself.

## What Changed
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
  - Added a `Current Context` panel for the active source.
  - Added direct return paths to:
    - listener mode (`/plot`)
    - `Source Dashboard`
    - `Registrar`
    - public source profile
  - Clarified current ownership truth:
    - tracks are still created by the signed-in user
    - source association is currently recognized through active source context
- `apps/web/src/app/source-dashboard/page.tsx`
  - Changed `Return to Listener Account` to a real `/plot` link that clears source context on click, so route transition wins reliably.
- `apps/web/__tests__/release-deck-shell-lock.test.ts`
  - Locked current-context and return-path expectations.
- `apps/web/__tests__/route-ux-consistency-lock.test.ts`
  - Locked the source-recognition wording and registrar return path on `Release Deck`.
- `apps/web/__tests__/source-dashboard-shell-lock.test.ts`
  - Continued coverage for the corrected listener-return path on the dashboard shell.
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
  - Clarified that Release Deck should preserve source-side shell continuity instead of behaving like a detached route.

## Why
- `Release Deck` was functionally working, but it still looked thinner than the rest of the source-side system.
- Live QA also caught a real navigation bug:
  - `Return to Listener Account` cleared source context before the route transition won
  - the page fell into its own empty-state instead of reliably returning to `/plot`
- Switching the return controls to real links with source-context clear on click fixes the navigation path cleanly.

## Verification
- `pnpm --filter web test -- source-dashboard-shell-lock release-deck-shell-lock route-ux-consistency-lock`
- `pnpm --filter web typecheck`
- Chrome DevTools MCP:
  - verified `Release Deck` shows active source context
  - verified `Open Registrar` is present from `Release Deck`
  - verified `Return to Listener Account` on `Release Deck` returns to `/plot`
  - verified `Return to Listener Account` on `Source Dashboard` returns to `/plot`
  - verified no console warnings/errors

## Outcome
- `Release Deck` now reads as part of the same source operating shell instead of a bare creator form.
- Listener return/navigation is now stable across the source-side shell.
