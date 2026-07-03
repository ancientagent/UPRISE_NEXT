#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

function usage() {
  console.error(`Usage: scripts/agent-bridge/windows-artifact-dir.mjs SLUG

Creates a Windows-backed artifact directory for user-visible files generated
from WSL agents, plus an ignored repo-local pointer file under artifacts/.

Environment:
  UPRISE_WINDOWS_ARTIFACT_ROOT  Override base directory
                               (default: derived from Windows USERPROFILE under WSL)
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

if (!safeSlug || !/[a-z0-9]/.test(safeSlug) || safeSlug === '.' || safeSlug === '..') {
  console.error('Artifact slug must contain at least one letter or number.');
  process.exit(2);
}

const repoRoot = process.cwd();

function windowsPathToWslPath(windowsPath) {
  const normalized = windowsPath.trim().replace(/\r/g, '');
  const match = normalized.match(/^([a-zA-Z]):\\(.*)$/);
  if (!match) return '';
  return `/mnt/${match[1].toLowerCase()}/${match[2].replaceAll('\\', '/')}`;
}

function deriveDefaultBaseDir() {
  if (process.env.UPRISE_WINDOWS_ARTIFACT_ROOT) {
    return process.env.UPRISE_WINDOWS_ARTIFACT_ROOT;
  }

  try {
    const userProfile = execFileSync('cmd.exe', ['/C', 'echo', '%USERPROFILE%'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const wslUserProfile = windowsPathToWslPath(userProfile);
    if (wslUserProfile) return path.join(wslUserProfile, 'uprise-agent-artifacts');
  } catch {
    // Fall through to the explicit error below.
  }

  console.error('Could not derive Windows USERPROFILE. Set UPRISE_WINDOWS_ARTIFACT_ROOT to a Windows-mounted WSL path.');
  process.exit(2);
}

const baseDir = deriveDefaultBaseDir();
const resolvedBaseDir = path.resolve(baseDir);
const artifactDir = path.resolve(resolvedBaseDir, safeSlug);
if (!artifactDir.startsWith(`${resolvedBaseDir}${path.sep}`)) {
  console.error('Artifact slug resolved outside the artifact root.');
  process.exit(2);
}

const pointerDir = path.join(repoRoot, 'artifacts', 'windows-artifact-pointers');
const pointerFile = path.join(pointerDir, `${safeSlug}.env`);

function toWindowsPath(posixPath) {
  const match = posixPath.match(/^\/mnt\/([a-zA-Z])\/(.*)$/);
  if (!match) return '';
  return `${match[1].toUpperCase()}:\\${match[2].replaceAll('/', '\\')}`;
}

await mkdir(artifactDir, { recursive: true });
await mkdir(pointerDir, { recursive: true });

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

await writeFile(pointerFile, [
  `ARTIFACT_DIR_WSL=${artifactDir}`,
  windowsPath ? `ARTIFACT_DIR_WINDOWS=${windowsPath}` : '',
  `ARTIFACT_BASE_WSL=${baseDir}`,
  windowsBase ? `ARTIFACT_BASE_WINDOWS=${windowsBase}` : '',
  '',
].filter(Boolean).join('\n'));

console.log(`ARTIFACT_DIR_WSL=${artifactDir}`);
if (windowsPath) console.log(`ARTIFACT_DIR_WINDOWS=${windowsPath}`);
console.log(`REPO_POINTER_FILE_WSL=${pointerFile}`);
console.log('');
console.log('Agent instruction: write user-visible artifacts here and report both the WSL path and Windows path.');
console.log('Note: use a native Codex artifact/render tool separately if in-app viewer rendering is required.');
