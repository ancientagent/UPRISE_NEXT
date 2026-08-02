# UPRISE Active PM

Status: active execution snapshot
Owner: current branch owner / context-steward
Last Updated: 2026-08-02

## Purpose

Use this file only for current work, blockers, preserved-risk workspaces, and
the next execution signal. It is not product doctrine, merge history, or a
remote-branch inventory.

Git and GitHub own live branch, PR, check, and merge state. Durable product
truth remains in owner specs under `docs/specs/**`, with current code and tests
as implementation evidence.

## Current Work

| Field | Current Value |
| --- | --- |
| Branch | `codex/classic-avatar-asset-production` |
| Base | `main@ba969f8` |
| Scope | Preserve the completed shared-local normalization and validated Austin Punk local RADIYO fixture, then hand off the next city-tier Release Deck/RADIYO automation decision packet. |
| Owner | Codex local, sole writer |
| Validation | focused API/web tests passed; `pnpm run verify` passed; production web build passed; RADIYO measurement/scheduling/ingestion/graduation tests passed (`53` tests); `pnpm run docs:lint`, `pnpm run workspace:audit`, and `git diff --check` passed; final Sol review passed at `ce31f6d` with no findings |
| Out of Scope | Live provider calls, database migration execution, provider/database state changes, media upload/storage/transcoding, unapproved avatar privacy/retention/moderation policy, destructive stash/branch/worktree cleanup, full beta avatar catalog, and unrelated preserved UX extraction |

## Open Queue

| PR / Branch | State | Action |
| --- | --- | --- |
| closed PR #1 / `codex/propose-prisma-schema-migration` | Unmerged unique schema/spec draft | Preserve for a dedicated schema/product-authority review. |

## Preserved Workspaces

| Path / Branch | State | Reason |
| --- | --- | --- |
| `/home/baris/UPRISE_NEXT_uximpl` / `ux-implementation` | Preserved | Broad Plot/profile/player/source-dashboard reference; extract intentionally, never merge wholesale. |
| `/home/baris/UPRISE_NEXT_uxmobile` / `ux-mobile-r1-build` | Preserved | Mobile-first UX reference; extract intentionally, never merge wholesale. |
| `feat/ux-batch17` | Preserved branch | Historical UX/Reliant batch reference. |
| `feat/ux-batch18-run` | Preserved branch | Historical UX/Reliant batch reference. |
| `codex/propose-prisma-schema-migration` | Preserved branch | Unmerged unique schema/spec draft; no cleanup decision in this pass. |

## Current Evidence

- The classic avatar style and construction proof is preserved in `731682b` and
  `bae6895`.
- SQL seed hardening is committed in `f0cd143`.
- Home Scene-aware website account entry is committed in `5331efa`; the final
  review correction in `34d1db6` routes from an authenticated private
  server-computed status instead of the incomplete general user projection.
- The community-powered platform purpose and Proof of Support boundary are
  committed in `a3a0469`.
- Approved avatar/design assets and founder captures are committed in
  `0b00586`.
- Unapproved avatar runtime and public Signal experiments are isolated as
  non-runtime screen packages in `53db0f7`; the live web build contains neither
  route.
- A complete non-destructive pre-normalization checkpoint is stored outside the
  repo at
  `/mnt/c/Users/baris/uprise-agent-artifacts/uprise-shared-checkout-pre-normalization`
  (`C:\Users\baris\uprise-agent-artifacts\uprise-shared-checkout-pre-normalization`).
- The next city-tier lifecycle packet is
  `docs/handoff/2026-08-01_city-tier-radiyo-automation-execution-packet.md`.
- A real, local-only Austin Punk fixture is inventory-backed and validated at
  `C:\Users\baris\uprise-agent-artifacts\radiyo-austin-punk-fixture`.
  It has five source groups, fifteen selected tracks, and `62.13` playable
  minutes; no audio was copied into Git, and no database/provider state was
  touched. The reusable inspector and constraints are in
  `docs/operations/CITY_TIER_RADIYO_FIXTURE.md` and commits `01ff887`,
  `a30a414`, and `09fe879`.
- Final integrated Sol review passed `ce31f6d` with no blocking or non-blocking
  findings.
- Preserved UX workspaces remain outside cleanup scope.

## Blockers

- Photo-guided avatar runtime cannot be treated as production-ready until its
  privacy, consent, retention, moderation, minors, storage, and provider
  boundaries are owner-locked.
- Public Signal archive runtime remains unapproved and intentionally isolated.
- RADIYO production automation requires approval of a dedicated worker and a
  database-backed run/lease ledger before schema or provider work begins.
- Playable staging media remains deferred: the active Release Deck contract is
  URL-only and does not authorize first-party upload/storage/transcoding.

## Next Signal

1. Review
   `docs/handoff/2026-08-01_city-tier-radiyo-automation-execution-packet.md`.
2. If its dedicated-worker and durable-run-ledger boundary is approved, begin
   Slice A only; do not start schema/provider work without separate approval.

## Agent Rules

- Load `docs/agent-briefs/CONTEXT_ROUTER.md` for product-lane work.
- Use `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` for current ownership and
  preservation intent.
- Keep `/home/baris/UPRISE_NEXT` as the one branch-owning local write workspace.
  Use fresh bounded subagents only for independent read-only research or review,
  and close them before assigning unrelated work.
- Do not add merged PR history or remote-ref inventories here.
- Refresh this file only when current work, blockers, preserved-risk
  workspaces, or the immediate next signal changes.
