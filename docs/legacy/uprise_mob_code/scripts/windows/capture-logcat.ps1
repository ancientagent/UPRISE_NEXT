param(
  [string]$AppId = 'com.app.uprise',
  [string]$Out    = 'artifacts\logs\logcat_app.txt',
  [string]$DeviceId = ''
)

$ErrorActionPreference = 'Stop'
function Log($m){ Write-Host ("[logcat] " + $m) }

& adb start-server | Out-Null
if (-not $DeviceId) {
  $devs = & adb devices | Select-String "device$"
  if ($devs) { $DeviceId = ($devs | Select-Object -First 1).Line.Split("`t")[0] }
}
if (-not $DeviceId) { throw "No adb device" }

New-Item -ItemType Directory -Force -Path (Split-Path $Out -Parent) | Out-Null
& adb -s $DeviceId logcat -c
$pidRaw = & adb -s $DeviceId shell pidof $AppId
$pid = if ($pidRaw) { $pidRaw.Trim() } else { $null }
if (-not $pid) { Log "App not running; capturing full log buffer"; & adb -s $DeviceId logcat -d > $Out; exit 0 }

Log "Capturing logs for pid=$pid"
& adb -s $DeviceId logcat --pid $pid -d > $Out
Log "Saved $Out"
