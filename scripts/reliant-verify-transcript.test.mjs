#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const scriptPath = path.join(repoRoot, 'scripts', 'reliant-verify-transcript.mjs');

function run(args, expectedCode = 0) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  if (result.status !== expectedCode) {
    throw new Error(
      `Command failed:\nnode ${scriptPath} ${args.join(' ')}\nexit=${result.status}\nstdout=${result.stdout}\nstderr=${result.stderr}`,
    );
  }
  return result;
}

function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reliant-verify-transcript-test-'));
  const markdownOut = path.join(tempDir, 'transcript.md');
  const jsonOut = path.join(tempDir, 'transcript.json');

  const success = run([
    '--command',
    `${process.execPath} -e "console.log('ok')"` ,
    '--format',
    'markdown',
    '--markdown-out',
    markdownOut,
    '--json-out',
    jsonOut,
  ]);
  assert.match(success.stdout, /## Verify Command/);
  assert.match(success.stdout, /## Verify Exit Code/);
  assert.match(success.stdout, /## Exact Output/);
  const successJson = JSON.parse(fs.readFileSync(jsonOut, 'utf8'));
  assert.equal(successJson.formatVersion, 2);
  assert.equal(successJson.exitCode, 0);
  assert.equal(successJson.exitStatus, 'passed');
  assert.equal(successJson.passed, true);
  assert.equal(successJson.commandChainDetected, false);
  assert.equal(successJson.commandSegmentCount, 1);
  assert.match(successJson.output, /ok/);
  const successMarkdown = fs.readFileSync(markdownOut, 'utf8');
  assert.match(successMarkdown, /```bash/);
  assert.match(successMarkdown, /```text/);
  assert.match(successMarkdown, /exitCode=0/);
  assert.match(successMarkdown, /commandSegmentCount=1/);

  const failure = run(
    ['--command', `${process.execPath} -e "console.error('boom'); process.exit(3)"`, '--format', 'json'],
    3,
  );
  const failureJson = JSON.parse(failure.stdout);
  assert.equal(failureJson.exitCode, 3);
  assert.equal(failureJson.exitStatus, 'failed');
  assert.equal(failureJson.passed, false);
  assert.match(failureJson.output, /boom/);

  const chained = run(
    [
      '--command',
      `${process.execPath} -e "console.log('first')" && ${process.execPath} -e "console.log('second')"`,
      '--format',
      'json',
    ],
    0,
  );
  const chainedJson = JSON.parse(chained.stdout);
  assert.equal(chainedJson.commandChainDetected, true);
  assert.equal(chainedJson.commandSegmentCount, 2);
  assert.deepEqual(chainedJson.commandChainSeparators, ['&&']);
  assert.match(chainedJson.output, /first/);
  assert.match(chainedJson.output, /second/);
}

main();
