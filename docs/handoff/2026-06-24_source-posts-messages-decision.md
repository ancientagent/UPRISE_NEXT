# 2026-06-24 Source Posts And Messages Decision

## Status

Implemented on branch `product/source-posts-decision`.

## Why

The launch task list asked for a docs/founder-decision pass on whether artists
and promoters posting messages to followers is MVP or later.

Existing source doctrine says sources can eventually issue follower updates and
freeform source messaging. Current Source Dashboard runtime does not implement
that surface and the active dashboard contract explicitly keeps social messaging
out of the MVP.

## Changed

- Added `docs/solutions/SOURCE_POSTS_MESSAGES_DECISION_PACKET_R1.md`.
- Updated `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md` so future
  source-dashboard agents know source posts/messages are deferred.
- Updated `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md` so the
  current live tool-card set cannot drift into a posts/messages card.
- Updated `docs/CHANGELOG.md`.

## Decision

- Source posts/messages are product-valid later, not current MVP runtime.
- Current Source Dashboard tool cards remain `Release Deck`, `Source Profile`,
  `Print Shop`, and `Registrar`.
- Do not add source posts/messages composers, follower inboxes, source
  notification fanout, Artist Profile post walls, or Plot Feed source composers
  until a dedicated implementation spec activates the feature.
- Do not treat socket `community-message` or direct-message prototypes as the
  source follower-update product.

## Evidence Checked

- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md` preserves
  source doctrine around follower updates, first-entry community-wide updates,
  and follower-only source announcements.
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md` lists current
  source-dashboard live tool cards and explicitly excludes social messaging.
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md` defines the current
  active source runtime around Artist Profile, Source Dashboard, Release Deck,
  Print Shop, and Registrar.
- Runtime search found socket chat/message prototypes, but no active
  source-owned follower update model or Source Dashboard posts/messages surface.

## Validation

Completed:

```bash
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
```

## Remaining Work

- Task 8 in the launch list: business/monetization boundary cleanup.
- Task 3 remains blocked until staging CORS is aligned for the intended Vercel
  origin, then browser/device onboarding QA can run.
