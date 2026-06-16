# 2026-04-18 — Repo Authority Map And Wiki Steering

## Summary
Added a repo-side steering layer so generated wikis and external assistants can understand `UPRISE_NEXT` without treating stale legacy docs, old prompt packs, or historical handoffs as current product truth.

## Added
- `docs/solutions/REPO_AUTHORITY_MAP_R1.md`
- `docs/solutions/AGENT_WIKI_STEERING_R1.md`
- `.devin/wiki.json`

## Why
The repo already had:
- authoritative docs in git
- an Abacus rules file
- an external assistant briefing
- a NotebookLM sync rule

What it did not yet have was:
- one explicit authority map for repo truth
- one explicit steering file for generated repo wikis
- one DeepWiki/Devin-compatible config file to bias indexing toward the current active MVP doctrine

Without these, external tools are more likely to:
- overweight `docs/legacy/**`
- blend older prompt packs into current action grammar
- flatten founder locks, runtime lag, and historical carry-forward into one answer

## What The New Files Do
### `docs/solutions/REPO_AUTHORITY_MAP_R1.md`
Defines:
- authority order
- active current lock set
- current runtime reality layer
- legacy/lower-priority material
- conflict resolution rules
- external assistant department model

### `docs/solutions/AGENT_WIKI_STEERING_R1.md`
Defines:
- what a generated wiki should prioritize
- what it should deprioritize
- what it must separate explicitly
- what kinds of stale material it should not silently normalize

### `.devin/wiki.json`
Provides a first-pass DeepWiki/Devin steering config with:
- repo notes about authority and legacy handling
- explicit page families for:
  - repo overview
  - authority rules
  - architecture
  - action grammar
  - listening modes
  - routes/surfaces
  - artist profile
  - API/shared contracts
  - fixtures/QA
  - deferred/legacy domains
  - external assistant operating model

## Operating Model
This adds the missing structure for treating external tools like separate departments:
- design tools can ideate layout without redefining product truth
- writing assistants can draft and summarize without inventing doctrine
- generated wikis can map the repo without becoming authority themselves

## Verification
- `pnpm run docs:lint`
- `git diff --check`
