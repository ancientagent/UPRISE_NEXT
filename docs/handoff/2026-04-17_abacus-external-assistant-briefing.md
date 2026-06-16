# 2026-04-17 — Abacus External Assistant Briefing Setup

## Summary
Added two repo-side artifacts so Abacus CoWork/Desktop can understand UPRISE from controlled sources instead of guessing from raw repo history:
- `.deepagent-desktop/rules/uprise_next_rules.md`
- `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`

## Why
Abacus is capable enough to help with:
- documents
- email drafts
- briefings
- legacy-vs-current reconciliation
- implementation planning notes

But without a controlled repo briefing it will tend to:
- blend older canon with newer founder locks
- over-trust stale implementation briefs
- flatten locked doctrine and runtime reality into one answer

## What The New Artifacts Do
### `.deepagent-desktop/rules/uprise_next_rules.md`
Gives Abacus project rules for:
- repo path / WSL usage
- `pnpm` only
- current authority order
- current MVP truths to respect
- what it should and should not do by default
- expected answer style

### `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`
Provides a reusable briefing that explains:
- repo identity and structure
- how to read authority correctly
- the core current docs it should use
- the current MVP truths that matter most
- what is locked vs merely implemented vs legacy
- the standing sync rule for external-memory tools

## Outcome
Abacus now has:
- a project-specific rules file it can read directly
- a high-signal repo briefing designed for external assistants

This should improve its performance on:
- document generation
- summary work
- product/doctrine answers
- planning artifacts

## Verification
- `pnpm run docs:lint`
- `git diff --check`
