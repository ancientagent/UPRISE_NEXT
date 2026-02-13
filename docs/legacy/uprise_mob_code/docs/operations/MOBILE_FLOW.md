# Mobile Flow (Windows/Emulator)

Commands (PowerShell)
- Target emulator (example): ` $env:UPRISE_ADB_DEVICE='emulator-5554' `
- Build + clean‑install + launch: ` yarn mobile:debug `
- If not auto‑opened: ` adb -s $env:UPRISE_ADB_DEVICE shell monkey -p com.app.uprise.debug -c android.intent.category.LAUNCHER 1 `

Login Smoke (post‑login → CommunitySetup)
- Quick verifier: ` .\docs\scripts\windows\smoke_login_verify.ps1 -Device $env:UPRISE_ADB_DEVICE -WaitSeconds 30 `
- PASS criteria: Login 200 observed in logcat AND UI shows 'Community' header (Home Scene Creation)

Handoff
- Notify Codex/WSL: ` yarn handoff:win:done `

