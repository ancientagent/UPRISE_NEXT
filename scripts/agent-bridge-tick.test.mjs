#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const SCRIPT = path.join(ROOT, 'scripts', 'agent-bridge-tick.mjs');

function run(args, expectedExit = 0) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (result.status !== expectedExit) {
    throw new Error(
      `Unexpected exit code: ${result.status}\ncmd=node ${SCRIPT} ${args.join(' ')}\nstdout=${result.stdout}\nstderr=${result.stderr}`,
    );
  }
  return result;
}

function parseOutputPath(stdout, key) {
  const line = stdout
    .split('\n')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${key}=`));
  assert.ok(line, `Missing ${key} output`);
  return line.slice(`${key}=`.length);
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-bridge-tick-test-'));
  const queuePath = path.join(tempDir, 'queue.json');
  const lanesPath = path.join(tempDir, 'lanes.json');
  const outputDir = path.join(tempDir, 'out');

  writeJson(lanesPath, {
    version: 1,
    lanes: [{ id: 'api-schema' }, { id: 'qa-ci' }],
  });

  writeJson(queuePath, {
    version: 1,
    tasks: [
      {
        id: 'A',
        title: 'done task',
        lane: 'api-schema',
        status: 'done',
        dependsOn: [],
      },
      {
        id: 'B',
        title: 'claimable task',
        lane: 'qa-ci',
        status: 'queued',
        dependsOn: ['A'],
      },
      {
        id: 'C',
        title: 'not claimable task',
        lane: 'qa-ci',
        status: 'queued',
        dependsOn: ['MISSING'],
      },
      {
        id: 'D',
        title: 'stale in progress',
        lane: 'api-schema',
        status: 'in_progress',
        dependsOn: [],
        claimedBy: 'codex-api',
        claimedAt: '2026-02-20T00:00:00.000Z',
      },
      {
        id: 'E',
        title: 'blocked',
        lane: 'qa-ci',
        status: 'blocked',
        dependsOn: [],
        blockerReason: 'test blocker',
      },
      {
        id: 'F',
        title: 'needs review',
        lane: 'qa-ci',
        status: 'done',
        needsReview: true,
      },
    ],
  });

  const runResult = run([
    '--queue',
    queuePath,
    '--lanes',
    lanesPath,
    '--output-dir',
    outputDir,
    '--stale-minutes',
    '1',
    '--label',
    'test',
  ]);

  const summaryJsonRel = parseOutputPath(runResult.stdout, 'summary_json');
  const summaryJsonPath = path.join(ROOT, summaryJsonRel);
  const summary = JSON.parse(fs.readFileSync(summaryJsonPath, 'utf8'));

  assert.equal(summary.summary.total, 6);
  assert.equal(summary.summary.queued, 2);
  assert.equal(summary.summary.in_progress, 1);
  assert.equal(summary.summary.done, 2);
  assert.equal(summary.summary.blocked, 1);

  assert.equal(summary.claimableTasks.length, 1);
  assert.equal(summary.claimableTasks[0].id, 'B');
  assert.equal(summary.reviewTasks.length, 1);
  assert.equal(summary.reviewTasks[0].id, 'F');
  assert.equal(summary.blockedTasks.length, 1);
  assert.equal(summary.blockedTasks[0].id, 'E');
  assert.equal(summary.staleInProgressTasks.length, 1);
  assert.equal(summary.staleInProgressTasks[0].id, 'D');

  run(
    [
      '--queue',
      queuePath,
      '--lanes',
      lanesPath,
      '--output-dir',
      outputDir,
      '--stale-minutes',
      '1',
      '--fail-on-blocked',
    ],
    2,
  );
}

main();
