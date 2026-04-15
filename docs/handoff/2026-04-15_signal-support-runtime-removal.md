# 2026-04-15 — Signal Support Runtime Removal

## Summary
Removed direct `SUPPORT` from the live signal contract and aligned Discover/admin/shared types to that narrower action grammar.

## What Changed
- `apps/api/src/signals/signals.controller.ts`
  - removed `POST /signals/:id/support`
- `apps/api/src/signals/signals.service.ts`
  - removed `supportSignal()`
- `packages/types/src/signal.ts`
  - removed `SUPPORT` from `SignalActionSchema`
- `packages/types/src/discovery.ts`
  - removed `support` from signal action counts
  - removed the `supportedNow` popular-singles lens
- `packages/types/src/admin.ts`
  - removed `support` from `signalActionTotals`
- `apps/api/src/communities/communities.service.ts`
  - removed support-count handling from signal action aggregation
  - removed the `supportedNow` Discover lens
- `apps/api/src/admin-analytics/admin-analytics.service.ts`
  - removed direct support totals from admin analytics aggregation
- `apps/web/src/app/discover/page.tsx`
  - removed the `Supported Now` rail toggle
- updated impacted tests and active docs/specs to match the new runtime contract

## Result
Live signal behavior is now:
- `ADD` / collect-save debt still present
- `BLAST`
- `RECOMMEND`
- no direct signal `SUPPORT`

Historical support/backing language remains documentation/analytics debt, not a live signal endpoint.

## Verification
- `pnpm --filter @uprise/types build`
- `pnpm --filter api test -- communities.discovery.service communities.discovery.controller admin-analytics signals.service`
- `pnpm --filter web test -- discovery-client`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `git diff --check`
