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
    const sourceDashboardSource = readRepoFile('src/app/source-dashboard/page.tsx');

    expect(switcherSource).toContain('Source Accounts');
    expect(switcherSource).toContain('Switch account context');
    expect(switcherSource).toContain('Listener Account');
    expect(switcherSource).toContain('Stay signed into one account and switch into the source accounts you manage.');
    expect(switcherSource).toContain('currentUserId');
    expect(switcherSource).toContain('activeSourceUserId === currentUserId');
    expect(switcherSource).toContain('setActiveSourceId(source.id, currentUserId)');
    expect(sourceDashboardSource).toContain('SourceAccountSwitcher');
    expect(sourceDashboardSource).toContain("onSelectSource={() => router.push('/source-dashboard')}");
    expect(sourceDashboardSource).toContain('currentUserId={user?.id ?? null}');
    expect(plotSource).not.toContain('SourceAccountSwitcher');
    expect(plotSource).not.toContain("onSelectSource={() => router.push('/source-dashboard')}");
  });
});
