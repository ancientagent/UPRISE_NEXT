#!/usr/bin/env node
// generated-by: Codex on 2026-02-24

import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'scripts', 'reports', 'phase3-kickoff');
mkdirSync(OUT_DIR, { recursive: true });

const runTimestamp = new Date().toISOString().replace(/[:.]/g, '-');

const checks = [
  {
    id: 'docs-lint',
    command: 'pnpm run docs:lint',
    description: 'Docs + canon lint',
  },
  {
    id: 'infra-policy-check',
    command: 'pnpm run infra-policy-check',
    description: 'Web-tier boundary policy guard',
  },
  {
    id: 'registrar-tests',
    command:
      'pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts',
    description: 'Targeted API registrar test suite',
  },
  {
    id: 'api-typecheck',
    command: 'pnpm --filter api typecheck',
    description: 'API workspace typecheck',
  },
  {
    id: 'web-typecheck',
    command: 'pnpm --filter web typecheck',
    description: 'Web workspace typecheck',
  },
];

function runCheck(check) {
  const startedAt = new Date();
  const result = spawnSync(check.command, {
    cwd: ROOT,
    shell: true,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });
  const finishedAt = new Date();

  const status = result.status === 0 ? 'passed' : 'failed';
  const durationMs = finishedAt.getTime() - startedAt.getTime();

  const logPath = path.join(OUT_DIR, `${runTimestamp}_${check.id}.log`);
  const header = [
    `# ${check.id}`,
    `Description: ${check.description}`,
    `Command: ${check.command}`,
    `Started: ${startedAt.toISOString()}`,
    `Finished: ${finishedAt.toISOString()}`,
    `DurationMs: ${durationMs}`,
    `ExitCode: ${result.status ?? 'null'}`,
    '',
    '## STDOUT',
    result.stdout || '(empty)',
    '',
    '## STDERR',
    result.stderr || '(empty)',
    '',
  ].join('\n');

  writeFileSync(logPath, header, 'utf8');

  return {
    id: check.id,
    description: check.description,
    command: check.command,
    status,
    exitCode: result.status,
    signal: result.signal,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs,
    logPath: path.relative(ROOT, logPath),
  };
}

function readGitValue(args) {
  const output = spawnSync(`git ${args}`, {
    cwd: ROOT,
    shell: true,
    encoding: 'utf8',
  });
  if (output.status !== 0) return null;
  return output.stdout.trim() || null;
}

const results = checks.map((check) => runCheck(check));
const failed = results.filter((item) => item.status === 'failed');

const summary = {
  generatedAt: new Date().toISOString(),
  branch: readGitValue('rev-parse --abbrev-ref HEAD'),
  commit: readGitValue('rev-parse HEAD'),
  task: 'P3-QA-BOOT',
  lane: 'qa-ci',
  checks: results,
  totals: {
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
  },
};

const jsonPath = path.join(OUT_DIR, `${runTimestamp}_summary.json`);
writeFileSync(jsonPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

const mdLines = [
  `# Phase 3 Kickoff QA Baseline (${runTimestamp})`,
  '',
  `- Task: ${summary.task}`,
  `- Lane: ${summary.lane}`,
  `- Branch: ${summary.branch ?? 'unknown'}`,
  `- Commit: ${summary.commit ?? 'unknown'}`,
  `- Generated: ${summary.generatedAt}`,
  `- Passed: ${summary.totals.passed}/${summary.totals.total}`,
  `- Failed: ${summary.totals.failed}/${summary.totals.total}`,
  '',
  '| Check | Status | Exit | Duration (ms) | Log |',
  '|---|---:|---:|---:|---|',
  ...results.map(
    (item) =>
      `| ${item.id} | ${item.status} | ${item.exitCode ?? 'null'} | ${item.durationMs} | ${item.logPath} |`,
  ),
  '',
];

if (failed.length > 0) {
  mdLines.push('## Failure Catalog');
  mdLines.push('');
  for (const item of failed) {
    mdLines.push(`- ${item.id}: exit=${item.exitCode ?? 'null'} log=${item.logPath}`);
  }
  mdLines.push('');
} else {
  mdLines.push('## Failure Catalog');
  mdLines.push('');
  mdLines.push('- No failures detected in this baseline run.');
  mdLines.push('');
}

const mdPath = path.join(OUT_DIR, `${runTimestamp}_summary.md`);
writeFileSync(mdPath, mdLines.join('\n'), 'utf8');

console.log(`summary_json=${path.relative(ROOT, jsonPath)}`);
console.log(`summary_md=${path.relative(ROOT, mdPath)}`);
console.log(`failed_checks=${failed.length}`);

if (failed.length > 0) {
  process.exitCode = 1;
}
