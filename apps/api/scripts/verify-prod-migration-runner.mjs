#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const apiRoot = resolve(new URL('..', import.meta.url).pathname);
const repoRoot = resolve(apiRoot, '..', '..');
const outDir = mkdtempSync(join(tmpdir(), 'uprise-api-prod-'));

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    encoding: 'utf8',
    stdio: options.stdio ?? 'pipe',
    env: process.env,
  });

  if (result.status !== 0) {
    throw new Error(
      [
        `${command} ${args.join(' ')} failed with exit ${result.status}`,
        result.stdout?.trim(),
        result.stderr?.trim(),
      ]
        .filter(Boolean)
        .join('\n')
    );
  }

  return result;
}

try {
  run('pnpm', ['--filter', 'api', 'deploy', '--prod', outDir], { stdio: 'pipe' });

  const prismaBin = join(outDir, 'node_modules', '.bin', 'prisma');
  if (!existsSync(prismaBin) || !statSync(prismaBin).isFile()) {
    throw new Error(`Production deploy is missing Prisma CLI at ${prismaBin}`);
  }

  const version = run(prismaBin, ['--version']);

  console.log(
    JSON.stringify(
      {
        check: 'api-prod-migration-runner',
        productionDeployDir: outDir,
        prismaCli: prismaBin,
        prismaVersion: version.stdout.trim(),
      },
      null,
      2
    )
  );
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
