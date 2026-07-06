import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('source dashboard shell lock', () => {
  it('keeps source dashboard as the approved report-paper source-file shell', () => {
    const dashboardSource = readRepoFile('src/app/source-dashboard/page.tsx');

    expect(dashboardSource).toContain('SOURCE DASHBOARD');
    expect(dashboardSource).toContain('UPRISE');
    expect(dashboardSource).toContain('Exit to Listener Account');
    expect(dashboardSource).toContain('SourceAccountSwitcher');
    expect(dashboardSource).toContain('variant="command"');
    expect(dashboardSource).toContain('formatSourceMembershipRole(activeSource.membershipRole)');
    expect(dashboardSource).toContain('data-testid="source-command-role"');
    expect(dashboardSource).toContain('Selected source position: {roleLabel}');
    expect(dashboardSource).toContain('Profile');
    expect(dashboardSource).toContain('Release Deck');
    expect(dashboardSource).toContain('Release Metrics');
    expect(dashboardSource).toContain('Calendar / Print Shop');
    expect(dashboardSource).toContain('Source Record');
    expect(dashboardSource).toContain('Source File');
    expect(dashboardSource).toContain('UPRISE Source Record');
    expect(dashboardSource).toContain('Listener Account is active. Select one managed source account in the top command line before source tools operate.');
    expect(dashboardSource).toContain('No managed source accounts are attached to this signed-in user.');
    expect(dashboardSource).toContain('Stale source context was cleared because it no longer belongs to this signed-in user.');
    expect(dashboardSource).toContain('Stale source context was cleared because the selected source is no longer attached to this user.');
    expect(dashboardSource).toContain('Open Print Shop');
    expect(dashboardSource).toContain('UPRISE Registrar');
    expect(dashboardSource).not.toContain('Source-facing tools live here.');
    expect(dashboardSource).not.toContain('Open Metrics');
    expect(dashboardSource).not.toContain('Coming Soon');
    expect(dashboardSource).not.toContain('Upgrade');
    expect(dashboardSource).not.toContain('Subscribe');
    expect(dashboardSource).not.toContain('Buy');
  });

  it('keeps Release Deck caps explicit and keeps the paid ad attachment inactive', () => {
    const dashboardSource = readRepoFile('src/app/source-dashboard/page.tsx');
    const releaseDeckSource = readRepoFile('src/app/source-dashboard/release-deck/page.tsx');
    const releaseDeckValidationSource = readRepoFile('src/lib/source/release-deck-validation.ts');

    expect(dashboardSource).toContain('3 music slots');
    expect(dashboardSource).toContain('6 min / song');
    expect(dashboardSource).toContain('15 min source cap');
    expect(dashboardSource).toContain('URL-only MVP');
    expect(dashboardSource).toContain('Paid ad clip');
    expect(dashboardSource).toContain('inactive attachment concept');
    expect(dashboardSource).toContain('not a fourth music slot');
    expect(dashboardSource).toContain('Record clip');
    expect(dashboardSource).toContain('Payment account required before recording.');
    expect(releaseDeckSource).toContain('3 music slots');
    expect(releaseDeckSource).toContain('6 min / song');
    expect(releaseDeckSource).toContain('15 min source cap');
    expect(releaseDeckSource).toContain('URL-only MVP');
    expect(releaseDeckSource).toContain('Paid ad clip');
    expect(releaseDeckSource).toContain('inactive attachment concept');
    expect(releaseDeckSource).toContain('not a fourth music slot');
    expect(releaseDeckSource).toContain('Record clip');
    expect(releaseDeckSource).not.toContain('Music slots: 4');
    expect(releaseDeckValidationSource).toContain('releaseDeckMaxTrackSeconds = 6 * 60');
    expect(releaseDeckValidationSource).toContain('Release Deck tracks cannot exceed 6 minutes.');
    expect(releaseDeckValidationSource).toContain("status: 'ready'");
  });
});
