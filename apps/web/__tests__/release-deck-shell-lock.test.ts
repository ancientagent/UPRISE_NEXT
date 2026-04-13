import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('release deck shell lock', () => {
  it('keeps release deck inside the source dashboard system', () => {
    const releaseDeckSource = readRepoFile('src/app/source-dashboard/release-deck/page.tsx');

    expect(releaseDeckSource).toContain('Back to Source Dashboard');
    expect(releaseDeckSource).toContain('Return to Listener Account');
    expect(releaseDeckSource).toContain('View Source Profile');
    expect(releaseDeckSource).toContain('Open Registrar');
    expect(releaseDeckSource).toContain('Current Context');
    expect(releaseDeckSource).toContain('Music slots: 3');
    expect(releaseDeckSource).toContain('Paid ad slot: defined, not active here');
    expect(releaseDeckSource).toContain('Release Deck operates from this source context.');
    expect(releaseDeckSource).toContain('Release Single');
    expect(releaseDeckSource).toContain('Audio File URL');
    expect(releaseDeckSource).toContain('createTrack(payload, token)');
  });
});
