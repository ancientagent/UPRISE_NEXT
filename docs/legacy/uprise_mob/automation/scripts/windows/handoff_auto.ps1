param(
  [string]$To = 'mobile-win',
  [string]$Device = $env:UPRISE_ADB_DEVICE
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

if (-not $Device) { $Device = 'emulator-5554' }

$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path))
$events = Join-Path $root 'docs\handoff\events.jsonl'
if (-not (Test-Path $events)) { New-Item -ItemType File -Force -Path $events | Out-Null }

Write-Host "[handoff-auto] Watching $events for events addressed to '$To' (device=$Device)" -ForegroundColor Green

Get-Content -Path $events -Wait -Tail 0 | ForEach-Object {
  $line = $_.Trim()
  if (-not $line) { return }
  try { $evt = $line | ConvertFrom-Json } catch { Write-Host "[handoff-auto] skip (not JSON): $line" -ForegroundColor Yellow; return }
  if ($evt.to -ne $To) { return }

  $kind = ($evt.kind ?? 'info')
  $msg = ($evt.msg ?? '')
  Write-Host "[handoff-auto] <- from=$($evt.from) kind=$kind msg=$msg" -ForegroundColor Cyan

  switch -Regex ($kind) {
    '^run-mobile$' {
      Write-Host "[handoff-auto] running orchestrate:mobile" -ForegroundColor Magenta
      $env:UPRISE_ADB_DEVICE = $Device
      & yarn orchestrate:mobile | Write-Host
      & "$PSScriptRoot\handoff_notify.ps1" -To 'codex-wsl' -Kind 'done' -Msg 'mobile: orchestrate complete' | Out-Null
    }
    '^run-login-smoke$' {
      Write-Host "[handoff-auto] running login smoke" -ForegroundColor Magenta
      & "$PSScriptRoot\smoke_login_verify.ps1" -Device $Device -WaitSeconds 30 | Write-Host
      & "$PSScriptRoot\handoff_notify.ps1" -To 'codex-wsl' -Kind 'done' -Msg 'mobile: login smoke complete' | Out-Null
    }
    '^run-command$' {
      if ($msg -like 'ps:*') {
        $cmd = $msg.Substring(3)
        Write-Host "[handoff-auto] exec: $cmd" -ForegroundColor DarkCyan
        Invoke-Expression $cmd
      }
    }
    default {
      Write-Host "[handoff-auto] noted event kind=$kind" -ForegroundColor DarkGray
    }
  }
}
