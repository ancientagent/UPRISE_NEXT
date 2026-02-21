# Artist/Band Identity Slice 3 Handoff: Registrar Intake Member Capture (2026-02-20)

**Author:** Codex (GPT-5)  
**Scope:** Expand registrar artist submission contract with GPS gate and member/invite persistence.

## Canon/Spec Authorization
- `docs/canon/Master Narrative Canon.md`
  - `7.3 Registrar Scope`: Home Scene-bound civic interface.
  - `7.4 Registrable Actions (V1)`: Artist/Band registration via Registrar.
- `docs/specs/system/registrar.md` (`SYS-REGISTRAR`)
- `docs/specs/users/identity-roles-capabilities.md` (`USER-IDENTITY`)

## Implemented
- `POST /registrar/artist` now enforces `gpsVerified = true` for submitter.
- DTO expanded to include `members[]` entries:
  - `name`, `email`, `city`, `instrument`.
- New persistence model for intake roster:
  - `RegistrarArtistMember` in `apps/api/prisma/schema.prisma`
  - migration `apps/api/prisma/migrations/20260220170000_add_registrar_artist_members/migration.sql`
- Service behavior:
  - detects existing users by member email,
  - stores `inviteStatus = existing_user` for known users,
  - stores `inviteStatus = pending_email` for non-platform users.

## API Response Additions
`POST /registrar/artist` now returns:
- `memberCount`
- `existingMemberCount`
- `pendingInviteCount`

## Out of Scope (deferred)
- Outbound email delivery implementation for `pending_email` rows.
- Invite claim/password bootstrap endpoints.
- Automatic materialization of `ArtistBand` from submission entry.

## Risk Notes
- Invite flow currently persists state only; without delivery worker, pending invites are not dispatched yet.
- Home Scene comparison remains normalized text match (`city/state/musicCommunity`) in this slice.

## Files
- `apps/api/src/registrar/dto/registrar.dto.ts`
- `apps/api/src/registrar/registrar.service.ts`
- `apps/api/test/registrar.service.test.ts`
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260220170000_add_registrar_artist_members/migration.sql`
- `docs/specs/system/registrar.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/CHANGELOG.md`
