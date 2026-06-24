# 2026-06-24 Release Deck MVP Validation

## Status

Implemented on branch `fix/release-deck-mvp-validation`.

## Why

The launch audit marked Release Deck as preserve-worthy but prototype-shaped: the current MVP uses hosted file URLs and the existing `/tracks` ingestion seam, while real upload/storage/transcoding/waveform work remains deferred. The page already required signed-in source context and backend ownership validation, but payload validation lived inline and did not clearly enforce the hosted-file MVP boundary before submitting to `/tracks`.

## Changed

- `apps/web/src/lib/source/release-deck-validation.ts`
  - Added a focused payload builder for Release Deck track creation.
  - Requires nonblank title.
  - Requires positive numeric duration.
  - Requires hosted `http(s)` Audio File URL.
  - Validates optional Cover Art URL as hosted `http(s)` when provided.
  - Keeps payload source-owned with `artistBandId: activeSource.id`, source name, source Home Scene `communityId`, and `status: 'ready'`.
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
  - Uses the payload builder before calling `createTrack(payload, token)`.
  - Leaves source-context loading and backend write authority unchanged.
- Tests
  - Added helper tests for valid payload construction, title/duration validation, and hosted URL validation.
  - Updated the Release Deck shell lock to inspect the helper for payload/source/media-boundary rules.
- Docs
  - Updated the active Artist/Profile Source Dashboard brief.
  - Updated the Source Dashboard surface contract.
  - Updated changelog.

## Current Contract

- Release Deck remains a source-dashboard tool, not a listener upload path.
- Current MVP Release Deck creates source-owned ready tracks from explicit hosted `http(s)` audio URLs.
- Cover art is optional, but if provided it must also be `http(s)`.
- Backend ownership and source Home Scene matching remain authoritative through `/tracks`.
- Real upload, storage, transcoding, waveform extraction, and paid ad-slot mechanics remain deferred.

## Validation

Planned:

```bash
pnpm --filter web test -- release-deck-validation.test.ts release-deck-shell-lock.test.ts route-ux-consistency-lock.test.ts source-dashboard-shell-lock.test.ts
pnpm --filter web typecheck
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
```

## Notes

This slice does not implement media upload, storage, transcoding, waveform generation, billing, or the paid 10-second ad-slot runtime. It only hardens the current hosted-file MVP seam so future media work has a clear boundary.
