#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

function getArg(flag, fallback = null) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function runShell(command) {
  const res = spawnSync(command, {
    shell: true,
    encoding: 'utf8',
  });
  return {
    code: res.status ?? 1,
    stdout: res.stdout || '',
    stderr: res.stderr || '',
  };
}

function getPlan(queuePath, runtimePath) {
  const cmd = [
    'node scripts/reliant-next-action.mjs',
    `--queue ${queuePath}`,
    `--runtime ${runtimePath}`,
    '--output json',
  ].join(' ');
  const out = runShell(cmd);
  if (out.code !== 0) {
    throw new Error(`reliant-next-action failed\n${out.stderr || out.stdout}`);
  }
  return JSON.parse(out.stdout);
}

function printSummary(plan) {
  const s = plan.summary;
  console.log(
    `[autopilot] state=${plan.state} total=${s.total} queued=${s.queued} in_progress=${s.in_progress} done=${s.done} blocked=${s.blocked}`,
  );
  if (plan.nextTask) {
    console.log(`[autopilot] next=${plan.nextTask.id} :: ${plan.nextTask.title}`);
  }
  if (plan.warnings?.length) {
    for (const w of plan.warnings) console.log(`[autopilot] warning: ${w}`);
  }
}

function executeClaimFlow(plan) {
  const execCandidates = plan.commands.filter(
    (c) =>
      c.startsWith('pnpm run reliant:runtime:clean') || c.startsWith('node scripts/reliant-slice-queue.mjs claim'),
  );
  for (const command of execCandidates) {
    console.log(`[autopilot] exec: ${command}`);
    const out = runShell(command);
    if (out.stdout.trim()) process.stdout.write(`${out.stdout.trim()}\n`);
    if (out.code !== 0) {
      if (out.stderr.trim()) process.stderr.write(`${out.stderr.trim()}\n`);
      throw new Error(`command failed: ${command}`);
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const queuePath = getArg('--queue', '.reliant/queue/mvp-slices.json');
  const runtimePath = getArg('--runtime', '.reliant/runtime/current-task.json');
  const watch = hasFlag('--watch');
  const intervalMs = Number(getArg('--interval-ms', '4000'));
  const token = getArg('--token', '[[AUTO_CONTINUE]]');

  while (true) {
    let plan;
    try {
      plan = getPlan(queuePath, runtimePath);
    } catch (err) {
      console.error(`[autopilot] error: ${err.message}`);
      process.exit(1);
    }

    printSummary(plan);

    if (plan.state === 'claim_next') {
      try {
        executeClaimFlow(plan);
      } catch (err) {
        console.error(`[autopilot] claim-flow error: ${err.message}`);
        process.exit(1);
      }
      const refreshed = getPlan(queuePath, runtimePath);
      printSummary(refreshed);
      console.log('[autopilot] claimed next task; ready for execution step');
      if (refreshed.assistantPrompt) console.log(`${refreshed.assistantPrompt}`);
      console.log(token);
      if (!watch) return;
      await sleep(intervalMs);
      continue;
    }

    if (plan.state === 'resume_in_progress') {
      console.log('[autopilot] execution required for current in-progress task');
      if (plan.assistantPrompt) console.log(plan.assistantPrompt);
      console.log(token);
      if (!watch) return;
      await sleep(intervalMs);
      continue;
    }

    if (plan.state === 'blocked_only' || plan.state === 'drained') {
      console.log('[autopilot] queue stop condition reached');
      if (plan.assistantPrompt) console.log(plan.assistantPrompt);
      console.log(token);
      return;
    }

    if (plan.state === 'blocked_preflight') {
      console.log('[autopilot] UX preflight stop condition reached');
      if (plan.assistantPrompt) console.log(plan.assistantPrompt);
      console.log(token);
      return;
    }

    if (plan.state === 'error_multiple_in_progress') {
      console.error('[autopilot] multiple in-progress tasks detected; manual correction required');
      if (plan.commands?.length) {
        for (const c of plan.commands) console.error(`[autopilot] suggestion: ${c}`);
      }
      process.exit(2);
    }

    if (!watch) return;
    await sleep(intervalMs);
  }
}

main();
