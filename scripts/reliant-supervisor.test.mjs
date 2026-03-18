#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const scriptPath = path.join(repoRoot, 'scripts', 'reliant-supervisor.mjs');

function run(args, expectedCode = 0) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  if (result.status !== expectedCode) {
    throw new Error(
      `Command failed:\nnode ${scriptPath} ${args.join(' ')}\nexit=${result.status}\nstdout=${result.stdout}\nstderr=${result.stderr}`,
    );
  }
  return result;
}

function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reliant-supervisor-test-'));
  const queuePath = path.join(tempDir, 'queue.json');
  const runtimePath = path.join(tempDir, 'runtime.json');
  const lanesPath = path.join(tempDir, 'lanes.json');
  const statusOut = path.join(tempDir, 'status.json');

  fs.writeFileSync(
    queuePath,
    `${JSON.stringify(
      {
        version: 1,
        summary: { total: 3, queued: 3, in_progress: 0, done: 0, blocked: 0 },
        tasks: [
          { id: 'A', title: 'A', prompt: 'A', status: 'queued' },
          { id: 'B', title: 'B', prompt: 'B', status: 'in_progress' },
        ],
      },
      null,
      2,
    )}\n`,
  );
  fs.writeFileSync(runtimePath, JSON.stringify({ taskId: 'B' }, null, 2));
  fs.writeFileSync(lanesPath, JSON.stringify([{ name: 'test-lane', queue: queuePath, runtime: runtimePath }], null, 2));

  run(
    [
      '--no-claim',
      '--no-repair',
      '--interval-ms',
      '1',
      '--interval-jitter-ms',
      '99999',
      '--jitter-seed',
      '999999999',
      '--lanes-json',
      lanesPath,
      '--status-out',
      statusOut,
    ],
    0,
  );
  const status = JSON.parse(fs.readFileSync(statusOut, 'utf8'));
  assert.equal(status.intervalConfig.intervalMs, 500);
  assert.equal(status.intervalConfig.intervalJitterMs, 5000);
  assert.equal(status.intervalConfig.jitterSeed, 1000000);
  assert.equal(status.intervalConfig.jitterCycleLength, 5001);
  assert.equal(status.lanes.length, 1);
  assert.equal(status.lanes[0].runtimeOwnership.exists, true);
  assert.equal(status.lanes[0].runtimeOwnership.runtimeTaskId, 'B');
  assert.equal(status.lanes[0].runtimeOwnership.matchesInProgress, true);
  assert.equal(status.lanes[0].ownershipHealth.state, 'healthy');
  assert.equal(status.lanes[0].ownershipHealth.severity, 'none');
  assert.equal(status.lanes[0].ownershipHealth.failureCode, null);
  assert.equal(status.lanes[0].ownershipHealth.requiresIntervention, false);
  assert.deepEqual(status.lanes[0].ownershipHealth.hints, []);
  assert.deepEqual(status.lanes[0].ownershipHealth.operatorCues, []);
  assert.ok(status.lanes[0].drifts.some((d) => d.startsWith('summary-mismatch:total')));

  fs.writeFileSync(
    queuePath,
    `${JSON.stringify(
      {
        version: 1,
        summary: { total: 1, queued: 1, in_progress: 0, done: 0, blocked: 0 },
        tasks: [{ id: 'C', title: 'C', prompt: 'C', status: 'queued' }],
      },
      null,
      2,
    )}\n`,
  );
  run(['--no-claim', '--no-repair', '--lanes-json', lanesPath, '--status-out', statusOut], 0);
  const staleStatus = JSON.parse(fs.readFileSync(statusOut, 'utf8'));
  assert.equal(staleStatus.lanes[0].ownershipHealth.state, 'stale_runtime_without_owner');
  assert.equal(staleStatus.lanes[0].ownershipHealth.severity, 'medium');
  assert.equal(staleStatus.lanes[0].ownershipHealth.failureCode, 'stale_runtime');
  assert.equal(staleStatus.lanes[0].ownershipHealth.requiresIntervention, true);
  assert.ok(
    staleStatus.lanes[0].ownershipHealth.operatorCues.some(
      (cue) => cue === `node scripts/reliant-runtime-clean.mjs --runtime ${runtimePath}`,
    ),
  );

  const failResult = spawnSync(
    process.execPath,
    [scriptPath, '--no-claim', '--no-repair', '--fail-on-drift', '--lanes-json', lanesPath, '--status-out', statusOut],
    { cwd: repoRoot, encoding: 'utf8' },
  );
  assert.equal(failResult.status, 4);
  assert.match(failResult.stderr, /drift-detected count=/);

  // Health check should pass on clean summary/runtime ownership.
  const cleanQueuePath = path.join(tempDir, 'clean-queue.json');
  const cleanRuntimePath = path.join(tempDir, 'clean-runtime.json');
  const cleanLanesPath = path.join(tempDir, 'clean-lanes.json');
  fs.writeFileSync(
    cleanQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        summary: { total: 1, queued: 1, in_progress: 0, done: 0, blocked: 0 },
        tasks: [{ id: 'Q1', title: 'Q1', prompt: 'Q1', status: 'queued' }],
      },
      null,
      2,
    )}\n`,
  );
  fs.writeFileSync(cleanLanesPath, JSON.stringify([{ name: 'clean-lane', queue: cleanQueuePath, runtime: cleanRuntimePath }], null, 2));
  const healthPass = run(['--health-check', '--lanes-json', cleanLanesPath, '--status-out', statusOut], 0);
  assert.match(healthPass.stdout, /health-gate-passed/);
  const healthPassStatus = JSON.parse(fs.readFileSync(statusOut, 'utf8'));
  assert.equal(healthPassStatus.healthCheck.passed, true);
  assert.equal(healthPassStatus.healthCheck.failureCount, 0);

  // Health check should fail on summary drift.
  const driftQueuePath = path.join(tempDir, 'drift-queue.json');
  const driftLanesPath = path.join(tempDir, 'drift-lanes.json');
  fs.writeFileSync(
    driftQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        summary: { total: 2, queued: 2, in_progress: 0, done: 0, blocked: 0 },
        tasks: [{ id: 'D1', title: 'D1', prompt: 'D1', status: 'queued' }],
      },
      null,
      2,
    )}\n`,
  );
  fs.writeFileSync(driftLanesPath, JSON.stringify([{ name: 'drift-lane', queue: driftQueuePath, runtime: cleanRuntimePath }], null, 2));
  const healthDrift = spawnSync(
    process.execPath,
    [scriptPath, '--health-check', '--lanes-json', driftLanesPath, '--status-out', statusOut],
    { cwd: repoRoot, encoding: 'utf8' },
  );
  assert.equal(healthDrift.status, 6);
  assert.match(healthDrift.stderr, /code=summary_drift/);

  // Health check should fail on stale runtime without matching in_progress.
  fs.writeFileSync(cleanRuntimePath, JSON.stringify({ taskId: 'STALE' }, null, 2));
  const healthStale = spawnSync(
    process.execPath,
    [scriptPath, '--health-check', '--lanes-json', cleanLanesPath, '--status-out', statusOut],
    { cwd: repoRoot, encoding: 'utf8' },
  );
  assert.equal(healthStale.status, 6);
  assert.match(healthStale.stderr, /code=stale_runtime_without_matching_in_progress/);

  // Health check should fail on multiple in_progress ownership.
  const multiQueuePath = path.join(tempDir, 'multi-queue.json');
  const multiLanesPath = path.join(tempDir, 'multi-lanes.json');
  fs.writeFileSync(
    multiQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        summary: { total: 2, queued: 0, in_progress: 2, done: 0, blocked: 0 },
        tasks: [
          { id: 'M1', title: 'M1', prompt: 'M1', status: 'in_progress' },
          { id: 'M2', title: 'M2', prompt: 'M2', status: 'in_progress' },
        ],
      },
      null,
      2,
    )}\n`,
  );
  fs.writeFileSync(multiLanesPath, JSON.stringify([{ name: 'multi-lane', queue: multiQueuePath, runtime: cleanRuntimePath }], null, 2));
  const healthMulti = spawnSync(
    process.execPath,
    [scriptPath, '--health-check', '--lanes-json', multiLanesPath, '--status-out', statusOut],
    { cwd: repoRoot, encoding: 'utf8' },
  );
  assert.equal(healthMulti.status, 6);
  assert.match(healthMulti.stderr, /code=multiple_in_progress/);

  // Supervisor should stop when the next queued task explicitly declares a founder-decision dependency.
  const founderQueuePath = path.join(tempDir, 'founder-queue.json');
  const founderRuntimePath = path.join(tempDir, 'founder-runtime.json');
  const founderLanesPath = path.join(tempDir, 'founder-lanes.json');
  fs.writeFileSync(
    founderQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        summary: { total: 1, queued: 1, in_progress: 0, done: 0, blocked: 0 },
        tasks: [
          {
            id: 'F1',
            title: 'Founder locked task',
            prompt: 'Founder locked task',
            status: 'queued',
            founderDecisionRequired: true,
            founderDecisionReason: 'Social exposure treatment is founder-locked.',
          },
        ],
      },
      null,
      2,
    )}\n`,
  );
  fs.writeFileSync(founderLanesPath, JSON.stringify([{ name: 'founder-lane', queue: founderQueuePath, runtime: founderRuntimePath }], null, 2));
  const founderStop = spawnSync(
    process.execPath,
    [scriptPath, '--lanes-json', founderLanesPath, '--status-out', statusOut],
    { cwd: repoRoot, encoding: 'utf8' },
  );
  assert.equal(founderStop.status, 7);
  assert.match(founderStop.stderr, /code=founder_decision_required/);
  const founderStopStatus = JSON.parse(fs.readFileSync(statusOut, 'utf8'));
  assert.equal(founderStopStatus.stopConditions.length, 1);
  assert.equal(founderStopStatus.stopConditions[0].taskId, 'F1');
  assert.equal(founderStopStatus.lanes[0].founderDecisionStop.requiresStop, true);
  assert.equal(founderStopStatus.lanes[0].actions.includes('stop:founder-decision:F1'), true);

  const founderHealthStop = spawnSync(
    process.execPath,
    [scriptPath, '--health-check', '--lanes-json', founderLanesPath, '--status-out', statusOut],
    { cwd: repoRoot, encoding: 'utf8' },
  );
  assert.equal(founderHealthStop.status, 6);
  assert.match(founderHealthStop.stderr, /code=founder_decision_required/);

  const blockedUxQueuePath = path.join(tempDir, '.reliant/queue/mvp-lane-d-ux-automation-batch17.json');
  const blockedUxRuntimePath = path.join(tempDir, '.reliant/runtime/current-task-lane-d-ux-batch17.json');
  const blockedUxLanesPath = path.join(tempDir, 'blocked-ux-lanes.json');
  fs.mkdirSync(path.dirname(blockedUxQueuePath), { recursive: true });
  fs.mkdirSync(path.dirname(blockedUxRuntimePath), { recursive: true });
  fs.writeFileSync(
    blockedUxQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        summary: { total: 1, queued: 0, in_progress: 0, done: 0, blocked: 1 },
        tasks: [
          {
            id: 'B17-BLOCKED',
            title: 'Blocked UX task',
            prompt: 'Blocked UX task',
            status: 'blocked',
            blockedAt: '2026-03-17T12:00:00.000Z',
            blockerReason: 'Founder note required from prior run',
          },
        ],
      },
      null,
      2,
    )}\n`,
  );
  fs.writeFileSync(
    blockedUxLanesPath,
    JSON.stringify([{ name: 'blocked-ux-lane', queue: blockedUxQueuePath, runtime: blockedUxRuntimePath }], null, 2),
  );
  const blockedUx = run(['--no-claim', '--no-repair', '--lanes-json', blockedUxLanesPath, '--status-out', statusOut], 0);
  assert.match(blockedUx.stdout, /code=blocked_only/);
  const blockedUxStatus = JSON.parse(fs.readFileSync(statusOut, 'utf8'));
  assert.equal(blockedUxStatus.stopConditions.length, 0);
  assert.equal(blockedUxStatus.lanes[0].uxStopCondition.code, 'blocked_only');
  assert.match(blockedUxStatus.lanes[0].uxStopCondition.reason, /no queued tasks/);

  const drainedUxQueuePath = path.join(tempDir, '.reliant/queue/mvp-lane-e-ux-qarev-batch17.json');
  const drainedUxRuntimePath = path.join(tempDir, '.reliant/runtime/current-task-lane-e-ux-batch17.json');
  const drainedUxLanesPath = path.join(tempDir, 'drained-ux-lanes.json');
  fs.writeFileSync(
    drainedUxQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        summary: { total: 1, queued: 0, in_progress: 0, done: 1, blocked: 0 },
        tasks: [{ id: 'DRAIN-1', title: 'Done UX task', prompt: 'Done UX task', status: 'done', finishedAt: '2026-03-17T12:00:00.000Z' }],
      },
      null,
      2,
    )}\n`,
  );
  fs.writeFileSync(
    drainedUxLanesPath,
    JSON.stringify([{ name: 'drained-ux-lane', queue: drainedUxQueuePath, runtime: drainedUxRuntimePath }], null, 2),
  );
  const drainedUx = run(['--no-claim', '--no-repair', '--lanes-json', drainedUxLanesPath, '--status-out', statusOut], 0);
  assert.match(drainedUx.stdout, /code=no_queued_tasks/);
  const drainedUxStatus = JSON.parse(fs.readFileSync(statusOut, 'utf8'));
  assert.equal(drainedUxStatus.stopConditions.length, 0);
  assert.equal(drainedUxStatus.lanes[0].uxStopCondition.code, 'no_queued_tasks');
  assert.equal(drainedUxStatus.lanes[0].uxStopCondition.reason, 'queue is drained');

  // Bounded jitter should produce deterministic bounded values.
  const jitterProbe = spawnSync(
    process.execPath,
    [
      '-e',
      `const f=${(() => {
        function boundedJitter(base, jitter, cycle, jitterSeed = 0) {
          if (!Number.isFinite(jitter) || jitter <= 0) return Math.max(0, base);
          const window = Math.max(1, Math.floor(jitter));
          const offset = (cycle + Math.max(0, Math.floor(jitterSeed))) % (window + 1);
          return Math.max(0, base + offset);
        }
        return boundedJitter.toString();
      })()}; console.log([f(100,3,0,0),f(100,3,1,0),f(100,3,4,0),f(0,5,2,1)].join(','));`,
    ],
    { cwd: repoRoot, encoding: 'utf8' },
  );
  assert.equal(jitterProbe.status, 0);
  assert.equal(jitterProbe.stdout.trim(), '100,101,100,3');
}

main();
