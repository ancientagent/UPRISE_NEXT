# R1 Lane A Queue/Runtime Hygiene (2026-02-28)

## Scope
- Phase R1 backlog hygiene only.
- Audited `.reliant/queue/*.json` and `.reliant/runtime/*.json`.
- Fixed deterministic hygiene issues only:
  - stale runtime files with no matching `in_progress` task,
  - queue summary drift (none detected, no queue edits needed).
- No feature/product behavior changes.

## Commands + Exact Outputs

### 1) Initial deterministic audit (all queue/runtime files)
```bash
node - <<'NODE'
const fs=require('fs');
const path=require('path');
const qDir='.reliant/queue';
const rDir='.reliant/runtime';
const qFiles=fs.readdirSync(qDir).filter(f=>f.endsWith('.json')).sort();
const rFiles=fs.readdirSync(rDir).filter(f=>f.endsWith('.json')).sort();
const drift=[];
const inProgress=[];
for(const f of qFiles){
  const p=path.join(qDir,f);
  const q=JSON.parse(fs.readFileSync(p,'utf8'));
  const actual={total:0,queued:0,in_progress:0,done:0,blocked:0};
  for(const t of q.tasks||[]){
    actual.total++; if(actual[t.status]===undefined) actual[t.status]=0; actual[t.status]++;
    if(t.status==='in_progress') inProgress.push({taskId:t.id,queue:p});
  }
  const s=q.summary||{};
  const keys=['total','queued','in_progress','done','blocked'];
  const diffs=keys.filter(k=>Number(s[k]??0)!==Number(actual[k]??0)).map(k=>({key:k,declared:Number(s[k]??0),actual:Number(actual[k]??0)}));
  if(diffs.length) drift.push({queue:p,diffs});
}
const inProgMap=new Map(inProgress.map(x=>[x.taskId,x.queue]));
const stale=[];
for(const f of rFiles){
  const p=path.join(rDir,f);
  let parsed=null; let validJson=true;
  try{parsed=JSON.parse(fs.readFileSync(p,'utf8'));}catch{validJson=false;}
  const taskId=parsed&&typeof parsed==='object'?parsed.taskId:null;
  const match=typeof taskId==='string'&&inProgMap.has(taskId);
  if(!match){
    stale.push({runtime:p,taskId:taskId??null,reason:!validJson?'invalid_json':(typeof taskId!=='string'||taskId===''?'missing_task_id':'no_matching_in_progress')});
  }
}
console.log(JSON.stringify({queueFileCount:qFiles.length,runtimeFileCount:rFiles.length,inProgressTaskCount:inProgress.length,summaryDriftCount:drift.length,staleRuntimeCount:stale.length,summaryDrift:drift,staleRuntimes:stale},null,2));
NODE
```

```text
{
  "queueFileCount": 46,
  "runtimeFileCount": 12,
  "inProgressTaskCount": 0,
  "summaryDriftCount": 0,
  "staleRuntimeCount": 12,
  "summaryDrift": [],
  "staleRuntimes": [
    {
      "runtime": ".reliant/runtime/current-task-lane-a-batch11.json",
      "taskId": "SLICE-ADMIN-311A",
      "reason": "no_matching_in_progress"
    },
    {
      "runtime": ".reliant/runtime/current-task-lane-a-batch12.json",
      "taskId": "SLICE-ADMIN-341A",
      "reason": "no_matching_in_progress"
    },
    {
      "runtime": ".reliant/runtime/current-task-lane-a-next.json",
      "taskId": "SLICE-ADMIN-251A",
      "reason": "no_matching_in_progress"
    },
    {
      "runtime": ".reliant/runtime/current-task-lane-a-reserve.json",
      "taskId": "SLICE-ADMIN-281A",
      "reason": "no_matching_in_progress"
    },
    {
      "runtime": ".reliant/runtime/current-task-lane-b-next.json",
      "taskId": "SLICE-WEBADMIN-257A",
      "reason": "no_matching_in_progress"
    },
    {
      "runtime": ".reliant/runtime/current-task-lane-b-reserve.json",
      "taskId": "SLICE-WEBADMIN-287A",
      "reason": "no_matching_in_progress"
    },
    {
      "runtime": ".reliant/runtime/current-task-lane-c-next.json",
      "taskId": "SLICE-INVITE-263A",
      "reason": "no_matching_in_progress"
    },
    {
      "runtime": ".reliant/runtime/current-task-lane-c-reserve.json",
      "taskId": "SLICE-INVITE-293A",
      "reason": "no_matching_in_progress"
    },
    {
      "runtime": ".reliant/runtime/current-task-lane-d-batch11.json",
      "taskId": "SLICE-AUTO-327A",
      "reason": "no_matching_in_progress"
    },
    {
      "runtime": ".reliant/runtime/current-task-lane-d-next.json",
      "taskId": "SLICE-AUTO-269A",
      "reason": "no_matching_in_progress"
    },
    {
      "runtime": ".reliant/runtime/current-task-lane-d-reserve.json",
      "taskId": "SLICE-AUTO-299A",
      "reason": "no_matching_in_progress"
    },
    {
      "runtime": ".reliant/runtime/supervisor-status.json",
      "taskId": null,
      "reason": "missing_task_id"
    }
  ]
}
```

### 2) Queue drift check via existing queue status script
```bash
for q in .reliant/queue/*.json; do out=$(node scripts/reliant-slice-queue.mjs status --queue "$q" 2>/dev/null); drift=$(printf '%s' "$out" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const j=JSON.parse(d);process.stdout.write(String(j.summarySanity?.isDrifting??false));});'); if [ "$drift" = "true" ]; then echo "$q"; fi; done
```

```text

```

### 3) Runtime cleanup using existing runtime clean script
```bash
pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task-lane-a-batch11.json
pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task-lane-a-batch12.json
pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task-lane-a-next.json
pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task-lane-a-reserve.json
pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task-lane-b-next.json
pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task-lane-b-reserve.json
pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task-lane-c-next.json
pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task-lane-c-reserve.json
pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task-lane-d-batch11.json
pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task-lane-d-next.json
pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task-lane-d-reserve.json
```

```text
> uprise-next@1.0.0 reliant:runtime:clean /home/baris/UPRISE_NEXT
> node scripts/reliant-runtime-clean.mjs "--" "--runtime" ".reliant/runtime/current-task-lane-a-batch11.json"

{
  "cleared": true,
  "dryRun": false,
  "wouldClear": true,
  "runtimeState": "present",
  "runtimePath": ".reliant/runtime/current-task-lane-a-batch11.json",
  "checkedAt": "2026-02-28T05:28:01.497Z",
  "previousTaskId": "SLICE-ADMIN-311A"
}
> uprise-next@1.0.0 reliant:runtime:clean /home/baris/UPRISE_NEXT
> node scripts/reliant-runtime-clean.mjs "--" "--runtime" ".reliant/runtime/current-task-lane-a-batch12.json"

{
  "cleared": true,
  "dryRun": false,
  "wouldClear": true,
  "runtimeState": "present",
  "runtimePath": ".reliant/runtime/current-task-lane-a-batch12.json",
  "checkedAt": "2026-02-28T05:28:01.675Z",
  "previousTaskId": "SLICE-ADMIN-341A"
}
> uprise-next@1.0.0 reliant:runtime:clean /home/baris/UPRISE_NEXT
> node scripts/reliant-runtime-clean.mjs "--" "--runtime" ".reliant/runtime/current-task-lane-a-next.json"

{
  "cleared": true,
  "dryRun": false,
  "wouldClear": true,
  "runtimeState": "present",
  "runtimePath": ".reliant/runtime/current-task-lane-a-next.json",
  "checkedAt": "2026-02-28T05:28:01.858Z",
  "previousTaskId": "SLICE-ADMIN-251A"
}
> uprise-next@1.0.0 reliant:runtime:clean /home/baris/UPRISE_NEXT
> node scripts/reliant-runtime-clean.mjs "--" "--runtime" ".reliant/runtime/current-task-lane-a-reserve.json"

{
  "cleared": true,
  "dryRun": false,
  "wouldClear": true,
  "runtimeState": "present",
  "runtimePath": ".reliant/runtime/current-task-lane-a-reserve.json",
  "checkedAt": "2026-02-28T05:28:02.033Z",
  "previousTaskId": "SLICE-ADMIN-281A"
}
> uprise-next@1.0.0 reliant:runtime:clean /home/baris/UPRISE_NEXT
> node scripts/reliant-runtime-clean.mjs "--" "--runtime" ".reliant/runtime/current-task-lane-b-next.json"

{
  "cleared": true,
  "dryRun": false,
  "wouldClear": true,
  "runtimeState": "present",
  "runtimePath": ".reliant/runtime/current-task-lane-b-next.json",
  "checkedAt": "2026-02-28T05:28:02.209Z",
  "previousTaskId": "SLICE-WEBADMIN-257A"
}
> uprise-next@1.0.0 reliant:runtime:clean /home/baris/UPRISE_NEXT
> node scripts/reliant-runtime-clean.mjs "--" "--runtime" ".reliant/runtime/current-task-lane-b-reserve.json"

{
  "cleared": true,
  "dryRun": false,
  "wouldClear": true,
  "runtimeState": "present",
  "runtimePath": ".reliant/runtime/current-task-lane-b-reserve.json",
  "checkedAt": "2026-02-28T05:28:02.398Z",
  "previousTaskId": "SLICE-WEBADMIN-287A"
}
> uprise-next@1.0.0 reliant:runtime:clean /home/baris/UPRISE_NEXT
> node scripts/reliant-runtime-clean.mjs "--" "--runtime" ".reliant/runtime/current-task-lane-c-next.json"

{
  "cleared": true,
  "dryRun": false,
  "wouldClear": true,
  "runtimeState": "present",
  "runtimePath": ".reliant/runtime/current-task-lane-c-next.json",
  "checkedAt": "2026-02-28T05:28:02.586Z",
  "previousTaskId": "SLICE-INVITE-263A"
}
> uprise-next@1.0.0 reliant:runtime:clean /home/baris/UPRISE_NEXT
> node scripts/reliant-runtime-clean.mjs "--" "--runtime" ".reliant/runtime/current-task-lane-c-reserve.json"

{
  "cleared": true,
  "dryRun": false,
  "wouldClear": true,
  "runtimeState": "present",
  "runtimePath": ".reliant/runtime/current-task-lane-c-reserve.json",
  "checkedAt": "2026-02-28T05:28:02.773Z",
  "previousTaskId": "SLICE-INVITE-293A"
}
> uprise-next@1.0.0 reliant:runtime:clean /home/baris/UPRISE_NEXT
> node scripts/reliant-runtime-clean.mjs "--" "--runtime" ".reliant/runtime/current-task-lane-d-batch11.json"

{
  "cleared": true,
  "dryRun": false,
  "wouldClear": true,
  "runtimeState": "present",
  "runtimePath": ".reliant/runtime/current-task-lane-d-batch11.json",
  "checkedAt": "2026-02-28T05:28:02.954Z",
  "previousTaskId": "SLICE-AUTO-327A"
}
> uprise-next@1.0.0 reliant:runtime:clean /home/baris/UPRISE_NEXT
> node scripts/reliant-runtime-clean.mjs "--" "--runtime" ".reliant/runtime/current-task-lane-d-next.json"

{
  "cleared": true,
  "dryRun": false,
  "wouldClear": true,
  "runtimeState": "present",
  "runtimePath": ".reliant/runtime/current-task-lane-d-next.json",
  "checkedAt": "2026-02-28T05:28:03.132Z",
  "previousTaskId": "SLICE-AUTO-269A"
}
> uprise-next@1.0.0 reliant:runtime:clean /home/baris/UPRISE_NEXT
> node scripts/reliant-runtime-clean.mjs "--" "--runtime" ".reliant/runtime/current-task-lane-d-reserve.json"

{
  "cleared": true,
  "dryRun": false,
  "wouldClear": true,
  "runtimeState": "present",
  "runtimePath": ".reliant/runtime/current-task-lane-d-reserve.json",
  "checkedAt": "2026-02-28T05:28:03.318Z",
  "previousTaskId": "SLICE-AUTO-299A"
}
```

### 4) Post-clean audit
```bash
node - <<'NODE'
const fs=require('fs');
const path=require('path');
const qDir='.reliant/queue';
const rDir='.reliant/runtime';
const qFiles=fs.readdirSync(qDir).filter(f=>f.endsWith('.json')).sort();
const rFiles=fs.readdirSync(rDir).filter(f=>f.endsWith('.json')).sort();
const inProgress=[];
const drift=[];
for(const f of qFiles){
  const p=path.join(qDir,f);const q=JSON.parse(fs.readFileSync(p,'utf8'));
  const actual={total:0,queued:0,in_progress:0,done:0,blocked:0};
  for(const t of q.tasks||[]){actual.total++;actual[t.status]=(actual[t.status]??0)+1;if(t.status==='in_progress') inProgress.push(t.id);}
  const s=q.summary||{}; const keys=['total','queued','in_progress','done','blocked'];
  const diffs=keys.filter(k=>Number(s[k]??0)!==Number(actual[k]??0));
  if(diffs.length) drift.push({queue:p,diffs});
}
const inSet=new Set(inProgress);
const staleAll=[]; const staleCurrentTask=[];
for(const f of rFiles){
  const p=path.join(rDir,f); let j=null; let ok=true;
  try{j=JSON.parse(fs.readFileSync(p,'utf8'));}catch{ok=false;}
  const taskId=j&&typeof j==='object'?j.taskId:null;
  const match=typeof taskId==='string'&&inSet.has(taskId);
  if(!match){
    const row={runtime:p,taskId:taskId??null,reason:!ok?'invalid_json':(typeof taskId==='string'&&taskId? 'no_matching_in_progress':'missing_task_id')};
    staleAll.push(row);
    if(path.basename(p).startsWith('current-task')) staleCurrentTask.push(row);
  }
}
console.log(JSON.stringify({summaryDriftCount:drift.length,staleRuntimeAllCount:staleAll.length,staleCurrentTaskRuntimeCount:staleCurrentTask.length,staleRuntimesAll:staleAll},null,2));
NODE
```

```text
{
  "summaryDriftCount": 0,
  "staleRuntimeAllCount": 1,
  "staleCurrentTaskRuntimeCount": 0,
  "staleRuntimesAll": [
    {
      "runtime": ".reliant/runtime/supervisor-status.json",
      "taskId": null,
      "reason": "missing_task_id"
    }
  ]
}
```

Note: `supervisor-status.json` is a supervisor status artifact (not a claim/runtime task file); all `current-task*.json` stale runtimes are cleared.

### 5) Required verify
```bash
pnpm run docs:lint
pnpm run infra-policy-check
pnpm --filter api typecheck
pnpm --filter web typecheck
```

```text
> uprise-next@1.0.0 docs:lint /home/baris/UPRISE_NEXT
> node scripts/docs-lint.mjs && pnpm run canon:lint

[docs:lint] ✅ No tracked PDFs
[docs:lint] ✅ No tracked Zone.Identifier artifacts
[docs:lint] ✅ Docs directory structure looks present
[docs:lint] ✅ Specs metadata present
[docs:lint] ✅ No unexpected root-level markdown files
[docs:lint] ✅ docs:lint passed

> uprise-next@1.0.0 canon:lint /home/baris/UPRISE_NEXT
> node scripts/canon-lint.mjs

[canon:lint] OK: Checked 10 canon markdown files

> uprise-next@1.0.0 infra-policy-check /home/baris/UPRISE_NEXT
> tsx scripts/infra-policy-check.ts


🔍 UPRISE Web-Tier Contract Guard
════════════════════════════════════════════════════════════════════════════════
Scanning: apps/web
Patterns: 24 prohibited patterns
════════════════════════════════════════════════════════════════════════════════


✅ Web-Tier Contract Guard: No violations detected!
   All architectural boundaries are properly enforced.


⏱️  Scan completed in 3ms

✅ Build succeeded: All checks passed!


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit
```
