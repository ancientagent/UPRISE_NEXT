# 2026-04-11 Print Shop Creator Fixture Seed

## Summary
- Added a reusable local seed helper for Print Shop creator QA.
- The helper attaches a linked Artist/Band source to an existing dev user so the source-facing event-create lane can be exercised without weakening permission rules.

## Command
From `apps/api`:

```bash
pnpm run seed:print-shop-creator -- --user-id <uuid>
```

Alternative selectors:
- `--email <email>`
- `--username <username>`

## Result
- Resolves the target user
- Resolves the user Home Scene city-tier community when available
- Reuses an existing linked Artist/Band if one already exists
- Otherwise creates a minimal linked Artist/Band source and owner membership

## Why
- The active browser QA account did not have promoter capability or a linked Artist/Band
- Print Shop event creation is correctly source-gated
- This seed keeps QA moving without weakening the real creator boundary
