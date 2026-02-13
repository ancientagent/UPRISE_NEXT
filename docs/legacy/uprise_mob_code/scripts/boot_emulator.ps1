#Requires -Version 7.0

param(
  [string]$AvdName = "Pixel_6_API_31",
  [int]$BootWaitSeconds = 240
)

# Safe helpers
function Step([string]$m){ Write-Host "`n=== $m ===" -ForegroundColor Cyan }
function Ok([string]$m){ Write-Host "[OK]  $m" -ForegroundColor Green }
function Err([string]$m){ Write-Host "[ERR] $m" -ForegroundColor Red }

$ErrorActionPreference = 'Stop'

Step "UPRISE: Boot Emulator"

$Sdk = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$Adb = Join-Path $Sdk "platform-tools\adb.exe"
$Emu = Join-Path $Sdk "emulator\emulator.exe"

if (-not (Test-Path $Adb)) { Err "ADB not found: $Adb"; exit 1 }
if (-not (Test-Path $Emu)) { Err "Emulator not found: $Emu"; exit 1 }

Step "Kill stale ADB/Emulator processes"
try {
  Stop-Process -Name adb,emulator,qemu-system-x86_64,qemu-system-aarch64 -Force -ErrorAction SilentlyContinue
  Ok "Killed stale processes"
} catch { Ok "No stale processes to kill" }

Step "Restart ADB"
try {
  & $Adb kill-server | Out-Null
  & $Adb start-server | Out-Null
  Ok "ADB restarted"
} catch { Err "ADB restart failed"; exit 1 }

Step "List available AVDs"
try {
  $avds = & $Emu -list-avds
  if ($avds) {
    Ok "Available AVDs:"
    $avds | ForEach-Object { Write-Host "  $_" -ForegroundColor DarkGray }
  } else {
    Err "No AVDs found"
    exit 1
  }
} catch { Err "Failed to list AVDs"; exit 1 }

if ([string]::IsNullOrWhiteSpace($AvdName)) {
  Err "No -AvdName provided"
  exit 1
}

Step "Boot AVD: $AvdName"
try {
  Start-Process -FilePath $Emu -ArgumentList "-avd `"$AvdName`" -no-snapshot -netdelay none -netspeed full" -WindowStyle Minimized | Out-Null
  & $Adb wait-for-device | Out-Null
  Ok "Emulator started, waiting for boot completion"
} catch { Err "Failed to start emulator"; exit 1 }

Step "Wait for boot completion"
$max = [math]::Max(30, $BootWaitSeconds)
$i = 0
do {
  try {
    $boot = & $Adb shell getprop sys.boot_completed 2>$null
    if ($boot -match "1") { 
      Ok "Boot completed successfully"
      break 
    }
  } catch { }
  Start-Sleep -Seconds 2
  $i++
} while ($i -lt $max)

if ($i -ge $max) {
  Err "Emulator boot timeout after $max seconds"
  exit 1
} else {
  Step "Get device ID"
  try {
    $devices = & $Adb devices | Select-String "device$"
    if ($devices) {
      $deviceId = ($devices | Select-Object -First 1).Line -split "\s+" | Select-Object -First 1
      Ok "Device ready: $deviceId"
      Write-Output $deviceId
    } else {
      Err "No devices found after boot"
      exit 1
    }
  } catch { Err "Failed to get device ID"; exit 1 }
}

