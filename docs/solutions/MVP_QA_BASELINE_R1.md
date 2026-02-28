# MVP QA Baseline (R1)

Status: Active baseline checklist
Scope: Docs-only QA baseline for repeatable lane closeout hygiene.

## 1. Route Smoke Checklist

Objective: confirm primary web routes for MVP flow shells render and do not crash.

- [ ] `GET /` loads successfully.
- [ ] `GET /plot` loads successfully.
- [ ] `GET /registrar` loads successfully.
- [ ] `GET /onboarding` (or current onboarding entry route) loads successfully.
- [ ] Route-level error boundaries do not trigger for the above paths.
- [ ] No server-only/import boundary violations appear in route logs.

Evidence to capture:
- route path, result (pass/fail), timestamp, and failing stack trace when applicable.

## 2. API Contract Parity Checklist

Objective: confirm implemented API and web typed client contracts remain aligned for registrar-critical flows.

- [ ] Registrar controller/service targeted tests pass.
- [ ] Web registrar client/contract tests pass when included in slice verify command.
- [ ] API typecheck passes.
- [ ] Web typecheck passes.
- [ ] No undocumented endpoint/schema additions were introduced.
- [ ] Spec wording for implemented-now/deferred remains consistent after contract changes.

Evidence to capture:
- exact command output from slice `verifyCommand`.

## 3. Auth Path Sanity Checklist

Objective: ensure protected flows enforce expected auth behavior without silent bypass.

- [ ] Auth-required registrar endpoints are rejected when unauthenticated.
- [ ] Authenticated submitter-only reads/actions remain scoped to owner context.
- [ ] Invite preview/register flows use current auth/token guards as documented.
- [ ] No auth-role semantics were changed without explicit spec authorization.

Evidence to capture:
- test names/fixtures used for auth checks, with pass/fail summary.

## 4. No-Placeholder-Action Audit Checklist

Objective: prevent speculative CTAs or implied unsupported workflows.

- [ ] No newly added UI actions labeled as placeholder/promise-only behavior (`Coming Soon`, `Join`, `Upgrade`, etc.) unless explicitly spec-authorized.
- [ ] New UI actions map to existing implemented API paths and authorized spec text.
- [ ] Deferred capability surfaces are clearly described as deferred in docs (not presented as active UI behavior).

Suggested audit command:
- `rg -n "Coming Soon|Join|Upgrade|Waitlist|Notify Me|Request Access" apps/web docs/specs docs/solutions`

## 5. Minimum R1 Verification Gate

Run exactly:

```bash
pnpm run docs:lint
pnpm run infra-policy-check
pnpm --filter api typecheck
pnpm --filter web typecheck
```

## 6. Founder Decision Required Handling

If a QA failure reveals ambiguity listed in `docs/solutions/MVP_FOUNDER_DECISION_REGISTER_R1.md` or `docs/specs/DECISIONS_REQUIRED.md`:

- mark as `Founder Decision Required`,
- do not infer product semantics,
- block implementation behavior changes until lock is provided.
