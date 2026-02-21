# Artist/Band Identity Slice 8 Handoff: User Read Bridge Field (2026-02-20)

**Author:** Codex (GPT-5)  
**Scope:** Add non-breaking bridge field for caller migration from `User.isArtist` to canonical Artist/Band membership.

## Implemented
- User read surfaces now include `hasArtistBand`:
  - `GET /users/:id`
  - `GET /users/:id/profile`
- `hasArtistBand` is derived from canonical `ArtistBandMember` count for that user.
- `User.isArtist` remains unchanged for compatibility.

## Tests
- `apps/api/test/users.profile.collection.test.ts`
  - now asserts `hasArtistBand` for both false/true scenarios.

## Files
- `apps/api/src/users/users.service.ts`
- `apps/api/test/users.profile.collection.test.ts`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/CHANGELOG.md`

## Out of Scope
- Removal of `User.isArtist`.
- Full caller migration across all consumers.
