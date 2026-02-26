#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function nowIso() {
  return new Date().toISOString();
}

function getArg(flag, fallback = null) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

function requireArg(flag) {
  const value = getArg(flag);
  if (!value) {
    console.error(`[reliant-slice-queue] missing required argument: ${flag}`);
    process.exit(2);
  }
  return value;
}

function ensureQueueShape(queue) {
  if (!queue || typeof queue !== 'object' || !Array.isArray(queue.tasks)) {
    throw new Error('queue must be an object with a tasks array');
  }
}

function claimTask(queuePath, runtimePath) {
  const queue = readJson(queuePath);
  ensureQueueShape(queue);

  const task = queue.tasks.find((t) => t.status === 'queued');
  if (!task) {
    process.stdout.write(JSON.stringify({ claimed: false, message: 'no queued tasks' }));
    process.exit(10);
  }

  task.status = 'in_progress';
  task.startedAt = nowIso();
  task.updatedAt = nowIso();
  writeJson(queuePath, queue);

  const runtime = {
    taskId: task.id,
    title: task.title,
    prompt: task.prompt,
    verifyCommand: task.verifyCommand || null,
    claimedAt: task.startedAt,
  };
  writeJson(runtimePath, runtime);
  process.stdout.write(JSON.stringify({ claimed: true, task: runtime }));
}

function completeTask(queuePath, runtimePath, reportPath) {
  const queue = readJson(queuePath);
  ensureQueueShape(queue);
  const runtime = readJson(runtimePath);

  const task = queue.tasks.find((t) => t.id === runtime.taskId);
  if (!task) {
    console.error(`[reliant-slice-queue] task not found: ${runtime.taskId}`);
    process.exit(3);
  }

  task.status = 'done';
  task.finishedAt = nowIso();
  task.updatedAt = nowIso();
  if (reportPath) task.reportPath = reportPath;
  writeJson(queuePath, queue);

  process.stdout.write(JSON.stringify({ completed: true, taskId: runtime.taskId }));
}

function blockTask(queuePath, runtimePath, reason) {
  const queue = readJson(queuePath);
  ensureQueueShape(queue);
  const runtime = readJson(runtimePath);

  const task = queue.tasks.find((t) => t.id === runtime.taskId);
  if (!task) {
    console.error(`[reliant-slice-queue] task not found: ${runtime.taskId}`);
    process.exit(3);
  }

  task.status = 'blocked';
  task.blockedAt = nowIso();
  task.updatedAt = nowIso();
  task.blockerReason = reason || 'unspecified';
  writeJson(queuePath, queue);

  process.stdout.write(JSON.stringify({ blocked: true, taskId: runtime.taskId, reason: task.blockerReason }));
}

function status(queuePath) {
  const queue = readJson(queuePath);
  ensureQueueShape(queue);

  const summary = queue.tasks.reduce(
    (acc, t) => {
      acc.total += 1;
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    { total: 0, queued: 0, in_progress: 0, done: 0, blocked: 0 },
  );

  process.stdout.write(JSON.stringify({ summary, tasks: queue.tasks }, null, 2));
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

  writeJson(queuePath, template);
  process.stdout.write(JSON.stringify({ initialized: true, queuePath }));
}

function main() {
  const cmd = process.argv[2];
  if (!cmd) {
    console.error('usage: node scripts/reliant-slice-queue.mjs <init|claim|complete|block|status> --queue <path> [--runtime <path>]');
    process.exit(2);
  }

  const queuePath = requireArg('--queue');
  const runtimePath = getArg('--runtime', '.reliant/runtime/current-task.json');

  switch (cmd) {
    case 'init':
      initTemplate(queuePath);
      return;
    case 'claim':
      claimTask(queuePath, runtimePath);
      return;
    case 'complete': {
      const reportPath = getArg('--report', null);
      completeTask(queuePath, runtimePath, reportPath);
      return;
    }
    case 'block': {
      const reason = getArg('--reason', 'blocked without reason');
      blockTask(queuePath, runtimePath, reason);
      return;
    }
    case 'status':
      status(queuePath);
      return;
    default:
      console.error(`unknown command: ${cmd}`);
      process.exit(2);
  }
}

main();
