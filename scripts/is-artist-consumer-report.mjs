#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

const includeExt = /\.(ts|tsx|js|jsx|mjs|cjs)$/;
const excludePath = /(node_modules|dist|\.next|coverage|docs\/legacy)/;
const selfPath = 'scripts/is-artist-consumer-report.mjs';

let files = [];
try {
  const raw = run('rg --files apps packages scripts');
  files = raw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((p) => includeExt.test(p))
    .filter((p) => !excludePath.test(p))
    .filter((p) => p !== selfPath);
} catch {
  files = [];
}

const findings = [];

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);

  lines.forEach((line, idx) => {
    if (!line.includes('isArtist')) return;
    findings.push({
      file,
      line: idx + 1,
      content: line.trim(),
      transitionalAliasPresent: line.includes('isArtistTransitional'),
    });
  });
}

const uniqueFiles = new Set(findings.map((f) => f.file));
const aliasMentions = findings.filter((f) => f.transitionalAliasPresent).length;

console.log('isArtist Consumer Readiness Report');
console.log('================================');
console.log(`Files scanned: ${files.length}`);
console.log(`Files with isArtist references: ${uniqueFiles.size}`);
console.log(`Total isArtist line references: ${findings.length}`);
console.log(`Lines already mentioning isArtistTransitional: ${aliasMentions}`);
console.log('');

if (findings.length === 0) {
  console.log('No isArtist references found in scanned code files.');
  process.exit(0);
}

for (const finding of findings) {
  console.log(`${finding.file}:${finding.line} | ${finding.content}`);
}
