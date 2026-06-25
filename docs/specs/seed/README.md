# Seed Data (Implementation Support)

This folder contains **implementation seed data** used for onboarding and routing. It is **not canon** and must never override `docs/canon/` semantics.

## Contents

- `music-communities.json` — MVP launch Music Community list shown during onboarding.
- `launch-community-city-matrix.json` — Current city-tier launch matrix; `6` cities x `8` music communities = `48` operational Home Scene tuples.
- `taste-tag-map.json` — Mapping of taste tags to parent Music Communities (routing only).
- `music-community-taxonomy.md` — Internal taxonomy reference (not user-facing).
- `hotspot-cities.provisional.json` — Provisional candidate hotspot / launch cities for beta preload and major-node assignment support; includes source annotations and founder-supplied supplements.

## Rules

- These lists are implementation support and must not override canon.
- `music-communities.json` is the current MVP onboarding selector list.
- `music-community-taxonomy.md` is a broader internal reference and must not be treated as the current onboarding selector.
- Home Scene architecture is invariant. City and music-community identity change the scene data, membership, content, activity, and later generated Prime-model structures; they must not change runtime behavior, tabs, menus, actions, player rules, or routing.
- The launch seed defines active major-node Home Scenes / music capitals. New city-tier communities split off later through artist/source registration and Registrar/source activation when local artist/music concentration justifies it; listener onboarding counts do not activate communities.
- Sects, generated channels, and sub-communities happen later through the Prime model; they are not launch-time architecture variants.
- `hotspot-cities.provisional.json` is an implementation-support candidate list, not canon, and may include founder-supplied additions that are not yet reflected in external source rankings.
- `launchOpen: true` inside `hotspot-cities.provisional.json` marks the cities currently intended to be operationally open for launch work on this branch.
- Tags are used for routing and Scene Map clustering only.
- Do not introduce new structural terms here; use canon vocabulary in specs.

## Launch Community Preload

The API package owns the deterministic preload path for the current launch matrix.

Run from the repo root when a target database has been intentionally selected:

```bash
pnpm --filter api run seed:launch-communities
```

Dry-run first from the repo root to inspect the exact launch matrix without
opening a Prisma connection or writing to any database:

```bash
pnpm --filter api run seed:launch-communities:dry-run
```

Read-only verification can confirm an intentionally selected database already
has the expected `48` active city-tier tuples and geofences without running the
write seed:

```bash
DATABASE_URL="<confirmed database URL>" pnpm --filter api run verify:launch-communities
```

This verifier uses only `SELECT` queries. It checks every expected
`city + state + music community` tuple, geofence presence, `50000` meter radius,
and the launch-city coordinates from `launch-community-city-matrix.json`.

Safety:

- Local database targets with host `localhost`, `127.0.0.1`, or `::1` can run
  without an extra confirmation variable.
- Any non-local `DATABASE_URL` is refused unless
  `UPRISE_CONFIRM_LAUNCH_COMMUNITY_SEED` matches the database name in this
  exact form:

```bash
UPRISE_CONFIRM_LAUNCH_COMMUNITY_SEED=seed-launch-communities:<database_name>
```

Example for the staging database name documented in the deploy matrix:

```bash
DATABASE_URL="<confirmed Neon pooled URL for uprise_staging>" \
UPRISE_CONFIRM_LAUNCH_COMMUNITY_SEED=seed-launch-communities:uprise_staging \
pnpm --filter api run seed:launch-communities
```

Behavior:

- Reads `docs/specs/seed/launch-community-city-matrix.json`.
- Builds the `48` city-tier Home Scene tuples from the full `city + state + music community` identity.
- Upserts a deterministic non-listener system owner user: `system-community-seed@uprise.local`.
- Finds existing `Community` rows by exact `{ city, state, musicCommunity, tier: "city" }`.
- Updates existing tuple matches and creates only missing rows.
- Applies the launch geofence policy to the same `48` active city-tier rows:
  - each launch city has one city-center point and one `50000` meter voting radius;
  - all `8` launch music-community scenes in that city inherit the same city geofence;
  - the geofence is written with PostGIS as `geography(Point, 4326)` and `radius` in meters.
- Does not create state/national scenes or community-specific architecture variants.
- Does not use geofence radius as tier logic, discovery scope, or state/national proximity behavior.

Do not run this command against production or staging without confirming the target `DATABASE_URL`.
