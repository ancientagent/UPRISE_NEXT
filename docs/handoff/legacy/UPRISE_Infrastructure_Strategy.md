# 🔒 UPRISE Infrastructure Strategy — Critical Directive for All Agents

**Document ID:** `STRATEGY_CRITICAL_INFRA_NOTE`  
**Classification:** 🔴 *Critical — applies to every development, automation, and integration agent*  
**Last Updated:** November 2025  

---

## 🎯 Purpose
To ensure all contributors and autonomous agents build within the correct boundaries between **DeepAgent’s internal environment** and **UPRISE’s long-term production infrastructure**.

---

## 🧭 Core Rule — *DeepAgent is a Foundry, Not a Factory*

DeepAgent’s environment is **authorized only for prototyping, testing, and CI orchestration** of the UPRISE monorepo.  
It is **not** the production hosting environment for any core service.  

This directive preserves infrastructure portability and guarantees future scalability across Vercel, Fly.io, AWS Fargate, and Neon Postgres.

---

## ⚙️ Implementation Policy

1. **Scope of DeepAgent Usage**
   - ✅ Allowed:
     - Monorepo initialization and orchestration  
     - Local PostgreSQL container for tests (**must support PostGIS**)  
     - CI checks, linting, build, and type validation  
     - Opening PRs and maintaining branch hygiene  
   - ❌ Not Allowed:
     - Permanent data hosting (User, Community, or Song records)  
     - Production API hosting or media streaming  
     - Long-running worker tasks or ffmpeg jobs  

2. **Infrastructure Targets**
   - **Web (Next.js):** Vercel  
   - **API / Socket:** Fly.io or App Runner  
   - **Workers:** AWS Fargate (transcoding, analytics)  
   - **Database (prod):** Neon Postgres with PostGIS  
   - **Storage/CDN:** AWS S3 or Cloudflare R2 + CloudFront  

3. **Migration Protocol**
   - DeepAgent → GitHub PR → External Deploy → Production.  
   - No component is considered *complete* until verified on its external host.  
   - Each PR description must include a `Deployment Target:` line confirming its intended platform.

4. **Critical Dependencies**
   - `PostGIS` is **mandatory** for all Community & Location operations.  
   - `ffmpeg` and `S3-compatible storage` are **mandatory** for Song Management and Events.  
   - If DeepAgent cannot provide these, stub via container or mock services during tests.

---

## 🧩 Responsibility Matrix

| Function | Dev Environment | Production Target |
|-----------|-----------------|------------------|
| WebApp (Next.js) | DeepAgent → Vercel preview | Vercel |
| API / Socket | DeepAgent container | Fly.io / App Runner |
| Workers (media) | Stub in DeepAgent | AWS Fargate |
| Database | DeepAgent Postgres (+PostGIS) for dev only | Neon Postgres (+PostGIS) |
| Storage / CDN | Mock local bucket | AWS S3 / R2 |
| Analytics / Errors | Placeholders in DeepAgent | PostHog & Sentry (prod keys) |

---

## 🚨 Enforcement

- Any agent or pipeline merging code that binds production logic to DeepAgent’s built-in infrastructure **violates this directive**.  
- Violations trigger an automated flag in CI (`infra-policy-check`) and block merge until corrected.

---

## 📜 Summary

> **DeepAgent = Prototype & Test.**  
> **Vercel / Fly / AWS / Neon = Production.**

This split is non-negotiable and is to be treated as a *critical architecture constraint* across all UPRISE systems.

