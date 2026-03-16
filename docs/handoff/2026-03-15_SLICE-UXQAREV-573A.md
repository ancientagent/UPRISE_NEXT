# SLICE-UXQAREV-573A

Date: 2026-03-15
Lane: E - QA/Docs/Closeout
Task: Batch16 risk/rollback memo

## Scope
- Produced a severity-ordered UX risk memo for current Batch16 surfaces.
- Included residual risk and deterministic rollback notes only.
- No product behavior changed in this slice.

## Severity-Ordered Risks

### 1. Critical: `/plot` still exposes Social even though MVP lock defers it
- Lock evidence:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md:98-99`
  - `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md:110-117`
- Implementation evidence:
  - `apps/web/src/app/plot/page.tsx:44`
  - `apps/web/src/app/plot/page.tsx:441`
  - `apps/web/src/app/plot/page.tsx:485-488`
- Residual risk:
  - Founder/demo review can interpret Social as approved MVP scope.
  - A later docs-only pass cannot reconcile the lock while this code remains live.
- Deterministic rollback note:
  - Preferred: non-destructive fix PR removing `Social` from the `tabs` array and its fallback render branch in `apps/web/src/app/plot/page.tsx`.
  - If broader rollback is required, compare against `checkpoint-2026-02-28-code` first and use `git revert` on the commit(s) that introduced the Social tab path; do not use `git reset --hard` without explicit approval.

### 2. High: active-tier tap does not implement the locked stop behavior
- Lock evidence:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md:71-74`
- Implementation evidence:
  - `apps/web/src/components/plot/RadiyoPlayerPanel.tsx:126-130`
  - `apps/web/src/app/plot/page.tsx:274-280`
- Residual risk:
  - User-facing behavior diverges from the approved player contract even though tier labels render correctly.
  - Current tests only lock title parity, not stop-on-active-tier behavior.
- Deterministic rollback note:
  - Revert or patch only the tier interaction path by replacing `onTierChange={setSelectedTier}` with a dedicated handler in `apps/web/src/app/plot/page.tsx` that supports active-tier stop semantics.
  - If the behavior cannot be finished safely, freeze further player-interaction changes until a targeted lock test is added.

### 3. High: collapsed profile strip includes unauthorized MVP elements
- Lock evidence:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md:52-56`
  - `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md:38-43`
- Implementation evidence:
  - `apps/web/src/app/plot/page.tsx:228-247`
- Residual risk:
  - The collapsed strip currently shows an avatar-style initial badge and panel-state badge in addition to the approved username, notifications icon, and `...` menu.
  - This widens the MVP surface and weakens the top-strip lock.
- Deterministic rollback note:
  - Remove the avatar badge block and `profilePanelState` status pill from the collapsed strip in `apps/web/src/app/plot/page.tsx`, preserving only username, notifications, and more-menu controls.
  - Keep seam interaction logic intact; rollback is visual-surface-only.

### 4. High: expanded profile composition is still a preview scaffold, not the locked workspace
- Lock evidence:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md:58-61`
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md:108-118`
- Implementation evidence:
  - `apps/web/src/app/plot/page.tsx:291-399`
- Residual risk:
  - Expanded profile lacks the locked identity summary/activity score and the six-section collection workspace order.
  - Current body uses lightweight preview shelves (`Tracks`, `Playlists`, `Saved`) plus utility actions, which is materially different from the approved MVP composition.
- Deterministic rollback note:
  - Do not broaden this scaffold further without first aligning to the locked section order.
  - If rollback is needed, constrain future edits to `apps/web/src/app/plot/page.tsx` and revert only the expanded-profile scaffold blocks rather than the full `/plot` route.

### 5. Medium: current regression locks do not cover the highest-risk UX drift points
- Evidence:
  - `apps/web/__tests__/plot-ux-regression-lock.test.ts:10-71`
- Residual risk:
  - The targeted gate replays pass while Social visibility, collapsed-strip scope, expanded-profile section order, and active-tier stop semantics remain unguarded.
  - Batch16 can appear "green" in CI while still violating the UX master lock.
- Deterministic rollback note:
  - Before additional `/plot` UX work, add source-level or behavioral assertions for:
    - no Social tab in MVP,
    - collapsed strip element scope,
    - expanded profile workspace order,
    - active-tier stop semantics.
  - This is the lowest-risk prevention step because it does not require broader route rollback.

## Rollback Protocol
- Follow `docs/solutions/ROLLBACK_CHECKPOINT_CHEATSHEET.md`.
- Compare first:
  - `git diff --stat checkpoint-2026-02-28-code..HEAD`
  - `git diff --stat checkpoint-2026-02-28-full..HEAD`
- Prefer non-destructive rollback:
  - `git switch -c rollback/code checkpoint-2026-02-28-code`
  - or `git revert --no-edit checkpoint-2026-02-28-full..HEAD`
- Record any actual rollback in `docs/CHANGELOG.md` and a dated `docs/handoff/` note.

## Current Recommendation
- Treat `SLICE-UXQAREV-572A` as the gating signal: docs/spec consistency cannot be declared complete until the Social-tab conflict is resolved.
- Prioritize lock-alignment fixes in `/plot` before any founder signoff walkthrough.

## Verification
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck
```

Result: blocked by current `apps/web/src/app/plot/page.tsx` typecheck regression unrelated to this docs-only slice.

Exact failure excerpt:
```text
> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

src/app/plot/page.tsx(329,18): error TS2304: Cannot find name 'collectionShelves'.
src/app/plot/page.tsx(329,41): error TS7006: Parameter 'shelf' implicitly has an 'any' type.
src/app/plot/page.tsx(333,30): error TS2304: Cannot find name 'activeCollectionShelf'.
src/app/plot/page.tsx(334,32): error TS2304: Cannot find name 'activeCollectionShelf'.
src/app/plot/page.tsx(335,36): error TS2304: Cannot find name 'setActiveCollectionShelf'.
src/app/plot/page.tsx(342,64): error TS2304: Cannot find name 'activeCollectionShelf'.
src/app/plot/page.tsx(347,20): error TS2304: Cannot find name 'collectionPreviewItems'.
src/app/plot/page.tsx(347,43): error TS2304: Cannot find name 'activeCollectionShelf'.
src/app/plot/page.tsx(347,71): error TS7006: Parameter 'item' implicitly has an 'any' type.
```
