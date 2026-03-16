#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const UX_BATCH16_QUEUE_PATTERN = /(^|\/)mvp-lane-[a-e]-ux-[^/]*batch16\.json$/;

export const REQUIRED_UX_BATCH16_FILES = [
  {
    path: 'docs/solutions/MVP_UX_MASTER_LOCK_R1.md',
    kind: 'ux_lock',
    rationale: 'Single authoritative UX execution lock for Batch16 lane work.',
  },
  {
    path: 'docs/solutions/MVP_UX_BATCH16_EXECUTION_PLAN.md',
    kind: 'execution_plan',
    rationale: 'Lane execution contract and queue/runtime loop for Batch16.',
  },
  {
    path: 'docs/solutions/MVP_UX_BATCH16_DRIFT_WATCHLIST.md',
    kind: 'drift_watchlist',
    rationale: 'Batch16 drift-prevention checklist and validation gates.',
  },
  {
    path: 'docs/specs/users/onboarding-home-scene-resolution.md',
    kind: 'spec_anchor',
    rationale: 'Required onboarding Home Scene routing semantics anchor.',
  },
  {
    path: 'docs/specs/communities/plot-and-scene-plot.md',
    kind: 'spec_anchor',
    rationale: 'Required Plot/scene ownership and route semantics anchor.',
  },
];

function readFileReadable(absPath) {
  try {
    const raw = fs.readFileSync(absPath, 'utf8');
    return { ok: true, raw };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function requiresUxBatch16Preflight(queuePath) {
  return UX_BATCH16_QUEUE_PATTERN.test(queuePath);
}

export function runUxBatch16Preflight(queuePath, { repoRoot = REPO_ROOT } = {}) {
  const normalizedQueuePath = String(queuePath || '');
  const applicable = requiresUxBatch16Preflight(normalizedQueuePath);

  if (!applicable) {
    return {
      applicable: false,
      ok: true,
      queuePath: normalizedQueuePath,
      checkedAt: new Date().toISOString(),
      requiredFiles: [],
      failureReasons: [],
    };
  }

  const requiredFiles = REQUIRED_UX_BATCH16_FILES.map((entry) => {
    const absPath = path.resolve(repoRoot, entry.path);
    const readResult = readFileReadable(absPath);
    const isReadable = readResult.ok;
    const hasContent = isReadable ? readResult.raw.trim().length > 0 : false;
    return {
      ...entry,
      absPath,
      exists: fs.existsSync(absPath),
      readable: isReadable,
      hasContent,
      status: isReadable && hasContent ? 'ok' : 'missing_or_unreadable',
      error: readResult.ok ? null : readResult.error,
    };
  });

  const failures = requiredFiles.filter((file) => file.status !== 'ok');
  return {
    applicable: true,
    ok: failures.length === 0,
    queuePath: normalizedQueuePath,
    checkedAt: new Date().toISOString(),
    requiredFiles,
    failureReasons: failures.map((file) =>
      `${file.path}: ${file.exists ? 'not readable or empty' : 'missing'}`,
    ),
  };
}

function getArg(flag, fallback = null) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

function main() {
  const queuePath = getArg('--queue');
  if (!queuePath) {
    console.error('[reliant-ux-preflight] missing required argument: --queue');
    process.exit(2);
  }

  const result = runUxBatch16Preflight(queuePath);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
