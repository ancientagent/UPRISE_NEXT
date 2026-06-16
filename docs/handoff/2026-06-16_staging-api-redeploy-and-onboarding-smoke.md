# Staging API Redeploy And Onboarding Smoke

Date: 2026-06-16
Agent: Codex
Status: completed
Scope: Fly API staging deploy, Neon staging smoke-residue cleanup, hosted onboarding smoke verification

## Summary

Current `main` was deployed to Fly app `uprise-api-staging` so staging API includes the UPR-10 onboarding fallback/voting-anchor behavior. A stale pre-UPR-10 smoke run had left two disposable smoke users and one accidental inactive `El Paso, Texas • Punk` community row in Neon staging. Those records were removed with a guarded transaction. The hosted web/API/database path was then smoke-tested end-to-end and the smoke users/requests/memberships from the verification run were cleaned up.

## Baseline

- Repo branch before docs update: `main`
- Repo commit: `124fdc72067d1ec12ecb460a65209b027faeed00`
- Fly app: `uprise-api-staging`
- Fly image after deploy: `uprise-api-staging:deployment-01KV9067ZSY27R28YERF80V8S6`
- Fly machine: `2870191f055128`
- Fly version: `5`
- Vercel web: `https://uprise-web-staging.vercel.app`
- Neon staging database: `uprise_staging`

## Classification

- Stale API behavior: `environment`
  - Fly API was still running the pre-UPR-10 image before redeploy.
- Stale smoke data: `fixture/data`
  - Disposable users and the inactive El Paso/Punk community were created by smoke checks against the stale API.
- Product implementation: no new bug found in current deployed API after redeploy.

## Fly Deploy Evidence

Deploy command used from repo root:

```bash
~/.fly/bin/flyctl deploy --config fly.api.staging.toml --app uprise-api-staging --remote-only --now
```

Post-deploy status showed:

- app `uprise-api-staging`
- image `uprise-api-staging:deployment-01KV9067ZSY27R28YERF80V8S6`
- machine `2870191f055128`
- version `5`
- state `started`
- checks `2 total, 2 passing`

Health endpoints returned healthy:

- `GET /health/live`: `status=healthy`
- `GET /health/ready`: `api=healthy`, `database=healthy`, `postgis=healthy`
- `GET /health/postgis`: `installed=true`, functionality test passed

## Stale Residue Cleanup

Pre-cleanup Neon evidence:

- total communities: `49`
- active launch communities: `48`
- target users:
  - `smokeexact1781639593311`
  - `smokefallback1781639593311`
- accidental inactive community:
  - `El Paso, Texas • Punk`
  - tier `city`
  - `isActive=false`
  - id `2675aeba-6718-4024-a95b-38fc66b78bd2`

Dependency count before deletion found only:

- `community_members` by target users: `2`
- `community_members` by inactive El Paso/Punk community: `1`
- no tracks, events, votes, registrar entries, signals, collections, artist bands, rotations, or sect tags

Cleanup deleted:

- community memberships: `2`
- music community requests: `0`
- stale inactive community: `1`
- disposable users: `2`

Post-cleanup verification:

- remaining target users: `0`
- remaining inactive El Paso/Punk communities: `0`
- active launch communities: `48`
- total communities: `48`

## Hosted Smoke Verification

Smoke run id: `1781640220133`

The smoke run used public staging API endpoints and direct Neon verification. It registered temporary users for exact, fallback, and intake flows, then cleaned them up in a `finally` block.

### API Health

- `/health/live`: `healthy`
- `/health/ready`: `healthy`
- database readiness: `healthy`
- PostGIS readiness: `healthy`
- PostGIS installed: `true`
- PostGIS functionality test: `true`

### Exact Home Scene

Input:

- city: `Austin`
- state: `Texas`
- music community: `Punk`

Result:

- resolved scene: `Austin, Texas • Punk`
- `pioneer=false`
- `tunedSceneId` matched `resolvedCitySceneId`
- `resolvedCitySceneId=cf026614-4054-43f0-ae70-37796b7a3552`

### Fallback / Pioneer Home Scene

Input:

- city: `El Paso`
- state: `Texas`
- music community: `Punk`

Result:

- submitted pioneer intent was preserved as `El Paso, Texas • Punk`
- resolved active scene: `Austin, Texas • Punk`
- `pioneer=true`
- `tunedSceneId` matched `resolvedCitySceneId`
- `resolvedCitySceneId=cf026614-4054-43f0-ae70-37796b7a3552`
- no inactive El Paso/Punk community was created

### GPS / Voting Gate

GPS verification against the fallback user returned:

- `gpsVerified=false`
- `votingEligible=false`
- `reason=SCENE_NO_GEOFENCE`
- `votingSceneId=cf026614-4054-43f0-ae70-37796b7a3552`

This matches the current staging seed state: launch communities do not yet have geofence/radius data, so Home Scene affiliation can persist but voting remains disabled until geofence verification can pass.

### Missing Music Community Intake

Input requested missing parent community:

- `Smoke Missing Parent 1781640220133`
- city: `Austin`
- state: `Texas`

Result:

- request status: `submitted`
- `distinctRequesterCount=1`
- `distinctCityCount=1`
- response did not include a `Community` id
- direct DB verification found one intake row during the smoke and zero accidental community rows for that requested name

### Smoke Cleanup

After smoke verification, cleanup deleted:

- music community requests: `1`
- community memberships: `2`
- temporary users: `3`

Final Neon verification after cleanup:

- remaining smoke users: `0`
- remaining smoke request rows: `0`
- inactive El Paso/Punk communities: `0`
- active launch communities: `48`
- total communities: `48`

## Web Verification

`https://uprise-web-staging.vercel.app/onboarding` returned the expected onboarding surface markers:

- approved selector includes `Punk`
- approved selector includes `Electronic`
- approved selector includes `Spoken Word / Poetry`
- approved selector includes `Hip-Hop`
- copy includes `Selection only from the approved parent communities`
- missing-community copy says it does not create a live scene or add the request to the onboarding selector

## Seed Verification

`node /tmp/uprise-neon-runner/verify-seed.mjs` returned:

- migration count: `19`
- total users: `1`
- seed owner users: `1`
- total communities: `48`
- launch tuple communities: `48`
- launch active communities: `48`
- state or national seeded: `0`

By city:

- Austin, Texas: `8`
- Dallas, Texas: `8`
- Houston, Texas: `8`
- Los Angeles, California: `8`
- San Diego, California: `8`
- San Francisco, California: `8`

By music community:

- Punk: `6`
- Electronic: `6`
- Noise: `6`
- Spoken Word / Poetry: `6`
- Indie: `6`
- Folk: `6`
- Singer-Songwriter: `6`
- Hip-Hop: `6`

## Boundaries

- No production deploy was performed.
- No new migration was added.
- No launch community rows were deleted or modified except member-count recalculation for affected smoke membership cleanup.
- No `art/` files were inspected, staged, or modified.
- No socket, worker, storage, or geofence setup was activated.
- Linear was not updated because the available connector/workspace context was not confirmed for UPRISE.

## Follow-Up

- Add geofence/radius data for launch communities when the GPS voting slice is active.
- Keep socket/storage/workers deferred until the web/API/DB staging path remains repeatable.
- If Linear workspace access is corrected, mirror this staging baseline as a UPRISE operational note or issue closure, not a GISTer/GIS item.
