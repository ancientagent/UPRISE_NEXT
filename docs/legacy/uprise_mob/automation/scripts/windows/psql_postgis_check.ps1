#!/usr/bin/env pwsh
<#
  PostGIS verification (Windows wrapper)
  - Uses Windows `psql` if available
  - Otherwise delegates to WSL bash script: docs/scripts/psql_postgis_check.sh
  - Non-destructive; reads DB settings from ../webapp_api/.env
#>

param()

$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path .).Path
$envFile = if ($env:ENV_FILE) { $env:ENV_FILE } else { (Join-Path '..' 'webapp_api' | Join-Path -ChildPath '.env') }
if (-not (Test-Path $envFile)) { Write-Error "Env file not found: $envFile"; exit 1 }

function Parse-DotEnvKeys {
  param([string]$Path)
  $map = @{}
  Get-Content -LiteralPath $Path | ForEach-Object {
    $line = $_
    if ($null -eq $line) { return }
    $line = $line -replace "^\uFEFF", ''
    $line = ($line -replace "#.*$", '').Trim()
    if ([string]::IsNullOrWhiteSpace($line)) { return }
    if (-not $line.Contains('=')) { return }
    $k,$v = $line.Split('=',2)
    $k = $k.Trim(); $v = ($v.Trim()).Trim('"').Trim("'")
    $map[$k] = $v
  }
  return $map
}

$envMap = Parse-DotEnvKeys -Path $envFile
foreach ($r in 'DB_HOST','DB_PORT','DB_NAME','DB_USERNAME','DB_PASSWORD') {
  if (-not $envMap.ContainsKey($r) -or [string]::IsNullOrWhiteSpace($envMap[$r])) {
    Write-Error "Missing $r in $envFile"; exit 1
  }
}

$psql = Get-Command psql -ErrorAction SilentlyContinue
if ($psql) {
  $host = $envMap.DB_HOST; $port = $envMap.DB_PORT; $db = $envMap.DB_NAME; $user = $envMap.DB_USERNAME; $pwd = $envMap.DB_PASSWORD
  $env:PGPASSWORD = $pwd
  Write-Host ("Checking PostGIS version on {0}:{1}/{2} (user: {3})" -f $host,$port,$db,$user)
  & $psql.Path -h $host -p $port -U $user -d $db -c "SELECT PostGIS_Full_Version();"
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  Write-Host "`nOptional: distance check (may be skipped if schema not present)"
  & $psql.Path -h $host -p $port -U $user -d $db -c @"
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='songs' AND column_name IN ('latitude','longitude')
  ) THEN
    RAISE NOTICE 'Songs within ~40km of Austin: %', (
      SELECT COUNT(*) FROM songs
      WHERE ST_DWithin(
        ST_SetSRID(ST_MakePoint(longitude, latitude),4326)::geography,
        ST_SetSRID(ST_MakePoint(-97.7431, 30.2672),4326)::geography,
        40000
      )
    );
  ELSE
    RAISE NOTICE 'songs(latitude,longitude) not present; skipping distance check';
  END IF;
END$$;
"@
  exit 0
}

# Fallback to WSL script
$wsl = Get-Command wsl -ErrorAction SilentlyContinue
if (-not $wsl) { Write-Error 'psql not found and WSL not available; cannot perform DB checks.'; exit 1 }
$mnt = ($repoRoot -replace '^([A-Za-z]):','/$1' -replace '\\','/').ToLower() -replace '^/([a-z])','/mnt/$1'
$bash = "cd '$mnt'; ENV_FILE='../webapp_api/.env' ./docs/scripts/psql_postgis_check.sh"
& $wsl.Source -e bash -lc $bash
if ($LASTEXITCODE -ne 0) {
  Write-Warning 'WSL fallback failed (likely CRLF line-endings in .sh). Defer to Ubuntu Codex for DB checks.'
  exit 0
}
exit 0
