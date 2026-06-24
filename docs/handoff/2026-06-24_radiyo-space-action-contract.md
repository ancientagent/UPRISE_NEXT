# RADIYO vs SPACE Action Contract Tests

Date: 2026-06-24
Branch: `test/radiyo-space-action-contract`
Agent: Codex

## Summary

Added focused regression coverage for the current action grammar without changing runtime behavior:

- `RADIYO` wheel remains `Report`, `Skip`, `Play It Loud`, `Collect`, `Upvote`
- `RADIYO` explicitly excludes `Blast` and `Recommend`
- `SPACE` wheel remains `Back`, `Pause`, `Blast`, `Recommend`, `Next`
- `SPACE` explicitly excludes `Play It Loud` and `Upvote`
- `getEngagementWheelActions()` is locked to mode-specific action sets
- Artist Profile remains a no-wheel, no-`Blast` direct-listen surface
- Artist Profile still exposes row-level `Collect` and `Recommend`, with `Recommend` gated by collection/holding state

## Files Changed

- `apps/web/__tests__/engagement-wheel-contract.test.ts`
- `apps/web/__tests__/community-artist-page-lock.test.ts`
- `docs/CHANGELOG.md`

## Validation

Run during implementation:

```bash
pnpm --filter web test -- engagement-wheel-contract.test.ts plot-ux-regression-lock.test.ts community-artist-page-lock.test.ts
```

Pending before closeout:

```bash
pnpm --filter web typecheck
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
```

## Notes

- No runtime behavior changed in this slice.
- No API action semantics were changed.
- Feed inserts and Plot Events remain covered by existing static regression locks from the Plot shell hardening slice.
