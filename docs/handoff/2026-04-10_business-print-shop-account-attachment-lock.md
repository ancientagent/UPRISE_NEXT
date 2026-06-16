# 2026-04-10 Business Print Shop Account Attachment Lock

## Summary
- Locked business promotion submission more explicitly.
- Businesses should submit promotions through a Print Shop-attached business account.
- This remains true even when the business does not maintain a broader in-app presence/profile.

## What Changed
- `docs/specs/economy/print-shop-and-promotions.md`
  - removed the old public-link/no-account assumption
  - now states that business promotion submission is account-attached through Print Shop
- `docs/specs/users/identity-roles-capabilities.md`
  - added founder-lock note clarifying business Promotions/Print Shop account attachment
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
  - added source-rule clarification so business submission is not treated as anonymous/public intake

## Resulting Rule
- Print Shop remains source-facing.
- Businesses use an attached business account to submit promotions.
- A broader in-app business presence/profile is optional and can remain narrower than artist/promoter source presence.

## Follow-Up
- When the business Promotions/Print Shop workflow is implemented, do not build it as anonymous public-link intake unless founder direction explicitly changes.
