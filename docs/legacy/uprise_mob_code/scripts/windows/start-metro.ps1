$ErrorActionPreference = "SilentlyContinue"

$Root = "D:\uprise_mob"
$Artifacts = Join-Path $Root 'artifacts'
New-Item -ItemType Directory -Force -Path $Artifacts | Out-Null

# Prefer portable Node bundled under artifacts if present
$nodeDir = Join-Path $Artifacts 'node-v20.18.1-win-x64'
if (Test-Path $nodeDir) { $env:PATH = "$nodeDir;$env:PATH" }

# OpenSSL legacy provider for Metro under Node 17+
$env:NODE_OPTIONS = '--openssl-legacy-provider'

# Kill existing Metro by PID (if any)
$pidFile = Join-Path $Artifacts 'metro.pid'
if (Test-Path $pidFile) {
  try {
    $oldPid = [int](Get-Content $pidFile -Raw)
    if ($oldPid -gt 0) { Stop-Process -Id $oldPid -Force -ErrorAction SilentlyContinue }
  } catch {}
}

$rnCli = Join-Path $Root 'node_modules\react-native\cli.js'
$stdout = Join-Path $Artifacts 'metro_stdout.log'
$stderr = Join-Path $Artifacts 'metro_stderr.log'

if (Test-Path $rnCli) {
  $p = Start-Process -FilePath node -ArgumentList "`"$rnCli`" start --port 8081" -WorkingDirectory $Root -WindowStyle Hidden -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr
  if ($p) { $p.Id | Out-File -Encoding ascii $pidFile }
}

# Poll /status briefly and write health
$ok = $false
for ($i=0; $i -lt 10; $i++) {
  try {
    $resp = Invoke-WebRequest -UseBasicParsing 'http://localhost:8081/status' -TimeoutSec 1
    if ($resp.StatusCode -eq 200) { $ok = $true; break }
  } catch {}
  Start-Sleep 1
}
("metro_status: " + ($(if ($ok) { 'ok' } else { 'down' }))) | Out-File -Encoding utf8 (Join-Path $Artifacts 'metro_health.txt')


