# Reliant Workflow Pilot (UPRISE_NEXT)

## Purpose
Provide a repo-local Reliant workflow that executes one UPRISE slice with guardrails:
plan -> implement -> verify -> review.

## Files
- `.reliant/workflows/uprise-slice-loop.yaml`
- `.reliant/presets/uprise_executor.yaml`

## What This Pilot Covers
- Scope lock per slice
- Canon/spec-first implementation behavior
- Required validation gate execution
- Final risk-focused review step

## What This Pilot Does Not Cover
- Cross-slice queue orchestration
- Telegram/bridge automation
- CI-driven autonomous retries

## Run Steps (Reliant UI)
1. Open `UPRISE_NEXT` as project.
2. Configure provider API key in Reliant settings.
3. Select workflow `uprise-slice-loop`.
4. Use preset `uprise-executor`.
5. Set model and keep default `verify_command` unless slice-specific tests are needed.
6. Start with a single slice task prompt.

## Verification Contract
Default verify command:
`pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

For slice-specific work, append targeted tests, for example:
`pnpm --filter api test -- registrar.service.test.ts`

## Operator Notes
- Keep one workflow run per slice for clean auditability.
- Do not bypass failed verify step.
- Export or copy final review into `docs/handoff/` when work is merged.
