# Metro bundler startup script using direct Node.js path to bypass NVM conflicts
# This avoids the jest-worker process explosion caused by NVM path resolution issues

Write-Host "Starting Metro with direct Node.js path (bypassing NVM conflicts)..." -ForegroundColor Green

# Use direct Node.js path instead of NVM
$nodePath = "C:\tools\node-v20.19.0-win-x64\node.exe"

# Set OpenSSL legacy provider
$env:NODE_OPTIONS = "--openssl-legacy-provider"

# Clear Metro cache
Write-Host "Clearing Metro cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:TEMP\metro-*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:TEMP\haste-*" -Recurse -Force -ErrorAction SilentlyContinue

# Kill any existing Metro processes
Get-Process | Where-Object {$_.ProcessName -like "*node*" -and $_.CommandLine -like "*metro*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Start Metro using direct Node.js path
Write-Host "Starting Metro bundler..." -ForegroundColor Green
& $nodePath "node_modules\.bin\react-native" start --reset-cache



