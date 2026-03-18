#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const UX_BATCH_QUEUE_PATTERN = /(^|\/)mvp-lane-[a-e]-ux-[^/]*batch(16|17)\.json$/;

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

export const REQUIRED_UX_BATCH17_FILES = [
  {
    path: 'docs/solutions/MVP_UX_MASTER_LOCK_R1.md',
    kind: 'ux_lock',
    rationale: 'Single authoritative UX execution lock for Batch17 lane work.',
  },
  {
    path: 'docs/solutions/MVP_UX_DRIFT_GUARD_R1.md',
    kind: 'drift_guard',
    rationale: 'Batch17 drift-prevention contract for MVP UX execution.',
  },
  {
    path: 'docs/specs/communities/plot-and-scene-plot.md',
    kind: 'spec_anchor',
    rationale: 'Required Plot/scene ownership and route semantics anchor.',
  },
  {
    path: 'docs/specs/communities/discovery-scene-switching.md',
    kind: 'spec_anchor',
    rationale: 'Required discovery scene-switching semantics anchor.',
  },
  {
    path: 'docs/specs/users/onboarding-home-scene-resolution.md',
    kind: 'spec_anchor',
    rationale: 'Required onboarding Home Scene routing semantics anchor.',
  },
  {
    path: 'docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md',
    kind: 'surface_spec',
    rationale: 'Required Plot/profile surface contract for Batch17 UX parity.',
  },
  {
    path: 'docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md',
    kind: 'surface_spec',
    rationale: 'Required screenshot/surface element contract for Batch17 UX parity.',
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

function parseUxBatchQueue(queuePath) {
  const match = String(queuePath || '').match(UX_BATCH_QUEUE_PATTERN);
  if (!match) return null;
  return {
    batch: Number(match[2]),
  };
}

function getRequiredFilesForBatch(batch) {
  if (batch === 16) return REQUIRED_UX_BATCH16_FILES;
  if (batch === 17) return REQUIRED_UX_BATCH17_FILES;
  return [];
}

function getExpectedRuntimeBasename(queuePath) {
  const match = String(queuePath || '').match(/mvp-lane-([a-e])-ux-[^/]*batch(16|17)\.json$/);
  if (!match) return null;
  return `current-task-lane-${match[1]}-ux-batch${match[2]}.json`;
}

export function requiresUxBatchPreflight(queuePath) {
  return parseUxBatchQueue(queuePath) != null;
}

export function runUxBatchPreflight(queuePath, { repoRoot = REPO_ROOT, runtimePath = null } = {}) {
  const normalizedQueuePath = String(queuePath || '');
  const parsed = parseUxBatchQueue(normalizedQueuePath);
  const applicable = parsed != null;

  if (!applicable) {
    return {
      applicable: false,
      ok: true,
      batch: null,
      queuePath: normalizedQueuePath,
      checkedAt: new Date().toISOString(),
      requiredFiles: [],
      naming: {
        checked: false,
        ok: true,
        queueBasename: path.basename(normalizedQueuePath),
        runtimeBasename: runtimePath ? path.basename(runtimePath) : null,
        expectedRuntimeBasename: null,
      },
      failureReasons: [],
    };
  }

  const requiredFiles = getRequiredFilesForBatch(parsed.batch).map((entry) => {
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
  const expectedRuntimeBasename = getExpectedRuntimeBasename(normalizedQueuePath);
  const naming = {
    checked: Boolean(runtimePath),
    ok: true,
    queueBasename: path.basename(normalizedQueuePath),
    runtimeBasename: runtimePath ? path.basename(runtimePath) : null,
    expectedRuntimeBasename,
  };
  if (runtimePath && expectedRuntimeBasename && naming.runtimeBasename !== expectedRuntimeBasename) {
    naming.ok = false;
  }
  const failureReasons = failures.map((file) =>
    `${file.path}: ${file.exists ? 'not readable or empty' : 'missing'}`,
  );
  if (!naming.ok) {
    failureReasons.push(
      `runtime naming mismatch: expected ${expectedRuntimeBasename}, got ${naming.runtimeBasename}`,
    );
  }

  return {
    applicable: true,
    ok: failures.length === 0 && naming.ok,
    batch: parsed.batch,
    queuePath: normalizedQueuePath,
    checkedAt: new Date().toISOString(),
    requiredFiles,
    naming,
    failureReasons,
  };
}

export function requiresUxBatch16Preflight(queuePath) {
  return parseUxBatchQueue(queuePath)?.batch === 16;
}

export function runUxBatch16Preflight(queuePath, options = {}) {
  return runUxBatchPreflight(queuePath, options);
}

function getArg(flag, fallback = null) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

function main() {
  const queuePath = getArg('--queue');
  const runtimePath = getArg('--runtime', null);
  if (!queuePath) {
    console.error('[reliant-ux-preflight] missing required argument: --queue');
    process.exit(2);
  }

  const result = runUxBatchPreflight(queuePath, { runtimePath });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
