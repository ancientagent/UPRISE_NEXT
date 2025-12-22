#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function run(cmd) {
  return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }).trim();
}

function fail(message) {
  console.error(`\n[docs:lint] ❌ ${message}\n`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`[docs:lint] ✅ ${message}`);
}

function exists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function listGitFiles(pattern) {
  try {
    const out = run(`git ls-files "${pattern}"`);
    return out ? out.split('\n').filter(Boolean) : [];
  } catch {
    return [];
  }
}

function listGitRootMarkdown() {
  const files = listGitFiles('*.md');
  // Filter to repo-root files only (no path separator).
  return files.filter((file) => !file.includes('/'));
}

function ensureReadmeInDir(dirPath) {
  const readmePath = path.join(dirPath, 'README.md');
  if (!exists(readmePath)) {
    fail(`Missing README.md in ${dirPath}`);
  }
}

function assertSpecsHaveMetadata(specPath) {
  const content = readText(specPath);
  const required = ['**ID:**', '**Status:**', '**Owner:**', '**Last Updated:**'];
  const missing = required.filter((needle) => !content.includes(needle));
  if (missing.length) {
    fail(`${specPath} is missing required metadata lines: ${missing.join(', ')}`);
  }
}

function main() {
  const repoRoot = process.cwd();

  // Forbidden tracked artifacts
  const trackedPdfs = listGitFiles('*.pdf');
  if (trackedPdfs.length) {
    fail(`PDFs must not be committed. Remove these tracked PDFs:\n- ${trackedPdfs.join('\n- ')}`);
  } else {
    ok('No tracked PDFs');
  }

  const trackedZoneIds = listGitFiles('*Zone.Identifier');
  if (trackedZoneIds.length) {
    fail(`Windows Zone.Identifier artifacts must not be committed:\n- ${trackedZoneIds.join('\n- ')}`);
  } else {
    ok('No tracked Zone.Identifier artifacts');
  }

  // Docs entrypoint + required folders
  const docsDir = path.join(repoRoot, 'docs');
  if (!exists(path.join(docsDir, 'README.md'))) fail('Missing docs/README.md');
  if (!exists(path.join(docsDir, 'solutions', 'README.md'))) fail('Missing docs/solutions/README.md');

  const requiredDocDirs = [
    'architecture',
    'blueprints',
    'handoff',
    'specs',
    'Specifications',
    'solutions',
  ];
  for (const dir of requiredDocDirs) {
    ensureReadmeInDir(path.join(docsDir, dir));
  }
  ok('Docs directory structure looks present');

  // Specs metadata
  const specFiles = listGitFiles('docs/specs/**/*.md').filter(
    (file) => !file.endsWith('/README.md') && !file.endsWith('/TEMPLATE.md'),
  );
  for (const specPath of specFiles) {
    assertSpecsHaveMetadata(path.join(repoRoot, specPath));
  }
  ok('Specs metadata present');

  // Keep repo root clean of ad-hoc docs (reduces discoverability drift)
  const rootAllowlist = new Set(['README.md', 'AGENTS.md']);
  const rootMarkdown = listGitRootMarkdown().filter((file) => !rootAllowlist.has(file));
  if (rootMarkdown.length) {
    fail(
      `Unexpected root-level markdown files (move into docs/ or docs/handoff/legacy/):\n- ${rootMarkdown.join(
        '\n- ',
      )}`,
    );
  } else {
    ok('No unexpected root-level markdown files');
  }

  if (process.exitCode) process.exit(process.exitCode);
  ok('docs:lint passed');
}

main();
