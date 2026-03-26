param(
  [int]$Port = 9222,
  [string]$UserDataDir = "$env:LOCALAPPDATA\ChromeMCP",
  [switch]$NewWindow
)

$chromeCandidates = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe"
)

$chromePath = $chromeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chromePath) {
  Write-Error "Google Chrome executable not found in standard install paths."
  exit 1
}

New-Item -ItemType Directory -Force -Path $UserDataDir | Out-Null

$args = @(
  "--remote-debugging-address=127.0.0.1",
  "--remote-debugging-port=$Port",
  "--user-data-dir=$UserDataDir",
  "--no-first-run",
  "--no-default-browser-check"
)

if ($NewWindow) {
  $args += "--new-window"
}

Start-Process -FilePath $chromePath -ArgumentList $args | Out-Null
Write-Output "Launched Chrome MCP browser"
Write-Output "Chrome: $chromePath"
Write-Output "Port:   $Port"
Write-Output "Profile:$UserDataDir"
