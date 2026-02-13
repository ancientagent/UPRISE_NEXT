param(
  [ValidateSet('Debug','Release')]
  [string]$Configuration = 'Debug',
  [string]$AppId,
  [string]$HealthPath = "/health",
  [string]$DeviceId   = "",
  [switch]$SkipYarn
)

# --- PS7 bootstrap (relaunch if running in 5.1) ---
if ($PSVersionTable.PSVersion.Major -lt 7) {
  $pwsh = Join-Path $env:ProgramFiles "PowerShell/7/pwsh.exe"
  if (Test-Path $pwsh) { & $pwsh -NoExit -ExecutionPolicy Bypass -File $PSCommandPath @args; exit $LASTEXITCODE }
  Write-Error "PowerShell 7+ is required."; exit 1
}

$ErrorActionPreference = "Continue"
$MobRoot  = "D:/uprise_mob"
$DocsRoot = "D:/uprise_mob/docs"
$ArtDir   = Join-Path $MobRoot "artifacts"

$Adb     = Join-Path $env:LOCALAPPDATA "Android/Sdk/platform-tools/adb.exe"
$Gradlew = Join-Path $MobRoot "android/gradlew.bat"

if (-not $AppId) {
  $AppId = if ($Configuration -eq 'Release') { 'com.app.uprise' } else { 'com.app.uprise.debug' }
}
$Apk = if ($Configuration -eq 'Release') {
  Join-Path $MobRoot "android/app/build/outputs/apk/release/app-release.apk"
} else {
  Join-Path $MobRoot "android/app/build/outputs/apk/debug/app-debug.apk"
}

$YarnLog   = Join-Path $ArtDir "yarn_install.log"
$GradleLog = Join-Path $ArtDir "gradle_build.log"
$LogcatOut = Join-Path $ArtDir "logcat_health.txt"
$HealthWin = Join-Path $ArtDir "backend_health_win.txt"

$BaseUrlWin = "http://localhost:3000"
$BaseUrlEmu = "http://10.0.2.2:3000"
$HealthUrlWin = "$BaseUrlWin$HealthPath"

function STEP($m){ Write-Host "`n=== $m ===" -ForegroundColor Cyan }
function OK($m){ Write-Host "[OK]  $m" -ForegroundColor Green }
function ERR($m){ Write-Host "[ERR] $m" -ForegroundColor Red }

New-Item -ItemType Directory -Force -Path $ArtDir | Out-Null
Set-Location $MobRoot

OK ("PowerShell {0}" -f $PSVersionTable.PSVersion.ToString())

STEP "Select ADB device"
& $Adb start-server | Out-Null
$devs = & $Adb devices | Select-String "device$"
if (-not $devs) { ERR "No adb devices detected."; $DeviceId = "" } else {
  if ([string]::IsNullOrWhiteSpace($DeviceId)) { $DeviceId = ($devs | Select-Object -First 1).Line.Split("`t")[0] }
  OK "Using $DeviceId"
}

STEP "Ensure API_BASE_URL in env"
$envFile = (Test-Path ".env.development") ? ".env.development" : (Test-Path ".env") ? ".env" : ".env"
if (!(Test-Path $envFile)) { New-Item -ItemType File -Path $envFile | Out-Null }
$content = (Get-Content $envFile -Raw)
if ($content -notmatch "(?m)^\s*API_BASE_URL\s*=") {
  Add-Content $envFile "`r`nAPI_BASE_URL=$BaseUrlEmu"
} else {
  ($content -replace "(?m)^\s*API_BASE_URL\s*=.*$", "API_BASE_URL=$BaseUrlEmu") | Out-File -Encoding utf8 $envFile
}
OK "API_BASE_URL=$BaseUrlEmu in $envFile"

if (-not $SkipYarn) {
  STEP "yarn install"
  $yarn = (Get-Command yarn.cmd -ErrorAction SilentlyContinue)?.Source
  if (-not $yarn) { ERR "yarn.cmd not found in PATH" } else {
    & $yarn install --ignore-scripts --network-timeout 600000 *> $YarnLog
    if ($LASTEXITCODE -eq 0) { OK "yarn OK ($YarnLog)" } else { ERR "yarn failed ($YarnLog)" }
  }
} else { OK "Skipped yarn (per -SkipYarn)" }

STEP "Gradle :app:assemble$Configuration"
& $Gradlew ":app:assemble$Configuration" *> $GradleLog
if ($LASTEXITCODE -eq 0 -and (Test-Path $Apk)) { OK "Gradle OK: $Apk" } else { ERR "Gradle failed ($GradleLog)" }

STEP "Install + launch"
function Uninstall-Pkg([string]$pkg){
  try { & $Adb -s $DeviceId shell am force-stop $pkg | Out-Null } catch {}
  try { & $Adb -s $DeviceId uninstall $pkg | Out-Null; return } catch {}
  try { & $Adb -s $DeviceId shell pm clear $pkg | Out-Null } catch {}
  try { & $Adb -s $DeviceId shell pm uninstall -k --user 0 $pkg | Out-Null; return } catch {}
  try { & $Adb -s $DeviceId shell cmd package uninstall -k --user 0 $pkg | Out-Null; return } catch {}
}
foreach ($pkg in @('com.app.uprise','com.app.uprise.debug')) { Uninstall-Pkg $pkg }
try { & $Adb -s $DeviceId install -r $Apk | Out-Null; OK "APK installed ($Configuration)" } catch { ERR "adb install failed" }
try {
  & $Adb -s $DeviceId shell monkey -p $AppId -c android.intent.category.LAUNCHER 1 | Out-Null
  OK "Launched $AppId"
} catch { ERR "adb launch failed" }

STEP "Metro & Debug server"
if ($Configuration -eq 'Debug') {
  $env:RCT_METRO_PORT = "8081"
  $metroLock = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*react-native*" }
  if (-not $metroLock) {
    Start-Process -FilePath (Get-Command yarn.cmd).Source -ArgumentList "start" -WorkingDirectory $MobRoot
    Start-Sleep -Seconds 3
  }
  try { & $Adb -s $DeviceId reverse tcp:8081 tcp:8081 | Out-Null } catch {}
  & $Adb -s $DeviceId shell settings put global http_proxy :0 | Out-Null
  & $Adb -s $DeviceId shell "settings put global development_settings_enabled 1" | Out-Null
  & $Adb -s $DeviceId shell "settings put global debug_app $AppId" | Out-Null
  & $Adb -s $DeviceId shell "am broadcast -a com.facebook.react.modules.systeminfo.RN_DEBUG_SERVER_HOST -e host 10.0.2.2:8081" | Out-Null
  try {
    $setHostCmd = "run-as $AppId sh -c 'mkdir -p files && echo 10.0.2.2:8081 > files/ReactNativeDevServerHost'"
    & $Adb -s $DeviceId shell $setHostCmd | Out-Null
  } catch {}
  OK "Metro targeting 10.0.2.2:8081"
} else {
  OK "Release build: Metro not required"
}

STEP "Logcat capture"
& $Adb -s $DeviceId logcat -d | Select-String -Pattern "http","/health","API_BASE_URL","Network","Axios","fetch" |
  Out-File -Encoding utf8 $LogcatOut
if (Test-Path $LogcatOut) { OK "Saved $LogcatOut" } else { ERR "No logcat output" }

STEP "Summary"
$summary = [pscustomobject]@{
  device         = $DeviceId
  apk_path       = (Test-Path $Apk) ? (Resolve-Path $Apk).Path : $Apk
  logcat         = (Test-Path $LogcatOut) ? (Resolve-Path $LogcatOut).Path : $LogcatOut
  app_id         = $AppId
  configuration  = $Configuration
}
$summary | ConvertTo-Json -Compress | Write-Output

Write-Host "Window left open intentionally."
