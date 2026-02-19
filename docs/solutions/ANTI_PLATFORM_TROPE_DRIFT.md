# Anti-Platform Trope Drift (UPRISE)

## Purpose
Prevent models/agents from importing default behavior from legacy social/music platforms into UPRISE implementation.

## Symptom
The agent introduces familiar platform patterns that are not canon, for example:
- tier toggle implemented as larger geo radius rings
- recommendation/discovery logic implied by "nearby" and "popular"
- generic feed-ranking assumptions
- authority leakage from metrics into governance

## Root Cause
Model prior/training bias: common product tropes are statistically overrepresented and can override local canon unless explicitly constrained.

## Canon Rule
In UPRISE, scope and authority are structural:
- `city`, `state`, `national` are tier scopes, not concentric distance rings
- state/national are aggregate rollups, not expanded "nearby" search
- no personalization/ranking/authority conversion unless explicitly specified in canon/spec

Radius/geofence is permitted only for:
1. location verification and locality constraints
2. inactive-scene fallback routing to nearest active parent scene
3. optional regional-scene definition (explicit founder-approved flow)

## Required Prompt Guard (paste into agent tasks)
Use this block at the top of implementation tasks:

```text
Anti-Trope Guard:
- Do not use assumptions from Spotify/Instagram/TikTok/Facebook product patterns.
- Implement only canon/spec behavior in this repo.
- Treat city/state/national as structural scopes, not distance rings.
- Do not introduce recommendation, ranking, or authority-conversion logic unless explicitly requested.
- If you detect ambiguity, stop and ask instead of defaulting to platform conventions.
```

## Verification Checklist (must pass before handoff)
1. `git diff --name-only` touches only allowed files.
2. No radius-by-tier logic exists for city/state/national scope switching.
3. No recommendation/personalization/ranking additions were introduced.
4. Required project checks pass (`pnpm run verify` or scoped equivalent).
5. Handoff includes explicit deferred items.

## Preventive Action
- Add Anti-Trope Guard to every non-trivial agent task prompt.
- Keep tasks narrow and file-allowlisted.
- Always run reviewer gate before merge.
