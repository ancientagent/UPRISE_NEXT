#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const scriptPath = path.join(repoRoot, 'scripts', 'reliant-slice-queue.mjs');

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
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reliant-slice-queue-test-'));
  const queuePath = path.join(tempDir, 'queue.json');
  const runtimePath = path.join(tempDir, 'runtime.json');

  const queue = {
    version: 1,
    tasks: [
      {
        id: 'T1',
        title: 'Task 1',
        prompt: 'Test task',
        verifyCommand: 'echo ok',
        status: 'queued',
      },
    ],
  };
  fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`);

  const claimResult = run(['claim', '--queue', queuePath, '--runtime', runtimePath]);
  const claimJson = JSON.parse(claimResult.stdout);
  assert.equal(claimJson.resultCode, 'claimed_new_task');
  assert.equal(claimJson.task.sourceQueue, null);
  const guardMismatch = run(['complete', '--queue', queuePath, '--runtime', runtimePath, '--task-id', 'WRONG-ID'], 4);
  assert.match(guardMismatch.stderr, /task-id guard mismatch/);
  const completeResult = run(['complete', '--queue', queuePath, '--runtime', runtimePath, '--report', 'docs/handoff/test.md']);
  const completeJson = JSON.parse(completeResult.stdout);
  assert.equal(completeJson.resultCode, 'completed');
  assert.equal(typeof completeJson.updatedAt, 'string');
  const completedQueueJson = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  assert.equal(completedQueueJson.tasks[0].finishedAt, completedQueueJson.tasks[0].updatedAt);

  const completeAgain = run(
    ['complete', '--queue', queuePath, '--runtime', runtimePath, '--report', 'docs/handoff/test.md'],
    0,
  );
  const completeAgainJson = JSON.parse(completeAgain.stdout);
  assert.equal(completeAgainJson.resultCode, 'complete_idempotent');
  assert.equal(completeAgainJson.idempotent, true);
  assert.equal(typeof completeAgainJson.updatedAt, 'string');

  const blockDone = run(['block', '--queue', queuePath, '--runtime', runtimePath, '--reason', 'should-fail'], 4);
  assert.match(blockDone.stderr, /cannot block task/);

  const blockQueuePath = path.join(tempDir, 'block-queue.json');
  const blockRuntimePath = path.join(tempDir, 'block-runtime.json');
  fs.writeFileSync(
    blockQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        tasks: [{ id: 'B1', title: 'Block me', prompt: 'Block me', verifyCommand: 'echo ok', status: 'in_progress' }],
      },
      null,
      2,
    )}\n`,
  );
  fs.writeFileSync(blockRuntimePath, `${JSON.stringify({ taskId: 'B1' }, null, 2)}\n`);
  const blockResult = run(['block', '--queue', blockQueuePath, '--runtime', blockRuntimePath, '--reason', 'test-block']);
  const blockJson = JSON.parse(blockResult.stdout);
  assert.equal(blockJson.resultCode, 'blocked');
  assert.equal(typeof blockJson.updatedAt, 'string');
  const blockedQueueJson = JSON.parse(fs.readFileSync(blockQueuePath, 'utf8'));
  assert.equal(blockedQueueJson.tasks[0].blockedAt, blockedQueueJson.tasks[0].updatedAt);

  const staleQueue = {
    version: 1,
    tasks: [
      { id: 'A', title: 'A', prompt: 'A', verifyCommand: 'echo', status: 'queued' },
      { id: 'B', title: 'B', prompt: 'B', verifyCommand: 'echo', status: 'in_progress' },
    ],
  };
  const staleQueuePath = path.join(tempDir, 'stale-queue.json');
  const staleRuntimePath = path.join(tempDir, 'stale-runtime.json');
  fs.writeFileSync(staleQueuePath, `${JSON.stringify(staleQueue, null, 2)}\n`);
  fs.writeFileSync(staleRuntimePath, `${JSON.stringify({ taskId: 'A' }, null, 2)}\n`);

  const staleComplete = run(['complete', '--queue', staleQueuePath, '--runtime', staleRuntimePath], 4);
  assert.match(staleComplete.stderr, /expected "in_progress"/);
  const staleNext = run(['next', '--queue', staleQueuePath, '--runtime', staleRuntimePath], 0);
  const staleNextJson = JSON.parse(staleNext.stdout);
  assert.equal(typeof staleNextJson.generatedAt, 'string');
  assert.equal(staleNextJson.action, 'execute_in_progress');
  assert.equal(staleNextJson.taskId, 'B');

  const statusResult = run(['status', '--queue', staleQueuePath, '--runtime', staleRuntimePath], 0);
  const statusJson = JSON.parse(statusResult.stdout);
  assert.equal(statusJson.summarySanity.hasPersistedSummary, false);
  assert.equal(statusJson.summarySanity.isDrifting, false);
  assert.equal(statusJson.summarySanity.severity, 'none');
  assert.equal(statusJson.summarySanity.persisted, null);
  assert.equal(statusJson.summarySanity.actual.total, 2);
  assert.equal(statusJson.summarySanity.driftCount, 0);
  assert.equal(statusJson.summarySanity.driftFingerprint, 'none');
  assert.equal(statusJson.runtime.exists, true);
  assert.equal(statusJson.runtime.valid, true);
  assert.equal(statusJson.runtime.taskId, 'A');
  assert.equal(statusJson.runtime.matchesInProgress, false);
  assert.equal(statusJson.runtime.health, 'mismatch');
  assert.equal(statusJson.runtime.checksumSha256, null);
  assert.equal(statusJson.runtime.checksumAlgorithm, null);
  assert.equal(statusJson.runtime.checksumMode, 'none');
  assert.equal(statusJson.runtime.checksumPresent, false);
  assert.equal(typeof statusJson.runtime.sizeBytes, 'number');
  assert.equal(statusJson.runtime.parseErrorKind, null);
  assert.equal(statusJson.ownership.canClaim, false);
  assert.deepEqual(statusJson.reportCoverage.doneWithoutReportTaskIds, []);

  const validateResult = run(['validate', '--queue', queuePath], 0);
  const validateJson = JSON.parse(validateResult.stdout);
  assert.equal(validateJson.statusCounts.done, 1);
  assert.equal(validateJson.transitionSanity.applicable, false);
  assert.equal(validateJson.transitionSanity.ok, true);

  const alreadyInProgressQueuePath = path.join(tempDir, 'already-in-progress-queue.json');
  const alreadyInProgressRuntimePath = path.join(tempDir, 'already-in-progress-runtime.json');
  fs.writeFileSync(
    alreadyInProgressQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        tasks: [
          { id: 'IP1', title: 'In Progress', prompt: 'IP1', verifyCommand: 'echo', status: 'in_progress' },
          { id: 'Q2', title: 'Queued', prompt: 'Q2', verifyCommand: 'echo', status: 'queued' },
        ],
      },
      null,
      2,
    )}\n`,
  );
  fs.writeFileSync(
    alreadyInProgressRuntimePath,
    `${JSON.stringify({ taskId: 'IP1', claimedAt: '2026-02-27T00:00:00.000Z' }, null, 2)}\n`,
  );
  const alreadyInProgressClaim = run(
    ['claim', '--queue', alreadyInProgressQueuePath, '--runtime', alreadyInProgressRuntimePath],
    0,
  );
  const alreadyInProgressClaimJson = JSON.parse(alreadyInProgressClaim.stdout);
  assert.equal(alreadyInProgressClaimJson.claimed, false);
  assert.equal(alreadyInProgressClaimJson.refusalCode, 'in_progress_active');
  assert.equal(alreadyInProgressClaimJson.resultCode, 'in_progress_active');
  assert.equal(alreadyInProgressClaimJson.task.taskId, 'IP1');

  const mismatchClaim = run(
    ['claim', '--queue', alreadyInProgressQueuePath, '--runtime', runtimePath],
    4,
  );
  const mismatchClaimJson = JSON.parse(mismatchClaim.stdout);
  assert.equal(mismatchClaimJson.refusalCode, 'runtime_mismatch_for_in_progress');
  assert.equal(mismatchClaimJson.resultCode, 'runtime_mismatch_for_in_progress');
  assert.equal(mismatchClaimJson.inProgressTaskId, 'IP1');
  assert.equal(mismatchClaimJson.runtimeTaskId, 'T1');
  const mismatchClaimWithRetry = run(
    ['claim', '--queue', alreadyInProgressQueuePath, '--runtime', runtimePath, '--retry-ms', '1'],
    4,
  );
  const mismatchClaimWithRetryJson = JSON.parse(mismatchClaimWithRetry.stdout);
  assert.equal(mismatchClaimWithRetryJson.refusalCode, 'runtime_mismatch_for_in_progress');
  assert.equal(mismatchClaimWithRetryJson.retryAttempted, true);
  fs.writeFileSync(runtimePath, `${JSON.stringify({ notTaskId: 'X' }, null, 2)}\n`);
  const invalidRuntimeClaim = run(
    ['claim', '--queue', alreadyInProgressQueuePath, '--runtime', runtimePath],
    5,
  );
  const invalidRuntimeClaimJson = JSON.parse(invalidRuntimeClaim.stdout);
  assert.equal(invalidRuntimeClaimJson.refusalCode, 'runtime_invalid_payload');
  assert.match(invalidRuntimeClaimJson.detail, /missing required taskId/);

  const missingRuntimeForInProgressPath = path.join(tempDir, 'missing-runtime-in-progress-queue.json');
  fs.writeFileSync(
    missingRuntimeForInProgressPath,
    `${JSON.stringify(
      {
        version: 1,
        tasks: [{ id: 'MR1', title: 'MR1', prompt: 'MR1', verifyCommand: 'echo', status: 'in_progress' }],
      },
      null,
      2,
    )}\n`,
  );
  const missingRuntimeForInProgress = run(
    ['claim', '--queue', missingRuntimeForInProgressPath, '--runtime', path.join(tempDir, 'missing-runtime.json')],
    4,
  );
  const missingRuntimeForInProgressJson = JSON.parse(missingRuntimeForInProgress.stdout);
  assert.equal(missingRuntimeForInProgressJson.refusalCode, 'runtime_missing_for_in_progress');
  assert.equal(missingRuntimeForInProgressJson.resultCode, 'runtime_missing_for_in_progress');

  const invalidRuntimeStatus = run(
    ['status', '--queue', alreadyInProgressQueuePath, '--runtime', runtimePath],
    0,
  );
  const invalidRuntimeStatusJson = JSON.parse(invalidRuntimeStatus.stdout);
  assert.equal(invalidRuntimeStatusJson.runtime.health, 'invalid');
  assert.equal(invalidRuntimeStatusJson.runtime.parseErrorKind, 'runtime_shape_missing_task_id');
  assert.equal(typeof invalidRuntimeStatusJson.runtime.checksumSha256, 'string');
  assert.equal(invalidRuntimeStatusJson.runtime.checksumAlgorithm, 'sha256');
  assert.equal(invalidRuntimeStatusJson.runtime.checksumMode, 'invalid_runtime_auto');
  assert.equal(invalidRuntimeStatusJson.runtime.checksumPresent, true);
  assert.equal(invalidRuntimeStatusJson.runtime.checksumSha256.length, 64);

  const invalidQueuePath = path.join(tempDir, 'invalid-queue.json');
  fs.writeFileSync(
    invalidQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        tasks: [
          { id: 'X', title: 'X', prompt: 'X', status: 'queued' },
          { id: 'X', title: 'Dup', prompt: 'Dup', status: 'queued' },
        ],
      },
      null,
      2,
    )}\n`,
  );
  const invalidResult = run(['validate', '--queue', invalidQueuePath], 1);
  assert.match(invalidResult.stderr, /duplicate task id/);

  const multiInProgressQueuePath = path.join(tempDir, 'multi-in-progress-queue.json');
  fs.writeFileSync(
    multiInProgressQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        tasks: [
          { id: 'M1', title: 'M1', prompt: 'M1', status: 'in_progress' },
          { id: 'M2', title: 'M2', prompt: 'M2', status: 'in_progress' },
        ],
      },
      null,
      2,
    )}\n`,
  );
  const multiInProgressResult = run(['validate', '--queue', multiInProgressQueuePath], 1);
  assert.match(multiInProgressResult.stderr, /maximum allowed: 1/);

  const uxQueuePath = path.join(tempDir, '.reliant/queue/mvp-lane-d-ux-automation-batch16.json');
  const uxRuntimePath = path.join(tempDir, '.reliant/runtime/current-task-lane-d-ux-batch16.json');
  fs.mkdirSync(path.dirname(uxQueuePath), { recursive: true });
  fs.mkdirSync(path.dirname(uxRuntimePath), { recursive: true });
  fs.writeFileSync(
    uxQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        tasks: [
          {
            id: 'UX-BAD-1',
            title: 'Broken queued task',
            prompt: 'Broken queued task',
            verifyCommand: 'echo ok',
            status: 'queued',
            finishedAt: '2026-03-15T00:00:00.000Z',
          },
        ],
      },
      null,
      2,
    )}\n`,
  );
  const uxValidate = run(['validate', '--queue', uxQueuePath], 1);
  assert.match(uxValidate.stderr, /transition sanity failure/);
  const uxClaim = run(['claim', '--queue', uxQueuePath, '--runtime', uxRuntimePath], 4);
  const uxClaimJson = JSON.parse(uxClaim.stdout);
  assert.equal(uxClaimJson.refusalCode, 'queue_transition_sanity_failed');
  assert.equal(uxClaimJson.transitionSanity.applicable, true);
  assert.equal(uxClaimJson.transitionSanity.ok, false);
  const uxStatus = run(['status', '--queue', uxQueuePath, '--runtime', uxRuntimePath], 0);
  const uxStatusJson = JSON.parse(uxStatus.stdout);
  assert.equal(uxStatusJson.transitionSanity.applicable, true);
  assert.equal(uxStatusJson.transitionSanity.ok, false);
  assert.equal(uxStatusJson.transitionSanity.issueCount, 1);
  assert.deepEqual(uxStatusJson.transitionSanity.issues[0].issues, ['queued_has_finishedAt']);

  const finishedQueuePath = path.join(tempDir, 'finished-queue.json');
  fs.writeFileSync(
    finishedQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        tasks: [{ id: 'F1', title: 'F1', prompt: 'F1', status: 'done', reportPath: 'docs/handoff/f1.md' }],
      },
      null,
      2,
    )}\n`,
  );
  const finishedNext = run(['next', '--queue', finishedQueuePath], 0);
  const finishedNextJson = JSON.parse(finishedNext.stdout);
  assert.equal(typeof finishedNextJson.generatedAt, 'string');
  assert.equal(finishedNextJson.action, 'no_queued_tasks');
  const noQueuedClaim = run(['claim', '--queue', finishedQueuePath], 10);
  const noQueuedClaimJson = JSON.parse(noQueuedClaim.stdout);
  assert.equal(noQueuedClaimJson.refusalCode, 'no_queued_tasks');
  assert.equal(noQueuedClaimJson.resultCode, 'no_queued_tasks');

  const persistedSummaryQueuePath = path.join(tempDir, 'persisted-summary-queue.json');
  fs.writeFileSync(
    persistedSummaryQueuePath,
    `${JSON.stringify(
      {
        version: 1,
        summary: { total: 2, queued: 2, in_progress: 0, done: 0, blocked: 0 },
        tasks: [{ id: 'S1', title: 'S1', prompt: 'S1', status: 'queued' }],
      },
      null,
      2,
    )}\n`,
  );
  const persistedStatus = run(['status', '--queue', persistedSummaryQueuePath], 0);
  const persistedStatusJson = JSON.parse(persistedStatus.stdout);
  assert.equal(persistedStatusJson.summarySanity.hasPersistedSummary, true);
  assert.equal(persistedStatusJson.summarySanity.isDrifting, true);
  assert.equal(persistedStatusJson.summarySanity.severity, 'high');
  assert.equal(persistedStatusJson.summarySanity.persisted.total, 2);
  assert.equal(persistedStatusJson.summarySanity.actual.total, 1);
  assert.equal(persistedStatusJson.summarySanity.driftCount, 2);
  assert.deepEqual(persistedStatusJson.summarySanity.driftKeys, ['total', 'queued']);
  assert.deepEqual(persistedStatusJson.summarySanity.driftDeltas.total, { declared: 2, actual: 1, delta: -1 });
  assert.deepEqual(persistedStatusJson.summarySanity.driftDeltas.queued, { declared: 2, actual: 1, delta: -1 });
  assert.equal(
    persistedStatusJson.summarySanity.driftFingerprint,
    'total:declared=2:actual=1|queued:declared=2:actual=1',
  );

  const statusWithChecksum = run(
    ['status', '--queue', staleQueuePath, '--runtime', staleRuntimePath, '--runtime-checksum'],
    0,
  );
  const statusWithChecksumJson = JSON.parse(statusWithChecksum.stdout);
  assert.equal(typeof statusWithChecksumJson.runtime.checksumSha256, 'string');
  assert.equal(statusWithChecksumJson.runtime.checksumAlgorithm, 'sha256');
  assert.equal(statusWithChecksumJson.runtime.checksumMode, 'explicit');
  assert.equal(statusWithChecksumJson.runtime.checksumPresent, true);
  assert.equal(statusWithChecksumJson.runtime.checksumSha256.length, 64);
}

main();
