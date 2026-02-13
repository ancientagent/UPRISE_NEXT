# UPRISE Phase 2: Local backend + Android emulator (Debug)
# Guardrails: no admin, no symlinks, user-writable paths only.
# Stop on error, print the last file touched.

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$lastTouched = ''
function Touch($path) { $script:lastTouched = $path }
function Fail($msg) {
  Write-Host "ERROR: $msg" -ForegroundColor Red
  if ($script:lastTouched) { Write-Host "Last file touched: $script:lastTouched" -ForegroundColor Yellow }
  exit 1
}

function Run($cmd, $timeoutSec=120) {
  Write-Host "> $cmd" -ForegroundColor Cyan
  $job = Start-Job -ScriptBlock { param($c) pwsh -NoLogo -NoProfile -Command $c } -ArgumentList $cmd
  if (-not (Wait-Job $job -Timeout $timeoutSec)) {
    Stop-Job $job -ErrorAction SilentlyContinue | Out-Null
    Remove-Job $job -Force -ErrorAction SilentlyContinue | Out-Null
    Fail "Command timed out after ${timeoutSec}s: $cmd"
  }
  $res = Receive-Job $job -Keep
  if ($LASTEXITCODE -ne 0) { Fail "Command failed: $cmd`n$res" }
  $res
}

# Inputs (adjust if paths differ)
$mob = 'D:\uprise_mob'
$api = 'D:\uprise_mob\dev-backend'
$docs = 'D:\uprise_mob\docs'
$nodeBin = 'C:\\tools\\node-v20.19.0-win-x64'
$adb = Join-Path $env:LOCALAPPDATA 'Android\\Sdk\\platform-tools\\adb.exe'
$emulator = Join-Path $env:LOCALAPPDATA 'Android\\Sdk\\emulator\\emulator.exe'
$preferredAvd = $env:UPRISE_AVD # Optional: set to a specific AVD name to prefer
$targetDeviceEnv = $env:UPRISE_ADB_DEVICE # Optional: set to a specific adb device id (e.g., emulator-5554)

Write-Host "=== PRECHECKS ===" -ForegroundColor Green
try {
  & node -v | Write-Host
  & npm -v | Write-Host
  & yarn -v | Write-Host
} catch { Write-Host "Node/yarn check non-fatal: $_" -ForegroundColor Yellow }
try { & $adb --version | Write-Host } catch { Write-Host "adb not found: $adb" -ForegroundColor Yellow }

# Check Android Build-Tools 33.0.2 (required by project)
$btRoot = Join-Path $env:LOCALAPPDATA 'Android\Sdk\build-tools'
if (Test-Path $btRoot) {
  $bt = Get-ChildItem -Name $btRoot | Where-Object { $_ -eq '33.0.2' } | Select-Object -First 1
  if (-not $bt) {
    Write-Host "WARNING: Android Build-Tools 33.0.2 not found under $btRoot. Open Android Studio SDK Manager and install 33.0.2." -ForegroundColor Yellow
  }
}

Write-Host "=== BACKEND: START (port 3000) ===" -ForegroundColor Green
if (-not (Test-Path $api)) { Fail "Backend repo missing: $api" }

$envFile = Join-Path $api '.env.development.local'
if (-not (Test-Path $envFile)) {
  Touch $envFile
  @(
    'PORT=3000'
    'NODE_ENV=development'
    'LOG_LEVEL=debug'
  ) | Out-File -Encoding ASCII -FilePath $envFile
}

Push-Location $api
try {
  $logPath = Join-Path $api 'local_server.log'
  Write-Host "Starting dev-backend server (logging to $logPath)" -ForegroundColor DarkCyan
  $ps = Start-Process pwsh -ArgumentList "-NoLogo -NoProfile -Command cd `"$api`"; `$env:PORT=3000; `$env:NODE_ENV='development'; node devserver.js *>> `"$logPath`"" -PassThru -WindowStyle Hidden
  Start-Sleep -Seconds 3

  # Health check
  $urls = @(
    'http://localhost:3000/health',
    'http://localhost:3000/api/health',
    'http://localhost:3000/'
  )
  $healthy = $false
  $healthOut = ''
  foreach ($u in $urls) {
    try {
      $resp = Invoke-WebRequest -UseBasicParsing -TimeoutSec 10 -Uri $u
      if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500) { $healthy = $true; $healthOut = "${u} => ${($resp.StatusCode)}"; break }
    } catch { continue }
  }
  if (-not $healthy) {
    Write-Host "Backend health failed. Tail of ${logPath}:" -ForegroundColor Red
    if (Test-Path $logPath) { Get-Content $logPath -Tail 80 | Write-Host }
    Fail "No health endpoint responded at /health or /api/health or /"
  }
  Write-Host "API OK: $healthOut" -ForegroundColor Green

  # Save artifact for reference
  $mobArtifacts = Join-Path $mob 'artifacts'
  if (-not (Test-Path $mobArtifacts)) { New-Item -ItemType Directory -Path $mobArtifacts | Out-Null }
  Touch (Join-Path $mobArtifacts 'backend_health.txt')
  "${healthOut}`n" | Out-File -Encoding ASCII -FilePath (Join-Path $mobArtifacts 'backend_health.txt')
} finally { Pop-Location }

Write-Host "=== MOBILE: ENV (point to 10.0.2.2:3000) ===" -ForegroundColor Green
if (-not (Test-Path $mob)) { Fail "Mobile repo missing: $mob" }

$envSrc = Join-Path $mob '.env'
if (-not (Test-Path $envSrc)) { Fail ".env missing in mobile repo: $envSrc" }

# Create a local debug env file and force Gradle to use it
$envLocal = Join-Path $mob '.env.localdebug'
Touch $envLocal
$envContent = Get-Content $envSrc -Raw
$envContent = $envContent -replace '(?m)^API_BASE_URL\s*=.*$', 'API_BASE_URL=http://10.0.2.2:3000'
if ($envContent -notmatch '(?m)^API_BASE_URL\s*=') { $envContent += "`r`nAPI_BASE_URL=http://10.0.2.2:3000" }
$envContent | Out-File -Encoding ASCII -FilePath $envLocal

Write-Host "=== ANDROID: EMULATOR ===" -ForegroundColor Green
try {
  $avds = & $emulator -list-avds
} catch { Fail "Cannot list AVDs: $_" }
if (-not $avds) { Fail "No AVDs found. Create an API 31+ emulator first." }
# Choose AVD (prefer running, else prefer $env:UPRISE_AVD fuzzy, else first)
function Normalize-AvdName([string]$n) { return ($n -replace '[ _]', '').ToLower() }
if ($preferredAvd) {
  $prefNorm = Normalize-AvdName $preferredAvd
  $chosen = ($avds | Where-Object { Normalize-AvdName $_ -like "*${prefNorm}*" } | Select-Object -First 1)
  if (-not $chosen) { $chosen = $avds | Select-Object -First 1 }
} else {
  $chosen = ($avds | Select-Object -First 1)
}

# Reuse already running emulator if present
$running = (& $adb devices) -split "`r?`n" | Where-Object { $_ -match 'emulator-' } | ForEach-Object { ($_ -split "\s+")[0] } | Where-Object { $_ }
if (-not $running) {
  Write-Host "Using AVD: $chosen"
  Start-Process $emulator -ArgumentList @('-avd', $chosen, '-netdelay', 'none', '-netspeed', 'full') -WindowStyle Minimized | Out-Null
  & $adb wait-for-device
  $boot = & $adb shell getprop sys.boot_completed
  if ($boot.Trim() -ne '1') { Fail "Emulator failed to boot (sys.boot_completed=$boot)" }
}

# Select target device (first running emulator) or env override
function Get-EmulatorIds {
  $raw = & $adb devices
  $lines = $raw -split "`r?`n"
  $ids = @()
  foreach ($ln in $lines) {
    if ($ln -match '^\s*emulator-\d+\s+(device|offline)') {
      $ids += ($ln -split "\s+")[0]
    }
  }
  return $ids
}

$ids = Get-EmulatorIds
if (-not $ids -or $ids.Count -eq 0) { Fail "No running emulator found after boot." }

if ($targetDeviceEnv -and ($ids -contains $targetDeviceEnv)) { $device = $targetDeviceEnv } else { $device = $ids[0] }
Write-Host ("Target device: {0}" -f $device) -ForegroundColor Cyan

function ADB {
  param([Parameter(ValueFromRemainingArguments=$true)]$Args)
  & $adb -s $device @Args
}

Write-Host "=== BUILD + INSTALL DEBUG APK ===" -ForegroundColor Green
Push-Location $mob
try {
  # Ensure env for react-native-config
  $env:ENVFILE = $envLocal
  Run 'yarn install --ignore-scripts --network-timeout 600000' 900
  Push-Location (Join-Path $mob 'android')
  try {
    # Verbose Gradle build with full logs captured
    $gradleLog = Join-Path (Join-Path $mob 'android') 'gradle_build_output.txt'
    if (Test-Path $gradleLog) { Remove-Item $gradleLog -Force -ErrorAction SilentlyContinue }
    Write-Host "> .\\gradlew.bat :app:assembleDebug --stacktrace --no-daemon --warning-mode all" -ForegroundColor Cyan
    & .\gradlew.bat :app:assembleDebug --stacktrace --no-daemon --warning-mode all *>> $gradleLog
    if ($LASTEXITCODE -ne 0) {
      Touch $gradleLog
      Write-Host "Gradle build failed. Tail ($gradleLog):" -ForegroundColor Red
      if (Test-Path $gradleLog) { Get-Content $gradleLog -Tail 160 | Write-Host }
      Fail "Gradle build failed. See $gradleLog"
    }
  } catch {
    $log = Join-Path (Join-Path $mob 'android') 'gradle_build_output.txt'
    Touch $log
    "Build failed at $(Get-Date -Format o)" | Out-File -FilePath $log -Encoding ASCII -Append
    Fail "Gradle build failed. See $log"
  } finally { Pop-Location }

  $apk = Join-Path $mob 'android\app\build\outputs\apk\debug\app-debug.apk'
  if (-not (Test-Path $apk)) { Fail "APK not found: $apk" }

  # Ensure a clean install (clear old app data)
  try { ADB uninstall com.app.uprise.debug | Out-Null } catch {}
  try { ADB uninstall com.app.uprise | Out-Null } catch {}
  ADB install -r $apk | Write-Host

  # Derive package name from aapt if possible; fallback to known debug id
  $pkg = 'com.app.uprise.debug'
  $aapt = Join-Path $env:LOCALAPPDATA 'Android\Sdk\build-tools\31.0.0\aapt.exe'
  if (Test-Path $aapt) {
    try {
      $badge = & $aapt dump badging $apk 2>$null
      $m = [regex]::Match($badge, "package: name='([^']+)'")
      if ($m.Success) { $pkg = $m.Groups[1].Value }
    } catch { }
  }
  # Launch app explicitly with device targeting (avoid function param parsing issues)
  & $adb -s $device shell monkey -p $pkg -c android.intent.category.LAUNCHER 1 | Write-Host
} finally { Pop-Location }

Write-Host "=== VERIFY BACKEND CONNECTIVITY (logcat 20s) ===" -ForegroundColor Green
$mobArtifacts = Join-Path $mob 'artifacts'
if (-not (Test-Path $mobArtifacts)) { New-Item -ItemType Directory -Path $mobArtifacts | Out-Null }
$logcatOut = Join-Path $mobArtifacts 'logcat_backend.txt'
Touch $logcatOut
$scriptBlock = {
  param($adbPath, $outPath)
  & $adbPath logcat -v time *:W ReactNative:V ReactNativeJS:V |
    Select-String -Pattern 'http|/health|/auth|BASE_URL|API_BASE_URL' -SimpleMatch |
    ForEach-Object { $_.Line } | Out-File -Encoding ASCII -FilePath $outPath
}
$job = Start-Job -ScriptBlock $scriptBlock -ArgumentList $adb, $logcatOut
Wait-Job $job -Timeout 20 | Out-Null
Stop-Job $job -ErrorAction SilentlyContinue | Out-Null
Receive-Job $job -ErrorAction SilentlyContinue | Out-Null
Remove-Job $job -Force -ErrorAction SilentlyContinue | Out-Null

Write-Host "=== SUMMARY ===" -ForegroundColor Green
Write-Host "API health: $healthOut"
Write-Host "Emulator: $chosen"
Write-Host "APK: $apk"
Write-Host "Logcat: $logcatOut"

Write-Host "Done." -ForegroundColor Green
