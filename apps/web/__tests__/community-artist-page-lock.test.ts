import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('community and artist wireframe page locks', () => {
  it('keeps the community page on the shared wireframe shell and preserves the Plot handoff CTA', () => {
    const communitySource = readRepoFile('src/app/community/[id]/page.tsx');

    expect(communitySource).toContain('plot-wire-page');
    expect(communitySource).toContain('plot-wire-frame');
    expect(communitySource).toContain('plot-wire-card');
    expect(communitySource).toContain('plot-wire-panel');
    expect(communitySource).toContain('Visit Scene in Plot');
  });

  it('keeps the artist page on the shared wireframe shell while preserving familiar profile sections', () => {
    const artistSource = readRepoFile('src/app/artist-bands/[id]/page.tsx');

    expect(artistSource).toContain('plot-wire-page');
    expect(artistSource).toContain('plot-wire-frame');
    expect(artistSource).toContain('plot-wire-card');
    expect(artistSource).toContain('const viewerCanOpenPrintShop = useMemo(() => {');
    expect(artistSource).toContain("profile.members.some((member) => member.userId === user.id)");
    expect(artistSource).toContain('const sourceContextMatchesProfile = activeSourceId === profile?.id;');
    expect(artistSource).toContain('Source Dashboard');
    expect(artistSource).toContain('Open Release Deck');
    expect(artistSource).toContain('Open Print Shop');
    expect(artistSource).toContain('Open Registrar');
    expect(artistSource).toContain("Opening source tools here will switch into this source account.");
    expect(artistSource).toContain('Source-owned release');
    expect(artistSource).toContain('Source-owned event');
    expect(artistSource).not.toContain('blastArtistBandSignal');
    expect(artistSource).not.toContain("{busyAction === 'blast' ? 'Blasting...' : 'Blast'}");
    expect(artistSource).toContain('Songs / Releases');
    expect(artistSource).toContain('Demo Songs');
    expect(artistSource).toContain('Play Demo');
    expect(artistSource).toContain('Collect');
    expect(artistSource).toContain('Demo timeline for');
    expect(artistSource).not.toContain('Play Single');
    expect(artistSource).toContain('Identity');
    expect(artistSource).toContain('Lineup');
    expect(artistSource).toContain('Upcoming and recent');
  });
});
