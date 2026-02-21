# Artist/Band Identity Slice 9 Handoff: Invite Preview Endpoint (2026-02-20)

**Author:** Codex (GPT-5)  
**Scope:** Add public invite prefill endpoint for mobile/web onboarding before invite claim.

## Implemented
- Endpoint: `POST /auth/invite-preview`
- Service: `AuthService.previewInvite(dto)`
- Behavior:
  - validates invite token,
  - rejects claimed/existing-user/expired invites,
  - returns member profile prefill and registrar scene context.

## Tests
- `apps/api/test/auth.invite-registration.service.test.ts`
  - added preview success case,
  - added claimed-invite rejection case.

## Files
- `apps/api/src/auth/dto/invite-register.dto.ts`
- `apps/api/src/auth/auth.controller.ts`
- `apps/api/src/auth/auth.service.ts`
- `apps/api/test/auth.invite-registration.service.test.ts`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/system/registrar.md`
- `docs/CHANGELOG.md`

## Out of Scope
- Web/mobile invite claim UI implementation.
