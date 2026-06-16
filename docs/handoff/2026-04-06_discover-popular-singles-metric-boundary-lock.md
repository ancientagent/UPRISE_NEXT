# Discover Popular Singles Metric Boundary Lock

Date: 2026-04-06
Owner: Codex

## Summary
- Updated `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md` to keep Discover from reusing sacred RaDIYo momentum semantics.
- Locked `Popular Singles` to the MVP lenses:
  - `Most Added`
  - `Supported Now`
- Explicitly excluded `Popular Now` from Discover because it belongs to the existing RaDIYo / broadcast engagement system.
- Explicitly excluded `Recent Rises` as a separate Discover category when it would only restate broadcast propagation logic.

## Product Effect
- Discover no longer competes with or mirrors RaDIYo’s current-momentum logic.
- RaDIYo keeps ownership of engagement-score and propagation-style surfacing.
- Discover focuses on durable library behavior (`Most Added`) and visible community excitement on surfaced posts (`Supported Now`).

## Verification
- `pnpm run docs:lint`
