# 2026-06-24 Media Storage Decision Packet

## Status

Implemented on branch `product/media-storage-decision`.

## Why

The launch task list asked for a media/storage decision before any worker build:
decide S3 vs R2 and decide whether real upload/transcoding is launch-critical or
deferred.

The current source-dashboard runtime already supports the launch-safe Release
Deck seam: source-owned tracks are created from explicit hosted `http(s)` audio
URLs. The worker code exists, but it is not ready to become a provider-backed
launch path without a separate implementation slice.

## Changed

- Added `docs/solutions/MEDIA_STORAGE_DECISION_PACKET_R1.md`.
- Updated `docs/DEPLOY_ENV_MATRIX_R1.md` so storage/worker env remains deferred
  for current staging, with R2 as the recommended first media-staging default
  only when media upload/read is explicitly activated.
- Updated `docs/solutions/FIRST_STAGING_TARGET_VERCEL_FLY_NEON_R1.md` so the
  first staging target continues to exclude hosted workers and S3/R2 media path.
- Updated `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md` so source
  agents load the media decision before changing Release Deck media behavior.
- Updated `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md` with the
  media decision pointer.
- Updated `docs/CHANGELOG.md`.

## Decision

- Current MVP keeps Release Deck URL-only.
- Real upload, storage, transcoding, waveform extraction, queue runtime, worker
  deployment, and paid ad-slot media mechanics remain deferred.
- Do not deploy or require `apps/workers/transcoder` for the current
  web/API/Neon staging path.
- When media upload/read is explicitly activated, use the S3-compatible
  abstraction and prefer Cloudflare R2 as the first staging default unless a
  confirmed AWS operational requirement makes S3 the better choice.
- No provider resources, buckets, secrets, env vars, or domains were changed.

## Evidence Checked

- `apps/web/src/lib/source/release-deck-validation.ts` already enforces hosted
  `http(s)` audio/cover URLs for the current MVP payload.
- `apps/workers/transcoder/src/processor.ts` expects BullMQ jobs, S3/R2-style
  source URLs, FFmpeg transcoding, storage upload, and API callback behavior.
- `apps/workers/transcoder/src/services/waveform.ts` currently generates random
  sample data and is not launch waveform extraction.
- `apps/workers/transcoder/src/services/webhook.ts` posts to
  `/webhooks/transcode/:trackId`; the API callback contract is not activated as
  launch scope.
- Worker env naming currently differs from `docs/DEPLOY_ENV_MATRIX_R1.md`, so
  media activation must include env reconciliation.

## Validation

Completed:

```bash
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
```

## Remaining Work

- Task 7 in the launch list: create the Source posts/messages decision packet.
- Task 8 in the launch list: business/monetization boundary cleanup.
- Task 3 remains blocked until staging CORS is aligned for the intended Vercel
  origin, then browser/device onboarding QA can run.
