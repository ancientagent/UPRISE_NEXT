#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_QUEUE_PATH = 'docs/handoff/agent-control/queue.json';
const DEFAULT_LANES_PATH = 'docs/handoff/agent-control/lanes.json';
const DEFAULT_OUTPUT_DIR = 'scripts/reports/agent-bridge';
const DEFAULT_STALE_MINUTES = 45;

function parseArgs(argv) {
  const normalized = argv[0] === '--' ? argv.slice(1) : argv;
  const options = {};

  for (let i = 0; i < normalized.length; i += 1) {
    const token = normalized[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = normalized[i + 1];
    if (!next || next.startsWith('--')) {
      options[key] = true;
      continue;
    }
    options[key] = next;
    i += 1;
  }
  return options;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function writeText(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, data, 'utf8');
}

function toTsSafe(iso) {
  return iso.replaceAll(':', '-').replaceAll('.', '-');
}

function countByStatus(tasks) {
  const summary = {
    total: tasks.length,
    queued: 0,
    in_progress: 0,
    done: 0,
    blocked: 0,
    canceled: 0,
  };

  for (const task of tasks) {
    if (task.status in summary) {
      summary[task.status] += 1;
    }
  }
  return summary;
}

function isDependencySatisfied(task, doneIds, allIds) {
  const deps = Array.isArray(task.dependsOn) ? task.dependsOn : [];
  if (deps.length === 0) return true;
  return deps.every((depId) => allIds.has(depId) && doneIds.has(depId));
}

function ageMinutesFrom(isoValue, now) {
  if (!isoValue) return null;
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.floor((now.getTime() - parsed.getTime()) / 60000);
}

function buildSummary(queue, lanes, staleMinutes, now) {
  const tasks = Array.isArray(queue.tasks) ? queue.tasks : [];
  const summary = countByStatus(tasks);
  const doneIds = new Set(tasks.filter((task) => task.status === 'done').map((task) => task.id));
  const allIds = new Set(tasks.map((task) => task.id));
  const laneIds = new Set((Array.isArray(lanes.lanes) ? lanes.lanes : []).map((lane) => lane.id));

  const queuedTasks = tasks.filter((task) => task.status === 'queued');
  const inProgressTasks = tasks.filter((task) => task.status === 'in_progress');
  const blockedTasks = tasks.filter((task) => task.status === 'blocked');
  const reviewTasks = tasks.filter((task) => task.needsReview === true);

  const claimableTasks = queuedTasks.filter((task) => isDependencySatisfied(task, doneIds, allIds));
  const claimableByLane = {};
  for (const laneId of laneIds) {
    claimableByLane[laneId] = [];
  }

  for (const task of claimableTasks) {
    if (!claimableByLane[task.lane]) {
      claimableByLane[task.lane] = [];
    }
    claimableByLane[task.lane].push({
      id: task.id,
      title: task.title,
      priority: Number.isFinite(task.priority) ? task.priority : null,
    });
  }

  const staleInProgressTasks = inProgressTasks
    .map((task) => ({
      id: task.id,
      lane: task.lane,
      claimedBy: task.claimedBy ?? null,
      ageMinutes: ageMinutesFrom(task.claimedAt ?? task.updatedAt ?? null, now),
      title: task.title,
    }))
    .filter((task) => task.ageMinutes !== null && task.ageMinutes >= staleMinutes);

  return {
    generatedAt: now.toISOString(),
    queuePath: queue.__path,
    lanesPath: lanes.__path,
    staleMinutes,
    summary,
    claimableTasks: claimableTasks.map((task) => ({
      id: task.id,
      lane: task.lane,
      title: task.title,
      priority: Number.isFinite(task.priority) ? task.priority : null,
      dependsOn: Array.isArray(task.dependsOn) ? task.dependsOn : [],
    })),
    claimableByLane,
    inProgressTasks: inProgressTasks.map((task) => ({
      id: task.id,
      lane: task.lane,
      title: task.title,
      claimedBy: task.claimedBy ?? null,
      claimedAt: task.claimedAt ?? null,
    })),
    staleInProgressTasks,
    blockedTasks: blockedTasks.map((task) => ({
      id: task.id,
      lane: task.lane,
      title: task.title,
      blockerReason: task.blockerReason ?? null,
    })),
    reviewTasks: reviewTasks.map((task) => ({
      id: task.id,
      lane: task.lane,
      title: task.title,
      status: task.status,
    })),
  };
}

function buildMarkdown(summary, label) {
  const lines = [
    `# Agent Bridge Tick${label ? ` (${label})` : ''}`,
    '',
    `- Generated: ${summary.generatedAt}`,
    `- Queue: ${summary.queuePath}`,
    `- Lanes: ${summary.lanesPath}`,
    `- Stale threshold (minutes): ${summary.staleMinutes}`,
    '',
    `## Queue Summary`,
    '',
    `- total: ${summary.summary.total}`,
    `- queued: ${summary.summary.queued}`,
    `- in_progress: ${summary.summary.in_progress}`,
    `- done: ${summary.summary.done}`,
    `- blocked: ${summary.summary.blocked}`,
    `- canceled: ${summary.summary.canceled}`,
    '',
    `## Claimable By Lane`,
    '',
  ];

  const laneIds = Object.keys(summary.claimableByLane).sort();
  for (const laneId of laneIds) {
    const items = summary.claimableByLane[laneId];
    lines.push(`- ${laneId}: ${items.length}`);
    for (const item of items) {
      lines.push(`  - ${item.id}: ${item.title}`);
    }
  }

  lines.push('');
  lines.push('## Stale In-Progress Tasks');
  lines.push('');
  if (summary.staleInProgressTasks.length === 0) {
    lines.push('- none');
  } else {
    for (const task of summary.staleInProgressTasks) {
      lines.push(`- ${task.id} (${task.lane}) age=${task.ageMinutes} claimedBy=${task.claimedBy ?? 'unknown'}`);
    }
  }

  lines.push('');
  lines.push('## Needs Review');
  lines.push('');
  if (summary.reviewTasks.length === 0) {
    lines.push('- none');
  } else {
    for (const task of summary.reviewTasks) {
      lines.push(`- ${task.id} (${task.lane}) status=${task.status}`);
    }
  }

  lines.push('');
  lines.push('## Blocked');
  lines.push('');
  if (summary.blockedTasks.length === 0) {
    lines.push('- none');
  } else {
    for (const task of summary.blockedTasks) {
      lines.push(`- ${task.id} (${task.lane}) reason=${task.blockerReason ?? 'unspecified'}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

function buildTelegramText(summary, label) {
  const claimableTotal = summary.claimableTasks.length;
  const staleCount = summary.staleInProgressTasks.length;
  const reviewCount = summary.reviewTasks.length;
  const blockedCount = summary.blockedTasks.length;

  const lines = [
    label ? `[${label}] Agent Bridge` : 'Agent Bridge',
    `queued=${summary.summary.queued} in_progress=${summary.summary.in_progress} done=${summary.summary.done} blocked=${summary.summary.blocked}`,
    `claimable=${claimableTotal} review=${reviewCount} stale=${staleCount}`,
  ];

  if (blockedCount > 0) {
    lines.push(`blocked_tasks=${summary.blockedTasks.map((task) => task.id).join(',')}`);
  }
  return lines.join('\n');
}

async function maybeNotifyTelegram(summary, label) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { sent: false, reason: 'missing_env' };

  const text = buildTelegramText(summary, label);
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram notify failed (${response.status}): ${body}`);
  }

  return { sent: true, reason: null };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const queuePath = options.queue || process.env.UPRISE_AGENT_QUEUE || DEFAULT_QUEUE_PATH;
  const lanesPath = options.lanes || DEFAULT_LANES_PATH;
  const outputDir = options['output-dir'] || DEFAULT_OUTPUT_DIR;
  const staleMinutes = Number(options['stale-minutes'] ?? DEFAULT_STALE_MINUTES);
  const notifyTelegram = Boolean(options['notify-telegram']);
  const failOnBlocked = Boolean(options['fail-on-blocked']);
  const failOnStale = Boolean(options['fail-on-stale']);
  const label = typeof options.label === 'string' ? options.label : null;

  if (!fs.existsSync(queuePath)) {
    throw new Error(`Queue file not found: ${queuePath}`);
  }
  if (!fs.existsSync(lanesPath)) {
    throw new Error(`Lane config file not found: ${lanesPath}`);
  }
  if (!Number.isFinite(staleMinutes) || staleMinutes < 1) {
    throw new Error(`Invalid stale-minutes: ${options['stale-minutes']}`);
  }

  const queue = readJson(queuePath);
  queue.__path = queuePath;
  const lanes = readJson(lanesPath);
  lanes.__path = lanesPath;
  const now = new Date();
  const summary = buildSummary(queue, lanes, staleMinutes, now);

  const ts = toTsSafe(summary.generatedAt);
  const jsonPath = path.join(outputDir, `${ts}_bridge-summary.json`);
  const mdPath = path.join(outputDir, `${ts}_bridge-summary.md`);
  writeJson(jsonPath, summary);
  writeText(mdPath, buildMarkdown(summary, label));

  let telegramResult = { sent: false, reason: 'not_requested' };
  if (notifyTelegram) {
    telegramResult = await maybeNotifyTelegram(summary, label);
  }

  console.log(`summary_json=${path.relative(process.cwd(), jsonPath)}`);
  console.log(`summary_md=${path.relative(process.cwd(), mdPath)}`);
  console.log(`claimable_total=${summary.claimableTasks.length}`);
  console.log(`review_total=${summary.reviewTasks.length}`);
  console.log(`blocked_total=${summary.blockedTasks.length}`);
  console.log(`stale_total=${summary.staleInProgressTasks.length}`);
  console.log(`telegram_sent=${telegramResult.sent}`);

  if (failOnBlocked && summary.blockedTasks.length > 0) {
    process.exitCode = 2;
  } else if (failOnStale && summary.staleInProgressTasks.length > 0) {
    process.exitCode = 3;
  }
}

main().catch((error) => {
  console.error(`[agent-bridge-tick] ${error.message}`);
  process.exitCode = 1;
});
