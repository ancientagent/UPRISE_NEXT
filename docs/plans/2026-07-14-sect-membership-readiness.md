# Sect Membership And Readiness Implementation Plan

> **Superseded before runtime implementation (2026-07-14):** Independent plan
> and product reviews found that this combined plan selected unowned membership
> exclusivity, withdrawal/audit, and readiness-reader behavior. Do not execute
> Tasks 1-7 below. The fully authorized named listener-request slice is replaced
> by `docs/plans/2026-07-14-sect-listener-request.md`; membership and readiness
> remain the next separate slice after those mechanics are owned. No runtime or
> schema work from this superseded plan was performed.

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement named Home Scene listener Sect requests, explicit
Registrar-held Artist/Band membership, and participant-scoped current-deck
readiness without song-level Sect state or an approval workflow.

**Architecture:** Keep the legacy-compatible `/registrar/sect-motion` route but
move Sect work into a dedicated Registrar controller/service so the already
oversized general Registrar service does not grow. Persist only request
provenance and Artist/Band membership. Derive `requested`, `legitimate`, and
`active` on reads from current membership and current eligible Release Deck
music; do not persist lifecycle status or track relationships.

**Tech Stack:** NestJS, TypeScript, Prisma 5, PostgreSQL/Neon-compatible SQL,
Zod, Jest, pnpm/Turborepo.

---

## World Logic And Delivery Gate

Actors and actions:

1. A listener whose Home Scene matches the parent city-tier community requests
   a named Sect.
2. An authorized operator of an Artist/Band source in that same Home Scene
   registers the source as a member in support of the request.
3. Five distinct currently eligible member sources make the Sect legitimate.
4. The member artists' current eligible Home Scene Release Deck music is summed
   after the existing `900`-second per-source cap.
5. A legitimate Sect is active when the aggregate reaches `2,700` seconds.

Hard constraints:

- the requester does not need to own or manage a source;
- songs never support, join, back, encode, or remember a Sect;
- previous songs cease contributing when no longer in the current eligible deck;
- passive `SectTag` / `UserTag` rows are not membership;
- no routine admin approval, maturity gate, confirmation step, or extra
  lifecycle enum is introduced;
- Support balance, Participation, Fair Play, voting weight, propagation, and
  source ranking remain untouched;
- no public progress UI, update channel, membership removal/history, provider
  operation, or production migration deployment is part of this branch.

Delivery gate: **GO**. This is an owner-authorized core community-formation
capability and reuses existing Registrar, Artist/Band authority, Official Sect
identity, and Release Deck measurement. Competitive discovery is not a design
input for this slice because the founder lifecycle is settled and the task is
implementation fidelity, not market-option selection.

## Persistence Contract

The existing `Sect` row remains the parent-scoped identity. Add nullable request
provenance so already-created identity rows remain migration-safe:

```prisma
model Sect {
  // existing identity fields
  requestRegistrarEntryId String? @unique

  requestRegistrarEntry RegistrarEntry?             @relation(fields: [requestRegistrarEntryId], references: [id], onDelete: SetNull)
  memberships           ArtistBandSectMembership[]
}

model ArtistBandSectMembership {
  id             String   @id @default(uuid())
  sectId         String
  artistBandId   String
  registeredById String
  createdAt      DateTime @default(now())

  sect         Sect       @relation(fields: [sectId], references: [id], onDelete: Cascade)
  artistBand   ArtistBand @relation(fields: [artistBandId], references: [id], onDelete: Cascade)
  registeredBy User       @relation(fields: [registeredById], references: [id], onDelete: Restrict)

  @@unique([sectId, artistBandId])
  @@index([artistBandId])
  @@index([registeredById])
  @@map("artist_band_sect_memberships")
}
```

Add inverse relations on `RegistrarEntry`, `ArtistBand`, and `User`. Do not add
`Track` relations, persisted Sect status, approval actor, archived song
evidence, or cross-Sect exclusivity.

## Derived State Contract

```ts
type SectDerivedState = 'requested' | 'legitimate' | 'active';

const eligibleMemberCount = currentMembersInParentHomeScene.length;
const legitimate = eligibleMemberCount >= 5;
const meetsMusicThreshold = cappedPlayableSeconds >= 45 * 60;
const active = legitimate && meetsMusicThreshold;
const state: SectDerivedState = active
  ? 'active'
  : legitimate
    ? 'legitimate'
    : 'requested';
```

The five-source test is the membership threshold. The music test is one
aggregate over those members after each member's existing cap; it is not `45`
minutes per source and does not require a new per-song or per-Sect allocation.

### Task 1: Lock Schema And Migration With Failing Contract Tests

**Files:**

- Modify: `apps/api/test/official-sect-schema.test.ts`
- Modify: `apps/api/prisma/schema.prisma`
- Create: `apps/api/prisma/migrations/20260715030000_add_sect_request_memberships/migration.sql`

**Step 1: Write the failing schema/migration contract test**

Extend the exact-model test to require nullable `Sect.requestRegistrarEntryId`,
the inverse `RegistrarEntry.requestedSect`, and the exact
`ArtistBandSectMembership` model. Assert the complete migration text and retain:

```ts
expect(schema).not.toContain('model TrackSectBacking');
expect(readPrismaModel(schema, 'Track')).not.toContain('sect');
expect(readPrismaModel(schema, 'Sect')).not.toContain('status');
```

**Step 2: Run the test and confirm it fails**

Run:

```bash
pnpm --filter api test -- official-sect-schema.test.ts
```

Expected: FAIL because request provenance and membership do not exist.

**Step 3: Add the minimal Prisma relations and additive SQL**

Use nullable provenance on `sects` so the migration does not assume the table
is empty. Create the membership table, unique pair constraint, indexes, and
foreign keys. Do not run the migration against Neon or any provider.

**Step 4: Validate schema and contract**

Run:

```bash
pnpm --filter api exec prisma validate --schema prisma/schema.prisma
pnpm --filter api test -- official-sect-schema.test.ts
```

Expected: Prisma validation and the focused suite PASS.

**Step 5: Commit**

```bash
git add apps/api/prisma/schema.prisma apps/api/prisma/migrations/20260715030000_add_sect_request_memberships/migration.sql apps/api/test/official-sect-schema.test.ts
git commit -m "feat(api): add Sect request membership persistence"
```

### Task 2: Extract The Named Listener Request Workflow

**Files:**

- Create: `apps/api/src/registrar/sect-registrar.service.ts`
- Create: `apps/api/src/registrar/sect-registrar.controller.ts`
- Create: `apps/api/test/sect-registrar.service.test.ts`
- Create: `apps/api/test/sect-registrar.controller.test.ts`
- Modify: `apps/api/src/registrar/dto/registrar.dto.ts`
- Modify: `apps/api/src/registrar/registrar.module.ts`
- Modify: `apps/api/src/registrar/registrar.controller.ts`
- Modify: `apps/api/src/registrar/registrar.service.ts`
- Modify: `apps/api/test/registrar.dto.test.ts`
- Modify: `apps/api/test/registrar.controller.test.ts`
- Modify: `apps/api/test/registrar.service.test.ts`

**Step 1: Write failing DTO/service/controller tests**

Require the legacy-compatible request body to be:

```ts
{
  sceneId: z.string().uuid(),
  sectName: z.string().trim().min(1).max(140),
}
```

Test that:

- the requester only needs the matching Home Scene listener identity;
- `sectName` is trimmed and a stable parent-scoped ASCII slug is derived;
- one transaction creates `RegistrarEntry(type='sect_motion')` and `Sect`;
- request provenance links the new Sect to that entry;
- duplicate parent-scoped slugs return `ConflictException`;
- non-city, missing, and non-Home Scene requests remain rejected;
- no source lookup, admin approval, tag read, Track read, or song write occurs;
- list/detail remain submitter-only and now return the linked Sect identity.

**Step 2: Run focused tests and confirm failure**

```bash
pnpm --filter api test -- registrar.dto.test.ts sect-registrar.service.test.ts sect-registrar.controller.test.ts
```

Expected: FAIL because the named request workflow does not exist.

**Step 3: Implement the dedicated workflow**

Move only Sect request/list/detail behavior out of the general Registrar
controller/service. Keep the public paths compatible:

```text
POST /registrar/sect-motion
GET  /registrar/sect-motion/entries
GET  /registrar/sect-motion/:entryId
```

Use `MusicCommunityPreferenceResolverService` for the same Home Scene resolution
already enforced by Registrar. Generate the slug server-side. Catch only the
expected Prisma `P2002` duplicate and translate it to `ConflictException`.

**Step 4: Run request regression tests**

```bash
pnpm --filter api test -- registrar.dto.test.ts sect-registrar.service.test.ts sect-registrar.controller.test.ts registrar.service.test.ts registrar.controller.test.ts
```

Expected: PASS with the old general Registrar Sect tests migrated to the new
focused suites rather than duplicated.

**Step 5: Commit**

```bash
git add apps/api/src/registrar apps/api/test/registrar.dto.test.ts apps/api/test/registrar.controller.test.ts apps/api/test/registrar.service.test.ts apps/api/test/sect-registrar.service.test.ts apps/api/test/sect-registrar.controller.test.ts
git commit -m "feat(api): implement named listener Sect requests"
```

### Task 3: Add Authorized Artist/Band Membership

**Files:**

- Modify: `apps/api/src/registrar/dto/registrar.dto.ts`
- Modify: `apps/api/src/registrar/sect-registrar.controller.ts`
- Modify: `apps/api/src/registrar/sect-registrar.service.ts`
- Modify: `apps/api/test/registrar.dto.test.ts`
- Modify: `apps/api/test/sect-registrar.service.test.ts`
- Modify: `apps/api/test/sect-registrar.controller.test.ts`

**Step 1: Write failing membership tests**

Add `ArtistBandSectMembershipSchema` with one `artistBandId` UUID. Test:

- only `ArtistBand.createdById` or an `ArtistBandMember.userId` can act;
- the source's current `homeSceneId` must equal the Sect parent community;
- the Sect must be linked to a listener request;
- one source can create only one membership per Sect;
- the action creates a membership row, not a Track/SectTag/UserTag row;
- the response reports current eligible member count and `legitimate=true`
  exactly when the fifth distinct eligible source is present;
- the requesting listener is not required to be a source operator.

**Step 2: Run and confirm failure**

```bash
pnpm --filter api test -- sect-registrar.service.test.ts sect-registrar.controller.test.ts
```

Expected: FAIL because membership action is missing.

**Step 3: Implement the endpoint**

```text
POST /registrar/sects/:sectId/memberships
```

Use the same source-operator rule already used by Tracks/Events: creator or
explicit Artist/Band member. Count eligibility dynamically through
`artistBand.homeSceneId = sect.parentCommunityId`. Do not add removal, approval,
multi-Sect exclusivity, or history endpoints.

**Step 4: Run focused tests**

```bash
pnpm --filter api test -- registrar.dto.test.ts sect-registrar.service.test.ts sect-registrar.controller.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add apps/api/src/registrar apps/api/test/registrar.dto.test.ts apps/api/test/sect-registrar.service.test.ts apps/api/test/sect-registrar.controller.test.ts
git commit -m "feat(api): add Artist Band Sect membership"
```

### Task 4: Reuse Current Release Deck Measurement For Member Sources

**Files:**

- Modify: `apps/api/src/release-deck/release-deck-measurement.service.ts`
- Modify: `apps/api/test/release-deck.measurement.service.test.ts`

**Step 1: Write failing filtered-measurement tests**

Test a new internal API:

```ts
measureCommunityDeckForSources(communityId, artistBandIds)
```

It must:

- reuse the same track eligibility, oldest-first source-cap, and exclusion logic;
- constrain the candidate query to the supplied source IDs;
- deduplicate source IDs;
- return zero totals for an empty source set without reading unrelated tracks;
- retain `900` seconds/source and `2,700` seconds aggregate policy values;
- perform no writes and store no historical result.

**Step 2: Run and confirm failure**

```bash
pnpm --filter api test -- release-deck.measurement.service.test.ts
```

Expected: FAIL because filtered measurement is absent.

**Step 3: Refactor minimally**

Add a private shared measurement path used by both the existing public community
measurement and the new source-filtered method. Export one immutable policy
constant rather than duplicating threshold values in the Sect service. Keep the
existing `/release-deck/measurement` response and behavior unchanged.

**Step 4: Run regression tests**

```bash
pnpm --filter api test -- release-deck.measurement.service.test.ts release-deck.controller.test.ts
```

Expected: PASS, including all existing community-wide cases.

**Step 5: Commit**

```bash
git add apps/api/src/release-deck/release-deck-measurement.service.ts apps/api/test/release-deck.measurement.service.test.ts
git commit -m "refactor(api): support member-filtered deck measurement"
```

### Task 5: Add Participant-Scoped Derived Readiness

**Files:**

- Modify: `apps/api/src/registrar/registrar.module.ts`
- Modify: `apps/api/src/registrar/sect-registrar.controller.ts`
- Modify: `apps/api/src/registrar/sect-registrar.service.ts`
- Modify: `apps/api/test/sect-registrar.service.test.ts`
- Modify: `apps/api/test/sect-registrar.controller.test.ts`

**Step 1: Write failing readiness tests**

Test:

- only the requesting listener or an operator of a member Artist/Band source can
  read readiness in this non-public slice;
- passive tags and non-member source decks are never read as Sect evidence;
- five eligible memberships plus `2,700` capped seconds returns `active`;
- fewer than five memberships never returns active even with enough seconds;
- five memberships with fewer than `2,700` seconds returns `legitimate`;
- `45` minutes is aggregate, never required per member;
- a member with three current eligible songs totaling `900` seconds contributes
  `900` seconds;
- a later read whose current deck drops below threshold returns non-active;
  previous songs are not persisted or counted;
- no readiness, status, Track, approval, or history write occurs.

**Step 2: Run and confirm failure**

```bash
pnpm --filter api test -- sect-registrar.service.test.ts sect-registrar.controller.test.ts
```

Expected: FAIL because readiness endpoint is missing.

**Step 3: Implement the endpoint**

```text
GET /registrar/sects/:sectId/readiness
```

Build eligible member source IDs from current membership plus parent Home Scene,
call `measureCommunityDeckForSources`, then derive state in memory. Return the
member count, contributing-member count, capped seconds/minutes, remaining
seconds/minutes, thresholds, included tracks, excluded tracks, and derived state.

Do not use the community measurement's contributing-source readiness boolean as
the membership threshold. Sect legitimacy comes from current eligible
membership count; music is the separate aggregate test.

**Step 4: Run focused regression tests**

```bash
pnpm --filter api test -- sect-registrar.service.test.ts sect-registrar.controller.test.ts release-deck.measurement.service.test.ts official-sect-schema.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add apps/api/src/registrar apps/api/test/sect-registrar.service.test.ts apps/api/test/sect-registrar.controller.test.ts
git commit -m "feat(api): derive Sect readiness from current member decks"
```

### Task 6: Align Web Contracts And Owner Documentation

**Files:**

- Modify: `apps/web/src/lib/registrar/client.ts`
- Modify: `apps/web/src/lib/registrar/contractInventory.ts`
- Modify: `apps/web/__tests__/registrar-client.test.ts`
- Modify: `apps/web/__tests__/registrar-contract-inventory.test.ts`
- Modify: `docs/specs/system/registrar.md`
- Modify: `docs/specs/communities/scenes-uprises-sects.md`
- Modify: `docs/specs/media/release-deck-and-eligibility.md`
- Modify: `docs/CHANGELOG.md`
- Modify: `docs/operations/ACTIVE_PM.md`
- Modify: `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- Create: `docs/handoff/2026-07-14_sect-membership-readiness.md`

**Step 1: Write failing web contract tests**

Type the request read payload as `{ sectName, sectSlug }`, include linked Sect
identity in read results, and register membership/readiness endpoints as API
implemented but web-surface missing. Do not add a CTA or UI consumer.

**Step 2: Run and confirm failure**

```bash
pnpm --filter web test -- registrar-client.test.ts registrar-contract-inventory.test.ts
```

Expected: FAIL until the contract inventory and response types are updated.

**Step 3: Update contracts and current-state docs**

Mark only the backend behavior implemented. Keep public progress, update
channels, membership removal, automatic notifications, and provider deployment
deferred. Record that active state is derived and can change with the current
eligible deck; do not describe a stored approval/status transition.

**Step 4: Validate focused web/docs work**

```bash
pnpm --filter web test -- registrar-client.test.ts registrar-contract-inventory.test.ts
pnpm run docs:lint
git diff --check
```

Expected: PASS.

**Step 5: Commit**

```bash
git add apps/web docs
git commit -m "docs: hand off Sect membership readiness backend"
```

### Task 7: Full Verification And Independent Review

**Files:** no planned product changes; fixes only if a reviewer identifies a
validated issue.

**Step 1: Run full local verification**

```bash
pnpm --filter api exec prisma validate --schema prisma/schema.prisma
pnpm --filter api test -- official-sect-schema.test.ts sect-registrar.service.test.ts sect-registrar.controller.test.ts release-deck.measurement.service.test.ts registrar.dto.test.ts registrar.service.test.ts registrar.controller.test.ts
pnpm --filter web test -- registrar-client.test.ts registrar-contract-inventory.test.ts
pnpm run verify
pnpm run workspace:audit
git diff --check origin/main...HEAD
```

Expected: all PASS; working tree clean.

**Step 2: Read-only product review**

Reviewer must challenge:

- any source-manager or admin requirement placed on the listener request;
- any song-level Sect field, API, selector, history, or retained evidence;
- any `45`-minutes-per-source interpretation;
- any conflation of five memberships with five contributing-song buckets;
- any persisted or approval-driven legitimate/active state;
- any public UI or authority beyond the owner specs.

**Step 3: Read-only code/schema review**

Reviewer must inspect authorization, transaction boundaries, unique-conflict
handling, nullable migration safety, query scoping, current-state recalculation,
no-write diagnostics, regressions, web-tier boundary, and exact committed HEAD.

**Step 4: Fix validated findings as sole writer and re-review**

No reviewer may edit, stage, commit, checkout, stash, push, or mutate providers.

**Step 5: Push and open the PR**

PR metadata:

- Deployment Target: none; migration code only, no database deployment
- Phase: 3
- Specs: Registrar, scenes/uprises/sects, Release Deck
- Agent: Codex GPT-5

Merge only after required checks pass.

## Implementation Handoff

The current session does not expose `superpowers:executing-plans`; Codex local
will execute these tasks sequentially using the available repository tools,
with the same TDD checkpoints and independent read-only reviews. The user has
already authorized continued implementation and the one-writer/reviewer model,
so no additional product choice is required before Task 1.
