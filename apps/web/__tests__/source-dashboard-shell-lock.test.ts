import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('source dashboard shell lock', () => {
  it('keeps source dashboard as the explicit source-side shell', () => {
    const dashboardSource = readRepoFile('src/app/source-dashboard/page.tsx');

    expect(dashboardSource).toContain('Source Dashboard');
    expect(dashboardSource).toContain('Source-facing tools live here.');
    expect(dashboardSource).toContain('Release Deck');
    expect(dashboardSource).toContain('Source Profile');
    expect(dashboardSource).toContain('Print Shop');
    expect(dashboardSource).toContain('Home Scene: {homeSceneLabel}');
    expect(dashboardSource).toContain("GPS: {gpsVerified ? 'verified' : 'pending'}");
    expect(dashboardSource).toContain("Promoter capability: {promoterCapabilityGranted ? 'active' : 'inactive'}");
    expect(dashboardSource).toContain('Promoter capability is active');
    expect(dashboardSource).toContain('GPS verification is still required before promoter capability can progress in Registrar.');
    expect(dashboardSource).toContain('Registrar');
    expect(dashboardSource).toContain('Review ${formatArtistBandEntityType(activeSource.entityType)} filings');
    expect(dashboardSource).toContain('member sync work, and capability-code progress');
    expect(dashboardSource).toContain('Return to Listener Account');
    expect(dashboardSource).toContain('Open Release Deck');
    expect(dashboardSource).toContain("Link href=\"/print-shop\"");
  });

  it('keeps Release Deck caps explicit and keeps the paid ad slot out of music-slot runtime', () => {
    const releaseDeckSource = readRepoFile('src/app/source-dashboard/release-deck/page.tsx');
    const releaseDeckValidationSource = readRepoFile('src/lib/source/release-deck-validation.ts');

    expect(releaseDeckSource).toContain('Music upload capacity remains capped at three songs, six minutes per song, and 15 minutes total');
    expect(releaseDeckSource).toContain('paid ad slot stays outside the current runtime');
    expect(releaseDeckSource).toContain('Music slots: 3');
    expect(releaseDeckSource).toContain('Single cap: 6 min');
    expect(releaseDeckSource).toContain('Source cap: 15 min');
    expect(releaseDeckSource).toContain('Paid ad slot: defined, not active here');
    expect(releaseDeckSource).not.toContain('Music slots: 4');
    expect(releaseDeckSource).not.toContain('fourth music slot');
    expect(releaseDeckValidationSource).toContain('releaseDeckMaxTrackSeconds = 6 * 60');
    expect(releaseDeckValidationSource).toContain('Release Deck tracks cannot exceed 6 minutes.');
    expect(releaseDeckValidationSource).toContain("status: 'ready'");
  });
});
