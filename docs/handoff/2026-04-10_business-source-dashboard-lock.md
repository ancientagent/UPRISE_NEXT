# 2026-04-10 Business Source Dashboard Lock

## Summary
- Locked the business-source interpretation more explicitly.
- Businesses still follow the shared source model.
- Their surface should be understood as a source-facing dashboard rather than anonymous one-off intake.

## What Changed
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
  - business accounts now explicitly inherit the shared source/dashboard/profile/update model
  - business-facing expectations now include promotions, analytics, and follower-facing actions
- `docs/specs/users/identity-roles-capabilities.md`
  - added a locked business policy section
  - clarified that business capability remains account-attached and source-shaped
- `docs/specs/economy/print-shop-and-promotions.md`
  - clarified that business promotion submission belongs to a business-facing source dashboard
- `docs/solutions/LATER_VERSION_DOMAIN_UNDERSTANDINGS_R1.md`
  - preserved richer artist/business deal-making as later-version scope

## Resulting Rule
- Sources all share the same underlying setup.
- Businesses are not an exception to the shared source/dashboard model.
- Business accounts can:
  - create/manage promotions
  - read analytics
  - publish outward follower-facing updates/actions
- Do not infer current-MVP deal-making workflows from that shared source model.

## Follow-Up
- When business-facing runtime work is taken later, start from the shared source/dashboard model rather than a separate intake-only concept.
