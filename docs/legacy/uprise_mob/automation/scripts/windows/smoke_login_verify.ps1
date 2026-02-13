$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

param(
  [string]$Device = $env:UPRISE_ADB_DEVICE,
  [int]$WaitSeconds = 30
)

if (-not $Device) { $Device = 'emulator-5554' }

function CenterFromBounds([string]$b) {
  # bounds format: [x1,y1][x2,y2]
  if ($b -notmatch '^\[(\d+),(\d+)\]\[(\d+),(\d+)\]$') { return $null }
  $x1=[int]$Matches[1]; $y1=[int]$Matches[2]; $x2=[int]$Matches[3]; $y2=[int]$Matches[4]
  return @{ X = [int](($x1 + $x2)/2); Y = [int](($y1 + $y2)/2) }
}

$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path))
$art = Join-Path $root 'artifacts\logs'
if (-not (Test-Path $art)) { New-Item -ItemType Directory -Force -Path $art | Out-Null }
$uiXmlLocal = Join-Path $art 'ui_dump.xml'

Write-Host "Target device: $Device" -ForegroundColor Cyan
& adb -s $Device logcat -c | Out-Null

Write-Host "Waiting for login 200 and Community header..." -ForegroundColor Green
$deadline = (Get-Date).AddSeconds($WaitSeconds)
$sawAuth200 = $false
$sawCommunity = $false

while ((Get-Date) -lt $deadline) {
  # Check log for 200
  $log = & adb -s $Device logcat -d | Select-String -Pattern "AUTH RES", "LOGIN route decision" -SimpleMatch
  if ($log -and ($log.ToString() -match 'status:\s*200')) { $sawAuth200 = $true }

  # Dump UI and look for header text 'Community'
  & adb -s $Device shell uiautomator dump /sdcard/ui_dump.xml 2>$null | Out-Null
  & adb -s $Device pull /sdcard/ui_dump.xml $uiXmlLocal 2>$null | Out-Null
  if (Test-Path $uiXmlLocal) {
    $xml = Get-Content $uiXmlLocal -Raw
    if ($xml -match 'text=\"Community\"') { $sawCommunity = $true }
  }

  if ($sawAuth200 -and $sawCommunity) { break }
  Start-Sleep -Milliseconds 500
}

if ($sawAuth200 -and $sawCommunity) {
  Write-Host "PASS: Login 200 observed and 'Community' header present (Home Scene Creation)." -ForegroundColor Green
  exit 0
}

Write-Host "WARN: Did not observe both login 200 and 'Community' header within ${WaitSeconds}s." -ForegroundColor Yellow
if (-not $sawAuth200) { Write-Host " - Missing login 200 in logcat" -ForegroundColor Yellow }
if (-not $sawCommunity) { Write-Host " - Missing 'Community' header in UI dump" -ForegroundColor Yellow }
Write-Host "Artifacts: $uiXmlLocal" -ForegroundColor Yellow
exit 1

