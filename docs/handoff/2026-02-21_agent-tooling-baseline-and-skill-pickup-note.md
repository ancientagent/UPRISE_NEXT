# 2026-02-21 — Agent Tooling Baseline + Skill Pickup Note

## Scope
- Persist session-level tooling reminders to survive context compaction/new chat sessions.
- Record installed Codex skills and operational pickup requirement.

## Updates
- Updated `docs/solutions/SESSION_STANDING_DIRECTIVES.md` with a new tooling baseline rule block:
  - `python3` is canonical for Python scripts.
  - prefer local/workspace tooling first.
  - log tooling changes in changelog + handoff.
  - restart Codex after skill installs.
  - avoid global/system-level installs.
- Updated `docs/AGENT_STRATEGY_AND_HANDOFF.md` with tooling recovery notes under context-loss guidance.

## Session Tooling State
- Verified available command: `python3`.
- `python` alias was not present in shell.
- Installed Codex skills:
  - `gh-fix-ci`
  - `doc`
  - `playwright`

## Operator Note
Codex restart is required for newly installed skills to become active.
