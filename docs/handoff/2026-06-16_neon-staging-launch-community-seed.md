# Neon Staging Launch Community Seed

Date: 2026-06-16
Branch: `docs/upr-11-staging-seed`
Issue: `UPR-11`
Status: staging operation completed
Target: Neon project `uprise`, branch `staging`, database `uprise_staging`

## Summary

Applied the current Prisma schema migrations to Neon staging and seeded the launch Home Scene matrix into `uprise_staging`.

Result:

- Schema migrations applied: `19`
- Launch city-tier `Community` records present: `48`
- Active launch city-tier `Community` records present: `48`
- Seed owner users present: `1`
- State-tier or national-tier rows created by this operation: `0`

## Why This Was Needed

The implementation handoff for `UPR-5` added the seed path but explicitly did not run it against a live database. Before this operation, Neon staging contained only PostGIS extension tables/views and did not yet have the application schema, `_prisma_migrations`, `users`, or `communities`.

## Target Confirmation

The target was confirmed before the write operation:

- Neon organization: `UPRISE`
- Neon project: `uprise`
- Neon branch: `staging`
- Database: `uprise_staging`
- Host family: `ep-damp-cake-atvclrj2`

No production branch or production database was targeted.

## Transport Note

Local TCP connections to Neon timed out from this machine, including the pooled and direct hosts. The operation therefore used the official `@neondatabase/serverless` driver from a temporary runner under `/tmp/uprise-neon-runner`.

Repo package files were not modified. The temporary runner was outside the repo and used only for the staging operation.

## Migration Operation

The migration runner applied every `apps/api/prisma/migrations/*/migration.sql` file in order and inserted `_prisma_migrations` rows only after each migration committed successfully.

Applied migration directories:

1. `20241113000000_init_postgis`
2. `20260213154237_add_scene_and_sect_tags`
3. `20260213155806_add_signals_and_collections`
4. `20260216004000_add_user_home_scene_and_track_engagement`
5. `20260219162000_add_user_tuned_scene_context`
6. `20260219164000_add_collection_display_toggle`
7. `20260220130000_add_artist_bands_identity`
8. `20260220141000_add_registrar_entries`
9. `20260220170000_add_registrar_artist_members`
10. `20260220183000_add_registrar_invite_delivery`
11. `20260221220000_drop_user_is_artist`
12. `20260224101500_add_registrar_codes`
13. `20260224200000_add_user_capability_grants`
14. `20260224213000_add_capability_grant_audit_logs`
15. `20260410021500_add_fair_play_runtime_tables`
16. `20260413234500_add_track_artist_band_link`
17. `20260414000500_add_event_artist_band_link`
18. `20260420163000_add_artist_band_official_links`
19. `20260616061000_add_music_community_requests`

Post-operation `_prisma_migrations` count: `19`.

## Seed Operation

The seed used the same tuple and owner policy as `apps/api/src/seed/launch-community-seed.ts`:

- Matrix source: `docs/specs/seed/launch-community-city-matrix.json`
- Launch size: `6` cities x `8` music communities = `48` records
- Tier: `city`
- Active: `true`
- System owner email: `system-community-seed@uprise.local`
- System owner username: `uprise-community-seed`

Seed result:

```json
{
  "seed": "launch-communities",
  "created": 48,
  "updated": 0,
  "total": 48
}
```

The generated system owner ID is intentionally not treated as product doctrine. Future agents should look it up by `system-community-seed@uprise.local` if needed.

## Verification Snapshot

Post-seed verification returned:

```json
{
  "migration_count": 19,
  "total_users": 1,
  "seed_owner_users": 1,
  "total_communities": 48,
  "launch_tuple_communities": 48,
  "launch_active_communities": 48,
  "state_or_national_seeded": 0
}
```

City counts:

- `Austin, Texas`: `8`
- `Dallas, Texas`: `8`
- `Houston, Texas`: `8`
- `Los Angeles, California`: `8`
- `San Diego, California`: `8`
- `San Francisco, California`: `8`

Music-community counts:

- `Electronic`: `6`
- `Folk`: `6`
- `Hip-Hop`: `6`
- `Indie`: `6`
- `Noise`: `6`
- `Punk`: `6`
- `Singer-Songwriter`: `6`
- `Spoken Word / Poetry`: `6`

## Boundaries

- No production database operation was performed.
- No state-tier or national-tier community rows were created.
- No Sects, generated channels, sub-communities, or Prime-model structures were created.
- No app architecture changes were made.
- No repo dependency or lockfile changes were made.
- Secrets and full database URLs are intentionally omitted from this note.

## Carry-Forward

For future staging resets, use the repo-owned seed command when normal Prisma connectivity is available:

```bash
pnpm --filter api run seed:launch-communities
```

If local TCP remains blocked, use an explicit operational script outside the repo and document the target, branch, database, result counts, and verification snapshot again.
