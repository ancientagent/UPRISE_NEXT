#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const QUEUE_DIR = path.join(ROOT, '.reliant/queue');

const INPUT_PATTERN = /^mvp-slices.*\.json$/;

const LANES = [
  { key: 'lane-a-api-core', output: 'mvp-lane-a-api-core.json' },
  { key: 'lane-b-web-contract', output: 'mvp-lane-b-web-contract.json' },
  { key: 'lane-c-code-invite', output: 'mvp-lane-c-code-invite.json' },
  { key: 'lane-d-automation', output: 'mvp-lane-d-automation.json' },
  { key: 'lane-e-qa-doc-review', output: 'mvp-lane-e-qa-doc-review.json' },
];

function nowIso() {
  return new Date().toISOString();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function laneForTask(task) {
  const id = String(task.id || '');

  if (/^SLICE-(QUEUE|AUTO)-/i.test(id)) return 'lane-d-automation';
  if (/^SLICE-(QA|REVIEW|DOC)-/i.test(id) || /^SLICE-REGISTRAR-DOC-/i.test(id)) {
    return 'lane-e-qa-doc-review';
  }
  if (/^SLICE-(CODE|INVITE)-/i.test(id)) return 'lane-c-code-invite';
  if (/WEB|CONTRACT/i.test(id)) return 'lane-b-web-contract';
  return 'lane-a-api-core';
}

function buildQueue(tasks, laneKey, sourceFiles) {
  return {
    version: 1,
    generatedAt: nowIso(),
    lane: laneKey,
    sourceFiles,
    summary: {
      total: tasks.length,
      queued: tasks.length,
      in_progress: 0,
      done: 0,
      blocked: 0,
    },
    tasks,
  };
}

function main() {
  const files = fs.readdirSync(QUEUE_DIR).filter((f) => INPUT_PATTERN.test(f)).sort();
  if (!files.length) {
    console.error('No mvp-slices*.json queue files found.');
    process.exit(1);
  }

  const laneBuckets = new Map(LANES.map((l) => [l.key, []]));
  const seen = new Set();

  for (const file of files) {
    const queuePath = path.join(QUEUE_DIR, file);
    const queue = readJson(queuePath);
    const tasks = Array.isArray(queue.tasks) ? queue.tasks : [];

    for (const task of tasks) {
      if (task.status !== 'queued') continue;
      if (!task.id) continue;
      if (seen.has(task.id)) continue;
      seen.add(task.id);

      const lane = laneForTask(task);
      laneBuckets.get(lane).push({
        ...task,
        status: 'queued',
        sourceQueue: file,
      });
    }
  }

  for (const lane of LANES) {
    const outPath = path.join(QUEUE_DIR, lane.output);
    const laneTasks = laneBuckets.get(lane.key);
    writeJson(outPath, buildQueue(laneTasks, lane.key, files));
  }

  const summary = LANES.map((lane) => {
    const count = laneBuckets.get(lane.key).length;
    return `${lane.output}: ${count}`;
  }).join('\n');

  process.stdout.write(`Lane queues generated from queued tasks:\n${summary}\n`);
}

main();
