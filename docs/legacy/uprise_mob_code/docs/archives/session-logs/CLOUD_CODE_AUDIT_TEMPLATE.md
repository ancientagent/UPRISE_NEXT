# Cloud Code Audit — Sprint 2 Focus

Use this template for a Codex Cloud static audit. Do not modify app code; propose diffs only.

Scope
- Navigation/routing after login (Auth vs Home stacks for `CommunitySetup`), reset helpers.
- Onboarding services (`src/services/onboarding/*`): zip lookup, validate-community, `community_key` propagation, error handling.
- Env/config: emulator base URL (`10.0.2.2`), `react-native-config` usage, secrets hygiene.
- Android/iOS build: SDK/BuildTools targets, `android:exported` on intent components, `react-native-config` linking.
- Network/refresh: 401→refresh→retry interceptor flow.
- Tests/lint: Jest config and quick-win unit targets.

Deliverables
- Create `docs/Session-Logs/CLOUD_CODE_AUDIT_<YYYYMMDD>.md` with:
  - Findings (High/Med/Low) with exact file paths and line references.
  - Minimal proposed diffs (code blocks) per finding.
  - Next-steps checklist with owners.

Guardrails
- No secrets in output. No destructive actions. Keep changes minimal and aligned with docs/PHASE2_EXECUTION_PLAN.md.

Reference
- `docs/PHASE2_EXECUTION_PLAN.md`
- `docs/ops/CI_WORKFLOWS.md`
- `AGENTS.md`

