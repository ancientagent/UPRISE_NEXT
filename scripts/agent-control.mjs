#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_QUEUE_PATH = 'docs/handoff/agent-control/queue.json';
const DEFAULT_LANES_PATH = 'docs/handoff/agent-control/lanes.json';
const DIRECTIVES_VERSION = '2026-02-24';

const STATUSES = new Set(['queued', 'in_progress', 'done', 'blocked', 'canceled']);

const REQUIRED_READING_ORDER = [
  'docs/STRATEGY_CRITICAL_INFRA_NOTE.md',
  'docs/RUNBOOK.md',
  'docs/FEATURE_DRIFT_GUARDRAILS.md',
  'docs/architecture/UPRISE_OVERVIEW.md',
  'docs/PROJECT_STRUCTURE.md',
  'apps/web/WEB_TIER_BOUNDARY.md',
  'docs/AGENT_STRATEGY_AND_HANDOFF.md',
  'docs/README.md',
  'docs/solutions/README.md',
];

const STANDING_ORDERS = [
  'Canon/spec authority only; no feature drift.',
  'Use pnpm only in UPRISE_NEXT.',
  'Respect web-tier boundary; no server/data-tier imports in web.',
  'Keep work PR-safe by slice; additive-first migrations.',
  'Run required validation gates and report exact command output.',
  'Update touched specs, docs/CHANGELOG.md, and add handoff note for meaningful changes.',
  'Use lane scope only and do not edit outside allowed paths.',
];

const VALIDATION_GATE = [
  'pnpm run docs:lint',
  'pnpm run infra-policy-check',
  'targeted tests for touched area',
  'relevant typecheck/build',
];

function nowIso() {
  return new Date().toISOString();
}

function parseArgs(argv) {
  const normalized = argv[0] === '--' ? argv.slice(1) : argv;
  if (normalized.length === 0) return { command: 'help', options: {}, positionals: [] };
  const command = normalized[0];
  const rest = normalized.slice(1);
  const options = {};
  const positionals = [];

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    if (!token.startsWith('--')) {
      positionals.push(token);
      continue;
    }

    const key = token.slice(2);
    const next = rest[i + 1];
    if (!next || next.startsWith('--')) {
      options[key] = true;
      continue;
    }

    options[key] = next;
    i += 1;
  }

  return { command, options, positionals };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function splitCsv(value) {
  if (!value || typeof value !== 'string') return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function compareTasks(a, b) {
  const aPriority = Number.isFinite(a.priority) ? a.priority : 0;
  const bPriority = Number.isFinite(b.priority) ? b.priority : 0;
  if (aPriority !== bPriority) return bPriority - aPriority;
  return (a.assignedAt ?? '').localeCompare(b.assignedAt ?? '');
}

function ensureTaskShape(task) {
  if (!task.id || !task.title || !task.lane || !task.status) {
    throw new Error(`Task is missing required fields: ${JSON.stringify(task)}`);
  }
  if (!STATUSES.has(task.status)) {
    throw new Error(`Task "${task.id}" has invalid status "${task.status}"`);
  }
}

function printUsage() {
  console.log(`agent-control.mjs

Usage:
  node scripts/agent-control.mjs init [--queue PATH] [--lanes PATH] [--force]
  node scripts/agent-control.mjs assign --id ID --title TITLE --lane LANE [--phase PHASE] [--priority N] [--depends-on id1,id2] [--paths p1,p2]
  node scripts/agent-control.mjs claim --lane LANE --agent NAME [--branch BRANCH] [--json]
  node scripts/agent-control.mjs complete --id ID --agent NAME [--branch BRANCH] [--commit HASH] [--pr URL] [--report PATH] [--notes TEXT]
  node scripts/agent-control.mjs block --id ID --agent NAME --reason TEXT
  node scripts/agent-control.mjs requeue --id ID [--reason TEXT]
  node scripts/agent-control.mjs ack --id ID [--notes TEXT]
  node scripts/agent-control.mjs status [--lane LANE] [--json] [--all]
  node scripts/agent-control.mjs poll [--json] [--fail-on-blocked]

Global options:
  --queue PATH   Queue file path (default: ${DEFAULT_QUEUE_PATH})
  --lanes PATH   Lane config path (default: ${DEFAULT_LANES_PATH})
`);
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function withQueueLock(queuePath, fn) {
  const lockPath = `${queuePath}.lock`;
  const timeoutMs = 10000;
  const pollMs = 75;
  const start = Date.now();
  let fd = null;

  while (fd === null) {
    try {
      fd = fs.openSync(lockPath, 'wx');
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      if (Date.now() - start > timeoutMs) {
        throw new Error(`Timed out waiting for queue lock: ${lockPath}`);
      }
      await sleep(pollMs);
    }
  }

  try {
    return await fn();
  } finally {
    if (fd !== null) fs.closeSync(fd);
    if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
  }
}

function loadLanes(lanesPath) {
  if (!fs.existsSync(lanesPath)) {
    throw new Error(`Lane config not found: ${lanesPath}`);
  }

  const lanesConfig = readJson(lanesPath);
  const lanes = Array.isArray(lanesConfig.lanes) ? lanesConfig.lanes : [];
  const byId = new Map();
  for (const lane of lanes) {
    if (!lane.id) continue;
    byId.set(lane.id, lane);
  }
  return { lanesConfig, byId };
}

function ensureQueueFile(queuePath) {
  if (!fs.existsSync(queuePath)) {
    throw new Error(`Queue file not found: ${queuePath}. Run "init" first.`);
  }
}

function loadQueue(queuePath) {
  ensureQueueFile(queuePath);
  const queue = readJson(queuePath);
  if (!Array.isArray(queue.tasks)) {
    throw new Error(`Queue file is malformed: ${queuePath}`);
  }
  for (const task of queue.tasks) ensureTaskShape(task);
  return queue;
}

function taskById(queue, taskId) {
  return queue.tasks.find((task) => task.id === taskId);
}

function dependencySatisfied(queue, task) {
  if (!Array.isArray(task.dependsOn) || task.dependsOn.length === 0) return true;
  return task.dependsOn.every((depId) => {
    const dep = taskById(queue, depId);
    return dep && dep.status === 'done';
  });
}

function summarize(queue, laneFilter) {
  const tasks = laneFilter ? queue.tasks.filter((task) => task.lane === laneFilter) : queue.tasks;
  const counts = {
    total: tasks.length,
    queued: 0,
    in_progress: 0,
    done: 0,
    blocked: 0,
    canceled: 0,
  };

  for (const task of tasks) {
    counts[task.status] += 1;
  }

  return counts;
}

function formatTaskLine(task) {
  const updated = task.updatedAt ?? task.assignedAt ?? '';
  return `${task.id} | ${task.lane} | ${task.status} | ${task.title} | updated=${updated}`;
}

function buildDefaultDirectives() {
  return {
    version: DIRECTIVES_VERSION,
    requiredReading: [...REQUIRED_READING_ORDER],
    standingOrders: [...STANDING_ORDERS],
    validationGate: [...VALIDATION_GATE],
  };
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  const queuePath = options.queue || DEFAULT_QUEUE_PATH;
  const lanesPath = options.lanes || DEFAULT_LANES_PATH;
  const wantsJson = Boolean(options.json);

  if (command === 'help' || command === '--help' || command === '-h') {
    printUsage();
    return;
  }

  if (command === 'init') {
    const force = Boolean(options.force);
    const { lanesConfig } = loadLanes(lanesPath);
    const createdAt = nowIso();

    await withQueueLock(queuePath, async () => {
      fs.mkdirSync(path.dirname(queuePath), { recursive: true });
      fs.mkdirSync(path.join(path.dirname(queuePath), 'results'), { recursive: true });

      if (fs.existsSync(queuePath) && !force) {
        return;
      }

      writeJson(queuePath, {
        version: 1,
        createdAt,
        updatedAt: createdAt,
        lanesVersion: lanesConfig.version ?? 1,
        tasks: [],
      });
    });

    console.log(`Initialized queue at ${queuePath}`);
    return;
  }

  const { byId: lanesById } = loadLanes(lanesPath);

  if (command === 'assign') {
    const id = options.id;
    const title = options.title;
    const lane = options.lane;

    if (!id || !title || !lane) {
      throw new Error('assign requires --id, --title, and --lane');
    }
    if (!lanesById.has(lane)) {
      throw new Error(`Unknown lane "${lane}" in ${lanesPath}`);
    }

    const assignedAt = nowIso();
    const dependsOn = splitCsv(options['depends-on']);
    const allowedPaths = splitCsv(options.paths);
    const priority = Number(options.priority ?? 100);
    const phase = options.phase ?? 'phase3';
    const assignedBy = options['assigned-by'] ?? 'orchestrator';

    await withQueueLock(queuePath, async () => {
      const queue = loadQueue(queuePath);
      if (taskById(queue, id)) {
        throw new Error(`Task "${id}" already exists`);
      }

      queue.tasks.push({
        id,
        title,
        lane,
        phase,
        priority: Number.isFinite(priority) ? priority : 100,
        dependsOn,
        allowedPaths: allowedPaths.length > 0 ? allowedPaths : lanesById.get(lane).allowedPaths ?? [],
        status: 'queued',
        assignedBy,
        assignedAt,
        updatedAt: assignedAt,
        claimedBy: null,
        claimedAt: null,
        completedAt: null,
        blockedAt: null,
        blockerReason: null,
        needsReview: false,
        review: {
          reviewedAt: null,
          reviewedBy: null,
          notes: null,
        },
        result: {
          branch: null,
          commit: null,
          prUrl: null,
          reportPath: null,
          notes: null,
        },
        directives: buildDefaultDirectives(),
      });

      queue.updatedAt = assignedAt;
      queue.tasks.sort(compareTasks);
      writeJson(queuePath, queue);
    });

    console.log(`Assigned task ${id} (${lane})`);
    return;
  }

  if (command === 'claim') {
    const lane = options.lane;
    const agent = options.agent;
    const branch = options.branch ?? null;
    if (!lane || !agent) {
      throw new Error('claim requires --lane and --agent');
    }

    let claimedTask = null;
    await withQueueLock(queuePath, async () => {
      const queue = loadQueue(queuePath);
      if (!lanesById.has(lane)) {
        throw new Error(`Unknown lane "${lane}" in ${lanesPath}`);
      }

      const candidates = queue.tasks
        .filter((task) => task.status === 'queued' && task.lane === lane)
        .filter((task) => dependencySatisfied(queue, task))
        .sort(compareTasks);

      if (candidates.length === 0) {
        claimedTask = null;
        return;
      }

      claimedTask = candidates[0];
      const ts = nowIso();
      claimedTask.status = 'in_progress';
      claimedTask.claimedBy = agent;
      claimedTask.claimedAt = ts;
      claimedTask.updatedAt = ts;
      if (!claimedTask.directives) {
        claimedTask.directives = buildDefaultDirectives();
      }
      if (branch) claimedTask.result.branch = branch;
      queue.updatedAt = ts;
      writeJson(queuePath, queue);
    });

    if (wantsJson) {
      console.log(JSON.stringify({ task: claimedTask }, null, 2));
      return;
    }

    if (!claimedTask) {
      console.log(`No claimable task for lane ${lane}`);
      return;
    }

    console.log(`Claimed ${claimedTask.id} for ${agent}`);
    return;
  }

  if (command === 'complete') {
    const taskId = options.id;
    const agent = options.agent;
    if (!taskId || !agent) {
      throw new Error('complete requires --id and --agent');
    }

    await withQueueLock(queuePath, async () => {
      const queue = loadQueue(queuePath);
      const task = taskById(queue, taskId);
      if (!task) throw new Error(`Task not found: ${taskId}`);
      if (task.status !== 'in_progress') {
        throw new Error(`Task ${taskId} cannot be completed from status "${task.status}"`);
      }

      const ts = nowIso();
      task.status = 'done';
      task.completedAt = ts;
      task.updatedAt = ts;
      task.claimedBy = task.claimedBy ?? agent;
      task.needsReview = true;
      task.result = {
        branch: options.branch ?? task.result.branch ?? null,
        commit: options.commit ?? null,
        prUrl: options.pr ?? null,
        reportPath: options.report ?? null,
        notes: options.notes ?? null,
      };
      queue.updatedAt = ts;
      writeJson(queuePath, queue);
    });

    console.log(`Completed task ${taskId}`);
    return;
  }

  if (command === 'block') {
    const taskId = options.id;
    const agent = options.agent;
    const reason = options.reason;
    if (!taskId || !agent || !reason) {
      throw new Error('block requires --id, --agent, and --reason');
    }

    await withQueueLock(queuePath, async () => {
      const queue = loadQueue(queuePath);
      const task = taskById(queue, taskId);
      if (!task) throw new Error(`Task not found: ${taskId}`);
      if (task.status !== 'in_progress' && task.status !== 'queued') {
        throw new Error(`Task ${taskId} cannot be blocked from status "${task.status}"`);
      }

      const ts = nowIso();
      task.status = 'blocked';
      task.blockedAt = ts;
      task.updatedAt = ts;
      task.claimedBy = task.claimedBy ?? agent;
      task.blockerReason = reason;
      task.needsReview = true;
      queue.updatedAt = ts;
      writeJson(queuePath, queue);
    });

    console.log(`Blocked task ${taskId}`);
    return;
  }

  if (command === 'requeue') {
    const taskId = options.id;
    if (!taskId) {
      throw new Error('requeue requires --id');
    }

    await withQueueLock(queuePath, async () => {
      const queue = loadQueue(queuePath);
      const task = taskById(queue, taskId);
      if (!task) throw new Error(`Task not found: ${taskId}`);

      const ts = nowIso();
      task.status = 'queued';
      task.updatedAt = ts;
      task.claimedAt = null;
      task.claimedBy = null;
      task.completedAt = null;
      task.blockedAt = null;
      task.blockerReason = options.reason ?? null;
      task.needsReview = false;
      queue.updatedAt = ts;
      writeJson(queuePath, queue);
    });

    console.log(`Requeued task ${taskId}`);
    return;
  }

  if (command === 'ack') {
    const taskId = options.id;
    if (!taskId) throw new Error('ack requires --id');
    const reviewer = options.by ?? 'orchestrator';
    const notes = options.notes ?? null;

    await withQueueLock(queuePath, async () => {
      const queue = loadQueue(queuePath);
      const task = taskById(queue, taskId);
      if (!task) throw new Error(`Task not found: ${taskId}`);
      if (task.status !== 'done' && task.status !== 'blocked') {
        throw new Error(`Task ${taskId} cannot be acknowledged from status "${task.status}"`);
      }

      const ts = nowIso();
      task.needsReview = false;
      task.updatedAt = ts;
      task.review = {
        reviewedAt: ts,
        reviewedBy: reviewer,
        notes,
      };
      queue.updatedAt = ts;
      writeJson(queuePath, queue);
    });

    console.log(`Acknowledged task ${taskId}`);
    return;
  }

  if (command === 'status') {
    const queue = loadQueue(queuePath);
    const lane = options.lane || null;
    const includeDone = Boolean(options.all);
    const summary = summarize(queue, lane);
    const tasks = queue.tasks
      .filter((task) => (lane ? task.lane === lane : true))
      .filter((task) => (includeDone ? true : task.status !== 'done' && task.status !== 'canceled'))
      .sort(compareTasks);

    if (wantsJson) {
      console.log(JSON.stringify({ summary, tasks }, null, 2));
      return;
    }

    console.log(`Queue: ${queuePath}`);
    console.log(`Summary: ${JSON.stringify(summary)}`);
    for (const task of tasks) {
      console.log(formatTaskLine(task));
    }
    return;
  }

  if (command === 'poll') {
    const queue = loadQueue(queuePath);
    const needingReview = queue.tasks.filter((task) => task.needsReview === true);
    const blocked = queue.tasks.filter((task) => task.status === 'blocked');
    const inProgress = queue.tasks.filter((task) => task.status === 'in_progress');

    const payload = {
      needingReview,
      blocked,
      inProgress,
      summary: summarize(queue, null),
    };

    if (wantsJson) {
      console.log(JSON.stringify(payload, null, 2));
    } else {
      console.log(`Summary: ${JSON.stringify(payload.summary)}`);
      console.log(`Needs review: ${needingReview.length}`);
      for (const task of needingReview) console.log(`REVIEW ${formatTaskLine(task)}`);
      console.log(`Blocked: ${blocked.length}`);
      for (const task of blocked) console.log(`BLOCKED ${formatTaskLine(task)} reason=${task.blockerReason}`);
      console.log(`In progress: ${inProgress.length}`);
      for (const task of inProgress) console.log(`IN_PROGRESS ${formatTaskLine(task)} by=${task.claimedBy}`);
    }

    if (options['fail-on-blocked'] && blocked.length > 0) {
      process.exitCode = 2;
    }
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(`[agent-control] ${error.message}`);
  process.exitCode = 1;
});
