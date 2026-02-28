# Slice 158A — Registrar Invite Read/Client Typed Parity Follow-up

## Scope
- Align typed read parity for invite status fields across API/web contracts.
- No endpoint or runtime behavior changes.

## Changes
- Updated `apps/web/src/lib/registrar/client.ts`:
  - Added explicit invite member status union (`pending_email`, `queued`, `sent`, `failed`, `claimed`, `existing_user`).
  - Added explicit invite delivery status union (`queued`, `sent`, `failed`).
  - Tightened `RegistrarArtistInviteStatusResponse.countsByStatus` to `Partial<Record<...>>` of known statuses.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 158A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api test -- registrar.service.test.ts` — PASS
4. `pnpm --filter web test -- registrar-client.test.ts` — PASS
5. `pnpm --filter api typecheck` — PASS
6. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: low (type-only alignment).
- Rollback: revert `apps/web/src/lib/registrar/client.ts` typing changes and `docs/CHANGELOG.md` entry.
