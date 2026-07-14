# Release Deck And Eligibility

**ID:** `MEDIA-RELEASE-DECK`
**Status:** `active`
**Owner:** `uprise-media-release`
**Last Updated:** `2026-07-14`

## Overview And Purpose

Release Deck is the current source-facing path for a managed Artist/Band source
to submit music into its active Home Scene. It is also the owner contract for the
Uprise-wide deck system: the combined playable catalog, release-date scheduling,
and readiness measurement surface formed from every participating source deck in
one Uprise.

This spec owns the Release Deck media eligibility, scheduling, and measurement
contract so source tools, Fair Play, sect readiness, and future media
infrastructure do not duplicate or reinterpret slot, timing, or rotation limits.

The current MVP remains URL-only. Real upload, storage, transcoding, waveform
extraction, and paid ad-slot mechanics are deferred until explicitly activated
by a later media/storage implementation spec.

## Persistent System Impact

- Player visibility on this flow: Release Deck is source-admin tooling, not a player surface.
- Player context/state inherited by this flow: none.
- Can this feature affect player state or listening context? No direct player state changes.
- Does player state constrain search, navigation, travel, or content scope here? No.
- If the player is not visible here, why is that valid? Release Deck is source management, separate from listener Home/Plot playback.

## User Roles And Use Cases

- Managed Artist/Band source operators submit active music for their Home Scene.
- Source operators may operate through a proxy scene until their natural Home Scene activates, but source origin and active Home Scene routing remain Registrar-owned.
- Listeners consume accepted tracks through RADIYO, Artist Profile, and community surfaces; they do not manage Release Deck eligibility.
- Community, Registrar, and Fair Play systems may read the combined Uprise-wide
  Release Deck system to measure available playable catalog, release scheduling
  pressure, source contribution caps, and sect readiness.

## Functional Requirements

- Release Deck has `3` active music slots per managed Artist/Band source per city-tier community.
- The paid `4th` ad-attachment slot is not a music slot and is not a standalone rotation entry.
- Future paid ad attachment metadata may classify the ad as `release date`,
  `general`, `event`, or `sponsor` after paid ad runtime is explicitly
  activated by media/economy/action owner specs.
- Future paid ad attachment link targets are category-specific: `release date`
  may link to a calendar date, `event` may link to an event, `sponsor` may link
  to a business account, and `general` has no required linked target.
- No single Release Deck song may exceed `6` minutes (`360` seconds).
- No single source may occupy more than `15` minutes (`900` seconds) of any one Uprise rotation at a time.
- Current API enforcement applies to `ready` tracks for the same `artistBandId + communityId`.
- Current MVP media ingest accepts explicit hosted `http(s)` audio URLs only.
- URL-only ingest is provider-agnostic. A source may supply a direct playable
  audio URL from artist-controlled hosting or an external service when browser
  playback and provider terms allow it. Ordinary external artist/profile pages
  remain official outbound links unless an approved direct-play or embed
  contract exists.
- UPRISE must not represent externally hosted audio as UPRISE-hosted media.
  First-party upload, storage, and transcoding remain deferred until a later
  media-storage owner spec activates them.
- A song cannot be actively listed in more than one Uprise rotation at the same time.
- Source-owned tracks must attach to the managed source Home Scene; proxy-to-natural activation updates future upload routing through `ArtistBand.homeSceneId`.
- MVP replacement behavior is reject-only: when a source is at the `3`-slot, `6`-minute song, or `15`-minute source cap, the current create path rejects the new track and tells the source to choose a different active song combination. It does not silently delete, mutate, or replace existing tracks.

## Uprise-Wide Deck System

Each managed Artist/Band source owns its own Release Deck, but the system must
also be able to read every source deck inside one Uprise as one combined catalog
pipeline.

The Uprise-wide Release Deck system is responsible for read-side measurement of:

- total approved playable music in the Uprise deck system;
- total approved playable music contributed by each source;
- each source's remaining active rotation capacity out of the `15` minute cap;
- distinct source count for readiness measurements;
- songs included in or excluded from readiness calculations, with exclusion
  reasons such as draft, failed, over cap, not approved/playable, missing
  source ownership, wrong Home Scene/source origin, or missing sect encoding;
- total approved playable minutes explicitly encoded for a sect;
- remaining approved playable minutes needed for a sect to reach the `45`
  minute readiness target;
- release-date scheduling capacity and pressure for songs waiting to enter
  RADIYO/New Releases.

This read-side system must remain deterministic and auditable. It must not
become personalization, pay-for-placement, manual song ordering, or a way to
bypass Release Deck caps.

## Release-Date Scheduling Contract

Release-date scheduling belongs to the Release Deck/media owner contract. Fair
Play owns broadcast lifecycle only after a scheduled song enters the `New
Releases` pool.

Source operators place songs in Release Deck. A source may either:

- let the system auto-assign the soonest valid release date; or
- request a specific release date when capacity/rules allow.

Every accepted song that enters RADIYO/New Releases receives the same protected
New Releases run defined by the broadcast spec. Congestion is handled by
scheduling a later entry date before New Releases begins, not by shortening an
individual song's protected RADIYO window.

Current scheduling fails closed when a requested release date is not valid and
returns valid alternate dates so the source UI can offer `soonest available` or
another selected date. Capacity is calculated from playable seconds, not raw
song count. The current beta policy uses a `30` day lookahead, a `15` minute
daily intake cap, a `45` minute protected-pool cap across overlapping fixed
`10` day New Releases windows, the existing `6` minute per-song cap, and the
existing `3` slot / `15` minute per-source caps. The API remains the source of
truth for every capacity decision. Both `scheduled` and already-`ingested`
schedule rows consume daily and protected-window capacity for the dates they
occupy.

Release-date scheduling must not:

- create pay-for-placement;
- allow manual favoritism or per-artist exceptions;
- reorder active Fair Play rotation entries directly;
- bypass the `3` slot, `6` minute song, or `15` minute source caps;
- schedule one song as active in more than one Uprise rotation at once.

## Current Runtime Enforcement

Implemented in `apps/api/src/tracks/tracks.service.ts`:

- when a signed-in user creates a `ready` track for a managed Artist/Band source and community, the API counts existing `ready` tracks for the same `artistBandId + communityId`;
- if the new ready track is longer than `360` seconds, the API rejects the upload;
- if there are already `3` ready tracks, the API rejects the upload;
- the API sums existing ready duration for the same `artistBandId + communityId`;
- if existing ready duration plus the new track duration exceeds `900` seconds, the API rejects the upload;
- `processing` and `failed` tracks are not counted as active rotation occupancy.

Implemented in `apps/api/src/release-deck/release-deck-scheduling.service.ts`:

- schedule availability is source-operator-authorized and validates source
  ownership, an active city-tier Home Scene,
  ready status, hosted `http(s)` playback, song/source caps, existing schedule,
  and active rotation state before scanning capacity;
- availability returns server-calculated daily/protected-window diagnostics,
  the soonest valid date, and available alternatives within `30` days;
- `soonest` assignment selects the earliest valid server-calculated date;
- `chosen` assignment accepts only the requested date when that exact date is
  present in a fresh current-day `30` day availability scan; past and arbitrary
  out-of-window dates fail closed;
- source authorization, current availability validation, capacity checks, and
  schedule creation run in one serializable transaction so competing writes
  cannot silently oversubscribe capacity;
- `ReleaseDeckSchedule` persists the assignment mode, requested date when
  chosen, scheduled date, capacity snapshot, source/community/track IDs,
  creator, and lifecycle status;
- an existing schedule is returned with its saved scheduled date and assignment
  mode so source UI can restore durable state after reload;
- schedule creation does not create or reorder a Fair Play rotation entry.

## Non-Functional Requirements

- Error handling: invalid requests fail explicitly; duplicate schedules and
  serializable capacity conflicts return explicit conflict responses that tell
  the client to refresh availability.
- Data safety: enforcement must not mutate existing tracks, votes, rotation entries, or engagement history.
- Scope safety: this spec does not activate storage, transcoding, paid ad-slot
  runtime, ad category/link-target persistence, business account linking, action
  wheel visit behavior, or bulk replacement tooling.
- Replacement safety: the MVP create path is reject-only at cap boundaries because existing tracks may already carry rotation, vote, engagement, or tier lifecycle history.

## Architectural Boundaries

- Web tier must call the API and must not inspect Prisma state directly.
- Release Deck remains source-admin tooling, not listener profile functionality.
- Registrar owns source-origin authority and Home Scene assignment for managed sources.
- Broadcast/Fair Play owns rotation lifecycle after a track is accepted.

## Data Models And Migrations

Current track/source fields used:

- `Track.artistBandId`
- `Track.communityId`
- `Track.duration`
- `Track.status`
- `ArtistBand.homeSceneId`

Current schedule persistence uses `ReleaseDeckSchedule`:

- unique `trackId`;
- `communityId` and `artistBandId`;
- `scheduledFor`;
- `assignmentMode` (`soonest` or `chosen`);
- optional `requestedFor`;
- `status` (`scheduled` before ingestion, then `ingested` after a successful
  Fair Play rotation write);
- `capacitySnapshot`, `createdById`, and timestamps.

The model was introduced by
`apps/api/prisma/migrations/20260708150000_add_release_deck_schedule/migration.sql`.
Song-level sect backing remains future work and is not part of this schedule
model.

## API Design

### Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/tracks` | required | Creates a source-owned or user-uploaded track; managed source tracks enforce Release Deck active-slot and active-duration caps. |
| `GET` | `/release-deck/measurement` | required | Returns read-only Uprise-wide Release Deck readiness measurement. |
| `GET` | `/release-deck/schedule/availability` | source operator | Returns server-calculated date capacity, alternatives, or durable existing-schedule state for one managed source track. |
| `POST` | `/release-deck/schedule` | required | Creates one `soonest` or valid `chosen` schedule after source-operator authority and eligibility are revalidated. |

### Request / Response Notes

- `duration` is stored in seconds.
- source-owned `ready` Release Deck tracks must be `360` seconds or shorter.
- omitted `status` defaults to `ready`.
- `artistBandId` must resolve to a source managed by the signed-in user.
- `communityId` must exist and must match the managed source Home Scene when that source has one.
- schedule availability accepts `communityId`, `trackId`, date-only `from`, and
  `days` from `1` to `30`; `from` cannot precede the current UTC date;
- schedule creation accepts `communityId`, `trackId`, `mode`, and a date-only
  `requestedDate` only when `mode` is `chosen`;
- schedule writes revalidate source-operator authority and capacity; the web
  tier must not infer or override capacity from client-side state;
- schedule writes calculate a fresh current-day lookahead and accept `chosen`
  only when the requested date appears in that result;
- scheduling returns a `ReleaseDeckSchedule`; it does not return or create a
  Fair Play rotation entry.

## Web UI / Client Behavior

- `/source-dashboard/release-deck` remains the MVP Release Deck route.
- The route may present hosted URL input for now.
- The route may collect official external listen/buy/support links separately
  from the direct playable URL. External profile/page links should not be
  treated as direct playable media unless an approved integration explicitly
  supports playback.
- The route must block obvious over-length submissions before the API call and still treat the API as the source of truth.
- At cap boundaries, the route should present reject-only guidance: choose a different active song combination. It must not imply existing track history will be silently replaced.
- It must not imply real upload/storage/transcoding exists until a later spec activates it.
- It must not present the paid ad slot as another music upload slot.
- It may show the future paid ad category/link-target shape in design or docs,
  but must not save, purchase, record, sponsor-link, or expose linked-target
  actions until the owner contracts are updated.
- Scheduling UI must load server-owned availability for a source-owned ready
  row, offer the soonest valid date or one of the returned available dates, and
  show whether the saved schedule used `soonest` or `chosen` assignment. It must
  not imply that scheduling can purchase priority, reorder Fair Play, or shorten
  another song's protected run.
- If a schedule write loses a capacity race, the UI must refresh availability
  before another attempt. A response from a previous row or source context must
  not overwrite the currently loaded row.
- Row date presentation must not relabel track creation time as a scheduled
  release date. Until checked, it should say that the source must load the row;
  after checking, it may show unscheduled, unavailable, or the durable scheduled
  date returned by the API.
- Future readiness UI may show Uprise-wide deck totals, source cap usage, and
  sect readiness progress, but it must make clear which measurements are
  read-only diagnostics versus currently actionable source controls.

## Acceptance Tests / Test Plan

- API unit tests reject a fourth ready music slot for the same `artistBandId + communityId`.
- API unit tests reject source-owned ready Release Deck tracks longer than `360` seconds.
- API unit tests reject ready tracks that would push the same source above `900` active seconds in one community.
- Web validation tests reject source-owned Release Deck payloads longer than `360` seconds before submit.
- Scheduling service tests prove date-only validation, eligibility, daily and
  protected-window capacity across scheduled and ingested rows, alternatives,
  duplicate handling, source-operator authorization, active-city enforcement,
  current-window `chosen` validation, serializable write conflicts, `soonest`
  and `chosen` writes, and no Fair Play rotation write.
- Web scheduling tests prove the client requests server-owned availability,
  submits `soonest` and returned `chosen` alternatives, restores existing saved
  schedule state, refreshes after write conflicts, ignores stale row responses,
  announces available/unavailable completion, and does not expose Fair Play
  ordering controls.
- Fair Play ingestion tests prove every ingested schedule receives the
  broadcast-owned fixed `10` day protected New Releases run regardless of
  Uprise deck density.
- Future Uprise-wide deck measurement tests should prove source caps, distinct
  source counts, readiness inclusion/exclusion reasons, and sect-encoded minutes
  are computed from server-side data.
- API typecheck must pass.
- Docs lint must pass.

## Future Work And Open Questions

- Define an explicit history-safe replacement/edit endpoint only if a future slice needs track replacement after rotation/vote/engagement lifecycle semantics are owned.
- Define and implement the production trigger/job for due-schedule ingestion;
  the current admin endpoint supports explicit dry-run/write invocation.
- Define a dedicated schedule listing/read model if future Source Dashboard
  views need to load every schedule without checking rows individually.
- Define the exact song-level sect backing schema and Release Deck UI for
  encoding a song's sect readiness contribution.
- Define if and when paid ad-slot runtime becomes visible.
- Define the paid ad category and link-target contract for `release date`,
  `general`, `event`, and `sponsor`, including business-account linking and
  action-wheel visit behavior.
- Define storage/upload/transcode/waveform lifecycle if media infrastructure is activated.
