#!/usr/bin/env pwsh
<#
  Env shape validator (Windows/PowerShell)
  - Read-only; prints missing keys only, never values
  - Default env file: ../webapp_api/.env (override with ENV_FILE)
#>

param()

$ErrorActionPreference = 'Stop'

$envFile = if ($env:ENV_FILE) { $env:ENV_FILE } else { Join-Path '..' 'webapp_api' | Join-Path -ChildPath '.env' }
if (-not (Test-Path $envFile)) {
  Write-Error "Env file not found: $envFile"
  exit 1
}

$required = @(
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USERNAME',
  'DB_PASSWORD',
  'JWT_ACCESS_TOKEN_SECRET',
  'JWT_REFRESH_TOKEN_SECRET'
)

$keys = New-Object System.Collections.Generic.HashSet[string]
Get-Content -LiteralPath $envFile | ForEach-Object {
  $line = $_
  if ($null -eq $line) { return }
  $line = $line -replace "#.*$", ''
  $line = $line.Trim()
  if ([string]::IsNullOrWhiteSpace($line)) { return }
  if (-not $line.Contains('=')) { return }
  $k = ($line.Split('=',2)[0]).Trim()
  if ($k) { [void]$keys.Add($k) }
}

$missing = @()
foreach ($k in $required) { if (-not $keys.Contains($k)) { $missing += $k } }

if ($missing.Count -gt 0) {
  Write-Host ("Missing required keys in {0}:" -f $envFile) -ForegroundColor Yellow
  foreach ($m in $missing) { Write-Host "- $m" -ForegroundColor Yellow }
  Write-Host "See DOC: docs/ops/TROUBLESHOOTING.md" -ForegroundColor Yellow
  exit 1
}

Write-Host "Env shape OK: required keys present (values not shown)."
