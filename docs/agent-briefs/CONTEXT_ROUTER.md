# Context Router And Focus Lanes

Status: active
Last Updated: 2026-04-25

## Purpose
Keep agent context light, flexible, and accurate by routing work through the current focus lane.

This file answers:
- what kind of work are we doing right now?
- which brief is loaded by default?
- which companion briefs are loaded only if the task touches them?
- which domains should stay unloaded unless explicitly needed?

This is not a product spec. It is a context-loading map.

## Core Rule
Load for the lane, not for the whole platform.

Default stack:
1. `AGENTS.md`
2. `docs/AGENT_STRATEGY_AND_HANDOFF.md`
3. this router
4. the active lane brief
5. companion briefs only if the task crosses into that domain
6. exact runtime/spec/lock files only when editing or auditing that surface

Do not load every file linked by every related document.

## Canon Anchor Rule
Canon is the semantic authority layer above section briefs.

Do not bulk-load every canon document for every task. Load the exact canon file when the task touches its domain or when a section brief/spec points to it.

Current canon set:
- `docs/canon/Master Narrative Canon.md` - core scene/community/Uprise/RaDIYo mechanics and prohibitions
- `docs/canon/Master Glossary Canon.md` - canonical terminology and term constraints
- `docs/canon/Master Identity and Philosohpy Canon.md` - platform identity, philosophy, and anti-extractive principles
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md` - surface/capability/lifecycle boundaries, not UI layout
- `docs/canon/Master Revenue Strategy Canonon.md` - revenue, business model, pricing, and economic constraints
- `docs/canon/UPRISE_VOICE_MESSAGING_CANONICAL.md` - voice, messaging, positioning, marketing language
- `docs/canon/How Uprise Works — Canon Audit (working).md` - working mechanics audit, especially broadcast/Fair Play references
- `docs/canon/Legacy Narrative plus Context .md` - canonical narrative/context reference; use carefully with newer locks
- `docs/canon/Operational Getting Started.md` - technical/project orientation
- `docs/canon/Expanded Getting Started.md` - expanded technical/project orientation

Canon loading examples:
- business / revenue / coupons / pricing -> load `Master Revenue Strategy Canonon.md`
- product terminology / naming -> load `Master Glossary Canon.md`
- platform philosophy / anti-trope concern -> load `Master Identity and Philosohpy Canon.md`
- surface/capability lifecycle -> load `Master Application Surfaces, Capabilities & Lifecycle Canon.md`
- marketing / emails / public explanation -> load `UPRISE_VOICE_MESSAGING_CANONICAL.md`
- scene/community/Uprise/RaDIYo mechanics -> load `Master Narrative Canon.md`

If canon conflicts with newer active founder locks or runtime-specific execution docs, do not flatten the conflict. Report:
- canon truth
- current MVP/founder lock
- runtime reality
- what needs reconciliation

## Active Focus Rule
The active focus is set by the user or by the immediate task.

Examples:
- “we are working on UI” -> `UX_UI`
- “business model / promos / coupons” -> `BUSINESS_MONETIZATION`
- “actions / wheel / blast / collect” -> `ACTIONS_SIGNALS`
- “artist profile / release deck / source dashboard” -> `ARTIST_SOURCE`
- “events / archive / flyers” -> `EVENTS_ARCHIVE`

If the focus is unclear, infer the narrowest lane from the files/surface being touched and state the assumption briefly.

## Lane Handoff Rule
When pivoting lanes:
- close the previous lane with a short status note if work was changed
- load the new lane brief
- load only companion briefs that the new task actually touches
- do not keep carrying prior-lane feature detail forward unless it affects the new lane

## Focus Lanes

### UX_UI
Use when working on:
- app layout
- screen hierarchy
- visual design
- wireframes
- mobile sizing/spacing
- player placement and behavior
- design-agent prompts
- art direction and mockup interpretation

Default load:
- `docs/agent-briefs/UI_CURRENT.md`

Load only if touched:
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md` when actions/wheel/buttons are visible
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md` when Artist Profile or source tools are on screen
- `docs/agent-briefs/EVENTS_ARCHIVE.md` when Events, Archive, calendar, flyers, or stats/history are on screen
- `docs/agent-briefs/EXTERNAL_TOOLS.md` when writing prompts for Claude/Stitch/NotebookLM/Abacus

Do not load by default:
- business model detail
- registrar formulas
- backend ownership rules
- pricing/monetization mechanics
- deployment/infrastructure
- old prompt packs or legacy docs

Work aims while focused:
- settle screen placement and hierarchy
- define user-facing behavior and visible states
- keep action visibility correct without implementing unrelated feature logic
- produce design-agent prompts or UI implementation slices

Exit criteria:
- screen order and interaction states are clear
- visible actions match current action grammar
- design-agent context can be handed off without feature-history bloat

### ACTIONS_SIGNALS
Use when working on:
- `Collect`
- `Blast`
- `Recommend`
- `Play It Loud`
- `Upvote`
- engagement wheel placement
- signal/action API behavior
- stale `Add` / `Support` action wording

Default load:
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`

Load only if touched:
- `docs/agent-briefs/UI_CURRENT.md` when actions are being placed on screens
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md` when action placement involves Artist Profile or source pages
- `docs/agent-briefs/EVENTS_ARCHIVE.md` when event `Add` or flyer artifact behavior is involved

Do not load by default:
- broad UI visual direction
- business monetization
- onboarding flow details
- old signal docs except to classify legacy debt

Work aims while focused:
- keep action grammar consistent
- separate broadcast, personal-player, artist-profile, event, artifact, and social-post actions
- prevent old `Add` / `Support` / `Blast` drift

Exit criteria:
- target action has one clear owner surface
- UI/API/docs use current labels or explicitly mark legacy compatibility
- tests or docs lint cover the drift risk where practical

### ARTIST_SOURCE
Use when working on:
- Artist Profile
- source pages
- Source Dashboard
- Release Deck
- Print Shop
- source account switching
- source-owned tracks/events

Default load:
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`

Load only if touched:
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md` when visible actions are involved
- `docs/agent-briefs/UI_CURRENT.md` when layout/screen behavior is involved
- `docs/agent-briefs/EVENTS_ARCHIVE.md` when source-owned events/flyers are involved
- `docs/agent-briefs/BUSINESS_MONETIZATION.md` when business source behavior, promos, coupons, pricing, or merchant surfaces are involved

Do not load by default:
- listener profile / collection workspace detail unless the task compares it with Artist Profile
- full business model detail unless the source is a business or monetized feature
- infrastructure/deployment

Work aims while focused:
- keep public Artist Profile separate from listener profile
- keep source tools inside source-dashboard mental model
- preserve one-account context switching
- keep Release Deck / Print Shop / Registrar boundaries clear

Exit criteria:
- source vs listener context is clear
- public profile and source dashboard responsibilities are not blended
- action placement matches the action brief

### EVENTS_ARCHIVE
Use when working on:
- Plot Events
- Archive
- event cards/details
- calendar behavior
- flyers/artifacts
- descriptive stats/history
- Scene Map / community records

Default load:
- `docs/agent-briefs/EVENTS_ARCHIVE.md`

Load only if touched:
- `docs/agent-briefs/UI_CURRENT.md` when placement/layout is involved
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md` when event `Add`, artifact `Collect`, or action placement is involved
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md` when source-owned events or Print Shop are involved
- `docs/agent-briefs/BUSINESS_MONETIZATION.md` when promos/coupons/offers attach to events

Do not load by default:
- full artist/source dashboard detail
- business model detail
- full analytics monetization unless explicitly in scope

Work aims while focused:
- keep Events as scheduled scene objects
- keep Archive descriptive, not ranked or predictive
- keep flyers as event-bound artifacts
- prevent stale `Statistics` / `Promotions` tab language from returning

Exit criteria:
- visible tab language stays `Feed`, `Events`, `Archive`
- event actions remain calendar/attendance oriented
- Archive stays descriptive and non-ranking

### BUSINESS_MONETIZATION
Use when working on:
- business accounts
- promos/coupons/offers
- monetization
- pricing/packages
- ads
- merchant/venue/business surfaces
- paid analytics products

Default load:
- `docs/agent-briefs/BUSINESS_MONETIZATION.md`

Load only if touched:
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md` when business operates as a source account
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md` when user actions are involved
- `docs/agent-briefs/EVENTS_ARCHIVE.md` when offers/promos attach to events
- `docs/agent-briefs/UI_CURRENT.md` when designing visible screens

Do not load by default:
- unrelated Home/Plot UI detail
- full registrar flow
- unrelated artist profile playback rules

Work aims while focused:
- define business/source model and limits
- separate business revenue surfaces from community governance
- keep paid behavior from affecting Fair Play or ranking authority

Exit criteria:
- business capability is scoped
- user-visible surfaces and source-dashboard surfaces are separated
- monetization does not create governance or ranking drift

### ONBOARDING_HOME_SCENE
Use when working on:
- onboarding
- Home Scene resolution
- GPS verification
- pioneer fallback
- community identity tuple
- first-run flow
- registrar questions tied to onboarding

Default load:
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`

Load only if touched:
- `docs/agent-briefs/UI_CURRENT.md` when onboarding affects Home/Plot layout
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md` when onboarding gates actions
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md` when filing/capability rules are in scope

Do not load by default:
- business monetization
- artist profile playback
- event archive detail

Work aims while focused:
- preserve community identity as `city + state + music community`
- keep GPS/local authority rules clear
- avoid asking users to redefine known community context

Exit criteria:
- Home Scene identity is resolved or intentionally fallbacked
- action/governance gates are clear
- first-run flow does not widen product scope

### REGISTRAR_GOVERNANCE
Use when working on:
- Registrar
- capability questions
- civic proposals / backing
- source formalization
- promoter capability
- community governance rules

Default load:
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`

Load only if touched:
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md` when Home Scene/GPS gates are involved
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md` when source-side access is involved
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md` when procedural actions such as `Back` need distinction from public actions

Do not load by default:
- visual UI detail beyond the current registrar surface
- business model detail unless capability/business rules are in scope

Work aims while focused:
- separate Registrar procedure from public engagement actions
- preserve Home Scene and capability gates
- avoid turning governance into popularity/ranking mechanics

Exit criteria:
- actor/capability boundaries are clear
- procedural actions are not exposed as public social actions
- source/listener context is not blended incorrectly

### EXTERNAL_TOOLS
Use when working on:
- NotebookLM
- Cloud Codex prompts
- Claude Designer
- Stitch
- Abacus / CoWork
- generated wiki / DeepWiki / Devin
- cross-agent handoffs

Default load:
- `docs/agent-briefs/EXTERNAL_TOOLS.md`

Load only if touched:
- the active product lane brief for the subject being handed off
- `docs/agent-briefs/UI_CURRENT.md` for design tools
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md` for action grammar prompts

Do not load by default:
- all product briefs
- all handoffs
- old prompt packs unless auditing them as historical context

Work aims while focused:
- produce narrow prompts
- prevent external tools from becoming authority
- keep generated docs/wikis aligned with repo truth

Exit criteria:
- external tool knows what to read first
- scope and stop conditions are explicit
- output is classified as proposal, audit, design, or implementation

### INFRA_RUNTIME_QA
Use when working on:
- build/test/deploy
- CI
- Vercel/Fly/AWS/Neon/S3/R2
- web-tier boundary
- QA reports
- environment failures

Default load:
- `docs/RUNBOOK.md`
- `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`
- `apps/web/WEB_TIER_BOUNDARY.md` for web work

Load only if touched:
- the active product lane brief if the bug affects product behavior
- relevant handoff tied to the branch/commit under test

Do not load by default:
- product feature doctrine unrelated to the failing check
- design/art context
- business/registrar details unless failure touches them

Work aims while focused:
- classify issue as bug, stale, environment, fixture/data, or product decision
- fix the narrow failure
- verify on the current branch state

Exit criteria:
- failure is reproduced or classified
- fix is verified with the narrowest relevant command
- handoff includes branch/commit and setup context when needed

## Companion Brief Decision Table

| If the active task touches... | Also load... |
| --- | --- |
| visible buttons, wheels, action labels | `ACTIONS_AND_SIGNALS.md` |
| Artist Profile, source pages, Release Deck, Print Shop | `ARTIST_PROFILE_SOURCE_DASHBOARD.md` |
| Events, Archive, calendar, flyers, stats/history | `EVENTS_ARCHIVE.md` |
| Home/Plot/player/profile layout | `UI_CURRENT.md` |
| business, promo, coupon, offer, paid ad, monetization | `BUSINESS_MONETIZATION.md` |
| onboarding, GPS, Home Scene, first-run | `ONBOARDING_HOME_SCENE.md` |
| registrar, capability, backing, governance | `REGISTRAR_GOVERNANCE.md` |
| external assistants or design prompts | `EXTERNAL_TOOLS.md` |
| deployment, CI, environment, web boundary | infra/runtime docs only |

## Minimal Agent Start Prompt
Use this when starting a new agent on a focused lane:

```text
Work in the <LANE> focus lane.
Read AGENTS.md, docs/AGENT_STRATEGY_AND_HANDOFF.md, docs/agent-briefs/CONTEXT_ROUTER.md, and the <LANE> brief.
Do not bulk-read every related document.
Load companion briefs only if the task touches their domain.
If you need implementation evidence, open the exact route/component/spec files you will touch.
State which lane and companion briefs you loaded before acting.
```

## Update Rule
When a new recurring work area appears, add it as a lane here before creating more one-off guidance.
