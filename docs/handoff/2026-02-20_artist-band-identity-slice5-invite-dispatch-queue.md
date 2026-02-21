# Artist/Band Identity Slice 5 Handoff: Invite Dispatch Queue Primitives (2026-02-20)

**Author:** Codex (GPT-5)  
**Scope:** Queue non-platform band-member invites from registrar submissions.

## Implemented
- Endpoint: `POST /registrar/artist/:entryId/dispatch-invites`
- Service: `dispatchArtistBandInvites(userId, entryId, links)`
- Behavior:
  - Submitter-only action (entry ownership enforced).
  - Reads pending non-platform members from `registrar_artist_members`.
  - Generates invite token + expiry (14 days) per pending member.
  - Updates member invite status to `queued`.
  - Upserts queued delivery payload rows in `registrar_invite_deliveries`.

## Schema/Migration
- `RegistrarArtistMember` additions:
  - `inviteToken`, `inviteTokenExpiresAt`, `claimedUserId`
- New model:
  - `RegistrarInviteDelivery`
- Migration:
  - `apps/api/prisma/migrations/20260220183000_add_registrar_invite_delivery/migration.sql`

## Out of Scope
- Actual outbound SMTP/provider delivery worker.
- Invite claim/password completion endpoint.

## Files
- `apps/api/src/registrar/registrar.controller.ts`
- `apps/api/src/registrar/registrar.service.ts`
- `apps/api/src/registrar/dto/registrar.dto.ts`
- `apps/api/test/registrar.service.test.ts`
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260220183000_add_registrar_invite_delivery/migration.sql`
- `docs/specs/system/registrar.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/CHANGELOG.md`
