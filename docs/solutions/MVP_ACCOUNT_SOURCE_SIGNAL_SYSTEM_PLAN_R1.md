# MVP Account, Source, and Signal System Plan (R1)

Status: Active implementation plan  
Owner: Founder + product engineering  
Last updated: 2026-04-12

## 1) Purpose
Define the top-down implementation plan for the post-mobile/web split architecture now that UPRISE is being rebuilt as one web platform.

This plan turns the currently locked doctrine into a staged implementation map for:
- user account system
- listener layer
- source account / source dashboard system
- signals system
- Registrar
- Print Shop
- shell navigation and account-context switching

## 2) Core System Model
UPRISE should no longer be treated as:
- listener app on one platform
- source tools on another platform

It should be treated as:
- one signed-in web platform
- one base user account
- additive capabilities and attached sources
- explicit in-app switching between listener context and source-account context

## 3) System Layers
### 3.1 User Account
The base identity system.

Responsibilities:
- authentication
- base listener identity
- Home Scene / civic identity
- onboarding state
- attached source relationships
- additive capabilities

### 3.2 Listener Layer
The default participation layer.

Responsibilities:
- onboarding
- Home / Plot
- Discover
- community participation
- profile / collection
- listening context
- signal actions available to listeners

### 3.3 Source Account / Source Dashboard
The creator/operator layer inside the same signed-in platform.

Responsibilities:
- switch into managed source accounts/entities
- source profile management
- source tools/features
- source-facing updates/actions
- source analytics/status
- Print Shop access
- later creator-specific workflows

### 3.4 Signals System
Signals are their own system and must not be collapsed into source logic.

Responsibilities:
- define signal types
- define which source carries which signal
- define which listener actions are valid for each signal
- define collection shelf mapping
- define propagation rules without turning them into authority systems

### 3.5 Registrar
The civic/formalization system.

Responsibilities:
- artist/band registration
- promoter capability flows
- sect/cause/civic motion flows when active
- backing/motion/approval state
- capability-code completion

### 3.6 Print Shop
The source-facing issuance/event tool.

Responsibilities:
- event creation
- later issuance/run flows
- later flyer/artifact handling
- later promotion-package attachment

## 4) Current Runtime Reality
### Already true
- one login/account model
- additive source relationships via `managedArtistBands`
- source-facing Print Shop event creation
- artist-source and Plot bridges into Print Shop
- registrar source-facing bridge direction

### Not yet true
- a first-class source dashboard route/system
- a full account-context switcher across the web shell
- explicit source-mode shell treatment
- a centralized signals system surface/contract
- promotion-package runtime

## 5) Implementation Phases
### Phase A — Account Context Foundations
Goal:
- make the one-account / many-source model explicit in runtime

Deliver:
- persistent source-account context store
- source-account switcher in the web shell
- listener-context reset path
- active source summary in runtime surfaces

Current first slice:
- Plot-side source-account switcher

### Phase B — Source Dashboard Emergence
Goal:
- stop treating source tools as scattered route bridges

Deliver:
- dedicated source dashboard surface or shell region
- source-summary header
- source tools/modules list
- source-profile access from the same dashboard system

### Phase C — Signals System Consolidation
Goal:
- formalize signals as a first-class system

Deliver:
- explicit signal taxonomy audit
- source-to-signal mapping table
- signal-action matrix
- shelf mapping audit
- route/runtime cleanup where source and signal behavior are mixed

### Phase D — Registrar / Source Integration
Goal:
- connect civic formalization cleanly to source emergence

Deliver:
- registrar access from source-facing side
- clearer source-emergence states from registrar outcomes
- sect/cause/source relationship reconciliation when those slices activate

### Phase E — Print Shop / Promotion Attachment
Goal:
- attach paid/event promotion behavior to the source system without drifting

Deliver:
- source-aware event promotion package model
- explicit scope selection
- package status visibility on source/event surfaces
- no Fair Play / authority impact

## 6) Runtime Priorities
### Immediate
1. persistent source-account switching
2. source-account visibility in listener shell
3. source-dashboard/system language carried into runtime

### Next
1. dedicated source dashboard surface
2. active-source-aware creator tools
3. signal-system consolidation

### Later
1. promotion-package runtime
2. richer source analytics
3. broader source domains as later-version scope returns

## 7) Guardrails
- do not reintroduce separate-app thinking
- do not create a second login tree for source use
- do not collapse signals into sources
- do not collapse Registrar into source tools
- do not treat route bridges as the conceptual system
- do not widen business/promotions runtime while it remains deferred

## 8) First Concrete Build Sequence
1. Add source-account switcher/state to the web shell.
2. Surface current source context on creator routes.
3. Define the dedicated source dashboard surface contract.
4. Route Print Shop under that dashboard model more explicitly.
5. Build signal-system reconciliation against existing source/signal laws.

## 9) Success Criteria
This plan is succeeding when:
- users understand they have one account with multiple possible operating contexts
- attached artists/bands feel like switchable managed accounts
- source tools feel like one coherent dashboard system
- signal rules are implemented consistently across surfaces
- creator/event tooling no longer feels like isolated utility routes
