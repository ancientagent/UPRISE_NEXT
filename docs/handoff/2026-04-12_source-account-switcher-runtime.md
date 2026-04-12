# 2026-04-12 Source Account Switcher Runtime

## Summary
- Added the first persistent source-account context store on the web tier.
- Plot now exposes a `Source Accounts` switcher for users who manage one or more Artist/Band entities.

## What It Does
- keeps one signed-in account
- lets the user remain in listener context or switch into a managed source account
- persists the active source account id in web storage
- routes from Plot into the selected managed Artist/Band source page

## Files
- `apps/web/src/store/source-account.ts`
- `apps/web/src/components/source/SourceAccountSwitcher.tsx`
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/source-account-context.test.ts`
- `apps/web/__tests__/source-account-switcher-lock.test.ts`

## Why
- the original listener-mobile / source-web split no longer applies
- UPRISE needs an explicit in-app account-context switch model instead of relying on scattered creator-route bridges
- this is the first runtime step toward a real source dashboard system

## Verified
- targeted web tests and typecheck passed
- live browser QA confirmed:
  - switcher renders in Plot for the seeded creator account
  - selecting the managed source updates active context
  - the route transitions into the Artist/Band source page
