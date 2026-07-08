# Release Deck And Eligibility

**ID:** `MEDIA-RELEASE-DECK`
**Status:** `active`
**Owner:** `uprise-media-release`
**Last Updated:** `2026-07-08`

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

Future implementation must fail closed when a requested release date is not
valid and should return valid alternate dates so the source UI can offer
`soonest available` or another selected date. The recommended capacity unit is
playable minutes per Uprise release day/window rather than raw song count, but
the exact capacity algorithm remains a follow-up implementation contract.

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

## Non-Functional Requirements

- Error handling: rejections must be explicit `BadRequestException` responses.
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

No schema migration is added by this contract.

Current fields used:

- `Track.artistBandId`
- `Track.communityId`
- `Track.duration`
- `Track.status`
- `ArtistBand.homeSceneId`

Likely future fields/models for scheduled release implementation include a
scheduled release date, assignment mode (`auto` or selected/requested), capacity
diagnostics, and song-level sect backing references. This spec does not add a
migration by itself.

## API Design

### Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/tracks` | required | Creates a source-owned or user-uploaded track; managed source tracks enforce Release Deck active-slot and active-duration caps. |

### Request / Response Notes

- `duration` is stored in seconds.
- source-owned `ready` Release Deck tracks must be `360` seconds or shorter.
- omitted `status` defaults to `ready`.
- `artistBandId` must resolve to a source managed by the signed-in user.
- `communityId` must exist and must match the managed source Home Scene when that source has one.
- future scheduling endpoints must treat Release Deck as the source of release
  date assignment and must not let the web tier infer schedule capacity from
  client-side state alone.

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
- Future scheduling UI should show whether the source chose an available date or
  accepted the system's soonest valid date. It must not imply that scheduling can
  purchase priority or shorten another song's protected run.
- Future readiness UI may show Uprise-wide deck totals, source cap usage, and
  sect readiness progress, but it must make clear which measurements are
  read-only diagnostics versus currently actionable source controls.

## Acceptance Tests / Test Plan

- API unit tests reject a fourth ready music slot for the same `artistBandId + communityId`.
- API unit tests reject source-owned ready Release Deck tracks longer than `360` seconds.
- API unit tests reject ready tracks that would push the same source above `900` active seconds in one community.
- Web validation tests reject source-owned Release Deck payloads longer than `360` seconds before submit.
- Future release-date scheduling tests should prove every accepted song receives
  the broadcast-owned fixed protected New Releases run regardless of Uprise deck
  density.
- Future Uprise-wide deck measurement tests should prove source caps, distinct
  source counts, readiness inclusion/exclusion reasons, and sect-encoded minutes
  are computed from server-side data.
- API typecheck must pass.
- Docs lint must pass.

## Future Work And Open Questions

- Define an explicit history-safe replacement/edit endpoint only if a future slice needs track replacement after rotation/vote/engagement lifecycle semantics are owned.
- Define the exact release-date capacity algorithm, scheduled-release API shape,
  valid-date alternative response, and scheduler/job behavior.
- Define the exact song-level sect backing schema and Release Deck UI for
  encoding a song's sect readiness contribution.
- Define if and when paid ad-slot runtime becomes visible.
- Define the paid ad category and link-target contract for `release date`,
  `general`, `event`, and `sponsor`, including business-account linking and
  action-wheel visit behavior.
- Define storage/upload/transcode/waveform lifecycle if media infrastructure is activated.
