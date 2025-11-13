# 🔒 UPRISE Infrastructure Strategy — Critical Directive for All Agents

**Document ID:** `STRATEGY_CRITICAL_INFRA_NOTE`  
**Classification:** 🔴 Critical — applies to all agents  
**Last Updated:** November 2025  

## 🎯 Purpose
To ensure all contributors and autonomous agents build within the correct boundaries between **DeepAgent’s internal environment** and **UPRISE’s long-term production infrastructure**.

## 🧭 Core Rule — DeepAgent is a Foundry, Not a Factory
DeepAgent’s environment is **only** for prototyping, testing, and CI.  
It is **NOT** the production hosting environment.

## ⚙️ Implementation Policy
**Allowed in DeepAgent:**
- Monorepo initialization  
- Local PostgreSQL container with PostGIS  
- CI checks  
- Lint / build / typecheck  
- PR automation  

**Not Allowed:**
- Production database  
- Production API  
- Worker compute  
- Media hosting  

## 🔗 Infrastructure Targets
- Web → Vercel  
- API / Socket → Fly.io or AWS App Runner  
- Workers → AWS Fargate  
- DB → Neon Postgres (PostGIS)  
- Storage → S3 / R2  

## 🚨 Enforcement
Any PR binding production logic to DeepAgent infra is blocked.

## 📜 Summary
> DeepAgent = Prototype & Test  
> Production = Vercel / Fly / AWS / Neon
