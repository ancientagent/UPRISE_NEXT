# Player Layout Reset Handoff (Deterministic Restart)

Date: 2026-03-02  
Branch: `ux-spec-lock`  
HEAD: `f537e7a`

## Current Working Scope
- `apps/web/src/components/plot/RadiyoPlayerPanel.tsx` (modified)
- `apps/web/src/app/plot/page.tsx` (modified)

## Legacy References (read-only)
- `docs/legacy/uprise_mob_code/src/screens/CommonProfile/CommonProfile.js`
- `docs/legacy/uprise_mob_code/src/screens/radioScreen/radioScreen.js`

## Why This Handoff Exists
This session had repeated layout interpretation drift. The next session must run a deterministic, locked execution path with one batch of changes, one verification pass, and one snapshot check.

## Locked Requirements (Non-Negotiable)
1. Player height must be reduced, never increased.
2. Top row must be horizontal: Uprise title on the left, switch on the right.
3. Right-side tier stack remains: national, state, city.
4. Bottom control row keeps mode button next to city button.
5. Swapped function mapping remains as directed in-thread:
   - Top switch = rotation mode (`new_releases` / `main_rotation`)
   - Bottom button = player mode (`RADIYO` / `Collection`)

## Execution Rules For Next Session
1. Read AGENTS.md required docs first.
2. Edit only:
   - `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
   - `apps/web/src/app/plot/page.tsx`
3. Do not redesign or introduce new controls.
4. Make one focused change batch only.
5. Run exactly:
   - `pnpm --filter web typecheck`
6. Validate with one MCP snapshot and report exact rendered control order.
7. Stop and wait for approval before additional edits.

## Copy/Paste Bootstrap Prompt (Next Chat)
```text
Use AGENTS.md required reading first. Work only in:
- apps/web/src/components/plot/RadiyoPlayerPanel.tsx
- apps/web/src/app/plot/page.tsx

Goal: deterministic, legacy-faithful player layout lock. No redesign.

Locked requirements:
1) Top row is one horizontal line: title left, switch right.
2) Player must be shorter than current; any height increase is a failure.
3) Right tier stack remains national/state/city.
4) Bottom row keeps mode button next to city button.
5) Keep swapped functions already requested:
   - top switch controls new/current rotation
   - bottom button controls RADIYO/Collection mode

Process:
- Make one change batch only.
- Run: pnpm --filter web typecheck
- Take MCP snapshot and report exact resulting control order.
- Stop and wait for approval.
```

## Optional Local Safety Step Before New Chat
If you want a quick rollback anchor for just these two files:
```bash
git diff -- apps/web/src/components/plot/RadiyoPlayerPanel.tsx apps/web/src/app/plot/page.tsx > /tmp/player-wip.patch
```
