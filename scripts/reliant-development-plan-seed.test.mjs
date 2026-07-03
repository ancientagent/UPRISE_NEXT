#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const scriptPath = path.join(repoRoot, 'scripts', 'reliant-development-plan-seed.mjs');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reliant-development-plan-seed-test-'));

const result = spawnSync(process.execPath, [scriptPath], {
  cwd: tempDir,
  encoding: 'utf8',
});

assert.equal(result.status, 0, result.stderr || result.stdout);
assert.match(result.stdout, /Seeded .*uprise-development-plan-r1\.json/);

const queuePath = path.join(tempDir, '.reliant', 'queue', 'uprise-development-plan-r1.json');
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

assert.equal(queue.version, 1);
assert.equal(queue.lane, 'uprise-development-plan-r1');
assert.equal(queue.sourcePlan, 'docs/operations/UPRISE_DEVELOPMENT_PLAN_R1.md');
assert.equal(queue.summary.total, 8);
assert.equal(queue.summary.queued, 8);
assert.equal(queue.summary.in_progress, 0);
assert.equal(queue.summary.done, 0);
assert.equal(queue.summary.blocked, 0);
assert.equal(queue.tasks.length, 8);
assert.deepEqual(
  queue.tasks.map((task) => task.id),
  [
    'UPRISE-PLAN-001',
    'UPRISE-PLAN-002',
    'UPRISE-PLAN-003',
    'UPRISE-PLAN-004',
    'UPRISE-PLAN-005',
    'UPRISE-PLAN-006',
    'UPRISE-PLAN-007',
    'UPRISE-PLAN-008',
  ],
);
assert.equal(queue.tasks[0].status, 'queued');
assert.match(queue.tasks[0].prompt, /Blast cards are Feed card types/);
assert.match(queue.tasks[0].verifyCommand, /plot-ux-regression-lock\.test\.ts/);
assert.ok(queue.tasks.every((task) => task.sourcePlan === queue.sourcePlan));
assert.ok(queue.tasks.every((task) => task.verifyCommand.includes('pnpm run workspace:audit')));

fs.rmSync(tempDir, { recursive: true, force: true });
