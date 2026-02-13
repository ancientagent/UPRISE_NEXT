# WSL Flow (Codex/Ubuntu)

Run (from Windows terminal via WSL)
- Health + DB checks (non‑destructive):
  - ` yarn wsl:smokes ` (runs health_checks, PostGIS check, migration_guard)
- Phase‑2 API smoke (if API reachable on host):
  - ` yarn wsl:phase2-smoke ` (uses API_BASE_URL=http://127.0.0.1:3000)

Artifacts
- Saved under `artifacts/logs/` with stable names: `api_health.txt`, `postgis_check.txt`, `migration_guard.txt`, `phase2_smoke.txt`

Handoff
- Notify Mobile (Windows): ` yarn handoff:wsl:done `

Docs Anchor
- `docs/PHASE2_EXECUTION_PLAN.md` → Post‑Login Routing (Authoritative)
  - After login → Home Scene Creation (`CommunitySetup`); Dashboard only after onboarding completes and community exists.

