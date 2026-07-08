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
    const listenerProfileSource = readRepoFile('src/components/plot/PlotListenerProfile.tsx');
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
    expect(sourceDashboardSource).toContain('variant="command"');
    expect(plotSource).not.toContain('SourceAccountSwitcher');
    expect(listenerProfileSource).toContain('SourceAccountSwitcher');
    expect(listenerProfileSource).toContain('data-slot="profile-source-identity-access"');
    expect(listenerProfileSource).toContain('onSelectSource={onOpenSourceDashboard}');
    expect(listenerProfileSource).not.toContain('Release Deck');
    expect(listenerProfileSource).not.toContain('Print Shop');
  });

  it('keeps listener profile source identity access as a dashboard link, not embedded source tools', () => {
    const listenerProfileSource = readRepoFile('src/components/plot/PlotListenerProfile.tsx');
    const plotSource = readRepoFile('src/app/plot/page.tsx');
    const sourceDashboardSource = readRepoFile('src/app/source-dashboard/page.tsx');

    expect(listenerProfileSource).toContain('data-slot="profile-source-identity-access"');
    expect(listenerProfileSource).toContain('managedArtistBands.length > 0');
    expect(listenerProfileSource).toContain('onSelectSource={onOpenSourceDashboard}');
    expect(plotSource).toContain("onOpenSourceDashboard={() => router.push('/source-dashboard')}");

    expect(listenerProfileSource).not.toContain('/source-dashboard/release-deck');
    expect(listenerProfileSource).not.toContain('/print-shop');
    expect(listenerProfileSource).not.toContain('/registrar');
    expect(listenerProfileSource).not.toContain('Open Release Deck');
    expect(listenerProfileSource).not.toContain('Open Print Shop');
    expect(listenerProfileSource).not.toContain('Open Registrar');
    expect(listenerProfileSource).not.toContain('Message Artist');
    expect(listenerProfileSource).not.toContain('DM Artist');
    expect(listenerProfileSource).not.toContain('Contact Artist');

    expect(sourceDashboardSource).toContain('<Link href="/source-dashboard/release-deck">Load</Link>');
    expect(sourceDashboardSource).toContain('<Link href="/print-shop">Open Print Shop');
    expect(sourceDashboardSource).toContain('<Link href="/registrar"');
  });
});
