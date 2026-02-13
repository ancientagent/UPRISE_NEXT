# Requires: ADB in PATH, PowerShell 5+
param(
  [string[]] $PackageRoots = @('com.app.uprise','com.uprise'),
  [switch] $ClearProjectBuild,
  [switch] $Deep,
  [string] $NodePath = "C:\tools\node-v20.19.0-win-x64\node.exe"
)

$ErrorActionPreference = 'Stop'

function Log($msg) { Write-Host ("[cleanup] " + $msg) }

function Ensure-Adb() {
  try { & adb version | Out-Null } catch { throw "ADB not found in PATH" }
}

function Get-UprisePackages($device) {
  $pkgs = & adb -s $device shell pm list packages | ForEach-Object { $_.Trim() } |
    Where-Object { $_ -like 'package:*' } |
    ForEach-Object { $_ -replace '^package:','' }
  $patterns = @()
  foreach ($root in $PackageRoots) {
    $patterns += "^$([regex]::Escape($root))(\..+)?$"
  }
  return $pkgs | Where-Object { $p=$_; $patterns | Where-Object { $p -match $_ } }
}

function Uninstall-Packages($device, $packages) {
  foreach ($p in $packages) {
    Log "Uninstalling $p on $device"
    & adb -s $device uninstall $p | Write-Host
  }
}

function Clear-ProjectBuild() {
  Log "Clearing project build artifacts"
  $paths = @(
    "android\app\build",
    "android\build",
    ".gradle",
    "node_modules"
  )
  foreach ($p in $paths) {
    if (Test-Path $p) {
      Log "Removing $p"
      try { Remove-Item -Recurse -Force $p } catch { Write-Warning "Failed to remove $p: $_" }
    }
  }
  if ($Deep) {
    $userGradle = Join-Path $env:USERPROFILE ".gradle\caches\transforms-3"
    if (Test-Path $userGradle) {
      Log "(Deep) Clearing $userGradle"
      try { Remove-Item -Recurse -Force $userGradle } catch { Write-Warning "Failed to clear user Gradle cache: $_" }
    }
  }
}

function Kill-NodeProcesses() {
  try { taskkill /F /IM node.exe /T 2>$null | Out-Null } catch {}
}

# Main
Ensure-Adb
& adb start-server | Out-Null
$devices = (& adb devices) -split "`n" | Where-Object { $_ -match "`tdevice$" } | ForEach-Object { ($_ -split "`t")[0] }
if (-not $devices) { throw "No ADB device/emulator detected" }

foreach ($d in $devices) {
  Log "Scanning packages on $d"
  $pkgs = Get-UprisePackages -device $d
  if ($pkgs) {
    Log ("Found: " + ($pkgs -join ', '))
    Uninstall-Packages -device $d -packages $pkgs
  } else {
    Log "No matching packages found on $d"
  }
}

if ($ClearProjectBuild) {
  Kill-NodeProcesses
  Clear-ProjectBuild
  if (Test-Path $NodePath) {
    $npm = (Split-Path $NodePath -Parent) + "\npm.cmd"
    if (Test-Path $npm) {
      Log "Reinstalling node_modules via npm ci"
      & $npm ci
    } else {
      Write-Warning "npm not found at expected path; skipping install"
    }
  } else {
    Write-Warning "Node not found at $NodePath; skipping install"
  }
}

Log "Done."

