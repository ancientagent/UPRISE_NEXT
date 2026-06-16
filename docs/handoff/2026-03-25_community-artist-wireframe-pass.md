# 2026-03-25 Community + Artist Wireframe Pass

## Summary
Applied the shared wireframe-style utility system to `/community/[id]` and `/artist-bands/[id]` so they now read as part of the same web product as `/plot` and `/discover`, while preserving their existing route behavior and founder-locked contracts.

## What Changed
### `/community/[id]`
- Moved the route onto the shared wireframe shell.
- Reframed the page into:
  - community header
  - state/context strip
  - metric row
  - community details block
  - action block
  - recent activity panel
- Kept the explicit `Visit Scene in Plot` handoff behavior intact.
- Preserved signed-out terminal-state behavior.

### `/artist-bands/[id]`
- Moved the route onto the shared wireframe shell.
- Preserved the founder-locked familiar profile-page structure while updating the visual system.
- Kept core sections intact:
  - identity header
  - action row
  - songs/releases
  - artist info
  - lineup
  - events
  - optional selected-track playback block
- Preserved artist/single playback handoff behavior.
- Preserved signed-out terminal-state behavior.

### Regression coverage
- Added `apps/web/__tests__/community-artist-page-lock.test.ts` to lock the shared wireframe shell on both routes while preserving the critical route sections/CTAs.

## Files
- `apps/web/src/app/community/[id]/page.tsx`
- `apps/web/src/app/artist-bands/[id]/page.tsx`
- `apps/web/__tests__/community-artist-page-lock.test.ts`
- `docs/CHANGELOG.md`

## Verification
- `pnpm --filter web test -- --runInBand __tests__/route-ux-consistency-lock.test.ts __tests__/community-artist-page-lock.test.ts __tests__/discover-page-lock.test.ts`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`

## Live QA
- Verified signed-in `/community/[id]` using a temporary local auth session and seeded onboarding context.
- Verified signed-in `/artist-bands/[id]` using the same temporary auth session.
- Confirmed the new shells render correctly while preserving:
  - community identity
  - `Visit Scene in Plot`
  - artist follow/add/blast/support action row
  - released songs section
  - familiar artist profile structure

## Notes
- This pass reused the existing wireframe primitives rather than introducing new route-specific style tokens.
- No spec conflict was encountered in this slice.
