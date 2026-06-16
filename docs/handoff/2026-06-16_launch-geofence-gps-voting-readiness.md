# Launch Geofence GPS Voting Readiness

Date: 2026-06-16
Branch: `feat/gps-geofence-staging-readiness`
Agent: Codex
Status: staged and smoke-verified against Fly API staging + Neon staging

## Scope

This slice brings the launch Home Scene matrix to GPS voting readiness without adding city-specific runtime logic.

Implemented behavior:

- The existing `48` active city-tier Home Scene tuples receive geofences.
- Each launch city has one city-center `geography(Point, 4326)` and one `50000` meter voting radius.
- All `8` music-community scenes in the same launch city inherit that city's geofence.
- The launch seed upserts the `48` communities first, then updates geofences on the matching active tuples.
- The geofence seed aborts unless each expected active `{ city, state, musicCommunity, tier: city }` tuple updates exactly one row.
- No state/national scenes, tier routing, discovery-radius behavior, or community-specific architecture was added.

Also fixed during live smoke:

- Method-level `ZodBody` validation was incorrectly applying body schemas to route params.
- This broke `POST /tracks/:id/vote` on the hosted API with `Validation error: Expected object, received string`.
- `ZodValidationPipe` now validates only `metadata.type === 'body'`, with focused regression coverage.

## Files Changed

- `apps/api/prisma/seed.ts`
- `apps/api/src/seed/launch-community-seed.ts`
- `apps/api/src/common/pipes/zod-validation.pipe.ts`
- `apps/api/test/launch-community-seed.test.ts`
- `apps/api/test/zod-validation.pipe.test.ts`
- `apps/web/__tests__/launch-community-matrix.test.ts`
- `docs/CHANGELOG.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/specs/seed/README.md`
- `docs/specs/seed/launch-community-city-matrix.json`
- `docs/specs/users/onboarding-home-scene-resolution.md`

`art/` remained untouched.

## Launch Geofence Policy

Launch cities in `docs/specs/seed/launch-community-city-matrix.json` now carry:

| City | State | Latitude | Longitude | Radius |
| --- | --- | ---: | ---: | ---: |
| Austin | Texas | 30.2672 | -97.7431 | 50000m |
| Houston | Texas | 29.7604 | -95.3698 | 50000m |
| Dallas | Texas | 32.7767 | -96.7970 | 50000m |
| Los Angeles | California | 34.0522 | -118.2437 | 50000m |
| San Francisco | California | 37.7749 | -122.4194 | 50000m |
| San Diego | California | 32.7157 | -117.1611 | 50000m |

The seed writes geofences with `ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography` and `radius` in meters.

The web launch-matrix lock now preserves the old city/state/order and `48`-tuple assertions while explicitly allowing and validating the geofence metadata as seed data, not architecture variants.

## Local Verification

RED/GREEN seed tests:

- Initial RED confirmed missing `buildLaunchCommunityGeofenceSeedRecords` / `seedLaunchCommunityGeofences` exports.
- GREEN: `pnpm --filter api test -- launch-community-seed.test.ts --runInBand`
- GREEN: `pnpm --filter api test -- launch-community-seed.test.ts onboarding.home-scene-resolution.test.ts fair-play.vote.test.ts --runInBand`

RED/GREEN Zod pipe tests:

- Initial RED reproduced route-param validation drift: method-level body schema rejected a route param string.
- GREEN: `pnpm --filter api test -- zod-validation.pipe.test.ts --runInBand`
- GREEN: `pnpm --filter api test -- launch-community-seed.test.ts onboarding.home-scene-resolution.test.ts fair-play.vote.test.ts --runInBand`
- GREEN: `pnpm --filter web test -- launch-community-matrix.test.ts --runInBand`
- GREEN: `pnpm --filter api typecheck`

## Neon Staging Geofence Update

Applied against Neon staging with a guarded transaction.

Result:

```json
{
  "before": { "total": 48, "geofenced": 0 },
  "updated": 48,
  "after": {
    "total": 48,
    "geofenced": 48,
    "radius_50000": 48,
    "min_radius": 50000,
    "max_radius": 50000
  },
  "byCity": [
    { "city": "Los Angeles", "state": "California", "count": 8, "geofenced": 8, "latitude": "34.0522", "longitude": "-118.2437" },
    { "city": "San Diego", "state": "California", "count": 8, "geofenced": 8, "latitude": "32.7157", "longitude": "-117.1611" },
    { "city": "San Francisco", "state": "California", "count": 8, "geofenced": 8, "latitude": "37.7749", "longitude": "-122.4194" },
    { "city": "Austin", "state": "Texas", "count": 8, "geofenced": 8, "latitude": "30.2672", "longitude": "-97.7431" },
    { "city": "Dallas", "state": "Texas", "count": 8, "geofenced": 8, "latitude": "32.7767", "longitude": "-96.7970" },
    { "city": "Houston", "state": "Texas", "count": 8, "geofenced": 8, "latitude": "29.7604", "longitude": "-95.3698" }
  ]
}
```

## Fly API Staging

Deployed branch code to `uprise-api-staging`.

Fly image:

```text
uprise-api-staging:deployment-01KV91DJ4FWR89SJCQT96XXFX9
```

Status:

```text
Machine 2870191f055128, version 6, region ord, state started, 2/2 checks passing
```

Health checks:

- `GET https://uprise-api-staging.fly.dev/health/ready` returned `200` with healthy API, database, and PostGIS checks.
- `GET https://uprise-api-staging.fly.dev/health/postgis` returned `200` with PostGIS installed, `spatialRefSysCount: 8500`, and functionality test passed.

## Hosted Smoke Verification

Command:

```bash
node /tmp/uprise-neon-runner/staging-gps-vote-smoke.mjs
```

Result:

```json
{
  "smokeResult": {
    "exact": {
      "scene": "Austin, Texas • Punk",
      "gpsVerified": true,
      "votingEligible": true,
      "distance": 0,
      "voteId": "fafa7860-f859-4d8c-b1fa-ddce918d6d37"
    },
    "fallback": {
      "submitted": {
        "city": "El Paso",
        "state": "Texas",
        "musicCommunity": "Punk"
      },
      "scene": "Austin, Texas • Punk",
      "gpsVerified": true,
      "votingEligible": true,
      "distance": 0,
      "voteId": "56693601-9e6b-431c-8d4f-77876f93fd9b"
    }
  },
  "cleanupResult": {
    "deleted": {
      "votes": 2,
      "rotationEntries": 1,
      "tracks": 1,
      "memberships": 2,
      "requests": 0,
      "users": 2
    },
    "verify": {
      "remaining_users": 0,
      "remaining_tracks": 0,
      "remaining_rotation_entries": 0,
      "remaining_votes": 0,
      "launch_geofenced": 48,
      "total_communities": 48
    }
  }
}
```

## Boundaries / Follow-Ups

Not included in this slice:

- Production DB writes.
- State/national geofence or tier logic.
- Prime model structures, Sects, generated channels, or sub-communities.
- City-specific runtime branches.
- A separate submitted-location geocoder/geofence authority for non-launched pioneer cities.

Current active behavior remains:

- Exact active Home Scene users verify and vote against their exact scene geofence.
- Pioneer users whose submitted Home Scene is inactive/unavailable vote at the resolved active fallback scene after GPS verification against that fallback scene.
