# UX-IMPL-540A — Community Subgenre Range Copy

## Scope
Replace description-style community metadata with subgenre range coverage copy.

## Files Changed
- `apps/web/src/lib/community/subgenre-range.ts`
- `apps/web/src/app/discover/page.tsx`
- `apps/web/src/app/community/[id]/page.tsx`
- `docs/CHANGELOG.md`

## Changes
- Added shared mapper `getCommunitySubgenreRange(musicCommunity)`.
- Discover city-scene cards now show:
  - `Subgenre range: <mapped range>`
- Community profile header now shows subgenre range instead of description text.

## Verify Commands
```bash
pnpm --filter web typecheck && pnpm run infra-policy-check
```

## Verify Result
- Passed (`web typecheck`, `infra-policy-check`).
