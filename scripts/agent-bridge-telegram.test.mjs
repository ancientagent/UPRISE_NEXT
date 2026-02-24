#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  buildHelpText,
  compactSummaryText,
  computeClaimableTasks,
  parseBridgeCommand,
  parseTelegramList,
} from './agent-bridge-telegram-lib.mjs';

function testParseTelegramList() {
  assert.deepEqual(parseTelegramList(''), []);
  assert.deepEqual(parseTelegramList('  '), []);
  assert.deepEqual(parseTelegramList('1,2, 3 '), ['1', '2', '3']);
}

function testParseBridgeCommand() {
  assert.equal(parseBridgeCommand('hello'), null);
  assert.equal(parseBridgeCommand('/status').type, 'status');
  assert.equal(parseBridgeCommand('/status qa-ci').lane, 'qa-ci');
  assert.equal(parseBridgeCommand('/poll').type, 'poll');
  assert.equal(parseBridgeCommand('/claimable web-contracts').lane, 'web-contracts');

  const assignSimple = parseBridgeCommand('/assign P3-T1 api-schema Add migration');
  assert.equal(assignSimple.ok, true);
  assert.equal(assignSimple.type, 'assign');
  assert.equal(assignSimple.taskId, 'P3-T1');
  assert.equal(assignSimple.lane, 'api-schema');
  assert.equal(assignSimple.priority, 100);
  assert.equal(assignSimple.title, 'Add migration');
  assert.equal(assignSimple.dependsOn, null);

  const assignWithPriority = parseBridgeCommand('/assign P3-T2 qa-ci 250 Add tests --depends=P3-T1');
  assert.equal(assignWithPriority.ok, true);
  assert.equal(assignWithPriority.priority, 250);
  assert.equal(assignWithPriority.dependsOn, 'P3-T1');
  assert.equal(assignWithPriority.title, 'Add tests');

  const ack = parseBridgeCommand('/ack P3-T2 looks good');
  assert.equal(ack.type, 'ack');
  assert.equal(ack.taskId, 'P3-T2');
  assert.equal(ack.notes, 'looks good');

  const requeue = parseBridgeCommand('/requeue P3-T2 blocked by CI');
  assert.equal(requeue.type, 'requeue');
  assert.equal(requeue.reason, 'blocked by CI');

  const badAssign = parseBridgeCommand('/assign P3-T3 api-schema');
  assert.equal(badAssign.ok, false);

  const unknown = parseBridgeCommand('/does-not-exist');
  assert.equal(unknown.ok, false);
}

function testComputeClaimableTasks() {
  const tasks = [
    { id: 'A', lane: 'api-schema', status: 'done', dependsOn: [] },
    { id: 'B', lane: 'qa-ci', status: 'queued', dependsOn: ['A'] },
    { id: 'C', lane: 'qa-ci', status: 'queued', dependsOn: ['MISSING'] },
    { id: 'D', lane: 'qa-ci', status: 'in_progress', dependsOn: [] },
  ];

  const claimableAll = computeClaimableTasks(tasks);
  assert.equal(claimableAll.length, 1);
  assert.equal(claimableAll[0].id, 'B');

  const claimableQa = computeClaimableTasks(tasks, 'qa-ci');
  assert.equal(claimableQa.length, 1);
  assert.equal(claimableQa[0].id, 'B');

  const claimableWeb = computeClaimableTasks(tasks, 'web-contracts');
  assert.equal(claimableWeb.length, 0);
}

function testCompactSummaryText() {
  const text = compactSummaryText({
    summary: { total: 5, queued: 2, in_progress: 1, done: 2, blocked: 0 },
  });
  assert.equal(text, 'total=5 queued=2 in_progress=1 done=2 blocked=0');
}

function testHelpText() {
  const text = buildHelpText();
  assert.equal(text.includes('/status'), true);
  assert.equal(text.includes('/assign'), true);
  assert.equal(text.includes('/requeue'), true);
}

function main() {
  testParseTelegramList();
  testParseBridgeCommand();
  testComputeClaimableTasks();
  testCompactSummaryText();
  testHelpText();
}

main();
