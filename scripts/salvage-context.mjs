#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const stateDir = path.join(repoRoot, 'docs', 'state');
const handoffDir = path.join(repoRoot, 'docs', 'handoff');
const snapshotPath = path.join(stateDir, 'current_context_snapshot.json');

function usage() {
  console.error(`Usage:
  pnpm run context:salvage -- snapshot --topic <topic> [options]

Options:
  --chat-name <name>
  --summary <text>
  --lock <text>         (repeatable)
  --open <text>         (repeatable)
  --drift <text>        (repeatable)
  --next <text>         (repeatable)
  --source-doc <path>   (repeatable)
  --handoff <path>      (repeatable)
`);
  process.exit(1);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function parseArgs(argv) {
  const args = { locks: [], openDecisions: [], driftCorrections: [], nextActions: [], sourceDocs: [], handoffPaths: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    const value = argv[i + 1];
    switch (token) {
      case '--topic':
        args.topic = value;
        i += 1;
        break;
      case '--chat-name':
        args.chatName = value;
        i += 1;
        break;
      case '--summary':
        args.summary = value;
        i += 1;
        break;
      case '--lock':
        args.locks.push(value);
        i += 1;
        break;
      case '--open':
        args.openDecisions.push(value);
        i += 1;
        break;
      case '--drift':
        args.driftCorrections.push(value);
        i += 1;
        break;
      case '--next':
        args.nextActions.push(value);
        i += 1;
        break;
      case '--source-doc':
        args.sourceDocs.push(value);
        i += 1;
        break;
      case '--handoff':
        args.handoffPaths.push(value);
        i += 1;
        break;
      default:
        console.error(`Unknown argument: ${token}`);
        usage();
    }
  }
  return args;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeSnapshot(snapshot) {
  ensureDir(stateDir);
  fs.writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);
}

function writeHandoff(snapshot) {
  ensureDir(handoffDir);
  const date = snapshot.date;
  const topicSlug = slugify(snapshot.topic || 'context-snapshot');
  const handoffPath = path.join(handoffDir, `${date}_context-snapshot-${topicSlug}.md`);
  const lines = [
    `# Context Snapshot — ${snapshot.topic}`,
    '',
    `Date: ${snapshot.date}  `,
    `Owner: Codex`,
    ''
  ];

  if (snapshot.chat_name) {
    lines.push(`External chat name: ${snapshot.chat_name}`, '');
  }
  if (snapshot.summary) {
    lines.push('## Summary', `- ${snapshot.summary}`, '');
  }
  const sections = [
    ['Locked', snapshot.locks],
    ['Open Decisions', snapshot.open_decisions],
    ['Drift Corrections', snapshot.drift_corrections],
    ['Next Actions', snapshot.next_actions],
    ['Source Docs', snapshot.source_docs],
    ['Related Handoffs', snapshot.handoff_paths]
  ];

  for (const [title, items] of sections) {
    if (!items.length) continue;
    lines.push(`## ${title}`);
    for (const item of items) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  fs.writeFileSync(handoffPath, `${lines.join('\n')}\n`);
  return path.relative(repoRoot, handoffPath);
}

const [command, ...rest] = process.argv.slice(2);
if (command !== 'snapshot') {
  usage();
}

const parsed = parseArgs(rest);
if (!parsed.topic) {
  console.error('Missing required --topic');
  usage();
}

const date = new Date().toISOString().slice(0, 10);
const snapshot = {
  date,
  topic: parsed.topic,
  chat_name: parsed.chatName || '',
  summary: parsed.summary || '',
  locks: parsed.locks,
  open_decisions: parsed.openDecisions,
  drift_corrections: parsed.driftCorrections,
  next_actions: parsed.nextActions,
  source_docs: parsed.sourceDocs,
  handoff_paths: parsed.handoffPaths
};

writeSnapshot(snapshot);
const generatedHandoff = writeHandoff(snapshot);

console.log(
  JSON.stringify(
    {
      snapshot: path.relative(repoRoot, snapshotPath),
      handoff: generatedHandoff
    },
    null,
    2
  )
);
