# Community Identity Rule Clarification (2026-03-23)

## Purpose
Make the community/Uprise identity model explicit in top-level agent/repo docs so future sessions do not re-derive it from deeper onboarding specs alone.

## Clarified Rule
- Communities/Uprises are identified by `city + state + music community`.
- Agents must not collapse community identity to city-only or genre-only.
- When a flow already knows the current community context, it should inherit the music community from that context instead of asking the user to redefine it.

## Applied Changes
- `AGENTS.md`
  - added the community identity rule under non-negotiables so it appears in the first agent-readable file
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
  - added explicit identity wording plus the inherited-context travel rule
- `docs/specs/communities/discovery-scene-switching.md`
  - added the identity tuple at the top of the spec
- `apps/web/src/app/discover/page.tsx`
  - removed wording that implied Discover itself is established by onboarding
  - now states that Discover travel requires an active community context
- `apps/web/src/lib/discovery/query-state.ts`
  - now prefers the active tuned scene context over stored Home Scene defaults

## Why
The repo already carried this model in onboarding (`city + state + music community`), but it was too deep in the stack. That made it easy to miss during compacted sessions and led to a misleading Discover fallback input and copy.

## Verification
- `pnpm --filter web test -- discovery-query-state.test.ts`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
