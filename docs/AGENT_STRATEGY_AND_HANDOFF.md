# 🧭 UPRISE Agent Strategy & Handoff Document
**Document ID:** `AGENT_STRATEGY_AND_HANDOFF`  
**Classification:** 🔴 Critical — Required Reading for All New and Existing Agents  
**Last Updated:** November 2025

---

# 📌 SECTION 1 — DeepAgent vs Cloud Infrastructure Strategy
This section clarifies how UPRISE uses DeepAgent for development and orchestration, and how/when Cloud Run (or other container hosting) becomes part of production infrastructure.

---

## 🎯 Core Principle: *DeepAgent Builds, Cloud Infrastructure Runs*
UPRISE uses **DeepAgent as the development/automation engine**, but **NOT** as long-term production hosting. Instead, we deploy our containers (API, Socket, Worker, Web) to external platforms.

### **DeepAgent is a Foundry**  
- Generates monorepo scaffolds
- Builds features, modules, and internal tools
- Runs dev builds and CI-like pipelines
- Manages code generation, integration, and orchestration
- Provides testing, PRs, and structure enforcement

### **Cloud Platforms are the Factory**  
Used for production-grade hosting, scaling, reliability, and persistence.

Preferred targets:
- **Web (Next.js)** → Vercel or Cloud Run
- **API (NestJS)** → Cloud Run or Fly.io or App Runner
- **Socket (Realtime)** → Cloud Run or Fly.io
- **Workers (FFmpeg, Queue)** → Cloud Run Jobs or AWS Fargate
- **Database (PostGIS)** → Neon Postgres or AWS RDS
- **Media Storage** → S3 / Cloudflare R2

---

# 🌉 How DeepAgent & Cloud Run Work Together

### ✅ DeepAgent handles:
- Fast prototyping
- Structured monorepo creation
- Scaffolding new modules
- Running local dev servers
- Managing multi-service TypeScript environments

### ✅ Cloud Run handles:
- Production scalability
- Autoscaling container workloads
- Stateless APIs
- Potential worker (FFmpeg) jobs
- Tight integration with cloud services

### ⚠️ What DeepAgent cannot replace:
- Persistent infrastructure
- Long-lived worker computing
- High-performance media workloads at scale
- Geographic routing, load balancing, global services

---

# 🧭 When to Transition Workloads

### **During Development (Phase 1–2)**
Use **DeepAgent** exclusively for:
- Scaffolding (monorepo, services)
- Building features
- Rapid UI/API prototyping
- Local and ephemeral testing

### **When System Becomes Stable (Phase 3+)**
Migrate to **Cloud Run or other cloud services**:
- API → when endpoints are finalized
- Socket → when state and realtime flows stabilize
- Worker → when transcoding requires real CPU/GPU capacity
- Web → when UPRISE needs low-latency global access

Cloud Run unlocks:
- Autoscaling
- Cold-start optimized instances
- Custom CPU/memory profiles
- Strong SLA and production durability

---

# 🚦 Architectural Decision Summary

| Stage | DeepAgent | Cloud Run / Cloud Infra |
|-------|-----------|--------------------------|
| Early build | 🟢 Primary | 🔴 Do not deploy yet |
| Mid dev | 🟢 Scaffolding & testing | 🟡 Begin API pilots |
| Pre-launch | 🟡 Minor features | 🟢 Move API, Socket, Worker |
| Production | 🔴 No hosting | 🟢 Full deployment |

---

# 📌 SECTION 2 — Agent Handoff Document
This section is for **any new agent** or for agents who lose context due to window resets.

---

# 🚀 UPRISE Agent Handoff: Start Here
This document provides the absolute minimum required information for **any new AI agent** joining the project.

---

## 🎯 Project Identity
**UPRISE** is a multi-service platform (web, API, realtime, worker) built via a containerized monorepo with strict architecture boundaries and PostGIS geolocation integration.

---

# 📁 Core Repositories & Structure
The primary code lives in:
```
UPRISE_NEXT/
  apps/web        → Next.js 15
  apps/api        → NestJS (PostGIS)
  apps/socket     → Socket.IO
  apps/workers    → FFmpeg transcoder
  packages/*      → shared UI, config, types
  infra/prisma    → schema + migrations
  docs/*          → strategy, runbook, specs
```

---

# 🧩 Critical Rules for ALL Agents
**These MUST be followed.**

### 1️⃣ Web Tier Boundary (Strict)
- No DB access from web
- No secrets in web client components
- No server mutations in web actions
- All writes go through the API

### 2️⃣ DeepAgent Infrastructure Boundaries
- DeepAgent must **not** host production services
- No symlinks, no admin elevation, no global installs
- Use local PostGIS Docker or DeepAgent DB for development only

### 3️⃣ Code Ownership Labels
Every AI agent must **tag their work** so we know source-of-truth:  
- `// generated-by: DeepAgent`  
- `// generated-by: Claude-Code`  
- `// generated-by: Cursor`  
- `// generated-by: ChatGPT`  

This ensures we can:
- Trace regressions
- Identify automation mistakes
- Partition responsibilities

### 4️⃣ Every PR Must Include:
- **Deployment Target:** Cloud Run / Vercel / Fly / AWS
- **Phase:** 1 / 2 / 3
- **Specs Modified:** (list from docs/Specifications)
- **Source Agent Tag**

---

# 📚 Required Reading for Any New Agent
1. `STRATEGY_CRITICAL_INFRA_NOTE.md`
2. `RUNBOOK.md`
3. `ENVIRONMENTS.md`
4. `PROJECT_STRUCTURE.md`
5. `PHASE1_COMPLETION_REPORT.md`

These documents define the boundaries, architecture, and environment.

---

# 🧠 Context Loss Recovery Protocol
When an AI agent loses context:
1. Read this handoff document
2. Load RUNBOOK.md
3. Load STRATEGY_CRITICAL_INFRA_NOTE.md
4. Load PROJECT_STRUCTURE.md
5. Ask human for current phase number if unclear

This restores 90%+ of required knowledge.

---

# 🔧 Additional Requirements for Code-Generating Agents
- MUST commit to monorepo structure
- MUST use pnpm workspace commands
- MUST generate TypeScript (not JS)
- MUST keep PostGIS queries compatible
- MUST update CHANGELOG.md on PR
- MUST update or reference relevant Specification docs

---

# 🏁 Final Summary for New Agents
**DeepAgent = Development powerhouse**  
**Cloud Run / Vercel / Fly = Production muscle**  

Follow boundaries.  
Follow PR protocol.  
Tag your output.  
Read all strategy docs.  

This ensures UPRISE remains scalable, stable, and safe across multiple collaborating agents.

