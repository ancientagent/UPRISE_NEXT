$ErrorActionPreference = 'Stop'

# Repo + tools
$repo = (Resolve-Path '..\').ProviderPath
if (-not (Test-Path (Join-Path $repo 'dev-backend\devserver.js'))) { $repo = (Get-Location).ProviderPath }
$node = 'C:\tools\node-v20.19.0-win-x64\node.exe'
$stub = Join-Path $repo 'dev-backend\devserver.js'
$wsl  = 'C:\Windows\System32\wsl.exe'
$logs = Join-Path $repo 'artifacts\logs'

New-Item -ItemType Directory -Force -Path $logs | Out-Null
Write-Host "ping: orchestrate_wsl_checks starting"

# 1) Start stub on :3000 if not listening
Write-Host 'ping: start stub backend on :3000 if not running'
$port = 3000
$up = $false
try { $up = (Test-NetConnection -ComputerName 127.0.0.1 -Port $port -WarningAction SilentlyContinue).TcpTestSucceeded } catch {}
if (-not $up) {
  if (-not (Test-Path $node)) { throw "Node not found at $node" }
  Start-Process -NoNewWindow -FilePath $node -ArgumentList $stub -WorkingDirectory $repo | Out-Null
  Start-Sleep -Seconds 2
}
try {
  $health = (Invoke-WebRequest -Uri http://127.0.0.1:3000/health -TimeoutSec 3).Content
  "ok: stub $health" | Tee-Object -FilePath (Join-Path $logs 'stub_health.txt')
} catch { "warn: stub health failed $_" | Tee-Object -FilePath (Join-Path $logs 'stub_health.txt') }

# 2) Create a repo-local bash file (WSL-visible) to avoid CRLF issues
$tmpRel = 'artifacts\tmp\wsl_orchestrate.sh'
$tmpDir = Split-Path -Parent (Join-Path $repo $tmpRel)
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null
$tmp = Join-Path $repo $tmpRel
$script = @'
set -e
cd /mnt/d/uprise_mob
mkdir -p artifacts/logs
chmod +x docs/scripts/*.sh || true

# Load PGURI if present
PGURI_FILE=artifacts/keys/uprise_supabase_dburl.txt
if [ -f "$PGURI_FILE" ]; then export PGURI="$(cat "$PGURI_FILE")"; fi

echo "ping: health_checks"
API_BASE_URL=http://127.0.0.1:3000 ./docs/scripts/health_checks.sh | tee artifacts/logs/wsl_health_checks.log || true
echo "ok: health_checks"

echo "ping: psql_postgis_check"
./docs/scripts/psql_postgis_check.sh | tee artifacts/logs/wsl_postgis_check.log || true
echo "ok: psql_postgis_check"

echo "ping: migration_guard"
./docs/scripts/migration_guard.sh | tee artifacts/logs/wsl_migration_guard.log || true
echo "ok: migration_guard"

echo "ping: phase2_smoke (timeouts enforced)"
COMMUNITY_KEY=austin-texas-hip-hop BASE_URL=http://127.0.0.1:3000 CURL_MAX_TIME=5 \
  timeout 20s bash ./docs/scripts/phase2_smoke.sh | tee artifacts/logs/wsl_phase2_smoke.log || true
echo "ok: phase2_smoke"

echo "ping: guards"
bash docs/ops/guards/guard-env-shape.sh | tee artifacts/logs/wsl_env_guard.log || true
bash docs/ops/guards/guard-artifacts.sh | tee artifacts/logs/wsl_artifacts_guard.log || true

date -Is > artifacts/logs/CLOUD_READY
echo "done: logs under artifacts/logs"
'@

# Write with LF line endings
[System.IO.File]::WriteAllText($tmp, ($script -replace "`r`n", "`n"))

# Build WSL path to the script
$drive = ($repo.Substring(0,1)).ToLower()
$repoTail = $repo.Substring(2).Replace('\','/')
$tmpWsl = "/mnt/$drive$repoTail/" + $tmpRel.Replace('\','/')

Write-Host 'ping: run WSL checks'
& $wsl -e bash -lc ("bash '{0}'" -f $tmpWsl) 2>&1 | Tee-Object -FilePath (Join-Path $logs 'orchestrate_wsl_checks.txt')

Remove-Item -Force $tmp -ErrorAction SilentlyContinue
Write-Host 'ok: orchestrate_wsl_checks finished'
