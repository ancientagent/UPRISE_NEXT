# 2026-04-12 Source Dashboard And Signal Contract

## Summary
- Added the first explicit source-side dashboard shell at `/source-dashboard`.
- Shifted Plot source switching into that dashboard instead of jumping straight into a public artist page.
- Added active source-context visibility to `/print-shop`.
- Consolidated current MVP signal-system rules into one implementation-facing contract.

## What Changed
### Runtime
- Added `apps/web/src/app/source-dashboard/page.tsx`
  - source dashboard header
  - source account switcher reuse
  - active source context panel
  - live tool cards for:
    - Source Profile
    - Print Shop
    - Registrar
- Updated `apps/web/src/app/plot/page.tsx`
  - `Source Accounts` now route to `/source-dashboard`
- Updated `apps/web/src/app/print-shop/page.tsx`
  - now renders `Source Context`
  - shows the active source account when selected
  - keeps event-write copy honest by describing operator context instead of stored source ownership
- Updated `apps/web/src/app/artist-bands/[id]/page.tsx`
  - linked members can now jump into `Source Dashboard` as well as `Open Print Shop`

### Docs
- Added `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
- Added `docs/solutions/MVP_SIGNAL_SYSTEM_CONTRACT_R1.md`
- Updated:
  - `docs/solutions/MVP_ACCOUNT_SOURCE_SIGNAL_SYSTEM_PLAN_R1.md`
  - `docs/specs/core/signals-and-universal-actions.md`
  - `docs/specs/economy/print-shop-and-promotions.md`
  - `docs/specs/users/identity-roles-capabilities.md`

## Why
- The one-account / many-source model needed a real source-side shell, not just route bridges.
- Print Shop needed to acknowledge source operating context without overpromising backend ownership semantics.
- Source and signal behavior were still distributed across multiple locks/specs and easy to conflate during implementation.

## Verified
- `pnpm --filter web test -- source-account-context source-account-switcher-lock source-dashboard-shell-lock route-ux-consistency-lock plot-ux-regression-lock community-artist-page-lock`
- `pnpm --filter web typecheck`
- `pnpm run verify`
- `git diff --check`

## Live Browser QA
Using Chrome DevTools MCP against the live local app:
- `/plot`
  - `Source Accounts` rendered
  - selecting `Youngblood QA Source` routed into `/source-dashboard`
- `/source-dashboard`
  - active source context rendered correctly
  - tool cards rendered for `Source Profile`, `Print Shop`, `Registrar`
  - `Return to Listener Account` cleared source context and routed back to `/plot`
- `/print-shop`
  - preserved active source context from the dashboard
  - rendered the new `Source Context` block
  - no console errors during the flow

## Follow-Up
- Carry active source context more broadly across creator-side routes as they become real.
- Use `MVP_SIGNAL_SYSTEM_CONTRACT_R1.md` as the implementation reference before widening flyer/event signal actions.
