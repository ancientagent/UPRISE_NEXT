# Official Sect And Song-Level Backing Foundation — Slice 6 Plan

**Date:** 2026-07-14

**Branch:** `codex/official-sect-backing-foundation`

**Base:** `origin/main` at `c9992c3`

**Status:** plan pending independent review; no runtime or schema implementation yet

## A. Evidence Used

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`
- `docs/specs/system/documentation-framework.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/system/registrar.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/DECISIONS_REQUIRED.md`
- `docs/solutions/RELEASE_DECK_RADIYO_SECT_IMPLEMENTATION_ARCHITECTURE_R1.md`
- current Prisma schema and migration conventions
- current Registrar sect-motion skeleton and Release Deck source-operator patterns

## B. Current State Versus Deferred Or Unknown

Current repo truth:

- `SectTag` and `UserTag` are legacy/non-authoritative tag structures;
- no durable Official `Sect` entity exists;
- no song-level `TrackSectBacking` persistence exists;
- Registrar owns who may authorize a song backing, while Release Deck owns where
  the song-level encoding is stored and measured;
- readiness must count explicit song-level backing, never whole-source
  affiliation, passive genre/style metadata, or listener taste tags;
- a readiness-bearing song may count toward at most one Sect at a time in R1;
- Official Sect status is pre-Uprise and does not grant broadcast authority;
- public progress, affiliation UI, update channels, approval, and Sect Uprise
  activation are not implemented.

Deferred or unresolved:

- the exact Registrar-authorized source-to-Sect affiliation record and approval
  flow;
- who may approve or revoke that authority;
- public visibility and discovery timing;
- source/song backing limits and paid/free backing capacity;
- replacement/reassignment semantics after a backing is removed or rejected;
- motion approval and Sect Uprise activation.

These open decisions block a public backing write endpoint. They do not block a
schema-only persistence foundation when the migration creates no rows and no
runtime writer.

## C. Feature Review And Scope Decision

The architecture document names a broad Slice 6 containing schema, services,
eligibility checks, and Registrar authorization. Current owner specs do not yet
define the authorization record or approval flow strongly enough to implement
that whole write path without inventing policy.

This plan therefore divides the work:

### Slice 6A — Authorized In This Plan

Add only the durable persistence foundation:

- Official `Sect`, parented to one `Community`;
- `TrackSectBacking`, joining one track to one Sect and recording the claimed
  source/operator identity;
- relations and indexes required by the architecture;
- one-row-per-track R1 uniqueness, matching the current architecture proposal;
- a forward-only additive migration;
- schema/status documentation stating that no write path is active.

### Slice 6B — Explicitly Deferred

Do not add:

- backing create/delete/update service methods;
- controller or API routes;
- Source Dashboard or Registrar UI;
- source-to-Sect affiliation tables or inferred authority;
- promotion of `SectTag` or `UserTag` data;
- seed/backfill rows;
- public discovery/progress;
- readiness calculation or Sect Uprise activation.

The next owner-contract decision must define the Registrar authority source and
backing lifecycle before Slice 6B can begin.

## D. Proposed Persistence Contract

### `Sect`

Fields:

- `id String @id @default(uuid())`
- `parentCommunityId String`
- `name String`
- `slug String`
- `status String @default("official")`
- `createdByRegistrarEntryId String?`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- parent `Community` with `onDelete: Restrict`;
- optional originating `RegistrarEntry` with `onDelete: SetNull`;
- child `TrackSectBacking[]`.

Constraints:

- `@@unique([parentCommunityId, slug])`
- `@@index([parentCommunityId, status])`
- `@@index([createdByRegistrarEntryId])`
- `@@map("sects")`

The database relation guarantees parent ownership, while the future authorized
writer must enforce that the parent is an active city-tier community. This
checkpoint does not create a writer and therefore makes no false claim that the
tier invariant is already runtime-enforced.

### `TrackSectBacking`

Fields:

- `id String @id @default(uuid())`
- `trackId String @unique`
- `sectId String`
- `artistBandId String`
- `encodedById String`
- `status String @default("active")`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt`

Relations:

- `Track` with `onDelete: Cascade`;
- `Sect` with `onDelete: Restrict`;
- `ArtistBand` with `onDelete: Restrict`;
- encoding `User` with `onDelete: Restrict`.

Indexes:

- unique `trackId`, enforcing one R1 backing record per song;
- `@@index([sectId, status])`;
- `@@index([artistBandId, sectId])`;
- `@@index([encodedById])`;
- `@@map("track_sect_backings")`.

The model records claimed source/operator provenance but does not itself prove
Registrar authority. Only the later authority-checked writer can create rows.
No seed, fixture, or direct SQL insertion belongs in this slice.

## E. Implementation Tasks

### Task 1 — Lock The Schema Diff With A Failing Contract Check

Files:

- add `apps/api/test/official-sect-backing-schema.test.ts`
- inspect `apps/api/prisma/schema.prisma`

Work:

1. Add a focused file-contract test that reads the Prisma schema and asserts
   the two model names, mapped table names, parent-scoped Sect slug uniqueness,
   unique song backing, and required relations/indexes.
2. Run the test and confirm it fails because the models do not exist.
3. Do not use this text check as the only validation; Prisma validation and
   generation remain mandatory.

Validation:

```bash
pnpm --filter api test -- official-sect-backing-schema.test.ts --runInBand
```

### Task 2 — Add The Additive Prisma Models And Relations

File:

- `apps/api/prisma/schema.prisma`

Work:

1. Add `Sect` and `TrackSectBacking` exactly within the reviewed contract.
2. Add relation arrays/fields to `Community`, `RegistrarEntry`, `Track`,
   `ArtistBand`, and `User` without changing unrelated relation behavior.
3. Run Prisma formatting, validation, and generation.
4. Run the focused contract test and API typecheck.

Validation:

```bash
pnpm --filter api exec prisma format --schema prisma/schema.prisma
pnpm --filter api exec prisma validate --schema prisma/schema.prisma
pnpm --filter api run prisma:generate
pnpm --filter api test -- official-sect-backing-schema.test.ts --runInBand
pnpm --filter api typecheck
```

### Task 3 — Add And Inspect The Forward Migration

Files:

- add one timestamped migration under `apps/api/prisma/migrations/**/migration.sql`

Work:

1. Create `sects` before `track_sect_backings`.
2. Add primary keys, unique indexes, secondary indexes, and foreign keys that
   match the reviewed Prisma relations.
3. Do not run `prisma migrate dev`, deploy a migration, or mutate Neon/local
   provider state in this slice.
4. Verify SQL/schema alignment through review, Prisma validation/generation,
   and the repository CI migration job once a PR is opened.

Validation:

```bash
pnpm --filter api exec prisma validate --schema prisma/schema.prisma
pnpm --filter api run prisma:generate
git diff --check
```

### Task 4 — Update Only Implementation-State Documentation

Files:

- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/system/registrar.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/solutions/RELEASE_DECK_RADIYO_SECT_IMPLEMENTATION_ARCHITECTURE_R1.md`
- `docs/CHANGELOG.md`
- this handoff

Work:

1. Mark only the persistence foundation implemented.
2. Continue to state that no official affiliation writer, backing API/UI,
   readiness diagnostic, public progress, update channel, or Sect Uprise
   activation exists.
3. Preserve unresolved authority, lifecycle, backing-limit, paid/free-capacity,
   and visibility decisions.

Validation:

```bash
pnpm run docs:lint
```

### Task 5 — Verify And Request Independent Implementation Review

Validation:

```bash
pnpm --filter api test -- official-sect-backing-schema.test.ts --runInBand
pnpm --filter api exec prisma validate --schema prisma/schema.prisma
pnpm --filter api run prisma:generate
pnpm --filter api typecheck
pnpm run verify
pnpm run workspace:audit
git diff --check origin/main..HEAD
git status --short
```

Reviewer must check:

- schema/migration parity;
- deletion behavior and uniqueness;
- no legacy tag promotion;
- no public/runtime write surface;
- no invented Registrar authority;
- no provider/database mutation;
- owner docs do not overstate implementation.

## F. Slice 7 Entry Condition

After Slice 6A passes implementation review, write a separate plan for the
read-only `SectReadinessService`. It may count only active backing records that
join to ready, playable, source-owned tracks in the Sect parent community; cap
each source at `900` seconds; require `2700` capped seconds and `5` sources; and
return included/excluded reasons. It must not create a backing row, make progress
public, approve a motion, or activate a Sect Uprise.

The Slice 7 plan must explicitly decide whether an existing
`TrackSectBacking` row is sufficient materialized authority for diagnostics or
whether readiness must join a future Registrar authority record. If owner specs
cannot answer that safely, Slice 7 remains blocked rather than inventing the
join.

## G. Stop Conditions

Stop and return to the founder/owner contract if implementation requires:

- choosing a Registrar affiliation or approval model;
- selecting backing limits or paid/free capacity;
- defining replacement/reassignment after removal;
- promoting legacy tags;
- adding public discovery/progress/update surfaces;
- creating or activating a Sect Uprise;
- mutating a local, staging, or production database/provider.

## H. Review Contract

Plan review is heavy/final because this touches schema, cross-system ownership,
and a future governance-adjacent authority seam.

Required result before implementation:

```text
plan_review: PASS
critical_findings: 0
important_findings: 0
slice_6a_schema_only_safe: yes
slice_6b_authority_write_deferred: yes
provider_or_db_mutation_authorized: no
```
