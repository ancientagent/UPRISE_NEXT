#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

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

function main() {
  const runtimePath = getArg('--runtime', '.reliant/runtime/current-task.json');
  const dryRun = hasFlag('--dry-run');
  const absPath = path.resolve(runtimePath);

  if (!fs.existsSync(absPath)) {
    process.stdout.write(
      JSON.stringify(
        {
          cleared: false,
          dryRun,
          wouldClear: false,
          runtimeState: 'missing',
          runtimePath,
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
  process.stdout.write(
    JSON.stringify(
      {
        cleared: !dryRun,
        dryRun,
        wouldClear: true,
        runtimeState: parsed && parsed.invalidJson ? 'invalid_json' : 'present',
        runtimePath,
        checkedAt: nowIso(),
        previousTaskId: parsed && typeof parsed === 'object' ? parsed.taskId ?? null : null,
      },
      null,
      2,
    ),
  );
}

main();
