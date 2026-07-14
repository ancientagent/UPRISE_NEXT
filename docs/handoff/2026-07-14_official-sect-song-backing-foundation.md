# Official Sect Identity Foundation — Slice 6A Plan

**Date:** 2026-07-14

**Branch:** `codex/official-sect-backing-foundation`

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

## C. Authorized Slice 6A

Add only an authority-neutral Official Sect identity foundation.

### Prisma contract

Add this model, with formatting adjustments permitted but no semantic additions:

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

Add the inverse `sects Sect[]` relation to `Community`.

The identity is scoped by parent community plus slug. Because a community is already identified by `city + state + music community`, this preserves the repo's community identity rule without duplicating or weakening it.

There is deliberately no `status` field. In this foundation, a persisted row means only that an Official Sect identity exists. It does not mean the Sect is ready, approved for any additional action, public, governed, or Uprise-enabled.

There is deliberately no Registrar or creator-provenance field. Authorization and affiliation semantics must be resolved in the owner specs before they become durable schema.

### Migration contract

Create one timestamped migration under `apps/api/prisma/migrations/` that:

- creates the `sects` table with `id`, `parentCommunityId`, `name`, `slug`, `createdAt`, and `updatedAt`;
- creates a primary key on `id`;
- creates a unique index on `(parentCommunityId, slug)`;
- creates an index on `parentCommunityId`;
- creates a foreign key from `parentCommunityId` to `communities(id)` with `ON DELETE RESTRICT` and `ON UPDATE CASCADE`;
- inserts, updates, or backfills no rows.

The migration must not create enums, lifecycle state, backing tables, authorization provenance, triggers, or provider data.

### Test contract

Add `apps/api/test/official-sect-schema.test.ts`. It must read both `apps/api/prisma/schema.prisma` and the exact new migration SQL and assert:

- the `Sect` model and `sects` table mapping exist;
- the `Community` inverse relation exists;
- the parent-community relation and `onDelete: Restrict` exist;
- the Prisma composite uniqueness and parent index exist;
- the migration creates the expected columns, primary key, composite unique index, parent index, and foreign key behavior;
- the schema and migration contain no `TrackSectBacking` model/table and no Official Sect lifecycle enum or status field.

Run the new test before implementation to record the expected failure, then run it after implementation to record the pass. Also run Prisma formatting, validation, generation, API typecheck, repository verification, workspace audit, and diff checks. No local or provider database migration is authorized. GitHub CI may apply the migration only to its disposable test database as part of normal PR checks.

## D. Explicitly out of scope

- `TrackSectBacking` or any equivalent track-to-Sect association
- backing ledger events or Support/Participation scoring
- lifecycle or approval status
- Registrar provenance or official-affiliation writes
- service, controller, API, UI, seed, or backfill work
- readiness diagnostics or thresholds
- public Sect visibility or update channels
- automatic Sect Uprise creation
- production or preview provider/database mutations

## E. Documentation outcome

After the implementation passes review, update only the relevant current-state documentation and changelog to record that:

- Official Sect identity persistence exists;
- identity is scoped to a parent community;
- no lifecycle, authority, backing, readiness, visibility, or Uprise-creation behavior is implemented.

Do not rewrite owner-spec deferred decisions as resolved.

## F. Slice 6B decision gate

Track-to-Sect backing work cannot begin until the owner contract resolves, at minimum:

1. current-state versus historical backing semantics;
2. active uniqueness and reassignment behavior;
3. lifecycle vocabulary and transitions, if any;
4. authorization and Registrar provenance;
5. removal, rejection, retention, and deletion behavior;
6. the relationship, if any, between backing and Support or Participation.

Those decisions must be promoted into the appropriate owner spec before schema, API, or UI implementation.

## G. Slice 7 readiness gate

The architecture plan's proposed threshold of five distinct backing sources is not currently a locked owner-spec rule. Readiness implementation cannot begin until:

- the backing authority/model is resolved and specified; and
- the founder-approved readiness threshold and counting semantics are promoted into the appropriate owner spec.

The next slice may produce a narrow decision packet and implementation plan, but it may not create runtime readiness behavior from the architecture proposal alone.

## H. Review contract

Before implementation, independent plan reviewers must verify:

- the slice is schema-only and authority-neutral;
- the Prisma and SQL contracts are equivalent and testable;
- no unresolved lifecycle, provenance, backing, threshold, governance, or provider behavior is invented;
- the work preserves community identity and web-tier boundaries;
- no Critical or Important finding remains open.

After implementation, independent code/schema and product-authority reviewers must review the exact commit and verification evidence before push or PR.
