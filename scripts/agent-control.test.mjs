#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const scriptPath = path.join(repoRoot, 'scripts', 'agent-control.mjs');
const lanesPath = path.join(repoRoot, 'docs', 'handoff', 'agent-control', 'lanes.json');

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
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-control-test-'));
  const queuePath = path.join(tempDir, 'queue.json');

  run(['init', '--queue', queuePath, '--lanes', lanesPath]);

  run([
    'assign',
    '--queue',
    queuePath,
    '--lanes',
    lanesPath,
    '--id',
    'T1',
    '--title',
    'First task',
    '--lane',
    'api-schema',
    '--priority',
    '200',
  ]);

  run([
    'assign',
    '--queue',
    queuePath,
    '--lanes',
    lanesPath,
    '--id',
    'T2',
    '--title',
    'Second task',
    '--lane',
    'api-schema',
    '--depends-on',
    'T1',
    '--priority',
    '100',
  ]);

  const claimedOne = run([
    'claim',
    '--queue',
    queuePath,
    '--lanes',
    lanesPath,
    '--lane',
    'api-schema',
    '--agent',
    'codex-api-1',
    '--json',
  ]);
  const claimedOneJson = JSON.parse(claimedOne.stdout);
  assert.equal(claimedOneJson.task.id, 'T1');

  run([
    'complete',
    '--queue',
    queuePath,
    '--lanes',
    lanesPath,
    '--id',
    'T1',
    '--agent',
    'codex-api-1',
    '--branch',
    'lane-api/T1',
    '--commit',
    'abc123',
    '--report',
    'docs/handoff/reports/t1.md',
  ]);

  const claimedTwo = run([
    'claim',
    '--queue',
    queuePath,
    '--lanes',
    lanesPath,
    '--lane',
    'api-schema',
    '--agent',
    'codex-api-2',
    '--json',
  ]);
  const claimedTwoJson = JSON.parse(claimedTwo.stdout);
  assert.equal(claimedTwoJson.task.id, 'T2');

  run([
    'block',
    '--queue',
    queuePath,
    '--lanes',
    lanesPath,
    '--id',
    'T2',
    '--agent',
    'codex-api-2',
    '--reason',
    'Waiting on schema approval',
  ]);

  const polled = run(['poll', '--queue', queuePath, '--lanes', lanesPath, '--json']);
  const polledJson = JSON.parse(polled.stdout);
  assert.equal(polledJson.needingReview.length, 2);
  assert.equal(polledJson.blocked.length, 1);
  assert.equal(polledJson.summary.total, 2);

  run(['ack', '--queue', queuePath, '--lanes', lanesPath, '--id', 'T1']);
  run(['ack', '--queue', queuePath, '--lanes', lanesPath, '--id', 'T2']);

  const status = run(['status', '--queue', queuePath, '--lanes', lanesPath, '--json', '--all']);
  const statusJson = JSON.parse(status.stdout);
  const t1 = statusJson.tasks.find((task) => task.id === 'T1');
  const t2 = statusJson.tasks.find((task) => task.id === 'T2');

  assert.equal(t1.status, 'done');
  assert.equal(t1.needsReview, false);
  assert.equal(t2.status, 'blocked');
  assert.equal(t2.needsReview, false);
}

main();
