# UPRISE Phase 2: Verbose Android Debug Build (Logs to file)
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$repo = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $repo) { $repo = (Get-Location).Path }
try {
  Set-Location (Join-Path $repo '..\..')
} catch {}

function Fail($msg) { Write-Host $msg -ForegroundColor Red; exit 1 }

if (-not (Test-Path 'android')) { Fail 'android folder not found' }

$gradleLog = Join-Path 'android' 'gradle_build_output.txt'
if (Test-Path $gradleLog) { Remove-Item $gradleLog -Force -ErrorAction SilentlyContinue }

Write-Host '=== ANDROID: VERBOSE DEBUG BUILD ===' -ForegroundColor Green
Set-Location android
Write-Host "> .\gradlew.bat :app:assembleDebug --stacktrace --no-daemon --warning-mode all" -ForegroundColor Cyan
& .\gradlew.bat :app:assembleDebug --stacktrace --no-daemon --warning-mode all *>> $gradleLog
$code = $LASTEXITCODE
Set-Location ..

if ($code -ne 0) {
  Write-Host "Gradle build failed. Tail of $gradleLog:" -ForegroundColor Red
  if (Test-Path $gradleLog) { Get-Content $gradleLog -Tail 120 | Write-Host }
  Fail "Gradle build failed. See $gradleLog"
}

Write-Host 'Gradle build completed successfully.' -ForegroundColor Green
Write-Host ("Log file: {0}" -f $gradleLog)

