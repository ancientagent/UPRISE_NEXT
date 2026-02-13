#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Basic DB extensions guard (warn mode)
$host = $env:PGHOST; if (-not $host) { $host = '127.0.0.1' }
$port = $env:PGPORT; if (-not $port) { $port = '5433' }
$db   = $env:PGDATABASE; if (-not $db) { $db = 'postgres' }
$user = $env:PGUSER; if (-not $user) { $user = 'postgres' }

Write-Host "== DB Extensions Guard (warn mode) =="
$psql = 'psql'
try {
  $cmd = "$psql -h $host -p $port -U $user -d $db -Atc \"select extname from pg_extension\""
  $env:PGPASSWORD | Out-Null
  $out = & bash -lc "$cmd" 2>$null
} catch {
  Write-Host "[WARN] psql not available or connection failed ($host:$port/$db)" -ForegroundColor Yellow
  exit 0
}

if (-not $out) {
  Write-Host "[WARN] Could not retrieve extensions list" -ForegroundColor Yellow
  exit 0
}

$need = @('postgis','uuid-ossp')
$have = $out -split '\n' | Where-Object { $_ -ne '' }
$missing = $need | Where-Object { $have -notcontains $_ }
if ($missing.Count -gt 0) {
  Write-Host "[WARN] Missing extensions: $($missing -join ', ') on $host:$port/$db" -ForegroundColor Yellow
} else {
  Write-Host "DB extensions check: PASS ($($need -join ', '))"
}
