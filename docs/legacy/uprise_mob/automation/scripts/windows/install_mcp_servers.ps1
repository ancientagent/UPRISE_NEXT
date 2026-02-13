# UPRISE Phase 2: Install MCP servers for Cursor (Windows/PowerShell)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function Write-Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Ok($msg) { Write-Host $msg -ForegroundColor Green }
function Warn($msg) { Write-Host $msg -ForegroundColor Yellow }
function Fail($msg) { Write-Host "ERROR: $msg" -ForegroundColor Red; exit 1 }

Write-Step "Detect Python"
try {
  $py = (Get-Command py -ErrorAction SilentlyContinue)
  $python = (Get-Command python -ErrorAction SilentlyContinue)
  if (-not $py -and -not $python) { Warn "Python launcher not found. Ensure Python 3.10+ is installed from python.org or Microsoft Store." }
} catch {}

Write-Step "Install/upgrade pipx"
try {
  if (Get-Command pipx -ErrorAction SilentlyContinue) {
    pipx upgrade pipx | Out-Null
  } else {
    if ($py) { & py -m pip install --user -U pipx } elseif ($python) { & python -m pip install --user -U pipx } else { Fail "Python not found; install Python 3.10+ first." }
    & "$env:USERPROFILE\AppData\Roaming\Python\Python*\Scripts\pipx.exe" --version 2>$null | Out-Null
  }
} catch { Warn "pipx install message: $_" }

Write-Step "Ensure pipx PATH"
try { pipx ensurepath | Out-Null } catch { Warn "pipx ensurepath: $_" }

Write-Step "Install MCP servers (filesystem, shell)"
try { pipx install mcp-server-filesystem | Out-Null } catch { Warn "filesystem server: $_" }
try { pipx install mcp-server-shell | Out-Null } catch { Warn "shell server: $_" }

Ok "MCP servers installed (or already present)."
Write-Step "Create .cursor/mcp.json (repo config)"
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent | Split-Path -Parent
$cursorDir = Join-Path $repoRoot ".cursor"
if (-not (Test-Path $cursorDir)) { New-Item -ItemType Directory -Path $cursorDir | Out-Null }
$jsonPath = Join-Path $cursorDir "mcp.json"
$json = @'
{
  "mcpServers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["--root", "${workspaceRoot}"]
    },
    "shell": {
      "command": "mcp-server-shell",
      "args": ["--shell", "powershell"]
    }
  }
}
'@
Set-Content -Encoding UTF8 -Path $jsonPath -Value $json

Ok ("Wrote config: {0}" -f $jsonPath)
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "  1) Close and reopen Cursor (so PATH updates)." -ForegroundColor Green
Write-Host "  2) In Cursor: Settings → Tools/MCP → Add from repo config (.cursor/mcp.json)." -ForegroundColor Green
Write-Host "  3) Enable 'filesystem' and 'shell' servers; test by asking the agent to list files or run a simple dir." -ForegroundColor Green
