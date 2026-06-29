# Release Deck And Eligibility

**ID:** `MEDIA-RELEASE-DECK`
**Status:** `active`
**Owner:** `uprise-media-release`
**Last Updated:** `2026-06-25`

## Overview And Purpose

Release Deck is the current source-facing path for a managed Artist/Band source
to submit music into its active Home Scene. This spec owns the Release Deck media
eligibility contract so source tools, Fair Play, and future media infrastructure
do not duplicate or reinterpret slot and rotation limits.

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

## Functional Requirements

- Release Deck has `3` active music slots per managed Artist/Band source per city-tier community.
- The paid `4th` ad-attachment slot is not a music slot and is not a standalone rotation entry.
- No single source may occupy more than `15` minutes (`900` seconds) of any one Uprise rotation at a time.
- Current API enforcement applies to `ready` tracks for the same `artistBandId + communityId`.
- Current MVP media ingest accepts explicit hosted `http(s)` audio URLs only.
- A song cannot be actively listed in more than one Uprise rotation at the same time.
- Source-owned tracks must attach to the managed source Home Scene; proxy-to-natural activation updates future upload routing through `ArtistBand.homeSceneId`.

## Current Runtime Enforcement

Implemented in `apps/api/src/tracks/tracks.service.ts`:

- when a signed-in user creates a `ready` track for a managed Artist/Band source and community, the API counts existing `ready` tracks for the same `artistBandId + communityId`;
- if there are already `3` ready tracks, the API rejects the upload;
- the API sums existing ready duration for the same `artistBandId + communityId`;
- if existing ready duration plus the new track duration exceeds `900` seconds, the API rejects the upload;
- `processing` and `failed` tracks are not counted as active rotation occupancy.

## Non-Functional Requirements

- Error handling: rejections must be explicit `BadRequestException` responses.
- Data safety: enforcement must not mutate existing tracks, votes, rotation entries, or engagement history.
- Scope safety: this spec does not activate storage, transcoding, paid ad-slot runtime, or bulk replacement tooling.

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

## API Design

### Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/tracks` | required | Creates a source-owned or user-uploaded track; managed source tracks enforce Release Deck active-slot and active-duration caps. |

### Request / Response Notes

- `duration` is stored in seconds.
- omitted `status` defaults to `ready`.
- `artistBandId` must resolve to a source managed by the signed-in user.
- `communityId` must exist and must match the managed source Home Scene when that source has one.

## Web UI / Client Behavior

- `/source-dashboard/release-deck` remains the MVP Release Deck route.
- The route may present hosted URL input for now.
- It must not imply real upload/storage/transcoding exists until a later spec activates it.
- It must not present the paid ad slot as another music upload slot.

## Acceptance Tests / Test Plan

- API unit tests reject a fourth ready music slot for the same `artistBandId + communityId`.
- API unit tests reject ready tracks that would push the same source above `900` active seconds in one community.
- API typecheck must pass.
- Docs lint must pass.

## Future Work And Open Questions

- Define replacement behavior when a source is already at the 3-slot or 15-minute active cap.
- Decide whether there is an explicit per-song length cap separate from the 15-minute active rotation cap.
- Define UI copy for cap failures and replacement flow.
- Define if and when paid ad-slot runtime becomes visible.
- Define storage/upload/transcode/waveform lifecycle if media infrastructure is activated.
