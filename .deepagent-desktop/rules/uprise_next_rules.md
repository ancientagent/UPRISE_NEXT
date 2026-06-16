# UPRISE_NEXT Project Rules for Abacus Desktop / CoWork

## Core posture
- Treat this repo as a spec-first product system, not a generic app.
- Prefer the newest active founder locks, action matrix, specs, and dated handoffs over older implementation briefs.
- Use `docs/solutions/EXTERNAL_AGENT_HARDENING_R1.md` patterns when operating as an external assistant.
- When sources conflict, separate:
  1. current active MVP lock
  2. legacy or later-version carry-forward
  3. current runtime reality
- Never flatten those into one answer.

## Required working habits
- Acquire context before proposing solutions or producing outputs.
- Pause before critical decisions, before switching from exploration to edits, and before reporting completion.
- Verify relevant outputs before declaring work complete.
- Use the repo's current surfaces and docs before resorting to generic app patterns.

## Repo boundaries
- Repo path: `/home/baris/UPRISE_NEXT`
- Work in WSL/Linux paths, not Windows `C:\` paths.
- Package manager: `pnpm` only.
- Do not use yarn in this repo.
- Do not assume DeepAgent or local tooling is production infra.
- Web tier must not access DB/server modules directly.

## Authority order
1. `AGENTS.md`
2. `docs/canon/`
3. active `docs/specs/`
4. active founder locks / execution docs in `docs/solutions/`
5. current code/runtime
6. `docs/handoff/`
7. chat memory

## Current active product truths to respect
- MVP is currently local-community-only while borders remain closed.
- Live `/discover` is deferred; discovery value currently arrives through intermittent feed inserts.
- Feed inserts are read-only titled carousels, not inline action cards.
- Clicking a discovery square should pause `RADIYO` and hand off into artist-profile listening.
- Artist profile is a direct-listen, discovery, information, and sharing surface outside `RADIYO`, not a wheel surface.
- Songs on artist profile are collected from the profile context and can be recommended there once the listener genuinely holds them.
- `Blast` belongs to the personal player / `SPACE`, not `RADIYO` and not the artist profile.
- `Add` is reserved for events/calendar only.

## Current key docs to prefer
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/handoff/2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md`

## What Abacus is best used for here
- drafting docs, memos, emails, and summaries
- comparing older docs against current locks
- extracting usable requirements from legacy materials
- building curated briefing packs
- preparing implementation slice plans

## What Abacus should not do by default
- do not assume old canon equals current MVP runtime
- do not invent product behavior from generic app tropes
- do not rewrite doctrine without citing the current controlling docs
- do not treat historical implementation briefs as current authority
- do not copy third-party system prompts or workflow text wholesale into repo guidance
- do not run destructive git commands
- do not perform global installs or admin/system changes

## Output style
- be explicit about what is:
  - locked now
  - deferred
  - implemented now
  - legacy/later-version only
- keep answers structured and concise
- cite exact files when making repo claims

## Design-agent guardrails
- do not start design work from scratch if repo context, screenshots, or mockups exist
- acquire the current surface contract first
- keep work original; do not recreate distinctive third-party branded UI literally
- separate what is locked from what is visually flexible
