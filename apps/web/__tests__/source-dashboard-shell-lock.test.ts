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
    expect(dashboardSource).toContain('Promoter capability is active');
    expect(dashboardSource).toContain('GPS verification is still required before promoter capability can progress in Registrar.');
    expect(dashboardSource).toContain('Registrar');
    expect(dashboardSource).toContain('Review ${formatArtistBandEntityType(activeSource.entityType)} filings');
    expect(dashboardSource).toContain('member sync work, and capability-code progress');
    expect(dashboardSource).toContain('Return to Listener Account');
    expect(dashboardSource).toContain('Open Release Deck');
    expect(dashboardSource).toContain("Link href=\"/print-shop\"");
  });
});
