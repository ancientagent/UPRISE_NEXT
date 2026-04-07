# Software Systems Guardrails (R1)

Status: Active
Owner: Founder + product engineering
Last updated: 2026-04-02

## 1) Purpose
Give agents and contributors a strict software-systems rule set for UPRISE so they stop solving surfaces as isolated screens and start treating the product as one connected system.

This document is for:
- systems thinking
- software composition discipline
- state/context inheritance discipline
- control-surface discipline
- avoiding parallel or contradictory UX logic

This document is **not** a replacement for canon, specs, or founder locks.
It exists to prevent bad implementation thinking.

## 2) Authority And Use
Apply this document together with:
1. direct founder-confirmed behavior in active founder locks
2. `docs/specs/*`
3. `docs/solutions/SESSION_STANDING_DIRECTIVES.md`
4. this file

Important:
- Do **not** derive new product behavior from this file alone.
- Use this file to shape implementation reasoning, not to invent features.
- If a rule here conflicts with founder-confirmed surface behavior, founder-confirmed behavior wins.

## 3) Non-Negotiable Software Rules

### Rule 0: Every surface spec must account for the persistent player
The player is a platform-level persistent system.
It must be considered any time a screen, feature, menu, modal, or interaction flow is discussed, designed, specified, or implemented.

This does not mean every surface needs unique player controls.
It means every spec must explicitly answer:
- whether the player is visible on that surface
- what player context/state the surface inherits
- whether the surface can affect player state
- whether the player constrains search, travel, navigation, or content scope on that surface

Reject:
- specs that omit player behavior on player-adjacent surfaces
- UI proposals that treat the player as optional chrome
- page/feature logic written as if the player does not persist
- implementation work that leaves player inheritance undefined

### Rule 1: One source of context
Every surface must know what currently anchors it.

For MVP, likely anchors include:
- Home Scene
- tuned scene
- current player mode
- current player tier
- current visitor/local status

If a surface already has an anchor, do not create a second competing one.

Reject:
- parallel context controls that fight each other
- one part of the screen using Home Scene while another uses unrelated ad hoc local state
- independent search/travel models that ignore the active player/listening context

### Rule 2: Persistent systems must stay authoritative
If a system is persistent across screens, it is not decorative.
It is a governing system.

In MVP, the player is such a system.
If the player persists, then surfaces that sit around it must respect:
- active mode
- active tier
- active listening context

Reject:
- surfaces that pretend the player does not exist
- duplicate tier controls that compete with player tier
- “discovery” behavior detached from the current listening state when the player is visibly present

### Rule 3: No parallel interaction models for the same job
If one job already has a controlling interaction model, do not build a second one in the same surface.

Examples:
- if travel is an extension of current listening context, it should not also exist as a separate primary search system with different rules
- if a page has one true context anchor, do not add a second pseudo-anchor elsewhere in the same flow

Reject:
- split control models that make the user answer the same question twice
- separate travel/search/navigation systems for the same intent unless the distinction is explicit and necessary

### Rule 4: Context inheritance beats re-selection
When the app already knows the current community identity, inherit it.
Do not ask the user to redefine it indirectly through redundant controls.

UPRISE identity rule remains:
- `city + state + music community`

Reject:
- re-selecting music community when arriving from a known community context
- generic discovery/search patterns that erase inherited scene identity
- travel tools that forget origin context

### Rule 5: Geography changes do not equal identity changes
When a user travels, retunes, or explores, geography may change while parent community identity remains fixed.

Tier changes and travel expansions must not silently mutate:
- Home Scene
- civic authority
- parent music-community context

Reject:
- implementations that conflate travel with join
- implementations that collapse city/state/national into generic radius browsing
- silent authority changes triggered by navigation

### Rule 6: Structural controls are not decorative UI
Controls such as tabs, toggles, and persistent shells must correspond to actual system structure.

Examples:
- Plot tabs are structural sections, not arbitrary content chips
- tier toggles are structural scope controls, not cosmetic filters

Reject:
- adding tabs as content buckets without a real contract
- adding toggles that do not map to meaningful state changes
- UI sections that imply unsupported backend/behavioral contracts

### Rule 7: Support visibility outranks vanity customization
Identity systems in UPRISE exist to do two jobs:
1. let the user feel represented
2. let the user visibly support artists/bands

If a customization branch increases vanity complexity without increasing support visibility or identity clarity, it is likely the wrong branch.

Reject:
- dress-up logic that overwhelms support surfaces
- avatar complexity that creates maintenance without strengthening identity or support
- collectible systems that do not connect back to visible artist support

### Rule 8: Keep fixed things fixed
If a thing is effectively stable in normal use, model it as stable.
Do not force needless modularity.

Examples:
- if expression + hair + head are better shipped as one identity portrait, do that
- if glasses are best treated as part of some head variants, do that

Reject:
- modularity for its own sake
- slot systems that explode alignment/testing cost without product value

### Rule 9: Use one clear intent per surface section
Each section should have one primary job.
Do not overload one area with unrelated tasks.

Examples:
- search should have one clear search intent in context
- travel should have one clear role relative to player/listening state
- recommendations should not become a hidden catch-all for unrelated content types

Reject:
- mixed-intent controls
- one search bar pretending to serve unrelated jobs unless that unification is explicitly designed
- sections that bundle context, transport, recommendation, and authority changes together

### Rule 10: Descriptive data must not quietly become authority logic
Metrics, trending, statistics, and support signals are not civic authority.
They must not silently change:
- governance rights
- ranking power
- scene authority
- Fair Play behavior

Reject:
- engagement signals leaking into authority behavior
- recommendation/trending systems quietly steering governance or civic rights
- stats UI implying decision power where none exists

### Rule 11: The shell matters as much as the page
Do not design pages as if they exist alone.
Always account for:
- profile strip
- player strip
- Plot tab structure
- bottom nav
- persistent context chips

Reject:
- page mocks that ignore persistent shell elements
- route-level ideas that only work if the rest of the app disappears
- secondary screens that contradict the global shell contract

### Rule 12: If a behavior belongs to a system, implement it in the system
Do not bury system behavior inside random page-specific hacks.

Examples:
- discovery context patching belongs in shared discovery context handling
- player context behavior belongs in player-aware shared logic
- support-item visibility rules belong in reusable identity/support logic, not one-off view hacks

Reject:
- page-local state hacks for global systems
- duplicated transport/context logic across routes
- one-off exceptions that should be system contracts

## 4) Discover-Specific Systems Reading
When evaluating Discover, assume these software questions first:
1. What currently anchors discovery context?
2. Is the player persistent on this surface?
3. If yes, should search/travel inherit the player’s current tier/context?
4. Is travel a separate system or an extension of current listening state?
5. Are we making the user manage two context models at once?

If the answer reveals parallel models, simplify.

## 5) Agent Rejection Checklist
Before implementing any non-trivial UI/system behavior, reject the design if it does any of the following:
- omits player visibility/inheritance/effect rules from a surface spec
- creates a second context anchor when one already exists
- duplicates the job of a persistent system
- asks the user to redefine known context unnecessarily
- turns structural scope into generic radius/filter logic
- introduces vanity complexity where support visibility should dominate
- adds modularity that multiplies maintenance without real product value
- treats one route as if the app shell does not exist
- solves a system problem with a page-local hack

## 6) Required Prompt Guard
Paste this into implementation prompts when needed:

```text
Software Systems Guard:
- Treat UPRISE as one connected system, not a set of isolated screens.
- Treat the persistent player as a mandatory systems consideration in every surface spec and implementation discussion.
- Respect the current context anchor before adding new controls.
- If the player is persistent on a surface, discovery/travel logic must account for the player’s active mode/tier/context.
- Do not create parallel interaction models for the same job.
- Inherit known community identity instead of asking the user to redefine it.
- Prefer one clear intent per control/section.
- Favor support visibility and identity clarity over vanity customization complexity.
- If a behavior belongs to a system, implement it as a system contract, not a page-local hack.
- Do not invent new behavior from abstraction alone; check founder lock/spec authority first.
```

## 7) References
- `AGENTS.md`
- `docs/FEATURE_DRIFT_GUARDRAILS.md`
- `docs/solutions/SESSION_STANDING_DIRECTIVES.md`
- `docs/solutions/ANTI_PLATFORM_TROPE_DRIFT.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
