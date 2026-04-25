# External Assistant Repo Brief R1

Status: Active
Owner: product engineering
Last updated: 2026-04-21

## Purpose
Give external assistants such as Abacus CoWork/Desktop a controlled understanding of the UPRISE_NEXT repo so they can help with:
- documents
- briefings
- handoff notes
- email drafts
- legacy-vs-current reconciliation
- planning artifacts

This document is not a replacement for the controlling docs. It is a context bridge so external tools do not have to infer the repo from raw file sprawl.

External assistants should also follow:
- `docs/solutions/EXTERNAL_AGENT_HARDENING_R1.md`

## Repo Identity
- Repo: `UPRISE_NEXT`
- Path: `/home/baris/UPRISE_NEXT`
- Stack:
  - `apps/web` = Next.js web app
  - `apps/api` = NestJS API
  - `apps/socket` = realtime transport
  - `packages/ui`, `packages/types`, other shared packages
- Package manager: `pnpm`
- Platform model: one signed-in web platform with listener context and source-account context

## How To Read This Repo Correctly
Use this authority order:
1. `AGENTS.md`
2. `docs/canon/`
3. active `docs/specs/`
4. active founder locks / execution docs in `docs/solutions/`
5. current runtime/code evidence
6. `docs/handoff/`
7. chat memory

Important:
- newer founder locks and the action matrix override older mixed implementation briefs
- legacy canon can contain valuable carry-forward detail, but it must not be mistaken for active MVP runtime truth without confirmation
- do not copy external vendor system prompts into UPRISE workflows; extract only reusable operating patterns

## Required External-Assistant Habits
- acquire context first
- pause before critical decisions, before edits, and before completion
- verify outputs before declaring work complete
- separate lock vs runtime vs historical in every substantive answer

## Read-First Pack For External Assistants
### Core orientation
- `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`

### Current active product/system truth
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/discovery-scene-switching.md`

### Current external-memory bridge
- `docs/handoff/2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md`

## Current MVP Truths That Matter Most
### 1) MVP border state
- MVP is currently local-community-only while borders remain closed.
- Live `/discover` is deferred for now.
- Discovery value currently comes through intermittent feed inserts, not a live Discover destination.

### 2) Feed inserts
- discovery/statistics inserts are occasional feed moments, not fixed rails
- they render as titled horizontal carousels
- the cards are read-only launch surfaces
- no inline `Collect`, `Blast`, `Follow`, or wheel actions on those cards

### 3) Artist profile
- artist profile is a public source page and direct-listen/discovery surface outside `RADIYO`
- it is not `RADIYO`
- it is not the personal player / `SPACE`
- it does not use the wheel
- the intended current lock is:
  - `3` song rows
  - play/pause + timeline
  - `Collect` from profile listening context
  - official artist-controlled outbound links when configured
  - no `Blast` there

### 4) Action grammar
- `Collect` = keep/save for signals and artifacts
- `Add` = events/calendar only
- `Play It Loud` = positive `RADIYO` listening action for the current broadcast song
- `Blast` = hosted social-moment action from the personal player / user space
- `React` = posts/comments/replies
- `Support` = derived backing state, not a direct public button

### 5) Source vs signal vs artifact vs event
- `single`, `Uprise` = signals
- `flyer`, `poster`, `gear` = artifacts
- shows/afterparties/meet-and-greets = events
- events are not sources

## Current Repo/Runtime Reality To Keep Separate From Locks
- some newer doctrine is locked but not fully implemented yet
- current live artist profile now has direct listening, `Collect`, recommendation gated by actual holding, optional official links, and source-level share, but it is not fully polished to the complete page vision yet
- Plot feed now includes live intermittent inserts for `Popular Singles`, `Buzz`, and `Upcoming Events`, with song handoff into artist-profile listening
- source dashboard / release deck / print shop / registrar bridges are already live in some form

External assistants should clearly label answers as one of:
- locked and implemented
- locked, implementation pending
- historical / legacy carry-forward

## Best Uses For External Assistants In This Repo
Use external assistants for:
- doc drafting
- email drafting
- briefing packs
- compare/contrast between legacy docs and current locks
- summarize last month of changes
- draft implementation slice plans
- identify stale docs that conflict with current doctrine

Do not rely on them by default for:
- primary coding authority
- product-truth decisions without citation
- inference from the whole repo without a curated reading set

## Standing Sync Rule
Whenever a slice materially changes:
- doctrine
- active surface behavior
- action grammar
- major runtime shape

update the external-memory bridge in the same pass:
- either refresh the active briefing doc
- or add a dated sync note under `docs/handoff/`

This is now a standing repo rule, not an optional reminder.

## Recommended Prompt For Abacus
```text
Answer from the latest active founder locks, action matrix, active specs, and recent handoff notes first.

When sources conflict, separate:
1. current active MVP lock
2. legacy/later-version carry-forward
3. current runtime reality

Do not flatten those into one answer.
Do not use older implementation briefs as current authority.
Cite exact repo files whenever making product or system claims.
Acquire context first, pause before critical decisions, and verify outputs before reporting completion.
```
