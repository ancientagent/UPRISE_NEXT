# Discover And Plot Auth-State Hardening

## Branch
- `feat/ux-founder-locks-and-harness`

## What Changed
- `apps/web/src/app/onboarding/page.tsx`
  - persists tuned-scene discovery context immediately after successful Home Scene setup
- `apps/web/src/app/discover/page.tsx`
  - treats the persisted tuned scene object as a valid current-community context
  - prevents unauthenticated `Visit` entry affordances from routing into auth-gated dead ends
  - shows explicit sign-in-required copy for local community discovery when auth is missing
- `apps/web/src/components/plot/SeedFeedPanel.tsx`
- `apps/web/src/components/plot/PlotEventsPanel.tsx`
- `apps/web/src/components/plot/PlotPromotionsPanel.tsx`
- `apps/web/src/components/plot/StatisticsPanel.tsx`
  - stop attempting authenticated reads without a token
  - render explicit sign-in-required states instead of false runtime failures

## Why
- QA surfaced misleading runtime behavior where valid Home Scene state did not unlock current-community Discover immediately and unauthenticated Plot reads surfaced request-failure noise instead of clear auth-state messaging.

## Verification
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- browser check: signed-in Home Scene-only Discover renders current-community search/highlights without requiring an extra retune
- browser check: unauthenticated Plot no longer renders a false feed failure
