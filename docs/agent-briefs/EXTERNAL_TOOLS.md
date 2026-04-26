# External Tools Agent Brief

Status: active
Last Updated: 2026-04-25

## Use When
Use this brief when the task is about:
- Cloud Codex prompts
- NotebookLM
- Claude Designer
- Stitch
- Gemini visual agents
- Abacus / CoWork / ChatLLM
- generated wiki / Devin / DeepWiki
- external audits
- cross-agent handoffs
- repo briefing packs
- marketing/email/doc drafts through external assistants

## Do Not Use For
- normal implementation work unless delegating or prompting an external tool
- internal-only code review without external assistant involvement
- product doctrine changes that should instead update specs/founder locks directly

## Loading Rule
Start with the normal repo entry rules, `CONTEXT_ROUTER.md`, then this brief.

External tools are departments, not authorities. Load the active product lane brief for the subject being handed off, then give the external tool a narrow task and stop condition.

## Section Pointers
External guidance:
- `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`
- `docs/solutions/EXTERNAL_AGENT_HARDENING_R1.md`
- `docs/solutions/AGENT_WIKI_STEERING_R1.md`
- `docs/solutions/REPO_AUTHORITY_MAP_R1.md`
- `.devin/wiki.json`
- `.deepagent-desktop/rules/uprise_next_rules.md`

Agent context:
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/agent-briefs/EVENTS_ARCHIVE.md`
- active lane brief for the task subject

Handoffs:
- current high-value handoffs listed in `docs/handoff/README.md`
- task-specific dated handoff only when needed

## Current Truth
- External assistants never outrank repo truth.
- External assistants should acquire context before answering or designing.
- External assistants must separate locked now, implemented now, deferred, and historical/later-version context.
- Design tools can explore visual/layout options but cannot redefine action grammar or surface boundaries.
- Writing tools can draft briefs/emails/docs but cannot invent doctrine.
- Coding/delegation agents must implement only from active specs/locks/runtime evidence.
- Generated wikis are maps, not product authority.
- NotebookLM should be kept aligned when doctrine, active surface behavior, action grammar, or major runtime shape changes materially.
- For UI/design tools, code/UX references come before art references.

## Current Runtime / Tooling Pointers
- `.devin/wiki.json` provides generated-wiki steering and page plan.
- `.deepagent-desktop/rules/uprise_next_rules.md` provides Abacus/Desktop-style external assistant rules.
- `docs/solutions/AGENT_WIKI_STEERING_R1.md` defines generated wiki priorities.
- `docs/agent-briefs/CONTEXT_ROUTER.md` selects the active focus lane before prompting an external tool.

## Companion Briefs
Load only if touched:
- `UI_CURRENT.md` for Claude Designer, Stitch, Gemini visual/UI tasks.
- `ACTIONS_AND_SIGNALS.md` for any prompt involving buttons, wheel actions, Collect/Blast/Recommend/Play It Loud/Upvote.
- `ARTIST_PROFILE_SOURCE_DASHBOARD.md` for Artist Profile, source dashboard, Release Deck, or Print Shop prompts.
- `EVENTS_ARCHIVE.md` for Events, Archive, flyers, calendar, or stats/history prompts.
- `BUSINESS_MONETIZATION.md` for business, promo, coupon, offer, monetization, premium analytics, launch revenue prompts.
- `ONBOARDING_HOME_SCENE.md` for onboarding, Home Scene, GPS, pioneer, or first-run prompts.
- `REGISTRAR_GOVERNANCE.md` for Registrar, capability, backing, governance, or promoter capability prompts.

## Prompting Boundaries
- Prefer audit/plan mode before edit mode when stale context or broad cleanup is possible.
- Tell external tools what branch/commit to inspect.
- Tell external tools to stop if branch/commit mismatches unless a wrapper work branch has the expected HEAD and you explicitly accept that.
- Ask for classification before edits: accept, defer, reject, needs founder decision, needs repo verification.
- Do not ask broad agents to “clean up all old jargon everywhere.” Scope active docs/runtime-visible copy only.
- Do not let external tools rewrite historical docs unless the task is explicitly archival labeling.
- Do not paste vendor/system prompts into repo docs; extract reusable operating patterns only.

## Design-Agent Rules
For Claude Designer, Stitch, Gemini, or similar:
- give the active lane brief first
- give screen hierarchy and behavior before art references
- stop the tool if it makes Plot a standalone screen
- stop the tool if it creates current MVP `Promotions` or `Statistics` tabs
- stop the tool if it places the engagement wheel on Artist Profile
- stop the tool if it designs a generic Spotify/TikTok/Instagram clone

## Output Expectations
For substantive external-tool reports, require:
- files read
- current lock
- runtime reality
- historical/deferred context
- findings classified by risk/status
- recommended minimal fix
- exact commands run, if applicable

## Verification
For prompt/doc changes:
- `pnpm run docs:lint`
- `git diff --check`

For external-code changes:
- run the narrowest relevant package tests
- run `pnpm run verify` before PR/closeout when feasible

## Update Rule
Patch this brief whenever external assistant workflow, NotebookLM sync behavior, generated wiki steering, or design-agent handoff rules change.
