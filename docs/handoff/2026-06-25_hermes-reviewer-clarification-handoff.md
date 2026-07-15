# 2026-06-25 - Hermes Reviewer Clarification Handoff

Date: 2026-06-25
Branch: `docs/abacus-fusion-swarm-strategy`
Status: reviewer handoff
Scope: UPRISE product clarification review, question discipline, documentation drift prevention

## Purpose

This handoff gives the Hermes reviewer a tighter lane for follow-up review after the Home Scene / music-community preference clarification pass.

The founder is frustrated with repeated micro-feature questioning. The reviewer should avoid asking questions that are already answered by active docs or that only refine UI mechanics without changing cross-system contracts.

## Current Source Of Truth To Load

Start from current repo docs, not prior chat memory:

1. `AGENTS.md`
2. `docs/PLATFORM_START_HERE.md`
3. `docs/agent-briefs/CONTEXT_ROUTER.md`
4. `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
5. `docs/specs/users/onboarding-home-scene-resolution.md`
6. `docs/specs/users/identity-roles-capabilities.md`
7. `docs/agent-briefs/UI_CURRENT.md` only if visible Home/Plot/profile behavior is being reviewed
8. `docs/handoff/2026-06-24_proxy-scene-community-activation-working-model.md` only as working-session context

Do not bulk-load legacy docs or older handoffs unless a specific conflict requires it.

## Newly Clarified Contract

The durable owner is `docs/specs/users/onboarding-home-scene-resolution.md`, section `Music-Community Preference Contract`.

Current truth:

- Onboarding collects one primary scene-of-choice music community.
- Additional music-community preferences are added later from the user profile.
- A music-community preference means the user is a fan / involved with that music community.
- Music-community preferences persist across cities.
- The current verified/default city determines which local Home Scene or proxy scene content loads for each preference.
- Active major-node cities should generally carry the same primary music-community set.
- If a saved music-community preference does not resolve to an active current-city scene, it remains visible in the profile but does not appear in the Home Scene roller until resolvable.
- One successful GPS verification for a city grants voting rights across all of the user's registered music-community preferences that resolve in that verified city.
- Verifying a new city replaces prior city voting authority; users do not hold voting authority in multiple cities at the same time.
- When a user verifies a new city and changes Home Scene location, music-community preferences carry forward automatically without re-confirmation, while Home/Plot/RADIYO/Feed/Events/Archive content re-resolves to the new city's active or proxy scenes.
- The starred default music-community preference determines the Home Scene the user is anchored to and loaded into on login.
- The Home Scene roller is only a shortcut to the user's resolvable primary music-community preferences in the current verified/default city.
- The currently selected roller item is the scene the user is in.

## Reviewer Behavior Required

Ask fewer, higher-value questions.

Do ask questions only when the answer changes one of these shared contracts:

- source/artist registration authority
- GPS authority and city/source origin rules
- community activation thresholds and Registrar workflow
- proxy scene music lifecycle and migration behavior
- Fair Play / voting / tier propagation
- media limits, release deck constraints, and rotation eligibility
- sect activation / official sect / Sect Uprise boundaries
- profile preference data model if runtime implementation is next

Do not ask more roller questions unless implementing the roller UI or data model.

Do not ask questions that merely rename already-settled concepts.

Do not ask edge-case questions unless the edge case would block implementation or corrupt authority.

## How To Ask Founder Questions

Use this format:

1. State the current documented assumption in one sentence.
2. Explain why the question matters to multiple systems.
3. Ask exactly one question.
4. If the answer is already in docs, do not ask; cite the doc instead.

Example:

Current documented assumption: source registration requires a GPS-verified user.
Why it matters: this controls Registrar eligibility, source origin, community activation accounting, and voting authority.
Question: Can a source ever claim a city different from the registering user's verified city, or is source origin always the verified city at registration time?

## Immediate High-Value Questions Still Worth Asking

1. Source origin: Can a source ever claim a city different from the registering user's verified city, or is source origin always the verified city at registration time?
2. Source move: If a source operator later moves cities, does the source origin stay fixed unless re-registered, or can source origin migrate?
3. Activation accounting: Does the `45 minutes / 5 sources / 20 minutes per source` threshold count only currently rotation-eligible songs, or any approved playable songs tied to that natural city/music-community?
4. Activation workflow: When a city threshold is met, does Registrar require explicit approval before the Home Scene activates, or can the system activate it automatically and notify sources?
5. Proxy lifecycle: When a source's natural city activates, which parts of source state migrate immediately and which finish lifecycle in the proxy scene?
6. Fair Play: Are votes in proxy scenes ever used for statewide/national tier eligibility after a source's natural Home Scene activates, or do they remain attached only to the proxy-scene lifecycle?
7. Media eligibility: Is the active rotation cap still exactly up to 3 songs and 20 total minutes per source per Uprise rotation, with any additional uploads held outside active rotation?
8. **Resolved 2026-07-14:** Sect readiness counts supporting member artists'
   current eligible Home Scene Release Deck music; Artist/Band membership is
   Registrar-held and songs have no separate Sect state.

## Output Expected From Hermes Reviewer

Return a short report with:

- Docs loaded
- Any contradictions found, with file paths
- Questions avoided because already answered
- 3 to 8 high-value founder questions only
- No implementation suggestions unless a doc conflict would block implementation

If the reviewer discovers a true contradiction, classify it as:

- `bug`
- `stale`
- `environment`
- `fixture/data`
- `product decision`

Do not create or edit files unless explicitly asked.
