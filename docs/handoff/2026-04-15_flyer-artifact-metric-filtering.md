# 2026-04-15 — Flyer Artifact Metric Filtering

## Summary
Tightened community Discover/statistics reads so flyer-typed rows do not leak into signal recommendation or activity metrics.

## What Changed
- `apps/api/src/communities/communities.service.ts`
  - recommendation actions now exclude `signal.type = 'flyer'` at query time
  - recommendation projection also defensively ignores flyer rows if one slips through
  - `activityScore` now excludes flyer-typed signal actions
- `apps/api/test/communities.discovery.service.test.ts`
  - added regression coverage proving flyer recommendations are excluded
- `apps/api/test/communities.statistics.service.test.ts`
  - added coverage proving community activity score queries exclude flyer rows

## Result
Discover/community signal metrics stay aligned to the action matrix:
- flyers remain event-bound artifacts
- recommendations stay limited to actual signal rows
- community activity score no longer counts flyer actions as signal activity

## Verification
- `pnpm --filter api test -- communities.discovery.service communities.statistics.service`
- `pnpm --filter api typecheck`
- `git diff --check`
