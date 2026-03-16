#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const scriptPath = path.join(repoRoot, 'scripts', 'reliant-runtime-clean.mjs');

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
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reliant-runtime-clean-test-'));
  const missingPath = path.join(tempDir, 'missing.json');
  const missing = JSON.parse(run(['--runtime', missingPath]).stdout);
  assert.equal(missing.cleared, false);
  assert.equal(missing.wouldClear, false);
  assert.equal(missing.runtimeState, 'missing');

  const runtimePath = path.join(tempDir, 'runtime.json');
  fs.writeFileSync(runtimePath, JSON.stringify({ taskId: 'T-1' }, null, 2));
  const dryRun = JSON.parse(run(['--runtime', runtimePath, '--dry-run']).stdout);
  assert.equal(dryRun.cleared, false);
  assert.equal(dryRun.dryRun, true);
  assert.equal(dryRun.wouldClear, true);
  assert.equal(dryRun.runtimeState, 'present');
  assert.equal(dryRun.previousTaskId, 'T-1');
  assert.equal(fs.existsSync(runtimePath), true);

  const cleared = JSON.parse(run(['--runtime', runtimePath]).stdout);
  assert.equal(cleared.cleared, true);
  assert.equal(cleared.dryRun, false);
  assert.equal(cleared.wouldClear, true);
  assert.equal(cleared.runtimeState, 'present');
  assert.equal(fs.existsSync(runtimePath), false);

  const invalidRuntimePath = path.join(tempDir, 'invalid-runtime.json');
  fs.writeFileSync(invalidRuntimePath, '{not-json');
  const invalidDryRun = JSON.parse(run(['--runtime', invalidRuntimePath, '--dry-run']).stdout);
  assert.equal(invalidDryRun.runtimeState, 'invalid_json');
  assert.equal(invalidDryRun.wouldClear, true);
  assert.equal(fs.existsSync(invalidRuntimePath), true);

  const uxQueueDir = path.join(tempDir, '.reliant/queue');
  const uxRuntimeDir = path.join(tempDir, '.reliant/runtime');
  fs.mkdirSync(uxQueueDir, { recursive: true });
  fs.mkdirSync(uxRuntimeDir, { recursive: true });
  const uxQueuePath = path.join(uxQueueDir, 'mvp-lane-d-ux-automation-batch16.json');
  const uxRuntimePath = path.join(uxRuntimeDir, 'current-task-lane-d-ux-batch16.json');
  fs.writeFileSync(
    uxQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        tasks: [
          {
            id: 'UX-RUN-1',
            title: 'Resume me',
            prompt: 'Resume me',
            verifyCommand: 'pnpm run docs:lint',
            status: 'in_progress',
            startedAt: '2026-03-15T21:00:00.000Z',
            updatedAt: '2026-03-15T21:00:00.000Z',
          },
        ],
      },
      null,
      2,
    )}\n`,
  );
  fs.writeFileSync(uxRuntimePath, JSON.stringify({ taskId: 'STALE-UX-RUN' }, null, 2));

  const uxResumeDryRun = JSON.parse(
    run(['--runtime', uxRuntimePath, '--queue', uxQueuePath, '--resume', '--dry-run']).stdout,
  );
  assert.equal(uxResumeDryRun.inferredQueuePath, uxQueuePath);
  assert.equal(uxResumeDryRun.resumeAction, 'restore_in_progress');
  assert.equal(uxResumeDryRun.resumed, false);
  assert.equal(uxResumeDryRun.resumedTaskId, 'UX-RUN-1');
  assert.equal(fs.existsSync(uxRuntimePath), true);

  const uxResume = JSON.parse(run(['--runtime', uxRuntimePath, '--queue', uxQueuePath, '--resume']).stdout);
  assert.equal(uxResume.resumeAction, 'restore_in_progress');
  assert.equal(uxResume.resumed, true);
  const restoredRuntime = JSON.parse(fs.readFileSync(uxRuntimePath, 'utf8'));
  assert.equal(restoredRuntime.taskId, 'UX-RUN-1');
  assert.equal(restoredRuntime.title, 'Resume me');

  fs.unlinkSync(uxRuntimePath);
  fs.writeFileSync(
    uxQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        tasks: [{ id: 'UX-RUN-2', title: 'Claim next', prompt: 'Claim next', status: 'queued' }],
      },
      null,
      2,
    )}\n`,
  );
  const uxResumeClaim = JSON.parse(run(['--runtime', uxRuntimePath, '--queue', uxQueuePath, '--resume']).stdout);
  assert.equal(uxResumeClaim.runtimeState, 'missing');
  assert.equal(uxResumeClaim.resumeAction, 'claim_next');
  assert.match(uxResumeClaim.resumeCommand, /reliant-slice-queue\.mjs claim/);
  assert.equal(fs.existsSync(uxRuntimePath), false);
}

main();
