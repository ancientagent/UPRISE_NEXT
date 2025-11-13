# 🗂️ PROJECT_STRUCTURE.md — Monorepo Map & Conventions

**Repository:** `music-community-platform`  
**Last Updated:** November 12, 2025

---

## 📦 Directory Tree (top-level)

```
apps/
  web/                    # Next.js 15 (Vercel)
  api/                    # NestJS (Fly.io / App Runner)
  socket/                 # Socket.IO (Fly.io / App Runner)
  workers/
    transcoder/           # FFmpeg worker (AWS Fargate / Fly.io)
packages/
  ui/                     # Shared UI components (Tailwind + shadcn/ui)
  types/                  # Zod schemas; emits OpenAPI
  sdk/                    # Generated API/Socket clients from OpenAPI
infra/
  prisma/                 # Prisma schema + PostGIS migrations + seeds

.docs/ (generated)
```

---

## 🧩 Package Conventions

- **TypeScript**: strict mode everywhere;
- **Imports**: use path aliases via `tsconfig.base.json` (e.g., `@uprise/ui`, `@uprise/types`, `@uprise/sdk`).
- **Build**: Turborepo tasks — `build`, `lint`, `typecheck`, `test` across workspaces.
- **Testing**: Jest/Vitest per app; Playwright for web.
- **OpenAPI**: `packages/types` generates `openapi.json`; `packages/sdk` regenerates typed clients. CI fails on drift.

---

## 🔐 Web‑Tier Contract (enforced by CI)

- No direct DB access from `apps/web`.
- No `process.env.*` in client components.
- No server actions that mutate state in `app/` routes.
- All mutations go through `apps/api` endpoints.

---

## 🧵 Branching & PR Rules

- Default branch: `main`
- Feature branches: `feat/<scope>`; chore/bugfix similarly
- Every PR:
  - includes `Deployment Target:` and `Phase:` lines
  - links to relevant spec(s) under `/docs/Specifications`
  - updates `CHANGELOG.md`

---

## 📚 Specs Index

Specs live under `/docs/Specifications`. Core files:
- `01_UPRISE_Master_Overview.md`
- `02_UPRISE_Skeleton_Framework.md`
- `04_UPRISE_Community_Location_System.md`
- `06_UPRISE_Song_Management_System.md`
- `07_UPRISE_Discovery_Map_System.md`
- `08_UPRISE_Events_System.md`
- `09_UPRISE_Promotions_Business.md`

> If migrating specs from the legacy repo, preserve filenames and IDs so cross‑references remain valid.

---

## 🧰 Scripts (common)

```
pnpm -r dev        # run all apps in dev mode
pnpm -r build      # build all workspaces
pnpm -r test       # run tests
pnpm prisma migrate dev   # dev migrations
pnpm prisma migrate deploy # prod migrations
```

---

## 🧯 Incident Response (quick)

1. Check Sentry for errors (web/api) and logs (workers/socket).
2. Roll back last deployment on target platform (Vercel/Fly/AWS) if needed.
3. Open a `hotfix/*` branch; patch and ship.

