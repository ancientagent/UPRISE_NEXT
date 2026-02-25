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

function runExpectFail(args, expectedMessage) {
  const result = run(args, 1);
  if (expectedMessage) {
    assert.ok(
      result.stderr.includes(expectedMessage),
      `Expected stderr to include "${expectedMessage}" but got:\n${result.stderr}`,
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

  const queueAfterAssign = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const assignedTask = queueAfterAssign.tasks.find((task) => task.id === 'T1');
  assert.ok(assignedTask.directives, 'directives should be auto-attached on assign');
  assert.equal(assignedTask.directives.version, '2026-02-25');
  assert.ok(
    assignedTask.directives.requiredReading.includes('docs/STRATEGY_CRITICAL_INFRA_NOTE.md'),
    'required reading should include strategy critical infra note',
  );
  assert.ok(
    assignedTask.directives.validationGate.includes('pnpm run docs:lint'),
    'validation gate should include docs lint',
  );
  assert.ok(
    assignedTask.directives.parallelGuardrails,
    'directives should include parallel guardrails',
  );
  assert.ok(
    assignedTask.directives.agentRoleProfiles['codex-orchestrator'],
    'directives should include orchestrator role profile',
  );

  const queueWithoutDirectives = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const t1Legacy = queueWithoutDirectives.tasks.find((task) => task.id === 'T1');
  const t2Legacy = queueWithoutDirectives.tasks.find((task) => task.id === 'T2');
  delete t1Legacy.directives.parallelGuardrails;
  delete t1Legacy.directives.agentRoleProfiles;
  delete t2Legacy.directives;
  fs.writeFileSync(queuePath, `${JSON.stringify(queueWithoutDirectives, null, 2)}\n`);

  run(['backfill-directives', '--queue', queuePath, '--lanes', lanesPath]);
  const queueAfterBackfill = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const t1AfterBackfill = queueAfterBackfill.tasks.find((task) => task.id === 'T1');
  const t2AfterBackfill = queueAfterBackfill.tasks.find((task) => task.id === 'T2');
  assert.ok(
    t1AfterBackfill.directives.parallelGuardrails,
    'backfill should patch missing directive guardrail blocks',
  );
  assert.ok(t2AfterBackfill.directives, 'directives should be backfilled for legacy tasks');

  run([
    'assign',
    '--queue',
    queuePath,
    '--lanes',
    lanesPath,
    '--id',
    'SP1',
    '--title',
    'Spawn parent',
    '--lane',
    'api-schema',
    '--allow-spawn',
    '--max-children',
    '2',
    '--max-depth',
    '1',
  ]);

  runExpectFail(
    [
      'assign',
      '--queue',
      queuePath,
      '--lanes',
      lanesPath,
      '--id',
      'SP1-C0',
      '--title',
      'Child without parent dependency',
      '--lane',
      'docs-program',
      '--parent-id',
      'SP1',
      '--planned-report',
      'docs/handoff/reports/sp1-c0.md',
      '--rollback-note',
      'Revert child if needed',
    ],
    'must include --depends-on SP1',
  );

  runExpectFail(
    [
      'assign',
      '--queue',
      queuePath,
      '--lanes',
      lanesPath,
      '--id',
      'SP1-C0B',
      '--title',
      'Child missing report',
      '--lane',
      'docs-program',
      '--parent-id',
      'SP1',
      '--depends-on',
      'SP1',
      '--rollback-note',
      'Revert child if needed',
    ],
    'requires --planned-report',
  );

  run([
    'assign',
    '--queue',
    queuePath,
    '--lanes',
    lanesPath,
    '--id',
    'SP1-C1',
    '--title',
    'First child',
    '--lane',
    'docs-program',
    '--parent-id',
    'SP1',
    '--depends-on',
    'SP1',
    '--allow-spawn',
    '--max-depth',
    '1',
    '--planned-report',
    'docs/handoff/reports/sp1-c1.md',
    '--rollback-note',
    'Revert child if needed',
  ]);

  run([
    'assign',
    '--queue',
    queuePath,
    '--lanes',
    lanesPath,
    '--id',
    'SP1-C2',
    '--title',
    'Second child',
    '--lane',
    'review-risk',
    '--parent-id',
    'SP1',
    '--depends-on',
    'SP1',
    '--planned-report',
    'docs/handoff/reports/sp1-c2.md',
    '--rollback-note',
    'Revert child if needed',
  ]);

  runExpectFail(
    [
      'assign',
      '--queue',
      queuePath,
      '--lanes',
      lanesPath,
      '--id',
      'SP1-C3',
      '--title',
      'Third child should fail',
      '--lane',
      'docs-program',
      '--parent-id',
      'SP1',
      '--depends-on',
      'SP1',
      '--planned-report',
      'docs/handoff/reports/sp1-c3.md',
      '--rollback-note',
      'Revert child if needed',
    ],
    'already has 2 children',
  );

  runExpectFail(
    [
      'assign',
      '--queue',
      queuePath,
      '--lanes',
      lanesPath,
      '--id',
      'SP1-C1-G1',
      '--title',
      'Grandchild should fail depth guard',
      '--lane',
      'docs-program',
      '--parent-id',
      'SP1-C1',
      '--depends-on',
      'SP1-C1',
      '--planned-report',
      'docs/handoff/reports/sp1-c1-g1.md',
      '--rollback-note',
      'Revert child if needed',
    ],
    'exceeds parent SP1-C1 max depth',
  );

  runExpectFail(
    [
      'assign',
      '--queue',
      queuePath,
      '--lanes',
      lanesPath,
      '--id',
      'SP-NON-ORCH',
      '--title',
      'Non orchestrator spawn',
      '--lane',
      'api-schema',
      '--assigned-by',
      'codex-api-1',
      '--allow-spawn',
    ],
    'Only orchestrator identities can assign tasks with --allow-spawn',
  );

  const queueAfterGuardrailAssign = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const spawnParent = queueAfterGuardrailAssign.tasks.find((task) => task.id === 'SP1');
  const spawnChildOne = queueAfterGuardrailAssign.tasks.find((task) => task.id === 'SP1-C1');
  assert.deepEqual(spawnParent.children, ['SP1-C1', 'SP1-C2']);
  assert.equal(spawnChildOne.depth, 1);
  assert.equal(spawnChildOne.parentId, 'SP1');
  assert.equal(spawnChildOne.planned.reportPath, 'docs/handoff/reports/sp1-c1.md');
  assert.equal(spawnChildOne.planned.rollbackNote, 'Revert child if needed');

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
  assert.equal(polledJson.summary.total, 5);

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
