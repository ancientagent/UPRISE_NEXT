# Metro bundler startup script with OpenSSL legacy provider fix
# This ensures Metro always uses the correct OpenSSL configuration

Write-Host "Starting Metro bundler with OpenSSL legacy provider..." -ForegroundColor Green

# Set OpenSSL legacy provider globally for this session
$env:NODE_OPTIONS = "--openssl-legacy-provider"

# Clear Metro cache to prevent any corruption
Write-Host "Clearing Metro cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:TEMP\metro-*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:TEMP\haste-*" -Recurse -Force -ErrorAction SilentlyContinue

# Start Metro with reset cache
Write-Host "Starting Metro bundler..." -ForegroundColor Green
npx react-native start --reset-cache



