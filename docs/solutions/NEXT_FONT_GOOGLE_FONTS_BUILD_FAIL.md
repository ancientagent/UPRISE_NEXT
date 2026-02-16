# Next.js Build Fails Fetching Google Fonts (`next/font`)

## Symptoms

- `pnpm --filter web build` fails with:
  - `getaddrinfo EAI_AGAIN fonts.googleapis.com`
  - `next/font error: Failed to fetch <FontName> from Google Fonts`

## Root Cause

`next/font/google` downloads font files during build. In restricted environments (CI networking, DNS issues, offline dev), the build can fail because it cannot reach `fonts.googleapis.com`.

## Fix

Avoid network-dependent fonts in the baseline build:

- Remove `next/font/google` usage (e.g. from `apps/web/src/app/layout.tsx`)
- Use local/system fonts (or ship a local font file later if needed)

## Prevention

- Treat network fetches as optional at build time.
- If you want custom typography, prefer vendoring the font under `apps/web/public/` and referencing it via CSS.

## Verification

```bash
pnpm --filter web build
```

