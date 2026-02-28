#!/usr/bin/env node
import { spawn } from 'node:child_process';

function getArg(flag, fallback = null) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function usage() {
  console.error(
    [
      'usage:',
      '  node scripts/output-auto-continue.mjs --cmd "<command>" --when "<match-text>" --send "<input-text>" [--ignore-case] [--repeat]',
      '',
      'example:',
      '  node scripts/output-auto-continue.mjs --cmd "reliant run ..." --when "job is complete" --send "continue" --ignore-case',
    ].join('\n'),
  );
}

const cmd = getArg('--cmd');
const whenText = getArg('--when');
const sendText = getArg('--send');
const ignoreCase = hasFlag('--ignore-case');
const repeat = hasFlag('--repeat');

if (!cmd || !whenText || !sendText) {
  usage();
  process.exit(2);
}

const needle = ignoreCase ? whenText.toLowerCase() : whenText;
let fired = false;

const child = spawn(cmd, {
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe'],
});

function maybeTrigger(chunk) {
  const text = chunk.toString();
  const hay = ignoreCase ? text.toLowerCase() : text;
  if (!hay.includes(needle)) return;
  if (fired && !repeat) return;
  fired = true;
  child.stdin.write(`${sendText}\n`);
  process.stdout.write(`\n[output-auto-continue] matched "${whenText}" -> sent "${sendText}"\n`);
}

child.stdout.on('data', (chunk) => {
  process.stdout.write(chunk);
  maybeTrigger(chunk);
});

child.stderr.on('data', (chunk) => {
  process.stderr.write(chunk);
  maybeTrigger(chunk);
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
