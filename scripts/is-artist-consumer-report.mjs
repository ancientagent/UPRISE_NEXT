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
const args = process.argv.slice(2).filter((arg) => arg !== '--');
const asJson = args.includes('--json');
const outArg = args.find((arg) => arg.startsWith('--out='));
const outputPath = outArg ? outArg.slice('--out='.length).trim() : '';
const failOnUnapproved = args.includes('--fail-on-unapproved');
const approvedLegacyPaths = new Set([
  'apps/api/src/users/users.service.ts',
  'apps/api/test/users.profile.collection.test.ts',
]);

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
  unapprovedLegacyReferences: findings.filter((finding) => !approvedLegacyPaths.has(finding.file)),
  findings,
};

if (outputPath) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(report, null, 2));
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
  if (failOnUnapproved && report.unapprovedLegacyReferences.length > 0) {
    process.exit(2);
  }
  process.exit(0);
}

console.log('isArtist Consumer Readiness Report');
console.log('================================');
console.log(`Files scanned: ${report.filesScanned}`);
console.log(`Files with isArtist references: ${report.filesWithIsArtistReferences}`);
console.log(`Total isArtist line references: ${report.totalIsArtistReferences}`);
console.log(`Lines already mentioning isArtistTransitional: ${aliasMentions}`);
console.log(`Unapproved legacy references: ${report.unapprovedLegacyReferences.length}`);
console.log('');

if (report.totalIsArtistReferences === 0) {
  console.log('No isArtist references found in scanned code files.');
  process.exit(0);
}

for (const finding of report.findings) {
  console.log(`${finding.file}:${finding.line} | ${finding.content}`);
}

if (failOnUnapproved && report.unapprovedLegacyReferences.length > 0) {
  console.error('');
  console.error('Unapproved legacy isArtist references detected:');
  for (const finding of report.unapprovedLegacyReferences) {
    console.error(`${finding.file}:${finding.line} | ${finding.content}`);
  }
  process.exit(2);
}
