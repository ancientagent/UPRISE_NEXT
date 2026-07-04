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
  assert.equal(status.nextNodeId, 'dev_spec');
  assert.match(status.nextSignal, /dev_spec/);
}

{
  const root = tmpRoot();
  scaffoldPackage(root, 'demo-screen', {
    title: 'Demo Screen',
    ownerSpec: 'docs/specs/demo.md',
    lane: 'uprise-design-ui',
  });
  const first = writeNextTemplate(root, 'demo-screen');
  assert.deepEqual(first.wrote, ['spec/dev-spec.md']);
  write(root, 'demo-screen', 'design-spec/ux-plan.md', '# Design Spec\n');
  write(root, 'demo-screen', 'review/spec-package-review.md', 'Decision: pending\n');
  const status = inspectPackage(root, 'demo-screen');
  assert.equal(status.nextNodeId, 'spec_package_review');
  assert.equal(status.nodes.find((node) => node.id === 'spec_package_review').status, 'blocked_pending_pass');
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
  const next = writeNextTemplate(root, 'passed-screen');
  assert.deepEqual(next.wrote.sort(), ['implementation/implementation-plan.md', 'implementation/file-ownership.md'].sort());
  assert.equal(inspectPackage(root, 'passed-screen').nextNodeId, 'art_handoff');
}

console.log('[screen-package-flow:test] passed');
