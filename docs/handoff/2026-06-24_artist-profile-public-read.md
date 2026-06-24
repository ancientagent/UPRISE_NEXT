# 2026-06-24 Artist Profile Public Read

## Status

Implemented on branch `fix/artist-profile-public-read`.

## Why

The launch audit flagged a contradiction: active docs describe Artist Profile as a public source page and direct-listen/discovery surface, but the current web route blocked profile loading when no auth token existed and the API controller applied `JwtAuthGuard` at class scope.

## Changed

- `apps/api/src/artist-bands/artist-bands.controller.ts`
  - Changed `GET /artist-bands/:id/profile` to use `OptionalJwtAuthGuard`.
  - Passed `viewerUserId` only when a signed-in viewer exists.
  - Kept `GET /artist-bands/:id` and `GET /artist-bands` auth-gated.
- `apps/web/src/lib/artist-bands/client.ts`
  - Made the profile token optional.
- `apps/web/src/app/artist-bands/[id]/page.tsx`
  - Removed the signed-in-only hard stop for viewing Artist Profile.
  - Signed-out users can now load the public profile, direct-listen rows, official links, members, and event read sections.
  - Follow, Collect, Recommend, and source-management links remain token/member gated by existing conditions.
- Tests
  - Added API controller coverage for signed-out profile reads and signed-in viewer context.
  - Added web client coverage for no-token profile fetches.
  - Added route lock coverage preventing the signed-in-only page gate from returning.
- `docs/CHANGELOG.md`
  - Added this slice to Unreleased.

## Current Contract

- Artist Profile is a public source page and direct-listen/discovery surface outside `RADIYO`.
- Signed-out users can read the profile and play public track URLs exposed by the profile response.
- Viewer-specific collection/recommendation state is included only for signed-in viewers.
- Follow, Collect, Recommend, Release Deck, Print Shop, Registrar, and Source Dashboard operations remain signed-in and/or source-member gated.
- Artist Profile still has no engagement wheel and no Blast.

## Validation

Passed:

```bash
pnpm --filter api test -- artist-bands.controller.test.ts artist-bands.service.test.ts
pnpm --filter web test -- artist-band-client.test.ts community-artist-page-lock.test.ts route-ux-consistency-lock.test.ts
pnpm --filter api typecheck
pnpm --filter web typecheck
```

Pending before PR/merge closeout:

```bash
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
```

## Notes

This slice does not make source-dashboard, Release Deck, Print Shop, Registrar, Follow, Collect, or Recommend public. It only aligns profile read access with the active public Artist Profile contract.
