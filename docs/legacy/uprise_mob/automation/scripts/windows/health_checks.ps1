#!/usr/bin/env pwsh
<#
  Windows Health Checks (non-destructive)
  - Mirrors docs/scripts/health_checks.sh where practical
  - Skips Postgres checks if `psql` is not available on PATH
  - Uses environment variables if set; otherwise falls back to defaults

  Env vars (optional):
    API_BASE_URL, PG_HOST, PG_PORT, PG_DB, PG_USER

  Exit code: 0 if all performed checks passed; 1 otherwise
#>

param()

$ErrorActionPreference = 'Stop'

# Defaults per System Facts
$API_BASE_URL = $env:API_BASE_URL
if ([string]::IsNullOrWhiteSpace($API_BASE_URL)) { $API_BASE_URL = 'http://127.0.0.1:3000' }

$PG_HOST = $env:PG_HOST; if ([string]::IsNullOrWhiteSpace($PG_HOST)) { $PG_HOST = '127.0.0.1' }
$PG_PORT = $env:PG_PORT; if ([string]::IsNullOrWhiteSpace($PG_PORT)) { $PG_PORT = '5433' }
$PG_DB   = $env:PG_DB;   if ([string]::IsNullOrWhiteSpace($PG_DB))   { $PG_DB   = 'uprise_dev' }
$PG_USER = $env:PG_USER; if ([string]::IsNullOrWhiteSpace($PG_USER)) { $PG_USER = 'uprise' }

$failures = 0
$summary = New-Object System.Collections.Generic.List[string]

function Add-Summary {
  param([string]$line)
  [void]$summary.Add($line)
}

Write-Host '== Health Checks (Windows) =='`n

# 1) API health
try {
  $resp = Invoke-WebRequest -Uri "$API_BASE_URL/health" -TimeoutSec 8
  if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 300) {
    Write-Host "[OK] API /health ($($resp.StatusCode))"
    Add-Summary 'API /health: OK'
    # Try JSON parse (best-effort)
    try { $null = $resp.Content | ConvertFrom-Json; Write-Host '[OK] API /health JSON parse' }
    catch { Write-Warning 'API /health JSON parse failed'; }
  } else {
    Write-Error "[FAIL] API /health ($($resp.StatusCode))"
    Add-Summary 'API /health: FAIL'
    $failures++
  }
}
catch {
  Write-Error "[FAIL] API /health: $($_.Exception.Message)"
  Add-Summary 'API /health: FAIL'
  $failures++
}

# 2) Postgres/PostGIS (optional)
$psql = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psql) {
  Write-Warning 'psql not found; skipping Postgres/PostGIS checks on Windows.'
  Add-Summary 'Postgres version: SKIP (psql missing)'
  Add-Summary 'PostGIS version: SKIP (psql missing)'
}
else {
  # Postgres version
  try {
    $conn = "postgres://${PG_USER}@${PG_HOST}:${PG_PORT}/${PG_DB}"
    $cmd = @('psql', $conn, '-c', 'select version();')
    $proc = Start-Process -NoNewWindow -FilePath $cmd[0] -ArgumentList $cmd[1..($cmd.Length-1)] -PassThru -Wait -RedirectStandardOutput ([System.IO.Path]::GetTempFileName()) -RedirectStandardError ([System.IO.Path]::GetTempFileName())
    if ($proc.ExitCode -eq 0) { Write-Host '[OK] Postgres version'; Add-Summary 'Postgres version: OK' }
    else { Write-Error "[FAIL] Postgres version (exit $($proc.ExitCode))"; Add-Summary 'Postgres version: FAIL'; $failures++ }
  } catch { Write-Error "[FAIL] Postgres version: $($_.Exception.Message)"; Add-Summary 'Postgres version: FAIL'; $failures++ }

  # PostGIS version
  try {
    $conn = "postgres://${PG_USER}@${PG_HOST}:${PG_PORT}/${PG_DB}"
    $cmd = @('psql', $conn, '-c', 'select postgis_full_version();')
    $proc = Start-Process -NoNewWindow -FilePath $cmd[0] -ArgumentList $cmd[1..($cmd.Length-1)] -PassThru -Wait -RedirectStandardOutput ([System.IO.Path]::GetTempFileName()) -RedirectStandardError ([System.IO.Path]::GetTempFileName())
    if ($proc.ExitCode -eq 0) { Write-Host '[OK] PostGIS version'; Add-Summary 'PostGIS version: OK' }
    else { Write-Error "[FAIL] PostGIS version (exit $($proc.ExitCode))"; Add-Summary 'PostGIS version: FAIL'; $failures++ }
  } catch { Write-Error "[FAIL] PostGIS version: $($_.Exception.Message)"; Add-Summary 'PostGIS version: FAIL'; $failures++ }
}

Write-Host "`n== Summary =="
foreach ($line in $summary) { Write-Host ('- ' + $line) }

if ($failures -gt 0) {
  Write-Host "`n$failures check(s) failed. See DOC: docs/ops/TROUBLESHOOTING.md" -ForegroundColor Yellow
  exit 1
}

Write-Host "`nAll health checks passed."
