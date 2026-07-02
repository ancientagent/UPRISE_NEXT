#!/usr/bin/env node
import { mkdir, readlink, rm, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

function usage() {
  console.error(`Usage: scripts/agent-bridge/windows-artifact-dir.mjs SLUG

Creates a Windows-backed artifact directory for user-visible files generated
from WSL agents, plus an ignored repo-local pointer at tmp/windows-artifacts.

Environment:
  UPRISE_WINDOWS_ARTIFACT_ROOT  Override base directory
                               (default: /mnt/c/Users/baris/uprise-agent-artifacts)
`);
}

const slug = process.argv[2];
if (!slug || slug === '-h' || slug === '--help' || process.argv.length > 3) {
  usage();
  process.exit(slug && slug !== '-h' && slug !== '--help' ? 2 : 0);
}

const safeSlug = slug
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9._-]+/g, '-')
  .replace(/^-+|-+$/g, '');

if (!safeSlug) {
  console.error('Artifact slug must contain at least one letter or number.');
  process.exit(2);
}

const repoRoot = process.cwd();
const baseDir = process.env.UPRISE_WINDOWS_ARTIFACT_ROOT || '/mnt/c/Users/baris/uprise-agent-artifacts';
const artifactDir = path.join(baseDir, safeSlug);
const repoLink = path.join(repoRoot, 'tmp', 'windows-artifacts');
const repoLinkedDir = path.join(repoLink, safeSlug);

function toWindowsPath(posixPath) {
  const match = posixPath.match(/^\/mnt\/([a-zA-Z])\/(.*)$/);
  if (!match) return '';
  return `${match[1].toUpperCase()}:\\${match[2].replaceAll('/', '\\')}`;
}

await mkdir(artifactDir, { recursive: true });
await mkdir(path.dirname(repoLink), { recursive: true });

try {
  const existing = await readlink(repoLink).catch(() => null);
  if (existing !== baseDir) {
    await rm(repoLink, { recursive: true, force: true });
    await symlink(baseDir, repoLink, 'dir');
  }
} catch {
  // Symlink creation is a convenience. The Windows-backed directory above is the contract.
}

await writeFile(path.join(artifactDir, 'README.txt'), [
  'UPRISE agent artifact directory',
  '',
  'Use this folder for user-visible files generated from WSL agents:',
  '- screenshots',
  '- HTML previews',
  '- Markdown reports that should be viewed from Windows',
  '- logs or bundles the user needs to inspect outside the repo',
  '',
  'This folder makes files Windows-visible. It does not force Codex native artifact-viewer rendering.',
  'Do not commit generated artifacts back to the repo unless explicitly requested.',
  '',
].join('\n'));

const windowsPath = toWindowsPath(artifactDir);
const windowsBase = toWindowsPath(baseDir);

console.log(`ARTIFACT_DIR_WSL=${artifactDir}`);
if (windowsPath) console.log(`ARTIFACT_DIR_WINDOWS=${windowsPath}`);
console.log(`REPO_POINTER_WSL=${repoLinkedDir}`);
if (windowsBase) console.log(`REPO_POINTER_WINDOWS=${windowsBase}\\${safeSlug}`);
console.log('');
console.log('Agent instruction: write user-visible artifacts here and report both the WSL path and Windows path.');
console.log('Note: use a native Codex artifact/render tool separately if in-app viewer rendering is required.');
