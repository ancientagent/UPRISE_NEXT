# 2026-06-24 - Launch Community Seed Verification

Branch: `chore/launch-community-seed-verification`
Mode: dry-run + read-only verification tooling
Runtime changed: no product behavior changed
Provider state changed: no
Database writes run: no

## Summary

This slice keeps launch-community seed work on the safe path:

- Confirmed the dry-run launch seed plan still expands to `48` city-tier Home Scene records and `48` geofence records.
- Added a read-only verification command that checks a confirmed database target for every expected launch tuple and geofence.
- Did not run a write seed.
- Did not mutate Neon, Fly, Vercel, or local data.

## Commands

Dry-run seed plan:

```bash
pnpm --filter api run seed:launch-communities:dry-run
```

Read-only database verification, after confirming the intended database target:

```bash
DATABASE_URL="<confirmed staging database URL>" \
  pnpm --filter api run verify:launch-communities
```

The verification command checks:

- all expected `6 cities x 8 music communities = 48` active city-tier tuples exist;
- each tuple has a geofence;
- each tuple has the expected `50000` meter radius;
- each tuple geofence coordinates match `docs/specs/seed/launch-community-city-matrix.json`.

It uses only `SELECT` queries through Prisma `$queryRaw`; it does not call seed write helpers.

## Evidence

Dry-run output confirmed:

- `communities.total: 48`
- `geofences.total: 48`
- first tuple: `Austin, Texas Punk`
- last tuple: `San Diego, California Hip-Hop`

Safety validation confirmed the verifier fails closed when no target is supplied:

```bash
DATABASE_URL= pnpm --filter api run verify:launch-communities
```

Result:

```text
DATABASE_URL is required before running the launch community seed.
```

## Current Live Verification Blocker

Neon MCP lookup did not expose the UPRISE staging project in this session:

- `neon_postgres.search("uprise staging uprise_staging")` returned `[]`.
- `neon_postgres.list_shared_projects(search="uprise")` returned `count: 0`.
- `neon_postgres.list_shared_projects()` returned `count: 0`.

Because the active Neon connector cannot see the intended project, I did not run SQL against Neon through MCP and did not guess a database target.

## Files Changed

- `apps/api/package.json`
- `apps/api/scripts/verify-launch-community-seed.ts`
- `apps/api/test/launch-community-seed-verification.test.ts`
- `docs/CHANGELOG.md`
- `docs/specs/seed/README.md`
- `docs/handoff/2026-06-24_launch-community-seed-verification.md`

## Validation

Run in this slice:

```bash
pnpm --filter api run seed:launch-communities:dry-run
pnpm --filter api test -- launch-community-seed-verification.test.ts --runInBand
DATABASE_URL= pnpm --filter api run verify:launch-communities
```

The final command is expected to fail closed without `DATABASE_URL`.

## Next Action

To complete live staging verification, provide or expose one of:

- the correct Neon MCP account/project that can see project `uprise`, branch `staging`, database `uprise_staging`; or
- the confirmed Neon staging `DATABASE_URL` in the shell environment.

Then run:

```bash
DATABASE_URL="<confirmed staging database URL>" pnpm --filter api run verify:launch-communities
```
