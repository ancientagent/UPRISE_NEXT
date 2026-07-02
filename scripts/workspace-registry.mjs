#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const REGISTRY_PATH = path.join(process.cwd(), 'docs/operations/BRANCH_WORKSPACE_REGISTRY.md');
const START = '<!-- workspace-registry:start -->';
const END = '<!-- workspace-registry:end -->';
const HEADER = '| ID | Kind | Branch | Worktree / Path | PR / Linear | Base | HEAD | Status | Owner | Agents | What is on it | Last Updated | Closeout |';
const ALIGN = '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |';

function usage(exitCode = 1) {
  console.log(`Usage:
  node scripts/workspace-registry.mjs audit [--include-remote] [--strict-remote]
  node scripts/workspace-registry.mjs add --id ID --kind KIND --branch BRANCH --status STATUS --owner OWNER --agents AGENTS --scope SCOPE [--path PATH] [--pr PR] [--base BASE] [--head HEAD] [--updated YYYY-MM-DD] [--closeout TEXT]

Required add fields: id, kind, branch, status, owner, agents, scope.
Recommended kind values: primary, branch, worktree, preserved-branch, external-agent.
Recommended status values: active, open-pr, preserved, review-needed, merged, closed.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      out._.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      out[key] = true;
      continue;
    }
    out[key] = next;
    i += 1;
  }
  return out;
}

function sh(cmd, args, options = {}) {
  return execFileSync(cmd, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', options.ignoreStderr ? 'ignore' : 'pipe'],
  }).trim();
}

function git(args, options = {}) {
  return sh('git', args, options);
}

function cell(value) {
  const text = String(value ?? '').trim() || '-';
  return text.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

function rowFromEntry(entry) {
  return [
    entry.id,
    entry.kind,
    entry.branch,
    entry.path,
    entry.pr,
    entry.base,
    entry.head,
    entry.status,
    entry.owner,
    entry.agents,
    entry.scope,
    entry.updated,
    entry.closeout,
  ].map(cell);
}

function renderRow(entry) {
  return `| ${rowFromEntry(entry).join(' | ')} |`;
}

function loadRegistry() {
  if (!existsSync(REGISTRY_PATH)) {
    throw new Error(`Registry missing: ${REGISTRY_PATH}`);
  }
  const text = readFileSync(REGISTRY_PATH, 'utf8');
  const start = text.indexOf(START);
  const end = text.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Registry markers missing in ${REGISTRY_PATH}`);
  }
  const block = text.slice(start + START.length, end).trim();
  const entries = [];
  for (const line of block.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    if (trimmed === HEADER || trimmed === ALIGN) continue;
    const cols = trimmed.split('|').slice(1, -1).map((v) => v.trim().replace(/\\\|/g, '|'));
    if (cols.length < 13) continue;
    entries.push({
      id: cols[0],
      kind: cols[1],
      branch: cols[2],
      path: cols[3],
      pr: cols[4],
      base: cols[5],
      head: cols[6],
      status: cols[7],
      owner: cols[8],
      agents: cols[9],
      scope: cols[10],
      updated: cols[11],
      closeout: cols[12],
      raw: trimmed,
    });
  }
  return { text, start, end, entries };
}

function writeRegistry(registry, entries) {
  const table = [HEADER, ALIGN, ...entries.map(renderRow)].join('\n');
  const next = `${registry.text.slice(0, registry.start + START.length)}\n${table}\n${registry.text.slice(registry.end)}`;
  writeFileSync(REGISTRY_PATH, next);
}

function normalizeBranchName(value) {
  return String(value || '')
    .replace(/^refs\/heads\//, '')
    .replace(/^refs\/remotes\/origin\//, 'origin/')
    .trim();
}

function registryBranchSet(entries) {
  const activeStatuses = new Set(['active', 'open-pr', 'preserved', 'review-needed', 'primary']);
  const branches = new Set();
  for (const entry of entries) {
    if (!activeStatuses.has(entry.status)) continue;
    for (const part of entry.branch.split(',')) {
      const branch = normalizeBranchName(part.replace(/`/g, '').trim());
      if (branch && branch !== '-') branches.add(branch);
    }
  }
  return branches;
}

function listLocalBranches() {
  const output = git(['for-each-ref', '--format=%(refname:short)', 'refs/heads']);
  return output ? output.split('\n').map(normalizeBranchName).filter(Boolean) : [];
}

function listRemoteBranches() {
  const output = git(['for-each-ref', '--format=%(refname:short)', 'refs/remotes/origin']);
  return output
    ? output.split('\n')
        .map(normalizeBranchName)
        .filter((branch) => branch && branch !== 'origin/HEAD' && branch !== 'origin')
        .map((branch) => branch.replace(/^origin\//, ''))
    : [];
}

function listWorktrees() {
  const output = git(['worktree', 'list', '--porcelain']);
  const worktrees = [];
  let current = null;
  for (const line of output.split('\n')) {
    if (line.startsWith('worktree ')) {
      current = { path: line.slice('worktree '.length), branch: '' };
      worktrees.push(current);
    } else if (current && line.startsWith('branch ')) {
      current.branch = normalizeBranchName(line.slice('branch '.length));
    }
  }
  return worktrees;
}

function listOpenPrBranches() {
  try {
    const output = sh('gh', ['pr', 'list', '--state', 'open', '--limit', '100', '--json', 'headRefName'], { ignoreStderr: true });
    const parsed = JSON.parse(output || '[]');
    return parsed.map((pr) => pr.headRefName).filter(Boolean);
  } catch {
    return null;
  }
}

function audit(args) {
  const { entries } = loadRegistry();
  const registered = registryBranchSet(entries);
  const allowedUnregisteredLocal = new Set(['main']);
  const failures = [];
  const warnings = [];

  for (const branch of listLocalBranches()) {
    if (allowedUnregisteredLocal.has(branch)) continue;
    if (!registered.has(branch)) failures.push(`local branch not in registry: ${branch}`);
  }

  for (const wt of listWorktrees()) {
    if (!wt.branch) continue;
    if (!registered.has(wt.branch)) failures.push(`worktree branch not in registry: ${wt.branch} (${wt.path})`);
  }

  const prBranches = listOpenPrBranches();
  if (prBranches === null) {
    warnings.push('could not query open PRs with gh; skipped PR-head registry audit');
  } else {
    for (const branch of prBranches) {
      if (!registered.has(branch)) failures.push(`open PR head not in registry: ${branch}`);
    }
  }

  if (args['include-remote'] || args['strict-remote']) {
    for (const branch of listRemoteBranches()) {
      if (branch === 'main') continue;
      if (!registered.has(branch)) {
        const msg = `remote branch not in registry: origin/${branch}`;
        if (args['strict-remote']) failures.push(msg);
        else warnings.push(msg);
      }
    }
  }

  for (const warning of warnings) console.warn(`[workspace-registry] warning: ${warning}`);
  if (failures.length > 0) {
    for (const failure of failures) console.error(`[workspace-registry] missing: ${failure}`);
    console.error(`[workspace-registry] FAIL: update ${REGISTRY_PATH} before continuing.`);
    process.exit(1);
  }
  console.log(`[workspace-registry] OK: ${entries.length} registry entries cover local branches, worktrees, and open PR heads.`);
}

function add(args) {
  const required = ['id', 'kind', 'branch', 'status', 'owner', 'agents', 'scope'];
  for (const key of required) {
    if (!args[key]) throw new Error(`Missing required --${key}`);
  }
  const registry = loadRegistry();
  const today = new Date().toISOString().slice(0, 10);
  const entry = {
    id: args.id,
    kind: args.kind,
    branch: args.branch,
    path: args.path || '-',
    pr: args.pr || '-',
    base: args.base || 'main',
    head: args.head || safeHead(),
    status: args.status,
    owner: args.owner,
    agents: args.agents,
    scope: args.scope,
    updated: args.updated || today,
    closeout: args.closeout || 'update on PR/merge/close/delete',
  };
  const nextEntries = registry.entries.filter((existing) => existing.id !== entry.id);
  nextEntries.push(entry);
  writeRegistry(registry, nextEntries);
  console.log(`[workspace-registry] upserted ${entry.id} in ${REGISTRY_PATH}`);
}

function safeHead() {
  try {
    return git(['rev-parse', '--short', 'HEAD']);
  } catch {
    return '-';
  }
}

function main() {
  const [command, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  try {
    if (command === 'audit') return audit(args);
    if (command === 'add') return add(args);
    usage(command ? 1 : 0);
  } catch (error) {
    console.error(`[workspace-registry] ${error.message}`);
    process.exit(1);
  }
}

main();
