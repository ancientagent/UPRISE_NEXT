# Systems Scale Rule: No Community One-Offs

Date: 2026-06-15
Status: active carry-forward
Branch: docs/systems-scale-no-one-off-community

## Founder Direction
UPRISE must be built from a systems-thinking perspective. At no time should runtime behavior be implemented as a one-off for a particular city, music community, artist, source, or fixture.

Artists and sources are expected to join, bring listeners, and let communities begin organizing around real participation. The software must therefore scale through reusable city/community/source mechanics rather than manual editorial or launch-scene exceptions.

## Rule Promoted
Every product and implementation decision must be evaluated by whether it scales cleanly across:

- many cities
- many music communities
- many artists and source entities
- many listeners
- many events and artifacts
- city, state, and national aggregation once those tiers are capacity-ready

## Allowed Exceptions
Fixture-specific names and data are allowed only in tests, seed scripts, and QA helpers when clearly marked fixture-only or test-only.

Temporary launch data may exercise the generic system, but it must not change the system rules.

## Files Updated
- `AGENTS.md`
- `docs/FEATURE_DRIFT_GUARDRAILS.md`
- `docs/solutions/SOFTWARE_SYSTEMS_GUARDRAILS_R1.md`
- `docs/CHANGELOG.md`

## Carry Forward
Before implementing launch city/community containers, onboarding taxonomy changes, source growth flows, or tier aggregation, verify that the design works for the full matrix and does not depend on Austin/Punk or any other single launch example.
