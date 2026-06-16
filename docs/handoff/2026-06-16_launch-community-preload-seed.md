# Launch Community Preload Seed

Date: 2026-06-16
Branch: `feat/launch-community-preload-seed`
Issue: `UPR-5`
Status: implementation slice

## Summary

Added an API-owned seed path for the current launch Home Scene matrix:

- Source data: `docs/specs/seed/launch-community-city-matrix.json`
- Matrix size: `6` cities x `8` music communities = `48` city-tier Home Scene tuples
- Seed command: `pnpm --filter api run seed:launch-communities`
- Prisma seed hook: `tsx prisma/seed.ts`

## Owner Policy

`Community.createdById` is required, so the seed creates or updates a deterministic non-listener system owner:

- email: `system-community-seed@uprise.local`
- username: `uprise-community-seed`
- display name: `UPRISE Community Seed`

This owner is only for deterministic launch scene records. It is not a listener profile and does not create city/community-specific behavior.

## Idempotency

The seed finds existing community rows by exact tuple:

```text
city + state + musicCommunity + tier = city
```

Existing tuple matches are updated with the current launch label/slug/active state. Missing tuple matches are created with the system owner.

No schema migration was added in this slice because the current `Community` model has no tuple-level unique constraint. The script therefore uses `findFirst` tuple lookup before create.

## Boundaries

- No state-tier or national-tier scenes are seeded.
- No Sects, generated channels, or sub-communities are seeded.
- No Home/Plot/player/action architecture changes are introduced.
- The command was not run against a live database in this implementation pass.

## Verification

Targeted tests were added in `apps/api/test/launch-community-seed.test.ts` to cover:

- `48` record expansion
- deterministic tuple-preserving slug shape
- expected-count validation
- deterministic system owner upsert
- existing tuple update vs missing tuple create behavior
