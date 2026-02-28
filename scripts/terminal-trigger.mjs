#!/usr/bin/env node
import readline from 'node:readline';
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
      '  node scripts/terminal-trigger.mjs --match "<text>" --run "<command>" [--ignore-case] [--contains] [--loop]',
      '',
      'examples:',
      '  node scripts/terminal-trigger.mjs --match "go" --run "node scripts/reliant-slice-queue.mjs status --queue .reliant/queue/mvp-slices.json"',
      '  node scripts/terminal-trigger.mjs --match "run" --run "pnpm run verify" --ignore-case --loop',
    ].join('\n'),
  );
}

const matchValue = getArg('--match');
const runCommand = getArg('--run');
const ignoreCase = hasFlag('--ignore-case');
const containsMatch = hasFlag('--contains');
const loopMode = hasFlag('--loop');

if (!matchValue || !runCommand) {
  usage();
  process.exit(2);
}

const normalizedNeedle = ignoreCase ? matchValue.toLowerCase() : matchValue;

function isMatch(input) {
  const candidate = ignoreCase ? input.toLowerCase() : input;
  return containsMatch ? candidate.includes(normalizedNeedle) : candidate === normalizedNeedle;
}

let running = false;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  `[terminal-trigger] waiting for input match (${containsMatch ? 'contains' : 'exact'}): "${matchValue}"`,
);
console.log(`[terminal-trigger] command: ${runCommand}`);
console.log('[terminal-trigger] type and press Enter');
rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const text = line.trim();
  if (!isMatch(text)) {
    rl.prompt();
    return;
  }

  if (running) {
    console.log('[terminal-trigger] command already running; ignoring trigger');
    rl.prompt();
    return;
  }

  running = true;
  console.log('[terminal-trigger] matched; executing command...');
  const child = spawn(runCommand, {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    running = false;
    console.log(`[terminal-trigger] command exited with code ${code ?? 0}`);
    if (!loopMode) {
      rl.close();
      process.exit(code ?? 0);
    }
    rl.prompt();
  });
});

rl.on('close', () => {
  if (!running) process.exit(0);
});
