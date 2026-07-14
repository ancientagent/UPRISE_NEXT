# Release Deck Scheduling Client

**Date:** 2026-07-14
**Branch:** `codex/release-deck-scheduling-client`
**Base:** local `main` at `8c4ab4d`
**Deployment Target:** none; local-only single-writer checkpoint
**Status:** runtime checkpoints committed; final accessibility re-review pending
**Agent:** Codex local sole writer

## Summary

Connected the existing Source Dashboard Release Deck row workflow to the
already-merged Release Deck scheduling stack.

A source operator can now load a source-owned ready row, ask the API for the
next `30` days of capacity, accept the server's soonest valid date or choose one
of the returned alternatives, and create a durable `ReleaseDeckSchedule`.
Reloading and loading the same row restores its saved scheduled date, status,
and assignment mode.

## Why This Slice

- The agent-control queue contained no active work orders.
- The screen-package README still recommended the Release Deck readiness slice,
  but current runtime and behavior tests proved that slice was already built.
- PR #236 had merged availability and write APIs, while the web route still
  described scheduling as unavailable and did not call them.
- The media owner spec still described the exact schedule API/capacity shape as
  future work even though runtime and API tests already owned it.

## Runtime Contract

- `GET /release-deck/schedule/availability`
  - called only after loading a source-owned ready row with a resolved Home
    Scene and valid current-source context;
  - requires the signed-in user to manage the track's Artist/Band source;
  - remains server-authoritative for capacity and alternatives, counts both
    scheduled and ingested rows, and rejects inactive cities or past scans;
  - now returns the saved schedule summary when a track is already scheduled or
    ingested.
- `POST /release-deck/schedule`
  - sends `soonest` without a requested date; or
  - sends `chosen` only with a date present in the server-returned alternatives;
  - rechecks current source/user context immediately before the write;
  - revalidates against a fresh current-day lookahead and creates the schedule
    in one serializable transaction;
  - maps a competing transaction conflict to a refreshable capacity response.
- Client write handling
  - discards responses when another row/source became current;
  - refreshes current availability after a rejected write;
  - exposes async status and errors to assistive technology.
- The Release Deck row no longer labels track creation time as the release date.
  It shows `Load to check`, `Checking...`, `Not scheduled`, `Unavailable`, or
  the durable scheduled date.

## Guardrails Preserved

- No Fair Play ordering, ranking, recurrence, propagation, or priority control.
- No paid placement or shorter protected run.
- No automatic ingestion job, graduation, or sect backing behavior.
- No replacement/removal, upload/storage/transcoding, metrics, paid-ad runtime,
  or new route.
- No database client or server-only import in `apps/web`.
- No remote push, PR, deployment, provider write, or external workspace writer.

## Files

- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
- `apps/web/src/lib/source/release-deck-scheduling.ts`
- `apps/web/__tests__/source-dashboard-runtime.test.ts`
- `apps/web/__tests__/release-deck-scheduling-client.test.ts`
- `apps/web/__tests__/api-error-message.test.ts`
- `apps/web/src/lib/api.ts`
- `apps/api/src/release-deck/release-deck.controller.ts`
- `apps/api/src/release-deck/release-deck-scheduling.service.ts`
- `apps/api/test/release-deck.scheduling.service.test.ts`
- `apps/api/test/release-deck.controller.test.ts`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/users/artist-profile-and-source-dashboard.md`

## Verification At This Checkpoint

- Baseline before implementation:
  - Source Dashboard runtime: `7/7` passed.
  - Release Deck API scheduling/controller: `26/26` passed.
- Final focused web suite: `8` suites, `37/37` passed.
- Reviewer-fix API scheduling/controller suite: `2` suites, `34/34` passed.
- `pnpm run verify` passed: docs lint, canon lint, infrastructure policy, and
  all workspace typechecks.
- `pnpm run workspace:audit` passed with `65` registry entries.
- The combined branch diff from `8c4ab4d` passes `git diff --check` after the
  handoff whitespace correction.
- Runtime reviewer-fix checkpoint: `ddf6ccb`.
- Accessibility-result checkpoint: `f200df4`.
- The final client accessibility re-review remains required before closeout.

## First Review Findings Corrected

- Prevented arbitrary past/far-future `chosen` dates by validating against a
  fresh current-day lookahead.
- Included `ingested` schedules in daily and protected-window capacity.
- Made source authorization, capacity validation, and creation one serializable
  transaction with retryable conflict mapping.
- Source-authorized availability reads and rejected inactive city communities.
- Prevented stale write responses from updating another loaded row/source.
- Refetched availability after write rejection and preserved nested API errors.
- Added async status/error semantics and corrected spec/operations drift.

## Final Review State

- Database/code reviewer: pass at `ddf6ccb`; no critical or important findings.
- Client/product reviewer: functional and product boundaries passed, but the
  first final pass blocked on successful availability completion not being
  announced after the checking status unmounted.
- `f200df4` adds a live result status for available and unavailable completion,
  tests both announcements, explicitly checks for absent Fair Play controls,
  and verifies stale authentication responses are discarded.
- Remaining non-blocking production risks: exercise a real PostgreSQL
  serialization race before production rollout, add a direct `P2002` race-path
  test, and revisit conservative protected-window tuning when real load data is
  available.

## Review And Continuation

Codex local remains the only writer. Reviewer agents must inspect the committed
diff read-only. The primary writer fixes all critical/important findings and
reverifies before selecting the next owner-authorized development objective.
