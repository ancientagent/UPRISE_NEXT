#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Activates a set of test communities via dev backend admin endpoints.
# Optional: $env:ADMIN_BEARER for Authorization header.

$RootDir = if ($env:ROOT_DIR) { $env:ROOT_DIR } else { (Get-Location).Path }
$BaseUrl = if ($env:API_BASE_URL) { $env:API_BASE_URL } else { 'http://127.0.0.1:3000' }
$LogDir = Join-Path $RootDir 'artifacts\logs'
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
$LogFile = Join-Path $LogDir 'activate_test_communities.ps1.log'

$Headers = @{ 'Content-Type' = 'application/json' }
if ($env:ADMIN_BEARER) { $Headers['Authorization'] = "Bearer $($env:ADMIN_BEARER)" }

$Communities = @(
  'austin-texas-hip-hop',
  'austin-texas-house',
  'buda-texas-thrash-punk'
)

"[admin] Activating test communities at $BaseUrl" | Tee-Object -FilePath $LogFile -Append | Out-Null

foreach ($key in $Communities) {
  "-- Seed minutes for $key" | Tee-Object -FilePath $LogFile -Append | Out-Null
  try {
    Invoke-RestMethod -Method Post -Uri "$BaseUrl/admin/communities/seed-minutes" -Headers $Headers -Body (@{ community_key = $key; minutes = 1000 } | ConvertTo-Json -Compress) | ConvertTo-Json -Compress | Tee-Object -FilePath $LogFile -Append | Out-Null
  } catch { "(warn) seed-minutes failed for $key: $($_.Exception.Message)" | Tee-Object -FilePath $LogFile -Append | Out-Null }

  "-- Force activate $key" | Tee-Object -FilePath $LogFile -Append | Out-Null
  try {
    Invoke-RestMethod -Method Post -Uri "$BaseUrl/admin/communities/activate" -Headers $Headers -Body (@{ community_key = $key } | ConvertTo-Json -Compress) | ConvertTo-Json -Compress | Tee-Object -FilePath $LogFile -Append | Out-Null
  } catch { "(warn) activate failed for $key: $($_.Exception.Message)" | Tee-Object -FilePath $LogFile -Append | Out-Null }
}

"Done. Log: $LogFile" | Tee-Object -FilePath $LogFile -Append | Out-Null

