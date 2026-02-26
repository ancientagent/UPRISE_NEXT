#!/usr/bin/env node

export function parseTelegramList(value) {
  if (!value || typeof value !== 'string') return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseNonNegativeInteger(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.floor(parsed);
}

function stripCommandPrefix(token) {
  if (!token.startsWith('/')) return null;
  return token.slice(1).split('@')[0].toLowerCase();
}

function toTokens(text) {
  return text
    .trim()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

export function parseBridgeCommand(text) {
  if (!text || typeof text !== 'string') return null;
  const tokens = toTokens(text);
  if (tokens.length === 0) return null;

  const command = stripCommandPrefix(tokens[0]);
  if (!command) return null;
  const args = tokens.slice(1);

  if (command === 'help' || command === 'start') {
    return { ok: true, type: 'help' };
  }

  if (command === 'status') {
    return { ok: true, type: 'status', lane: args[0] ?? null };
  }

  if (command === 'poll') {
    return { ok: true, type: 'poll' };
  }

  if (command === 'claimable') {
    return { ok: true, type: 'claimable', lane: args[0] ?? null };
  }

  if (command === 'ack') {
    if (!args[0]) {
      return { ok: false, error: 'Usage: /ack <TASK_ID> [notes...]' };
    }
    return {
      ok: true,
      type: 'ack',
      taskId: args[0],
      notes: args.slice(1).join(' ').trim() || null,
    };
  }

  if (command === 'requeue') {
    if (!args[0]) {
      return { ok: false, error: 'Usage: /requeue <TASK_ID> [reason...]' };
    }
    return {
      ok: true,
      type: 'requeue',
      taskId: args[0],
      reason: args.slice(1).join(' ').trim() || null,
    };
  }

  if (command === 'assign') {
    if (args.length < 3) {
      return {
        ok: false,
        error: 'Usage: /assign <TASK_ID> <LANE> [PRIORITY] <TITLE...> [--depends=A,B]',
      };
    }

    const taskId = args[0];
    const lane = args[1];
    let cursor = 2;
    let priority = 100;

    if (/^-?\d+$/.test(args[cursor] ?? '')) {
      priority = Number(args[cursor]);
      cursor += 1;
    }

    const rest = args.slice(cursor);
    const dependsArg = rest.find((item) => item.startsWith('--depends='));
    const dependsOn = dependsArg ? dependsArg.slice('--depends='.length).trim() : null;
    const titleTokens = rest.filter((item) => !item.startsWith('--depends='));
    const title = titleTokens.join(' ').trim();
    if (!title) {
      return {
        ok: false,
        error: 'Usage: /assign <TASK_ID> <LANE> [PRIORITY] <TITLE...> [--depends=A,B]',
      };
    }

    return {
      ok: true,
      type: 'assign',
      taskId,
      lane,
      priority,
      title,
      dependsOn,
    };
  }

  return { ok: false, error: `Unknown command: /${command}` };
}

export function buildHelpText() {
  return [
    'Agent Bridge Commands:',
    '/status [lane]',
    '/poll',
    '/claimable [lane]',
    '/assign <TASK_ID> <LANE> [PRIORITY] <TITLE...> [--depends=A,B]',
    '/ack <TASK_ID> [notes...]',
    '/requeue <TASK_ID> [reason...]',
  ].join('\n');
}

export function computeClaimableTasks(tasks, laneFilter = null) {
  const list = Array.isArray(tasks) ? tasks : [];
  const doneIds = new Set(list.filter((task) => task.status === 'done').map((task) => task.id));
  const allIds = new Set(list.map((task) => task.id));

  return list
    .filter((task) => task.status === 'queued')
    .filter((task) => !laneFilter || task.lane === laneFilter)
    .filter((task) => {
      const deps = Array.isArray(task.dependsOn) ? task.dependsOn : [];
      return deps.every((depId) => allIds.has(depId) && doneIds.has(depId));
    });
}

export function compactSummaryText(summary) {
  const s = summary?.summary ?? {};
  return [
    `total=${s.total ?? 0}`,
    `queued=${s.queued ?? 0}`,
    `in_progress=${s.in_progress ?? 0}`,
    `done=${s.done ?? 0}`,
    `blocked=${s.blocked ?? 0}`,
  ].join(' ');
}
