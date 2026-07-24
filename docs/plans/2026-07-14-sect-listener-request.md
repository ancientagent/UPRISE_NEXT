# Named Listener Sect Request Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the legacy-compatible `/registrar/sect-motion` skeleton as a
named Home Scene listener request that creates and links the existing
authority-neutral Sect identity.

**Architecture:** Extract Sect request/list/detail behavior from the oversized
general Registrar controller/service into a focused controller/service. In one
transaction, create the append-oriented Registrar request and the parent-scoped
Sect identity. Add nullable request provenance so pre-existing Sect identities
and legacy empty `sect_motion` rows remain readable without backfill guesses.

**Tech Stack:** NestJS, TypeScript, Prisma 5, PostgreSQL/Neon-compatible SQL,
Zod, Jest, pnpm/Turborepo.

---

## Authorized Boundary

In scope:

- any listener whose established Home Scene matches the target city-tier
  community may request a named Sect;
- matching Home Scene authority uses the durable `User.homeSceneId` civic
  anchor written by onboarding, explicit Home Scene changes, invite claim, and
  proxy-to-natural cutover; a transient `tunedSceneId` Away Scene never grants
  request authority;
- the requester does not need to own or manage an Artist/Band source;
- a new request creates one `RegistrarEntry(type='sect_motion')` and one linked
  `Sect` identity in a transaction;
- old `sect_motion` entries with `payload: {}` remain readable with nullable
  normalized request fields and no linked Sect;
- existing route paths remain compatible;
- no admin approval, source lookup, tags, tracks, or lifecycle status participate.

Out of scope:

- Artist/Band membership writes;
- cross-Sect membership exclusivity;
- membership withdrawal, audit history, or cooldown;
- legitimacy/readiness evaluation or visibility;
- public UI/CTA, update channels, notifications, provider/database deployment;
- song-level Sect state of any kind.

Those exclusions do not reopen the settled lifecycle. They prevent this slice
from silently selecting mechanics not answered by the lifecycle rule.

## Persistence Contract

Add only nullable request provenance to the existing identity:

```prisma
model Sect {
  id                      String   @id @default(uuid())
  parentCommunityId       String
  requestRegistrarEntryId String?  @unique
  name                    String
  slug                    String
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt

  parentCommunity      Community      @relation(fields: [parentCommunityId], references: [id], onDelete: Restrict)
  requestRegistrarEntry RegistrarEntry? @relation(fields: [requestRegistrarEntryId], references: [id], onDelete: SetNull)

  @@unique([parentCommunityId, slug])
  @@map("sects")
}
```

Add the inverse nullable one-to-one relation to `RegistrarEntry`:

```prisma
requestedSect Sect?
```

Do not add membership, Track, status, approval, visibility, or history fields.

Persist the listener civic anchor separately from tuning context:

```prisma
model User {
  homeSceneId String?
  homeScene   Community? @relation("ListenerHomeScene", fields: [homeSceneId], references: [id], onDelete: SetNull)
}
```

The additive migration does not guess a backfill. Legacy rows without an anchor
may use an exact active natural tuple or one unambiguous active same-community
`CommunityMember` proxy membership; ambiguous legacy proxy memberships are
rejected rather than authorizing the wrong scene.

## Compatibility Read Contract

Every request list/detail response normalizes to:

```ts
{
  id: string;
  type: 'sect_motion';
  status: string;
  sceneId: string;
  payload: {
    sectName: string | null;
    sectSlug: string | null;
  };
  sect: {
    id: string;
    parentCommunityId: string;
    name: string;
    slug: string;
  } | null;
  scene: RegistrarSceneSummary | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
```

Legacy `payload: {}` maps to both payload fields `null` and `sect: null`. No
legacy name, slug, or Sect link is inferred.

## Slug Contract

Server-side slug generation is exact and deterministic:

1. `sectName.trim().normalize('NFKD')`;
2. remove combining marks;
3. lowercase;
4. replace each run outside `[a-z0-9]` with `-`;
5. trim leading/trailing `-`;
6. cap at `120` characters and trim a trailing `-` again;
7. if the ASCII result is empty, preserve the Unicode display name and use the
   deterministic opaque fallback `sect-` plus the first `16` lowercase hex
   characters of `sha256(trimmedName.normalize('NFC'))`.

This slug is an internal routing identifier, not a restriction on a Sect's
writing system. Punctuation-only and non-Latin-only nonblank names receive the
same deterministic fallback on every request. A parent-scoped slug collision
returns a narrowly translated `ConflictException`.

### Task 1: Add Migration-Safe Request Provenance

**Files:**

- Modify: `apps/api/test/official-sect-schema.test.ts`
- Modify: `apps/api/prisma/schema.prisma`
- Create: `apps/api/prisma/migrations/20260715030000_add_sect_request_provenance/migration.sql`

**Step 1: Write the failing exact schema/migration test**

Require the nullable `requestRegistrarEntryId`, exact relations, unique index,
and foreign key. Preserve negative assertions:

```ts
expect(schema).not.toContain('model TrackSectBacking');
expect(readPrismaModel(schema, 'Track')).not.toMatch(/sect/i);
expect(readPrismaModel(schema, 'Sect')).not.toContain('status');
expect(schema).not.toContain('ArtistBandSectMembership');
```

**Step 2: Confirm failure**

```bash
pnpm --filter api test -- official-sect-schema.test.ts
```

Expected: FAIL because request provenance is absent.

**Step 3: Add nullable schema and additive SQL**

SQL adds one nullable `requestRegistrarEntryId` column, one unique index, and
one `ON DELETE SET NULL` foreign key to `registrar_entries`. It does not update
existing rows or execute against Neon.

**Step 4: Regenerate and validate immediately**

```bash
pnpm --filter api run prisma:generate
pnpm --filter api exec prisma validate --schema prisma/schema.prisma
pnpm --filter api test -- official-sect-schema.test.ts
```

Expected: all PASS.

**Step 5: Commit**

```bash
git add apps/api/prisma/schema.prisma apps/api/prisma/migrations/20260715030000_add_sect_request_provenance/migration.sql apps/api/test/official-sect-schema.test.ts
git commit -m "feat(api): link Sect identity to listener request"
```

### Task 2: Define Named Request And Legacy Read Contracts

**Files:**

- Modify: `apps/api/src/registrar/dto/registrar.dto.ts`
- Modify: `apps/api/test/registrar.dto.test.ts`
- Create: `apps/api/test/sect-registrar.service.test.ts`
- Create: `apps/api/test/sect-registrar.controller.test.ts`

**Step 1: Write failing DTO tests**

The request schema accepts exactly:

```ts
z.object({
  sceneId: z.string().uuid(),
  sectName: z.string().trim().min(1).max(140),
})
```

Test trimming, missing/blank/overlength name rejection, invalid scene UUID, and
unknown-key stripping under current Zod behavior.

**Step 2: Write failing service/controller contract tests**

Test named-request creation and compatibility normalization for an old row with
`payload: {}` and no linked Sect. Test exact slug cases: normal words,
punctuation, diacritics, stable hashed fallback for punctuation-only and
non-Latin-only names, collision, and a 140-character name whose slug is capped
to 120.

**Step 3: Confirm failure**

```bash
pnpm --filter api test -- registrar.dto.test.ts sect-registrar.service.test.ts sect-registrar.controller.test.ts
```

Expected: FAIL because the focused workflow does not exist.

**Step 4: Commit tests with the implementation in Task 3**

Do not commit red tests as the branch tip pushed for review.

### Task 3: Extract And Implement The Request Workflow

**Files:**

- Create: `apps/api/src/registrar/sect-registrar.service.ts`
- Create: `apps/api/src/registrar/sect-registrar.controller.ts`
- Modify: `apps/api/src/registrar/registrar.module.ts`
- Modify: `apps/api/src/registrar/registrar.controller.ts`
- Modify: `apps/api/src/registrar/registrar.service.ts`
- Modify: `apps/api/test/registrar.controller.test.ts`
- Modify: `apps/api/test/registrar.service.test.ts`
- Modify: Task 2 test files

**Step 1: Implement the dedicated service/controller**

Preserve paths:

```text
POST /registrar/sect-motion
GET  /registrar/sect-motion/entries
GET  /registrar/sect-motion/:entryId
```

Use `MusicCommunityPreferenceResolverService` for the established Home Scene
check. The POST transaction performs:

```ts
return prisma.$transaction(async (tx) => {
  const entry = await tx.registrarEntry.create({
    data: {
      type: 'sect_motion',
      status: 'submitted',
      sceneId,
      createdById: userId,
      payload: { sectName, sectSlug },
    },
  });
  const sect = await tx.sect.create({
    data: {
      parentCommunityId: sceneId,
      requestRegistrarEntryId: entry.id,
      name: sectName,
      slug: sectSlug,
    },
  });
  return mapSectRequest(entry, sect, scene);
});
```

Translate only expected parent-slug/request-link `P2002` errors. Do not catch
unrelated database failures.

**Step 2: Remove migrated methods/tests from the general Registrar surface**

Move rather than duplicate Sect POST/list/detail behavior. Keep all non-Sect
Registrar behavior unchanged.

**Step 3: Run focused regression tests**

```bash
pnpm --filter api test -- registrar.dto.test.ts sect-registrar.service.test.ts sect-registrar.controller.test.ts registrar.service.test.ts registrar.controller.test.ts official-sect-schema.test.ts
```

Expected: PASS. Tests must prove the request path never reads ArtistBand,
ArtistBandMember, SectTag, UserTag, or Track and never performs approval writes.

**Step 4: Typecheck**

```bash
pnpm --filter api typecheck
```

Expected: PASS.

**Step 5: Commit**

```bash
git add apps/api/src/registrar apps/api/test
git commit -m "feat(api): implement named listener Sect requests"
```

### Task 4: Align Web Read Types And Current-State Docs

**Files:**

- Modify: `apps/web/src/lib/registrar/client.ts`
- Modify: `apps/web/__tests__/registrar-client.test.ts`
- Modify: `docs/specs/system/registrar.md`
- Modify: `docs/specs/communities/scenes-uprises-sects.md`
- Modify: `docs/CHANGELOG.md`
- Modify: `docs/operations/ACTIVE_PM.md`
- Modify: `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- Create: `docs/handoff/2026-07-14_named-listener-sect-request.md`

**Step 1: Write failing compatibility tests**

Type normalized nullable payload fields and nullable linked Sect identity. Test
both a new named row and a legacy empty row. Do not add a submit wrapper, CTA,
membership endpoint, readiness endpoint, or progress data.

**Step 2: Update client types and docs**

Mark named listener request persistence implemented. Keep membership,
legitimacy/readiness calculation, membership policy, visibility, and update
channels deferred. State that the existing `sect_motion` name is a compatibility
route/type, not an artist-initiated motion rule.

**Step 3: Validate**

```bash
pnpm --filter web test -- registrar-client.test.ts registrar-contract-inventory.test.ts
pnpm run docs:lint
git diff --check
```

Expected: PASS.

**Step 4: Commit**

```bash
git add apps/web docs
git commit -m "docs: hand off named listener Sect request"
```

### Reviewer Repair Addendum: Preserve Actual Assigned Home Scene

Final review established that recomputing proxy assignment cannot safely
recover onboarding's distance-selected scene after `tunedSceneId` changes for
Away listening. The implementation therefore adds nullable durable
`User.homeSceneId` authority and a separate additive migration, updates all
current authoritative writers (onboarding, explicit Home Scene change, invite
claim, and proxy-to-natural cutover), and leaves `tunedSceneId` as listening
context. Tests cover the schema/migration, all writer paths, assigned proxy
authority, Away rejection, case-insensitive legacy exact-natural matching,
unique legacy proxy recovery, and ambiguous legacy rejection.

No migration is executed and no legacy anchor is guessed.

### Task 5: Full Verification And Independent Review

**Step 1: Run verification**

```bash
pnpm --filter api exec prisma validate --schema prisma/schema.prisma
pnpm --filter api test -- official-sect-schema.test.ts user-home-scene-anchor-schema.test.ts sect-registrar.service.test.ts sect-registrar.controller.test.ts registrar.dto.test.ts registrar.service.test.ts registrar.controller.test.ts onboarding.home-scene-resolution.test.ts communities.discovery.service.test.ts admin-analytics.service.test.ts auth.invite-registration.service.test.ts
pnpm --filter web test -- registrar-client.test.ts registrar-contract-inventory.test.ts
pnpm run verify
pnpm run workspace:audit
git diff --check origin/main...HEAD
```

**Step 2: Read-only product review**

Confirm listener authority, no source requirement, no membership/readiness
behavior, no approval gate, no song state, and accurate legacy normalization.

**Step 3: Read-only code/schema review**

Inspect transaction atomicity, nullable migration safety, exact unique-conflict
translation, slug edge cases, submitter-only reads, extraction completeness,
regressions, and exact committed HEAD.

**Step 4: Sole-writer fixes and re-review**

Reviewers do not edit, stage, commit, checkout, stash, push, or mutate providers.

**Step 5: Submit through PR checks**

Deployment target is none: migration code is included, but no database/provider
operation is authorized.

## Next Separate Slice

Before exposing Artist/Band membership writes, owner authority must settle:

1. whether one Artist/Band may be an active member of multiple Sects in the same
   Home Scene;
2. how an Artist/Band withdraws and what append-oriented audit record is kept;
3. which authenticated actors, if any, may read detailed readiness/progress;
4. the exact runtime eligibility predicate for a "registered" Artist/Band,
   including treatment of legacy canonical sources without Registrar linkage.

These questions do not reopen the five-member, `45`-minute aggregate, current
deck, or `15`-minute/source rules.
