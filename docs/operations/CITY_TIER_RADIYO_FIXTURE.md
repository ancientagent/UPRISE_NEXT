# City-Tier RADIYO Fixture Preflight

Status: local staging support

This is a local, read-only preflight for founder-supplied audio. It creates a
JSON manifest only when explicitly given an output path. It never copies audio
into Git, connects to Prisma, calls an API, creates source accounts, uploads
media, starts a worker, or creates state/national aggregation.

## What It Proves

For one explicit `city + state + music community` tuple, the preflight checks
the current Release Deck and Fair Play constraints:

- at least `45` aggregate playable minutes;
- at least `5` distinct fixture source slots;
- no more than `3` ready tracks and `15` playable minutes per source slot;
- no track longer than `6` minutes;
- byte-identical audio is counted once; duplicate filenames and backup copies
  are reported as exclusions and cannot fill an extra source slot;
- a Uprise-wide schedule respecting the `15` minute daily intake cap and `45`
  minute overlapping protected-pool cap;
- each scheduled track enters New Releases on its scheduled date and becomes
  eligible for Main Rotation exactly `10` days later.

The generated source keys are fixture placeholders. Before any staging write,
each must be mapped to one distinct registered Artist/Band source in the target
active city-tier Home Scene.

## Run

From the repo root:

```bash
pnpm --filter api run inspect:city-tier-radiyo-fixture -- \
  --audio-dir "/mnt/c/Users/baris/OneDrive/Desktop/UPRISE TEST MUSIC/atxp" \
  --city "Austin" \
  --state "TX" \
  --music-community "Punk" \
  --start-date "2026-08-01" \
  --output "/mnt/c/Users/baris/uprise-agent-artifacts/radiyo-city-fixture/atxp-punk-manifest.json"
```

Use a hydrated local OneDrive folder. A no-audio result is an intentional
failure: it must not be replaced by generated tones, duplicate files, or music
from another fixture. The output path should remain outside the repository.

When the local corpus is already grouped by artist/source, preserve that
evidence instead of allowing the preflight to split tracks into synthetic
source slots:

```bash
pnpm --filter api run inspect:city-tier-radiyo-fixture -- \
  --audio-dir "/path/to/music-by-artist" \
  --source-group-depth 1 \
  --city "Austin" --state "TX" --music-community "Punk"
```

`--inventory` accepts a JSON array (or `{ "tracks": [...] }`) collected by a
read-only platform-specific inventory command. Each track needs `fileName`,
`path`, `durationSeconds`, `sha256`, `format`, and optionally `sourceKey`.
When every eligible track supplies `sourceKey`, the preflight preserves those
groups as the five required fixture sources.

## Boundary Before Staging

A green local manifest is not authority to write a database. Before any staging
load, confirm the target environment and real registered Artist/Band mappings,
then run the existing API dry-run lifecycle endpoints. Database writes,
provider uploads, the production worker, and all state/national work need
explicit founder approval.

Owner contracts: `docs/specs/media/release-deck-and-eligibility.md` and
`docs/specs/broadcast/radiyo-and-fair-play.md`.
