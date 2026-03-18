#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const UX_BATCH_QUEUE_PATTERN = /(^|\/)mvp-lane-[a-e]-ux-[^/]*batch(16|17)\.json$/;

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const tmpPath = path.join(dir, `.${path.basename(filePath)}.tmp-${process.pid}-${Date.now()}`);
  fs.writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  fs.renameSync(tmpPath, filePath);
}

function nowIso() {
  return new Date().toISOString();
}

function computeSummary(tasks) {
  return tasks.reduce(
    (acc, task) => {
      acc.total += 1;
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { total: 0, queued: 0, in_progress: 0, done: 0, blocked: 0 },
  );
}

function syncQueueSummary(queue) {
  queue.summary = computeSummary(queue.tasks);
}

function sleepMs(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return;
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function ensureRuntimeShape(runtime, runtimePath) {
  if (!runtime || typeof runtime !== 'object') {
    throw new Error(`runtime must be an object: ${runtimePath}`);
  }
  if (typeof runtime.taskId !== 'string' || runtime.taskId.trim() === '') {
    throw new Error(`runtime missing required taskId: ${runtimePath}`);
  }
}

function readRuntimeOrExit(runtimePath) {
  try {
    const runtime = readJson(runtimePath);
    ensureRuntimeShape(runtime, runtimePath);
    return runtime;
  } catch (error) {
    console.error(
      `[reliant-slice-queue] invalid runtime file: ${runtimePath}\n` +
        `[reliant-slice-queue] ${error instanceof Error ? error.message : String(error)}\n` +
        `[reliant-slice-queue] hint: clear stale runtime and claim again`,
    );
    process.exit(5);
  }
}

function getArg(flag, fallback = null) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function requireArg(flag) {
  const value = getArg(flag);
  if (!value) {
    console.error(`[reliant-slice-queue] missing required argument: ${flag}`);
    process.exit(2);
  }
  return value;
}

const VALID_STATUSES = new Set(['queued', 'in_progress', 'done', 'blocked']);

function ensureQueueShape(queue) {
  if (!queue || typeof queue !== 'object' || !Array.isArray(queue.tasks)) {
    throw new Error('queue must be an object with a tasks array');
  }

  const seenIds = new Set();
  let inProgressCount = 0;
  for (const [index, task] of queue.tasks.entries()) {
    if (!task || typeof task !== 'object') {
      throw new Error(`task at index ${index} must be an object`);
    }
    if (typeof task.id !== 'string' || task.id.trim() === '') {
      throw new Error(`task at index ${index} is missing required string id`);
    }
    if (seenIds.has(task.id)) {
      throw new Error(`duplicate task id detected: ${task.id}`);
    }
    seenIds.add(task.id);
    if (typeof task.title !== 'string' || task.title.trim() === '') {
      throw new Error(`task ${task.id} is missing required string title`);
    }
    if (typeof task.prompt !== 'string' || task.prompt.trim() === '') {
      throw new Error(`task ${task.id} is missing required string prompt`);
    }
    if (!VALID_STATUSES.has(task.status)) {
      throw new Error(`task ${task.id} has invalid status "${String(task.status)}"`);
    }
    if (task.status === 'in_progress') {
      inProgressCount += 1;
    }
    if (task.verifyCommand != null && typeof task.verifyCommand !== 'string') {
      throw new Error(`task ${task.id} verifyCommand must be string when provided`);
    }
  }
  if (inProgressCount > 1) {
    throw new Error(`queue has ${inProgressCount} in_progress tasks (maximum allowed: 1)`);
  }
}

function parseUxBatchQueue(queuePath) {
  const match = String(queuePath || '').match(UX_BATCH_QUEUE_PATTERN);
  if (!match) return null;
  return {
    batch: Number(match[2]),
  };
}

function appliesUxBatchTransitionGuard(queuePath) {
  return parseUxBatchQueue(queuePath) != null;
}

function isValidTimestamp(value) {
  return typeof value === 'string' && value.trim() !== '' && Number.isFinite(Date.parse(value));
}

function collectTransitionIssues(queue) {
  const issues = [];

  for (const task of queue.tasks) {
    const taskIssues = [];
    const startedAtValid = task.startedAt == null ? false : isValidTimestamp(task.startedAt);
    const finishedAtValid = task.finishedAt == null ? false : isValidTimestamp(task.finishedAt);
    const blockedAtValid = task.blockedAt == null ? false : isValidTimestamp(task.blockedAt);
    const updatedAtValid = task.updatedAt == null ? false : isValidTimestamp(task.updatedAt);

    if (task.startedAt != null && !startedAtValid) {
      taskIssues.push('startedAt_invalid');
    }
    if (task.finishedAt != null && !finishedAtValid) {
      taskIssues.push('finishedAt_invalid');
    }
    if (task.blockedAt != null && !blockedAtValid) {
      taskIssues.push('blockedAt_invalid');
    }
    if (task.updatedAt != null && !updatedAtValid) {
      taskIssues.push('updatedAt_invalid');
    }

    switch (task.status) {
      case 'queued':
        if (task.startedAt != null) taskIssues.push('queued_has_startedAt');
        if (task.finishedAt != null) taskIssues.push('queued_has_finishedAt');
        if (task.blockedAt != null) taskIssues.push('queued_has_blockedAt');
        break;
      case 'in_progress':
        if (task.startedAt == null) taskIssues.push('in_progress_missing_startedAt');
        if (task.finishedAt != null) taskIssues.push('in_progress_has_finishedAt');
        if (task.blockedAt != null) taskIssues.push('in_progress_has_blockedAt');
        break;
      case 'done':
        if (task.finishedAt == null) taskIssues.push('done_missing_finishedAt');
        if (task.blockedAt != null) taskIssues.push('done_has_blockedAt');
        break;
      case 'blocked':
        if (task.blockedAt == null) taskIssues.push('blocked_missing_blockedAt');
        if (task.finishedAt != null) taskIssues.push('blocked_has_finishedAt');
        break;
      default:
        break;
    }

    if (startedAtValid && finishedAtValid && Date.parse(task.finishedAt) < Date.parse(task.startedAt)) {
      taskIssues.push('finishedAt_before_startedAt');
    }
    if (startedAtValid && blockedAtValid && Date.parse(task.blockedAt) < Date.parse(task.startedAt)) {
      taskIssues.push('blockedAt_before_startedAt');
    }
    if (startedAtValid && updatedAtValid && Date.parse(task.updatedAt) < Date.parse(task.startedAt)) {
      taskIssues.push('updatedAt_before_startedAt');
    }
    if (finishedAtValid && updatedAtValid && Date.parse(task.updatedAt) < Date.parse(task.finishedAt)) {
      taskIssues.push('updatedAt_before_finishedAt');
    }
    if (blockedAtValid && updatedAtValid && Date.parse(task.updatedAt) < Date.parse(task.blockedAt)) {
      taskIssues.push('updatedAt_before_blockedAt');
    }

    if (taskIssues.length > 0) {
      issues.push({
        taskId: task.id,
        status: task.status,
        issues: taskIssues,
      });
    }
  }

  for (let index = 0; index < queue.tasks.length - 1; index += 1) {
    const current = queue.tasks[index];
    const next = queue.tasks[index + 1];
    const edgeIssues = [];

    if (current.status === 'queued' && next.status !== 'queued') {
      edgeIssues.push('queued_before_non_queued');
    }
    if (current.status === 'in_progress' && next.status !== 'queued') {
      edgeIssues.push('in_progress_before_non_queued');
    }

    if (edgeIssues.length > 0) {
      issues.push({
        taskId: current.id,
        status: current.status,
        edgeToTaskId: next.id,
        edgeToStatus: next.status,
        issues: edgeIssues,
      });
    }
  }

  return issues;
}

function getTransitionSanity(queuePath, queue) {
  const parsed = parseUxBatchQueue(queuePath);
  const applicable = parsed != null;
  const issues = applicable ? collectTransitionIssues(queue) : [];
  const reasonCodes = [...new Set(issues.flatMap((entry) => entry.issues))].sort();
  return {
    applicable,
    batch: parsed?.batch ?? null,
    issueCount: issues.length,
    issues,
    ok: issues.length === 0,
    reasonCodes,
    failureCode: issues.length === 0 ? null : 'queue_transition_sanity_failed',
  };
}

function exitOnTransitionSanityFailure(queuePath, queue, commandName) {
  const transitionSanity = getTransitionSanity(queuePath, queue);
  if (!transitionSanity.applicable || transitionSanity.ok) {
    return transitionSanity;
  }

  const issueSummary = transitionSanity.issues
    .map((entry) => `${entry.taskId}:${entry.issues.join(',')}`)
    .join('; ');
  console.error(
    `[reliant-slice-queue] ${commandName} blocked by UX batch transition sanity failure\n` +
      `[reliant-slice-queue] queue=${queuePath}\n` +
      `[reliant-slice-queue] failureCode=${transitionSanity.failureCode}\n` +
      `[reliant-slice-queue] issues=${issueSummary}\n` +
      `[reliant-slice-queue] hint: repair impossible task status/timestamp transitions before continuing`,
  );
  process.exit(4);
}

function claimTask(queuePath, runtimePath, retryMs = 0, retryAttempted = false) {
  const queue = readJson(queuePath);
  ensureQueueShape(queue);
  const transitionSanity = getTransitionSanity(queuePath, queue);
  const emitClaimRefusal = (refusalCode, message, exitCode, extra = {}) => {
    process.stdout.write(JSON.stringify({ claimed: false, refusalCode, resultCode: refusalCode, message, ...extra }));
    process.exit(exitCode);
  };

  if (transitionSanity.applicable && !transitionSanity.ok) {
    emitClaimRefusal('queue_transition_sanity_failed', 'queue blocked by UX batch transition sanity failure', 4, {
      transitionSanity,
    });
  }

  const inProgressTasks = queue.tasks.filter((t) => t.status === 'in_progress');
  if (inProgressTasks.length > 1) {
    const ids = inProgressTasks.map((task) => task.id);
    emitClaimRefusal('multiple_in_progress', 'multiple in_progress tasks detected', 4, {
      taskIds: ids,
    });
  }

  if (inProgressTasks.length === 1) {
    const activeTask = inProgressTasks[0];
    const runtimeExists = fs.existsSync(runtimePath);
    if (!runtimeExists) {
      if (retryMs > 0 && !retryAttempted) {
        sleepMs(retryMs);
        claimTask(queuePath, runtimePath, retryMs, true);
        return;
      }
      emitClaimRefusal('runtime_missing_for_in_progress', 'runtime file missing for active in-progress task', 4, {
        taskId: activeTask.id,
        runtimePath,
        retryAttempted,
      });
    }

    let runtime;
    try {
      runtime = readJson(runtimePath);
      ensureRuntimeShape(runtime, runtimePath);
    } catch (error) {
      emitClaimRefusal('runtime_invalid_payload', 'invalid runtime file for active in-progress task', 5, {
        runtimePath,
        detail: error instanceof Error ? error.message : String(error),
      });
      return;
    }
    if (runtime.taskId !== activeTask.id) {
      if (retryMs > 0 && !retryAttempted) {
        sleepMs(retryMs);
        claimTask(queuePath, runtimePath, retryMs, true);
        return;
      }
      emitClaimRefusal('runtime_mismatch_for_in_progress', 'queue/runtime mismatch during claim', 4, {
        inProgressTaskId: activeTask.id,
        runtimeTaskId: String(runtime.taskId),
        retryAttempted,
      });
    }

    process.stdout.write(
      JSON.stringify({
        claimed: false,
        refusalCode: 'in_progress_active',
        resultCode: 'in_progress_active',
        message: 'task already in progress',
        task: {
          taskId: activeTask.id,
          title: activeTask.title,
          prompt: activeTask.prompt,
          verifyCommand: activeTask.verifyCommand || null,
          claimedAt: runtime.claimedAt || activeTask.startedAt || null,
        },
      }),
    );
    return;
  }

  const task = queue.tasks.find((t) => t.status === 'queued');
  if (!task) {
    process.stdout.write(
      JSON.stringify({
        claimed: false,
        refusalCode: 'no_queued_tasks',
        resultCode: 'no_queued_tasks',
        message: 'no queued tasks',
      }),
    );
    process.exit(10);
  }

  const claimedAt = nowIso();
  task.status = 'in_progress';
  task.startedAt = claimedAt;
  task.updatedAt = claimedAt;
  syncQueueSummary(queue);
  writeJson(queuePath, queue);

  const runtime = {
    taskId: task.id,
    title: task.title,
    prompt: task.prompt,
    verifyCommand: task.verifyCommand || null,
    sourceQueue: task.sourceQueue || null,
    claimedAt,
  };
  writeJson(runtimePath, runtime);
  process.stdout.write(JSON.stringify({ claimed: true, resultCode: 'claimed_new_task', task: runtime }));
}

function completeTask(queuePath, runtimePath, reportPath, taskIdGuard, retryMs = 0, retryAttempted = false) {
  const queue = readJson(queuePath);
  ensureQueueShape(queue);
  exitOnTransitionSanityFailure(queuePath, queue, 'complete');
  if (!fs.existsSync(runtimePath)) {
    if (retryMs > 0 && !retryAttempted) {
      sleepMs(retryMs);
      completeTask(queuePath, runtimePath, reportPath, taskIdGuard, retryMs, true);
      return;
    }
    console.error(
      `[reliant-slice-queue] runtime file not found: ${runtimePath}\n` +
        `hint: clear stale runtime and claim again: node scripts/reliant-runtime-clean.mjs --runtime ${runtimePath}` +
        (retryAttempted ? '\n[reliant-slice-queue] retry-attempted=true' : ''),
    );
    process.exit(5);
  }
  const runtime = readRuntimeOrExit(runtimePath);
  if (taskIdGuard && taskIdGuard !== runtime.taskId) {
    console.error(
      `[reliant-slice-queue] task-id guard mismatch for complete: guard=${taskIdGuard} runtime=${runtime.taskId}\n` +
        `[reliant-slice-queue] hint: pass --task-id matching the currently claimed runtime task`,
    );
    process.exit(4);
  }

  const task = queue.tasks.find((t) => t.id === runtime.taskId);
  if (!task) {
    if (retryMs > 0 && !retryAttempted) {
      sleepMs(retryMs);
      completeTask(queuePath, runtimePath, reportPath, taskIdGuard, retryMs, true);
      return;
    }
    const inProgressIds = queue.tasks.filter((t) => t.status === 'in_progress').map((t) => t.id);
    console.error(
      `[reliant-slice-queue] runtime task not found in queue: ${runtime.taskId}\n` +
        `[reliant-slice-queue] in_progress in queue: ${inProgressIds.join(', ') || '(none)'}\n` +
        `[reliant-slice-queue] hint: runtime/queue mismatch; run status, then clean stale runtime and re-claim` +
        (retryAttempted ? '\n[reliant-slice-queue] retry-attempted=true' : ''),
    );
    process.exit(3);
  }

  if (task.status === 'done') {
    if (reportPath && !task.reportPath) {
      task.reportPath = reportPath;
      task.updatedAt = nowIso();
      syncQueueSummary(queue);
      writeJson(queuePath, queue);
    }
    process.stdout.write(
      JSON.stringify({
        completed: true,
        resultCode: 'complete_idempotent',
        taskId: runtime.taskId,
        updatedAt: task.updatedAt ?? null,
        idempotent: true,
      }),
    );
    return;
  }

  if (task.status !== 'in_progress') {
    if (retryMs > 0 && !retryAttempted) {
      sleepMs(retryMs);
      completeTask(queuePath, runtimePath, reportPath, taskIdGuard, retryMs, true);
      return;
    }
    const inProgressIds = queue.tasks.filter((t) => t.status === 'in_progress').map((t) => t.id);
    console.error(
      `[reliant-slice-queue] cannot complete task ${runtime.taskId} from status "${task.status}" (expected "in_progress").\n` +
        `[reliant-slice-queue] in_progress in queue: ${inProgressIds.join(', ') || '(none)'}\n` +
        `[reliant-slice-queue] hint: stale runtime or wrong queue; use status + runtime cleanup before retry` +
        (retryAttempted ? '\n[reliant-slice-queue] retry-attempted=true' : ''),
    );
    process.exit(4);
  }

  const finishedAt = nowIso();
  task.status = 'done';
  task.finishedAt = finishedAt;
  task.updatedAt = finishedAt;
  if (reportPath) task.reportPath = reportPath;
  syncQueueSummary(queue);
  writeJson(queuePath, queue);

  process.stdout.write(JSON.stringify({ completed: true, resultCode: 'completed', taskId: runtime.taskId, updatedAt: task.updatedAt }));
}

function blockTask(queuePath, runtimePath, reason, taskIdGuard, retryMs = 0, retryAttempted = false) {
  const queue = readJson(queuePath);
  ensureQueueShape(queue);
  exitOnTransitionSanityFailure(queuePath, queue, 'block');
  if (!fs.existsSync(runtimePath)) {
    if (retryMs > 0 && !retryAttempted) {
      sleepMs(retryMs);
      blockTask(queuePath, runtimePath, reason, taskIdGuard, retryMs, true);
      return;
    }
    console.error(
      `[reliant-slice-queue] runtime file not found: ${runtimePath}\n` +
        `hint: clear stale runtime and claim again: node scripts/reliant-runtime-clean.mjs --runtime ${runtimePath}` +
        (retryAttempted ? '\n[reliant-slice-queue] retry-attempted=true' : ''),
    );
    process.exit(5);
  }
  const runtime = readRuntimeOrExit(runtimePath);
  if (taskIdGuard && taskIdGuard !== runtime.taskId) {
    console.error(
      `[reliant-slice-queue] task-id guard mismatch for block: guard=${taskIdGuard} runtime=${runtime.taskId}\n` +
        `[reliant-slice-queue] hint: pass --task-id matching the currently claimed runtime task`,
    );
    process.exit(4);
  }

  const task = queue.tasks.find((t) => t.id === runtime.taskId);
  if (!task) {
    if (retryMs > 0 && !retryAttempted) {
      sleepMs(retryMs);
      blockTask(queuePath, runtimePath, reason, taskIdGuard, retryMs, true);
      return;
    }
    const inProgressIds = queue.tasks.filter((t) => t.status === 'in_progress').map((t) => t.id);
    console.error(
      `[reliant-slice-queue] runtime task not found in queue: ${runtime.taskId}\n` +
        `[reliant-slice-queue] in_progress in queue: ${inProgressIds.join(', ') || '(none)'}\n` +
        `[reliant-slice-queue] hint: runtime/queue mismatch; run status, then clean stale runtime and re-claim` +
        (retryAttempted ? '\n[reliant-slice-queue] retry-attempted=true' : ''),
    );
    process.exit(3);
  }

  if (task.status === 'blocked') {
    process.stdout.write(
      JSON.stringify({
        blocked: true,
        taskId: runtime.taskId,
        reason: task.blockerReason ?? reason,
        updatedAt: task.updatedAt ?? null,
        idempotent: true,
      }),
    );
    return;
  }

  if (task.status !== 'in_progress') {
    if (retryMs > 0 && !retryAttempted) {
      sleepMs(retryMs);
      blockTask(queuePath, runtimePath, reason, taskIdGuard, retryMs, true);
      return;
    }
    const inProgressIds = queue.tasks.filter((t) => t.status === 'in_progress').map((t) => t.id);
    console.error(
      `[reliant-slice-queue] cannot block task ${runtime.taskId} from status "${task.status}" (expected "in_progress").\n` +
        `[reliant-slice-queue] in_progress in queue: ${inProgressIds.join(', ') || '(none)'}\n` +
        `[reliant-slice-queue] hint: stale runtime or wrong queue; use status + runtime cleanup before retry` +
        (retryAttempted ? '\n[reliant-slice-queue] retry-attempted=true' : ''),
    );
    process.exit(4);
  }

  const blockedAt = nowIso();
  task.status = 'blocked';
  task.blockedAt = blockedAt;
  task.updatedAt = blockedAt;
  task.blockerReason = reason || 'unspecified';
  syncQueueSummary(queue);
  writeJson(queuePath, queue);

  process.stdout.write(
    JSON.stringify({
      blocked: true,
      resultCode: 'blocked',
      taskId: runtime.taskId,
      reason: task.blockerReason,
      updatedAt: task.updatedAt,
    }),
  );
}

function inspectRuntime(runtimePath, inProgressTaskIds, includeChecksum = false) {
  const runtimeInfo = {
    path: runtimePath,
    exists: fs.existsSync(runtimePath),
    valid: false,
    taskId: null,
    matchesInProgress: false,
    health: 'unknown',
    checksumSha256: null,
    checksumAlgorithm: null,
    checksumMode: includeChecksum ? 'explicit' : 'none',
    checksumPresent: false,
    sizeBytes: null,
    parseErrorKind: null,
  };

  if (!runtimeInfo.exists) {
    runtimeInfo.health = inProgressTaskIds.length > 0 ? 'missing' : 'ok';
    return runtimeInfo;
  }

  try {
    const raw = fs.readFileSync(runtimePath, 'utf8');
    runtimeInfo.sizeBytes = Buffer.byteLength(raw, 'utf8');
    if (includeChecksum) {
      runtimeInfo.checksumSha256 = crypto.createHash('sha256').update(raw).digest('hex');
      runtimeInfo.checksumAlgorithm = 'sha256';
      runtimeInfo.checksumPresent = true;
    }
    const runtime = JSON.parse(raw);
    ensureRuntimeShape(runtime, runtimePath);
    runtimeInfo.valid = true;
    runtimeInfo.taskId = runtime.taskId;
    runtimeInfo.matchesInProgress =
      inProgressTaskIds.length === 1 ? runtime.taskId === inProgressTaskIds[0] : inProgressTaskIds.length === 0;
    runtimeInfo.health = runtimeInfo.matchesInProgress ? 'ok' : 'mismatch';
    return runtimeInfo;
  } catch (error) {
    runtimeInfo.health = 'invalid';
    const message = error instanceof Error ? error.message : String(error);
    if (runtimeInfo.checksumSha256 == null) {
      try {
        const raw = fs.readFileSync(runtimePath, 'utf8');
        runtimeInfo.checksumSha256 = crypto.createHash('sha256').update(raw).digest('hex');
        runtimeInfo.checksumAlgorithm = 'sha256';
        runtimeInfo.checksumMode = 'invalid_runtime_auto';
        runtimeInfo.checksumPresent = true;
      } catch {
        // Preserve invalid diagnostics even if checksum read fails.
      }
    }
    if (error instanceof SyntaxError) {
      runtimeInfo.parseErrorKind = 'json_syntax';
    } else if (message.includes('runtime missing required taskId')) {
      runtimeInfo.parseErrorKind = 'runtime_shape_missing_task_id';
    } else if (message.includes('runtime must be an object')) {
      runtimeInfo.parseErrorKind = 'runtime_shape_non_object';
    } else if (message.includes('ENOENT')) {
      runtimeInfo.parseErrorKind = 'runtime_io';
    } else {
      runtimeInfo.parseErrorKind = 'runtime_shape_or_io';
    }
    runtimeInfo.error = error instanceof Error ? error.message : String(error);
    return runtimeInfo;
  }
}

function status(queuePath, runtimePath, includeRuntimeChecksum = false) {
  const queue = readJson(queuePath);
  ensureQueueShape(queue);
  const transitionSanity = getTransitionSanity(queuePath, queue);

  const summary = queue.tasks.reduce(
    (acc, t) => {
      acc.total += 1;
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    { total: 0, queued: 0, in_progress: 0, done: 0, blocked: 0 },
  );

  const inProgressTaskIds = queue.tasks.filter((t) => t.status === 'in_progress').map((t) => t.id);
  const blockedTaskIds = queue.tasks.filter((t) => t.status === 'blocked').map((t) => t.id);
  const nextQueuedTask = queue.tasks.find((t) => t.status === 'queued');
  const doneTasks = queue.tasks.filter((t) => t.status === 'done');
  const reportCoverage = {
    doneWithReport: doneTasks.filter((t) => Boolean(t.reportPath)).length,
    doneMissingReport: doneTasks.filter((t) => !t.reportPath).length,
    doneWithoutReportTaskIds: doneTasks.filter((t) => !t.reportPath).map((t) => t.id),
  };
  const runtime = inspectRuntime(runtimePath, inProgressTaskIds, includeRuntimeChecksum);
  const canClaim =
    summary.queued > 0 &&
    inProgressTaskIds.length === 0 &&
    (runtime.health === 'ok' || runtime.health === 'missing');

  const persistedSummary = queue && typeof queue.summary === 'object' ? queue.summary : null;
  const summaryDrift = [];
  const persistedSnapshot = persistedSummary
    ? {
        total: Number(persistedSummary.total ?? 0),
        queued: Number(persistedSummary.queued ?? 0),
        in_progress: Number(persistedSummary.in_progress ?? 0),
        done: Number(persistedSummary.done ?? 0),
        blocked: Number(persistedSummary.blocked ?? 0),
      }
    : null;
  const actualSnapshot = {
    total: Number(summary.total ?? 0),
    queued: Number(summary.queued ?? 0),
    in_progress: Number(summary.in_progress ?? 0),
    done: Number(summary.done ?? 0),
    blocked: Number(summary.blocked ?? 0),
  };
  if (persistedSnapshot) {
    for (const key of ['total', 'queued', 'in_progress', 'done', 'blocked']) {
      const actual = actualSnapshot[key];
      const declared = persistedSnapshot[key];
      if (actual !== declared) {
        summaryDrift.push(`${key}:declared=${declared}:actual=${actual}`);
      }
    }
  }
  const driftKeys = summaryDrift.map((entry) => entry.split(':', 1)[0]).filter(Boolean);
  const driftDeltas = driftKeys.reduce((acc, key) => {
    const declared = persistedSnapshot ? Number(persistedSnapshot[key] ?? 0) : 0;
    const actual = Number(actualSnapshot[key] ?? 0);
    acc[key] = { declared, actual, delta: actual - declared };
    return acc;
  }, {});
  const driftFingerprint = summaryDrift.length === 0 ? 'none' : summaryDrift.join('|');
  const hasOwnershipSensitiveDrift = driftKeys.includes('in_progress');
  const hasGlobalCountDrift = driftKeys.includes('total');
  const severity =
    summaryDrift.length === 0
      ? 'none'
      : hasOwnershipSensitiveDrift && hasGlobalCountDrift
        ? 'critical'
        : hasOwnershipSensitiveDrift || hasGlobalCountDrift || summaryDrift.length >= 3
          ? 'high'
          : 'medium';

  process.stdout.write(
    JSON.stringify(
      {
        generatedAt: nowIso(),
        summary,
        summarySanity: {
          hasPersistedSummary: Boolean(persistedSummary),
          isDrifting: summaryDrift.length > 0,
          severity,
          driftCount: summaryDrift.length,
          driftKeys,
          driftDeltas,
          driftFingerprint,
          drift: summaryDrift,
          persisted: persistedSnapshot,
          actual: actualSnapshot,
        },
        ownership: {
          inProgressTaskIds,
          multipleInProgress: inProgressTaskIds.length > 1,
          blockedTaskIds,
          nextQueuedTaskId: nextQueuedTask ? nextQueuedTask.id : null,
          canClaim,
        },
        runtime,
        transitionSanity,
        reportCoverage,
        tasks: queue.tasks,
      },
      null,
      2,
    ),
  );
}

function initTemplate(queuePath) {
  const template = {
    version: 1,
    generatedAt: nowIso(),
    tasks: [
      {
        id: 'SLICE-EXAMPLE-001',
        title: 'Example single-slice task',
        prompt: 'Execute one MVP slice only: <replace with exact slice instructions>',
        verifyCommand:
          'pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck',
        status: 'queued',
      },
    ],
  };
  syncQueueSummary(template);

  writeJson(queuePath, template);
  process.stdout.write(JSON.stringify({ initialized: true, queuePath }));
}

function validateQueue(queuePath) {
  const queue = readJson(queuePath);
  ensureQueueShape(queue);
  const transitionSanity = getTransitionSanity(queuePath, queue);
  if (transitionSanity.applicable && !transitionSanity.ok) {
    const issueSummary = transitionSanity.issues
      .map((entry) => `${entry.taskId}:${entry.issues.join(',')}`)
      .join('; ');
    console.error(
      `[reliant-slice-queue] validate blocked by UX batch transition sanity failure (${transitionSanity.failureCode}): ${issueSummary}`,
    );
    process.exit(1);
  }
  const statusCounts = queue.tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { queued: 0, in_progress: 0, done: 0, blocked: 0 },
  );
  process.stdout.write(
    JSON.stringify(
      {
        valid: true,
        queuePath,
        checkedAt: nowIso(),
        taskCount: queue.tasks.length,
        statusCounts,
        transitionSanity,
      },
      null,
      2,
    ),
  );
}

function nextAction(queuePath, runtimePath) {
  const queue = readJson(queuePath);
  ensureQueueShape(queue);
  const generatedAt = nowIso();
  const inProgressTask = queue.tasks.find((task) => task.status === 'in_progress') || null;
  if (inProgressTask) {
    process.stdout.write(
      JSON.stringify({
        generatedAt,
        action: 'execute_in_progress',
        taskId: inProgressTask.id,
        runtimePath,
      }),
    );
    return;
  }

  const queuedTask = queue.tasks.find((task) => task.status === 'queued') || null;
  if (queuedTask) {
    process.stdout.write(
      JSON.stringify({
        generatedAt,
        action: 'claim_next',
        taskId: queuedTask.id,
        runtimePath,
      }),
    );
    return;
  }

  process.stdout.write(JSON.stringify({ generatedAt, action: 'no_queued_tasks', runtimePath }));
}

function main() {
  const cmd = process.argv[2];
  if (!cmd) {
    console.error(
      'usage: node scripts/reliant-slice-queue.mjs <init|claim|complete|block|status|validate|next> --queue <path> [--runtime <path>]',
    );
    process.exit(2);
  }

  const queuePath = requireArg('--queue');
  const runtimePath = getArg('--runtime', '.reliant/runtime/current-task.json');
  const includeRuntimeChecksum = hasFlag('--runtime-checksum');
  const retryMs = Number.parseInt(getArg('--retry-ms', '0') ?? '0', 10);

  switch (cmd) {
    case 'init':
      initTemplate(queuePath);
      return;
    case 'claim':
      claimTask(queuePath, runtimePath, Number.isFinite(retryMs) ? Math.max(0, retryMs) : 0);
      return;
    case 'complete': {
      const reportPath = getArg('--report', null);
      const taskIdGuard = getArg('--task-id', null);
      completeTask(queuePath, runtimePath, reportPath, taskIdGuard, Number.isFinite(retryMs) ? Math.max(0, retryMs) : 0);
      return;
    }
    case 'block': {
      const reason = getArg('--reason', 'blocked without reason');
      const taskIdGuard = getArg('--task-id', null);
      blockTask(queuePath, runtimePath, reason, taskIdGuard, Number.isFinite(retryMs) ? Math.max(0, retryMs) : 0);
      return;
    }
    case 'status':
      status(queuePath, runtimePath, includeRuntimeChecksum);
      return;
    case 'validate':
      validateQueue(queuePath);
      return;
    case 'next':
      nextAction(queuePath, runtimePath);
      return;
    default:
      console.error(`unknown command: ${cmd}`);
      process.exit(2);
  }
}

main();
