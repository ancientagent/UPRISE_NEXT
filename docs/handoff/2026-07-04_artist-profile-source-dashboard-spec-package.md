# Artist Profile / Source Dashboard Spec Package

Date: 2026-07-04
Branch: `docs/artist-profile-source-dashboard-specs`
Base: `main` at `414f1a0`
Status: docs-only spec-package gate complete

## Summary

Advanced the Artist Profile / Source Dashboard screen package through three package gates:

- Dev Spec gate: `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md`
- Design Spec gate: `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md`
- Spec Package Review gate: `docs/screen-packages/artist-profile-source-dashboard/review/spec-package-review.md`

The spec-package reviewer returned `Decision: pass`, so the package is approved to move to implementation planning. No runtime code, provider state, DB/schema/migrations, or art assets were changed.

After the initial package review, two separate `gpt-5.5` / `reasoning_effort=xhigh` reviewers were run:

- Dev Spec xhigh review: `docs/screen-packages/artist-profile-source-dashboard/review/dev-spec-xhigh-review.md`
- Design Spec xhigh review: `docs/screen-packages/artist-profile-source-dashboard/review/design-spec-xhigh-review.md`

Both xhigh reviews returned `Decision: pass`.

## Files Changed

- `docs/screen-packages/artist-profile-source-dashboard/README.md`
- `docs/screen-packages/artist-profile-source-dashboard/instruction-packet.md`
- `docs/screen-packages/artist-profile-source-dashboard/source-map.md`
- `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md`
- `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md`
- `docs/screen-packages/artist-profile-source-dashboard/review/spec-package-review.md`
- `docs/screen-packages/artist-profile-source-dashboard/review/dev-spec-xhigh-review.md`
- `docs/screen-packages/artist-profile-source-dashboard/review/design-spec-xhigh-review.md`
- `docs/operations/ACTIVE_PM.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-07-04_artist-profile-source-dashboard-spec-package.md`

## Package Conclusions

- Artist Profile is public/listener-facing and supports source identity, official links, direct-listen rows, source-owned events, `Follow`, share/copy, row-level `Collect`, and gated row-level `Recommend`.
- Source Dashboard is source-owner/member tooling and must stay separate from listener profile and public Artist Profile.
- Registrar remains Home Scene/GPS-bound civic/source lifecycle infrastructure; source context is informational and routing-supportive, not source-owned authority.
- Release Deck remains source-admin URL-only MVP release tooling with three active music slots, six-minute per-song cap, fifteen-minute per-source active cap, and no active fourth music slot.
- Listener-to-artist DMs, Artist Profile `Blast`, engagement wheel, source-level UPRISE `Support`, analytics/billing/growth/upgrade cards, source posts/messages, and fake placeholder modules remain out of scope.
- Product Design / Creative / Art may define hierarchy, states, visual direction, accessibility, responsive behavior, and asset needs only. They must not invent actions, data contracts, auth rules, navigation, source ownership, Registrar rules, Release Deck limits, or product doctrine.

## Review Result

`docs/screen-packages/artist-profile-source-dashboard/review/spec-package-review.md` records:

- `Decision: pass`
- No blocking required fixes before implementation planning.
- Follow-up: implementation planning should include behavior-level rendered/integration tests because current web locks are mostly file-content/route-contract guards.
- Follow-up: if Print Shop runtime is touched, expand evidence to `apps/web/src/app/print-shop/page.tsx`, `apps/api/src/events/print-shop.controller.ts`, and `docs/specs/economy/print-shop-and-promotions.md` before edits.

The separate xhigh reviews record:

- Dev Spec: no blocker/high/medium findings; safe to merge as a planning artifact.
- Design Spec: no blocker/high/medium/low findings; safe to merge as a planning artifact.
- Shared implementation follow-up: future implementation must add behavior-level rendered/integration tests and avoid implying shared `RADIYO` mutation from Artist Profile direct-listen rows unless a future spec/test explicitly authorizes it.

## Cleanup Included

The package seed originally referenced missing test path `apps/api/test/registrar.artist.service.test.ts`. This branch corrected the package packet/source map to use:

- `apps/api/test/registrar.controller.test.ts`
- `apps/api/test/registrar.service.test.ts`

The Dev Spec and review now warn not to reintroduce the missing historical path unless a future slice intentionally creates it.

## Validation

Run on this branch:

```bash
pnpm run screen-package:flow -- status --package artist-profile-source-dashboard
pnpm run docs:lint
git diff --check
pnpm run workspace:audit
```

Results:

- Screen-package runner passed and reports the next signal as `implementation_plan`.
- Docs lint passed.
- Whitespace check passed.
- Workspace registry audit passed.

## Next Gate

After this branch merges, run:

```bash
pnpm run screen-package:flow -- status --package artist-profile-source-dashboard
pnpm run screen-package:flow -- next --package artist-profile-source-dashboard
```

Next required artifacts:

- `docs/screen-packages/artist-profile-source-dashboard/implementation/implementation-plan.md`
- `docs/screen-packages/artist-profile-source-dashboard/implementation/file-ownership.md`

Implementation should not start until those files exist and reflect the passed Dev Spec, Design Spec, and spec-package review.
