# Media Storage Decision Packet R1

Status: Active decision packet
Owner: Founder + product engineering
Last updated: 2026-06-24

## Purpose

Decide the current launch posture for UPRISE media storage and transcoding so
agents do not accidentally turn the source-dashboard Release Deck into a
storage/worker implementation slice.

This packet is scoped to media ingestion, storage provider choice, and
transcoder activation timing. It does not authorize billing, paid ad-slot
runtime, full catalogue expansion, or business-dashboard work.

## Decision

Current MVP launch path:

- Keep Release Deck URL-only.
- Current source-owned tracks are created from explicit hosted `http(s)` audio
  URLs through `/source-dashboard/release-deck`.
- Real upload, object storage, transcoding, waveform extraction, queue runtime,
  and worker deployment are deferred.
- Do not deploy or require `apps/workers/transcoder` for the current
  web/API/Neon staging path.

Provider direction when media is activated:

- Use the S3-compatible abstraction already implied by the worker.
- Recommended first staging provider: Cloudflare R2, because it keeps the S3 API
  shape while making public/media egress economics simpler for an early music
  platform.
- AWS S3 remains acceptable if operational requirements, existing AWS account
  ownership, lifecycle tooling, or future AWS worker placement make it the
  better confirmed provider.
- No bucket, credential, env, provider, or domain change is authorized by this
  packet. Provider setup still requires explicit account/workspace confirmation.

## Current Runtime Truth

Release Deck:

- `apps/web/src/lib/source/release-deck-validation.ts` builds the current
  Release Deck payload.
- It requires a nonblank title, positive duration, hosted `http(s)` audio URL,
  optional hosted `http(s)` cover URL, active source ID, source name, source Home
  Scene `communityId`, and `status: 'ready'`.
- It does not upload files, sign upload URLs, enqueue transcode jobs, create
  waveform data, or attach paid ad-slot media.

Worker:

- `apps/workers/transcoder` exists as prototype worker infrastructure.
- It expects BullMQ jobs with `trackId`, `sourceUrl`, output formats, and
  optional waveform generation.
- It downloads from S3/R2-style storage, transcodes with FFmpeg, uploads outputs,
  and posts completion to `/webhooks/transcode/:trackId`.
- The current worker is not a launch-ready production path.

Known worker gaps:

- `apps/workers/transcoder/src/services/waveform.ts` generates random sample
  data instead of extracting real audio peaks.
- `apps/workers/transcoder/src/services/webhook.ts` posts to
  `/webhooks/transcode/:trackId`, but the API receiver is not currently a locked
  launch contract.
- Worker config uses `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`,
  `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD`, while
  `docs/DEPLOY_ENV_MATRIX_R1.md` currently documents `S3_REGION`,
  `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, and `REDIS_URL`.
- Public URL behavior is not locked. `S3_PUBLIC_URL` is referenced by worker
  storage code but is not yet part of the deploy matrix.
- Object key conventions, bucket CORS, private/public policy, signed upload
  URLs, lifecycle rules, and retry/observability behavior are not finalized.

## Why Real Upload/Transcode Is Deferred

- The current launch-critical path is web -> API -> Neon/PostGIS, onboarding,
  Home Scene, source-dashboard MVP tooling, and read-only listener surfaces.
- Real media ingestion introduces provider credentials, bucket policy, queue
  runtime, worker deployment, webhook auth, object lifecycle, media validation,
  and cost controls.
- Implementing that now would widen the launch slice and increase provider-state
  risk before the hosted web/API/database path is fully stable.
- The existing URL-only Release Deck seam is enough for current MVP source-owned
  track testing if source operators provide hosted audio URLs.

## Activation Criteria

Open the media implementation slice only when at least one of these is true:

- launch requires artists/sources to upload audio files directly through UPRISE;
- hosted test users cannot reasonably supply hosted `http(s)` audio URLs;
- waveform display becomes launch-critical;
- paid ad-slot media attachment becomes active scope;
- the source-dashboard launch review explicitly moves media processing into the
  current phase.

Until one of those criteria is met, agents must treat media upload, storage,
transcoding, waveform extraction, and worker deployment as deferred.

## Future Implementation Checklist

When the media path is activated, implement it as one explicit slice or a small
series of tightly ordered slices:

1. Provider confirmation
   - Confirm Cloudflare R2 or AWS S3 from the visible provider account/workspace.
   - Create separate staging and production buckets only after approval.
   - Record bucket names and provider ownership in the deploy docs.

2. Env contract reconciliation
   - Align worker code and deploy matrix on one env naming scheme.
   - Include storage endpoint, region, bucket, access key, secret key, public URL
     or signed-read strategy, queue connection, API callback URL, and webhook
     secret.
   - Keep all storage and queue secrets out of `apps/web`.

3. Upload contract
   - Add API-owned signed upload initiation if direct uploads are used.
   - Define object key conventions for source ID, track ID, original media,
     derived media, and cover art.
   - Validate content type, size, duration, and ownership before a track becomes
     playable.

4. Queue and worker lifecycle
   - Enqueue transcode jobs from the API, not from the web tier.
   - Track statuses such as uploaded, processing, ready, and failed.
   - Ensure retries are bounded and observable.

5. Webhook/API receiver
   - Implement and test the worker callback endpoint.
   - Verify webhook authentication.
   - Reject callbacks that do not match the expected track/source state.

6. Waveform extraction
   - Replace random waveform samples with deterministic audio-derived peaks.
   - Add tests around shape and persistence, not random output.

7. Staging smoke
   - Upload a staging fixture.
   - Confirm object storage write/read.
   - Confirm transcode job completion or failure reporting.
   - Confirm no secret or bucket credential reaches `apps/web`.

## Non-Goals

- Do not build media upload as part of generic deployment readiness.
- Do not add billing, source analytics, paid promotion runtime, or ad-slot media
  mechanics in this slice.
- Do not turn Release Deck into a listener upload surface.
- Do not add city-specific media behavior or fixture-only defaults to runtime.
- Do not deploy worker/storage provider resources without explicit approval.

## Agent Guidance

For current Release Deck/source-dashboard work:

- Load `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`.
- Preserve URL-only track creation unless the media activation criteria above
  are explicitly met.
- Keep source ownership and source Home Scene attachment authoritative.
- Update this packet if media activation timing or provider choice changes.

For future deployment/provider work:

- Load `docs/DEPLOY_ENV_MATRIX_R1.md`,
  `docs/solutions/DEPLOY_TARGET_READINESS_R1.md`, and this packet.
- Verify visible provider account/workspace before creating buckets, queue
  resources, secrets, or domains.
