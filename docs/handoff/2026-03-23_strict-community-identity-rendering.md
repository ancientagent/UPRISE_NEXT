# Strict Community Identity Rendering (2026-03-23)

## Purpose
Remove the remaining partial community-identity rendering paths so Discover and artist-profile surfaces only render community identity from the full `city + state + music community` tuple.

## Changes
- Updated `apps/web/src/app/discover/page.tsx` so `formatCommunityIdentity` only renders a label when all three identity fields are present; otherwise it falls back to `Community identity unavailable.`
- Removed the generic disabled `Visit Community` button from Discover when no resolved community target exists.
- Updated `apps/web/src/app/artist-bands/[id]/page.tsx` so Home Scene rendering also requires the full identity tuple instead of degrading to partial labels.

## Verification
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
