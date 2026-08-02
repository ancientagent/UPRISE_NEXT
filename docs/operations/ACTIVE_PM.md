# UPRISE Active PM

Status: active execution snapshot
Owner: current branch owner / context-steward
Last Updated: 2026-08-01

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
| Scope | Stabilize and normalize the mixed shared-local avatar, onboarding, public-entry, founder-context, and parked-work batch without losing unique work. Reconcile retained behavior with owner specs, correct build/security/migration defects, and leave coherent validated slices. |
| Owner | Codex local, sole writer |
| Validation | focused API/web tests, API/web typecheck, production web build, `pnpm run docs:lint`, `pnpm run workspace:audit`, `git diff --check`, and one independent final review for retained runtime |
| Out of Scope | Live provider calls, database migration execution, provider/database state changes, unapproved avatar privacy/retention/moderation policy, destructive stash/branch/worktree cleanup, full beta avatar catalog, and unrelated preserved UX extraction |

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

- The classic avatar construction proof is complete through `bae6895`.
- The post-proof working tree contains a mixed local batch spanning avatar art,
  avatar runtime/persistence, website entry/onboarding, Registrar profile setup,
  a public Signal prototype, and founder-session captures.
- A complete non-destructive pre-normalization checkpoint is stored outside the
  repo at
  `/mnt/c/Users/baris/uprise-agent-artifacts/uprise-shared-checkout-pre-normalization`
  (`C:\Users\baris\uprise-agent-artifacts\uprise-shared-checkout-pre-normalization`).
- Preserved UX workspaces remain outside cleanup scope.

## Blockers

- Photo-guided avatar runtime cannot be treated as production-ready until its
  privacy, consent, retention, moderation, minors, storage, and provider
  boundaries are owner-locked.
- The current `/registrar` integration fails the production web build because
  `useSearchParams()` is not under a Suspense boundary.
- The mixed local batch must be separated into coherent validated slices before
  any PR or merge.

## Next Signal

1. Recover unique founder-purpose and SQL-hardening parked work without applying
   unrelated stash content.
2. Preserve and classify the art/founder, public Signal, WSL preview, avatar
   runtime, and onboarding/Registrar slices.
3. Reconcile owner specs before retaining product behavior, then patch only
   settled low-risk build, security, migration, and contract defects.
4. Run focused and production validation plus one independent final review.
5. Leave the shared checkout clean and review-ready, then prepare the next
   city-tier Release Deck/RADIYO automation packet.

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
