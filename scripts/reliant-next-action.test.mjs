#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const nextActionPath = path.join(repoRoot, 'scripts', 'reliant-next-action.mjs');
const preflightPath = path.join(repoRoot, 'scripts', 'reliant-ux-preflight.mjs');

function runNode(scriptPath, args, expectedCode = 0) {
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

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reliant-next-action-test-'));
  const queuePath = path.join(tempDir, '.reliant/queue/mvp-lane-d-ux-automation-batch16.json');
  const runtimePath = path.join(tempDir, '.reliant/runtime/current-task-lane-d-ux-batch16.json');

  writeJson(queuePath, {
    version: 1,
    tasks: [
      {
        id: 'UX1',
        title: 'UX task',
        prompt: 'Execute one MVP slice only',
        verifyCommand: 'pnpm run docs:lint',
        status: 'queued',
      },
    ],
  });

  const preflightOk = runNode(preflightPath, ['--queue', '.reliant/queue/mvp-lane-d-ux-automation-batch16.json']);
  const preflightOkJson = JSON.parse(preflightOk.stdout);
  assert.equal(preflightOkJson.applicable, true);
  assert.equal(preflightOkJson.ok, true);
  assert.equal(preflightOkJson.requiredFiles.length, 5);

  const nextActionOk = runNode(nextActionPath, ['--queue', queuePath, '--runtime', runtimePath, '--output', 'json']);
  const nextActionOkJson = JSON.parse(nextActionOk.stdout);
  assert.equal(nextActionOkJson.state, 'claim_next');
  assert.equal(nextActionOkJson.uxPreflight.ok, true);
  assert.equal(nextActionOkJson.uxPreflight.applicable, true);

  const missingLockPath = path.join(repoRoot, 'docs/solutions/MVP_UX_MASTER_LOCK_R1.md');
  const tempLockPath = path.join(repoRoot, 'docs/solutions/MVP_UX_MASTER_LOCK_R1.md.test-backup');
  fs.renameSync(missingLockPath, tempLockPath);
  try {
    const preflightFail = runNode(preflightPath, ['--queue', '.reliant/queue/mvp-lane-d-ux-automation-batch16.json'], 1);
    const preflightFailJson = JSON.parse(preflightFail.stdout);
    assert.equal(preflightFailJson.ok, false);
    assert.match(preflightFailJson.failureReasons.join('\n'), /MVP_UX_MASTER_LOCK_R1\.md: missing/);

    const nextActionFail = runNode(nextActionPath, ['--queue', queuePath, '--runtime', runtimePath, '--output', 'json']);
    const nextActionFailJson = JSON.parse(nextActionFail.stdout);
    assert.equal(nextActionFailJson.state, 'blocked_preflight');
    assert.equal(nextActionFailJson.uxPreflight.ok, false);
    assert.match(nextActionFailJson.warnings.join('\n'), /ux-preflight failed/);
  } finally {
    fs.renameSync(tempLockPath, missingLockPath);
  }

  const nonUxQueuePath = path.join(tempDir, '.reliant/queue/mvp-lane-d-automation-backlog.json');
  writeJson(nonUxQueuePath, {
    version: 1,
    tasks: [
      {
        id: 'AUTO1',
        title: 'Automation task',
        prompt: 'Automation task',
        status: 'queued',
      },
    ],
  });
  const nonUxPreflight = runNode(preflightPath, ['--queue', '.reliant/queue/mvp-lane-d-automation-backlog.json']);
  const nonUxPreflightJson = JSON.parse(nonUxPreflight.stdout);
  assert.equal(nonUxPreflightJson.applicable, false);
  assert.equal(nonUxPreflightJson.ok, true);
}

main();
