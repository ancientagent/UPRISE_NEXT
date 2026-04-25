# 2026-04-25 - Agent Section Briefs

## Purpose
Create a repo-visible replacement for chat-memory-only section context.

The user identified that working memory is phasing out or becoming unreliable for long-running UI/product sections. Future agents need a narrow doc they can load when the session shifts to a section such as UI.

## What Changed
- Added `docs/agent-briefs/README.md` as the section-brief router.
- Added `docs/agent-briefs/TEMPLATE.md` for future section briefs.
- Added `docs/agent-briefs/UI_CURRENT.md` as the active UI/frontend/design-agent context packet.
- Updated `docs/AGENT_STRATEGY_AND_HANDOFF.md` so section-specific work loads the matching brief.
- Updated `docs/README.md` and `docs/PROJECT_STRUCTURE.md` to expose the new folder.

## Current UI Brief Covers
- Home contains Plot.
- Plot is not a standalone screen.
- Current Plot tabs are `Feed`, `Events`, `Archive`.
- `Buzz` is the recommendation insert label.
- Player pull-down opens profile / collection workspace in-place.
- Expanded profile turns the player into a bottom strip and replaces Plot tabs.
- Artist Profile is a direct-listen/info/share surface outside `RADIYO`.
- Design-agent guardrails for Claude Designer / Stitch / Gemini-style tools.

## Maintenance Rule
When a founder correction changes a section's active truth, patch the matching `docs/agent-briefs/` file in the same pass as the lock/spec/handoff update.
