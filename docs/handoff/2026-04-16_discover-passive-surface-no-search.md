# 2026-04-16 — Discover Passive Surface / No Search

## What changed
- Removed the local artist/song search section and its client-side query wiring from `apps/web/src/app/discover/page.tsx`.
- Reframed Discover as a passive community-reading surface:
  - player/marquee
  - travel
  - Popular Singles
  - Recommendations
- Replaced the old search section with a smaller context panel that explicitly says community-native lookup belongs on the community page.
- Reconciled active Discover doctrine so the repo no longer teaches search as a core Discover job.

## Files changed
- `apps/web/src/app/discover/page.tsx`
- `apps/web/__tests__/discover-page-lock.test.ts`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/SURFACE_CONTRACT_DISCOVER_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`

## Why
Visitors do not arrive on Discover knowing names. Search made Discover depend on prior knowledge instead of making the community legible.

The better split is:
- Discover = passive community reading and scoped travel
- community page = community-native lookup and adjacent process tooling

## Follow-up
- If community-native lookup is implemented later, it should land on `apps/web/src/app/community/[id]/page.tsx` or an adjacent community-scoped surface rather than returning to Discover.
