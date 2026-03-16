#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function getArg(flag, fallback = null) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

function nowIso() {
  return new Date().toISOString();
}

function writeFileIfRequested(targetPath, content) {
  if (!targetPath) return;
  const absPath = path.resolve(targetPath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, content, 'utf8');
}

function escapeFence(value) {
  return String(value ?? '').replace(/```/g, '```\\`');
}

function toMarkdown(payload) {
  const output = payload.output.trim() === '' ? '[no output captured]' : payload.output;
  return [
    '## Verify Command',
    '```bash',
    payload.command,
    '```',
    '',
    '## Verify Exit Code',
    '```text',
    String(payload.exitCode),
    '```',
    '',
    '## Exact Output',
    '```text',
    escapeFence(output),
    '```',
    '',
  ].join('\n');
}

function main() {
  const command = getArg('--command');
  if (!command) {
    console.error('[reliant-verify-transcript] missing required argument: --command');
    process.exit(2);
  }

  const format = getArg('--format', 'json');
  const markdownOut = getArg('--markdown-out', null);
  const jsonOut = getArg('--json-out', null);
  const cwd = getArg('--cwd', process.cwd());

  const result = spawnSync(command, {
    cwd,
    shell: true,
    encoding: 'utf8',
  });

  const combinedOutput = [result.stdout || '', result.stderr || ''].filter(Boolean).join(
    result.stdout && result.stderr ? '\n' : '',
  );

  const payload = {
    capturedAt: nowIso(),
    command,
    cwd,
    exitCode: result.status ?? 1,
    passed: (result.status ?? 1) === 0,
    output: combinedOutput,
  };

  const markdown = toMarkdown(payload);
  writeFileIfRequested(markdownOut, markdown);
  writeFileIfRequested(jsonOut, `${JSON.stringify(payload, null, 2)}\n`);

  if (format === 'markdown') {
    process.stdout.write(markdown);
  } else {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  }

  process.exit(payload.exitCode);
}

main();
