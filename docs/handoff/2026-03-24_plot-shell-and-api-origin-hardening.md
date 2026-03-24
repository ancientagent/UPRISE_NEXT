# 2026-03-24 Plot Shell And API Origin Hardening

## Scope
- Harden the compact `/plot` player shell to match the locked MVP contract.
- Remove the remaining `localhost:4000` browser-origin drift when the web app is served from `127.0.0.1`.
- Stop `/plot` from self-triggering repeated `GET /discover/context` reads.

## Changes
- `apps/web/src/lib/api.ts`
  - added `resolveApiUrl()` so browser requests default to `http://127.0.0.1:4000` when the page hostname is `127.0.0.1`
  - kept `NEXT_PUBLIC_API_URL` as the highest-precedence override
- `apps/web/__tests__/api-client.test.ts`
  - added source-level coverage for `localhost`, `127.0.0.1`, and explicit env override API-origin resolution
- `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
  - changed tier stack order to `national -> state -> city`
  - replaced the collapsed `RAD/COL` badge block with explicit art-thumbnail slots
- `apps/web/src/app/plot/page.tsx`
  - relabeled `Selected Community` CTA from `Open Profile` to `Open Community`
  - memoized the discovery-context fallback used by the Plot hydration effect so `/plot` no longer refetches `/discover/context` on every store write
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
  - locked the art-thumbnail shell contract, the tier order, the `Open Community` label, and the memoized Plot continuity path

## Runtime Verification
- Fresh Playwright session on `http://127.0.0.1:3000/plot` with seeded `auth-storage` and `onboarding-storage`
- Observed network calls:
  - `GET http://127.0.0.1:4000/discover/context => 200`
  - `GET http://127.0.0.1:4000/communities/resolve-home?... => 200`
  - `GET http://127.0.0.1:4000/registrar/promoter/entries => 200`
- The earlier `localhost:4000` drift did not reproduce in the fresh session.
- The earlier `/discover/context` request storm collapsed to the expected initial reads only.
- Snapshot confirmed:
  - `Current track art thumbnail`
  - tier stack `national`, `state`, `city`
  - `Open Community`

## Verification Commands
- `pnpm --filter web test -- --runInBand __tests__/api-client.test.ts __tests__/plot-ux-regression-lock.test.ts`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`

## Residual Risk
- This slice hardens the compact Plot shell and client-origin behavior only.
- The deeper spec-backed Plot work still open is the heavier bucket:
  - tier-aware `Feed`
  - tier-aware `Events`
  - tier-aware `Promotions`
  - `Statistics` anchor/activity contract
