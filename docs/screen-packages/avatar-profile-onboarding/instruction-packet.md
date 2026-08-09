# Avatar Profile Onboarding Instruction Packet

Status: blocked implementation packet

## Purpose

Preserve and evaluate the photo-guided avatar/profile-onboarding experiment
without treating prototype code as product authority.

## Read First

1. `AGENTS.md`
2. `docs/PLATFORM_START_HERE.md`
3. `docs/specs/users/identity-roles-capabilities.md`
4. `docs/specs/users/onboarding-home-scene-resolution.md`
5. `docs/specs/system/registrar.md`
6. `docs/founder-sessions/2026-07-26_registrar-account-profile-avatar-onboarding.md`
7. `docs/founder-sessions/2026-07-26_photo-guided-avatar-promotional-wearables.md`
8. `docs/founder-sessions/2026-07-30_avatar-starter-outfit-and-punk-gear.md`
9. `art/avatar-system/specifications/photo-guided-avatar-and-promotional-wearables-design-spec.md`

## Settled Direction

- The likeness reference comes from guided live camera capture, not a local-file
  upload.
- The listener selects from stylized candidates.
- Clothing and promotional wearables remain modular and are not inferred from
  the photo.
- One base `User` may operate related Artist/Band sources; a source is not a
  second listener account.

## Decisions Required Before Runtime

- image-provider and data-processing boundary;
- consent evidence, retention, deletion, and failure handling;
- minors, impersonation, moderation, and likeness-abuse policy;
- durable image storage and delivery instead of database data URLs;
- server-authoritative candidate selection;
- whether profile setup belongs in Registrar and the exact route sequence;
- returning-user and incomplete-onboarding routing;
- starter wardrobe selection and later Personal Space ownership boundary.

## Stop Conditions

- Do not restore provider calls or persistence into `apps/**` from this package.
- Do not run live generation or migrations.
- Do not interpret a consent checkbox as a complete privacy contract.
- Do not expose an unauthenticated provider-spending endpoint.
- Do not store multi-megabyte base64 images in common `User.avatar` responses.
