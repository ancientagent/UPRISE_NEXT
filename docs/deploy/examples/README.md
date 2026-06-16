# Deploy Examples

These files are examples for the first hosted staging path. They are not live
deployment manifests.

Before copying any example into a real provider file, confirm:

- provider resource names
- region
- staging URLs
- secret names
- build/start behavior on the selected platform

Current first staging direction:

- Vercel: `uprise-web-staging`
- Fly.io: `uprise-api-staging`
- Neon: project `uprise`, branch `staging`, database `uprise_staging`

Do not put real secrets in these files.

Live staging manifests now exist outside this examples folder:

- `.dockerignore`
- `apps/api/Dockerfile`
- `fly.api.staging.toml`

Those files contain provider names and build behavior only. Secrets remain in
provider secret stores or local ignored auth files.
