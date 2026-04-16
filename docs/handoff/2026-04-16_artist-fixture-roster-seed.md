# 2026-04-16 — Artist Fixture Roster Seed

## Summary
- Added a deterministic local QA seed helper that creates 10 artist-linked accounts in a city-tier community.
- The roster now also seeds qualifying signal activity so the current `Popular Singles` metrics lane can light up immediately during local QA.
- Non-single signal rows are also created for broader signal/feed testing without pretending they belong in the current singles-only metric contract.

## Command
From `apps/api`:

```bash
pnpm run seed:artist-fixture-roster
```

Optional overrides:
- `--community-id <uuid>`
- `--city <city>`
- `--state <state>`
- `--music-community <name>`
- `--password <value>`
- `--domain <email-domain>`
- `--count <1-10>`

## Result
- Reuses `Austin, TX / Punk` when present; otherwise falls back to the first available city-tier community.
- Upserts a deterministic 10-account artist roster.
- Ensures each seeded user has:
  - stable email and username
  - resettable shared fixture password on rerun
  - home-scene fields aligned to the seeded city-tier community
  - collection display enabled for profile/collection QA
- Ensures each seeded user has a linked `ArtistBand` source account with `entityType=artist`.
- Seeds signal activity alongside the roster:
  - `single` signals with deterministic `ADD`, `BLAST`, and `RECOMMEND` counts
  - matching collection rows for `ADD` actions
  - state-scene `rotation_entries` for a small `Recent Rises` shape
  - `uprise` signals with their own action counts for later general-signal/feed work

## Why
- The current MVP cleanup is shifting more discovery value into feed moments and source/profile surfaces.
- That work benefits from a reusable artist roster with real signal/action data instead of one-off manual dev accounts and hollow metrics.
