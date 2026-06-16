# 2026-04-12 — Release Deck Runtime Slice

## Purpose
Add the first real artist-side release flow inside the Source Dashboard system without inventing a full media-upload or billing stack.

## What landed
- `Release Deck` is now a live tool card in `/source-dashboard`
- new route:
  - `/source-dashboard/release-deck`
- new web track client:
  - `apps/web/src/lib/tracks/client.ts`
- release form posts to:
  - `POST /tracks`
- payload is derived from active source context:
  - `artist` = active source name
  - `communityId` = active source Home Scene

## Runtime behavior
- source-facing only
- requires sign-in plus active managed source context
- shows the latest three ready singles as the current visible music slots
- allows a new single to be created from:
  - title
  - album
  - duration
  - audio file URL
  - cover art URL
- does not implement:
  - direct file upload pipeline
  - paid ad-slot recording
  - billing
  - slot-turnover/removal policy

## Why this slice
The backend already supports authenticated track creation via `/tracks`.
This slice makes the artist-side release system materially real inside Source Dashboard without fabricating media infrastructure that is not yet locked.
