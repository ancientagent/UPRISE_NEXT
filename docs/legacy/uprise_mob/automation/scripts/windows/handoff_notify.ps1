$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

param(
  [Parameter(Mandatory=$true)][string]$To,
  [Parameter(Mandatory=$true)][string]$Msg,
  [string]$Kind = 'done',
  [string]$From = 'mobile-win'
)

$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path))
$handoffDir = Join-Path $root 'docs\handoff'
if (-not (Test-Path $handoffDir)) { New-Item -ItemType Directory -Force -Path $handoffDir | Out-Null }
$events = Join-Path $handoffDir 'events.jsonl'

$ts = [DateTime]::UtcNow.ToString('o')
$payload = @{ from=$From; to=$To; kind=$Kind; msg=$Msg; time=$ts } | ConvertTo-Json -Compress
Add-Content -Encoding UTF8 -Path $events -Value $payload
Write-Host ("Appended event to {0}" -f $events) -ForegroundColor Green

