# Release Deck / RADIYO / Sect Implementation Architecture R1

**Status:** `partially superseded; Release Deck/Fair Play history retained; Sect architecture corrected 2026-07-14`
**Date:** `2026-07-14`
**Owner lane:** media / broadcast / registrar / communities
**Deployment Target:** local runtime slices; no deployment implied
**Base branch:** `main`

## Purpose

Map the implementation architecture for Release Deck scheduling, Fair Play New
Releases ingestion, and Sect readiness before runtime work starts.

The original R1 Sect design incorrectly proposed per-song Sect backing. That
design is void. Current Sect implementation must use listener requests,
Registrar-held Artist/Band Sect membership, and current member-artist Home Scene
Release Deck aggregation as defined below and in the owner specs.

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
- release deck rows in `apps/web/src/app/source-dashboard/release-deck/page.tsx`;
- Uprise-wide server-side deck measurement;
- persisted schedule records, read-only availability preview, and source-owned
  `soonest` / valid `chosen` schedule writes;
- manual scheduled-release ingestion into Fair Play New Releases.

Missing:

- listener Sect requests and Registrar-held Artist/Band Sect membership;
- readiness diagnostics for Sect Uprise creation;
- production scheduler/queue automation.

### Fair Play

Current runtime has the manual R1 lifecycle path; production automation remains
deferred.

Implemented:

- voting endpoint: `POST /tracks/:id/vote`;
- rotation read/metrics methods;
- recurrence aggregation method;
- recurrence aggregation job wrapper;
- manual scheduled-release ingestion endpoint with per-entry
  `newWindowDays = 10`;
- manual graduation endpoint with exact stored-window eligibility,
  `graduatedAt`, and engagement-derived initial recurrence;
- transaction-time community/entry revalidation and conditional idempotent
  graduation writes;
- focused ingestion, graduation, recurrence, controller, and module coverage.

Missing or unsafe for new implementation:

- `aggregateRecurrenceScores()` has no production schedule/caller visible in the
  active runtime path;
- legacy internal `ingestNewRelease()` still uses display-artist guarding and
  must not replace the active scheduled-ingestion service;
- no cron/queue job invokes ingestion or graduation;
- deprecated `FairPlayConfig.newWindowBand*` fields still exist in schema/admin
  config as compatibility fields and must not drive runtime behavior.

### Registrar / Sect

Implemented:

- Registrar source materialization, source-origin storage, codes, and capability
  grants;
- sect-motion submission and readback through Registrar entries;
- legacy `SectTag` / `UserTag` structures.

Missing:

- runtime creation/read paths for the persisted official `Sect` entity;
- listener Sect request and Artist/Band Sect membership persistence;
- readiness measurement from supporting member artists' current Home Scene
  Release Decks;
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
- no Sect-specific track metadata; membership is held at Artist/Band level.

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

### Principle 3: Registrar Owns Artist Membership, Release Deck Owns Current Music

A listener requests the Sect through Registrar. Eligible registered Artist/Band
sources support the request by registering as Sect members through Registrar.
That membership makes each supporting artist's current eligible Home Scene
Release Deck duration count automatically. Release Deck stores no per-song Sect
encoding.

This prevents three drift cases:

- treating songs as the actors supporting a Sect;
- counting non-member artists from passive listener/profile tags; and
- retaining historical songs after they leave the current eligible deck.

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

### `ArtistBandSectMembership`

Purpose: Registrar-held evidence that one eligible registered Artist/Band
supports and belongs to a requested Sect.

Suggested fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `String @id @default(uuid())` | Primary key. |
| `sectId` | `String` | Requested/legitimate Sect. |
| `artistBandId` | `String` | Supporting registered Artist/Band member. |
| `registeredById` | `String` | Authorized user registering the Artist/Band membership. |
| `createdAt` | `DateTime` | Default now. |
| `updatedAt` | `DateTime` | Updated at. |

Suggested constraints/indexes:

- `@@unique([sectId, artistBandId])`
- `@@index([artistBandId])`

Readiness does not persist track associations. It joins current eligible
Release Deck rows by `artistBandId + parent Home Scene`, caps each member artist
at `900` seconds, and recalculates whenever current deck state changes.

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
| `createdAt` | `DateTime` | Default now. |
| `updatedAt` | `DateTime` | Updated at. |

Suggested constraints/indexes:

- `@@unique([parentCommunityId, slug])`

Rationale: Official Sects need a durable entity before readiness can target them.
Legacy tags can inform candidate analysis but should not become official authority
without migration.

The existing identity model intentionally carries no invented lifecycle enum or
source-motion provenance. The fresh request/membership implementation plan must
decide only the minimum persistence needed to link the Home Scene listener
request and Artist/Band memberships; legitimate and active state must be derived
from settled membership and current-deck evidence rather than unapproved states.

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
- when a `sectId` is supplied, receive supporting Artist/Band member IDs from
  Registrar and compute their current eligible Home Scene Release Deck minutes.

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
- read supporting `ArtistBandSectMembership` rows;
- join each member artist to that artist's current eligible Home Scene Release
  Deck tracks;
- cap per source at `900` seconds;
- require `45` capped minutes and `5` distinct eligible sources for readiness;
- return included/excluded song reasons;
- expose the threshold state required for the later activation transition.

Suggested file:

- `apps/api/src/sects/sect-readiness.service.ts`

### Registrar Membership Join

Registrar owns the listener request and Artist/Band Sect membership. Release
Deck owns only the current eligible music being counted.

The architecture must not add per-song Sect controls or track-to-Sect writes.
The Release Deck readiness reader receives supporting member artist IDs from
Registrar and aggregates their current eligible tracks in the parent Home Scene.

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

### Sect Request, Membership, And Readiness

```http
POST /registrar/sect-requests
POST /registrar/sect-requests/:sectId/memberships
GET /sects/:sectId/readiness
```

R1 guardrails:

- any eligible Home Scene listener may request a Sect;
- an Artist/Band membership write requires authority to manage that registered
  Artist/Band source;
- membership and counted deck music must share the parent Home Scene context;
- five distinct member artists make the requested Sect legitimate;
- current member-artist deck duration, capped at `900` seconds per artist, must
  total at least `2,700` seconds for activation;
- no track-to-Sect state is written.

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

### Slice 6: Listener Request And Artist/Band Sect Membership

Goal: create the simple request and supporting-artist membership primitives.

Files likely touched:

- `apps/api/prisma/schema.prisma`
- migration adding request/lifecycle state and `ArtistBandSectMembership` around
  the existing `Sect` identity
- `apps/api/src/sects/sects.service.ts`
- Registrar Sect request/membership service and controller paths
- focused request/membership tests

Acceptance:

- official Sect is parented to one city-tier community;
- a Home Scene listener can request it;
- authorized Artist/Band operators can register their source as a Sect member;
- five distinct eligible member artists make the request legitimate;
- no song-level Sect state exists.

Validation:

- `pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts`

### Slice 7: Sect Readiness Diagnostics

Goal: compute readiness from supporting member artists' current eligible Home
Scene Release Deck music.

Files likely touched:

- `apps/api/src/sects/sect-readiness.service.ts`
- `apps/api/src/sects/sects.controller.ts`
- `apps/api/test/sect-readiness.service.test.ts`

Acceptance:

- counts only current eligible tracks owned by supporting member artists in the
  parent Home Scene;
- caps per source at `900` seconds;
- requires `2700` capped seconds and `5` distinct sources;
- returns included/excluded song reasons;
- does not retain previous songs as Sect evidence.

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
| Counting a non-member artist or historical deck rows | Join only Registrar-held member artists and current eligible Home Scene Release Deck state. |
| Ingesting duplicate active rotations | Keep `@@unique([trackId, sceneId])`; also reject active schedule/rotation conflicts before write. |
| Artist display-name collision | Use `artistBandId` for source-level active-new checks. |
| UI invents paid priority | Keep scheduling deterministic; no priority purchase controls. |
| Cron moves state before manual path is proven | Manual dry-run/run first; cron only after explicit follow-up. |
| Schema migration invents track-to-Sect state | Persist only listener request/Sect lifecycle and Artist/Band membership; calculate music from current Release Deck rows. |

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
- No Sect request, membership, or readiness writes.
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
