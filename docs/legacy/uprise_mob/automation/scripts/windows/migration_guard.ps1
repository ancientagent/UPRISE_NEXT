#!/usr/bin/env pwsh
<#
  Migration guard (Windows wrapper)
  - Prefers WSL to run the canonical bash script
  - Fallback: run `yarn` commands on Windows
  - Non-destructive: expects idempotent migrations
#>

param()

$ErrorActionPreference = 'Stop'

function Invoke-InWSL {
  param([string]$WorkDirWin,[string]$Command)
  $wsl = Get-Command wsl -ErrorAction SilentlyContinue
  if (-not $wsl) { return $false }
  $mnt = ($WorkDirWin -replace '^([A-Za-z]):','/$1' -replace '\\','/')
  $mnt = $mnt.ToLower()
  $mnt = $mnt -replace '^/([a-z])','/mnt/$1'
  $bash = "cd '$mnt'; $Command"
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $wsl.Source
  $psi.ArgumentList.Add('-e'); $psi.ArgumentList.Add('bash'); $psi.ArgumentList.Add('-lc'); $psi.ArgumentList.Add($bash)
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.UseShellExecute = $false
  $p = [System.Diagnostics.Process]::Start($psi)
  $out = $p.StandardOutput.ReadToEnd()
  $err = $p.StandardError.ReadToEnd()
  $p.WaitForExit()
  Write-Host $out
  if ($err.Trim()) { Write-Error $err }
  return ($p.ExitCode -eq 0)
}

$repoRoot = (Resolve-Path .).Path
$apiDirWin = (Resolve-Path '..\webapp_api').Path
$apiDirWsl = ($apiDirWin -replace '^([A-Za-z]):','/$1' -replace '\\','/').ToLower() -replace '^/([a-z])','/mnt/$1'

# Try WSL path first
$cmd = "API_DIR='$apiDirWsl' ./docs/scripts/migration_guard.sh"
if (Invoke-InWSL -WorkDirWin $repoRoot -Command $cmd) { exit 0 }
if ($LASTEXITCODE -ne 0) {
  Write-Warning 'WSL path failed (possibly CRLF in .sh). Falling back to Windows yarn if available.'
}

# Fallback to Windows yarn
$yarn = Get-Command yarn -ErrorAction SilentlyContinue
if (-not $yarn) {
  Write-Error 'yarn not found; cannot run migrations on Windows. Install Yarn or enable WSL.'
  exit 1
}

Write-Host '== Migration status (before) =='
& $yarn.Path --cwd $apiDirWin db:migrate:status || $true

Write-Host "`n== Running migrations =="
& $yarn.Path --cwd $apiDirWin db:migrate
if ($LASTEXITCODE -ne 0) { Write-Error 'Migrations failed'; exit 1 }

Write-Host "`n== Migration status (after) =="
& $yarn.Path --cwd $apiDirWin db:migrate:status || $true

Write-Host "`nMigration guard completed. Expect idempotent reruns."
