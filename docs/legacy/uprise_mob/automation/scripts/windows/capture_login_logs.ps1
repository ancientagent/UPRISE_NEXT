$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

param(
  [string]$Device = $env:UPRISE_ADB_DEVICE
)

if (-not $Device) { $Device = 'emulator-5554' }

$outDir = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..\..\..\artifacts\logs'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }
$out = Join-Path $outDir 'install_logcat_filtered.txt'

Write-Host "Target device: $Device" -ForegroundColor Cyan
& adb -s $Device logcat -c | Out-Null

$patterns = @('CONFIG','getRequestURL','AUTH RES','LOGIN route decision','LOGIN navigating','CommunitySetup')
Write-Host "Capturing 20s of filtered logcat to $out" -ForegroundColor Green
$job = Start-Job -ScriptBlock {
  param($dev,$outPath,$pats)
  & adb -s $dev logcat -v time ReactNative:V ReactNativeJS:V *:S |
    Select-String -Pattern $pats |
    ForEach-Object { $_.Line } | Out-File -Encoding ASCII -FilePath $outPath
} -ArgumentList $Device,$out,$patterns

Wait-Job $job -Timeout 20 | Out-Null
Stop-Job $job -ErrorAction SilentlyContinue | Out-Null
Receive-Job $job -ErrorAction SilentlyContinue | Out-Null
Remove-Job $job -Force -ErrorAction SilentlyContinue | Out-Null

Write-Host "Done. See $out" -ForegroundColor Green

