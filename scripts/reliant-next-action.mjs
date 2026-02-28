#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function getArg(flag, fallback = null) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function queueSummary(tasks) {
  return tasks.reduce(
    (acc, task) => {
      acc.total += 1;
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { total: 0, queued: 0, in_progress: 0, done: 0, blocked: 0 },
  );
}

function formatTask(task) {
  if (!task) return '(none)';
  return `${task.id} — ${task.title}`;
}

function escape(value) {
  return String(value).replace(/"/g, '\\"');
}

function buildClaimCmd(queuePath, runtimePath) {
  return `node scripts/reliant-slice-queue.mjs claim --queue ${queuePath} --runtime ${runtimePath}`;
}

function buildStatusCmd(queuePath) {
  return `node scripts/reliant-slice-queue.mjs status --queue ${queuePath}`;
}

function buildCompleteCmd(queuePath, runtimePath, taskId) {
  const reportPlaceholder = `docs/handoff/${new Date().toISOString().slice(0, 10)}_<slice-id>.md`;
  return `node scripts/reliant-slice-queue.mjs complete --queue ${queuePath} --runtime ${runtimePath} --task-id ${taskId} --report ${reportPlaceholder}`;
}

function buildBlockCmd(queuePath, runtimePath, taskId) {
  return `node scripts/reliant-slice-queue.mjs block --queue ${queuePath} --runtime ${runtimePath} --task-id ${taskId} --reason "<exact blocker>"`;
}

function main() {
  const queuePath = getArg('--queue', '.reliant/queue/mvp-slices.json');
  const runtimePath = getArg('--runtime', '.reliant/runtime/current-task.json');
  const outputMode = getArg('--output', 'text'); // text|json|prompt

  const queue = readJsonSafe(queuePath);
  if (!queue || !Array.isArray(queue.tasks)) {
    console.error(`[reliant-next-action] invalid queue file: ${queuePath}`);
    process.exit(1);
  }

  const tasks = queue.tasks;
  const summary = queueSummary(tasks);
  const inProgress = tasks.filter((t) => t.status === 'in_progress');
  const queued = tasks.filter((t) => t.status === 'queued');
  const blocked = tasks.filter((t) => t.status === 'blocked');
  const runtime = readJsonSafe(runtimePath);
  const runtimeTaskId = runtime?.taskId || null;

  let state = 'idle';
  let nextTask = null;
  let warnings = [];
  let commands = [];
  let assistantPrompt = '';

  if (inProgress.length > 1) {
    state = 'error_multiple_in_progress';
    warnings.push(`multiple in_progress tasks detected: ${inProgress.map((t) => t.id).join(', ')}`);
    commands.push(buildStatusCmd(queuePath));
    commands.push(`pnpm run reliant:runtime:clean -- --runtime ${runtimePath}`);
  } else if (inProgress.length === 1) {
    state = 'resume_in_progress';
    nextTask = inProgress[0];
    if (!runtimeTaskId) {
      warnings.push('runtime file missing or invalid while queue has in_progress task');
    } else if (runtimeTaskId !== nextTask.id) {
      warnings.push(`runtime mismatch: runtime=${runtimeTaskId}, queue in_progress=${nextTask.id}`);
    }
    commands.push(buildStatusCmd(queuePath));
    commands.push(`pnpm run reliant:runtime:clean -- --runtime ${runtimePath}`);
    commands.push(
      `# After cleanup, restore runtime intentionally for current task\n` +
        `node -e "const fs=require('fs');const t=${JSON.stringify(nextTask.id)};fs.writeFileSync('${runtimePath}',JSON.stringify({taskId:t},null,2)+'\\n')"`,
    );
    commands.push(buildCompleteCmd(queuePath, runtimePath, nextTask.id));
    commands.push(buildBlockCmd(queuePath, runtimePath, nextTask.id));

    assistantPrompt = [
      'Execute exactly the current in-progress slice and move queue state forward.',
      `Task: ${nextTask.id}`,
      `Title: ${nextTask.title}`,
      `Verify command: ${nextTask.verifyCommand || '(none)'}`,
      'Do: implement scoped changes only, run verify command exactly, update docs/CHANGELOG.md + dated docs/handoff note, then mark complete.',
      `Complete command (use real report path): ${buildCompleteCmd(queuePath, runtimePath, nextTask.id)}`,
      `If unrecoverable, block command: ${buildBlockCmd(queuePath, runtimePath, nextTask.id)}`,
    ].join('\n');
  } else if (queued.length > 0) {
    state = 'claim_next';
    nextTask = queued[0];
    if (runtimeTaskId) {
      warnings.push(`stale runtime detected with no in_progress task: ${runtimeTaskId}`);
      commands.push(`pnpm run reliant:runtime:clean -- --runtime ${runtimePath}`);
    }
    commands.push(buildClaimCmd(queuePath, runtimePath));
    commands.push(buildStatusCmd(queuePath));

    assistantPrompt = [
      'Claim and execute the next queued slice end-to-end.',
      `Queue: ${queuePath}`,
      `Runtime: ${runtimePath}`,
      `Claim command: ${buildClaimCmd(queuePath, runtimePath)}`,
      'After claim: execute exact slice scope (no feature drift), run verifyCommand exactly, update docs/CHANGELOG.md + dated docs/handoff note, then complete the same runtime task.',
      'If unrecoverable: block with exact reason and continue.',
    ].join('\n');
  } else if (blocked.length > 0) {
    state = 'blocked_only';
    nextTask = blocked[0];
    commands.push(buildStatusCmd(queuePath));
    commands.push(`# Requeue one blocked task for retry (manual)\n# task: ${nextTask.id}`);
    commands.push(`pnpm run reliant:runtime:clean -- --runtime ${runtimePath}`);

    assistantPrompt = [
      'Queue has no queued tasks, only blocked tasks remain.',
      `First blocked task: ${nextTask.id} — ${nextTask.title}`,
      'Requeue a blocked task intentionally, clean runtime, then continue normal claim->execute->complete flow.',
    ].join('\n');
  } else {
    state = 'drained';
    commands.push(buildStatusCmd(queuePath));
    commands.push('node scripts/reliant-lane-cutover.mjs');
    assistantPrompt = [
      'Queue is drained. Generate or load the next batch of slices and continue.',
      'If new batch queue files exist, copy/merge into active queue and resume claim->execute loop.',
    ].join('\n');
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    queuePath,
    runtimePath,
    state,
    summary,
    runtimeTaskId,
    nextTask: nextTask
      ? {
          id: nextTask.id,
          title: nextTask.title,
          verifyCommand: nextTask.verifyCommand || null,
        }
      : null,
    warnings,
    commands,
    assistantPrompt,
  };

  if (outputMode === 'json') {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
    return;
  }

  if (outputMode === 'prompt') {
    process.stdout.write(`${assistantPrompt}\n`);
    return;
  }

  process.stdout.write(
    [
      `state: ${state}`,
      `queue: ${queuePath}`,
      `runtime: ${runtimePath}`,
      `summary: total=${summary.total} queued=${summary.queued} in_progress=${summary.in_progress} done=${summary.done} blocked=${summary.blocked}`,
      `runtime_task: ${runtimeTaskId || '(none)'}`,
      `next_task: ${formatTask(nextTask)}`,
      warnings.length ? `warnings:\n- ${warnings.join('\n- ')}` : 'warnings: (none)',
      'commands:',
      ...commands.map((c) => `- ${c}`),
      '',
      'assistant_prompt:',
      assistantPrompt,
    ].join('\n'),
  );
}

main();
