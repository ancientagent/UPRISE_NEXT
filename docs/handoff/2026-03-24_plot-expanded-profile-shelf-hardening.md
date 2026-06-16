# 2026-03-24 — Plot expanded profile shelf hardening

## Summary
- Replaced the remaining mock/placeholder expanded `/plot` collection surfaces with current repo-backed collection shelf reads where the contract already exists.
- Added conditional expanded-header status cards for `Band Status` and `Promoter Status`.
- Fixed the empty submitter path in `GET /registrar/promoter/entries` so the new Plot promoter-status read does not 500 on users with no promoter registrations.

## Files changed
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `apps/api/src/registrar/registrar.service.ts`
- `apps/api/test/registrar.service.test.ts`

## What changed
- `/plot` now reads the authenticated current user's profile collection via `GET /users/:id/profile` and uses the returned `collectionShelves` to back:
  - `Singles/Playlists`:
    - real `singles` shelf items drive Collection-mode entry
    - playlist grouping remains an explicit empty-state note because the repo does not expose playlist grouping data yet
  - `Events`:
    - real `fliers` shelf items render instead of the previous placeholder summary block
  - `Merch`:
    - real counts/first-item summaries render for `posters`, `merch_shirts`, `merch_patches`, and `merch_buttons`
    - signed-out state now shows an explicit auth gate instead of implying an empty collection
  - `Saved Uprises`:
    - real `uprises` shelf items render instead of a placeholder paragraph
- Expanded header now uses conditional cards for:
  - `Band Status` from linked artist-band identities or registrar summary fallback
  - `Promoter Status` from promoter registration/capability reads
- `GET /registrar/promoter/entries` now short-circuits cleanly on the empty-entry path instead of falling through to the code/grant join queries and returning `500`.

## Verification
- `pnpm --filter web test -- --runInBand __tests__/plot-ux-regression-lock.test.ts`
- `pnpm --filter web typecheck`
- `pnpm --filter api test -- registrar.service.test.ts --runInBand`
- `pnpm --filter api typecheck`
- direct API verification:
  - `GET /registrar/promoter/entries` returns `{ total: 0, countsByStatus: {}, entries: [] }` for a new submitter-owned account
  - `GET /users/:id/profile` returns the expected empty collection shelf structure
- Playwright CLI live pass:
  - verified authenticated `/plot` remains stable with seeded `auth-storage` + `onboarding-storage`
  - verified the route no longer hard-fails on the promoter-status read itself

## Residual queue
- `Photos` remains an explicit placeholder because the repo still does not expose a clean saved photography shelf/path for Plot.
- `Saved Promos/Coupons` remains an explicit placeholder because the repo exposes active scene promotions, not saved promo/coupon collection data with status + expiration.
- Playlist groupings remain a clear empty-state note because the repo exposes `singles` shelves but not playlist grouping persistence.
- Playwright signed-in live QA still hits the known `localhost` vs `127.0.0.1` dev-origin mismatch for some browser-side API calls; I treated direct API responses and targeted source/test locks as the authoritative runtime evidence for authenticated collection reads in this slice.
