# User.isArtist Deprecation Readiness

## Purpose
Provide a repeatable, low-risk process for retiring transitional `User.isArtist` usage after canonical Artist/Band identity migration is complete.

## Scope
- Tracks read-surface compatibility progress.
- Tracks in-repo call-site migration status.
- Does not authorize immediate schema removal.

## Current Compatibility Contract
- Keep `User.isArtist` as legacy compatibility field.
- User read surfaces expose:
  - `isArtist` (legacy)
  - `isArtistTransitional` (explicit deprecation-prep alias)
  - `hasArtistBand` (canonical linkage indicator)

## Readiness Command
Run:

```bash
pnpm run report:isartist-consumers
```

Optional machine-readable output:

```bash
pnpm run report:isartist-consumers -- --json
pnpm run report:isartist-consumers -- --out=artifacts/isartist-consumers.json
```

Strict guard mode (fails on unapproved legacy call sites):

```bash
pnpm run report:isartist-consumers:strict
```

`strict` mode currently allows legacy references only in:
- `apps/api/src/users/users.service.ts`
- `apps/web/src/app/users/[id]/page.tsx`
- `packages/types/src/user.ts`
- `apps/api/test/users.profile.collection.test.ts`

## Removal Gate Checklist
Only start destructive removal slices when all are true:

1. `report:isartist-consumers` shows no product/runtime dependencies on `isArtist` (test-only references may remain temporarily).
2. API/web consumers rely on canonical linkage (`hasArtistBand`) and/or explicit bridge (`isArtistTransitional`) where needed.
3. Specs are updated to mark the exact removal phase.
4. Rollback path is documented in handoff before migration PR merges.

## Recommended Removal Order
1. Freeze new `isArtist` usages (lint/review policy).
2. Migrate all runtime consumers to canonical/bridge fields.
3. Run one full QA sweep (`pnpm run verify` and DB-backed checks as needed).
4. Remove `isArtist` from read contracts.
5. Remove schema field in explicit destructive migration slice.

## Evidence Logging
For every deprecation progress slice, update:
- `docs/CHANGELOG.md`
- relevant spec(s)
- dated `docs/handoff/` note with command outputs
