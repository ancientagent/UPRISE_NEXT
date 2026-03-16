#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const UX_BATCH16_RUNTIME_QUEUE_MAP = {
  'current-task-lane-a-ux-batch16.json': '.reliant/queue/mvp-lane-a-ux-plot-batch16.json',
  'current-task-lane-b-ux-batch16.json': '.reliant/queue/mvp-lane-b-ux-discovery-batch16.json',
  'current-task-lane-c-ux-batch16.json': '.reliant/queue/mvp-lane-c-ux-player-profile-batch16.json',
  'current-task-lane-d-ux-batch16.json': '.reliant/queue/mvp-lane-d-ux-automation-batch16.json',
  'current-task-lane-e-ux-batch16.json': '.reliant/queue/mvp-lane-e-ux-qarev-batch16.json',
};

function getArg(flag, fallback = null) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

function nowIso() {
  return new Date().toISOString();
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function inferQueuePath(runtimePath) {
  const basename = path.basename(runtimePath);
  return UX_BATCH16_RUNTIME_QUEUE_MAP[basename] ?? null;
}

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function buildRuntimeFromTask(task) {
  return {
    taskId: task.id,
    title: task.title,
    prompt: task.prompt,
    verifyCommand: task.verifyCommand ?? null,
    sourceQueue: task.sourceQueue ?? null,
    claimedAt: task.startedAt || task.updatedAt || nowIso(),
  };
}

function getResumePlan(queuePath, runtimePath) {
  const absQueuePath = path.resolve(queuePath);
  if (!fs.existsSync(absQueuePath)) {
    return {
      resumeAction: 'queue_missing',
      queuePath,
      resumeCommand: null,
      resumedTaskId: null,
      queueState: 'missing',
    };
  }

  const queue = readJsonSafe(absQueuePath);
  if (!queue || !Array.isArray(queue.tasks)) {
    return {
      resumeAction: 'queue_invalid',
      queuePath,
      resumeCommand: null,
      resumedTaskId: null,
      queueState: 'invalid',
    };
  }

  const inProgressTasks = queue.tasks.filter((task) => task.status === 'in_progress');
  const queuedTasks = queue.tasks.filter((task) => task.status === 'queued');

  if (inProgressTasks.length === 1) {
    return {
      resumeAction: 'restore_in_progress',
      queuePath,
      queueState: 'in_progress_present',
      resumeCommand: null,
      resumedTaskId: inProgressTasks[0].id,
      runtimePayload: buildRuntimeFromTask(inProgressTasks[0]),
    };
  }

  if (inProgressTasks.length > 1) {
    return {
      resumeAction: 'blocked_multiple_in_progress',
      queuePath,
      queueState: 'multiple_in_progress',
      resumeCommand: null,
      resumedTaskId: null,
      inProgressTaskIds: inProgressTasks.map((task) => task.id),
    };
  }

  if (queuedTasks.length > 0) {
    return {
      resumeAction: 'claim_next',
      queuePath,
      queueState: 'queued_available',
      resumeCommand: `node scripts/reliant-slice-queue.mjs claim --queue ${queuePath} --runtime ${runtimePath}`,
      resumedTaskId: null,
    };
  }

  return {
    resumeAction: 'no_queued_tasks',
    queuePath,
    queueState: 'drained',
    resumeCommand: null,
    resumedTaskId: null,
  };
}

function main() {
  const runtimePath = getArg('--runtime', '.reliant/runtime/current-task.json');
  const queuePathArg = getArg('--queue', null);
  const dryRun = hasFlag('--dry-run');
  const resume = hasFlag('--resume');
  const absPath = path.resolve(runtimePath);
  const inferredQueuePath = queuePathArg || inferQueuePath(runtimePath);
  let resumePlan = null;

  if (!fs.existsSync(absPath)) {
    if (resume && inferredQueuePath) {
      resumePlan = getResumePlan(inferredQueuePath, runtimePath);
      if (!dryRun && resumePlan.resumeAction === 'restore_in_progress' && resumePlan.runtimePayload) {
        fs.mkdirSync(path.dirname(absPath), { recursive: true });
        fs.writeFileSync(absPath, `${JSON.stringify(resumePlan.runtimePayload, null, 2)}\n`, 'utf8');
      }
    }
    process.stdout.write(
      JSON.stringify(
        {
          cleared: false,
          dryRun,
          wouldClear: false,
          runtimeState: 'missing',
          runtimePath,
          inferredQueuePath,
          resumeRequested: resume,
          resumed: !dryRun && resumePlan?.resumeAction === 'restore_in_progress',
          resumeAction: resumePlan?.resumeAction ?? null,
          resumeCommand: resumePlan?.resumeCommand ?? null,
          resumedTaskId: resumePlan?.resumedTaskId ?? null,
          queueState: resumePlan?.queueState ?? null,
          message: 'runtime file not found',
          checkedAt: nowIso(),
        },
        null,
        2,
      ),
    );
    return;
  }

  const raw = fs.readFileSync(absPath, 'utf8');
  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { invalidJson: true };
  }

  if (!dryRun) {
    fs.unlinkSync(absPath);
  }

  if (resume && inferredQueuePath) {
    resumePlan = getResumePlan(inferredQueuePath, runtimePath);
    if (!dryRun && resumePlan.resumeAction === 'restore_in_progress' && resumePlan.runtimePayload) {
      fs.mkdirSync(path.dirname(absPath), { recursive: true });
      fs.writeFileSync(absPath, `${JSON.stringify(resumePlan.runtimePayload, null, 2)}\n`, 'utf8');
    }
  }

  process.stdout.write(
    JSON.stringify(
      {
        cleared: !dryRun,
        dryRun,
        wouldClear: true,
        runtimeState: parsed && parsed.invalidJson ? 'invalid_json' : 'present',
        runtimePath,
        inferredQueuePath,
        resumeRequested: resume,
        resumed: !dryRun && resumePlan?.resumeAction === 'restore_in_progress',
        resumeAction: resumePlan?.resumeAction ?? null,
        resumeCommand: resumePlan?.resumeCommand ?? null,
        resumedTaskId: resumePlan?.resumedTaskId ?? null,
        queueState: resumePlan?.queueState ?? null,
        checkedAt: nowIso(),
        previousTaskId: parsed && typeof parsed === 'object' ? parsed.taskId ?? null : null,
      },
      null,
      2,
    ),
  );
}

main();
