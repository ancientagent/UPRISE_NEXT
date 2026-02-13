$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

param(
  [string]$Device = $env:UPRISE_ADB_DEVICE
)

if (-not $Device) { $Device = 'emulator-5554' }

Write-Host "[mobile] Target device: $Device" -ForegroundColor Cyan

# Build + clean-install + launch
& "$PSScriptRoot\local_backend_emulator_debug.ps1" | Write-Host

# Verify login -> CommunitySetup
& "$PSScriptRoot\smoke_login_verify.ps1" -Device $Device -WaitSeconds 30 | Write-Host

# Handoff done
& "$PSScriptRoot\handoff_notify.ps1" -To codex-wsl -Kind done -Msg "mobile: build/install/smoke complete"

Write-Host "[mobile] autorun complete." -ForegroundColor Green

