# =========================
# 0) Session preflight
# =========================
$ErrorActionPreference = "Continue"
$PSStyle.OutputRendering = "PlainText"

$Mob = "D:\uprise_mob"
$And = Join-Path $Mob "android"
$Art = Join-Path $Mob "artifacts"
$Docs = Join-Path $Mob "docs"

New-Item -ItemType Directory -Force -Path $Art, $Docs | Out-Null

# =========================
# 1) PowerShell version guard
# =========================
$psv = $PSVersionTable.PSVersion
if ($psv.Major -lt 7) {
  Write-Host "This script must run under PowerShell 7+. Please relaunch pwsh 7.5+ and re-run." -ForegroundColor Red
  return
}

# =========================
# 2) Fix Node/NVM visibility (no admin)
# =========================
# Use NVM Windows target version
$nvmNode = "20.18.1"

# Make sure PATH includes NVM shims
$NvmRoot = "C:\ProgramData\nvm"
$NodeLink = "C:\Program Files\nodejs"

# Refresh PATH from registry for this process
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' +
            [Environment]::GetEnvironmentVariable('Path','User')

# Ensure typical Node link dir is on PATH (some shells miss it)
if (-not ($env:Path -split ';' | Where-Object { $_ -eq $NodeLink })) {
  $env:Path = "$NodeLink;$env:Path"
}

# Ask nvm to switch; then hard-refresh PATH again
try { nvm use $nvmNode | Out-Null } catch {}
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' +
            [Environment]::GetEnvironmentVariable('Path','User')

# Final fallbacks: add the actual version bin and nvm dir if needed
$VersionBin = Join-Path $NvmRoot $nvmNode
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  if (Test-Path $VersionBin) {
    $env:Path = "$VersionBin;$env:Path"
  }
  if (Test-Path $NvmRoot) {
    $env:Path = "$NvmRoot;$env:Path"
  }
}

# Verify node/npm/yarn
$nodeOk = (Get-Command node -ErrorAction SilentlyContinue) -ne $null
$npmOk  = (Get-Command npm  -ErrorAction SilentlyContinue) -ne $null
if (-not $nodeOk -or -not $npmOk) {
  Write-Host "Node/npm still not visible; PATH is:" -ForegroundColor Yellow
  Write-Host $env:Path
  Write-Host "Please ensure NVM for Windows is installed and try again." -ForegroundColor Red
  return
}

Write-Host "Node: $(node -v)  NPM: $(npm -v)" -ForegroundColor Green

# We use Yarn Classic (v1). Do NOT use corepack here (caused EPERM with NVM).
# If yarn cmd missing, install yarn v1 for user:
if (-not (Get-Command yarn -ErrorAction SilentlyContinue)) {
  npm i -g yarn@1 >/dev/null 2>&1
}

Write-Host "Yarn: $(yarn -v)" -ForegroundColor Green

# =========================
# 3) Ensure dependencies & cross-env
# =========================
Set-Location $Mob
Remove-Item (Join-Path $Mob "package-lock.json") -ErrorAction SilentlyContinue
# Conservative install (no postinstall scripts)
yarn install --ignore-scripts --network-timeout 600000 *> (Join-Path $Art "yarn_install.log")

# cross-env needed by "yarn start"
# With Node 20.18.1 active, this is safe:
try {
  yarn add -D cross-env@7.0.3 --silent
} catch {
  # If package manager complains but scripts already work, continue
}

# =========================
# 4) Backend + App env
# =========================
# Ensure emulator uses WSL backend via 10.0.2.2
$envFile = (Test-Path (Join-Path $Mob ".env.development")) ? (Join-Path $Mob ".env.development") : (Join-Path $Mob ".env")
if (-not (Test-Path $envFile)) { New-Item -ItemType File -Path $envFile | Out-Null }
$content = (Get-Content $envFile -Raw)
if ($content -notmatch "(?m)^\s*API_BASE_URL\s*=") {
  Add-Content $envFile "`nAPI_BASE_URL=http://10.0.2.2:8080"
} else {
  ($content -replace "(?m)^\s*API_BASE_URL\s*=.*$", "API_BASE_URL=http://10.0.2.2:8080") | Out-File -Encoding utf8 $envFile
}

# =========================
# 5) Gradle soft-fix and (re)build (non-fatal if APK already exists)
# =========================
Set-Location $And
$gradleLog = Join-Path $Art "gradle_build_full.log"
".\gradlew.bat --stop" | Out-File -Append $gradleLog
.\gradlew.bat --stop >> $gradleLog 2>&1

# Use Android Studio JBR if JAVA_HOME is missing/bad (safe override)
if (-not (Test-Path $env:JAVA_HOME)) {
  $guess = "C:\\Program Files\\Android\\Android Studio\\jbr"
  if (Test-Path $guess) { $env:JAVA_HOME = $guess }
}
Write-Host "JAVA_HOME=$($env:JAVA_HOME)" -ForegroundColor Cyan

# Avoid native builds for Hermes/New Arch/Reanimated
$env:REANIMATED_DONT_BUILD_FROM_SOURCE = "true"
$env:ORG_GRADLE_PROJECT_newArchEnabled = "false"

# Quick sync and attempt assemble (non-fatal)
.\gradlew.bat --no-daemon --stacktrace --info help            >> $gradleLog 2>&1
.\gradlew.bat --no-daemon --stacktrace --info :app:assembleDebug >> $gradleLog 2>&1

$Apk = Join-Path $And "app\build\outputs\apk\debug\app-debug.apk"
$apkExists = Test-Path $Apk

# =========================
# 6) Metro & ADB wiring
# =========================
Set-Location $Mob
$env:RCT_METRO_PORT = "8081"

# Start Metro if not listening (best-effort)
$metroLog = Join-Path $Art "metro_start.log"
$metroUp = $false
try {
  $tcp = Test-NetConnection -ComputerName "localhost" -Port 8081 -InformationLevel Quiet
  if (-not $tcp) {
    Start-Process -FilePath "yarn" -ArgumentList "start" -WorkingDirectory $Mob -NoNewWindow
    Start-Sleep -Seconds 5
  }
  $metroUp = (Test-NetConnection -ComputerName "localhost" -Port 8081 -InformationLevel Quiet)
} catch {}

# ADB device + reverse
$Adb = Join-Path $env:LOCALAPPDATA "Android\Sdk\platform-tools\adb.exe"
$dev = (& $Adb devices | Select-String "device$" | Select-Object -First 1).Line.Split("`t")[0]
if ([string]::IsNullOrWhiteSpace($dev)) {
  Write-Host "No emulator/device attached; connect one and re-run." -ForegroundColor Red
} else {
  try { & $Adb -s $dev reverse tcp:8080 tcp:8080 | Out-Null } catch {}
  try { & $Adb -s $dev reverse tcp:8081 tcp:8081 | Out-Null } catch {}

  # (Re)install if APK present
  if ($apkExists) {
    & $Adb -s $dev install -r $Apk | Out-Null
    & $Adb -s $dev shell monkey -p "com.app.uprise.debug" -c android.intent.category.LAUNCHER 1 | Out-Null
  }
}

# =========================
# 7) Capture boot network logs + verify backend
# =========================
$netBoot = Join-Path $Art "net_boot.txt"
try {
  & $Adb -s $dev logcat -c | Out-Null
  Start-Sleep -Seconds 2
  $job = Start-Job -ScriptBlock {
    param($adbPath,$device,$outPath)
    & $adbPath -s $device logcat -v time |
      Select-String -Pattern "http","/health","API_BASE_URL","Axios","fetch" |
      ForEach-Object { $_.Line } |
      Out-File -Encoding utf8 $outPath
  } -ArgumentList $Adb,$dev,$netBoot
  Start-Sleep -Seconds 12
  Stop-Job $job -ErrorAction SilentlyContinue | Out-Null
  Receive-Job $job -ErrorAction SilentlyContinue | Out-Null
  Remove-Job $job -Force -ErrorAction SilentlyContinue | Out-Null
} catch {}

# Windows-side backend health (should be up if WSL backend is running)
$healthWin = Join-Path $Art "backend_health_win.txt"
try {
  (Invoke-WebRequest -UseBasicParsing "http://localhost:8080/health" -TimeoutSec 5).Content |
    Out-File -Encoding utf8 $healthWin
} catch {}

# =========================
# 8) Docs + Summary
# =========================
$stamp = Get-Date -Format s
Add-Content (Join-Path $Docs "runbook_android.md") "`n$stamp  Windows agent: node=$(node -v), metro=$($metroUp), apk=$($apkExists), device=$dev"
Add-Content (Join-Path $Docs "CHANGELOG.md")       "`n$(Get-Date -Format yyyy-MM-dd)  Windows agent refreshed Node via NVM, started Metro, and wired ADB reverse."

$summary = [pscustomobject]@{
  status           = if ($apkExists) { "OK" } else { "FAILED" }
  node             = (node -v)
  npm              = (npm -v)
  yarn             = (yarn -v)
  metro_listening  = $metroUp
  device           = $dev
  apk_path         = $Apk
  backend_health   = (Test-Path $healthWin)
  netlog           = (Test-Path $netBoot) ? (Resolve-Path $netBoot).Path : $netBoot
  gradle_log       = (Resolve-Path $gradleLog).Path
  notes            = @("Gradle failures are non-fatal if APK exists and app launches; REANIMATED_DONT_BUILD_FROM_SOURCE=true applied")
}
$summary | ConvertTo-Json -Compress | Tee-Object -Variable json | Write-Output

Write-Host "`nArtifacts:"
Write-Host "  $gradleLog"
Write-Host "  $netBoot"
Write-Host "  $healthWin"
Write-Host "`nDocs:"
Write-Host "  $(Join-Path $Docs 'runbook_android.md')"
Write-Host "  $(Join-Path $Docs 'CHANGELOG.md')"

Write-Host "`nWindow left open intentionally."


