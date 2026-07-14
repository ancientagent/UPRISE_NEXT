# Official Sect Identity Foundation — Slice 6A Execution Plan

**Date:** 2026-07-14

**Branch:** `codex/official-sect-backing-foundation`

**Starting HEAD:** `1a52d31a9215a25febcaeb1e00805124e4379765`

**Phase:** Slice 6A — authority-neutral Official Sect identity persistence

**Deployment target:** API schema/migration only; no production database operation in this slice

## A. Evidence used

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
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/`

The architecture plan is implementation guidance, not product doctrine. Where it proposes details that the owner specs leave unresolved, this slice stops rather than promoting the proposal into runtime authority.

## B. Current state vs deferred or unknown

### Current state

- `SectTag` and `UserTag` are legacy/non-authoritative tags. They do not represent an Official Sect.
- The database has no authoritative Official Sect identity model.
- The database has no track-to-Sect backing model.
- No service, controller, API, UI, or provider workflow currently creates an Official Sect.

### Deferred or unknown

- Official Sect lifecycle states, including whether states such as `uprise_ready`, `uprisen`, or `archived` should exist.
- Who may establish, approve, remove, or reassign an Official Sect or its track backing.
- Registrar provenance and the durable meaning of Registrar affiliation or approval.
- Whether track backing is current-state-only, historical, or both.
- Backing replacement, removal, rejection, retention, reassignment, and deletion behavior.
- Whether one row per track, one active row per track, or another constraint represents the product rule.
- Public visibility and update-channel behavior.
- Readiness calculation and the proposed distinct-source threshold.

## C. Authorized Slice 6A contract

Add only an authority-neutral Official Sect identity foundation.

### Exact Prisma contract

Add this model, with Prisma formatting adjustments permitted but no semantic additions:

```prisma
model Sect {
  id                String   @id @default(uuid())
  parentCommunityId String
  name              String
  slug              String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  parentCommunity Community @relation(fields: [parentCommunityId], references: [id], onDelete: Restrict)

  @@unique([parentCommunityId, slug])
  @@index([parentCommunityId])
  @@map("sects")
}
```

Add `sects Sect[]` to `Community`. It does not collide with the existing `sectTags SectTag[]` relation.

The identity is scoped by parent community plus slug. Because a community is already identified by `city + state + music community`, this preserves the community identity rule without duplicating or weakening it.

There is deliberately no `status`, Registrar-provenance, creator, or backing field. A row means only that an Official Sect identity exists. It does not mean the Sect is ready, public, governed, approved for another action, or Uprise-enabled.

### Exact migration contract

Create `apps/api/prisma/migrations/20260714223000_add_official_sects/migration.sql` with exactly this SQL:

```sql
-- CreateTable
CREATE TABLE "sects" (
    "id" TEXT NOT NULL,
    "parentCommunityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sects_parentCommunityId_slug_key" ON "sects"("parentCommunityId", "slug");

-- CreateIndex
CREATE INDEX "sects_parentCommunityId_idx" ON "sects"("parentCommunityId");

-- AddForeignKey
ALTER TABLE "sects" ADD CONSTRAINT "sects_parentCommunityId_fkey" FOREIGN KEY ("parentCommunityId") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

This migration creates no enum, lifecycle state, backing table, trigger, provenance field, seed, update, or backfill.

### Exact test contract

Create `apps/api/test/official-sect-schema.test.ts` with this code:

```ts
import fs from 'node:fs';
import path from 'node:path';

const apiRoot = path.resolve(__dirname, '..');
const migrationPath = path.join(
  apiRoot,
  'prisma/migrations/20260714223000_add_official_sects/migration.sql',
);

function readApiFile(relativePath: string): string {
  return fs.readFileSync(path.join(apiRoot, relativePath), 'utf8');
}

function readPrismaModel(schema: string, modelName: string): string {
  const match = schema.match(new RegExp(`model ${modelName} \\{[\\s\\S]*?\\n\\}`));
  if (!match) {
    throw new Error(`Prisma model ${modelName} was not found`);
  }
  return match[0];
}

describe('Official Sect identity schema contract', () => {
  const schema = readApiFile('prisma/schema.prisma');

  it('defines an authority-neutral Sect identity scoped to its parent community', () => {
    const sect = readPrismaModel(schema, 'Sect');
    const community = readPrismaModel(schema, 'Community');

    expect(sect).toMatch(/^\s+id\s+String\s+@id @default\(uuid\(\)\)$/m);
    expect(sect).toMatch(/^\s+parentCommunityId\s+String$/m);
    expect(sect).toMatch(/^\s+name\s+String$/m);
    expect(sect).toMatch(/^\s+slug\s+String$/m);
    expect(sect).toMatch(/^\s+createdAt\s+DateTime @default\(now\(\)\)$/m);
    expect(sect).toMatch(/^\s+updatedAt\s+DateTime @updatedAt$/m);
    expect(sect).toMatch(
      /^\s+parentCommunity\s+Community\s+@relation\(fields: \[parentCommunityId\], references: \[id\], onDelete: Restrict\)$/m,
    );
    expect(sect).toContain('@@unique([parentCommunityId, slug])');
    expect(sect).toContain('@@index([parentCommunityId])');
    expect(sect).toContain('@@map("sects")');
    expect(community).toMatch(/^\s+sects\s+Sect\[\]$/m);
    expect(sect).not.toMatch(/^\s+status\s+/m);
    expect(schema).not.toContain('model TrackSectBacking');
  });

  it('keeps the hand-written migration equivalent to the Prisma contract', () => {
    const migration = fs.readFileSync(migrationPath, 'utf8');

    expect(migration).toContain('CREATE TABLE "sects" (');
    expect(migration).toContain('"id" TEXT NOT NULL');
    expect(migration).toContain('"parentCommunityId" TEXT NOT NULL');
    expect(migration).toContain('"name" TEXT NOT NULL');
    expect(migration).toContain('"slug" TEXT NOT NULL');
    expect(migration).toContain(
      '"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP',
    );
    expect(migration).toContain('"updatedAt" TIMESTAMP(3) NOT NULL');
    expect(migration).toContain(
      'CONSTRAINT "sects_pkey" PRIMARY KEY ("id")',
    );
    expect(migration).toContain(
      'CREATE UNIQUE INDEX "sects_parentCommunityId_slug_key" ON "sects"("parentCommunityId", "slug");',
    );
    expect(migration).toContain(
      'CREATE INDEX "sects_parentCommunityId_idx" ON "sects"("parentCommunityId");',
    );
    expect(migration).toContain(
      'ALTER TABLE "sects" ADD CONSTRAINT "sects_parentCommunityId_fkey" FOREIGN KEY ("parentCommunityId") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;',
    );
    expect(migration).not.toContain('track_sect_backings');
    expect(migration).not.toContain('CREATE TYPE');
    expect(migration).not.toContain('"status"');
    expect(migration).not.toMatch(/^\s*(?:INSERT INTO|UPDATE\s+|DELETE FROM)\b/im);
  });
});
```

## D. Bite-sized implementation tasks

### Task 1 — Add the failing contract test

Files:

- create `apps/api/test/official-sect-schema.test.ts`

Steps:

1. Add the exact test code above without changing Prisma or migrations.
2. Run:

   ```bash
   pnpm --filter api test -- official-sect-schema.test.ts --runInBand
   ```

3. Expected result: FAIL because Prisma model `Sect` and the migration file are absent; the failure must be recorded in the execution evidence.
4. Do not commit the deliberately red intermediate state.

### Task 2 — Add the exact schema and migration

Files:

- modify `apps/api/prisma/schema.prisma`
- create `apps/api/prisma/migrations/20260714223000_add_official_sects/migration.sql`

Steps:

1. Add `sects Sect[]` to `Community`.
2. Add the exact `Sect` model.
3. Add the exact migration SQL.
4. Run:

   ```bash
   pnpm --filter api exec prisma format --schema prisma/schema.prisma
   pnpm --filter api exec prisma validate --schema prisma/schema.prisma
   pnpm --filter api run prisma:generate
   pnpm --filter api test -- official-sect-schema.test.ts --runInBand
   pnpm --filter api typecheck
   ```

5. Expected result: Prisma format/validate/generate succeed, the focused suite passes two tests, and API typecheck succeeds.
6. Inspect the formatted model and re-run `git diff --check`.

### Task 3 — Update implementation-state docs

Files:

- modify `docs/specs/communities/scenes-uprises-sects.md`
- modify `docs/CHANGELOG.md`
- update this handoff's Closeout Contract only after verification

Record only that Official Sect identity persistence exists and is parent-community scoped. Continue to state that lifecycle, creation authority, backing, readiness, visibility, and Sect Uprise behavior are not implemented. Do not change Registrar or Release Deck owner behavior.

Run:

```bash
pnpm run docs:lint
```

### Task 4 — Verify, checkpoint, and request implementation review

Run:

```bash
pnpm --filter api test -- official-sect-schema.test.ts --runInBand
pnpm --filter api exec prisma validate --schema prisma/schema.prisma
pnpm --filter api run prisma:generate
pnpm --filter api typecheck
pnpm run verify
pnpm run workspace:audit
git diff --check origin/main..HEAD
git status --short
```

Make one coherent implementation checkpoint after all checks are green:

```bash
git add apps/api/prisma/schema.prisma \
  apps/api/prisma/migrations/20260714223000_add_official_sects/migration.sql \
  apps/api/test/official-sect-schema.test.ts \
  docs/specs/communities/scenes-uprises-sects.md \
  docs/CHANGELOG.md \
  docs/handoff/2026-07-14_official-sect-song-backing-foundation.md
git commit -m "feat(api): add official sect identity foundation"
```

Then obtain two independent read-only reviews of the exact commit:

- schema/code reviewer: Prisma/SQL/test parity, migration actions, no data/provider mutation;
- product-authority reviewer: no lifecycle, backing, authority, governance, threshold, visibility, or Uprise behavior drift.

No push or PR is allowed until both report zero Critical and zero Important findings.

## E. Explicitly out of scope

- `TrackSectBacking` or any equivalent track-to-Sect association
- backing ledger events or Support/Participation scoring
- lifecycle or approval status
- Registrar provenance or official-affiliation writes
- service, controller, API, UI, seed, or backfill work
- readiness diagnostics or thresholds
- public Sect visibility or update channels
- automatic Sect Uprise creation
- local, preview, staging, or production provider/database mutation

A future authorized creation writer must verify that `parentCommunityId` identifies an active, eligible city-tier Home Scene. The foreign key cannot enforce that cross-row business invariant, and this slice creates no writer or rows.

## F. Slice 6B decision gate

Track-to-Sect backing work cannot begin until the owner contract resolves:

1. current-state versus historical backing semantics;
2. active uniqueness and reassignment behavior;
3. lifecycle vocabulary and transitions, if any;
4. authorization and Registrar provenance;
5. removal, rejection, retention, and deletion behavior;
6. the relationship, if any, between backing and Support or Participation.

Those decisions must be promoted into the appropriate owner spec before schema, API, or UI implementation.

## G. Slice 7 readiness gate

The architecture plan's proposed five-distinct-source threshold is not a locked owner-spec rule. Runtime readiness work cannot begin until the backing authority/model and founder-approved threshold/counting semantics are promoted into the appropriate owner spec. Slice 7 may begin only as a narrow decision packet; it may not create readiness behavior from the architecture proposal alone.

## Execution Packet

Lane: API persistence / Official Sect identity

Owner Contract: `docs/specs/communities/scenes-uprises-sects.md`

Starting Branch / HEAD: `codex/official-sect-backing-foundation` / `1a52d31a9215a25febcaeb1e00805124e4379765`

Must Read: evidence in section A; current `Community`, `SectTag`, and migration conventions

Do Not Read By Default: legacy implementation archives; unrelated UI/provider docs

Source Drift / Behavior To Correct: `not_applicable`; this is first-pass identity persistence

Feature / Behavior Scope: add only the `Sect` identity model, inverse Community relation, additive empty migration, parity test, and implementation-state docs

Repo-Aspects To Verify: Prisma formatting/validation/generation; PostgreSQL types, nullability, defaults, indexes, FK actions; docs authority; workspace registry

Development Plan: tasks 1–4 above

Plan Review: product-authority PASS at `1a52d31`; corrected schema plan awaiting re-review

Files Likely Touched: exact files named in tasks 1–4

Tests / Validation Seed: exact commands and expected results in tasks 1–4

Expansion Conditions: none; any backing, writer, status, threshold, or provider need is a stop condition

Stop Conditions: any need to resolve authority/lifecycle/backing/readiness policy or mutate a database/provider

Branch Owner: root Codex agent; sole writer

Subagent Use: read-only plan and implementation reviewers only

## Executor Readiness

issue_active: yes

branch_verified: yes

owner_contract_identified: yes

source_drift_or_bug_identified: not_applicable

feature_reviewed_against_repo: yes

development_plan_written: yes

development_plan_reviewed_by_codex: no — corrected schema plan awaiting re-review

files_and_tests_clear: yes

risk_impacts_named: yes

provider_or_db_risk: yes — schema/migration files only; mutation prohibited

ready_for_executor: no — corrected schema plan awaiting re-review

blockers: independent schema-plan PASS with zero Critical and zero Important findings

## Closeout Contract

executor_completed: no

tests_passed: no

reviewer_required: yes

reviewer_passed: no

qa_required: no

qa_passed: not_required

drift_source_corrected_or_quarantined: not_applicable

owner_spec_changed: no

owner_spec_verified: no

docs_handoff_required: yes

docs_handoff_done: no

changelog_required: yes

changelog_done: no

provider_state_touched: no

provider_identity_verified: not_required

schema_or_migration_touched: no

schema_or_migration_verified: no

linear_ready_to_close: no

blockers: plan re-review, implementation, verification, and implementation review remain

next_signal: independent schema-plan PASS
