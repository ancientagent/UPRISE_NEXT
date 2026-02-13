# 🌍 ENVIRONMENTS.md — Local & CI Setup

**Repository:** `music-community-platform`  
**Last Updated:** November 12, 2025 (America/Chicago)

---

## 📌 Policy (must-read)
- **WSL-first** for web/api/socket/workers.
- **Windows (non-admin PowerShell)** only for Android/React Native 0.66.x builds.
- User-writable paths only (e.g., `D:\uprise_mob`, `C:\tools`, or WSL home).  
- **No** symlinks, **no** registry edits, **no** Set-ExecutionPolicy.

See also: [`STRATEGY_CRITICAL_INFRA_NOTE.md`](./STRATEGY_CRITICAL_INFRA_NOTE.md)

---

## 🐧 WSL (Ubuntu 22.04/24.04) — Primary Dev

```bash
# System deps
sudo apt-get update && sudo apt-get install -y build-essential git curl unzip ffmpeg

# Node (fnm)
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc && fnm install 22 && fnm default 22

# pnpm via corepack
corepack enable && corepack prepare pnpm@9.12.0 --activate

# (Optional) Docker with WSL2 backend via Docker Desktop
```

**Clone & run (WSL):**
```bash
mkdir -p ~/uprise && cd ~/uprise
git clone <repo-url> music-community-platform
cd music-community-platform
pnpm i
pnpm -r build
pnpm -r dev
```

**Env vars:** copy `.env.example` → `.env` in root and per app as needed.  
Database defaults to a local/CI Postgres with **PostGIS**. For prod, use Neon/AWS RDS.

---

## 🪟 Windows (non-admin) — Mobile / RN 0.66.x

- Keep RN project under `D:\uprise_mob`.
- Ensure **JDK 11**, **Gradle 7.0.2**, **Hermes**.
- Use Yarn-only in RN app; do not mix with pnpm workspace.
- **UPRISE_NEXT uses pnpm**; legacy RN (`uprise_mob`) uses **yarn only** to avoid permission lockouts.
- Avoid admin shells and keep all files in user-writable paths to prevent access issues.
- Android SDK installed under `C:\Android\platform-tools` (user-writable).

**Scripts (example):**
```powershell
# scripts\windows\setup.ps1
# - Install nvm (user scope), Node 16 LTS for RN build
# - Install Yarn (user scope)
# - Set ANDROID_HOME and PATH for current session only

# scripts\windows\build-android.ps1
# - yarn install
# - cd android; gradlew assembleDebug
```

---

## 🗄️ Databases

**Dev/CI:**
- Prefer DeepAgent’s Postgres with **PostGIS** enabled; if unavailable, use Docker:
```yaml
# docker-compose.yml (dev only)
services:
  db:
    image: postgis/postgis:16-3.4
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_USER: postgres
      POSTGRES_DB: uprise_dev
```

**Prod:**
- Neon Postgres or AWS RDS (Postgres) with PostGIS extension.

**Migrations:** `pnpm prisma migrate dev` (dev) / `pnpm prisma migrate deploy` (prod).

---

## ☁️ External Platforms (to be connected by founder)

- **Vercel** → `apps/web`
- **Fly.io / AWS App Runner** → `apps/api`, `apps/socket`
- **AWS Fargate** → `apps/workers/transcoder`
- **S3 / Cloudflare R2** → media storage (transcoded HLS, artwork)
- **Sentry** / **PostHog** → gated by env vars

**Env placeholders** (root `.env.example`):
```
DATABASE_URL=
DATABASE_SHADOW_URL=
AUTH_ISSUER=
AUTH_AUDIENCE=
AUTH_JWKS_URL=
JWT_SECRET=
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
POSTHOG_HOST=https://us.i.posthog.com
S3_ENDPOINT=
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
MAPBOX_TOKEN=
```

---

## 🔒 Security & Policy
- Secrets never committed; use repo/environment secrets.
- CI enforces **infra-policy-check** to block DeepAgent lock‑in.
- Web bundle must not reference secrets (`process.env`) in client components.

---

## 🆘 Troubleshooting
- File watch issues on Windows paths? Keep sources in WSL home (avoid `/mnt/c`).
- PostGIS missing? Verify extension: `CREATE EXTENSION IF NOT EXISTS postgis;` in migration.
- FFmpeg not found? Ensure `ffmpeg` installed in WSL or worker container.
