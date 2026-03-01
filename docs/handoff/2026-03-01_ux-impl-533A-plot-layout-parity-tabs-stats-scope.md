# UX-IMPL-533A — Plot Layout Parity (Tier-in-Player, Centered Tabs, Stats Scoping)

## Scope
Implement the next mobile-first UX/UI slice on `/plot`:
- Move `City / State / National` context controls into the player shell.
- Remove separate tier strip outside the player.
- Keep tab controls centered as a compact rail.
- Scope `Top Songs` and `Scene Activity Snapshot` to `Statistics` only.
- Preserve route stability and avoid adding new CTA flows.

## Files Changed
- `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
- `apps/web/src/app/plot/page.tsx`
- `docs/CHANGELOG.md`

## Notes
- Added tier selector support to `RadiyoPlayerPanel` (`PlayerTier`, `selectedTier`, `onTierChange`).
- Removed registrar-summary fetch coupling from `plot/page.tsx` for this UI slice and kept expanded profile panel focused on current mode/tier state.
- `TopSongsPanel` and `Scene Activity Snapshot` now render only under the `Statistics` tab content block.
- Community card and existing tab content routes remain intact.

## Verify Command (exact)
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck
```

## Verify Result
- Passed (`docs:lint`, `infra-policy-check`, `web typecheck`).
