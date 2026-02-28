# 2026-02-28 — MVP Hard Roadmap Execution Plan

## Scope
- Produce one execution-grade roadmap for remaining MVP delivery that is strictly spec/canon anchored.
- Keep this as an operational plan (not product semantics).
- Add discoverability via docs index and changelog.

## Files Updated
- `docs/solutions/MVP_HARD_ROADMAP_EXECUTION_PLAN.md` (new)
- `docs/solutions/README.md`
- `docs/CHANGELOG.md`

## Baseline Evidence Used
- Required governance docs in AGENTS order:
  - `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`
  - `docs/RUNBOOK.md`
  - `docs/FEATURE_DRIFT_GUARDRAILS.md`
  - `docs/architecture/UPRISE_OVERVIEW.md`
  - `docs/PROJECT_STRUCTURE.md`
  - `apps/web/WEB_TIER_BOUNDARY.md`
  - `docs/AGENT_STRATEGY_AND_HANDOFF.md`
  - `docs/README.md`
  - `docs/solutions/README.md`
- Program/spec context:
  - `docs/specs/system/registrar.md`
  - `docs/specs/README.md`
  - `docs/SPRINT_0_PLAN.md`
  - `docs/SPRINT_1_PLAN.md`

## Commands Run
```bash
pwd && git status --short --branch
rg --files docs | rg -i 'mvp|roadmap|sprint|phase|registrar|batch|throughput|runbook' | head -n 200
sed -n '1,220p' docs/STRATEGY_CRITICAL_INFRA_NOTE.md
sed -n '1,220p' docs/RUNBOOK.md
sed -n '1,220p' docs/FEATURE_DRIFT_GUARDRAILS.md
sed -n '1,240p' docs/architecture/UPRISE_OVERVIEW.md
sed -n '1,240p' docs/PROJECT_STRUCTURE.md
sed -n '1,240p' apps/web/WEB_TIER_BOUNDARY.md
sed -n '1,260p' docs/AGENT_STRATEGY_AND_HANDOFF.md
sed -n '1,260p' docs/README.md
sed -n '1,260p' docs/solutions/README.md
sed -n '1,260p' docs/SPRINT_1_PLAN.md
sed -n '1,260p' docs/SPRINT_0_PLAN.md
sed -n '1,320p' docs/specs/system/registrar.md
ls -1 .reliant/queue | sed -n '1,260p'
node - <<'NODE'
const fs=require('fs');const path='.reliant/queue';
for (const f of fs.readdirSync(path).filter(x=>x.endsWith('.json')).sort()) {
  const q=JSON.parse(fs.readFileSync(`${path}/${f}`,'utf8'));
  const tasks=q.tasks||[];
  const s={total:tasks.length,queued:tasks.filter(t=>t.status==='queued').length,in_progress:tasks.filter(t=>t.status==='in_progress').length,done:tasks.filter(t=>t.status==='done').length,blocked:tasks.filter(t=>t.status==='blocked').length};
  if(s.queued||s.in_progress) console.log(`${f} total=${s.total} queued=${s.queued} in_progress=${s.in_progress} done=${s.done} blocked=${s.blocked}`);
}
NODE
node - <<'NODE'
const fs=require('fs');const dir='.reliant/queue';
const files=fs.readdirSync(dir).filter(f=>f.startsWith('mvp-lane-')&&f.endsWith('.json'));
let total=0,done=0,queued=0,ip=0,blocked=0;
for(const f of files){const q=JSON.parse(fs.readFileSync(`${dir}/${f}`,'utf8'));for(const t of q.tasks||[]){total++;if(t.status==='done')done++;if(t.status==='queued')queued++;if(t.status==='in_progress')ip++;if(t.status==='blocked')blocked++;}}
console.log(JSON.stringify({laneQueueFiles:files.length,totalTasks:total,done,queued,in_progress:ip,blocked,percentDone: total?((done/total)*100).toFixed(1):'0.0'},null,2));
NODE
```

## Outcomes
- Added a hard, phased roadmap (`R1`-`R5`) for remaining MVP delivery with explicit spec anchors.
- Added mandatory ambiguity stop-and-ask triggers to prevent non-canon assumption drift.
- Added lane throughput cadence and verification standards for consistent multi-agent execution.
- Indexed roadmap in solutions docs and changelog.

## Validation
- Documentation-only change; no code/runtime behavior changed.
- Did not run full docs lint in this handoff step; should be run before commit:
  - `pnpm run docs:lint`
