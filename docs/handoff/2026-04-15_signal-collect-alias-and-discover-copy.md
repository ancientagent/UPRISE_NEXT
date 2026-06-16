# 2026-04-15 — Signal Collect Alias And Discover Copy

## Summary
Added a public `Collect` alias for signal-save actions and switched active Discover UI copy to the `Collect` verb while preserving legacy `/signals/:id/add` compatibility.

## What Changed
- `apps/api/src/signals/signals.controller.ts`
  - added `POST /signals/:id/collect` as a compatibility alias to the existing collection-save path
  - kept `POST /signals/:id/add` intact for runtime compatibility
- `apps/web/src/app/discover/page.tsx`
  - switched Discover signal/recommendation cards from `Add` to `Collect`
  - updated Discover action handlers to post `collect`
  - updated success copy to `Signal collected.`
- `docs/specs/core/signals-and-universal-actions.md`
  - made `/signals/:id/collect` the preferred public endpoint
  - documented `/signals/:id/add` as the legacy compatibility alias
- `docs/solutions/MVP_FLOW_MAP_R1.md`
  - updated the core action flow to describe public `Collect` plus legacy `ADD` compatibility
- `docs/solutions/MVP_DISCOVER_CONTRACT_CHECKLIST_R1.md`
  - updated the active Discover contract checklist to the public `Collect` endpoint and documented remaining `ADD` row debt

## Result
The public-facing signal-save verb is now `Collect` in active Discover surfaces and docs, while the older `/signals/:id/add` path remains available as a compatibility bridge.

## Verification
- `pnpm --filter @uprise/types build`
- `pnpm --filter api test -- communities.discovery.service communities.discovery.controller admin-analytics signals.service`
- `pnpm --filter web test -- discovery-client`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `git diff --check`
