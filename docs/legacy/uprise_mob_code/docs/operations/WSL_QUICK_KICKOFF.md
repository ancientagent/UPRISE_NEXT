# WSL Quick Kickoff

Assumes Postgres 16 on port 5433 and the backend at `D:\\uprise_mob\\dev-backend` on Windows.
Saves results to `/mnt/d/uprise_mob/artifacts/logs`.

## Commands (paste into WSL)
```bash
cd /mnt/d/uprise_mob
set -euo pipefail
LOGDIR=/mnt/d/uprise_mob/artifacts/logs; mkdir -p "$LOGDIR"
export API_BASE_URL=http://127.0.0.1:3000 PG_HOST=127.0.0.1 PG_PORT=5433 PG_DB=uprise_dev PG_USER=uprise
chmod +x docs/scripts/*.sh || true

echo "Health check"; API_BASE_URL=$API_BASE_URL ./docs/scripts/health_checks.sh 2>&1 | tee "$LOGDIR/health_checks_wsl.log"
echo "PostGIS check"; PG_HOST=$PG_HOST PG_PORT=$PG_PORT PG_DB=$PG_DB PG_USER=$PG_USER ./docs/scripts/psql_postgis_check.sh 2>&1 | tee "$LOGDIR/psql_postgis_check_wsl.log"
echo "Env shape"; ENV_FILE=/mnt/d/uprise_mob/dev-backend/.env.development.local ./docs/scripts/env_shape_check.sh 2>&1 | tee "$LOGDIR/env_shape_check_wsl.log" || true
echo "Migration guard"; API_DIR=/mnt/d/uprise_mob/dev-backend ./docs/scripts/migration_guard.sh 2>&1 | tee "$LOGDIR/migration_guard_wsl.log"
echo "API contract smoke"; API_BASE_URL=$API_BASE_URL COMMUNITY_KEY=austin-texas-hip-hop ./docs/scripts/api_contract_check.sh 2>&1 | tee "$LOGDIR/api_contract_check_wsl.log" || true
echo "Phase 2 smoke"; API_BASE_URL=$API_BASE_URL COMMUNITY_KEY=austin-texas-hip-hop ./docs/scripts/phase2_smoke.sh 2>&1 | tee "$LOGDIR/phase2_smoke_wsl.log"
```

## Notes
- If any step fails, check the corresponding log in `artifacts/logs` for details.
- Pair with Windows-side actions:
  - Start Metro: `yarn start`
  - Reverse port: `adb reverse tcp:8081 tcp:8081`
  - Build/install: `yarn android:local:debug`
  - Backend base URL inside Android emulator: `http://10.0.2.2:3000`

Additional endpoint smokes
- Quick endpoint-only checks (no DB):
  - WSL: `bash docs/scripts/wsl/smoke_endpoints.sh`
  - Windows: `pwsh -File docs/scripts/windows/smoke_endpoints.ps1 -BaseUrl http://127.0.0.1:3000`
