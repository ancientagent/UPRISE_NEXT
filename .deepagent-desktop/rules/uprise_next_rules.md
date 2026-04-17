# UPRISE_NEXT Project Rules for Abacus Desktop / CoWork

## Core posture
- Treat this repo as a spec-first product system, not a generic app.
- Prefer the newest active founder locks, action matrix, specs, and dated handoffs over older implementation briefs.
- When sources conflict, separate:
  1. current active MVP lock
  2. legacy or later-version carry-forward
  3. current runtime reality
- Never flatten those into one answer.

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
- Clicking a discovery square should pause `RADIYO` and hand off into artist-profile demo listening.
- Artist profile is a demo-listen shell, not a wheel surface.
- Songs on artist profile are collected from the profile context, not added there.
- `Blast` belongs to `RADIYO` / `Collection`, not the artist profile.
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
