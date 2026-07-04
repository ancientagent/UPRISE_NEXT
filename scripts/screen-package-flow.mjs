#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const REQUIRED_SEED_FILES = ['README.md', 'instruction-packet.md', 'source-map.md'];

const WORKFLOW_NODES = [
  {
    id: 'package_seed',
    label: 'Package seed',
    files: REQUIRED_SEED_FILES,
    next: 'Create README.md, instruction-packet.md, and source-map.md.',
  },
  {
    id: 'dev_spec',
    label: 'Dev Spec',
    files: ['spec/dev-spec.md'],
    next: 'Write the Dev Spec from owner specs, runtime files, tests, stale paths, and validation requirements.',
    template: 'spec/dev-spec.md',
  },
  {
    id: 'design_spec',
    label: 'Design Spec',
    files: ['design-spec/ux-plan.md'],
    next: 'Write the Design Spec for UX/design-owned work without redefining product contracts.',
    template: 'design-spec/ux-plan.md',
  },
  {
    id: 'spec_package_review',
    label: 'Spec Package Review',
    files: ['review/spec-package-review.md'],
    passRequired: true,
    next: 'Review Dev Spec plus Design Spec together and record decision: pass before implementation.',
    template: 'review/spec-package-review.md',
  },
  {
    id: 'implementation_plan',
    label: 'Implementation Plan',
    files: ['implementation/implementation-plan.md', 'implementation/file-ownership.md'],
    next: 'Write implementation plan and file/surface ownership after spec package review passes.',
    template: 'implementation/implementation-plan.md',
  },
  {
    id: 'art_handoff',
    label: 'Art / Creative Handoff',
    files: ['art-handoff/creative-brief.md'],
    next: 'Create the art handoff only from the approved Design Spec.',
    template: 'art-handoff/creative-brief.md',
  },
  {
    id: 'integration_review',
    label: 'Integration Review',
    files: ['review/implementation-integration-review.md'],
    passRequired: true,
    next: 'Review integrated dev/design work and record decision: pass before hardening closeout.',
    template: 'review/implementation-integration-review.md',
  },
  {
    id: 'hardening_closeout',
    label: 'Hardening Closeout',
    files: ['hardening/closeout.md'],
    passRequired: true,
    next: 'Complete hardening, validation, docs/changelog/handoff checks, branch state, and PR metadata.',
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
  status    Print current gate state for a screen package.
  next      Print the next required gate; with --write, create its template if missing.
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

export function inspectPackage(root, slug) {
  const dir = packageDir(root, slug);
  const packageExists = fs.existsSync(dir);
  const nodes = WORKFLOW_NODES.map((node) => {
    const missing = packageExists ? node.files.filter((file) => !exists(dir, file)) : node.files;
    const filesPresent = missing.length === 0;
    const passSatisfied = !node.passRequired || node.files.some((file) => fileHasPass(dir, file));
    const status = filesPresent && passSatisfied ? 'complete' : filesPresent ? 'blocked_pending_pass' : 'missing';
    return { ...node, missing, status };
  });
  const nextNode = nodes.find((node) => node.status !== 'complete') ?? null;
  return {
    package: slug,
    packageDir: dir,
    packageExists,
    nodes,
    complete: packageExists && !nextNode,
    nextSignal: !packageExists
      ? 'Create package seed.'
      : nextNode
        ? `${nextNode.id}: ${nextNode.next}`
        : 'complete: package workflow gates are satisfied.',
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

function templateFor(relativePath, slug, title, ownerSpec = '<owner-spec>', lane = '<lane>') {
  const heading = title || slug.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
  const templates = {
    'README.md': `# ${heading} Screen Package\n\nStatus: active package seed\nPackage owner: current UPRISE implementation owner / Dev Team Manager\nOwner spec: \`${ownerSpec}\`\n\n## Purpose\n\nCoordinate Dev Spec, Design Spec, implementation, art, review, and hardening work for this major screen or flow.\n\nThis package is an execution workspace. Product truth remains in owner specs under \`docs/specs/**\`.\n`,
    'instruction-packet.md': `# Instruction Packet: ${heading}\n\nStatus: draft packet\nLane: \`${lane}\`\nOwner contract: \`${ownerSpec}\`\n\n## Goal\n\nDescribe the screen or flow outcome.\n\n## Must Read\n\n- \`AGENTS.md\`\n- \`docs/PLATFORM_START_HERE.md\`\n- \`docs/AGENT_STRATEGY_AND_HANDOFF.md\`\n- \`docs/agent-briefs/CONTEXT_ROUTER.md\`\n- \`${ownerSpec}\`\n\n## Runtime / Tests To Inspect\n\n- Add exact files before assigning agents.\n\n## Agent Outputs\n\n- Dev Spec Agent: \`spec/dev-spec.md\`\n- Design Spec Agent: \`design-spec/ux-plan.md\`\n- Reviewer: \`review/spec-package-review.md\`\n\n## Out Of Scope\n\n- No unapproved product actions, data contracts, auth rules, navigation, provider/db/schema changes, or one-off city/community/source behavior.\n\n## Validation Seed\n\n- \`pnpm run docs:lint\`\n- \`git diff --check\`\n\n## Stop Conditions\n\n- Owner spec does not authorize the proposed behavior.\n- Branch/HEAD or dirty worktree state cannot be verified.\n`,
    'source-map.md': `# Source Map: ${heading}\n\nStatus: draft package source map\n\n## Owner Specs\n\n- \`${ownerSpec}\`\n\n## Lane Briefs / Narrative\n\n- Add lane brief links.\n\n## Runtime Files\n\n- Add exact runtime files.\n\n## Tests / Locks\n\n- Add exact tests.\n\n## Handoffs / Founder Context\n\n- Add directly relevant handoffs only.\n`,
    'spec/dev-spec.md': `# Dev Spec: ${heading}\n\nStatus: draft\nOwner spec: \`${ownerSpec}\`\n\n## Runtime Trace\n\n- Current source of behavior:\n- Upstream producers/API/client/store/state:\n- Downstream screens/components/actions/tests:\n- Stale or parallel paths:\n\n## Implementation Scope\n\n- Build:\n- Do not build:\n\n## File / Surface Ownership\n\n- Dev-owned files:\n- Design-owned files:\n- Shared files requiring coordination:\n\n## Validation Seed\n\n- Focused tests:\n- Typecheck/lint:\n\n## Open Questions\n\n- None, or list product decisions that must stop implementation.\n`,
    'design-spec/ux-plan.md': `# Design Spec: ${heading}\n\nStatus: draft\nOwner spec: \`${ownerSpec}\`\n\n## UX Goals\n\n-\n\n## Screen Hierarchy\n\n-\n\n## States\n\n- Default:\n- Empty:\n- Error:\n- Loading:\n- Owner/member/public variations:\n\n## Accessibility / Responsive Behavior\n\n-\n\n## Art / Asset Needs\n\n-\n\n## Forbidden Design Moves\n\n- No invented actions, data contracts, auth rules, navigation, product doctrine, platform-trope imports, or unapproved placeholder CTAs.\n`,
    'review/spec-package-review.md': `# Spec Package Review: ${heading}\n\nStatus: draft\n\nDecision: pending\n\nSet \`Decision: pass\` only when Dev Spec plus Design Spec are ready for implementation.\n\n## Findings\n\n| Classification | Finding | Owner | Required Fix |\n| --- | --- | --- | --- |\n\n## Reviewed Inputs\n\n- \`instruction-packet.md\`\n- \`spec/dev-spec.md\`\n- \`design-spec/ux-plan.md\`\n`,
    'implementation/implementation-plan.md': `# Implementation Plan: ${heading}\n\nStatus: draft\n\n## Preconditions\n\n- Spec package review decision is pass.\n- File/surface ownership is documented.\n\n## Tasks\n\n1.\n\n## Validation\n\n-\n`,
    'implementation/file-ownership.md': `# File Ownership: ${heading}\n\nStatus: draft\n\n## Dev-Owned\n\n-\n\n## Design-Owned\n\n-\n\n## Shared / Coordination Required\n\n-\n`,
    'art-handoff/creative-brief.md': `# Creative Brief: ${heading}\n\nStatus: draft\nSource: approved Design Spec\n\n## Visual Direction\n\n-\n\n## Required Assets\n\n-\n\n## Constraints\n\n- Art is visual input, not product authority.\n`,
    'review/implementation-integration-review.md': `# Implementation Integration Review: ${heading}\n\nStatus: draft\n\nDecision: pending\n\nSet \`Decision: pass\` only when integrated dev/design work satisfies the approved specs, owner contracts, runtime behavior, and validation evidence.\n\n## Findings\n\n| Classification | Finding | Owner | Required Fix |\n| --- | --- | --- | --- |\n`,
    'hardening/closeout.md': `# Hardening Closeout: ${heading}\n\nStatus: draft\n\nDecision: pending\n\nSet \`Decision: pass\` only after validation, docs/changelog/handoff requirements, branch/worktree state, and PR metadata are complete.\n\n## Validation\n\n- Tests:\n- Typecheck:\n- Docs lint:\n- Diff check:\n\n## Remaining Risks\n\n-\n`,
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
  const node = status.nodes.find((candidate) => candidate.status !== 'complete');
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
  console.log(`Complete: ${status.complete ? 'yes' : 'no'}`);
  console.log(`Next signal: ${status.nextSignal}`);
  console.log('\n| Gate | Status | Missing |');
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
