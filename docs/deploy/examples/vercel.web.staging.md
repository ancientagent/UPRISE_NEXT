# Vercel Web Staging Example

Example only. Configure this in Vercel project settings for
`uprise-web-staging`.

## Project

- Project name: `uprise-web-staging`
- Root directory: `apps/web`
- Framework preset: Next.js
- Node.js version: `22.x`
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm --filter web build`
- Development command: `pnpm --filter web dev`
- Output directory: Next.js default; do not override.

`apps/web/vercel.json` keeps CLI/manual deploy commands aligned with the
dashboard settings. Do not add an `outputDirectory` override unless a future
build failure proves Vercel's Next.js default is insufficient.

## Environment Variables

Required for first staging:

- `NEXT_PUBLIC_API_URL`

Hold until socket staging exists:

- `NEXT_PUBLIC_SOCKET_URL`

Do not add:

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- provider admin tokens
