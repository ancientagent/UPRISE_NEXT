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
| Scope | Preserve the completed shared-local normalization and validated Austin Punk local RADIYO fixture, with the city-tier RADIYO lifecycle preview coordinator implemented and the durable run/lease owner contract independently reviewed. |
| Owner | Codex local, sole writer |
| Validation | focused API/web tests passed; `pnpm run verify` passed; production web build passed; RADIYO measurement/scheduling/ingestion/graduation tests passed (`53` tests); `pnpm run docs:lint`, `pnpm run workspace:audit`, and `git diff --check` passed; Slice A and durable run/lease owner-contract Sol reviews passed with no findings |
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
- Independent Sol plan review on 2026-08-02 confirmed ingestion and graduation
  can be coordinated in preview mode, but corrected the first slice: recurrence
  has no non-mutating preview path or durable 48-hour cadence state, so it is
  deferred to the ledger-bearing Slice B.
- Slice A is now implemented as a local preview-only coordinator. It delegates
  only to dry-run ingestion/graduation, has no caller or trigger, and was passed
  by an independent Sol implementation review with no findings.
- The durable run/lease contract is promoted in
  `docs/specs/broadcast/radiyo-and-fair-play.md` and passed independent owner-
  contract review with no findings. It requires repeatable UTC dispatch windows,
  token-fenced leases, canonical recurrence buckets, and same-transaction
  city-tier recurrence application/completion.
- Preserved UX workspaces remain outside cleanup scope.

## Blockers

- Photo-guided avatar runtime cannot be treated as production-ready until its
  privacy, consent, retention, moderation, minors, storage, and provider
  boundaries are owner-locked.
- Public Signal archive runtime remains unapproved and intentionally isolated.
- RADIYO production automation still requires a dedicated worker, database-
  backed run/lease ledger, and operations approval before provider or staging
  work begins.
- Slice B has an approved owner contract but still requires a reviewed
  schema-bearing execution packet before recurrence or any automatic write path
  can begin.
- Playable staging media remains deferred: the active Release Deck contract is
  URL-only and does not authorize first-party upload/storage/transcoding.

## Next Signal

1. Preserve the reviewed Slice A and durable contract checkpoints described in
   `docs/handoff/2026-08-02_city-tier-radiyo-lifecycle-slice-a-preview.md` and
   `docs/handoff/2026-08-02_city-tier-radiyo-durable-run-contract.md`.
2. Prepare and independently review the Slice B schema-bearing execution packet.
   Do not start provider, worker-host, or staging work.

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
