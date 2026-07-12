# Release Deck Fair Play Ingestion

**Date:** 2026-07-08
**Branch:** `feat/release-deck-scheduling-stack`
**Commit:** local checkpoint pending
**Deployment Target:** none yet (local stack checkpoint)
**Phase:** Release Deck / RADIYO scheduling stack, Slice 4
**Agent:** Codex

## Summary

Added the scheduled Release Deck to Fair Play ingestion path. Due `ReleaseDeckSchedule` rows can now be dry-run or ingested through an admin Fair Play endpoint. Ingestion creates `NEW_RELEASES` `RotationEntry` rows with the founder-locked fixed `newWindowDays = 10` value and marks schedules `ingested` only after the rotation entry write succeeds.

## Runtime Contract Added

- `POST /admin/fair-play/new-releases/ingest`
- JWT guarded, matching current admin API guard precedent.
- Request body:
  - `communityId` required.
  - `asOf` optional `YYYY-MM-DD`; defaults to current UTC day.
  - `dryRun` defaults to `true`.
- Dry-run reports eligible schedules and skip reasons without writes.
- Write mode revalidates each schedule inside the transaction before creating a rotation entry.

## Guardrails

- Fixed new-release window is stored on `RotationEntry.newWindowDays` and set to `10` for every ingested row.
- Deprecated `FairPlayConfig.newWindowBand*` fields are not read.
- Active source guard uses `artistBandId`, not display artist text.
- Existing track rotations and active source `NEW_RELEASES` entries cause a skip instead of duplicate ingestion.
- Schedule status changes to `ingested` only after `RotationEntry.create` succeeds.
- No Release Deck scheduling rows are created by this slice.
- No graduation, main-rotation propagation, or sect backing behavior is added by this slice.

## Files Changed

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260708170000_add_rotation_entry_new_window_days/migration.sql`
- `apps/api/src/fair-play/dto/fair-play-ingestion.dto.ts`
- `apps/api/src/fair-play/fair-play-ingestion.controller.ts`
- `apps/api/src/fair-play/fair-play-ingestion.service.ts`
- `apps/api/src/fair-play/fair-play.module.ts`
- `apps/api/test/fair-play.ingestion.controller.test.ts`
- `apps/api/test/fair-play.ingestion.service.test.ts`
- `docs/CHANGELOG.md`

## Validation

Planned before checkpoint commit:

- `pnpm --filter api test -- fair-play.ingestion.service.test.ts fair-play.ingestion.controller.test.ts fair-play.service.test.ts fair-play.recurrence.test.ts --runInBand`
- `pnpm --filter api typecheck`
- `pnpm run docs:lint`
- `git diff --check`
- `pnpm run workspace:audit`

## Remaining Work

- Reviewer pass against the local checkpoint commit.
- Later slices should implement new-release graduation/lifecycle and song-level sect backing. Those are intentionally not part of this ingestion slice.
