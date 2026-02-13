#!/usr/bin/env pwsh
<#
  Phase 2 API smoke checks (Windows wrapper)
  - Non-destructive GETs to discovery/radio/communities/events
  - Prefers WSL to run canonical bash script; fallback to native PowerShell HTTP
#>

param()

$ErrorActionPreference = 'Stop'

$baseUrl = if ($env:BASE_URL) { $env:BASE_URL } elseif ($env:API_BASE_URL) { $env:API_BASE_URL } else { 'http://127.0.0.1:3000' }
$community = if ($env:COMMUNITY_KEY) { $env:COMMUNITY_KEY } else { 'austin-texas-hip-hop' }

function Invoke-InWSL {
  param([string]$WorkDirWin,[string]$Command)
  $wsl = Get-Command wsl -ErrorAction SilentlyContinue
  if (-not $wsl) { return $false }
  $mnt = ($WorkDirWin -replace '^([A-Za-z]):','/$1' -replace '\\','/')
  $mnt = $mnt.ToLower()
  $mnt = $mnt -replace '^/([a-z])','/mnt/$1'
  $bash = "cd '$mnt'; BASE_URL='$baseUrl' COMMUNITY_KEY='$community' $Command"
  & $wsl.Source -e bash -lc $bash
  return ($LASTEXITCODE -eq 0)
}

$repoRoot = (Resolve-Path .).Path
if (Invoke-InWSL -WorkDirWin $repoRoot -Command "./docs/scripts/phase2_smoke.sh") { exit 0 }

# Fallback to native PowerShell HTTP probes
Write-Host "=== Discovery by community_key ==="
try { $r = Invoke-WebRequest -Uri "$baseUrl/api/discovery?community_key=$community" -TimeoutSec 8; "HTTP $($r.StatusCode)"; $r.Content.Substring(0, [Math]::Min(240, $r.Content.Length)) } catch { "FAIL: $_" }

Write-Host "=== Radio queue by community_key ==="
try { $r = Invoke-WebRequest -Uri "$baseUrl/api/radio?community_key=$community" -TimeoutSec 8; "HTTP $($r.StatusCode)"; $r.Content.Substring(0, [Math]::Min(240, $r.Content.Length)) } catch { "FAIL: $_" }

Write-Host "=== Communities listing (optional filters) ==="
try { $r = Invoke-WebRequest -Uri "$baseUrl/api/communities?state=Texas&genre=Hip%20Hop" -TimeoutSec 8; "HTTP $($r.StatusCode)"; $r.Content.Substring(0, [Math]::Min(240, $r.Content.Length)) } catch { "FAIL: $_" }

Write-Host "=== Events discovery (geo filters where supported) ==="
try { $r = Invoke-WebRequest -Uri "$baseUrl/api/eventmanagement?city=Austin&state=Texas&genre=Hip%20Hop" -TimeoutSec 8; "HTTP $($r.StatusCode)"; $r.Content.Substring(0, [Math]::Min(240, $r.Content.Length)) } catch { "FAIL: $_" }

Write-Host "\nDone. Non-destructive reads only."

exit 0

