# Release Deck / RADIYO / Sect Implementation Architecture R1

**Status:** `planning`
**Date:** `2026-07-08`
**Owner lane:** media / broadcast / registrar / communities
**Deployment Target:** none; architecture plan only
**Base branch:** `docs/release-deck-radiyo-sect-readiness-spec-promotion`

## Purpose

Map the implementation architecture for Release Deck scheduling, Fair Play New
Releases ingestion, and song-level Sect readiness before runtime work starts.

This document does not change product doctrine. It turns the current owner specs
into a buildable sequence and identifies the concrete model, service, API, job,
and test boundaries needed for implementation.

## Current Confirmed Runtime

### Release Deck

Current runtime is implemented through `POST /tracks` and the Source Dashboard
Release Deck screen.

Implemented:

- source-owned track creation through `apps/api/src/tracks/tracks.service.ts`;
- `3` ready music slots per `artistBandId + communityId`;
- `6` minute max song duration;
- `15` minute max source active rotation cap;
- source Home Scene guard when `ArtistBand.homeSceneId` is known;
- URL-only track creation;
- web-side validation in `apps/web/src/lib/source/release-deck-validation.ts`;
- release deck rows in `apps/web/src/app/source-dashboard/release-deck/page.tsx`.

Missing:

- scheduled release date persistence;
- scheduling availability preview;
- Uprise-wide Release Deck measurement endpoint;
- server-side release-date capacity logic;
- song-level Sect backing/encoding;
- readiness diagnostics for Sect Uprise creation;
- handoff from scheduled Release Deck song into Fair Play/New Releases.

### Fair Play

Current runtime has useful pieces but no production ingestion path.

Implemented:

- voting endpoint: `POST /tracks/:id/vote`;
- rotation read/metrics methods;
- recurrence aggregation method;
- recurrence aggregation job wrapper;
- unit coverage around `ingestNewRelease`.

Missing or unsafe for new implementation:

- `ingestNewRelease()` has no controller or production caller;
- `aggregateRecurrenceScores()` has no production schedule/caller visible in the
  active runtime path;
- `ingestNewRelease()` guards one active new release by `track.artist` display
  string instead of durable `artistBandId`;
- `RotationEntry` has no `newWindowDays` field, so the fixed `10` day protected
  window is not auditable per entry;
- no graduation job moves expired New Releases into Main Rotation;
- deprecated `FairPlayConfig.newWindowBand*` fields still exist in schema/admin
  config as compatibility fields and must not drive runtime behavior.

### Registrar / Sect

Implemented:

- Registrar source materialization, source-origin storage, codes, and capability
  grants;
- sect-motion submission and readback through Registrar entries;
- legacy `SectTag` / `UserTag` structures.

Missing:

- official `Sect` entity;
- source-to-sect affiliation authority;
- song-level `Track` to `Sect` backing/encoding;
- readiness measurement from Release Deck songs;
- official Sect visibility/update channel;
- Sect Uprise activation workflow.

### Community Activation Analytics

Current `AdminAnalyticsService` already provides the best implementation pattern
for readiness diagnostics:

- read server-side tracks;
- group by full tuple;
- cap per source at `15` minutes;
- require `45` capped minutes and `5` distinct sources;
- revalidate inside the activation transaction before writes.

The Release Deck / Sect readiness implementation should reuse this shape instead
of inventing a separate metric style.

## Target Architecture

### Principle 1: Release Deck Owns Pre-Broadcast State

Release Deck owns everything before a track enters RADIYO/New Releases:

- track eligibility;
- source deck caps;
- Uprise-wide deck measurement;
- release-date request or auto-assignment;
- schedule availability diagnostics;
- song-level Sect backing metadata.

Fair Play should not decide whether a source may submit or when a song should be
scheduled. Fair Play should only ingest eligible scheduled songs when their entry
moment arrives.

### Principle 2: Fair Play Owns Post-Entry Lifecycle

Fair Play owns everything after a scheduled song enters New Releases:

- `RotationEntry` creation;
- fixed `newWindowDays = 10` assignment;
- graduation from New Releases to Main Rotation;
- recurrence recomputation;
- repeat caps and pool metrics;
- propagation/vote rules.

### Principle 3: Registrar Owns Authority, Release Deck Owns Song Encoding

Registrar should decide which source operators have authority to affiliate with,
back, or encode a Sect. Release Deck should store/read the encoding on the song.

This prevents two drift cases:

- loose source affiliation counting the whole catalog;
- loose listener/profile tags counting toward readiness.

### Principle 4: Measurement First, Mutation Second

Build server-side read models before automatic jobs:

1. Uprise-wide deck measurement.
2. Schedule availability preview.
3. Sect readiness diagnostics.
4. Manual/admin ingestion trigger.
5. Automated scheduler/cron only after manual paths are proven.

## Proposed Data Model Additions

These are implementation targets, not active migrations in this planning branch.

### `ReleaseDeckSchedule`

Purpose: durable schedule record for when a Release Deck track enters RADIYO.

Suggested fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `String @id @default(uuid())` | Primary key. |
| `trackId` | `String` | Unique scheduled track. |
| `communityId` | `String` | Scheduled Uprise/community. |
| `artistBandId` | `String` | Durable source identity. |
| `scheduledFor` | `DateTime` | Date/time the song is eligible to enter New Releases. |
| `assignmentMode` | `String` | `soonest` or `chosen`. |
| `requestedFor` | `DateTime?` | Original requested date when source chose one. |
| `status` | `String` | `scheduled`, `ingested`, `cancelled`, `blocked`. |
| `capacitySnapshot` | `Json?` | Auditable schedule decision inputs. |
| `createdById` | `String` | Source operator/user that created it. |
| `createdAt` | `DateTime` | Default now. |
| `updatedAt` | `DateTime` | Updated at. |

Suggested constraints/indexes:

- `@@unique([trackId])`
- `@@index([communityId, scheduledFor, status])`
- `@@index([artistBandId, communityId, status])`

Rationale: use a separate schedule model rather than only `Track.scheduledAt` so
schedule state, capacity snapshot, mode, and ingestion status remain auditable.

### `TrackSectBacking`

Purpose: explicit song-level Sect readiness encoding.

Suggested fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `String @id @default(uuid())` | Primary key. |
| `trackId` | `String` | Release Deck song. |
| `sectId` | `String` | Official Sect. |
| `artistBandId` | `String` | Source claiming/backing this song for the Sect. |
| `encodedById` | `String` | User/operator who encoded it. |
| `status` | `String` | `active`, `removed`, `rejected`. |
| `createdAt` | `DateTime` | Default now. |
| `updatedAt` | `DateTime` | Updated at. |

Suggested constraints/indexes:

- `@@unique([trackId])` for R1, enforcing one readiness-bearing Sect per song.
- `@@index([sectId, status])`
- `@@index([artistBandId, sectId])`

Rationale: R1 should prevent double-counting one song into multiple Sect Uprises.
A future owner-spec change can relax the uniqueness if multi-Sect encoding is
approved.

### `Sect`

Purpose: official Registrar-recognized Sect inside a parent Home Scene/music
community. `SectTag` is not enough for this role.

Suggested fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `String @id @default(uuid())` | Primary key. |
| `parentCommunityId` | `String` | Parent city-tier Home Scene. |
| `name` | `String` | Display name. |
| `slug` | `String` | Parent-scoped slug. |
| `status` | `String` | `official`, `uprise_ready`, `uprisen`, `archived`. |
| `createdByRegistrarEntryId` | `String?` | Source motion that created it. |
| `createdAt` | `DateTime` | Default now. |
| `updatedAt` | `DateTime` | Updated at. |

Suggested constraints/indexes:

- `@@unique([parentCommunityId, slug])`
- `@@index([parentCommunityId, status])`

Rationale: Official Sects need a durable entity before readiness can target them.
Legacy tags can inform candidate analysis but should not become official authority
without migration.

### `RotationEntry.newWindowDays`

Purpose: make the fixed protected New Releases run auditable per entry.

Suggested field:

- `newWindowDays Int @default(10)`

Rules:

- assigned exactly once at New Releases ingestion;
- default is `10`;
- not recomputed from pool density;
- used by graduation checks.

### `FairPlayConfig.newReleaseWindowDays`

Purpose: one explicit config value for the fixed protected window if runtime
configuration is needed.

Suggested field:

- `newReleaseWindowDays Int?`

Rules:

- default effective value is `10`;
- deprecated `newWindowBand*` and `bandPersistDays` fields must not be read by
  New Releases scheduling or ingestion;
- cleanup/removal of old fields is a separate compatibility slice.

## Release-Date Scheduling Algorithm

### R1 Recommended Shape

Use playable seconds, not raw song count, as the scheduling capacity unit.

A candidate date is valid when all of these pass:

1. The track is source-owned, `ready`, URL-playable, `<= 360` seconds, and in the
   source's active Home Scene/community.
2. The source is not above `3` active music slots in that `artistBandId + communityId` context.
3. The source's ready active rotation total does not exceed `900` seconds.
4. The track is not already scheduled or active in another Uprise rotation.
5. The date does not exceed the configured daily intake capacity for that Uprise.
6. The date does not create an excessive protected New Releases load across the
   next `10` days according to the configured protected-load capacity.

### Capacity Configuration

R1 should store capacity as configurable server-side policy, not as client logic.

Suggested policy values:

| Name | Meaning |
| --- | --- |
| `dailyIntakePlayableSeconds` | Max playable seconds allowed to enter New Releases on one date for one Uprise. |
| `protectedPoolPlayableSeconds` | Max playable seconds scheduled to be inside the 10-day protected New Releases window at once. |
| `lookaheadDays` | How far the soonest-date search scans. |
| `newReleaseWindowDays` | Effective protected window, default `10`. |

The first implementation can seed conservative defaults in code/tests and expose
them through admin config later. The exact production tuning can remain beta
calibrated without blocking the architecture.

### Assignment Modes

- `soonest`: server finds the earliest valid date within `lookaheadDays`.
- `chosen`: server accepts the requested date only if valid; otherwise returns
  alternatives including the soonest valid date.

### Failure Response Shape

Scheduling failures should be explicit and actionable:

```ts
type ReleaseScheduleFailure = {
  success: false;
  error: {
    code:
      | 'TRACK_NOT_ELIGIBLE'
      | 'SOURCE_SLOT_CAP_REACHED'
      | 'SOURCE_DURATION_CAP_REACHED'
      | 'DATE_CAPACITY_FULL'
      | 'ALREADY_SCHEDULED_OR_ACTIVE'
      | 'NO_VALID_DATE_IN_LOOKAHEAD';
    message: string;
    requestedDate?: string;
    soonestValidDate?: string;
    alternatives?: string[];
    diagnostics?: ReleaseDeckCapacityDiagnostics;
  };
};
```

This keeps UI behavior deterministic without inventing manual override controls.

## Service Boundaries

### `ReleaseDeckMeasurementService`

Owns server-side deck diagnostics.

Responsibilities:

- read eligible source-owned `Track` rows for a community/Uprise;
- apply source caps and duration caps;
- return included/excluded songs with reasons;
- compute total playable seconds;
- compute per-source capped seconds and remaining source capacity;
- compute distinct source count;
- compute scheduled release pressure;
- compute sect-encoded minutes when a `sectId` is supplied.

Suggested file:

- `apps/api/src/release-deck/release-deck-measurement.service.ts`

### `ReleaseDeckSchedulingService`

Owns date assignment and schedule persistence.

Responsibilities:

- validate track eligibility;
- compute availability by date;
- assign `soonest` or validate `chosen` date;
- create/update `ReleaseDeckSchedule`;
- return failure diagnostics and valid alternatives;
- never create `RotationEntry` directly.

Suggested file:

- `apps/api/src/release-deck/release-deck-scheduling.service.ts`

### `FairPlayIngestionService` Or Focused Fair Play Methods

Owns scheduled-song ingestion into New Releases.

Responsibilities:

- read due `ReleaseDeckSchedule` records;
- revalidate track/community/source constraints;
- create `RotationEntry` in `NEW_RELEASES`;
- set `enteredPoolAt` and `newWindowDays = 10`;
- mark schedule `ingested`;
- reject duplicate active rotation;
- use `artistBandId`, not display `artist`, for source-level one-active-new rule
  if that rule remains active.

Suggested file option:

- `apps/api/src/fair-play/fair-play-ingestion.service.ts`

Alternative:

- keep methods in `FairPlayService`, but extract helper functions so scheduling,
  ingestion, graduation, metrics, and voting do not keep growing in one file.

### `FairPlayGraduationService`

Owns New Releases to Main Rotation transition.

Responsibilities:

- find `NEW_RELEASES` entries where `enteredPoolAt + newWindowDays <= asOf`;
- update pool to `MAIN_ROTATION`;
- set `graduatedAt`;
- initialize recurrence score deterministically;
- never change tier propagation/vote evidence.

Suggested file:

- `apps/api/src/fair-play/fair-play-graduation.service.ts`

### `SectReadinessService`

Owns Sect readiness diagnostics.

Responsibilities:

- read official `Sect` by parent community;
- read active `TrackSectBacking` rows;
- join to eligible Release Deck tracks;
- cap per source at `900` seconds;
- require `45` capped minutes and `5` distinct eligible sources for readiness;
- return included/excluded song reasons;
- do not activate a Sect Uprise directly in R1.

Suggested file:

- `apps/api/src/sects/sect-readiness.service.ts`

### Registrar Authority Join

Registrar owns who may back or encode a Sect.

Implementation options:

- add a `source_sect_affiliation` model in the Registrar/Sect slice;
- or use approved Registrar entries as the first authority source for R1.

The architecture should not let the Release Deck UI write `TrackSectBacking`
unless Registrar confirms the selected source can back that Sect.

## API Boundaries

### Measurement

```http
GET /release-deck/measurement?communityId=<id>
```

Auth:

- source operator for source-scoped measurement;
- admin/superadmin for full Uprise-wide diagnostics in early implementation.

Response includes:

- community tuple;
- thresholds;
- total playable seconds/minutes;
- per-source totals;
- included songs;
- excluded songs with reasons;
- schedule pressure summary.

### Schedule Preview

```http
GET /release-deck/schedule/availability?communityId=<id>&trackId=<id>&from=<date>&days=30
```

Response includes:

- earliest valid date;
- date diagnostics;
- invalid reasons per requested date;
- capacity inputs used.

### Schedule Track

```http
POST /release-deck/schedule
```

Request:

```ts
type ScheduleReleaseDeckTrackInput = {
  trackId: string;
  communityId: string;
  mode: 'soonest' | 'chosen';
  requestedDate?: string;
};
```

Behavior:

- source operator only;
- track must be managed by source;
- community must match source Home Scene;
- schedule record created or updated;
- no `RotationEntry` created here.

### Manual Ingestion Trigger

```http
POST /admin/fair-play/release-ingestion/run
```

R1 should be admin/manual, not cron-first.

Request:

```ts
type RunReleaseIngestionInput = {
  communityId: string;
  asOf?: string;
  dryRun?: boolean;
};
```

Behavior:

- dry run returns due schedules and rejection reasons;
- non-dry-run transactionally creates rotation entries and marks schedules
  ingested;
- revalidates schedule eligibility inside the transaction.

### Graduation Trigger

```http
POST /admin/fair-play/graduation/run
```

R1 should be admin/manual, not cron-first.

Request:

```ts
type RunGraduationInput = {
  communityId: string;
  asOf?: string;
  dryRun?: boolean;
};
```

Behavior:

- dry run returns entries that would graduate;
- non-dry-run updates entries to `MAIN_ROTATION` and sets `graduatedAt`.

### Sect Backing

```http
POST /release-deck/tracks/:trackId/sect-backing
DELETE /release-deck/tracks/:trackId/sect-backing/:sectId
GET /sects/:sectId/readiness
```

R1 guardrails:

- source operator only;
- source must have Registrar-recognized authority for that Sect;
- track must belong to that source;
- track must be in the parent community/Uprise context;
- one active Sect backing per song unless owner spec changes.

## Job / Scheduler Flow

R1 should use manual admin triggers first.

1. Source creates a ready Release Deck track.
2. Source requests `soonest` or `chosen` schedule.
3. Release Deck scheduling writes `ReleaseDeckSchedule(status='scheduled')`.
4. Admin/manual ingestion dry run previews due schedules.
5. Admin/manual ingestion run creates `RotationEntry(pool='NEW_RELEASES')` with
   `newWindowDays=10` and marks schedules `ingested`.
6. Admin/manual graduation dry run previews expired New Releases entries.
7. Admin/manual graduation run moves expired entries to `MAIN_ROTATION`.
8. Existing recurrence aggregation can run against Main Rotation entries after
   graduation.
9. Cron/queue automation can be added only after manual paths pass tests.

## Implementation Slice Sequence

### Slice 1: Read-Only Uprise-Wide Deck Measurement

Goal: create deterministic server-side measurement without new mutations.

Files likely touched:

- `apps/api/src/release-deck/release-deck-measurement.service.ts`
- `apps/api/src/release-deck/release-deck.controller.ts`
- `apps/api/src/release-deck/release-deck.module.ts`
- `apps/api/src/app.module.ts`
- `apps/api/test/release-deck.measurement.service.test.ts`
- `apps/api/test/release-deck.controller.test.ts`

Acceptance:

- counts ready source-owned tracks by community;
- excludes missing source, failed/processing, wrong community, overlength, over
  cap, and missing Home Scene/source context with reasons;
- caps source contribution at `900` seconds;
- returns distinct source count and total capped playable seconds;
- no schema migration required.

Validation:

- `pnpm --filter api test -- release-deck.measurement.service.test.ts release-deck.controller.test.ts`
- `pnpm --filter api typecheck`

### Slice 2: Scheduling Schema And Availability Preview

Goal: add schedule persistence and read-only availability before mutating Fair
Play.

Files likely touched:

- `apps/api/prisma/schema.prisma`
- new Prisma migration under `apps/api/prisma/migrations/**`
- `apps/api/src/release-deck/release-deck-scheduling.service.ts`
- `apps/api/src/release-deck/dto/release-deck-schedule.dto.ts`
- `apps/api/test/release-deck.scheduling.service.test.ts`

Acceptance:

- `ReleaseDeckSchedule` model exists;
- availability preview returns soonest valid date and alternatives;
- chosen date over capacity fails closed with diagnostics;
- scheduling uses playable seconds, not raw song count;
- no Fair Play `RotationEntry` writes yet.

Validation:

- `pnpm --filter api test -- release-deck.scheduling.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm run docs:lint`

### Slice 3: Schedule Write Path

Goal: source operators can schedule eligible Release Deck songs.

Files likely touched:

- `apps/api/src/release-deck/release-deck.controller.ts`
- `apps/api/src/release-deck/release-deck-scheduling.service.ts`
- `apps/api/test/release-deck.schedule.controller.test.ts`
- `apps/web/src/lib/source/release-deck-client.ts`
- `apps/web/__tests__/release-deck-client.test.ts`

Acceptance:

- `soonest` creates a schedule on earliest valid date;
- `chosen` creates a schedule only when valid;
- repeats are idempotent or return explicit conflict;
- source/member authority enforced;
- community must match source Home Scene;
- no `RotationEntry` writes.

Validation:

- `pnpm --filter api test -- release-deck.schedule.controller.test.ts release-deck.scheduling.service.test.ts`
- `pnpm --filter web test -- release-deck-client.test.ts`

### Slice 4: Fair Play Ingestion And Fixed New Window

Goal: due scheduled songs enter New Releases with `newWindowDays = 10`.

Files likely touched:

- `apps/api/prisma/schema.prisma`
- migration adding `RotationEntry.newWindowDays`
- `apps/api/src/fair-play/fair-play-ingestion.service.ts`
- `apps/api/src/fair-play/fair-play-admin.controller.ts`
- `apps/api/test/fair-play.ingestion.service.test.ts`

Acceptance:

- dry-run ingestion returns due schedules and rejection reasons;
- run ingestion transactionally creates `NEW_RELEASES` entries;
- `newWindowDays` is always `10` unless future config changes owner spec;
- old `newWindowBand*` fields are not read;
- active source guard uses `artistBandId`, not display artist;
- schedule status becomes `ingested` only when rotation entry is created.

Validation:

- `pnpm --filter api test -- fair-play.ingestion.service.test.ts fair-play.service.test.ts`
- `pnpm --filter api typecheck`

### Slice 5: New Releases Graduation

Goal: expired New Releases entries move into Main Rotation.

Files likely touched:

- `apps/api/src/fair-play/fair-play-graduation.service.ts`
- `apps/api/src/fair-play/fair-play-admin.controller.ts`
- `apps/api/test/fair-play.graduation.service.test.ts`

Acceptance:

- entries graduate when `enteredPoolAt + newWindowDays <= asOf`;
- `graduatedAt` is set;
- pool becomes `MAIN_ROTATION`;
- recurrence score initialized deterministically;
- votes and engagement history are not moved or rewritten.

Validation:

- `pnpm --filter api test -- fair-play.graduation.service.test.ts fair-play.service.test.ts`

### Slice 6: Official Sect And Song-Level Backing Schema

Goal: create durable backing primitives without activating Sect Uprise creation.

Files likely touched:

- `apps/api/prisma/schema.prisma`
- migration adding `Sect` and `TrackSectBacking`
- `apps/api/src/sects/sects.service.ts`
- `apps/api/src/release-deck/track-sect-backing.service.ts`
- `apps/api/test/track-sect-backing.service.test.ts`

Acceptance:

- official Sect is parented to one city-tier community;
- song backing requires eligible source-owned track;
- Registrar authority is checked before backing;
- one active backing per song in R1;
- source-wide affiliation alone does not count songs.

Validation:

- `pnpm --filter api test -- track-sect-backing.service.test.ts registrar.controller.test.ts`

### Slice 7: Sect Readiness Diagnostics

Goal: compute readiness from song-level Release Deck backing.

Files likely touched:

- `apps/api/src/sects/sect-readiness.service.ts`
- `apps/api/src/sects/sects.controller.ts`
- `apps/api/test/sect-readiness.service.test.ts`

Acceptance:

- counts only active `TrackSectBacking` rows;
- joins to ready playable source-owned tracks;
- caps per source at `900` seconds;
- requires `2700` capped seconds and `5` distinct sources;
- returns included/excluded song reasons;
- does not create or activate a Sect Uprise.

Validation:

- `pnpm --filter api test -- sect-readiness.service.test.ts`

### Slice 8: Source Dashboard Scheduling UI

Goal: expose schedule state without pretending upload/storage/paid priority exists.

Files likely touched:

- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
- `apps/web/src/lib/source/release-deck-client.ts`
- `apps/web/src/lib/source/release-deck-validation.ts`
- `apps/web/__tests__/source-dashboard-runtime.test.ts`
- `apps/web/__tests__/release-deck-validation.test.ts`

Acceptance:

- source sees scheduled date/mode/status per row;
- source can select soonest or chosen date where API allows;
- invalid chosen date shows alternatives;
- UI does not show pay-for-priority, fourth music slot, storage upload, or
  manual Fair Play controls;
- player state is not mutated by Release Deck tooling.

Validation:

- `pnpm --filter web test -- source-dashboard-runtime.test.ts release-deck-validation.test.ts release-deck-client.test.ts`
- `pnpm --filter web typecheck`

### Slice 9: Admin Diagnostics And Manual Runbook

Goal: give operators safe dry-run/manual controls before cron.

Files likely touched:

- `apps/api/src/admin-analytics/admin-analytics.service.ts` or new admin service
- `apps/api/src/fair-play/fair-play-admin.controller.ts`
- `docs/RUNBOOK.md` or a focused ops handoff
- `apps/api/test/fair-play-admin.controller.test.ts`

Acceptance:

- dry run available for schedule ingestion and graduation;
- manual run requires admin auth;
- dry run and run outputs include counts and skipped reasons;
- no cron/provider changes yet.

Validation:

- `pnpm --filter api test -- fair-play-admin.controller.test.ts`
- `pnpm run docs:lint`

## Risk Register

| Risk | Mitigation |
| --- | --- |
| Reintroducing `10 / 7 / 5` density windows | Add tests proving `newWindowDays = 10` regardless of active new-song count. |
| Counting whole-source Sect affiliation | Add tests where source is sect-affiliated but zero songs are backed; readiness must be zero. |
| Ingesting duplicate active rotations | Keep `@@unique([trackId, sceneId])`; also reject active schedule/rotation conflicts before write. |
| Artist display-name collision | Use `artistBandId` for source-level active-new checks. |
| UI invents paid priority | Keep scheduling deterministic; no priority purchase controls. |
| Cron moves state before manual path is proven | Manual dry-run/run first; cron only after explicit follow-up. |
| Schema migration too broad | Split schedule, Fair Play entry, and Sect backing migrations unless a single migration is required by Prisma relation constraints. |

## First PR Recommendation

Start with Slice 1 only: read-only Uprise-wide Release Deck measurement.

Reason:

- no migration;
- no player/Fair Play mutation;
- exercises the core aggregation shape needed by scheduling and Sect readiness;
- provides immediate visibility into source caps and readiness without committing
  to a capacity algorithm.

## Large Executor Prompt

Use this prompt for a coding agent after PR #231 and this architecture plan are
merged or intentionally stacked:

```text
Role: UPRISE Release Deck architecture implementer.
Repo: /home/baris/UPRISE_NEXT.
Branch: create a registered branch from the current branch that contains docs/solutions/RELEASE_DECK_RADIYO_SECT_IMPLEMENTATION_ARCHITECTURE_R1.md.
Mode: implement Slice 1 only, read-only Uprise-wide Release Deck measurement.

Required reading:
- AGENTS.md
- docs/PLATFORM_START_HERE.md
- docs/AGENT_STRATEGY_AND_HANDOFF.md
- docs/agent-briefs/CONTEXT_ROUTER.md
- docs/specs/media/release-deck-and-eligibility.md
- docs/specs/broadcast/radiyo-and-fair-play.md
- docs/specs/communities/scenes-uprises-sects.md
- docs/specs/system/registrar.md
- docs/solutions/RELEASE_DECK_RADIYO_SECT_IMPLEMENTATION_ARCHITECTURE_R1.md

Scope:
- Implement only Slice 1: read-only Uprise-wide Release Deck measurement.
- No schema migration.
- No Fair Play ingestion.
- No scheduling writes.
- No Sect backing writes.
- No provider/db state changes.

Build:
- Add ReleaseDeckMeasurementService, controller/module wiring, and tests.
- Measure ready source-owned tracks in one city-tier community.
- Return total playable seconds, capped playable seconds, per-source totals, distinct source count, included tracks, excluded tracks with reasons, and thresholds.
- Cap each source at 900 seconds.
- Exclude tracks that are missing source ownership, wrong community, not ready, over 360 seconds, or missing required source/Home Scene context.

Validation:
- pnpm --filter api test -- release-deck.measurement.service.test.ts release-deck.controller.test.ts
- pnpm --filter api typecheck
- pnpm run docs:lint
- git diff --check
- pnpm run workspace:audit

Report:
- files changed
- behavior added
- tests run
- what remains for Slice 2
```

## Validation For This Planning Branch

- `pnpm run docs:lint`
- `git diff --check`
- `pnpm run workspace:audit`
