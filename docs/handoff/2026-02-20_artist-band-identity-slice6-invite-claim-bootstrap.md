# Artist/Band Identity Slice 6 Handoff: Invite Claim Bootstrap (2026-02-20)

**Author:** Codex (GPT-5)  
**Scope:** Allow invited non-platform registrar members to create accounts via invite token.

## Implemented
- Endpoint: `POST /auth/register-invite`
- DTO: `RegisterFromInviteSchema`
- Service behavior (`AuthService.registerFromInvite`):
  - validates invite token + expiry + email match,
  - blocks already-claimed or existing-platform-user invite records,
  - creates user with Home Scene defaults from registrar scene context,
  - sets `gpsVerified=false` (voting still GPS-gated),
  - marks registrar member row `inviteStatus=claimed` + `claimedUserId` linkage,
  - returns auth tokens.

## Files
- `apps/api/src/auth/dto/invite-register.dto.ts`
- `apps/api/src/auth/auth.controller.ts`
- `apps/api/src/auth/auth.service.ts`
- `apps/api/src/users/users.service.ts`
- `apps/api/test/auth.invite-registration.service.test.ts`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/system/registrar.md`
- `docs/CHANGELOG.md`

## Out of Scope
- Invite email provider dispatch worker.
- Mobile/web UI flows for invite claim entry.
