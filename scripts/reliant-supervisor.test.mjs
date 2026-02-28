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
      '0',
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
  assert.equal(status.intervalConfig.jitterSeed, 0);
  assert.equal(status.lanes.length, 1);
  assert.equal(status.lanes[0].runtimeOwnership.exists, true);
  assert.equal(status.lanes[0].runtimeOwnership.runtimeTaskId, 'B');
  assert.equal(status.lanes[0].runtimeOwnership.matchesInProgress, true);
  assert.equal(status.lanes[0].ownershipHealth.state, 'healthy');
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
