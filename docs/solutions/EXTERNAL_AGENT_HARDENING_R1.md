# External Agent Hardening R1

Status: Active
Owner: product engineering
Last updated: 2026-04-21

## Purpose
Capture the external-agent workflow patterns that materially improve output quality for UPRISE without importing third-party system prompts wholesale.

This document is for:
- Abacus / ChatLLM / CoWork
- design agents
- delegation / swarm products
- future external writing and research assistants

This document is not product doctrine.
It is operating guidance for how external agents should work against the repo.

## Source Pattern Rule
Do not copy vendor system prompts into UPRISE.

Allowed:
- extract workflow patterns
- extract verification habits
- extract context-acquisition habits
- extract delegation/role-separation habits

Not allowed:
- wholesale prompt imports
- treating leaked vendor prompts as authority
- inheriting third-party product assumptions into UPRISE

## Core Hardening Rules

### 1) Context-first rule
Before new work, external agents must acquire context first.

Minimum expectation:
- identify the current authority files
- identify the active surface or system in scope
- identify whether the task is doctrine, runtime, design, or communications

For design work specifically:
- do not start from scratch if repo context, screenshots, or existing mockups exist
- ask for or read the current surface contract first
- prefer existing UI vocabulary over generic app patterns

### 2) Critical-decision pause rule
External agents should pause and re-evaluate before:
- making a major product claim
- switching from exploration to edits
- making a git/workflow decision
- reporting completion

The pause should answer:
- do I have the controlling docs?
- am I working against current runtime or historical carry-forward?
- am I about to drift scope?

### 3) Verification-before-closeout rule
External agents should not declare work complete until they verify the relevant outputs.

Examples:
- code/doc tasks: run the scoped checks that the repo expects
- design tasks: confirm the output loads, opens, or otherwise renders cleanly
- briefing tasks: confirm files cited are the controlling files, not historical-only carry-forward

### 4) Department-lane rule
External agents should operate as departments, not free-floating generalists.

#### Design department
May:
- explore layout
- explore visual systems
- produce mockups and design variations

May not:
- redefine action grammar
- flatten deferred work into active MVP truth
- imitate copyrighted branded UI too closely

#### Documentation / communications department
May:
- write briefs
- write emails
- summarize changes
- compare legacy to current

May not:
- invent product doctrine
- present stale docs as equal authority

#### Research / delegation department
May:
- compare tools
- generate rollout options
- gather competitor/market/process information

May not:
- silently promote external research above repo truth

### 5) Answer-shape rule
For substantive questions, external agents should separate:
1. locked now
2. implemented now
3. deferred
4. historical / later-version only

They should not flatten those into one blended answer.

### 6) Anti-trope rule
External agents must not default to Spotify, TikTok, Instagram, Facebook, or SaaS-dashboard patterns unless current UPRISE docs explicitly support them.

### 7) Originality / IP rule for design agents
Design agents should create original work rooted in UPRISE context.

Do not:
- recreate a company’s distinctive UI or branded command structure
- use outside product screenshots as something to copy literally

Do:
- use them as loose reference only
- anchor designs in UPRISE docs, art direction, and current route contracts

## Recommended Operating Sequence

### For doctrine / repo questions
1. read authority docs
2. identify active files in scope
3. separate lock vs runtime vs historical
4. answer with citations

### For design work
1. acquire current surface context
2. acquire any screenshots/mockups/design references
3. confirm what is locked vs flexible
4. produce options
5. verify the deliverable loads cleanly

### For delegation / swarm work
1. split tasks by department or deliverable
2. keep one shared fact base
3. consolidate outputs into one source-grounded summary
4. verify output consistency before returning

## Good Prompts Should Explicitly Include
- authority files to read first
- conflict-resolution instruction
- anti-trope warning
- expected output sections
- citation requirement
- explicit separation of lock / runtime / historical

## Integration Targets
These patterns should be reflected in:
- `.deepagent-desktop/rules/uprise_next_rules.md`
- `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- future swarm/delegation evaluation notes
