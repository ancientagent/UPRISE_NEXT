# Test Communities (Local/Dev)

Use these preselected communities to test an “active” Home Scene flow end‑to‑end without tripping viability gating.

Communities
- austin-texas-hip-hop — ZIP 78704/78701
- austin-texas-house — ZIP 78704/78701
- buda-texas-thrash-punk — ZIP 78610

Activate (WSL/macOS)
```
chmod +x docs/scripts/admin_activate_test_communities.sh
ROOT_DIR=$(pwd) API_BASE_URL=http://127.0.0.1:3000 \
  ./docs/scripts/admin_activate_test_communities.sh
```

Activate (Windows PowerShell)
```
pwsh -File docs/scripts/windows/admin_activate_test_communities.ps1
```

Notes
- Optional admin auth: set `ADMIN_BEARER` env var to include Authorization header.
- Logs: `artifacts/logs/activate_test_communities.log` (bash) or `artifacts/logs/activate_test_communities.ps1.log` (PS1).
- If backend endpoints are unavailable, temporarily set `COMMUNITY_VIABILITY_BYPASS=true` in mobile `.env.development` for client‑side bypass only.

