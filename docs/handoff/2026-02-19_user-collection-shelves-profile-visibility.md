# User Collection Shelves + Profile Visibility (2026-02-19)

## Scope
Implemented typed collection shelves for signals, profile-level collection visibility controls, and user profile read surfaces in API + web.

## API Changes
- `apps/api/prisma/schema.prisma`
  - Added `User.collectionDisplayEnabled` (default false).
- `apps/api/src/common/constants/collection-shelves.ts`
  - Added fixed shelf list and signal-to-shelf mapper.
- `apps/api/src/signals/signals.service.ts`
  - `POST /signals/:id/add` now maps to typed shelves instead of a single `Personal` collection.
- `apps/api/src/users/users.service.ts`
  - Added `setCollectionDisplay(userId, enabled)`.
  - Added `getProfileWithCollection(viewerUserId, targetUserId)` with owner/public visibility rules.
- `apps/api/src/users/users.controller.ts`
  - Added `GET /users/:id/profile`.
  - Added `POST /users/me/collection-display`.

## Web Changes
- Added user profile page:
  - `apps/web/src/app/users/[id]/page.tsx`
  - Shows user info, collection shelves, and owner toggle for collection visibility.
- Wired feed actors to user profiles:
  - `apps/web/src/components/plot/SeedFeedPanel.tsx` now links actor names to `/users/:id`.

## Tests Added
- `apps/api/test/collection-shelves.test.ts`
- `apps/api/test/users.profile.collection.test.ts`

## Validation
- `cd apps/api && npx prisma generate`
- `pnpm --filter api test -- test/collection-shelves.test.ts --runInBand`
- `pnpm --filter api test -- test/users.profile.collection.test.ts --runInBand`
- `pnpm --filter api build`
- `pnpm --filter web build`

## Notes
- Collection visibility behavior:
  - Owner always sees collection shelves.
  - Non-owner sees collection only when `collectionDisplayEnabled=true`.
- No authority/governance behavior changed.
