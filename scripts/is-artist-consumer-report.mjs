#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

const includeExt = /\.(ts|tsx|js|jsx|mjs|cjs)$/;
const excludePath = /(node_modules|dist|\.next|coverage|docs\/legacy)/;
const selfPath = 'scripts/is-artist-consumer-report.mjs';
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const outArg = args.find((arg) => arg.startsWith('--out='));
const outputPath = outArg ? outArg.slice('--out='.length).trim() : '';

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
const report = {
  filesScanned: files.length,
  filesWithIsArtistReferences: uniqueFiles.size,
  totalIsArtistReferences: findings.length,
  linesWithIsArtistTransitionalMention: aliasMentions,
  findings,
};

if (outputPath) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(report, null, 2));
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

console.log('isArtist Consumer Readiness Report');
console.log('================================');
console.log(`Files scanned: ${report.filesScanned}`);
console.log(`Files with isArtist references: ${report.filesWithIsArtistReferences}`);
console.log(`Total isArtist line references: ${report.totalIsArtistReferences}`);
console.log(`Lines already mentioning isArtistTransitional: ${aliasMentions}`);
console.log('');

if (report.totalIsArtistReferences === 0) {
  console.log('No isArtist references found in scanned code files.');
  process.exit(0);
}

for (const finding of report.findings) {
  console.log(`${finding.file}:${finding.line} | ${finding.content}`);
}
