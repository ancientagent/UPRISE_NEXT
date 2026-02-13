# WSL Codex Kickoff Prompt (Paste into Codex CLI in Ubuntu/WSL)

You are Codex running in Ubuntu/WSL. Own backend/API/DB checks (non‑destructive). Save outputs under artifacts/logs. Confirm post‑login routing intent. Coordinate via docs/handoff/events.jsonl only.

Authoritative Routing
- After successful login, route to Home Scene Creation ('CommunitySetup') unless explicitly bypassed in debug; Dashboard only after onboarding completes and a community exists.

Tasks
1) Repo + docs
- cd /mnt/d/uprise_mob
- Verify docs anchors: PHASE2_EXECUTION_PLAN.md, PHASE2_CARRYOVER_TEMPLATE.md
- Capture 'Post‑Login Routing (Authoritative)' & Acceptance to artifacts/logs/routing_spec.txt

2) Scripts + perms
- ls -la docs/scripts > artifacts/logs/scripts_ls.txt
- chmod +x docs/scripts/*.sh || true

3) API health (host 127.0.0.1:3000)
- (curl -sf http://127.0.0.1:3000/health || echo 'API health failed') > artifacts/logs/api_health.txt 2>&1

4) DB/PostGIS (non‑destructive)
- ./docs/scripts/psql_postgis_check.sh > artifacts/logs/postgis_check.txt 2>&1 || true
- ./docs/scripts/migration_guard.sh > artifacts/logs/migration_guard.txt 2>&1 || true

5) Phase‑2 smoke (optional if API up)
- API_BASE_URL=http://127.0.0.1:3000 ./docs/scripts/phase2_smoke.sh > artifacts/logs/phase2_smoke.txt 2>&1 || true

6) Code intent check
- rg -n "CommunitySetup|LOGIN route decision" -S src | sed -n '1,200p' > artifacts/logs/routing_code_check.txt || true

7) Session summary (12–15 lines)
- Append to docs/Session-Logs/CODEX-PHASE2-INTAKE-REPORT.md (UTC timestamp) with: routing confirmation, API health, PostGIS result/version, migration status, artifacts list, next backend steps.

8) Handoff
- bash docs/scripts/wsl/handoff_notify.sh --to mobile-win --msg "Codex WSL smokes done; routing=CommunitySetup; artifacts updated" --kind done

Deliver back
- List artifacts under artifacts/logs.
- Paste the session summary you appended.
