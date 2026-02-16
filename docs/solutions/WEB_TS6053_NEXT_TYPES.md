# Web Typecheck Fails With TS6053 (.next/types Missing)

## Symptoms

- `pnpm --filter web typecheck` fails with TypeScript error `TS6053` referencing missing files under `.next/types/**`
- CI or local runs fail even though the app works in dev

## Root Cause

Next.js uses `.next/types/**` for generated route/type helpers. If TypeScript is run before a Next build has generated these files, you can see `TS6053` missing-file errors.

This is most common when running `apps/web` `tsc --noEmit` directly without building first.

## Fix

Preferred fix in this repo: run typecheck through the root Turbo pipeline so build happens first.

- Use `pnpm run typecheck` at repo root (Turbo runs the necessary builds first).
- Or run `pnpm --filter web build` once before `pnpm --filter web typecheck`.

## Prevention

- Prefer `pnpm run verify` / `pnpm run typecheck` at repo root (Turbo ensures correct task ordering).
- Avoid committing build artifacts (the repo’s `docs:lint` enforces no tracked PDFs; `.gitignore` covers `.next` and `*.tsbuildinfo`).

## Verification

Run:

```bash
pnpm --filter web build
pnpm --filter web typecheck
pnpm --filter web build
```
