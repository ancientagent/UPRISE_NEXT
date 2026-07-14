# Release Deck Scheduling Client

**Date:** 2026-07-14  
**Branch:** `codex/release-deck-scheduling-client`  
**Base:** local `main` at `8c4ab4d`  
**Deployment Target:** none; local-only single-writer checkpoint  
**Status:** implementation complete; verification and read-only reviewer gates pending  
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
  - remains server-authoritative for capacity and alternatives;
  - now returns the saved schedule summary when a track is already scheduled or
    ingested.
- `POST /release-deck/schedule`
  - sends `soonest` without a requested date; or
  - sends `chosen` only with a date present in the server-returned alternatives;
  - rechecks current source/user context immediately before the write.
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
- `apps/api/src/release-deck/release-deck-scheduling.service.ts`
- `apps/api/test/release-deck.scheduling.service.test.ts`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/users/artist-profile-and-source-dashboard.md`

## Verification At This Checkpoint

- Baseline before implementation:
  - Source Dashboard runtime: `7/7` passed.
  - Release Deck API scheduling/controller: `26/26` passed.
- Current focused web suite:
  - `7` suites, `35/35` passed.
- Current focused API scheduling/controller suite:
  - `2` suites, `26/26` passed.
- Web and API typecheck passed after the first runtime implementation pass.
- Final docs lint, full focused rerun, workspace audit, local checkpoint commit,
  and read-only reviewer passes remain required before closeout.

## Review And Continuation

Codex local remains the only writer. Reviewer agents must inspect the committed
diff read-only. The primary writer fixes all critical/important findings and
reverifies before selecting the next owner-authorized development objective.
