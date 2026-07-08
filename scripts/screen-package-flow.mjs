#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const REQUIRED_SEED_FILES = ['README.md', 'instruction-packet.md', 'source-map.md'];

const REQUIRED_NODES = [
  {
    id: 'package_seed',
    label: 'Package seed',
    files: REQUIRED_SEED_FILES,
    next: 'Create README.md, instruction-packet.md, and source-map.md.',
  },
];

const OPTIONAL_ARTIFACTS = [
  {
    id: 'slice_contract',
    label: 'Slice Contract',
    files: ['implementation/slice-contract.md'],
    next: 'Create one short contract for the next vertical screen section only if it helps execution.',
    template: 'implementation/slice-contract.md',
  },
  {
    id: 'dev_spec',
    label: 'Dev Spec',
    files: ['spec/dev-spec.md'],
    next: 'Optional: write only when implementation risk needs a technical trace beyond the slice contract.',
    template: 'spec/dev-spec.md',
  },
  {
    id: 'design_spec',
    label: 'Design Spec',
    files: ['design-spec/ux-plan.md'],
    next: 'Optional: write only when visual/product-design direction is needed before implementation.',
    template: 'design-spec/ux-plan.md',
  },
  {
    id: 'spec_package_review',
    label: 'Spec Package Review',
    files: ['review/spec-package-review.md'],
    passRequired: true,
    next: 'Optional: review only when Dev/Design artifacts exist and risk justifies a package gate.',
    template: 'review/spec-package-review.md',
  },
  {
    id: 'art_handoff',
    label: 'Art / Creative Handoff',
    files: ['art-handoff/creative-brief.md'],
    next: 'Optional: create only after the user approves visual/art direction.',
    template: 'art-handoff/creative-brief.md',
  },
  {
    id: 'integration_review',
    label: 'Integration Review',
    files: ['review/implementation-integration-review.md'],
    passRequired: true,
    next: 'Optional: review integrated dev/design work when runtime or UX risk justifies it.',
    template: 'review/implementation-integration-review.md',
  },
  {
    id: 'hardening_closeout',
    label: 'Hardening Closeout',
    files: ['hardening/closeout.md'],
    passRequired: true,
    next: 'Optional: use for large/risky implementation closeout, not routine small slices.',
    template: 'hardening/closeout.md',
  },
];

function usage(exitCode = 0) {
  const out = exitCode === 0 ? console.log : console.error;
  out(`Usage:
  node scripts/screen-package-flow.mjs status --package <slug> [--json] [--root <path>]
  node scripts/screen-package-flow.mjs next --package <slug> [--write] [--root <path>]
  node scripts/screen-package-flow.mjs scaffold --package <slug> --title <title> --owner-spec <path> --lane <lane> [--root <path>]

Commands:
  status    Print required seed state plus optional artifact inventory.
  next      Print the next lightweight action; with --write, create a slice-contract template if missing.
  scaffold  Create a new package seed and standard folders.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  if (argv[0] === '--') argv = argv.slice(1);
  const [command, ...rest] = argv;
  if (!command || command === '--help' || command === '-h') usage(0);
  const args = { command, json: false, write: false, root: process.cwd() };
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === '--json') args.json = true;
    else if (arg === '--write') args.write = true;
    else if (arg === '--root') args.root = rest[++i];
    else if (arg === '--package') args.package = rest[++i];
    else if (arg === '--title') args.title = rest[++i];
    else if (arg === '--owner-spec') args.ownerSpec = rest[++i];
    else if (arg === '--lane') args.lane = rest[++i];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function packageDir(root, slug) {
  if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    throw new Error('Package slug must use lowercase letters, numbers, and hyphens.');
  }
  return path.join(root, 'docs', 'screen-packages', slug);
}

function exists(pkgDir, file) {
  return fs.existsSync(path.join(pkgDir, file));
}

function fileHasPass(pkgDir, file) {
  const full = path.join(pkgDir, file);
  if (!fs.existsSync(full)) return false;
  const text = fs.readFileSync(full, 'utf8');
  return /^decision:\s*pass\s*$/im.test(text) || /^\*\*decision:\*\*\s*pass\s*$/im.test(text);
}

function inspectNode(pkgDir, packageExists, node) {
  const missing = packageExists ? node.files.filter((file) => !exists(pkgDir, file)) : node.files;
  const filesPresent = missing.length === 0;
  const passSatisfied = !node.passRequired || node.files.some((file) => fileHasPass(pkgDir, file));
  const status = filesPresent && passSatisfied ? 'complete' : filesPresent ? 'blocked_pending_pass' : 'missing';
  return { ...node, missing, status };
}

export function inspectPackage(root, slug) {
  const dir = packageDir(root, slug);
  const packageExists = fs.existsSync(dir);
  const requiredNodes = REQUIRED_NODES.map((node) => inspectNode(dir, packageExists, node));
  const optionalNodes = OPTIONAL_ARTIFACTS.map((node) => inspectNode(dir, packageExists, node));
  const blockingNode = requiredNodes.find((node) => node.status !== 'complete') ?? null;
  const optionalSliceContract = optionalNodes.find((node) => node.id === 'slice_contract');
  const nextNode = blockingNode ?? (!optionalSliceContract || optionalSliceContract.status === 'complete' ? null : optionalSliceContract);
  return {
    package: slug,
    packageDir: dir,
    packageExists,
    nodes: [...requiredNodes, ...optionalNodes],
    requiredNodes,
    optionalNodes,
    complete: packageExists && !blockingNode,
    nextSignal: !packageExists
      ? 'Create package seed.'
      : blockingNode
        ? `${blockingNode.id}: ${blockingNode.next}`
        : optionalSliceContract?.status !== 'complete'
          ? 'ready_for_slice: choose one small vertical screen section; optionally create implementation/slice-contract.md.'
          : 'ready_for_slice: choose one small vertical screen section and implement with focused validation.',
    nextNodeId: nextNode?.id ?? null,
  };
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeIfMissing(file, content) {
  if (fs.existsSync(file)) return false;
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content);
  return true;
}

function titleFromSlug(slug) {
  return slug.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}

function templateFor(relativePath, slug, title, ownerSpec = '<owner-spec>', lane = '<lane>') {
  const heading = title || titleFromSlug(slug);
  const templates = {
    'README.md': `# ${heading} Screen Package\n\nStatus: active execution workspace\nPackage owner: current UPRISE implementation owner\nOwner spec: \`${ownerSpec}\`\n\n## Purpose\n\nCoordinate small vertical screen-section slices without turning temporary planning artifacts into product doctrine.\n\nThis package is an execution workspace. Product truth remains in owner specs under \`docs/specs/**\`.\n`,
    'instruction-packet.md': `# Instruction Packet: ${heading}\n\nStatus: active packet\nLane: \`${lane}\`\nOwner contract: \`${ownerSpec}\`\n\n## Goal\n\nDescribe the screen or flow outcome. Keep this packet short enough for an executor to use directly.\n\n## Must Read\n\n- \`AGENTS.md\`\n- \`docs/PLATFORM_START_HERE.md\`\n- \`docs/AGENT_STRATEGY_AND_HANDOFF.md\`\n- \`docs/agent-briefs/CONTEXT_ROUTER.md\`\n- \`${ownerSpec}\`\n\n## Runtime / Tests To Inspect\n\n- Add exact files before assigning work.\n\n## Default Execution Shape\n\n- One small vertical screen-section slice at a time.\n- One branch-owning executor.\n- Optional subagents only for bounded research, product design, or review sidecars.\n- One bounded review only when behavior/risk justifies it.\n\n## Out Of Scope\n\n- No unapproved product actions, data contracts, auth rules, navigation, provider/db/schema changes, or one-off city/community/source behavior.\n\n## Validation Seed\n\n- \`pnpm run docs:lint\`\n- \`git diff --check\`\n\n## Stop Conditions\n\n- Owner spec does not authorize the proposed behavior.\n- Branch/HEAD or dirty worktree state cannot be verified.\n`,
    'source-map.md': `# Source Map: ${heading}\n\nStatus: active package source map\n\n## Owner Specs\n\n- \`${ownerSpec}\`\n\n## Lane Briefs / Narrative\n\n- Add lane brief links.\n\n## Runtime Files\n\n- Add exact runtime files.\n\n## Tests / Locks\n\n- Add exact tests.\n\n## Handoffs / Founder Context\n\n- Add directly relevant handoffs only.\n`,
    'implementation/slice-contract.md': `# Slice Contract: ${heading}\n\nStatus: draft\nOwner spec: \`${ownerSpec}\`\n\n## Slice\n\nOne small vertical screen section or behavior.\n\n## Build\n\n-\n\n## Do Not Build\n\n-\n\n## Files Likely Touched\n\n-\n\n## Validation\n\n-\n\n## Review Needed\n\nreviewer_required: yes/no\nreason:\n`,
    'spec/dev-spec.md': `# Dev Spec: ${heading}\n\nStatus: optional draft\nOwner spec: \`${ownerSpec}\`\n\nUse this only when the slice needs a technical trace beyond \`implementation/slice-contract.md\`.\n`,
    'design-spec/ux-plan.md': `# Design Spec: ${heading}\n\nStatus: optional draft\nOwner spec: \`${ownerSpec}\`\n\nUse this only when the slice needs product-design direction before implementation.\n`,
    'review/spec-package-review.md': `# Spec Package Review: ${heading}\n\nStatus: optional draft\n\nDecision: pending\n\nUse this only when Dev Spec plus Design Spec both exist and risk justifies a package gate.\n`,
    'art-handoff/creative-brief.md': `# Creative Brief: ${heading}\n\nStatus: optional draft\n\nUse this only after the user approves visual/art direction. Art is visual input, not product authority.\n`,
    'review/implementation-integration-review.md': `# Implementation Integration Review: ${heading}\n\nStatus: optional draft\n\nDecision: pending\n\nUse this only for risky integrated dev/design work.\n`,
    'hardening/closeout.md': `# Hardening Closeout: ${heading}\n\nStatus: optional draft\n\nDecision: pending\n\nUse this only for large/risky implementation closeout. Routine small slices close out in the PR body.\n`,
  };
  return templates[relativePath] ?? `# ${heading}\n\nStatus: draft\n`;
}

export function scaffoldPackage(root, slug, options) {
  const dir = packageDir(root, slug);
  const title = options.title || slug;
  const ownerSpec = options.ownerSpec || '<owner-spec>';
  const lane = options.lane || '<lane>';
  const dirs = ['spec', 'design-spec', 'art-handoff', 'implementation', 'review', 'hardening'];
  ensureDir(dir);
  for (const subdir of dirs) ensureDir(path.join(dir, subdir));
  const created = [];
  for (const file of REQUIRED_SEED_FILES) {
    if (writeIfMissing(path.join(dir, file), templateFor(file, slug, title, ownerSpec, lane))) created.push(file);
  }
  return { package: slug, packageDir: dir, created };
}

export function writeNextTemplate(root, slug, options = {}) {
  const status = inspectPackage(root, slug);
  if (!status.packageExists) {
    throw new Error(`Package does not exist: ${status.packageDir}. Run scaffold first.`);
  }
  const node = status.nextNodeId
    ? status.nodes.find((candidate) => candidate.id === status.nextNodeId)
    : OPTIONAL_ARTIFACTS.find((candidate) => candidate.id === 'slice_contract');
  if (!node) return { wrote: [], status };
  if (node.status === 'blocked_pending_pass') return { wrote: [], status };
  const wrote = [];
  for (const file of node.files) {
    const full = path.join(status.packageDir, file);
    if (writeIfMissing(full, templateFor(file, slug, options.title, options.ownerSpec, options.lane))) wrote.push(file);
  }
  return { wrote, status: inspectPackage(root, slug) };
}

function printStatus(status, asJson) {
  if (asJson) {
    console.log(JSON.stringify(status, null, 2));
    return;
  }
  console.log(`# Screen Package Flow: ${status.package}`);
  console.log(`Package dir: ${status.packageDir}`);
  console.log(`Seed complete: ${status.complete ? 'yes' : 'no'}`);
  console.log(`Next signal: ${status.nextSignal}`);
  console.log('\n| Artifact | Status | Missing |');
  console.log('| --- | --- | --- |');
  for (const node of status.nodes) {
    console.log(`| ${node.label} | ${node.status} | ${node.missing.length ? node.missing.map((file) => `\`${file}\``).join(', ') : '-'} |`);
  }
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (!['status', 'next', 'scaffold'].includes(args.command)) usage(1);
    if (!args.package) throw new Error('--package is required.');
    if (args.command === 'scaffold') {
      if (!args.title || !args.ownerSpec || !args.lane) {
        throw new Error('scaffold requires --title, --owner-spec, and --lane.');
      }
      const result = scaffoldPackage(args.root, args.package, args);
      console.log(JSON.stringify(result, null, 2));
      return;
    }
    if (args.command === 'next') {
      if (args.write) {
        const result = writeNextTemplate(args.root, args.package, args);
        console.log(JSON.stringify({ wrote: result.wrote, nextSignal: result.status.nextSignal }, null, 2));
        return;
      }
      printStatus(inspectPackage(args.root, args.package), args.json);
      return;
    }
    printStatus(inspectPackage(args.root, args.package), args.json);
  } catch (error) {
    console.error(`[screen-package-flow] ${error.message}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
