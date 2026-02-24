#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import {
  buildHelpText,
  compactSummaryText,
  computeClaimableTasks,
  parseBridgeCommand,
  parseTelegramList,
} from './agent-bridge-telegram-lib.mjs';

const ROOT = process.cwd();
const AGENT_CONTROL_SCRIPT = path.join(ROOT, 'scripts', 'agent-control.mjs');
const DEFAULT_QUEUE_PATH = 'docs/handoff/agent-control/queue.json';
const DEFAULT_LANES_PATH = 'docs/handoff/agent-control/lanes.json';

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

function requireEnv(name, allowMissing) {
  const value = process.env[name];
  if (value) return value;
  if (allowMissing) return null;
  throw new Error(`Missing required env: ${name}`);
}

async function telegramRequest(token, method, payload) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload ?? {}),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Telegram API ${method} failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  if (!data.ok) {
    throw new Error(`Telegram API ${method} returned ok=false: ${JSON.stringify(data)}`);
  }
  return data.result;
}

function runAgentControl(command, args) {
  const result = spawnSync(process.execPath, [AGENT_CONTROL_SCRIPT, command, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 8,
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.trim() || '(empty)';
    const stdout = result.stdout?.trim() || '(empty)';
    throw new Error(`agent-control ${command} failed: ${stderr}\n${stdout}`);
  }
  return (result.stdout ?? '').trim();
}

function toShortText(value, limit = 3500) {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 20)}\n... [truncated]`;
}

function formatStatusResponse(summaryJson, lane = null) {
  const base = compactSummaryText(summaryJson);
  const tasks = Array.isArray(summaryJson.tasks) ? summaryJson.tasks : [];
  const lines = [
    lane ? `status lane=${lane}` : 'status',
    base,
    `visible_tasks=${tasks.length}`,
  ];

  for (const task of tasks.slice(0, 8)) {
    lines.push(`- ${task.id} [${task.lane}] ${task.status}`);
  }
  return lines.join('\n');
}

function formatPollResponse(pollJson) {
  const summary = compactSummaryText(pollJson);
  return [
    'poll',
    summary,
    `needs_review=${pollJson.needingReview?.length ?? 0}`,
    `blocked=${pollJson.blocked?.length ?? 0}`,
    `in_progress=${pollJson.inProgress?.length ?? 0}`,
  ].join('\n');
}

function formatClaimableResponse(statusJson, lane = null) {
  const tasks = computeClaimableTasks(statusJson.tasks ?? [], lane);
  const prefix = lane ? `claimable lane=${lane}` : 'claimable';
  if (tasks.length === 0) {
    return `${prefix}\nnone`;
  }
  const lines = [`${prefix}`, `count=${tasks.length}`];
  for (const task of tasks.slice(0, 12)) {
    lines.push(`- ${task.id} [${task.lane}] ${task.title}`);
  }
  return lines.join('\n');
}

async function processCommand(parsed, context) {
  const { queuePath, lanesPath, assignedBy } = context;

  if (!parsed || !parsed.ok) {
    return parsed?.error || 'Unsupported message';
  }

  if (parsed.type === 'help') {
    return buildHelpText();
  }

  if (parsed.type === 'status') {
    const args = ['--queue', queuePath, '--lanes', lanesPath, '--json'];
    if (parsed.lane) args.push('--lane', parsed.lane);
    const json = JSON.parse(runAgentControl('status', args));
    return formatStatusResponse(json, parsed.lane);
  }

  if (parsed.type === 'poll') {
    const json = JSON.parse(runAgentControl('poll', ['--queue', queuePath, '--lanes', lanesPath, '--json']));
    return formatPollResponse(json);
  }

  if (parsed.type === 'claimable') {
    const statusJson = JSON.parse(runAgentControl('status', ['--queue', queuePath, '--lanes', lanesPath, '--json']));
    return formatClaimableResponse(statusJson, parsed.lane);
  }

  if (parsed.type === 'assign') {
    const args = [
      '--queue',
      queuePath,
      '--lanes',
      lanesPath,
      '--id',
      parsed.taskId,
      '--lane',
      parsed.lane,
      '--title',
      parsed.title,
      '--priority',
      String(parsed.priority),
      '--assigned-by',
      assignedBy,
    ];
    if (parsed.dependsOn) args.push('--depends-on', parsed.dependsOn);
    runAgentControl('assign', args);
    return `assigned ${parsed.taskId} lane=${parsed.lane}`;
  }

  if (parsed.type === 'ack') {
    const args = ['--queue', queuePath, '--lanes', lanesPath, '--id', parsed.taskId];
    if (parsed.notes) args.push('--notes', parsed.notes);
    runAgentControl('ack', args);
    return `acknowledged ${parsed.taskId}`;
  }

  if (parsed.type === 'requeue') {
    const args = ['--queue', queuePath, '--lanes', lanesPath, '--id', parsed.taskId];
    if (parsed.reason) args.push('--reason', parsed.reason);
    runAgentControl('requeue', args);
    return `requeued ${parsed.taskId}`;
  }

  return 'Unsupported command';
}

function isAuthorized(update, allowedUserIds, allowedChatIds) {
  const message = update?.message;
  if (!message) return false;
  const fromId = String(message?.from?.id ?? '');
  const chatId = String(message?.chat?.id ?? '');
  if (!fromId || !chatId) return false;

  const userAllowed = allowedUserIds.length === 0 || allowedUserIds.includes(fromId);
  const chatAllowed = allowedChatIds.length === 0 || allowedChatIds.includes(chatId);
  return userAllowed && chatAllowed;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const allowMissingToken = Boolean(options['allow-missing-token']);
  const telegramToken = requireEnv('TELEGRAM_BOT_TOKEN', allowMissingToken);
  if (!telegramToken) {
    console.log('telegram_skipped=true reason=missing_token');
    return;
  }

  const queuePath = options.queue || process.env.UPRISE_AGENT_QUEUE || DEFAULT_QUEUE_PATH;
  const lanesPath = options.lanes || DEFAULT_LANES_PATH;
  const assignedBy = options['assigned-by'] || 'telegram-bridge';
  const limit = Number(options.limit ?? 25);

  const allowedUserIds = parseTelegramList(process.env.TELEGRAM_ALLOWED_USER_IDS || process.env.TELEGRAM_ALLOWED_USER_ID);
  if (allowedUserIds.length === 0) {
    throw new Error('Missing TELEGRAM_ALLOWED_USER_IDS or TELEGRAM_ALLOWED_USER_ID');
  }
  const allowedChatIds = parseTelegramList(process.env.TELEGRAM_ALLOWED_CHAT_IDS);

  const updates = await telegramRequest(telegramToken, 'getUpdates', {
    timeout: 0,
    limit,
    allowed_updates: ['message'],
  });

  const sorted = Array.isArray(updates)
    ? [...updates].sort((a, b) => (a.update_id ?? 0) - (b.update_id ?? 0))
    : [];

  let processed = 0;
  let ignored = 0;
  let unauthorized = 0;
  let errors = 0;
  let maxUpdateId = null;

  for (const update of sorted) {
    if (typeof update.update_id === 'number') {
      maxUpdateId = Math.max(maxUpdateId ?? update.update_id, update.update_id);
    }

    const message = update?.message;
    const text = message?.text;
    if (!text || !text.startsWith('/')) {
      ignored += 1;
      continue;
    }

    const chatId = message?.chat?.id;
    if (!isAuthorized(update, allowedUserIds, allowedChatIds)) {
      unauthorized += 1;
      await telegramRequest(telegramToken, 'sendMessage', {
        chat_id: chatId,
        text: 'Unauthorized sender/chat for agent bridge commands.',
      });
      continue;
    }

    const parsed = parseBridgeCommand(text);
    try {
      const responseText = await processCommand(parsed, { queuePath, lanesPath, assignedBy });
      await telegramRequest(telegramToken, 'sendMessage', {
        chat_id: chatId,
        text: toShortText(responseText),
        disable_web_page_preview: true,
      });
      processed += 1;
    } catch (error) {
      errors += 1;
      await telegramRequest(telegramToken, 'sendMessage', {
        chat_id: chatId,
        text: toShortText(`Command failed: ${error.message}`),
        disable_web_page_preview: true,
      });
    }
  }

  if (maxUpdateId !== null) {
    await telegramRequest(telegramToken, 'getUpdates', {
      offset: maxUpdateId + 1,
      limit: 1,
      timeout: 0,
      allowed_updates: ['message'],
    });
  }

  console.log(`updates_total=${sorted.length}`);
  console.log(`processed=${processed}`);
  console.log(`ignored=${ignored}`);
  console.log(`unauthorized=${unauthorized}`);
  console.log(`errors=${errors}`);
  console.log(`max_update_id=${maxUpdateId ?? 'none'}`);
}

main().catch((error) => {
  console.error(`[agent-bridge-telegram] ${error.message}`);
  process.exitCode = 1;
});
