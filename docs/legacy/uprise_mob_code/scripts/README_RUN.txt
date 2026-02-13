UPRISE Android — Windows PowerShell 7 Workflow

REQUIREMENTS:
- PowerShell 7+ (pwsh.exe) - NOT Windows PowerShell 5.1
- Android SDK with emulator and platform-tools
- Node.js and Yarn installed

QUICK START:
1) Open PowerShell 7:
   pwsh

2) Set execution policy (one-time):
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

3) Navigate to scripts:
   Set-Location D:\uprise_mob\scripts

4) Boot emulator:
   .\boot_emulator.ps1 -AvdName "Pixel_6_API_31"

5) Start Metro bundler:
   ..\scripts\windows\start-metro.ps1

6) Start dev backend stub (WSL):
   From Ubuntu/WSL: ./scripts/wsl/bootstrap_title_flow.sh

7) Build, install, launch, verify:
   .\build_install_verify.ps1 -AppId "com.app.uprise.debug" -HealthPath "/health"

FEATURES:
- Metro bundler auto-starts on port 8081
- ADB reverse setup (8080->8080, 8081->8081)
- 30-second logcat capture with HTTP filtering
- Environment file management (.env.development)
- JSON summary output with Metro status

ARTIFACTS:
  D:\uprise_mob\artifacts\backend_health_win.txt
  D:\uprise_mob\artifacts\yarn_install.log
  D:\uprise_mob\artifacts\gradle_build.log
  D:\uprise_mob\artifacts\logcat_health.txt

DOCS UPDATED:
  D:\uprise_mob\docs\RUNBOOK_ANDROID.md
  D:\uprise_mob\docs\CHANGELOG.md

VERIFICATION:
- Metro reachable: Test-NetConnection -ComputerName localhost -Port 8081
- Backend health: Invoke-WebRequest http://localhost:8080/health
- App launches and logcat captures HTTP traffic
