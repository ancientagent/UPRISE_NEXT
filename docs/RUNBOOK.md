# 🧭 UPRISE RUNBOOK — Developer & Agent Operations Manual

**Repository:** `music-community-platform`  
**Last Updated:** November 12, 2025 (America/Chicago)  
**Applies To:** All UPRISE Agents (DeepAgent, Claude Code, Codex CLI, Cursor, etc.)

---

## 🏗️ Core Directives

| File | Purpose | Status |
|------|--------|--------|
| [STRATEGY_CRITICAL_INFRA_NOTE.md](./STRATEGY_CRITICAL_INFRA_NOTE.md) | Defines “DeepAgent = Foundry only” rule; production targets (Vercel, Fly, AWS, Neon). | 🔴 Critical |
| [PHASE1_COMPLETION_REPORT.md](./PHASE1_COMPLETION_REPORT.md) | Certifies monorepo foundation; establishes readiness for Phase 2. | ✅ Complete |

> All agents MUST read the two files above before running any task.

---

## ⚙️ Development Environment

See [ENVIRONMENTS.md](./ENVIRONMENTS.md) for full setup.

**Summary:**
- **Web / API / Socket / Workers:** WSL 2 (Ubuntu 22.04+ recommended)
- **Mobile (RN 0.66.x):** Windows non‑admin PowerShell (Hermes, Gradle 7.0.2, JDK 11)
- **Node:** v22.x (fnm or nvm)
- **Package Manager:** pnpm 9.x (corepack)
- **Database:** Postgres with **PostGIS** (dev: DeepAgent container; prod: Neon or AWS RDS)
- **Optional:** Docker for local workers/DB

---

## 🧱 Monorepo Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for details and conventions.

```
apps/
  web/       → Next.js 15 (Vercel)
  api/       → NestJS (Fly.io / App Runner)
  socket/    → Socket.IO (Fly.io / App Runner)
  workers/
    transcoder/ → FFmpeg Node worker (AWS Fargate / Fly.io)
packages/
  ui/        → Shared components
  types/     → Zod schemas → OpenAPI
  sdk/       → Generated client for web/api
infra/
  prisma/    → Prisma schema + PostGIS migrations + seeds
```

**Strict Web‑Tier Contract**
- No DB access, no secrets, no server actions that mutate state in `apps/web`.
- All mutations go through `apps/api`.
- Realtime is subscribe‑only via `apps/socket`.

---

## 🚀 Deployment Flow

**Default pipeline:**  
DeepAgent (dev/CI) → GitHub PR → External Deploy (Vercel / Fly / AWS) → Production (Neon Postgres)

Each PR MUST include:
```
Deployment Target: [Vercel|Fly|AppRunner|Fargate|Neon]
Phase: [1|2|3]
Specs: [IDs of affected specs, e.g., 04 Community, 07 Discovery]
```

CI runs on PR:
- Lint / Typecheck / Build
- Web‑tier contract guard (fail on boundary violations)
- Unit & integration tests
- Prisma PostGIS migrations on ephemeral DB
- Socket realtime smoke test

---

## 🧪 Testing Matrix

| Test Type | Tool | Location | Schedule |
|----------|------|----------|----------|
| Unit Tests | Jest/Vitest | apps/api, apps/web, apps/socket | On commit |
| E2E (web) | Playwright | apps/web | Nightly + on release |
| Realtime | Vitest + Socket test client | apps/socket | On PR |
| Migrations | Prisma Migrate | infra/prisma | On deploy |
| Contract Guard | ESLint + custom CI rule | apps/web | On PR |

---

## 📚 Documentation Index

| Category | File | Description |
|----------|------|-------------|
| Strategy | [STRATEGY_CRITICAL_INFRA_NOTE.md](./STRATEGY_CRITICAL_INFRA_NOTE.md) | Infrastructure policy |
| Milestones | [PHASE1_COMPLETION_REPORT.md](./PHASE1_COMPLETION_REPORT.md) | Phase 1 completion |
| Specs | [Specifications/README.md](./Specifications/README.md) | Module-by-module technical docs |
| Environments | [ENVIRONMENTS.md](./ENVIRONMENTS.md) | Windows/WSL setup rules |
| Structure | [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Folder map & conventions |
| Changelog | [CHANGELOG.md](./CHANGELOG.md) | Auto-generated PR logs |

---

## 🧩 Agent Rules

1. **Follow the Critical Infra Note** — DeepAgent may run tests, not production workloads.
2. **Keep Docs Current** — Every merged PR must update `CHANGELOG.md` and, if scope touches architecture or ops, update this `RUNBOOK.md`.
3. **Annotate PRs** — Link to affected specification(s) in `/docs/Specifications`.
4. **Blockers** — Any CI error tagged `infra-policy-check` halts merge until fixed.

---

## 🔄 Maintenance Schedule

| Interval | Task | Owner |
|----------|------|-------|
| Daily | CI: lint/type/build pass | DeepAgent |
| Nightly | E2E (web) + socket smoke | DeepAgent |
| Weekly | Update CHANGELOG from merged PRs | DeepAgent |
| Per Phase | Publish phase completion report | PM/Lead Agent |

---

## 🏁 Quickstart Commands

```bash
pnpm i
pnpm -r build
pnpm -r dev
```

See ENVIRONMENTS.md for full setup and service URLs.

