# Avatar Profile Onboarding Source Map

Status: execution reference

## Product Authority

- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/system/registrar.md`
- `docs/specs/users/artist-profile-and-source-dashboard.md`

## Founder Evidence

- `docs/founder-sessions/2026-07-26_registrar-account-profile-avatar-onboarding.md`
- `docs/founder-sessions/2026-07-26_photo-guided-avatar-promotional-wearables.md`
- `docs/founder-sessions/2026-07-30_avatar-starter-outfit-and-punk-gear.md`

## Art And Design Evidence

- `art/avatar-system/README.md`
- `art/avatar-system/specifications/avatar-system-contract-r2.md`
- `art/avatar-system/specifications/photo-guided-avatar-and-promotional-wearables-design-spec.md`
- `art/avatar-system/rounds/03-professional-specification/stylized-punk-character-sheet-r3/`

## Preserved Runtime Evidence

`implementation/runtime-spike/` retains:

- the experimental Nest `avatar-lab` module;
- the two draft Prisma migrations;
- the camera test surface and Registrar tutorial;
- focused prototype tests;
- `tracked-integration.patch`, containing the removed schema, module, profile,
  onboarding, and Registrar integration edits.

These files are not compiled or shipped from this package.
