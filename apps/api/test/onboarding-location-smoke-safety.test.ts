import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('onboarding location smoke safety contract', () => {
  it('keeps remote onboarding smoke writes behind an explicit host-scoped confirmation', () => {
    const script = readRepoFile('scripts/smoke-onboarding-location.mjs');

    expect(script).toContain('UPRISE_CONFIRM_ONBOARDING_SMOKE');
    expect(script).toContain('smoke-onboarding-location:${host}');
    expect(script).toContain('Refusing onboarding smoke writes against non-local API');
    expect(script).toContain('only after confirming API and DATABASE_URL target the intended staging environment');
  });

  it('keeps a dry-run path that does not write to API or database', () => {
    const script = readRepoFile('scripts/smoke-onboarding-location.mjs');

    expect(script).toContain("mode: 'dry-run'");
    expect(script).toContain('writesApi: false');
    expect(script).toContain('writesDatabase: false');
    expect(script).toContain('manual_austin_denied_gps');
    expect(script).toContain('gps_first_austin');
    expect(script).toContain('pioneer_el_paso_fallback');
  });
});
