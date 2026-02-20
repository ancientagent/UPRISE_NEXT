# Artist/Band Identity Slice 7 Handoff: Invite Status Read Surface (2026-02-20)

**Author:** Codex (GPT-5)  
**Scope:** Add submitter-facing API to read registrar invite roster/status.

## Implemented
- Endpoint: `GET /registrar/artist/:entryId/invites`
- Service method: `getArtistBandInviteStatus(userId, entryId)`
- Behavior:
  - validates entry exists, type is `artist_band_registration`, and ownership matches submitter,
  - returns member roster rows,
  - returns status summary counts by `inviteStatus`.

## Tests
- `apps/api/test/registrar.service.test.ts`
  - added invite summary behavior assertion.

## Files
- `apps/api/src/registrar/registrar.controller.ts`
- `apps/api/src/registrar/registrar.service.ts`
- `apps/api/test/registrar.service.test.ts`
- `docs/specs/system/registrar.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/CHANGELOG.md`

## Out of Scope
- UI status page rendering.
- Delivery worker/provider integration.
