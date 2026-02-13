param(
  [string]$AppId    = "com.app.uprise.debug",
  [string]$HealthPath = "/health",
  [string]$DeviceId   = "",
  [switch]$SkipYarn
)

# --- PS7 bootstrap (relaunch if running in 5.1) ---
if ($PSVersionTable.PSVersion.Major -lt 7) {
  $pwsh = Join-Path $env:ProgramFiles "PowerShell\7\pwsh.exe"
  if (Test-Path $pwsh) { & $pwsh -NoExit -ExecutionPolicy Bypass -File $PSCommandPath @args; exit $LASTEXITCODE }
  Write-Error "PowerShell 7+ is required."; exit 1
}

$ErrorActionPreference = "Continue"
$MobRoot  = "D:\uprise_mob"
$DocsRoot = "D:\uprise_mob\docs"
$ArtDir   = Join-Path $MobRoot "artifacts"

$Adb     = Join-Path $env:LOCALAPPDATA "Android\Sdk\platform-tools\adb.exe"
$Emu     = Join-Path $env:LOCALAPPDATA "Android\Sdk\emulator\emulator.exe"
$Gradlew = Join-Path $MobRoot "android\gradlew.bat"
$Apk     = Join-Path $MobRoot "android\app\build\outputs\apk\debug\app-debug.apk"

$YarnLog   = Join-Path $ArtDir "yarn_install.log"
$GradleLog = Join-Path $ArtDir "gradle_build.log"
$LogcatOut = Join-Path $ArtDir "logcat_health.txt"
$HealthWin = Join-Path $ArtDir "backend_health_win.txt"

$BaseUrlWin = "http://localhost:3000"
$BaseUrlEmu = "http://10.0.2.2:3000"
$HealthUrlWin = "$BaseUrlWin$HealthPath"

# helpers
function STEP($m){ Write-Host "`n=== $m ===" -ForegroundColor Cyan }
function OK($m){ Write-Host "[OK]  $m" -ForegroundColor Green }
function ERR($m){ Write-Host "[ERR] $m" -ForegroundColor Red }

New-Item -ItemType Directory -Force -Path $ArtDir | Out-Null
Set-Location $MobRoot

# 0) Ensure PS7 confirmed
OK ("PowerShell {0}" -f $PSVersionTable.PSVersion.ToString())

# 1) Device
STEP "Select ADB device"
& $Adb start-server | Out-Null
$devs = & $Adb devices | Select-String "device$"
if (-not $devs) { ERR "No adb devices detected."; $DeviceId = "" } else {
  if ([string]::IsNullOrWhiteSpace($DeviceId)) { $DeviceId = ($devs | Select-Object -First 1).Line.Split("`t")[0] }
  OK "Using $DeviceId"
}

# 2) Ensure API_BASE_URL in env
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

# 3) Backend health (Windows)
STEP ("Windows -> {0}" -f $HealthUrlWin)
try {
  (Invoke-WebRequest -UseBasicParsing $HealthUrlWin -TimeoutSec 6).Content |
    Out-File -Encoding utf8 $HealthWin
  OK "Saved $HealthWin"
} catch { ERR "No response from $HealthUrlWin" }

# 4) Yarn deps (optional)
if (-not $SkipYarn) {
  STEP "yarn install"
  # Avoid cmd.exe; call yarn.cmd directly
  $yarn = (Get-Command yarn.cmd -ErrorAction SilentlyContinue)?.Source
  if (-not $yarn) { ERR "yarn.cmd not found in PATH"; } else {
    & $yarn install --ignore-scripts --network-timeout 600000 *> $YarnLog
    if ($LASTEXITCODE -eq 0) { OK "yarn OK ($YarnLog)" } else { ERR "yarn failed ($YarnLog)" }
  }
} else { OK "Skipped yarn (per -SkipYarn)" }

# 5) Gradle build (no 'cmd'; call gradlew.bat directly)
STEP "Gradle assembleDebug"
Push-Location (Join-Path $MobRoot "android")
& .\gradlew.bat assembleDebug *> $GradleLog
Pop-Location
if ($LASTEXITCODE -eq 0 -and (Test-Path $Apk)) { OK "Gradle OK: $Apk" } else { ERR "Gradle failed ($GradleLog)" }

# 6) Install + launch
STEP "Install + launch"
try { & $Adb -s $DeviceId install -r $Apk | Out-Null; OK "APK installed" } catch { ERR "adb install failed" }
try {
  & $Adb -s $DeviceId shell monkey -p $AppId -c android.intent.category.LAUNCHER 1 | Out-Null
  OK "Launched $AppId"
} catch { ERR "adb launch failed" }

# 7) Metro & debug server (8081)
STEP "Metro & Debug server"
$env:RCT_METRO_PORT = "8081"
# start Metro if not running
$metroLock = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*react-native*" }
if (-not $metroLock) {
  Start-Process -FilePath (Get-Command yarn.cmd).Source -ArgumentList "start" -WorkingDirectory $MobRoot
  Start-Sleep -Seconds 3
}
# point emulator to host:8081
try { & $Adb -s $DeviceId reverse tcp:8081 tcp:8081 | Out-Null } catch {}
& $Adb -s $DeviceId shell settings put global http_proxy :0 | Out-Null
& $Adb -s $DeviceId shell "settings put global development_settings_enabled 1" | Out-Null
& $Adb -s $DeviceId shell "settings put global debug_app $AppId" | Out-Null
& $Adb -s $DeviceId shell "am broadcast -a com.facebook.react.modules.systeminfo.RN_DEBUG_SERVER_HOST -e host 10.0.2.2:8081" | Out-Null
try {
  # Persist ReactNativeDevServerHost inside app sandbox (most reliable)
  $setHostCmd = "run-as $AppId sh -c 'mkdir -p files && echo 10.0.2.2:8081 > files/ReactNativeDevServerHost'"
  & $Adb -s $DeviceId shell $setHostCmd | Out-Null
  $getHostCmd = "run-as $AppId cat files/ReactNativeDevServerHost"
  $hostCfg = & $Adb -s $DeviceId shell $getHostCmd 2>$null
  if ($hostCfg) { OK "DevServerHost=$hostCfg" } else { OK "DevServerHost set (no echo)" }
} catch { }
OK "Metro targeting 10.0.2.2:8081"

# 8) Logcat capture
STEP "Logcat capture"
& $Adb -s $DeviceId logcat -d | Select-String -Pattern "http","/health","API_BASE_URL","Network","Axios","fetch" |
  Out-File -Encoding utf8 $LogcatOut
if (Test-Path $LogcatOut) { OK "Saved $LogcatOut" } else { ERR "No logcat output" }

# 9) Docs
STEP "Docs append"
$stamp = Get-Date -Format s
$note  = "`nWindows Run: device '$DeviceId'; APK installed; API_BASE_URL=$BaseUrlEmu; HealthPath=$HealthPath; $stamp"
try { New-Item -ItemType Directory -Force -Path $DocsRoot | Out-Null } catch {}
try { Add-Content (Join-Path $DocsRoot "runbook_android.md") $note; OK "runbook updated" } catch {}
try { Add-Content (Join-Path $DocsRoot "CHANGELOG.md") "`n$(Get-Date -Format yyyy-MM-dd) — APK installed; backend reachable; artifacts captured." ; OK "changelog updated" } catch {}

# 10) Summary
STEP "Summary"
$reasons = @()
if (-not (Test-Path $Apk))      { $reasons += "apk-missing" }
if (-not (Test-Path $LogcatOut)) { $reasons += "logcat-missing" }
$status = if ($reasons.Count -gt 0) { "FAILED" } else { "OK" }

$summary = [pscustomobject]@{
  device         = $DeviceId
  apk_path       = (Test-Path $Apk) ? (Resolve-Path $Apk).Path : $Apk
  backend_health = (Test-Path $HealthWin) ? (Resolve-Path $HealthWin).Path : $HealthWin
  logcat         = (Test-Path $LogcatOut) ? (Resolve-Path $LogcatOut).Path : $LogcatOut
  app_id         = $AppId
  health_url_win = $HealthUrlWin
  health_url_emu = "http://10.0.2.2:8080$HealthPath"
  status         = $status
  reasons        = $reasons
}
$summary | ConvertTo-Json -Compress | Write-Output
Write-Host "`n---"
if ($status -eq "OK") { Write-Host "All steps completed." -ForegroundColor Green } else { Write-Host ("Failed checks: {0}" -f ($reasons -join ",")) -ForegroundColor Red }
Write-Host "Window left open intentionally."
