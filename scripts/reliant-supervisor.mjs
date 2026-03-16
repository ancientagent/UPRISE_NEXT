#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const DEFAULT_LANES = [
  {
    name: 'lane-a',
    queue: '.reliant/queue/mvp-lane-a-api-core-backlog.json',
    runtime: '.reliant/runtime/current-task-lane-a.json',
  },
  {
    name: 'lane-b',
    queue: '.reliant/queue/mvp-lane-b-web-contract-backlog.json',
    runtime: '.reliant/runtime/current-task-lane-b.json',
  },
  {
    name: 'lane-c',
    queue: '.reliant/queue/mvp-lane-c-code-invite-backlog.json',
    runtime: '.reliant/runtime/current-task-lane-c.json',
  },
  {
    name: 'lane-d',
    queue: '.reliant/queue/mvp-lane-d-automation-backlog.json',
    runtime: '.reliant/runtime/current-task-lane-d.json',
  },
  {
    name: 'lane-e',
    queue: '.reliant/queue/mvp-lane-e-qa-doc-review-backlog.json',
    runtime: '.reliant/runtime/current-task-lane-e.json',
  },
];
const SUMMARY_KEYS = ['total', 'queued', 'in_progress', 'done', 'blocked'];
const VALID_TASK_STATUSES = new Set(['queued', 'in_progress', 'done', 'blocked']);
const MIN_INTERVAL_MS = 500;
const MAX_INTERVAL_MS = 60_000;
const MAX_JITTER_MS = 5_000;
const MAX_JITTER_SEED = 1_000_000;

function getArg(flag, fallback = null) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function nowIso() {
  return new Date().toISOString();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function exec(cmd) {
  const res = spawnSync(cmd, { shell: true, encoding: 'utf8' });
  return {
    code: res.status ?? 1,
    stdout: res.stdout || '',
    stderr: res.stderr || '',
  };
}

function summarize(tasks) {
  return tasks.reduce(
    (acc, t) => {
      acc.total += 1;
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    { total: 0, queued: 0, in_progress: 0, done: 0, blocked: 0 },
  );
}

function detectDrifts(queue, tasks, summary, runtimePath) {
  const drifts = [];
  const declaredSummary = queue && typeof queue.summary === 'object' ? queue.summary : null;

  if (declaredSummary) {
    for (const key of SUMMARY_KEYS) {
      const declared = Number(declaredSummary[key] ?? 0);
      const actual = Number(summary[key] ?? 0);
      if (declared !== actual) {
        drifts.push(`summary-mismatch:${key}:declared=${declared}:actual=${actual}`);
      }
    }
  }

  const invalidStatuses = tasks.filter((task) => !VALID_TASK_STATUSES.has(task.status)).map((task) => task.id);
  if (invalidStatuses.length > 0) {
    drifts.push(`invalid-status:${invalidStatuses.join(',')}`);
  }

  if (summary.in_progress > 1) {
    drifts.push(`impossible-state:multiple-in-progress:${summary.in_progress}`);
  }

  const runtimeExists = fs.existsSync(runtimePath);
  if (summary.in_progress === 0 && runtimeExists) {
    drifts.push('runtime-without-in-progress');
  }
  if (summary.in_progress === 1 && !runtimeExists) {
    drifts.push('missing-runtime-for-in-progress');
  }

  return drifts;
}

function inspectRuntimeOwnership(runtimePath, inProgressTasks) {
  const report = {
    runtimePath,
    exists: fs.existsSync(runtimePath),
    valid: false,
    runtimeTaskId: null,
    parseError: null,
    expectedTaskId: inProgressTasks.length === 1 ? inProgressTasks[0].id : null,
    matchesInProgress: false,
  };

  if (!report.exists) return report;

  try {
    const parsed = readJson(runtimePath);
    report.valid = Boolean(parsed && typeof parsed === 'object' && typeof parsed.taskId === 'string');
    report.runtimeTaskId = report.valid ? parsed.taskId : null;
    report.matchesInProgress =
      inProgressTasks.length === 0 ? report.runtimeTaskId == null : report.runtimeTaskId === report.expectedTaskId;
  } catch (error) {
    report.parseError = error instanceof Error ? error.message : String(error);
  }

  return report;
}

function classifyOwnership(runtimeOwnership, inProgressCount, lane = null) {
  const hints = [];
  const operatorCues = [];
  let state = 'healthy';
  let severity = 'none';
  let failureCode = null;
  const queuePath = lane?.queue ?? runtimeOwnership.runtimePath;
  const runtimePath = lane?.runtime ?? runtimeOwnership.runtimePath;

  if (inProgressCount === 0 && runtimeOwnership.exists) {
    state = 'stale_runtime_without_owner';
    severity = 'medium';
    failureCode = 'stale_runtime';
    hints.push('clear_runtime');
    operatorCues.push(`node scripts/reliant-runtime-clean.mjs --runtime ${runtimePath}`);
  } else if (inProgressCount > 0 && !runtimeOwnership.exists) {
    state = 'missing_runtime_for_owner';
    severity = 'high';
    failureCode = 'missing_runtime';
    hints.push('recreate_runtime');
    operatorCues.push(
      `node scripts/reliant-slice-queue.mjs status --queue ${queuePath} --runtime ${runtimePath}`,
      `node scripts/reliant-slice-queue.mjs claim --queue ${queuePath} --runtime ${runtimePath}`,
    );
  } else if (runtimeOwnership.exists && !runtimeOwnership.valid) {
    state = 'invalid_runtime_payload';
    severity = 'high';
    failureCode = 'invalid_runtime_payload';
    hints.push('runtime_clean_then_reclaim');
    operatorCues.push(
      `node scripts/reliant-runtime-clean.mjs --runtime ${runtimePath}`,
      `node scripts/reliant-slice-queue.mjs claim --queue ${queuePath} --runtime ${runtimePath}`,
    );
  } else if (runtimeOwnership.exists && inProgressCount > 0 && !runtimeOwnership.matchesInProgress) {
    state = 'runtime_owner_mismatch';
    severity = 'critical';
    failureCode = 'runtime_owner_mismatch';
    hints.push('runtime_clean_then_reclaim');
    operatorCues.push(
      `node scripts/reliant-slice-queue.mjs status --queue ${queuePath} --runtime ${runtimePath}`,
      `node scripts/reliant-runtime-clean.mjs --runtime ${runtimePath}`,
      `node scripts/reliant-slice-queue.mjs claim --queue ${queuePath} --runtime ${runtimePath}`,
    );
  }

  return { state, severity, failureCode, requiresIntervention: severity !== 'none', hints, operatorCues };
}

function choosePrimaryInProgress(tasks) {
  const inProgress = tasks.filter((t) => t.status === 'in_progress');
  if (inProgress.length <= 1) return inProgress[0] ?? null;
  inProgress.sort((a, b) => {
    const aTime = new Date(a.startedAt || a.updatedAt || 0).getTime();
    const bTime = new Date(b.startedAt || b.updatedAt || 0).getTime();
    return aTime - bTime;
  });
  return inProgress[0];
}

function ensureRuntimeForTask(lane, task, actions) {
  const runtime = {
    taskId: task.id,
    title: task.title,
    prompt: task.prompt,
    verifyCommand: task.verifyCommand ?? null,
    claimedAt: task.startedAt || task.updatedAt || nowIso(),
  };
  writeJson(lane.runtime, runtime);
  actions.push(`runtime:set:${task.id}`);
}

function clearRuntime(lane, actions) {
  if (fs.existsSync(lane.runtime)) {
    fs.unlinkSync(lane.runtime);
    actions.push('runtime:cleared');
  }
}

function getFounderDecisionDependency(task) {
  if (!task || typeof task !== 'object') return null;

  const declarationField =
    task.founderDecisionRequired === true
      ? 'founderDecisionRequired'
      : task.requiresFounderDecision === true
        ? 'requiresFounderDecision'
        : null;

  if (!declarationField) return null;

  const reason =
    typeof task.founderDecisionReason === 'string' && task.founderDecisionReason.trim() !== ''
      ? task.founderDecisionReason.trim()
      : 'founder decision required before execution';

  return {
    taskId: task.id,
    title: task.title,
    reason,
    declarationField,
  };
}

function claimNext(lane, actions) {
  const cmd = `node scripts/reliant-slice-queue.mjs claim --queue ${lane.queue} --runtime ${lane.runtime}`;
  const out = exec(cmd);
  if (out.code === 0) {
    actions.push('claim:ok');
    return true;
  }
  if (out.code === 10 || out.stdout.includes('"no queued tasks"')) {
    actions.push('claim:none');
    return true;
  }
  actions.push(`claim:error:${out.code}`);
  return false;
}

function repairLane(lane, { autoClaim, repair }, report) {
  const actions = [];
  const errors = [];

  let queue;
  try {
    queue = readJson(lane.queue);
  } catch (err) {
    errors.push(`queue-read-failed:${err.message}`);
    report.errors = errors;
    report.actions = actions;
    return;
  }
  const tasks = Array.isArray(queue.tasks) ? queue.tasks : [];
  const summary = summarize(tasks);
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  report.summary = summary;
  report.runtimeOwnership = inspectRuntimeOwnership(lane.runtime, inProgressTasks);
  report.ownershipHealth = classifyOwnership(report.runtimeOwnership, inProgressTasks.length, lane);
  const initialDrifts = detectDrifts(queue, tasks, summary, lane.runtime);
  report.drifts = [...initialDrifts];

  const inProgress = tasks.filter((t) => t.status === 'in_progress');
  if (inProgress.length > 1 && repair) {
    const keep = choosePrimaryInProgress(tasks);
    for (const task of inProgress) {
      if (task.id === keep.id) continue;
      task.status = 'queued';
      task.updatedAt = nowIso();
      delete task.startedAt;
      delete task.blockedAt;
      delete task.blockerReason;
      actions.push(`repair:requeue:${task.id}`);
    }
    keep.updatedAt = nowIso();
    writeJson(lane.queue, queue);
    ensureRuntimeForTask(lane, keep, actions);
  }

  const reloaded = readJson(lane.queue);
  const reloadedTasks = Array.isArray(reloaded.tasks) ? reloaded.tasks : [];
  const reloadedSummary = summarize(reloadedTasks);
  report.summary = reloadedSummary;
  const finalDrifts = detectDrifts(reloaded, reloadedTasks, reloadedSummary, lane.runtime);
  report.drifts = finalDrifts;
  const reloadedInProgress = reloadedTasks.filter((t) => t.status === 'in_progress');
  report.founderDecisionStop = {
    requiresStop: false,
    taskId: null,
    title: null,
    reason: null,
    declarationField: null,
  };

  if (reloadedInProgress.length === 0) {
    if (repair) clearRuntime(lane, actions);
    const queued = reloadedTasks.filter((t) => t.status === 'queued');
    const founderDecisionDependency = queued.length > 0 ? getFounderDecisionDependency(queued[0]) : null;
    if (founderDecisionDependency) {
      report.founderDecisionStop = {
        requiresStop: true,
        ...founderDecisionDependency,
      };
      actions.push(`stop:founder-decision:${founderDecisionDependency.taskId}`);
      report.errors = errors;
      report.actions = actions;
      return;
    }
    if (queued.length > 0 && autoClaim) {
      claimNext(lane, actions);
    }
  } else if (reloadedInProgress.length === 1 && repair) {
    const task = reloadedInProgress[0];
    const runtimeOk =
      fs.existsSync(lane.runtime) &&
      (() => {
        try {
          const rt = readJson(lane.runtime);
          return rt?.taskId === task.id;
        } catch {
          return false;
        }
      })();
    if (!runtimeOk) ensureRuntimeForTask(lane, task, actions);
  } else if (reloadedInProgress.length > 1) {
    errors.push('multiple-in-progress-unresolved');
  }

  report.actions = actions;
  report.errors = errors;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function boundedJitter(base, jitter, cycle, jitterSeed = 0) {
  if (!Number.isFinite(jitter) || jitter <= 0) return Math.max(0, base);
  const window = Math.max(1, Math.floor(jitter));
  const offset = (cycle + Math.max(0, Math.floor(jitterSeed))) % (window + 1);
  return Math.max(0, base + offset);
}

function clampIntervalConfig(intervalMs, jitterMs) {
  const base = Number.isFinite(intervalMs) ? intervalMs : MIN_INTERVAL_MS;
  const jitter = Number.isFinite(jitterMs) ? jitterMs : 0;
  return {
    intervalMs: Math.min(MAX_INTERVAL_MS, Math.max(MIN_INTERVAL_MS, Math.floor(base))),
    intervalJitterMs: Math.min(MAX_JITTER_MS, Math.max(0, Math.floor(jitter))),
  };
}

function clampJitterSeed(seed) {
  const value = Number.isFinite(seed) ? Math.floor(seed) : 0;
  return Math.min(MAX_JITTER_SEED, Math.max(0, value));
}

function collectHealthGateFailures(report) {
  const failures = [];
  const inProgressCount = Number(report?.summary?.in_progress ?? 0);

  if (inProgressCount > 1) {
    failures.push({
      lane: report.lane,
      code: 'multiple_in_progress',
      message: `queue has ${inProgressCount} in_progress tasks`,
      inProgressCount,
    });
  }

  if (report?.ownershipHealth?.state === 'stale_runtime_without_owner') {
    failures.push({
      lane: report.lane,
      code: 'stale_runtime_without_matching_in_progress',
      message: 'runtime exists with no matching in_progress task',
      runtimePath: report.runtime,
    });
  }

  const summaryMismatchDrifts = Array.isArray(report?.drifts)
    ? report.drifts.filter((drift) => drift.startsWith('summary-mismatch:'))
    : [];
  if (summaryMismatchDrifts.length > 0) {
    failures.push({
      lane: report.lane,
      code: 'summary_drift',
      message: 'queue.summary drift detected',
      drifts: summaryMismatchDrifts,
    });
  }

  if (report?.founderDecisionStop?.requiresStop) {
    failures.push({
      lane: report.lane,
      code: 'founder_decision_required',
      message: report.founderDecisionStop.reason,
      taskId: report.founderDecisionStop.taskId,
      declarationField: report.founderDecisionStop.declarationField,
    });
  }

  return failures;
}

async function main() {
  const watch = hasFlag('--watch');
  const failOnDrift = hasFlag('--fail-on-drift');
  const healthCheck = hasFlag('--health-check');
  const autoClaim = healthCheck ? false : !hasFlag('--no-claim');
  const repair = healthCheck ? false : !hasFlag('--no-repair');
  const rawIntervalMs = Number(getArg('--interval-ms', '5000'));
  const rawIntervalJitterMs = Number(getArg('--interval-jitter-ms', '0'));
  const rawJitterSeed = Number(getArg('--jitter-seed', String(process.pid % 997)));
  const { intervalMs, intervalJitterMs } = clampIntervalConfig(rawIntervalMs, rawIntervalJitterMs);
  const jitterSeed = clampJitterSeed(rawJitterSeed);
  const statusOut = getArg('--status-out', '.reliant/runtime/supervisor-status.json');
  const lanesJson = getArg('--lanes-json', null);
  const lanes = lanesJson ? readJson(lanesJson) : DEFAULT_LANES;
  if (!Array.isArray(lanes)) {
    throw new Error('lanes config must be an array');
  }
  if (healthCheck && watch) {
    console.error('[supervisor] --health-check is one-shot; ignoring --watch');
  }
  const effectiveWatch = watch && !healthCheck;

  let cycleNumber = 0;
  while (true) {
    const cycle = {
      generatedAt: nowIso(),
      autoClaim,
      repair,
      intervalConfig: {
        intervalMs,
        intervalJitterMs,
        jitterSeed,
        jitterCycleLength: intervalJitterMs > 0 ? intervalJitterMs + 1 : 1,
      },
      lanes: [],
    };

    let driftCount = 0;
    const healthGateFailures = [];
    for (const lane of lanes) {
      const report = {
        lane: lane.name,
        queue: lane.queue,
        runtime: lane.runtime,
      };
      repairLane(lane, { autoClaim, repair }, report);
      cycle.lanes.push(report);
      driftCount += report.drifts?.length ?? 0;
      if (healthCheck) {
        healthGateFailures.push(...collectHealthGateFailures(report));
      }

      const s = report.summary || { queued: '?', in_progress: '?', done: '?', blocked: '?' };
      console.log(
        `[supervisor] ${lane.name} queued=${s.queued} in_progress=${s.in_progress} done=${s.done} blocked=${s.blocked}` +
          (report.actions?.length ? ` actions=${report.actions.join(',')}` : ''),
      );
      if (report.errors?.length) {
        for (const err of report.errors) console.error(`[supervisor] ${lane.name} error=${err}`);
      }
      if (report.drifts?.length) {
        for (const drift of report.drifts) console.error(`[supervisor] ${lane.name} drift=${drift}`);
      }
    }
    if (healthCheck) {
      cycle.healthCheck = {
        enabled: true,
        passed: healthGateFailures.length === 0,
        failureCount: healthGateFailures.length,
        failures: healthGateFailures,
      };
    }
    cycle.stopConditions = cycle.lanes
      .filter((lane) => lane.founderDecisionStop?.requiresStop)
      .map((lane) => ({
        lane: lane.lane,
        code: 'founder_decision_required',
        taskId: lane.founderDecisionStop.taskId,
        declarationField: lane.founderDecisionStop.declarationField,
        reason: lane.founderDecisionStop.reason,
      }));

    writeJson(statusOut, cycle);
    if (healthCheck) {
      if (healthGateFailures.length > 0) {
        for (const failure of healthGateFailures) {
          console.error(`[supervisor] health-gate-failed lane=${failure.lane} code=${failure.code} ${failure.message}`);
        }
        process.exit(6);
      }
      console.log('[supervisor] health-gate-passed');
      return;
    }
    if (cycle.stopConditions.length > 0) {
      for (const stopCondition of cycle.stopConditions) {
        console.error(
          `[supervisor] stop lane=${stopCondition.lane} code=${stopCondition.code} task=${stopCondition.taskId} reason=${stopCondition.reason}`,
        );
      }
      process.exit(7);
    }
    if (failOnDrift && driftCount > 0) {
      console.error(`[supervisor] drift-detected count=${driftCount}`);
      process.exit(4);
    }
    if (!effectiveWatch) return;
    const sleepFor = boundedJitter(intervalMs, intervalJitterMs, cycleNumber, jitterSeed);
    cycleNumber += 1;
    await sleep(sleepFor);
  }
}

main();
