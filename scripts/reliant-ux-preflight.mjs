#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const UX_BATCH_QUEUE_PATTERN = /(^|\/)mvp-lane-([a-e])-ux-[^/]*batch(16|17)\.json$/;

export const REQUIRED_UX_BATCH_FILES = {
  16: [
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
  ],
  17: [
    {
      path: 'docs/solutions/MVP_UX_BATCH17_EXECUTION_PLAN.md',
      kind: 'execution_plan',
      rationale: 'Lane execution contract and queue/runtime loop for Batch17.',
    },
    {
      path: 'docs/solutions/MVP_UX_MASTER_LOCK_R1.md',
      kind: 'ux_lock',
      rationale: 'Single authoritative UX execution lock for Batch17 lane work.',
    },
    {
      path: 'docs/solutions/MVP_UX_DRIFT_GUARD_R1.md',
      kind: 'drift_guard',
      rationale: 'Batch17 lane source requires the drift guard to be re-read per lane.',
    },
    {
      path: 'docs/specs/communities/plot-and-scene-plot.md',
      kind: 'spec_anchor',
      rationale: 'Required Plot/scene ownership and route semantics anchor.',
    },
    {
      path: 'docs/specs/communities/discovery-scene-switching.md',
      kind: 'spec_anchor',
      rationale: 'Required discovery scene switching anchor for Batch17.',
    },
    {
      path: 'docs/specs/users/onboarding-home-scene-resolution.md',
      kind: 'spec_anchor',
      rationale: 'Required onboarding Home Scene routing semantics anchor.',
    },
    {
      path: 'docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md',
      kind: 'surface_lock',
      rationale: 'Required Plot/profile surface contract for Batch17.',
    },
    {
      path: 'docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md',
      kind: 'surface_lock',
      rationale: 'Required screenshot element contract for Batch17.',
    },
  ],
};

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
    lane: match[2],
    batch: Number(match[3]),
  };
}

function deriveExpectedRuntimePath(queuePath) {
  const parsed = parseUxBatchQueue(queuePath);
  if (!parsed) return null;
  return `.reliant/runtime/current-task-lane-${parsed.lane}-ux-batch${parsed.batch}.json`;
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
      queuePath: normalizedQueuePath,
      checkedAt: new Date().toISOString(),
      runtimePath,
      naming: null,
      requiredFiles: [],
      failureReasons: [],
    };
  }

  const requiredFiles = (REQUIRED_UX_BATCH_FILES[parsed.batch] ?? []).map((entry) => {
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
  const expectedRuntimePath = deriveExpectedRuntimePath(normalizedQueuePath);
  const naming =
    runtimePath == null
      ? {
          checked: false,
          expectedRuntimePath,
          expectedRuntimeBasename: expectedRuntimePath ? path.basename(expectedRuntimePath) : null,
          providedRuntimePath: null,
          providedRuntimeBasename: null,
          ok: true,
        }
      : {
          checked: true,
          expectedRuntimePath,
          expectedRuntimeBasename: expectedRuntimePath ? path.basename(expectedRuntimePath) : null,
          providedRuntimePath: runtimePath,
          providedRuntimeBasename: path.basename(String(runtimePath)),
          ok: path.basename(String(runtimePath)) === path.basename(String(expectedRuntimePath)),
        };
  const failureReasons = failures.map((file) =>
    `${file.path}: ${file.exists ? 'not readable or empty' : 'missing'}`,
  );
  if (naming.checked && !naming.ok) {
    failureReasons.push(
      `runtime naming mismatch: expected ${naming.expectedRuntimePath} but received ${naming.providedRuntimePath}`,
    );
  }
  return {
    applicable: true,
    ok: failures.length === 0 && naming.ok,
    batch: parsed.batch,
    lane: parsed.lane,
    queuePath: normalizedQueuePath,
    checkedAt: new Date().toISOString(),
    runtimePath,
    naming,
    requiredFiles,
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
