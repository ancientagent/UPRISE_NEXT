#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';

function run(cmd, encoding = 'utf8') {
  return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'], encoding });
}

function fail(message) {
  console.error(`\n[canon:lint] FAIL: ${message}\n`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`[canon:lint] OK: ${message}`);
}

function listCanonMarkdownFiles() {
  const out = run('git -c core.quotepath=off ls-files -z docs/canon/*.md', 'buffer');
  return out
    .toString('utf8')
    .split('\0')
    .filter(Boolean);
}

function findMatches(content, regex) {
  const lines = content.split('\n');
  const matches = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (regex.test(lines[i])) {
      matches.push({ line: i + 1, text: lines[i] });
    }
  }
  return matches;
}

function main() {
  const files = listCanonMarkdownFiles();
  if (!files.length) {
    fail('No canon markdown files were found under docs/canon.');
    process.exit(process.exitCode ?? 1);
  }

  const forbiddenRules = [
    {
      name: 'Infrastructure Reciprocity (deprecated term)',
      regex: /Infrastructure Reciprocity/i,
    },
    {
      name: 'Ground Zero (deprecated UI term)',
      regex: /\bGround Zero\b/i,
    },
    {
      name: 'Status: WORKING (Not Canon)',
      regex: /Status:\s*WORKING\s*\(Not Canon\)/i,
    },
  ];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    for (const rule of forbiddenRules) {
      const matches = findMatches(content, rule.regex);
      if (matches.length) {
        const details = matches
          .map((m) => `  - ${file}:${m.line}: ${m.text.trim()}`)
          .join('\n');
        fail(`${rule.name} found in canon docs:\n${details}`);
      }
    }
  }

  if (process.exitCode) process.exit(process.exitCode);
  ok(`Checked ${files.length} canon markdown files`);
}

main();
