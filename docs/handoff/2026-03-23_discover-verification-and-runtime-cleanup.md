# Discover Verification And Runtime Cleanup

## Branch
- `feat/ux-founder-locks-and-harness`

## What Was Verified
- Discover Uprise travel hydrates with real fixture communities.
- `Retune` updates the active scene and visitor state correctly.
- `Visit [Community Name]` from Discover navigates into the expected `/community/[id]` route.
- Local Discover artist results route to `/artist-bands/:id`.
- Local Discover song results route to `/artist-bands/:id?trackId=...`.
- Artist page single-entry autoplay works and renders the expected streaming state.
- Recommendations, Trending, and Top Artists populate from real runtime/API fixtures.

## Runtime Fixtures Used
- Austin Punk Home Scene user
- Nashville Punk comparison scene
- one materialized artist-band in Austin Punk
- one scene-scoped signal with recommend/blast actions
- one direct DB track fixture for song-link verification

## Cleanup Added
- `/registrar` now shows an explicit sign-in-required state for entry history when no token is present instead of a false empty state.
- `apps/web/src/app/favicon.ico` now exists so route-level QA is not polluted by missing favicon noise.

## Notes
- Host-shell `curl` to the dev ports was intermittently unreliable in this environment even while the browser and dev servers were functioning. Browser-based verification was used as the authority for live route behavior.
- Full track creation still has no shipped runtime creation path; the song-link verification still depends on a minimal direct DB fixture.
