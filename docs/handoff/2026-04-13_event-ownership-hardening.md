# 2026-04-13 — Event Ownership Hardening

## Objective
Move new `Print Shop` events beyond creator-recognition-only behavior by adding an explicit optional source/entity link for events while keeping older inferred event reads working.

## What Changed
- `apps/api/prisma/schema.prisma`
  - added optional `artistBandId` to `Event`
  - added `ArtistBand.events` relation and event-side index
- `apps/api/prisma/migrations/20260414000500_add_event_artist_band_link/migration.sql`
  - adds the `artistBandId` column, index, and foreign key on `events`
- `packages/types/src/print-shop.ts`
  - added optional `artistBandId` to `CreatePrintShopEvent`
  - added optional/nullable `artistBandId` to `PrintShopEventRecord`
- `packages/types/src/event.ts`
  - added optional/nullable `artistBandId` to `Event`
- `apps/api/src/events/events.service.ts`
  - accepts optional `artistBandId`
  - validates that the signed-in user manages the submitted Artist/Band before accepting that link
  - rejects a submitted source when its Home Scene conflicts with the requested event community
  - persists the explicit source link on new event writes
- `apps/api/src/artist-bands/artist-bands.service.ts`
  - artist/band event reads now resolve explicit `artistBandId` links first, with legacy creator-based fallback preserved
- `apps/api/test/events.print-shop.service.test.ts`
  - added coverage for explicit source-linked event creation
  - added coverage for rejecting unmanaged source ids
- `apps/web/src/app/print-shop/page.tsx`
  - now submits `artistBandId: activeSource.id` from active source context
  - updated source-context copy to reflect direct event attachment for new writes
- `apps/web/src/app/source-dashboard/page.tsx`
  - updated current-context copy so it now says source-side releases and events can attach directly to the active source account
- `apps/web/__tests__/route-ux-consistency-lock.test.ts`
  - locked the new source-linked event wording and request shape

## Why
- `Release Deck` already moved new tracks onto explicit source ownership.
- `Print Shop` was still relying on creator-side inference only.
- That mismatch left source-side creator routes inconsistent inside the same dashboard system.

## Verification
- `pnpm --filter @uprise/types build`
- `pnpm --filter api prisma:generate`
- `pnpm --filter api test -- events.print-shop.service`
- `pnpm --filter web test -- route-ux-consistency-lock`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`
- `pnpm --filter api exec prisma migrate deploy`
- `pnpm run docs:lint`
- `git diff --check`

## Browser QA
- Opened `/plot`
- switched into `Youngblood QA Source`
- routed through `/source-dashboard` into `/print-shop`
- verified the `Source Context` block now states that new events from this lane attach directly to the active source account
- first automation submit surfaced a browser-fill quirk where `datetime-local` values did not reach form state
- retried with native input events so the live payload matched the intended dates
- created live event:
  - `Youngblood QA Source Event Link`
- verified success state on `/print-shop`

## Data Check
- Queried the latest created event row directly after browser submit
- confirmed:
  - `title = Youngblood QA Source Event Link`
  - `artistBandId = 2d037ba2-9bd9-446f-9321-09bea9fab593`
  - `createdById = c7b13819-c3cd-4121-9180-4667f6dc5909`
  - `communityId = 68582efb-1f08-44ad-a91e-5b98af64100a`

## Outcome
- New `Print Shop` events now have explicit source ownership when created from active source context.
- Older event reads remain compatible while the repo continues moving away from creator-only inference.
