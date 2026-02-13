# UPRISE – Launch Debug App (Ordered)
# Starts Metro, configures adb reverse, ensures backend + emulator, builds, installs, and launches the app.

param(
  [string]$MobRoot = 'D:\uprise_mob',
  [string]$BackendRoot = 'D:\uprise_mob\dev-backend',
  [string]$AvdName = $env:UPRISE_AVD,
  [switch]$NoBackend
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function Info($m) { Write-Host $m -ForegroundColor Green }
function Note($m) { Write-Host $m -ForegroundColor Cyan }
function Warn($m) { Write-Host $m -ForegroundColor Yellow }
function Fail($m) { Write-Host "ERROR: $m" -ForegroundColor Red; exit 1 }

function RunBg($cmd, $workdir) {
  Note "> $cmd"
  Start-Process pwsh -ArgumentList "-NoLogo -NoProfile -Command cd `"$workdir`"; $cmd" -WindowStyle Hidden | Out-Null
}

function Wait-Port($targetHost, $port, $timeoutSec=60) {
  $sw = [Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt $timeoutSec) {
    try {
      $tcp = New-Object Net.Sockets.TcpClient
      $iar = $tcp.BeginConnect($targetHost, $port, $null, $null)
      if ($iar.AsyncWaitHandle.WaitOne(1000, $false) -and $tcp.Connected) { $tcp.Close(); return $true }
      $tcp.Close()
    } catch { Start-Sleep -Milliseconds 500 }
  }
  return $false
}

# Resolve tools
$adb = Join-Path $env:LOCALAPPDATA 'Android\Sdk\platform-tools\adb.exe'
$emulator = Join-Path $env:LOCALAPPDATA 'Android\Sdk\emulator\emulator.exe'

function Free-Port([int]$port){
  $pids = @()
  try {
    $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction Stop
    if ($conns) { $pids = $conns | Select-Object -ExpandProperty OwningProcess }
  } catch { $pids = @() }
  foreach($pid in ($pids | Sort-Object -Unique)){
    try { Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue } catch {}
    try { $proc = Get-CimInstance Win32_Process -Filter "ProcessId=$pid"; if($proc){ Invoke-CimMethod -InputObject $proc -MethodName Terminate | Out-Null } } catch {}
  }
}

Info "[0/6] Ensure Metro port free (8081)"
Free-Port 8081

Info "[1/6] Start Metro bundler (port 8081)"
if (-not (Wait-Port '127.0.0.1' 8081 1)) {
  if (-not (Test-Path $MobRoot)) { Fail "Mobile root not found: $MobRoot" }
  RunBg 'yarn start --reset-cache' $MobRoot
  if (-not (Wait-Port '127.0.0.1' 8081 45)) { Warn 'Metro did not open 8081 within 45s; continuing (app may connect on launch).'}
} else { Note 'Metro already listening on 8081' }

Info "[2/6] adb reverse tcp:8081 tcp:8081"
try { & $adb reverse tcp:8081 tcp:8081 | Out-Null } catch { Warn "adb reverse failed (device may not be up yet): $_" }

Info "[3/6] Backend server"
if ($NoBackend) {
  Note 'Skipping backend startup per --NoBackend'
} else {
  if (-not (Test-Path $BackendRoot)) { Warn "Backend not found: $BackendRoot (skipping)" }
  else {
    # Start backend if not healthy
    $healthy = $false
    foreach ($u in @('http://localhost:3000/health','http://localhost:3000/api/health')) {
      try { $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 -Uri $u; if ($r.StatusCode -ge 200) { $healthy = $true; break } } catch { }
    }
    if (-not $healthy) {
      Note 'Starting backend dev server on :3000'
      RunBg 'node devserver.js *>> local_server.log' $BackendRoot
      Start-Sleep -Seconds 3
    } else { Note 'Backend already healthy' }
  }
}

Info "[4/6] Emulator + Build + Install + Launch"
# Delegate to the existing orchestrator which handles emulator selection and Gradle build
$orchestrator = Join-Path $MobRoot 'docs\scripts\windows\local_backend_emulator_debug.ps1'
if (-not (Test-Path $orchestrator)) { Fail "Missing orchestrator: $orchestrator" }
# Pass through preferred AVD via env
if ($AvdName) { $env:UPRISE_AVD = $AvdName }
& pwsh -NoLogo -NoProfile -File $orchestrator

Info "[5/6] Verify Metro connectivity (brief logcat)"
try {
  $ids = (& $adb devices) -split "`r?`n" | Where-Object { $_ -match 'emulator-' } | ForEach-Object { ($_ -split "\s+")[0] } | Where-Object { $_ }
  if ($ids.Count -gt 0) {
    & $adb -s $ids[0] logcat -d -v brief | Select-String -Pattern 'Connecting to Metro|DevServerHelper' -SimpleMatch | Select-Object -First 10 | ForEach-Object { $_.Line } | Write-Host
  }
} catch { }

Info "[6/6] Finalize: re-apply adb reverse and finish"
try { & $adb reverse tcp:8081 tcp:8081 | Out-Null } catch {}
Info 'Done. App launched (Debug).'
