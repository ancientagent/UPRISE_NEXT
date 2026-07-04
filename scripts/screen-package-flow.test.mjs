#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  inspectPackage,
  scaffoldPackage,
  writeNextTemplate,
} from './screen-package-flow.mjs';

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'uprise-screen-flow-'));
}

function write(root, slug, rel, text) {
  const full = path.join(root, 'docs', 'screen-packages', slug, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text);
}

{
  const root = tmpRoot();
  const result = scaffoldPackage(root, 'artist-profile-source-dashboard', {
    title: 'Artist Profile / Source Dashboard',
    ownerSpec: 'docs/specs/users/artist-profile-and-source-dashboard.md',
    lane: 'uprise-registrar-source',
  });
  assert.deepEqual(result.created.sort(), ['README.md', 'instruction-packet.md', 'source-map.md'].sort());
  const status = inspectPackage(root, 'artist-profile-source-dashboard');
  assert.equal(status.complete, true);
  assert.equal(status.nextNodeId, 'slice_contract');
  assert.match(status.nextSignal, /ready_for_slice/);
}

{
  const root = tmpRoot();
  scaffoldPackage(root, 'demo-screen', {
    title: 'Demo Screen',
    ownerSpec: 'docs/specs/demo.md',
    lane: 'uprise-design-ui',
  });
  const first = writeNextTemplate(root, 'demo-screen');
  assert.deepEqual(first.wrote, ['implementation/slice-contract.md']);
  assert.equal(inspectPackage(root, 'demo-screen').nextNodeId, null);
}

{
  const root = tmpRoot();
  scaffoldPackage(root, 'passed-screen', {
    title: 'Passed Screen',
    ownerSpec: 'docs/specs/passed.md',
    lane: 'uprise-design-ui',
  });
  write(root, 'passed-screen', 'spec/dev-spec.md', '# Dev Spec\n');
  write(root, 'passed-screen', 'design-spec/ux-plan.md', '# Design Spec\n');
  write(root, 'passed-screen', 'review/spec-package-review.md', 'Decision: pass\n');
  const status = inspectPackage(root, 'passed-screen');
  assert.equal(status.complete, true);
  assert.equal(status.optionalNodes.find((node) => node.id === 'spec_package_review').status, 'complete');
  assert.match(status.nextSignal, /ready_for_slice/);
}

console.log('[screen-package-flow:test] passed');
