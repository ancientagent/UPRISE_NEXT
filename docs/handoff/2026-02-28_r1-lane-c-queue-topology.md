# R1 Lane C Queue Topology Handoff (2026-02-28)

## Scope
Docs-only R1 topology consolidation planning for Reliant queue files. No destructive actions taken.

## Commands + Exact Outputs

### 1) Queue file inventory
Command:
```bash
rg --files .reliant/queue | sort
```
Output:
```text
.reliant/queue/mvp-lane-a-api-admin-batch11.json
.reliant/queue/mvp-lane-a-api-admin-batch12.json
.reliant/queue/mvp-lane-a-api-admin-batch13.json
.reliant/queue/mvp-lane-a-api-admin-next.json
.reliant/queue/mvp-lane-a-api-admin-reserve.json
.reliant/queue/mvp-lane-a-api-core-backlog.json
.reliant/queue/mvp-lane-a-api-core.json
.reliant/queue/mvp-lane-b-web-admin-next.json
.reliant/queue/mvp-lane-b-web-contract-backlog.json
.reliant/queue/mvp-lane-b-web-contract-batch11.json
.reliant/queue/mvp-lane-b-web-contract-batch12.json
.reliant/queue/mvp-lane-b-web-contract-batch13.json
.reliant/queue/mvp-lane-b-web-contract-reserve.json
.reliant/queue/mvp-lane-b-web-contract.json
.reliant/queue/mvp-lane-c-code-invite-backlog.json
.reliant/queue/mvp-lane-c-code-invite.json
.reliant/queue/mvp-lane-c-invite-batch11.json
.reliant/queue/mvp-lane-c-invite-batch12.json
.reliant/queue/mvp-lane-c-invite-batch13.json
.reliant/queue/mvp-lane-c-invite-next.json
.reliant/queue/mvp-lane-c-invite-reserve.json
.reliant/queue/mvp-lane-d-automation-backlog.json
.reliant/queue/mvp-lane-d-automation-batch11.json
.reliant/queue/mvp-lane-d-automation-batch12.json
.reliant/queue/mvp-lane-d-automation-batch13.json
.reliant/queue/mvp-lane-d-automation-next.json
.reliant/queue/mvp-lane-d-automation-reserve.json
.reliant/queue/mvp-lane-d-automation.json
.reliant/queue/mvp-lane-e-qa-doc-review-backlog.json
.reliant/queue/mvp-lane-e-qa-doc-review.json
.reliant/queue/mvp-lane-e-qarev-batch11.json
.reliant/queue/mvp-lane-e-qarev-batch12.json
.reliant/queue/mvp-lane-e-qarev-batch13.json
.reliant/queue/mvp-lane-e-qarev-next.json
.reliant/queue/mvp-lane-e-qarev-reserve.json
.reliant/queue/mvp-slices-batch10-real-mvp-reserve.json
.reliant/queue/mvp-slices-batch11-real-mvp-throughput.json
.reliant/queue/mvp-slices-batch12-real-mvp-throughput.json
.reliant/queue/mvp-slices-batch13-real-mvp-throughput.json
.reliant/queue/mvp-slices-batch3.json
.reliant/queue/mvp-slices-batch4.json
.reliant/queue/mvp-slices-batch5.json
.reliant/queue/mvp-slices-batch6.json
.reliant/queue/mvp-slices-batch7.json
.reliant/queue/mvp-slices-batch9-real-mvp.json
.reliant/queue/mvp-slices.json
```

### 2) Per-queue status classification snapshot
Command:
```bash
node - <<'NODE'
const fs=require('fs');
const path=require('path');
const dir='.reliant/queue';
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort();
for(const f of files){
  const p=path.join(dir,f);
  let j;
  try{j=JSON.parse(fs.readFileSync(p,'utf8'));}catch(e){console.log(`${f}\tINVALID_JSON\t${e.message}`);continue;}
  const tasks=Array.isArray(j.tasks)?j.tasks:[];
  const c={queued:0,in_progress:0,done:0,blocked:0,other:0};
  for(const t of tasks){
    if(t&&typeof t.status==='string'&&Object.hasOwn(c,t.status)) c[t.status]++; else c.other++;
  }
  const lane=j.lane??'';
  const generatedAt=j.generatedAt??'';
  console.log(`${f}\ttasks=${tasks.length}\tqueued=${c.queued}\tin_progress=${c.in_progress}\tdone=${c.done}\tblocked=${c.blocked}\tother=${c.other}\tlane=${lane}\tgeneratedAt=${generatedAt}`);
}
NODE
```
Output:
```text
mvp-lane-a-api-admin-batch11.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-a-api-admin-batch11	generatedAt=2026-02-27T23:38:08.127Z
mvp-lane-a-api-admin-batch12.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-a-api-admin-batch12	generatedAt=2026-02-28T02:25:50.435Z
mvp-lane-a-api-admin-batch13.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-a-api-admin-batch13	generatedAt=2026-02-28T04:51:29.350Z
mvp-lane-a-api-admin-next.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-a-api-admin-lifecycle	generatedAt=2026-02-27T21:26:08.325Z
mvp-lane-a-api-admin-reserve.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-a-api-admin-reserve	generatedAt=2026-02-27T21:45:34.619Z
mvp-lane-a-api-core-backlog.json	tasks=15	queued=0	in_progress=0	done=15	blocked=0	other=0	lane=lane-a-api-core	generatedAt=2026-02-27T20:50:33.844Z
mvp-lane-a-api-core.json	tasks=10	queued=0	in_progress=0	done=10	blocked=0	other=0	lane=lane-a-api-core	generatedAt=2026-02-26T22:16:45.945Z
mvp-lane-b-web-admin-next.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-b-web-admin-contract	generatedAt=2026-02-27T21:26:08.325Z
mvp-lane-b-web-contract-backlog.json	tasks=15	queued=0	in_progress=0	done=15	blocked=0	other=0	lane=lane-b-web-contract	generatedAt=2026-02-27T20:50:33.844Z
mvp-lane-b-web-contract-batch11.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-b-web-contract-batch11	generatedAt=2026-02-27T23:38:08.127Z
mvp-lane-b-web-contract-batch12.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-b-web-contract-batch12	generatedAt=2026-02-28T02:25:50.435Z
mvp-lane-b-web-contract-batch13.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-b-web-contract-batch13	generatedAt=2026-02-28T04:51:29.350Z
mvp-lane-b-web-contract-reserve.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-b-web-contract-reserve	generatedAt=2026-02-27T21:45:34.619Z
mvp-lane-b-web-contract.json	tasks=7	queued=0	in_progress=0	done=7	blocked=0	other=0	lane=lane-b-web-contract	generatedAt=2026-02-26T22:16:45.947Z
mvp-lane-c-code-invite-backlog.json	tasks=15	queued=0	in_progress=0	done=15	blocked=0	other=0	lane=lane-c-code-invite	generatedAt=2026-02-27T20:50:33.844Z
mvp-lane-c-code-invite.json	tasks=5	queued=0	in_progress=0	done=5	blocked=0	other=0	lane=lane-c-code-invite	generatedAt=2026-02-26T22:16:45.947Z
mvp-lane-c-invite-batch11.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-c-invite-batch11	generatedAt=2026-02-27T23:38:08.127Z
mvp-lane-c-invite-batch12.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-c-invite-batch12	generatedAt=2026-02-28T02:25:50.435Z
mvp-lane-c-invite-batch13.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-c-invite-batch13	generatedAt=2026-02-28T04:51:29.350Z
mvp-lane-c-invite-next.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-c-invite-provider-integration	generatedAt=2026-02-27T21:26:08.325Z
mvp-lane-c-invite-reserve.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-c-invite-reserve	generatedAt=2026-02-27T21:45:34.619Z
mvp-lane-d-automation-backlog.json	tasks=15	queued=0	in_progress=0	done=15	blocked=0	other=0	lane=lane-d-automation	generatedAt=2026-02-27T20:50:33.844Z
mvp-lane-d-automation-batch11.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-d-automation-batch11	generatedAt=2026-02-27T23:38:08.127Z
mvp-lane-d-automation-batch12.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-d-automation-batch12	generatedAt=2026-02-28T02:25:50.435Z
mvp-lane-d-automation-batch13.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-d-automation-batch13	generatedAt=2026-02-28T04:51:29.350Z
mvp-lane-d-automation-next.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-d-automation-scheduler	generatedAt=2026-02-27T21:26:08.325Z
mvp-lane-d-automation-reserve.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-d-automation-reserve	generatedAt=2026-02-27T21:45:34.619Z
mvp-lane-d-automation.json	tasks=7	queued=0	in_progress=0	done=7	blocked=0	other=0	lane=lane-d-automation	generatedAt=2026-02-26T22:16:45.947Z
mvp-lane-e-qa-doc-review-backlog.json	tasks=15	queued=0	in_progress=0	done=15	blocked=0	other=0	lane=lane-e-qa-doc-review	generatedAt=2026-02-27T20:50:33.844Z
mvp-lane-e-qa-doc-review.json	tasks=17	queued=9	in_progress=0	done=8	blocked=0	other=0	lane=lane-e-qa-doc-review	generatedAt=2026-02-26T22:16:45.947Z
mvp-lane-e-qarev-batch11.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-e-qarev-batch11	generatedAt=2026-02-27T23:38:08.127Z
mvp-lane-e-qarev-batch12.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-e-qarev-batch12	generatedAt=2026-02-28T02:25:50.435Z
mvp-lane-e-qarev-batch13.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-e-qarev-batch13	generatedAt=2026-02-28T04:51:29.350Z
mvp-lane-e-qarev-next.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-e-qa-doc-review	generatedAt=2026-02-27T21:26:08.325Z
mvp-lane-e-qarev-reserve.json	tasks=6	queued=0	in_progress=0	done=6	blocked=0	other=0	lane=lane-e-qarev-reserve	generatedAt=2026-02-27T21:45:34.619Z
mvp-slices-batch10-real-mvp-reserve.json	tasks=30	queued=30	in_progress=0	done=0	blocked=0	other=0	lane=batch10-real-mvp-reserve	generatedAt=2026-02-27T21:45:34.619Z
mvp-slices-batch11-real-mvp-throughput.json	tasks=30	queued=30	in_progress=0	done=0	blocked=0	other=0	lane=batch11-real-mvp-throughput	generatedAt=2026-02-27T23:38:08.127Z
mvp-slices-batch12-real-mvp-throughput.json	tasks=30	queued=30	in_progress=0	done=0	blocked=0	other=0	lane=batch12-real-mvp-throughput	generatedAt=2026-02-28T02:25:50.435Z
mvp-slices-batch13-real-mvp-throughput.json	tasks=30	queued=30	in_progress=0	done=0	blocked=0	other=0	lane=batch13-real-mvp-throughput	generatedAt=2026-02-28T04:51:29.350Z
mvp-slices-batch3.json	tasks=8	queued=8	in_progress=0	done=0	blocked=0	other=0	lane=	generatedAt=2026-02-26T20:30:00.000Z
mvp-slices-batch4.json	tasks=8	queued=8	in_progress=0	done=0	blocked=0	other=0	lane=	generatedAt=2026-02-26T20:45:00.000Z
mvp-slices-batch5.json	tasks=8	queued=8	in_progress=0	done=0	blocked=0	other=0	lane=	generatedAt=2026-02-26T21:30:00.000Z
mvp-slices-batch6.json	tasks=8	queued=8	in_progress=0	done=0	blocked=0	other=0	lane=	generatedAt=2026-02-26T21:45:00.000Z
mvp-slices-batch7.json	tasks=8	queued=8	in_progress=0	done=0	blocked=0	other=0	lane=	generatedAt=2026-02-26T22:05:00.000Z
mvp-slices-batch9-real-mvp.json	tasks=30	queued=30	in_progress=0	done=0	blocked=0	other=0	lane=batch9-real-mvp	generatedAt=2026-02-27T21:26:08.325Z
mvp-slices.json	tasks=8	queued=6	in_progress=0	done=2	blocked=0	other=0	lane=	generatedAt=2026-02-26T20:05:00.000Z
```

### 3) Queued/in-progress subset
Command:
```bash
node - <<'NODE'
const fs=require('fs');const path=require('path');
const dir='.reliant/queue';
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort()){
  const j=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
  const tasks=j.tasks||[];
  const queued=tasks.filter(t=>t.status==='queued').length;
  const inprog=tasks.filter(t=>t.status==='in_progress').length;
  if(queued>0||inprog>0){
    console.log(`${f}\tqueued=${queued}\tin_progress=${inprog}\ttasks=${tasks.length}\tlane=${j.lane||''}`);
  }
}
NODE
```
Output:
```text
mvp-lane-e-qa-doc-review.json	queued=9	in_progress=0	tasks=17	lane=lane-e-qa-doc-review
mvp-slices-batch10-real-mvp-reserve.json	queued=30	in_progress=0	tasks=30	lane=batch10-real-mvp-reserve
mvp-slices-batch11-real-mvp-throughput.json	queued=30	in_progress=0	tasks=30	lane=batch11-real-mvp-throughput
mvp-slices-batch12-real-mvp-throughput.json	queued=30	in_progress=0	tasks=30	lane=batch12-real-mvp-throughput
mvp-slices-batch13-real-mvp-throughput.json	queued=30	in_progress=0	tasks=30	lane=batch13-real-mvp-throughput
mvp-slices-batch3.json	queued=8	in_progress=0	tasks=8	lane=
mvp-slices-batch4.json	queued=8	in_progress=0	tasks=8	lane=
mvp-slices-batch5.json	queued=8	in_progress=0	tasks=8	lane=
mvp-slices-batch6.json	queued=8	in_progress=0	tasks=8	lane=
mvp-slices-batch7.json	queued=8	in_progress=0	tasks=8	lane=
mvp-slices-batch9-real-mvp.json	queued=30	in_progress=0	tasks=30	lane=batch9-real-mvp
mvp-slices.json	queued=6	in_progress=0	tasks=8	lane=
```

### 4) Duplicate task ID summary
Command:
```bash
node - <<'NODE'
const fs=require('fs');
const path=require('path');
const dir='.reliant/queue';
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort();
const idMap=new Map();
for(const f of files){
  const p=path.join(dir,f);
  const j=JSON.parse(fs.readFileSync(p,'utf8'));
  for(const t of (j.tasks||[])){
    const id=t.id||t.taskId;
    if(!id) continue;
    if(!idMap.has(id)) idMap.set(id,[]);
    idMap.get(id).push(f);
  }
}
const dups=[...idMap.entries()].filter(([,arr])=>arr.length>1).sort((a,b)=>a[0].localeCompare(b[0]));
console.log(`duplicate_task_ids=${dups.length}`);
console.log('sample_first_25:');
for(const [id,arr] of dups.slice(0,25)){
  console.log(`${id}\t${arr.join(',')}`);
}
NODE
```
Output:
```text
duplicate_task_ids=196
sample_first_25:
SLICE-ADMIN-246A	mvp-lane-a-api-admin-next.json,mvp-slices-batch9-real-mvp.json
SLICE-ADMIN-247A	mvp-lane-a-api-admin-next.json,mvp-slices-batch9-real-mvp.json
SLICE-ADMIN-248A	mvp-lane-a-api-admin-next.json,mvp-slices-batch9-real-mvp.json
SLICE-ADMIN-249A	mvp-lane-a-api-admin-next.json,mvp-slices-batch9-real-mvp.json
SLICE-ADMIN-250A	mvp-lane-a-api-admin-next.json,mvp-slices-batch9-real-mvp.json
SLICE-ADMIN-251A	mvp-lane-a-api-admin-next.json,mvp-slices-batch9-real-mvp.json
SLICE-ADMIN-276A	mvp-lane-a-api-admin-reserve.json,mvp-slices-batch10-real-mvp-reserve.json
SLICE-ADMIN-277A	mvp-lane-a-api-admin-reserve.json,mvp-slices-batch10-real-mvp-reserve.json
SLICE-ADMIN-278A	mvp-lane-a-api-admin-reserve.json,mvp-slices-batch10-real-mvp-reserve.json
SLICE-ADMIN-279A	mvp-lane-a-api-admin-reserve.json,mvp-slices-batch10-real-mvp-reserve.json
SLICE-ADMIN-280A	mvp-lane-a-api-admin-reserve.json,mvp-slices-batch10-real-mvp-reserve.json
SLICE-ADMIN-281A	mvp-lane-a-api-admin-reserve.json,mvp-slices-batch10-real-mvp-reserve.json
SLICE-ADMIN-306A	mvp-lane-a-api-admin-batch11.json,mvp-slices-batch11-real-mvp-throughput.json
SLICE-ADMIN-307A	mvp-lane-a-api-admin-batch11.json,mvp-slices-batch11-real-mvp-throughput.json
SLICE-ADMIN-308A	mvp-lane-a-api-admin-batch11.json,mvp-slices-batch11-real-mvp-throughput.json
SLICE-ADMIN-309A	mvp-lane-a-api-admin-batch11.json,mvp-slices-batch11-real-mvp-throughput.json
SLICE-ADMIN-310A	mvp-lane-a-api-admin-batch11.json,mvp-slices-batch11-real-mvp-throughput.json
SLICE-ADMIN-311A	mvp-lane-a-api-admin-batch11.json,mvp-slices-batch11-real-mvp-throughput.json
SLICE-ADMIN-336A	mvp-lane-a-api-admin-batch12.json,mvp-slices-batch12-real-mvp-throughput.json
SLICE-ADMIN-337A	mvp-lane-a-api-admin-batch12.json,mvp-slices-batch12-real-mvp-throughput.json
SLICE-ADMIN-338A	mvp-lane-a-api-admin-batch12.json,mvp-slices-batch12-real-mvp-throughput.json
SLICE-ADMIN-339A	mvp-lane-a-api-admin-batch12.json,mvp-slices-batch12-real-mvp-throughput.json
SLICE-ADMIN-340A	mvp-lane-a-api-admin-batch12.json,mvp-slices-batch12-real-mvp-throughput.json
SLICE-ADMIN-341A	mvp-lane-a-api-admin-batch12.json,mvp-slices-batch12-real-mvp-throughput.json
SLICE-ADMIN-366A	mvp-lane-a-api-admin-batch13.json,mvp-slices-batch13-real-mvp-throughput.json
```

## Deliverables
- Added topology plan: `docs/solutions/RELIANT_QUEUE_TOPOLOGY_R1.md`
- Added changelog entry in `docs/CHANGELOG.md`

## Founder Escalations Logged
- Decision needed on `mvp-lane-e-qa-doc-review.json` (9 queued tasks).
- Decision needed on whether parent `mvp-slices-batch*` files remain queued manifests or should be normalized after lane completion.
