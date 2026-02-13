# Troubleshooting

## 🚨 CRITICAL: Jest Process Explosion
**DO NOT RUN JEST** - Jest is temporarily disabled due to infinite process spawning:

- **Symptom**: 20+ jest-worker processes consuming system resources
- **Cause**: NVM4W configuration conflicts with Jest parallel workers
- **Status**: Jest disabled (`jest.config.js` → `jest.config.js.disabled`)
- **Action**: Avoid `npm test`, `jest`, or any test commands
- **Workaround**: Use manual testing only
- **Metro Fix**: `$env:NODE_OPTIONS="--openssl-legacy-provider"; npx react-native start --reset-cache`

## Common Issues
- Native modules → reinstall in WSL
- Postgres/PostGIS checks
- CI emulator stalls: resource tuning, AVD existence, logs
- **Process explosion**: Kill all Node processes if needed: `Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force`
