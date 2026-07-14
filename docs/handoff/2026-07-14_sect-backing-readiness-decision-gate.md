# Sect Backing And Readiness Founder Decision Gate — Slice 7

**Date:** 2026-07-14

**Branch:** `codex/sect-readiness-decision-gate`

**Starting baseline:** `origin/main@542c350` after PR #240

**Status:** open founder decisions; no runtime or schema authorization

## A. Evidence used

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`
- `docs/founder-sessions/2026-07-08_release-deck-radiyo-sect-readiness.md`
- `docs/specs/system/documentation-framework.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/system/registrar.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/DECISIONS_REQUIRED.md`
- `docs/solutions/RELEASE_DECK_RADIYO_SECT_IMPLEMENTATION_ARCHITECTURE_R1.md`
- Official Sect identity foundation merged through PR #240

The architecture document supplies options and implementation consequences. It does not settle product authority where the owner specs remain open.

## B. Clarification classification

Clarification: lock the minimum founder decisions required before song-level Sect backing or readiness diagnostics can be designed as runtime contracts.

Affected lanes: Registrar, Official Sects/communities, Release Deck, future Sect readiness diagnostics.

Current owner spec: `docs/specs/communities/scenes-uprises-sects.md`, with authority coordination in `docs/specs/system/registrar.md` and evidence ownership in `docs/specs/media/release-deck-and-eligibility.md`.

Docs likely needing patch after answers: the three owner specs above, `docs/specs/DECISIONS_REQUIRED.md`, `docs/CHANGELOG.md`, and a raw founder-session capture.

Runtime/tests likely impacted after a later implementation plan: backing persistence and service tests, Registrar authorization checks, readiness aggregation tests, and read-only diagnostics.

Decision status: open.

Questions still needed: the three founder locks in section D.

## C. Confirmed current contract

The following is already settled and is not reopened by this packet:

- Official Sect identity is scoped to one parent Home Scene/music community.
- Existing `SectTag` and `UserTag` rows are not authoritative Official Sect affiliation.
- Readiness evidence comes from eligible, approved/playable Release Deck songs explicitly encoded/backed for the Sect.
- General source affiliation does not automatically make the source's full catalog count.
- Passive genre/style metadata, listener tags, popularity, Support balance, Participation, votes, and money spent do not count as readiness evidence.
- The current readiness catalog target is 45 minutes.
- Readiness is diagnostic evidence for a later Registrar motion/approval path. It never automatically creates or activates a Sect Uprise.
- Song backing and readiness do not affect Fair Play placement, recurrence, voting weight, propagation, or artist rank.

## D. Founder locks required

### Decision 1 — Registrar authority chain

Who makes an Official Sect and a source's affiliation authoritative enough for song backing?

#### Option A — Registrar-gated recognition (recommended)

- A bounded Registrar steward/admin path recognizes the Official Sect inside a Home Scene.
- Registrar approves or revokes a source's explicit affiliation with that Sect.
- An authorized manager of the affiliated source may back only that source's eligible songs.
- Registrar may invalidate a backing when the underlying affiliation or eligibility is revoked, with an auditable reason.

Why this is recommended: it matches the current rule that official affiliation belongs in Registrar, prevents self-assigned tags from becoming authority, and keeps song selection with the artist/source that owns the music.

#### Option B — Source-created with Registrar moderation

- Any eligible registered source may create a Sect and self-affiliate.
- Registrar intervenes only for moderation, conflicts, or revocation.

Tradeoff: faster formation, but Official status becomes close to self-asserted unless strong later review rules are added.

#### Option C — Motion-first recognition

- Sources propose a Sect through Registrar.
- A defined collective threshold or approval process must succeed before the Official Sect or affiliation exists.

Tradeoff: stronger collective legitimacy, but it requires governance and threshold rules that are not ready for the bounded backing/readiness slice.

Founder answer required: A, B, C, or a correction.

### Decision 2 — Song-backing lifecycle and reassignment

Can one song actively back more than one Sect, and what history remains after removal or reassignment?

#### Option A — One active Sect with retained history (recommended)

- A song may have at most one active readiness-bearing Sect backing at a time.
- The source operator may withdraw an active backing.
- Registrar may invalidate it when authority or eligibility is lost, with a reason.
- Removal/invalidation closes the active record; it does not erase the historical event.
- The song may be backed for another Sect only after the prior active backing is closed.
- Readiness counts only the current active, eligible backing.

Why this is recommended: it prevents double-counting, supports correction and reassignment, and preserves an audit trail without treating the record as Support, Participation, money, or governance weight.

#### Option B — One current assignment, overwritten

- A song has one mutable Sect field/record.
- Reassignment replaces the prior value without durable lifecycle history.

Tradeoff: simplest storage, but weak accountability and poor dispute/correction evidence.

#### Option C — Multiple active Sects

- A song may actively contribute its full minutes to more than one Sect.

Tradeoff: flexible affiliation, but the same catalog can satisfy multiple readiness thresholds unless minutes are split by a new allocation rule.

Founder answer required: A, B, C, or a correction.

### Decision 3 — Source diversity and contribution cap

Does the 45-minute readiness target require multiple independent sources, and how much may one source contribute?

#### Option A — 45 minutes, at least 5 sources, maximum 15 counted minutes per source (recommended)

- Sum only eligible active song backings.
- Cap each source's counted contribution at 15 minutes.
- Require at least five distinct eligible registered sources with counted music.
- Readiness requires both 45 capped minutes and five sources.

Why this is recommended: it mirrors the locked city-tier activation balance, prevents a single large catalog from creating the appearance of a functioning subcommunity, and measures both playable depth and community breadth.

#### Option B — 45 minutes only

- Any number of eligible sources may supply the catalog, including one source.
- No per-source cap applies.

Tradeoff: simplest and fastest, but a single artist/source could make a Sect readiness-qualified without an operating subcommunity.

#### Option C — 45 minutes plus a different diversity rule

- Keep the 45-minute catalog target.
- Founder supplies a different minimum-source count, per-source cap, or contribution formula.

Founder answer required: A, B, C with values, or a correction.

## E. Decisions deliberately deferred

These do not need to be solved to lock a future backing/readiness implementation plan and must not be smuggled into the three answers:

- public progress visibility or discovery timing;
- source/song paid or free backing capacity;
- update-channel design;
- council, governance, custody, ownership, or Trusted Role authority;
- automatic motion approval or Sect Uprise activation;
- Support or Participation scoring;
- moderation/appeal timelines beyond retaining a reasoned invalidation record;
- provider/database deployment timing.

## F. Promotion and implementation sequence after answers

1. Capture the founder's raw wording in a dated `docs/founder-sessions/` note.
2. Promote the settled authority and lifecycle rules into `docs/specs/system/registrar.md`.
3. Promote the settled readiness counting semantics into `docs/specs/communities/scenes-uprises-sects.md`.
4. Update the Release Deck owner spec only for the evidence/write boundary it owns.
5. Resolve the matching entries in `docs/specs/DECISIONS_REQUIRED.md` and update `docs/CHANGELOG.md`.
6. Write and independently review a new executor-ready schema/service plan.
7. Implement backing before readiness diagnostics; keep readiness read-only and non-activating.

No step after item 5 is authorized by this decision packet alone.

## G. Review contract

Independent reviewers must verify that:

- every question maps to an actual unresolved owner-contract blocker;
- settled current rules are not reopened;
- recommendations are labeled and not presented as founder decisions;
- options expose the implementation and abuse-resistance tradeoffs without steering toward governance expansion;
- no runtime/schema/provider action is authorized;
- the packet is answerable in three founder responses without follow-up micro-questions;
- Critical and Important findings are zero before remote submission.

## Execution Packet

Lane: cross-lane product decision contract; Registrar / communities / Release Deck

Owner Contract: `docs/specs/communities/scenes-uprises-sects.md` with `docs/specs/system/registrar.md` and `docs/specs/media/release-deck-and-eligibility.md`

Starting Branch / HEAD: `codex/sect-readiness-decision-gate` / `84daa27`

Must Read: section A evidence and the founder-clarification capture skill

Do Not Read By Default: legacy implementation archives; UI prototypes; provider docs

Source Drift / Behavior To Correct: architecture proposals for backing lifecycle and five-source readiness must not be mistaken for locked owner-spec rules

Feature / Behavior Scope: decision packet and unresolved-decision tracking only

Repo-Aspects To Verify: owner-contract boundaries, exact open decisions, founder wording, operations routing, docs validation

Development Plan: create this packet; update unresolved decision tracking/changelog; independently review; stop for founder answers

Plan Review: pending independent product-authority and implementation-planning review

Files Likely Touched: this handoff, `docs/specs/DECISIONS_REQUIRED.md`, `docs/CHANGELOG.md`, operations routing

Tests / Validation Seed: `pnpm run docs:lint`; `pnpm run workspace:audit`; `git diff --check`

Expansion Conditions: founder answers in-thread followed by explicit owner-spec promotion work

Stop Conditions: any attempt to choose answers for the founder or add schema/runtime/provider behavior

Branch Owner: root Codex agent; sole writer

Subagent Use: read-only product-authority and implementation-plan reviewers

## Executor Readiness

issue_active: yes

branch_verified: yes

owner_contract_identified: yes

source_drift_or_bug_identified: yes

feature_reviewed_against_repo: yes

development_plan_written: yes

development_plan_reviewed_by_codex: no

files_and_tests_clear: yes

risk_impacts_named: yes

provider_or_db_risk: no

ready_for_executor: yes — documentation/decision packet only

blockers: independent packet review before remote submission; founder answers before owner-spec or runtime expansion

## Closeout Contract

executor_completed: yes

tests_passed: no

reviewer_required: yes

reviewer_passed: no

qa_required: no

qa_passed: not_required

drift_source_corrected_or_quarantined: yes

owner_spec_changed: no

owner_spec_verified: not_required

docs_handoff_required: yes

docs_handoff_done: yes

changelog_required: yes

changelog_done: yes

provider_state_touched: no

provider_identity_verified: not_required

schema_or_migration_touched: no

schema_or_migration_verified: not_required

linear_ready_to_close: no

blockers: independent packet review and founder answers remain

next_signal: independent review of the exact packet commit
