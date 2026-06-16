import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('source account switcher lock', () => {
  it('keeps the one-account source-context switcher language in the component', () => {
    const switcherSource = readRepoFile('src/components/source/SourceAccountSwitcher.tsx');
    const plotSource = readRepoFile('src/app/plot/page.tsx');

    expect(switcherSource).toContain('Source Accounts');
    expect(switcherSource).toContain('Switch account context');
    expect(switcherSource).toContain('Listener Account');
    expect(switcherSource).toContain('Stay signed into one account and switch into the source accounts you manage.');
    expect(plotSource).toContain("onSelectSource={() => router.push('/source-dashboard')}");
  });
});
