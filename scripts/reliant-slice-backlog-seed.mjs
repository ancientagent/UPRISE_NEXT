#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const QUEUE_DIR = path.join(ROOT, '.reliant', 'queue');
const NOW = new Date().toISOString();

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function queueDoc(laneKey, tasks) {
  return {
    version: 1,
    generatedAt: NOW,
    lane: laneKey,
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

function makeTask({ id, title, prompt, verifyCommand }) {
  return {
    id,
    title,
    prompt,
    verifyCommand,
    status: 'queued',
    updatedAt: NOW,
    sourceQueue: 'mvp-slices-batch8-throughput-seed.json',
  };
}

function mkIds(start, count) {
  return Array.from({ length: count }, (_, i) => start + i);
}

function buildLaneA() {
  const ids = mkIds(171, 15);
  return ids.map((n, idx) =>
    makeTask({
      id: `SLICE-API-${n}A`,
      title: `Registrar API read-path parity hardening pack ${idx + 1}`,
      prompt:
        'Execute one MVP slice only: tighten existing registrar API read-path service/controller parity (ownership/not-found/type guards, mapping consistency) with targeted tests only. No new endpoints, no schema changes, no UI changes.',
      verifyCommand:
        'pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts && pnpm --filter api typecheck && pnpm --filter web typecheck',
    }),
  );
}

function buildLaneB() {
  const ids = mkIds(186, 15);
  return ids.map((n, idx) =>
    makeTask({
      id: `SLICE-WEB-${n}A`,
      title: `Registrar web contract/client test hardening pack ${idx + 1}`,
      prompt:
        'Execute one MVP slice only: strengthen existing registrar web typed client/contract tests (list/detail/read scaffolds) for empty-data, nullability, and shape assertions. Contract-only; no new UI actions/CTAs and no API behavior expansion.',
      verifyCommand:
        'pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- registrar-client.test.ts registrar-contract-inventory.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck',
    }),
  );
}

function buildLaneC() {
  const ids = mkIds(201, 15);
  return ids.map((n, idx) =>
    makeTask({
      id: `SLICE-CODEINV-${n}A`,
      title: `Registrar code/invite contract parity batch ${idx + 1}`,
      prompt:
        'Execute one MVP slice only: harden existing registrar code/invite read/verify/redeem contract parity through targeted service/controller/web tests and docs sync only. No new flows/endpoints/schema changes.',
      verifyCommand:
        'pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts && pnpm --filter web test -- registrar-client.test.ts registrar-contract-inventory.test.ts && pnpm --filter api typecheck && pnpm --filter web typecheck',
    }),
  );
}

function buildLaneD() {
  const ids = mkIds(216, 15);
  return ids.map((n, idx) =>
    makeTask({
      id: `SLICE-AUTO-${n}A`,
      title: `Queue/orchestrator reliability automation hardening ${idx + 1}`,
      prompt:
        'Execute one MVP slice only: improve queue/orchestrator runtime reliability tooling (diagnostics, safety checks, deterministic transitions, docs/runbook guidance) without changing product API/UI behavior.',
      verifyCommand:
        'pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck',
    }),
  );
}

function buildLaneE() {
  const ids = mkIds(231, 15);
  return ids.map((n, idx) =>
    makeTask({
      id: `SLICE-QAREV-${n}A`,
      title: `QA/docs/review consolidation cycle ${idx + 1}`,
      prompt:
        'Execute one MVP slice only: run required consolidated validation gates, update changelog/spec implemented-now wording as needed, and publish dated handoff with exact command outputs and risk/rollback notes. No behavior changes unless failing gate requires minimal fix.',
      verifyCommand:
        'pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts && pnpm --filter web test -- registrar-client.test.ts registrar-contract-inventory.test.ts && pnpm --filter api typecheck && pnpm --filter web typecheck',
    }),
  );
}

function main() {
  const lanes = [
    { key: 'lane-a-api-core', file: 'mvp-lane-a-api-core-backlog.json', tasks: buildLaneA() },
    { key: 'lane-b-web-contract', file: 'mvp-lane-b-web-contract-backlog.json', tasks: buildLaneB() },
    { key: 'lane-c-code-invite', file: 'mvp-lane-c-code-invite-backlog.json', tasks: buildLaneC() },
    { key: 'lane-d-automation', file: 'mvp-lane-d-automation-backlog.json', tasks: buildLaneD() },
    { key: 'lane-e-qa-doc-review', file: 'mvp-lane-e-qa-doc-review-backlog.json', tasks: buildLaneE() },
  ];

  for (const lane of lanes) {
    writeJson(path.join(QUEUE_DIR, lane.file), queueDoc(lane.key, lane.tasks));
  }

  const summary = lanes.map((l) => `${l.file}: ${l.tasks.length}`).join('\n');
  process.stdout.write(`Seeded backlog queues:\n${summary}\n`);
}

main();
