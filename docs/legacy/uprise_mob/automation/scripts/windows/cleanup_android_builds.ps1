param(
  [string]$AppIdRelease = "com.app.uprise",
  [string]$AppIdDebug   = "com.app.uprise.debug",
  [string]$DeviceId     = "",
  [switch]$AllDevices,
  [switch]$DryRun
)

# Purpose: Remove duplicate/stale UPRISE APKs from Android emulators/devices.
# Safe, non-destructive to emulator data. Uses adb uninstall.
#
# Usage examples:
#   pwsh -File .\docs\scripts\windows\cleanup_android_builds.ps1 -AllDevices
#   pwsh -File .\docs\scripts\windows\cleanup_android_builds.ps1 -DeviceId emulator-5554

$ErrorActionPreference = "Stop"

function Info($m){ Write-Host $m -ForegroundColor Cyan }
function Ok($m){ Write-Host $m -ForegroundColor Green }
function Warn($m){ Write-Host $m -ForegroundColor Yellow }
function Err($m){ Write-Host $m -ForegroundColor Red }

$adb = (Get-Command adb.exe -ErrorAction SilentlyContinue)?.Source
if (-not $adb) { $adb = (Get-Command adb -ErrorAction SilentlyContinue)?.Source }
if (-not $adb) { Err "adb not found. Ensure Android SDK platform-tools are in PATH."; exit 1 }

& $adb start-server | Out-Null

$targets = @()
if ($AllDevices) {
  $targets = (& $adb devices | Select-String "device$" | ForEach-Object { ($_ -split "\t")[0] })
} elseif ($DeviceId) {
  $targets = @($DeviceId)
} else {
  # default: first device if present
  $first = (& $adb devices | Select-String "device$" | Select-Object -First 1)
  if ($first) { $targets = @(($first.Line -split "\t")[0]) }
}

if (-not $targets -or $targets.Count -eq 0) { Warn "No ADB devices found."; exit 0 }

Info ("Devices: {0}" -f ($targets -join ", "))

foreach ($id in $targets) {
  Info "\n== $id =="
  $pkgs = (& $adb -s $id shell pm list packages | Out-String)
  $found = @()
  if ($pkgs -match [regex]::Escape($AppIdRelease)) { $found += $AppIdRelease }
  if ($pkgs -match [regex]::Escape($AppIdDebug))   { $found += $AppIdDebug }
  if (-not $found -or $found.Count -eq 0) { Ok "No uprise packages installed."; continue }

  Ok ("Found: {0}" -f ($found -join ", "))
  foreach ($pkg in $found) {
    $cmd = "$adb -s $id uninstall $pkg"
    if ($DryRun) {
      Warn "DRY-RUN: $cmd"
    } else {
      Info "Uninstall $pkg"
      try {
        & $adb -s $id uninstall $pkg | Write-Host
      } catch {
        Warn "Failed to uninstall $pkg on $id"
      }
    }
  }
}

Ok "Cleanup complete."

