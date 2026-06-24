import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..', '..', '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('staging readiness smoke contract', () => {
  it('stays read-only and provider-state safe', () => {
    const script = readRepoFile('scripts/smoke-staging-readiness.mjs');

    expect(script).toContain("smoke: 'staging-readiness'");
    expect(script).toContain('writesApi: false');
    expect(script).toContain('writesDatabase: false');
    expect(script).toContain('mutatesProviderState: false');
    expect(script).not.toContain('/auth/register');
    expect(script).not.toContain("method: 'POST'");
    expect(script).not.toContain('PrismaClient');
  });

  it('checks the hosted API, PostGIS, optional web load, CORS, and Places behavior', () => {
    const script = readRepoFile('scripts/smoke-staging-readiness.mjs');

    expect(script).toContain("'/health/live'");
    expect(script).toContain("'/health/db'");
    expect(script).toContain("'/health/postgis'");
    expect(script).toContain("'/health/ready'");
    expect(script).toContain('web:load');
    expect(script).toContain('api:cors-preflight');
    expect(script).toContain('vercel.com/sso-api');
    expect(script).toContain('/places/reverse?latitude=30.2672&longitude=-97.7431&country=US');
    expect(script).toContain('/places/cities?input=Austin&country=us');
    expect(script).toContain('UPRISE_SKIP_PLACES_CHECK');
  });
});
