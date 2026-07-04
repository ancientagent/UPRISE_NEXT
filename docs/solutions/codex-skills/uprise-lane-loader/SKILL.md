---
name: uprise-lane-loader
description: Use when a non-trivial UPRISE task needs a focus lane, owner spec, companion brief, runtime/test target, validation path, or external-agent prompt packet; skip for exact-file edits and self-contained status questions.
---

# UPRISE Lane Loader

## Core Rule

Route by lane first, tool second. Do not bulk-load the platform.

## Required Start

From `/home/baris/UPRISE_NEXT`, run:

```bash
pwd
git branch --show-current
git rev-parse --short HEAD
git status --short
```

Then choose the smallest packet:

- Exact file/spec named by the user: read `AGENTS.md` plus that file and direct references only.
- Known lane, non-trivial task: read `AGENTS.md`, the relevant owner spec or lane brief, and exact runtime/tests.
- Unclear lane or cross-lane task: add `docs/PLATFORM_START_HERE.md`, `docs/AGENT_STRATEGY_AND_HANDOFF.md`, and `docs/agent-briefs/CONTEXT_ROUTER.md`.

If the task is about tools/agents, also read `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`.

Do not use this skill to justify broad loading. Its job is to stop at the
smallest defensible lane packet.

## Output Shape

Report this before acting:

```md
Lane: <lane>
Task type: implementation | audit | review | design | provider | planning | docs
Owner contract: <docs/specs/... path or none>
Default brief: <docs/agent-briefs/...>
Companion briefs: <only if touched>
Runtime/tests to inspect: <exact paths>
Validation: <commands>
Tool routing: <Codex | Cloud Codex | Hermes reviewer/auditor | Abacus | NotebookLM | design tool | Linear>
Stop conditions: <branch mismatch, founder decision, provider/db mutation, dirty worktree, etc.>
```

## Lane Hints

- onboarding, Home Scene, GPS, music-community preferences -> `ONBOARDING_HOME_SCENE`
- RADIYO, voting, Collect, Blast, Recommend, wheel -> `ACTIONS_SIGNALS`
- Artist Profile, Source Dashboard, Release Deck, Print Shop -> `ARTIST_SOURCE`
- Registrar, source origin, activation, sects -> `REGISTRAR_GOVERNANCE`
- Events, Archive, flyers, descriptive stats -> `EVENTS_ARCHIVE`
- UI, player, Plot, listener profile, design prompts -> `UX_UI`
- Vercel, Fly, Neon, CI, env, staging -> `INFRA_RUNTIME_QA`
- external tools, NotebookLM, Abacus, Hermes, Cloud Codex prompts -> `EXTERNAL_TOOLS`
- business, monetization, promos, pricing -> `BUSINESS_MONETIZATION`

## Subagent Skill Sharing

Do not pass the full skill catalog to subagents. Give each subagent one lane,
named files/docs, and at most 1-3 relevant skills.

Use this palette:

- Planning/implementation: `superpowers:writing-plans`, `superpowers:test-driven-development`, `superpowers:systematic-debugging`
- Independent work splits: `superpowers:subagent-driven-development`, `superpowers:dispatching-parallel-agents`
- PR/review/CI: `uprise-pr-reviewer`, `gh-address-comments`, `gh-fix-ci`
- Docs/authority drift: `uprise-doc-drift-audit`, `uprise-founder-clarification-capture`
- Branch/worktree cleanup: `uprise-branch-pr-hygiene`, `superpowers:using-git-worktrees`
- Frontend/UI: `vercel:nextjs`, `vercel:react-best-practices`, `playwright`
- Visual/design: `product-design:get-context`, `product-design:ideate`, `imagegen`, `figma`
- Provider/deploy: `vercel:vercel-cli`, `vercel:vercel-api`, `vercel:env-vars`, `vercel:turborepo`
- Database/storage: `neon-postgres:neon-postgres`, `neon-postgres:neon-postgres-egress-optimizer`, `vercel:vercel-storage`
- Security: `security-diff-scan`, `security-scan`, `security-threat-model`
- External prompts/PM: `uprise-external-agent-prompt`, `linear`, `github`

Do not share GISTer, Gmail/Calendar, Canva, broad creative-production,
analytics-dashboard, or niche Vercel skills unless the subagent task explicitly
needs that surface.

## Common Mistakes

- Loading old handoffs before active specs.
- Treating Linear, NotebookLM, Abacus, or chat memory as product authority.
- Asking broad product questions when the owner spec already settles the rule.
- Carrying prior-lane context into a new lane without checking the router.
