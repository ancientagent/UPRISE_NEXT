import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('registrar source-context lock', () => {
  it('keeps registrar reachable from the source-side operating context without changing civic scope', () => {
    const registrarSource = readRepoFile('src/app/registrar/page.tsx');

    expect(registrarSource).toContain('Source Context');
    expect(registrarSource).toContain('Source Dashboard');
    expect(registrarSource).toContain('Registrar is being operated from your active source-side context.');
    expect(registrarSource).toContain('Filings still stay Home Scene bound');
    expect(registrarSource).toContain('No active source account selected');
    expect(registrarSource).toContain('Listener civic context');
  });
});
