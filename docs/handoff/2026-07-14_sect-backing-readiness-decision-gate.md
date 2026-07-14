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
- A song may be readiness-bearing for at most one Sect at a time.
- The existing Release Deck rule caps one source at 15 active minutes in an Uprise rotation; readiness measurement must preserve that cap.
- Readiness is diagnostic evidence for a later Registrar motion/approval path. It never automatically creates or activates a Sect Uprise.
- Song backing and readiness do not affect Fair Play placement, recurrence, voting weight, propagation, or artist rank.

## D. Founder locks required

### Decision 1 — Registrar authority chain

Who makes an Official Sect and a source's affiliation authoritative enough for song backing?

#### Option A — Source-submitted, platform-admin approved (recommended)

- An authorized manager of a registered source submits a Sect recognition and affiliation request in Registrar.
- An authenticated platform admin is the bounded MVP approver/revoker until a later owner spec activates a community-held role.
- Approval creates the Official Sect identity when needed and creates the requesting source's explicit Registrar-held affiliation.
- An authorized manager of the affiliated source may back only that source's eligible songs.
- The platform admin may revoke affiliation or invalidate a backing when authority or eligibility is lost, with an auditable reason.

Why this is recommended: it lets sources initiate real community formation while keeping Official recognition and affiliation in Registrar, prevents self-assigned tags from becoming authority, identifies a bounded existing MVP approver, and keeps song selection with the source that owns the music.

#### Option B — Platform-admin created, source-requested affiliation

- An authenticated platform admin creates the Official Sect identity in Registrar.
- An authorized manager of a registered source may request affiliation only with an existing Official Sect.
- The platform admin approves or revokes that affiliation.
- An authorized manager of an approved affiliated source may back only that source's eligible songs.

Tradeoff: the authority chain is complete and controlled, but sources cannot initiate a new Sect without separate admin coordination.

Founder answer required: A, B, or a correction that names the requester, Official Sect creator, affiliation approver/revoker, and song-backing actor in the same answer. A motion-first or community-role model may remain a future direction, but selecting it now would not unblock implementation until its actor and threshold contract is separately settled.

### Decision 2 — Song-backing lifecycle and reassignment

When a song's single active Sect backing is withdrawn, invalidated, or reassigned, what durable history remains?

#### Option A — Retain full backing lifecycle history (recommended)

- The source operator may withdraw an active backing.
- The platform-admin Registrar authority may invalidate it when affiliation or eligibility is lost, with an actor, timestamp, and reason.
- Withdrawal/invalidation closes the active record; it does not erase the backing relationship or its history.
- The song may be backed for another Sect only after the prior active backing is closed.
- Readiness counts only the current active, eligible backing.

Why this is recommended: it prevents double-counting, supports correction and reassignment, and preserves an audit trail without treating the record as Support, Participation, money, or governance weight.

#### Option B — Current backing plus minimal operational audit

- Product state retains only the song's current active backing.
- Withdrawal, invalidation, and reassignment remove/replace that current relationship.
- A separate non-readiness operational audit retains actor, timestamp, prior Sect identifier, and reason for accountability.
- The audit is not an active backing and never contributes minutes.

Tradeoff: smaller product history surface, but reconstructing the full backing lifecycle requires joining audit events rather than reading retained backing records.

Founder answer required: A, B, or a correction. Every answer preserves the settled one-active-Sect-per-song rule, source withdrawal, Registrar invalidation with reason, and reassignment only after the current backing closes.

### Decision 3 — Source diversity and contribution cap

Beyond the settled 15-minute per-source cap, does the 45-minute readiness target require an explicit minimum number of distinct sources?

#### Option A — 45 minutes, at least 5 sources, maximum 15 counted minutes per source (recommended)

- Sum only eligible active song backings.
- Preserve the existing 15-minute per-source Release Deck cap.
- Require at least five distinct eligible registered sources with counted music.
- Readiness requires both 45 capped minutes and five sources.

Why this is recommended: it mirrors the locked city-tier activation balance, prevents a single large catalog from creating the appearance of a functioning subcommunity, and measures both playable depth and community breadth.

#### Option B — No additional distinct-source minimum

- Preserve the existing 15-minute per-source cap and 45-minute total.
- Do not add a separate distinct-source threshold.
- The cap means at least three fully contributing sources are mathematically necessary, but three is not encoded as an independent rule.

Tradeoff: simpler contract, but a small number of large catalogs could satisfy readiness without the broader participation represented by five sources.

#### Option C — A different explicit source minimum

- Preserve the 45-minute target and existing 15-minute per-source cap.
- Founder supplies a distinct-source minimum other than five.

Founder answer required: A, B, or C with the minimum-source number. No option removes or weakens existing Release Deck eligibility or contribution caps.

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

Plan Review: product-authority and implementation-planning PASS at `e8aeb17`; zero Critical and zero Important findings

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

development_plan_reviewed_by_codex: yes

files_and_tests_clear: yes

risk_impacts_named: yes

provider_or_db_risk: no

ready_for_executor: yes — documentation/decision packet only

blockers: independent packet review before remote submission; founder answers before owner-spec or runtime expansion

## Closeout Contract

executor_completed: yes

tests_passed: yes

reviewer_required: yes

reviewer_passed: yes

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

blockers: founder answers remain; remote documentation PR checks remain before merge

next_signal: submit the registered decision-only branch, then request the three founder answers
